"use client";

import { Download, FileText, UserPlus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n/utils";

const STEPS = [
  {
    icon: Download,
    titleKey: "howToStart.downloadTile.title" as const,
    descKey: "howToStart.downloadTile.description" as const,
    buttonKey: "howToStart.downloadTile.button" as const,
    href: "https://osu.ppy.sh/home/download",
    external: true,
  },
  {
    icon: UserPlus,
    titleKey: "howToStart.registerTile.title" as const,
    descKey: "howToStart.registerTile.description" as const,
    buttonKey: "howToStart.registerTile.button" as const,
    href: "/register",
    external: false,
  },
  {
    icon: FileText,
    titleKey: "howToStart.guideTile.title" as const,
    descKey: "howToStart.guideTile.description" as const,
    buttonKey: "howToStart.guideTile.button" as const,
    href: "/wiki#How%20to%20connect",
    external: false,
  },
] as const;

export default function LandingConnectGuide() {
  const t = useT("pages.mainPage");

  return (
    <section className="sticky top-24 overflow-hidden rounded-[10px] border border-border/50 bg-card shadow-md">
      <div className="border-b border-border/40 px-5 py-4">
        <h2 className="text-sm font-semibold tracking-tight sm:text-[15px]">
          {t("howToStart.title")}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {t("howToStart.description")}
        </p>
      </div>

      <div className="relative px-5 py-4">
        <div className="absolute inset-y-4 left-[33.5px] w-px bg-border/60" />

        <div className="relative space-y-5">
          {STEPS.map((step, i) => (
            <div key={step.titleKey} className="group relative flex gap-3.5">
              <div className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground shadow-sm">
                {i + 1}
              </div>

              <div className="min-w-0 flex-1 space-y-2 pt-0.5">
                <div>
                  <h3 className="text-[13px] font-semibold leading-tight tracking-tight">
                    {t(step.titleKey)}
                  </h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {t(step.descKey)}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 w-full border-border/50 text-xs font-medium transition-colors hover:border-primary/40 hover:bg-primary/[0.06]"
                  asChild
                >
                  <Link
                    href={step.href}
                    {...(step.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    <step.icon className="mr-1 size-3" />
                    {t(step.buttonKey)}
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
