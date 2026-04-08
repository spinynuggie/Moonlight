"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
    <section className="py-8 sm:py-16">
      <motion.div
        {...(reduceMotion
          ? {}
          : {
              initial: { opacity: 0, y: 16 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, margin: "-80px" },
              transition: { duration: 0.5, ease: "easeOut" },
            })}
        className="mb-8 flex items-end justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t("title")}
          </h2>
        </div>
        <Link
          href="/news"
          className="flex shrink-0 items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {t("viewAll")}
          <ArrowRight className="size-3.5" />
        </Link>
      </motion.div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="news-skeleton"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {["a", "b", "c"].map(key => (
                <div
                  key={`news-skeleton-${key}`}
                  className="overflow-hidden rounded-xl"
                >
                  <Skeleton className="h-40 w-full" />
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
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  {newsPosts.slice(0, 3).map((post, i) => (
                    <motion.div
                      key={post.slug}
                      {...(reduceMotion
                        ? {}
                        : {
                            initial: { opacity: 0, y: 16 },
                            whileInView: { opacity: 1, y: 0 },
                            viewport: { once: true, margin: "-60px" },
                            transition: {
                              duration: 0.4,
                              ease: "easeOut",
                              delay: i * 0.1,
                            },
                          })}
                    >
                      <NewsCard post={post} />
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
    </section>
  );
}
