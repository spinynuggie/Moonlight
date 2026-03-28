"use client";

import { Heart } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n/utils";

export default function SupportCard() {
  const t = useT("pages.mainPage.support");

  return (
    <div className="relative overflow-hidden rounded-lg border bg-gradient-to-br from-primary/20 via-primary/5 to-transparent p-5">

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
