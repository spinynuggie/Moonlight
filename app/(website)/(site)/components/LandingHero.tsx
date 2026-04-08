"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Activity, ArrowRight, BarChart3, BookOpen, UserPlus, Users } from "lucide-react";
import Link from "next/link";

import BackgroundVideo from "@/app/(website)/(site)/components/BackgroundVideo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useServerStatus } from "@/lib/hooks/api/useServerStatus";
import { useT } from "@/lib/i18n/utils";

const HERO_VIDEOS: string[] = [
  "/videos/landing-0.mp4",
  "/videos/landing-1.mp4",
  "/videos/landing-2.mp4",
  "/videos/landing-3.mp4",
];

export default function LandingHero() {
  const t = useT("pages.mainPage");
  const tGeneral = useT("general");
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = shouldReduceMotion ?? false;

  const { data: serverStatus } = useServerStatus();

  const fade = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, ease: "easeOut" as const, delay },
        };

  return (
    <section
      className="relative -mt-28 overflow-hidden"
      style={{ marginLeft: "calc(-50vw + 50%)", width: "100vw" }}
    >
      {/* Background with vignette mask on all edges */}
      <div
        className="absolute inset-0"
        style={{
          maskImage:
            "radial-gradient(ellipse 140% 80% at 50% 25%, black 55%, transparent 90%), linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
          WebkitMaskImage:
            "radial-gradient(ellipse 140% 80% at 50% 25%, black 55%, transparent 90%), linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in" as string,
        }}
      >
        {HERO_VIDEOS.length > 0 ? (
          <>
            <BackgroundVideo urls={HERO_VIDEOS} />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.12] via-background to-background" />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle, hsl(var(--primary) / 0.1) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <div className="absolute -right-20 top-1/4 size-64 rounded-full bg-primary/[0.08] blur-3xl" />
            <div className="absolute -left-20 bottom-1/4 size-48 rounded-full bg-primary/[0.06] blur-3xl" />
          </>
        )}
      </div>

      {/* Content constrained to normal page width */}
      <div className="relative mx-auto flex min-h-[75vh] w-full max-w-screen-2xl flex-col items-center justify-center px-6 pb-16 pt-28 text-center sm:px-16 xl:px-32 2xl:px-64">
        <motion.div {...fade(0)} className="max-w-2xl space-y-6">
          <h1 className="hero-heading-shadow text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="title-glow text-primary">
              {tGeneral("serverTitle.split.part1")}
            </span>
            <span className="text-foreground">
              {tGeneral("serverTitle.split.part2")}
            </span>
          </h1>

          <p className="hero-text-shadow mx-auto max-w-lg text-base font-medium leading-relaxed text-muted-foreground sm:text-lg">
            {t("features.description")}
          </p>

          <motion.div
            {...fade(0.2)}
            className="flex flex-col items-center gap-3 pt-2 sm:flex-row sm:justify-center sm:gap-4"
          >
            <Button
              size="lg"
              className="gap-2 px-6 font-semibold shadow-lg transition-all hover:shadow-[0_0_24px_hsl(var(--primary)/0.3)]"
              asChild
            >
              <Link href="/register">
                <UserPlus className="size-4" />
                {t("features.buttons.register")}
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-border/60 px-6 font-semibold transition-all hover:border-primary/40 hover:bg-primary/[0.06]"
              asChild
            >
              <Link href="/wiki#How%20to%20connect">
                <BookOpen className="size-4" />
                {t("features.buttons.wiki")}
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          {...(reduceMotion
            ? {}
            : {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { duration: 0.5, delay: 0.5 },
              })}
          className="hero-text-shadow flex flex-wrap items-center justify-center gap-3 pt-10 text-sm text-muted-foreground"
        >
          {serverStatus ? (
            <>
              <span className="flex items-center gap-1.5">
                <Activity className="size-3.5 text-[#8C977D]" />
                <span className="font-semibold text-foreground">
                  {serverStatus.users_online.toLocaleString()}
                </span>
                {t("statuses.usersOnline").toLowerCase()}
              </span>
              <span className="text-border">·</span>
              <span className="flex items-center gap-1.5">
                <Users className="size-3.5 text-primary" />
                <span className="font-semibold text-foreground">
                  {serverStatus.total_users.toLocaleString()}
                </span>
                {t("statuses.totalUsers").toLowerCase()}
              </span>
              <span className="text-border">·</span>
              <span className="flex items-center gap-1.5">
                <BarChart3 className="size-3.5 text-[#D9BC8C]" />
                <span className="font-semibold text-foreground">
                  {(serverStatus.total_scores ?? 0).toLocaleString()}
                </span>
                {t("statuses.totalScores").toLowerCase()}
              </span>
            </>
          ) : (
            <Skeleton className="h-5 w-48" />
          )}
        </motion.div>
      </div>
    </section>
  );
}
