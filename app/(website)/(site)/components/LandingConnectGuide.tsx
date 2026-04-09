"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Download, FileText, UserPlus } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

import { useT } from "@/lib/i18n/utils";

const STEPS = [
  {
    icon: Download,
    titleKey: "howToStart.downloadTile.title" as const,
    buttonKey: "howToStart.downloadTile.button" as const,
    href: "https://osu.ppy.sh/home/download",
    external: true,
  },
  {
    icon: UserPlus,
    titleKey: "howToStart.registerTile.title" as const,
    buttonKey: "howToStart.registerTile.button" as const,
    href: "/register",
    external: false,
  },
  {
    icon: FileText,
    titleKey: "howToStart.guideTile.title" as const,
    buttonKey: "howToStart.guideTile.button" as const,
    href: "/wiki#How%20to%20connect",
    external: false,
  },
] as const;

export default function LandingConnectGuide() {
  const t = useT("pages.mainPage");
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = shouldReduceMotion ?? false;

  const fade = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20, scale: 0.95 },
          whileInView: { opacity: 1, y: 0, scale: 1 },
          viewport: { once: true, margin: "-60px" as const },
          transition: { duration: 0.5, ease: "easeOut" as const, delay },
        };

  const circleContent = (step: (typeof STEPS)[number], i: number) => (
    <Link
      href={step.href}
      {...(step.external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className="group flex flex-col items-center"
    >
      <div
        className="relative flex size-24 items-center justify-center rounded-full border border-border bg-card shadow-[0_4px_24px_rgba(0,0,0,0.18),0_1px_6px_rgba(0,0,0,0.1)] transition-shadow duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.28),0_2px_8px_rgba(0,0,0,0.15)] sm:size-36"
      >
        <span className="absolute -right-0.5 -top-0.5 flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-sm sm:size-7 sm:text-sm">
          {i + 1}
        </span>
        <step.icon className="size-8 text-primary/80 transition-colors duration-300 group-hover:text-primary sm:size-10" />
      </div>

      <div className="mt-4 flex flex-col items-center gap-1 sm:mt-5">
        <span className="whitespace-nowrap text-xs font-medium text-foreground sm:text-sm">
          {t(step.titleKey)}
        </span>
        <span className="flex items-center gap-0.5 text-[10px] text-primary/60 transition-colors duration-200 group-hover:text-primary sm:text-xs">
          {t(step.buttonKey)}
          <ArrowRight className="size-2.5 sm:size-3" />
        </span>
      </div>
    </Link>
  );

  return (
    <section className="py-12 sm:py-20">
      <motion.h2
        {...(reduceMotion
          ? {}
          : {
              initial: { opacity: 0, y: 16 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, margin: "-60px" as const },
              transition: { duration: 0.4, ease: "easeOut" as const },
            })}
        className="mb-2 text-center text-2xl font-bold tracking-tight sm:text-3xl"
        style={{ textShadow: "0 2px 12px rgba(0, 0, 0, 0.3)" }}
      >
        Cool! How do I
        {" "}
        <span className="text-primary" style={{ textShadow: "0 2px 16px hsl(var(--primary) / 0.4)" }}>
          join
        </span>
        ?
      </motion.h2>
      <motion.p
        {...(reduceMotion
          ? {}
          : {
              initial: { opacity: 0, y: 12 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, margin: "-60px" as const },
              transition: { duration: 0.4, ease: "easeOut" as const, delay: 0.1 },
            })}
        className="mb-10 text-center text-sm text-muted-foreground sm:mb-14 sm:text-base"
      >
        It&apos;s only 3 steps!
      </motion.p>

      {/* Mobile: vertical stack */}
      <div className="flex flex-col items-center sm:hidden">
        {STEPS.map((step, i) => (
          <Fragment key={step.titleKey}>
            {i > 0 && (
              <div className="my-3 h-8 w-px bg-gradient-to-b from-border/60 via-border/30 to-border/60" />
            )}
            <motion.div {...fade(i * 0.15)} className="flex flex-col items-center">
              {circleContent(step, i)}
            </motion.div>
          </Fragment>
        ))}
      </div>

      {/* Desktop: zig-zag layout */}
      <div className="hidden items-start justify-center sm:flex">
        {/* Circle 1 */}
        <motion.div {...fade(0)} className="flex w-36 flex-col items-center">
          {circleContent(STEPS[0], 0)}
        </motion.div>

        {/* Connector 1→2 (angled down) */}
        <div
          className="mt-[72px] flex h-14 w-20 items-center justify-center overflow-hidden md:h-16 md:w-28"
        >
          <div
            className="h-[1.5px] w-[140%] rotate-[30deg]"
            style={{
              background:
                "linear-gradient(90deg, transparent 5%, hsl(var(--border) / 0.7) 30%, hsl(var(--border) / 0.7) 70%, transparent 95%)",
            }}
          />
        </div>

        {/* Circle 2 (offset down, centered) */}
        <motion.div
          {...fade(0.15)}
          className="mt-14 flex w-36 flex-col items-center md:mt-16"
        >
          {circleContent(STEPS[1], 1)}
        </motion.div>

        {/* Connector 2→3 (angled up) */}
        <div
          className="mt-[72px] flex h-14 w-20 items-center justify-center overflow-hidden md:h-16 md:w-28"
        >
          <div
            className="h-[1.5px] w-[140%] -rotate-[30deg]"
            style={{
              background:
                "linear-gradient(90deg, transparent 5%, hsl(var(--border) / 0.7) 30%, hsl(var(--border) / 0.7) 70%, transparent 95%)",
            }}
          />
        </div>

        {/* Circle 3 */}
        <motion.div {...fade(0.3)} className="flex w-36 flex-col items-center">
          {circleContent(STEPS[2], 2)}
        </motion.div>
      </div>
    </section>
  );
}
