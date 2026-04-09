"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Newspaper } from "lucide-react";
import Link from "next/link";

import NewsCard from "@/app/(website)/news/components/NewsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useNews } from "@/lib/hooks/api/useNews";
import { useT } from "@/lib/i18n/utils";

export default function LandingNews() {
  const t = useT("pages.mainPage.news");
  const { data: newsPosts, isLoading } = useNews();
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = shouldReduceMotion ?? false;

  return (
    <motion.section
      {...(reduceMotion
        ? {}
        : {
            initial: { opacity: 0, y: 20, scale: 0.98 },
            whileInView: { opacity: 1, y: 0, scale: 1 },
            viewport: { once: true, margin: "-80px" },
            transition: { duration: 0.6, ease: "easeOut" },
          })}
      className="py-8 sm:py-16"
    >
      <div className="overflow-hidden rounded-2xl border border-border/40 bg-card shadow-lg">
        <div className="flex items-center justify-between border-b border-border/30 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <Newspaper className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold tracking-tight sm:text-[15px]">
              {t("title")}
            </h2>
          </div>
          <Link
            href="/news"
            className="flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {t("viewAll")}
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="p-4 sm:p-5">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="news-skeleton"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="flex h-full flex-col overflow-hidden rounded-xl md:col-span-2 md:row-span-2">
                    <Skeleton className="h-48 w-full flex-1 md:min-h-[280px]" />
                    <div className="space-y-2 pt-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                  {["b", "c"].map(key => (
                    <div
                      key={`news-skeleton-${key}`}
                      className="overflow-hidden rounded-xl"
                    >
                      <Skeleton className="h-36 w-full" />
                      <div className="space-y-2 pt-3">
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
                    initial={reduceMotion ? undefined : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      {newsPosts.slice(0, 3).map((post, i) => (
                        <motion.div
                          key={post.slug}
                          {...(reduceMotion
                            ? {}
                            : {
                                initial: { opacity: 0, y: 16, scale: 0.97 },
                                whileInView: { opacity: 1, y: 0, scale: 1 },
                                viewport: { once: true, margin: "-40px" },
                                transition: {
                                  duration: 0.45,
                                  ease: "easeOut",
                                  delay: i * 0.1,
                                },
                              })}
                          className={
                            i === 0 ? "md:col-span-2 md:row-span-2" : ""
                          }
                        >
                          <NewsCard post={post} featured={i === 0} />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )
              : (
                  <motion.div
                    key="news-empty"
                    initial={reduceMotion ? undefined : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="py-12 text-center text-sm text-muted-foreground">
                      {t("empty")}
                    </p>
                  </motion.div>
                )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}
