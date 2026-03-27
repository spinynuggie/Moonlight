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
    <Link href={`/news/${post.slug}`}>
      <Card className="group overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md">
        <div
          className={cn(
            "relative flex flex-col justify-between overflow-hidden bg-gradient-to-br p-4 transition-transform duration-300 group-hover:scale-[1.02]",
            featured ? "min-h-48" : "min-h-36",
            gradient,
          )}
        >
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-foreground/[0.03]" />
          <div className="pointer-events-none absolute -bottom-4 -left-4 size-16 rounded-full bg-foreground/[0.03]" />

          <div className="flex items-center justify-between">
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
            <span className="flex items-center gap-1.5 text-[11px] text-foreground/50">
              {post.readTime > 0 && (
                <>
                  <span>{t("minRead", { minutes: post.readTime })}</span>
                  <span>·</span>
                </>
              )}
              {dateToPrettyString(post.date)}
            </span>
          </div>

          <div className="mt-auto space-y-2 pt-3">
            <h3
              className={cn(
                "line-clamp-2 leading-snug tracking-tight",
                featured ? "text-lg font-bold" : "text-base font-semibold",
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

        <CardContent className="p-4">
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
