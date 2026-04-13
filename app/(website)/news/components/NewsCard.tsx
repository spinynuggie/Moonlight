"use client";

import Image from "next/image";
import Link from "next/link";

import { dateToPrettyString } from "@/components/General/PrettyDate";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/lib/hooks/api/user/useUser";
import { useT } from "@/lib/i18n/utils";
import type { NewsPostMeta } from "@/lib/news.constants";
import {
  categoryGradientFallback,
  categoryGradients,
} from "@/lib/news.constants";
import { cn } from "@/lib/utils";

interface NewsCardProps {
  post: NewsPostMeta;
  featured?: boolean;
}

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

export default function NewsCard({ post, featured }: NewsCardProps) {
  const { data: author } = useUser(post.author_id);
  const t = useT("pages.mainPage.news");
  const gradient
    = categoryGradients[post.category] ?? categoryGradientFallback;
  const isNew = (Date.now() - new Date(post.date).getTime()) < THREE_DAYS_MS;

  return (
    <Link
      href={`/news/${post.slug}`}
      className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      <Card className={cn(
        "group flex h-full flex-col overflow-hidden border-border/60 transition-all duration-300 hover:border-primary/20 motion-safe:hover:-translate-y-1",
        featured
          ? "hover:shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_24px_hsl(var(--primary)/0.1)]"
          : "hover:shadow-[0_8px_32px_rgba(0,0,0,0.25),0_0_20px_hsl(var(--primary)/0.08)]",
      )}
      >
        <div
          className={cn(
            "relative flex flex-col justify-between overflow-hidden bg-gradient-to-br p-4",
            featured ? "min-h-48 flex-1" : "min-h-36",
            gradient,
          )}
        >
          <div className="pointer-events-none absolute inset-0 rounded-t-xl ring-1 ring-inset ring-white/[0.06]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
          <div className="pointer-events-none absolute -right-16 -top-16 size-44 rounded-full bg-white/[0.14] blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 size-36 rounded-full bg-primary/[0.20] blur-2xl" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Badge variant="secondary" className="text-xs">
                {post.category}
              </Badge>
              {isNew && (
                <Badge className="bg-primary/90 px-1.5 py-0 text-[10px] font-bold text-primary-foreground">
                  <span className="status-online-pulse">{t("new")}</span>
                </Badge>
              )}
            </div>
            <span
              className="text-[11px] font-medium text-foreground/55"
              style={{ textShadow: "0 1px 4px rgba(0, 0, 0, 0.5)" }}
            >
              {dateToPrettyString(post.date)}
            </span>
          </div>

          <div className="relative z-10 mt-auto space-y-2 pt-3">
            <h3
              className={cn(
                "hero-text-shadow line-clamp-2 leading-snug tracking-tight text-foreground",
                featured ? "text-lg font-semibold" : "text-base font-semibold",
              )}
            >
              {post.title}
            </h3>
            <div className="relative flex h-4 items-center gap-1.5">
              <div className={cn("flex items-center gap-1.5 transition-opacity duration-300", author ? "opacity-100" : "opacity-0")}>
                {author && (
                  <>
                    <div className="relative size-4 overflow-hidden rounded-full ring-1 ring-foreground/10">
                      <Image
                        src={author.avatar_url}
                        alt={author.username}
                        width={16}
                        height={16}
                        className="object-cover"
                      />
                    </div>
                    <span
                      className="text-xs text-foreground/60"
                      style={{ textShadow: "0 1px 4px rgba(0, 0, 0, 0.5)" }}
                    >
                      {author.username}
                    </span>
                  </>
                )}
              </div>
              <Skeleton className={cn("absolute left-0 h-4 w-20 transition-opacity duration-300", author ? "opacity-0" : "opacity-100")} />
            </div>
          </div>
        </div>

        <CardContent className="p-4 pt-3">
          <p
            className={cn(
              "text-sm leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-foreground/60",
              featured ? "line-clamp-3" : "line-clamp-2",
            )}
          >
            {post.excerpt}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
