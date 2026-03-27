import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import PrettyDate from "@/components/General/PrettyDate";
import RoundedContent from "@/components/General/RoundedContent";
import { Badge } from "@/components/ui/badge";
import { getT } from "@/lib/i18n/utils";
import { getAllNews, getNewsBySlug } from "@/lib/news";
import {
  categoryGradientFallback,
  categoryGradients,
} from "@/lib/news.constants";
import { kyInstance } from "@/lib/services/fetcher";
import type { UserResponse } from "@/lib/types/api";
import { cn } from "@/lib/utils";

export async function generateStaticParams() {
  const posts = getAllNews();
  return posts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getNewsBySlug(slug);

  if (!post) {
    return {};
  }

  const t = await getT("pages.newsDetail.meta");
  const title = t("title", { title: post.title });
  const description = `[${post.category}] ${post.excerpt}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [`/images/news/og/${slug}.png`],
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getNewsBySlug(slug);

  if (!post) {
    notFound();
  }

  const t = await getT("pages.newsDetail");

  let author: UserResponse | null = null;
  try {
    author = await kyInstance
      .get(`user/${post.author_id}`)
      .json<UserResponse>();
  }
  catch (error) {
    console.error(`Failed to fetch author for user ID ${post.author_id}:`, error);
  }

  const gradient
    = categoryGradients[post.category] ?? categoryGradientFallback;

  return (
    <div className="flex w-full flex-col space-y-4 duration-300 animate-in fade-in">
      <Link
        href="/news"
        className="group flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
        {t("backToNews")}
      </Link>

      <div
        className={cn(
          "rounded-lg border bg-gradient-to-br p-6 shadow-md",
          gradient,
        )}
      >
        <Badge variant="secondary">{post.category}</Badge>
        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          {post.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <PrettyDate
            time={post.date}
            className="text-sm text-muted-foreground"
            withTime={false}
          />
          {author && (
            <>
              <span className="text-muted-foreground/40">·</span>
              <Link
                href={`/user/${author.user_id}`}
                className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <div className="relative size-7 overflow-hidden rounded-full">
                  <Image
                    src={author.avatar_url}
                    alt={author.username}
                    width={28}
                    height={28}
                    className="object-cover"
                  />
                </div>
                <span className="text-sm font-medium">
                  {author.username}
                </span>
              </Link>
            </>
          )}
        </div>
      </div>

      <RoundedContent>
        <div className="max-w-3xl">
          <div
            className="space-y-4 text-sm leading-relaxed text-muted-foreground [&>blockquote]:border-l-2 [&>blockquote]:border-primary/30 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-muted-foreground [&>h2]:mt-8 [&>h2]:text-lg [&>h2]:font-semibold [&>h2]:text-foreground [&>h3]:mt-6 [&>h3]:text-base [&>h3]:font-medium [&>h3]:text-foreground [&>hr]:my-8 [&>hr]:border-border [&>ol]:list-inside [&>ol]:list-decimal [&>ol]:space-y-1 [&>p]:leading-relaxed [&>ul]:list-inside [&>ul]:list-disc [&>ul]:space-y-1 [&_a]:text-primary [&_a]:underline [&_code]:rounded [&_code]:bg-secondary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-xs [&_strong]:text-foreground"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </div>
      </RoundedContent>
    </div>
  );
}
