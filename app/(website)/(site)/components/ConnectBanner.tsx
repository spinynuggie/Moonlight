"use client";

import { BookOpen } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n/utils";

export default function ConnectBanner() {
  const t = useT("pages.mainPage.connectGuide");

  return (
    <div className="relative overflow-hidden rounded-lg border bg-gradient-to-br from-primary/20 via-primary/5 to-transparent p-5">
      <div className="pointer-events-none absolute -right-4 -top-4 size-20 rounded-full bg-primary/5" />
      <div className="pointer-events-none absolute -bottom-2 -left-2 size-12 rounded-full bg-primary/5" />

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
          className="smooth-transition w-full animate-gradient bg-gradient-to-r from-primary/80 to-primary/40 bg-[length:300%_300%] hover:shadow-[0_0_20px_rgba(141,163,185,0.2)]"
          asChild
        >
          <Link href="/wiki#How%20to%20connect">{t("button")}</Link>
        </Button>
      </div>
    </div>
  );
}
