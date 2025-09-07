import { getCollection } from 'astro:content';

export async function GET() {
  const books = await getCollection('books');
  const items = books.map((b) => ({
    slug: b.slug,
    title: b.data?.title ?? '',
    author: b.data?.author ?? '',
    summary: b.data?.summary ?? '',
    cover: b.data?.cover ?? '',
    tags: Array.isArray(b.data?.tags) ? b.data?.tags : [],
    url: `/books/${b.slug}/`,
  }));

  return new Response(JSON.stringify({ items }), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=600',
    },
  });
}
