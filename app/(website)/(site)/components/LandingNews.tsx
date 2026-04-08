"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Newspaper } from "lucide-react";
import Link from "next/link";

import NewsCard from "@/app/(website)/news/components/NewsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useNews } from "@/lib/hooks/api/useNews";
import { useT } from "@/lib/i18n/utils";

export default function LandingNews() {
  const t = useT("pages.mainPage.news");
  const { data: newsPosts, isLoading } = useNews();

  return (
    <section className="overflow-hidden rounded-[10px] border border-border/50 bg-card shadow-md">
      <div className="flex items-center justify-between gap-3 border-b border-border/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">
            <Newspaper className="size-4" />
          </span>
          <h2 className="text-sm font-semibold tracking-tight text-foreground/95 sm:text-[15px]">
            {t("title")}
          </h2>
        </div>
        <Link
          href="/news"
          className="flex items-center gap-1 rounded-md px-1 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {t("viewAll")}
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="p-4">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="news-skeleton"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {["hero", "a", "b", "c"].map((key, i) => (
                  <div
                    key={`news-skeleton-${key}`}
                    className={`overflow-hidden rounded-lg border ${
                      i === 0 ? "md:col-span-2" : ""
                    }`}
                  >
                    <Skeleton
                      className={`w-full rounded-none ${
                        i === 0 ? "h-48" : "h-36"
                      }`}
                    />
                    <div className="space-y-2 p-4">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : newsPosts && newsPosts.length > 0
            ? (
                <motion.div
                  key="news-loaded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {newsPosts.slice(0, 5).map((post, i) => (
                      <div
                        key={post.slug}
                        className={`motion-safe:duration-300 motion-safe:animate-in motion-safe:fade-in motion-reduce:animate-none ${
                      i === 0 ? "md:col-span-2" : ""
                    }`}
                        style={{
                          animationDelay: `${Math.min(i * 100, 600)}ms`,
                          animationFillMode: "backwards",
                        }}
                      >
                        <NewsCard post={post} featured={i === 0} />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )
            : (
                <motion.div
                  key="news-empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    {t("empty")}
                  </p>
                </motion.div>
              )}
        </AnimatePresence>
      </div>
    </section>
  );
}
