import { Home } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import WebsiteLayout from "@/app/(website)/layout";
import { getT } from "@/lib/i18n/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT("components.notFound.meta");
  return {
    title: t("title"),
    openGraph: {
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function NotFound() {
  const t = await getT("components.notFound");
  return (
    <WebsiteLayout>
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <p className="hero-animate select-none bg-gradient-to-b from-muted-foreground/30 to-transparent bg-clip-text text-[10rem] font-black leading-none tracking-tighter text-transparent sm:text-[12rem]">
          404
        </p>

        <div className="hero-animate hero-animate-delay-1 -mt-6 space-y-2">
          <h1 className="text-3xl font-bold sm:text-4xl">{t("title")}</h1>
          <p className="mx-auto max-w-md text-sm text-muted-foreground sm:text-base">
            {t("description")}
          </p>
        </div>

        <div className="hero-animate hero-animate-delay-2 mt-8">
          <Image
            src="/images/not-found.jpg"
            alt="404"
            width={280}
            height={280}
            className="rounded-xl"
          />
        </div>

        <div className="hero-animate hero-animate-delay-3 mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Home className="size-4" />
            Home
          </Link>
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            Leaderboard
          </Link>
          <Link
            href="/beatmaps/search"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            Beatmaps
          </Link>
        </div>
      </div>
    </WebsiteLayout>
  );
}
