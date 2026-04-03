import { Home } from "lucide-react";
import type { Metadata } from "next";
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
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="hero-animate w-full max-w-lg rounded-[10px] border border-border/50 bg-card p-8 text-center shadow-md sm:p-12">
          <p className="select-none bg-gradient-to-b from-muted-foreground/30 to-transparent bg-clip-text text-[8rem] font-black leading-none tracking-tighter text-transparent sm:text-[10rem]">
            404
          </p>

          <div className="hero-animate hero-animate-delay-1 -mt-4 space-y-2">
            <h1 className="text-2xl font-bold sm:text-3xl">{t("title")}</h1>
            <p className="mx-auto max-w-sm text-sm text-muted-foreground">
              {t("description")}
            </p>
          </div>

          <div className="hero-animate hero-animate-delay-2 mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-border/50 bg-secondary px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
            >
              <Home className="size-4" />
              Home
            </Link>
          </div>
        </div>
      </div>
    </WebsiteLayout>
  );
}
