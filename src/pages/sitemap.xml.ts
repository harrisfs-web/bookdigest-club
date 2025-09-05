import type { APIRoute } from 'astro';

export const prerender = true;

// Serve a tiny sitemap index so /sitemap.xml returns 200
export const GET: APIRoute = async () => {
	const body = `<?xml version="1.0" encoding="UTF-8"?>\n` +
		`<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
		`<sitemap><loc>https://bookdigest.club/sitemap-0.xml</loc></sitemap>` +
		`</sitemapindex>`;
	return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
