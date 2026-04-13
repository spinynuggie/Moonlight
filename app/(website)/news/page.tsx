"use client";

import { motion } from "framer-motion";
import { ArrowDownWideNarrow, ArrowUpNarrowWide, Newspaper } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNews } from "@/lib/hooks/api/useNews";
import { useT } from "@/lib/i18n/utils";
import { newsCategories } from "@/lib/news.constants";
import { cn } from "@/lib/utils";

import NewsCard from "./components/NewsCard";

type SortOrder = "newest" | "oldest";

export default function NewsPage() {
  const t = useT("pages.news");
  const { data: posts, isLoading } = useNews();

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const filteredPosts = useMemo(() => {
    if (!posts)
      return [];

    const result = activeCategory === "all"
      ? [...posts]
      : posts.filter(post => post.category === activeCategory);

    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [posts, activeCategory, sortOrder]);

  return (
    <div className="flex w-full flex-col space-y-3">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex items-center gap-2 rounded-[10px] border border-border/50 bg-card p-4 shadow-md"
      >
        <span className="text-muted-foreground">
          <Newspaper className="size-5" />
        </span>
        <h1 className="text-lg font-semibold">{t("header")}</h1>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
        className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-border/50 bg-card px-4 py-3 shadow-md"
      >
        <div className="flex flex-wrap gap-1.5">
          <Button
            size="sm"
            variant={activeCategory === "all" ? "default" : "secondary"}
            className={cn(activeCategory === "all" && "text-black")}
            onClick={() => setActiveCategory("all")}
          >
            {t("filters.all")}
          </Button>
          {newsCategories.map(category => (
            <Button
              key={category}
              size="sm"
              variant={activeCategory === category ? "default" : "secondary"}
              className={cn(activeCategory === category && "text-black")}
              onClick={() => setActiveCategory(category)}
            >
              {t(`filters.${category}`)}
            </Button>
          ))}
        </div>

        <Button
          size="sm"
          variant="ghost"
          className="text-muted-foreground"
          onClick={() => setSortOrder(prev => prev === "newest" ? "oldest" : "newest")}
        >
          {sortOrder === "newest"
            ? <ArrowDownWideNarrow className="mr-1.5 size-4" />
            : <ArrowUpNarrowWide className="mr-1.5 size-4" />}
          {t(`sort.${sortOrder}`)}
        </Button>
      </motion.div>

      {/* News Grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
        className="overflow-hidden rounded-[10px] border border-border/50 bg-card p-4 shadow-md"
      >
        {isLoading
          ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Skeleton className="h-72 w-full rounded-lg md:col-span-2" />
                {["skeleton-1", "skeleton-2", "skeleton-3"].map(id => (
                  <Skeleton
                    key={id}
                    className="h-64 w-full rounded-lg"
                  />
                ))}
              </div>
            )
          : filteredPosts.length > 0
            ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div
                    className="duration-300 animate-in fade-in md:col-span-2"
                    style={{ animationFillMode: "backwards" }}
                  >
                    <NewsCard post={filteredPosts[0]} featured />
                  </div>
                  {filteredPosts.slice(1).map((post, i) => (
                    <div
                      key={post.slug}
                      className="duration-300 animate-in fade-in"
                      style={{
                        animationDelay: `${Math.min((i + 1) * 75, 600)}ms`,
                        animationFillMode: "backwards",
                      }}
                    >
                      <NewsCard post={post} />
                    </div>
                  ))}
                </div>
              )
            : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  {t("empty")}
                </p>
              )}
      </motion.div>
    </div>
  );
}
