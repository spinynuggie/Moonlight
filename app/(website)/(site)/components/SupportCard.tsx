"use client";

import { Heart } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n/utils";

export default function SupportCard() {
  const t = useT("pages.mainPage.support");

  return (
    <div className="group relative overflow-hidden rounded-[10px] border border-border/50 bg-card p-5 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-transparent to-transparent" />
      <div className="pointer-events-none absolute -right-6 -top-6 size-20 rounded-full bg-primary/[0.04] transition-transform duration-300 group-hover:scale-110" />

      <div className="relative z-10 flex flex-col items-center gap-3 text-center">
        <div className="animate-float flex size-10 items-center justify-center rounded-full bg-primary/10">
          <Heart className="size-5 text-primary" />
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
          className="smooth-transition w-full transform-gpu bg-primary font-medium text-background hover:scale-[1.02] hover:bg-primary hover:text-background hover:shadow-[0_0_24px_rgba(141,163,185,0.3)]"
          asChild
        >
          <Link href="/support">{t("button")}</Link>
        </Button>
      </div>
    </div>
  );
}
