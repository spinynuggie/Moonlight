"use client";

import { BookOpen } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n/utils";

export default function ConnectBanner() {
  const t = useT("pages.mainPage.connectGuide");

  return (
    <div className="group relative overflow-hidden rounded-[10px] border border-border/50 bg-card p-5 shadow-md transition-all duration-200 hover:border-primary/25 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-lg">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.07] via-transparent to-transparent" />

      <div className="relative z-10 flex flex-col items-center gap-3 text-center">
        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
          <BookOpen className="size-5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold tracking-tight">
            {t("title")}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("description")}
          </p>
        </div>
        <Button
          size="sm"
          className="w-full bg-primary font-medium text-background transition-colors hover:bg-primary hover:text-background focus-visible:ring-1 focus-visible:ring-ring"
          asChild
        >
          <Link href="/wiki#How%20to%20connect">{t("button")}</Link>
        </Button>
      </div>
    </div>
  );
}
