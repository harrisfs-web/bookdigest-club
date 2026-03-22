import type { CollectionEntry } from "astro:content";

type BookEntry = CollectionEntry<"books">;

export type BookCategory = {
  name: string;
  slug: string;
  count: number;
  books: BookEntry[];
};

export type BookCategoryLink = {
  name: string;
  slug: string;
};

export type RelatedBook = {
  book: BookEntry;
  sharedCategories: BookCategoryLink[];
  score: number;
};

type CategoryDefinition = {
  name: string;
  slug: string;
  tags: string[];
};

const CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  {
    name: "Psychology & Behavior",
    slug: "psychology-behavior",
    tags: ["Psychology", "Behavior", "Behavioral Economics", "Decision-Making", "Morality"],
  },
  {
    name: "Philosophy & Meaning",
    slug: "philosophy-meaning",
    tags: ["Philosophy", "Existentialism", "Ethics", "Stoicism"],
  },
  {
    name: "History & Society",
    slug: "history-society",
    tags: ["History", "Anthropology", "Civilization", "Politics", "Development", "Geography", "Global Health"],
  },
  {
    name: "Economics & Finance",
    slug: "economics-finance",
    tags: ["Economics", "Finance", "Investing", "Macroeconomics"],
  },
  {
    name: "Business & Innovation",
    slug: "business-innovation",
    tags: ["Business", "Innovation", "Startups", "Technology", "Productivity"],
  },
  {
    name: "Science & Systems",
    slug: "science-systems",
    tags: ["Science", "Physics", "Evolution", "Biology", "Genetics", "Data Science", "Systems Thinking", "Risk"],
  },
  {
    name: "Literature & Fiction",
    slug: "literature-fiction",
    tags: ["Fiction", "Classic Fiction", "Classics", "Literature", "Russian Literature", "Academia"],
  },
  {
    name: "Personal Growth",
    slug: "personal-growth",
    tags: ["Personal Development", "Mental Models", "Memoir"],
  },
  {
    name: "World Affairs",
    slug: "world-affairs",
    tags: ["Geopolitics", "Middle East", "Conflict Resolution", "Non-fiction"],
  },
];

const TAG_TO_CATEGORY = new Map(
  CATEGORY_DEFINITIONS.flatMap((category) => category.tags.map((tag) => [tag, category] as const))
);

function compareBooks(a: BookEntry, b: BookEntry) {
  const ratingDifference = (b.data.rating ?? 0) - (a.data.rating ?? 0);
  if (ratingDifference !== 0) return ratingDifference;

  const dateDifference = b.data.date.getTime() - a.data.date.getTime();
  if (dateDifference !== 0) return dateDifference;

  return a.data.title.localeCompare(b.data.title);
}

function createBaseSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "category";
}

export function getBookPath(slug: string) {
  return `/books/${slug}/`;
}

export function getCategoryPath(categorySlug: string) {
  return `/books/category/${categorySlug}/`;
}

export function getBookCategoryLinks(book: BookEntry) {
  const seen = new Set<string>();

  return book.data.tags.flatMap((tag) => {
    const category = TAG_TO_CATEGORY.get(tag);
    if (!category || seen.has(category.slug)) {
      return [];
    }

    seen.add(category.slug);

    return [{
      name: category.name,
      slug: category.slug,
    } satisfies BookCategoryLink];
  });
}

export function getBookCategories(books: BookEntry[]) {
  return CATEGORY_DEFINITIONS.map((category) => {
    const categoryBooks = books.filter((book) =>
      getBookCategoryLinks(book).some((bookCategory) => bookCategory.slug === category.slug)
    );

    return {
      name: category.name,
      slug: category.slug || createBaseSlug(category.name),
      count: categoryBooks.length,
      books: [...categoryBooks].sort(compareBooks),
    } satisfies BookCategory;
  }).filter((category) => category.count > 0);
}

export function getTopBookCategories(books: BookEntry[], limit = 6) {
  return getBookCategories(books).slice(0, limit);
}

export function findBookCategoryBySlug(books: BookEntry[], categorySlug: string) {
  return getBookCategories(books).find((category) => category.slug === categorySlug);
}

export function getRelatedBooks(books: BookEntry[], currentBook: BookEntry, limit = 3) {
  const currentCategories = getBookCategoryLinks(currentBook);

  return books
    .filter((book) => book.slug !== currentBook.slug)
    .map((book) => {
      const sharedCategories = getBookCategoryLinks(book).filter((category) =>
        currentCategories.some((currentCategory) => currentCategory.slug === category.slug)
      );

      return {
        book,
        sharedCategories,
        score: sharedCategories.length,
      } satisfies RelatedBook;
    })
    .sort((a, b) => {
      const scoreDifference = b.score - a.score;
      if (scoreDifference !== 0) return scoreDifference;
      return compareBooks(a.book, b.book);
    })
    .slice(0, limit);
}