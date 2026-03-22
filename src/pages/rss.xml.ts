import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const books = await getCollection('books');
  const sorted = [...books].sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );

  return rss({
    title: 'BookDigest',
    description: 'AI-powered concise book summaries & recommendations.',
    site: context.site!,
    items: sorted.map((book) => ({
      title: book.data.title,
      pubDate: book.data.date,
      description: book.data.summary,
      link: `/books/${book.slug}/`,
      customData: `<author>${book.data.author}</author>`,
    })),
    customData: `<language>en-us</language>`,
  });
}
