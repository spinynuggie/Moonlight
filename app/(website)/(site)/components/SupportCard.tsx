"use client";

import { HeartHandshake } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n/utils";

export default function SupportCard() {
  const t = useT("pages.mainPage.support");

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-card p-5 shadow-md transition-all duration-300 hover:border-primary/25 hover:shadow-[0_8px_32px_rgba(0,0,0,0.2),0_0_20px_hsl(var(--primary)/0.08)] motion-safe:hover:-translate-y-0.5">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(var(--primary) / 0.05) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          maskImage:
            "linear-gradient(to top left, black 30%, transparent 80%)",
          WebkitMaskImage:
            "linear-gradient(to top left, black 30%, transparent 80%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-transparent to-transparent" />

      <div className="relative z-10 flex flex-col items-center gap-3 text-center">
        <div className="animate-float flex size-10 items-center justify-center rounded-full bg-primary/10">
          <HeartHandshake className="size-5 text-primary" />
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
          <Link href="/support">{t("button")}</Link>
        </Button>
      </div>
    </div>
  );
}
