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
      <Card className="group flex h-full flex-col overflow-hidden border-border/60 transition-all duration-200 hover:border-primary/20 hover:shadow-md motion-safe:hover:-translate-y-0.5">
        <div
          className={cn(
            "relative flex flex-col justify-between overflow-hidden bg-gradient-to-br p-4",
            featured ? "min-h-48 flex-1" : "min-h-36",
            gradient,
          )}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
          <div className="pointer-events-none absolute -right-12 -top-12 size-36 rounded-full bg-white/[0.12] blur-2xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 size-28 rounded-full bg-primary/[0.18] blur-2xl" />

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
            <span className="text-[11px] font-medium text-foreground/55">
              {dateToPrettyString(post.date)}
            </span>
          </div>

          <div className="relative z-10 mt-auto space-y-2 pt-3">
            <h3
              className={cn(
                "line-clamp-2 leading-snug tracking-tight text-foreground",
                featured ? "text-lg font-semibold" : "text-base font-semibold",
              )}
            >
              {post.title}
            </h3>
            <div className="flex items-center gap-1.5">
              {author
                ? (
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
                      <span className="text-xs text-foreground/60">
                        {author.username}
                      </span>
                    </>
                  )
                : <Skeleton className="h-4 w-20" />}
            </div>
          </div>
        </div>

        <CardContent className="p-4 pt-3">
          <p
            className={cn(
              "text-sm leading-relaxed text-muted-foreground",
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
