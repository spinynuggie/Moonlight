"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import NewsCard from "@/app/(website)/news/components/NewsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useNews } from "@/lib/hooks/api/useNews";
import { useT } from "@/lib/i18n/utils";

export default function LandingNews() {
  const t = useT("pages.mainPage.news");
  const { data: newsPosts, isLoading } = useNews();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = shouldReduceMotion ?? false;

  return (
    <section className="py-8 sm:py-16">
      <motion.h2
        {...(reduceMotion
          ? {}
          : {
              initial: { opacity: 0, y: 16 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, margin: "-60px" },
              transition: { duration: 0.4, ease: "easeOut" },
            })}
        className="mb-2 text-center text-2xl font-bold tracking-tight sm:text-3xl"
        style={{ textShadow: "0 2px 12px rgba(0, 0, 0, 0.3)" }}
      >
        Latest
        {" "}
        <span className="text-primary" style={{ textShadow: "0 2px 16px hsl(var(--primary) / 0.4)" }}>
          news
        </span>
      </motion.h2>
      <motion.p
        {...(reduceMotion
          ? {}
          : {
              initial: { opacity: 0, y: 12 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, margin: "-60px" },
              transition: { duration: 0.4, ease: "easeOut", delay: 0.1 },
            })}
        className="mb-10 text-center text-sm text-muted-foreground sm:mb-14 sm:text-base"
      >
        See what&apos;s going on
      </motion.p>

      <motion.div
        {...(reduceMotion
          ? {}
          : {
              initial: { opacity: 0, y: 20, scale: 0.98 },
              whileInView: { opacity: 1, y: 0, scale: 1 },
              viewport: { once: true, margin: "-80px" },
              transition: { duration: 0.6, ease: "easeOut" },
            })}
      >
        <div>
          <AnimatePresence mode="wait">
            {!mounted || isLoading ? (
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

        <motion.div
          {...(reduceMotion
            ? {}
            : {
                initial: { opacity: 0 },
                whileInView: { opacity: 1 },
                viewport: { once: true, margin: "-40px" },
                transition: { duration: 0.4, delay: 0.3 },
              })}
          className="mt-6 flex justify-center"
        >
          <Link
            href="/news"
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("viewAll")}
            <ArrowRight className="size-3.5" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
