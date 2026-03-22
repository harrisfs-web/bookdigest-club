import { z, defineCollection } from "astro:content";

const books = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    author: z.string(),
    summary: z.string().max(160),
    tags: z.array(z.string()).nonempty(),
    isbn: z.string().regex(/^\d{9}[\dXx]|\d{13}$/), // 10- or 13-digit ISBN
    rating: z.number().min(0).max(5),
    cover: z.string().startsWith("/covers/"),
    date: z.date(),
    readMinutes: z.object({
      min: z.number(),
      max: z.number().optional()
    }).optional(),
    featured: z.boolean().optional(),
    keywords: z.array(z.string()).optional(),
    slug: z.string().optional(),
  }),
});

export const collections = { books };
