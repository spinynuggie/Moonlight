"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Download, FileText, UserPlus } from "lucide-react";
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
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = shouldReduceMotion ?? false;

  return (
    <section className="space-y-6 py-8 sm:space-y-8 sm:py-16">
      <div className="text-center">
        <motion.h2
          {...(reduceMotion
            ? {}
            : {
                initial: { opacity: 0, y: 16 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, margin: "-80px" },
                transition: { duration: 0.5, ease: "easeOut" },
              })}
          className="text-2xl font-bold tracking-tight sm:text-3xl"
        >
          {t("howToStart.title")}
        </motion.h2>
        <motion.p
          {...(reduceMotion
            ? {}
            : {
                initial: { opacity: 0, y: 12 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, margin: "-80px" },
                transition: { duration: 0.5, ease: "easeOut", delay: 0.1 },
              })}
          className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base"
        >
          {t("howToStart.description")}
        </motion.p>
      </div>

      {STEPS.map((step, i) => {
        const isRight = i % 2 === 1;

        return (
          <motion.div
            key={step.titleKey}
            {...(reduceMotion
              ? {}
              : {
                  initial: { opacity: 0, x: isRight ? 40 : -40, y: 16 },
                  whileInView: { opacity: 1, x: 0, y: 0 },
                  viewport: { once: true, margin: "-100px" },
                  transition: { duration: 0.6, ease: "easeOut" },
                })}
            className={`flex w-full ${
              isRight ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex max-w-lg items-start gap-5 rounded-xl border border-border/50 bg-card p-5 shadow-md ${
                isRight ? "flex-row-reverse text-right" : ""
              }`}
            >
              <div className="relative flex shrink-0 items-center justify-center">
                <div className="flex size-12 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary shadow-[0_0_24px_hsl(var(--primary)/0.1)] sm:size-14">
                  <step.icon className="size-5 sm:size-6" />
                </div>
                <span className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-sm">
                  {i + 1}
                </span>
              </div>

              <div className="space-y-3 pt-1">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
                    {t(step.titleKey)}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {t(step.descKey)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 border-border/50 font-medium transition-all hover:border-primary/40 hover:bg-primary/[0.06]"
                  asChild
                >
                  <Link
                    href={step.href}
                    {...(step.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {t(step.buttonKey)}
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </section>
  );
}
