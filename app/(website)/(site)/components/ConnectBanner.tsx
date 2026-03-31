"use client";

import { BookOpen } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n/utils";

export default function ConnectBanner() {
  const t = useT("pages.mainPage.connectGuide");

  return (
    <div className="group relative overflow-hidden rounded-[10px] border border-border/50 bg-card p-5 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D9BC8C]/30 hover:shadow-lg">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#D9BC8C]/[0.08] via-transparent to-transparent" />
      <div className="pointer-events-none absolute -right-6 -top-6 size-20 rounded-full bg-[#D9BC8C]/[0.04] transition-transform duration-300 group-hover:scale-110" />

      <div className="relative z-10 flex flex-col items-center gap-3 text-center">
        <div className="flex size-10 items-center justify-center rounded-full bg-[#D9BC8C]/10">
          <BookOpen className="size-5 text-[#D9BC8C]" />
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
          className="smooth-transition w-full transform-gpu bg-[#D9BC8C] font-medium text-background hover:scale-[1.02] hover:bg-[#D9BC8C] hover:text-background hover:shadow-[0_0_24px_rgba(217,188,140,0.3)]"
          asChild
        >
          <Link href="/wiki#How%20to%20connect">{t("button")}</Link>
        </Button>
      </div>
    </div>
  );
}
