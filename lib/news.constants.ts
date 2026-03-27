export interface NewsPostMeta {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  author_id: number;
}

export interface NewsPost extends NewsPostMeta {
  content: string;
  contentHtml: string;
}

export const newsCategories = ["Announcement", "Update", "Community"] as const;
export type NewsCategory = (typeof newsCategories)[number];

export const categoryGradients: Record<string, string> = {
  Announcement: "from-primary/30 via-primary/10 to-transparent",
  Update: "from-[#8C977D]/30 via-[#8C977D]/10 to-transparent",
  Community: "from-[#D9BC8C]/30 via-[#D9BC8C]/10 to-transparent",
};

export const categoryGradientFallback = "from-muted/30 via-muted/10 to-transparent";
