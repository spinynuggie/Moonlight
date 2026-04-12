"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Activity, BarChart3, ChevronDown, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import BackgroundVideo from "@/app/(website)/(site)/components/BackgroundVideo";
import HeroVisualizer from "@/app/(website)/(site)/components/HeroVisualizer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useServerStatus } from "@/lib/hooks/api/useServerStatus";
import { useT } from "@/lib/i18n/utils";

const HERO_VIDEOS: string[] = [
  "/videos/zetsubou.mp4",
  "/videos/tsukinami.mp4",
  "/videos/crystalia.mp4",
  "/videos/temptation.mp4",
];

export default function LandingHero() {
  const t = useT("pages.mainPage");
  const tGeneral = useT("general");
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = shouldReduceMotion ?? false;

  const { data: serverStatus } = useServerStatus();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const circleY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const circleScale = useTransform(scrollYProgress, [0, 1], [1, 0.88]);
  const circleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const chevronOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

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
      ref={sectionRef}
      className="relative -mt-28 overflow-hidden"
      style={{ marginLeft: "calc(-50vw + 50%)", width: "100vw" }}
    >
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
            <BackgroundVideo urls={HERO_VIDEOS} poster="/images/poster.png" />
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

      <div className="relative mx-auto flex min-h-screen w-full max-w-screen-2xl flex-col items-center justify-center px-4 pb-24 pt-28 text-center sm:px-16">
        <div className="relative w-full max-w-[770px]">
          <motion.div
            className="relative"
            style={
              reduceMotion
                ? {}
                : {
                    y: circleY,
                    scale: circleScale,
                    opacity: circleOpacity,
                    willChange: "transform, opacity",
                  }
            }
          >
            {!reduceMotion && <HeroVisualizer />}
            <motion.div
              {...fade(0)}
              className="hero-breathe relative flex aspect-square w-full flex-col items-center rounded-[50%] border border-border px-[12%] py-[10%] shadow-2xl sm:px-[14%] sm:py-[12%]"
              style={{ boxShadow: "0 0 60px hsl(var(--primary) / 0.3), 0 0 120px hsl(var(--primary) / 0.05)" }}
            >
              <div className="absolute inset-0 rounded-[50%] bg-card" />
              <div
                className="pointer-events-none absolute inset-0 rounded-[50%]"
                style={{
                  backgroundImage: "radial-gradient(circle at 35% 30%, hsl(var(--primary) / 0.06) 0%, transparent 60%), radial-gradient(circle at 70% 75%, hsl(var(--primary) / 0.04) 0%, transparent 50%)",
                }}
              />
              <div className="relative z-10 flex flex-1 flex-col items-center justify-end pb-3 sm:pb-5">
                <h1 className="hero-heading-shadow text-center text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl">
                  <span className="title-glow text-primary">
                    {tGeneral("serverTitle.split.part1")}
                  </span>
                  <span className="text-foreground">
                    {tGeneral("serverTitle.split.part2")}
                  </span>
                </h1>
              </div>

              <div className="relative z-10 flex flex-1 flex-col items-center gap-2 pt-3 sm:gap-3 sm:pt-5">
                <p className="mx-auto max-w-52 text-xs font-medium leading-relaxed text-muted-foreground sm:max-w-xs sm:text-base">
                  {t("features.description")}
                </p>
                <motion.div
                  {...(reduceMotion
                    ? {}
                    : {
                        initial: { opacity: 0 },
                        animate: { opacity: 1 },
                        transition: { duration: 0.5, delay: 0.5 },
                      })}
                  className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-muted-foreground sm:gap-3 sm:text-sm"
                >
                  {serverStatus && mounted ? (
                    <>
                      <span className="flex items-center gap-1 whitespace-nowrap sm:gap-1.5">
                        <Activity className="size-2.5 text-[#8C977D] sm:size-3.5" />
                        <span className="font-semibold text-foreground">
                          {serverStatus.users_online.toLocaleString()}
                        </span>
                        {t("statuses.usersOnline").toLowerCase()}
                      </span>
                      <span className="text-border">·</span>
                      <span className="flex items-center gap-1 whitespace-nowrap sm:gap-1.5">
                        <Users className="size-2.5 text-primary sm:size-3.5" />
                        <span className="font-semibold text-foreground">
                          {serverStatus.total_users.toLocaleString()}
                        </span>
                        {t("statuses.totalUsers").toLowerCase()}
                      </span>
                      <span className="text-border">·</span>
                      <span className="flex items-center gap-1 whitespace-nowrap sm:gap-1.5">
                        <BarChart3 className="size-2.5 text-[#D9BC8C] sm:size-3.5" />
                        <span className="font-semibold text-foreground">
                          {(serverStatus.total_scores ?? 0).toLocaleString()}
                        </span>
                        {t("statuses.totalScores").toLowerCase()}
                      </span>
                    </>
                  ) : (
                    <Skeleton className="h-4 w-40 sm:h-5 sm:w-48" />
                  )}
                </motion.div>
                <Link href="/register" className="mt-3 sm:mt-5">
                  <Button
                    className="cta-glow h-9 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors duration-300 hover:bg-primary/90 sm:h-10 sm:px-8 sm:text-base"
                  >
                    Sign me up!
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        style={reduceMotion ? {} : { opacity: chevronOpacity }}
      >
        <motion.div
          {...(reduceMotion
            ? {}
            : {
                initial: { opacity: 0 },
                animate: { opacity: 1, y: [0, 6, 0] },
                transition: {
                  opacity: { duration: 0.6, delay: 0.8 },
                  y: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
                },
              })}
        >
          <ChevronDown className="size-5 text-muted-foreground/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
