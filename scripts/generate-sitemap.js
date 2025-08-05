import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://bookdigest.club';
const CURRENT_DATE = new Date().toISOString().split('T')[0];

// Get all book content files
function getBookSlugs() {
  const booksDir = path.join(__dirname, '../src/content/books');
  try {
    const files = fs.readdirSync(booksDir);
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace('.md', ''));
  } catch (error) {
    console.log('No books directory found or empty');
    return [];
  }
}

// Get all static pages
function getStaticPages() {
  const pagesDir = path.join(__dirname, '../src/pages');
  const pages = [];
  
  // Add main pages
  const mainPages = ['index.astro', 'about.astro'];
  mainPages.forEach(page => {
    const pagePath = path.join(pagesDir, page);
    if (fs.existsSync(pagePath)) {
      const url = page === 'index.astro' ? '' : page.replace('.astro', '/');
      pages.push({
        url: `${SITE_URL}/${url}`,
        lastmod: CURRENT_DATE,
        changefreq: page === 'index.astro' ? 'weekly' : 'monthly',
        priority: page === 'index.astro' ? '1.0' : '0.8'
      });
    }
  });

  // Add books index page
  const booksIndexPath = path.join(pagesDir, 'books/index.astro');
  if (fs.existsSync(booksIndexPath)) {
    pages.push({
      url: `${SITE_URL}/books/`,
      lastmod: CURRENT_DATE,
      changefreq: 'weekly',
      priority: '0.9'
    });
  }

  return pages;
}

// Generate sitemap XML
function generateSitemap() {
  const staticPages = getStaticPages();
  const bookSlugs = getBookSlugs();
  
  // Add book pages
  const bookPages = bookSlugs.map(slug => ({
    url: `${SITE_URL}/books/${slug}/`,
    lastmod: CURRENT_DATE,
    changefreq: 'monthly',
    priority: '0.7'
  }));

  const allPages = [...staticPages, ...bookPages];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  allPages.forEach(page => {
    sitemap += `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  });

  sitemap += `
</urlset>`;

  return sitemap;
}

// Write sitemap to public directory
function writeSitemap() {
  const sitemap = generateSitemap();
  const outputPath = path.join(__dirname, '../public/sitemap.xml');
  
  fs.writeFileSync(outputPath, sitemap);
  console.log(`✅ Sitemap generated with ${getBookSlugs().length + getStaticPages().length} URLs`);
  console.log(`📍 Written to: ${outputPath}`);
}

// Run the script
writeSitemap();
