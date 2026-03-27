"use client";

import { BookOpen } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n/utils";

export default function ConnectBanner() {
  const t = useT("pages.mainPage.connectGuide");

  return (
    <div className="relative overflow-hidden rounded-lg border bg-gradient-to-br from-[#D9BC8C]/20 via-[#D9BC8C]/5 to-transparent p-5">

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
          className="smooth-transition w-full bg-[#D9BC8C] font-medium text-background hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(217,188,140,0.3)]"
          asChild
        >
          <Link href="/wiki#How%20to%20connect">{t("button")}</Link>
        </Button>
      </div>
    </div>
  );
}
