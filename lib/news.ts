import type { NewsPost, NewsPostMeta } from "./news.constants";
import generatedNews from "./news-data.generated.json";

export type { NewsPost, NewsPostMeta } from "./news.constants";

const posts = generatedNews as NewsPost[];

export function getAllNews(): NewsPostMeta[] {
  return posts.map(({ slug, title, date, category, excerpt, author_id, readTime }) => ({
    slug,
    title,
    date,
    category,
    excerpt,
    author_id,
    readTime,
  }));
}

export function getNewsBySlug(slug: string): NewsPost | null {
  return posts.find(p => p.slug === slug) ?? null;
}
