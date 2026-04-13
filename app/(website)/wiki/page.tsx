"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useT } from "@/lib/i18n/utils";
import { cn } from "@/lib/utils";

type WikiArticleId
  = | "howToConnect"
    | "multipleAccounts"
    | "cheatsHacks"
    | "appealRestriction"
    | "contributeSuggest"
    | "multiplayerDownload";

type WikiCategoryId = "gettingStarted" | "rulesPolicies" | "community" | "troubleshooting";

interface WikiArticle {
  id: WikiArticleId;
  tag: string;
  categoryId: WikiCategoryId;
}

const CATEGORIES: WikiCategoryId[] = [
  "gettingStarted",
  "rulesPolicies",
  "community",
  "troubleshooting",
];

const ARTICLES: WikiArticle[] = [
  { id: "howToConnect", tag: "How to connect", categoryId: "gettingStarted" },
  { id: "multipleAccounts", tag: "Can I have multiple accounts?", categoryId: "rulesPolicies" },
  { id: "cheatsHacks", tag: "Can I use cheats or hacks?", categoryId: "rulesPolicies" },
  { id: "appealRestriction", tag: "I think I was restricted unfairly. How can I appeal?", categoryId: "rulesPolicies" },
  { id: "contributeSuggest", tag: "Can I contribute/suggest changes to the server?", categoryId: "community" },
  { id: "multiplayerDownload", tag: "I can't download maps when I'm in multiplayer, but I can download them from the main menu", categoryId: "troubleshooting" },
];

function getArticlesByCategory(categoryId: WikiCategoryId): WikiArticle[] {
  return ARTICLES.filter(a => a.categoryId === categoryId);
}

function getCategoryForArticle(articleId: WikiArticleId): WikiCategoryId {
  return ARTICLES.find(a => a.id === articleId)?.categoryId ?? "gettingStarted";
}

function getFirstArticleInCategory(categoryId: WikiCategoryId): WikiArticleId {
  return getArticlesByCategory(categoryId)[0]?.id ?? "howToConnect";
}

export default function Wiki() {
  const pathname = usePathname();
  const t = useT("pages.wiki.articles");
  const tWiki = useT("pages.wiki");

  const [activeArticle, setActiveArticle] = useState<WikiArticleId>("howToConnect");

  const activeCategory = getCategoryForArticle(activeArticle);

  const handleCategoryChange = useCallback((categoryId: WikiCategoryId) => {
    setActiveArticle(getFirstArticleInCategory(categoryId));
  }, []);

  const articleTitles: Record<WikiArticleId, string> = useMemo(() => ({
    howToConnect: t("howToConnect.title"),
    multipleAccounts: t("multipleAccounts.title"),
    cheatsHacks: t("cheatsHacks.title"),
    appealRestriction: t("appealRestriction.title"),
    contributeSuggest: t("contributeSuggest.title"),
    multiplayerDownload: t("multiplayerDownload.title"),
  }), [t]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = decodeURIComponent(window.location.hash).slice(1);
      const article = ARTICLES.find(({ tag }) => tag === hash);
      if (article) {
        setActiveArticle(article.id);
      }
    }
  }, [pathname]);

  useEffect(() => {
    const article = ARTICLES.find(a => a.id === activeArticle);
    window.history.replaceState(
      null,
      "",
      pathname + (article ? `#${encodeURIComponent(article.tag)}` : ""),
    );
  }, [activeArticle, pathname]);

  const renderArticleContent = (articleId: WikiArticleId) => {
    const discordLink = process.env.NEXT_PUBLIC_DISCORD_LINK;

    switch (articleId) {
      case "howToConnect":
        return (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-foreground/80">
              {t("howToConnect.intro")}
            </p>
            <ol className="list-inside list-decimal space-y-1.5 text-sm leading-relaxed text-foreground/80">
              <li>{t.rich("howToConnect.step1")}</li>
              <li>{t("howToConnect.step2")}</li>
              <li>{t("howToConnect.step3")}</li>
              <li>
                {t.rich("howToConnect.step4", {
                  serverDomain: process.env.NEXT_PUBLIC_SERVER_DOMAIN || "",
                })}
              </li>
              <li>{t("howToConnect.step5")}</li>
              <li>{t("howToConnect.step6")}</li>
            </ol>
            <Image
              src="/images/wiki/osu-connect.png"
              alt={t("howToConnect.imageAlt")}
              width={800}
              height={200}
              className="rounded-lg border border-border/30"
            />
          </div>
        );

      case "multipleAccounts":
        return (
          <div className="space-y-3">
            <p className="text-sm font-medium leading-relaxed text-foreground/90">
              {t("multipleAccounts.answer")}
            </p>
            <p className="text-sm leading-relaxed text-foreground/70">
              {t("multipleAccounts.consequence")}
            </p>
          </div>
        );

      case "cheatsHacks":
        return (
          <div className="space-y-3">
            <p className="text-sm font-medium leading-relaxed text-foreground/90">
              {t("cheatsHacks.answer")}
            </p>
            <p className="text-sm leading-relaxed text-foreground/70">
              {t.rich("cheatsHacks.policy")}
            </p>
          </div>
        );

      case "appealRestriction":
        return (
          <div className="space-y-3">
            <p className="text-sm leading-relaxed text-foreground/80">
              {t("appealRestriction.instructions")}
              {discordLink && (
                <span>
                  {" "}
                  {t.rich("appealRestriction.contactStaff", {
                    a: chunks => (
                      <a
                        href={
                          discordLink.startsWith("http")
                            ? discordLink
                            : `https://${discordLink}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline transition-opacity hover:opacity-80"
                      >
                        {chunks}
                      </a>
                    ),
                  })}
                </span>
              )}
            </p>
          </div>
        );

      case "contributeSuggest":
        return (
          <div className="space-y-3">
            <p className="text-sm font-medium leading-relaxed text-foreground/90">
              {t("contributeSuggest.answer")}
            </p>
            <p className="text-sm leading-relaxed text-foreground/70">
              {t.rich("contributeSuggest.instructions", {
                a: chunks => (
                  <Link
                    href="https://github.com/himejoshi-gay"
                    className="text-primary underline transition-opacity hover:opacity-80"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </div>
        );

      case "multiplayerDownload":
        return (
          <div className="space-y-3">
            <p className="text-sm leading-relaxed text-foreground/80">
              {t.rich("multiplayerDownload.solution")}
            </p>
          </div>
        );
    }
  };

  let sidebarIndex = 0;

  return (
    <div className="flex w-full flex-col space-y-2">
      {/* Mobile Category & Article Dropdowns */}
      <div className="flex flex-col gap-2 md:hidden">
        <Select
          value={activeCategory}
          onValueChange={(value: string) => handleCategoryChange(value as WikiCategoryId)}
        >
          <SelectTrigger className="rounded-[10px] border-border/50 bg-card shadow-md">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(cat => (
              <SelectItem key={cat} value={cat}>
                {tWiki(`categories.${cat}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {getArticlesByCategory(activeCategory).length > 1 && (
          <div className="flex flex-col divide-y divide-border/30 rounded-[10px] border border-border/50 bg-card p-2 shadow-md">
            {getArticlesByCategory(activeCategory).map(article => (
              <button
                key={article.id}
                type="button"
                onClick={() => setActiveArticle(article.id)}
                className={cn(
                  "rounded-lg px-3 py-2 text-left text-sm leading-snug transition-colors duration-150",
                  activeArticle === article.id
                    ? "bg-secondary font-medium text-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                )}
              >
                {articleTitles[article.id]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sidebar + Content */}
      <div className="flex gap-2">
        {/* Desktop Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="hidden w-52 shrink-0 md:block"
        >
          <nav className="sticky top-20 rounded-[10px] border border-border/50 bg-card p-2 shadow-md">
            {CATEGORIES.map((cat) => {
              const catArticles = getArticlesByCategory(cat);
              return (
                <div key={cat} className="mb-1 border-b border-border/30 pb-1 last:mb-0 last:border-0 last:pb-0">
                  <p className="mb-0.5 px-3 pb-0.5 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/40 first:pt-1">
                    {tWiki(`categories.${cat}`)}
                  </p>
                  {catArticles.map((article) => {
                    const idx = sidebarIndex++;
                    return (
                      <button
                        key={article.id}
                        type="button"
                        onClick={() => setActiveArticle(article.id)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-[13px] leading-snug transition-colors duration-150",
                          activeArticle === article.id
                            ? "bg-secondary font-medium text-foreground"
                            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                        )}
                        style={{
                          animation: `fade-in 300ms ease-out ${150 + idx * 50}ms backwards`,
                        }}
                      >
                        {articleTitles[article.id]}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </nav>
        </motion.div>

        {/* Content Panel */}
        <div className="min-w-0 flex-1">
          <div className="rounded-[10px] border border-border/50 bg-card p-6 shadow-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeArticle}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6 border-b border-border/40 pb-4">
                  <h2 className="text-xl font-bold tracking-tight">
                    {articleTitles[activeArticle]}
                  </h2>
                </div>
                {renderArticleContent(activeArticle)}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
