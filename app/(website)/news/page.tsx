"use client";

import { ArrowDownWideNarrow, ArrowUpNarrowWide, Newspaper } from "lucide-react";
import { useMemo, useState } from "react";

import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNews } from "@/lib/hooks/api/useNews";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";
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

  useScrollReveal([activeCategory, sortOrder]);

  return (
    <div className="flex w-full flex-col space-y-4">
      <PrettyHeader
        text={t("header")}
        icon={<Newspaper />}
        roundBottom
        counter={isLoading ? undefined : filteredPosts.length}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
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
      </div>

      <RoundedContent className="duration-300 animate-in fade-in">
        {isLoading
          ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Skeleton className="h-72 w-full rounded-lg md:col-span-2" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton
                    key={`news-skeleton-${i}`}
                    className="h-64 w-full rounded-lg"
                  />
                ))}
              </div>
            )
          : filteredPosts.length > 0
            ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="scroll-reveal md:col-span-2">
                    <NewsCard post={filteredPosts[0]} featured />
                  </div>
                  {filteredPosts.slice(1).map(post => (
                    <div key={post.slug} className="scroll-reveal">
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
      </RoundedContent>
    </div>
  );
}
