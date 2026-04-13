"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Music, Newspaper, Wifi } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import ConnectBanner from "@/app/(website)/(site)/components/ConnectBanner";
import ServerStatsWidget from "@/app/(website)/(site)/components/ServerStatsWidget";
import SupportCard from "@/app/(website)/(site)/components/SupportCard";
import NewsCard from "@/app/(website)/news/components/NewsCard";
import BeatmapsetRowElement from "@/components/BeatmapsetRowElement";
import ServerMaintenanceDialog from "@/components/ServerMaintenanceDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useBeatmapsetSearch } from "@/lib/hooks/api/beatmap/useBeatmapsetSearch";
import { useNews } from "@/lib/hooks/api/useNews";
import { useServerStatus } from "@/lib/hooks/api/useServerStatus";
import useSelf from "@/lib/hooks/useSelf";
import { useT } from "@/lib/i18n/utils";
import { BeatmapStatusWeb } from "@/lib/types/api";

const CARD_CLASS = "relative overflow-hidden rounded-xl border border-border/50 bg-card shadow-md transition-all duration-300 hover:border-primary/20 hover:shadow-[0_4px_32px_rgba(0,0,0,0.2),0_0_24px_hsl(var(--primary)/0.06)]";

let hasAnimated = false;

function getRevealMotion(shouldReduceMotion: boolean, shouldAnimate: boolean, delay = 0) {
  if (shouldReduceMotion || !shouldAnimate)
    return {};
  return {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" as const, delay },
  };
}

function CardOverlay() {
  return <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-transparent" />;
}

function SectionHeader({ icon, title, children }: { icon: React.ReactNode; title: string; children?: React.ReactNode }) {
  return (
    <div className="relative flex items-center justify-between gap-3 px-4 py-3">
      <div className="absolute inset-x-4 bottom-0 h-px bg-gradient-to-r from-border/60 via-border/30 to-transparent" />
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">{icon}</span>
        <h2 className="text-sm font-semibold tracking-tight text-foreground/95 sm:text-[15px]">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function HomeLoggedIn() {
  const [isMaintenanceDialogOpen, setMaintenanceDialogOpen] = useState<boolean | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = shouldReduceMotion ?? false;

  const isFirstMountRef = useRef(!hasAnimated);
  useEffect(() => { hasAnimated = true; }, []);

  const t = useT("pages.mainPage");
  const tGeneral = useT("general");

  const { self } = useSelf();

  const serverStatusQuery = useServerStatus();
  const serverStatus = serverStatusQuery.data;

  const { data: newsPosts, isLoading: newsLoading } = useNews();

  const beatmapSearch = useBeatmapsetSearch("", 6, [BeatmapStatusWeb.RANKED], undefined, true, { revalidateOnFocus: false });
  const beatmapSets = beatmapSearch.data?.[0]?.sets ?? [];
  const beatmapsLoading = beatmapSearch.isLoading;

  const shouldAnimateEntrance = useRef(
    isFirstMountRef.current && !(serverStatus && newsPosts && beatmapSets.length > 0),
  ).current;

  useEffect(() => {
    if (serverStatus?.is_on_maintenance && isMaintenanceDialogOpen == null) {
      setMaintenanceDialogOpen(true);
    }
  }, [serverStatus?.is_on_maintenance, isMaintenanceDialogOpen]);

  const repeatVisitClass = !shouldAnimateEntrance && !reduceMotion ? "home-quick-fade-in" : "";
  const newsItemAnimationClass = shouldAnimateEntrance
    ? "motion-safe:duration-300 motion-safe:animate-in motion-safe:fade-in motion-reduce:animate-none"
    : "";

  return (
    <div className={`w-full space-y-4 ${repeatVisitClass}`}>
      <motion.section
        {...getRevealMotion(reduceMotion, shouldAnimateEntrance, 0)}
        className="relative overflow-hidden rounded-xl border border-border/50 bg-card shadow-md"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, hsl(var(--primary) / 0.08) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            maskImage: "linear-gradient(to bottom right, black 30%, transparent 80%)",
            WebkitMaskImage: "linear-gradient(to bottom right, black 30%, transparent 80%)",
          }}
        />
        <div className="relative p-6">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            <span className="text-primary">{tGeneral("serverTitle.split.part1")}</span>
            <span className="text-current">{tGeneral("serverTitle.split.part2")}</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed tracking-wide text-muted-foreground">
            {self ? t("features.greeting", { username: self.username }) : t("features.motto")}
          </p>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
        <div className="space-y-5 lg:col-span-2">
          <motion.div {...getRevealMotion(reduceMotion, shouldAnimateEntrance, 0.1)} className={CARD_CLASS}>
            <CardOverlay />
            <SectionHeader icon={<Newspaper className="size-4" />} title={t("news.title")}>
              <Link href="/news" className="flex items-center gap-1 rounded-md px-1 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                {t("news.viewAll")}
                <ArrowRight className="size-3.5" />
              </Link>
            </SectionHeader>
            <div className="relative p-4">
              <AnimatePresence mode="wait">
                {newsLoading
                  ? (
                      <motion.div key="news-skeleton" exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {["hero", "a", "b", "c"].map((key, i) => (
                            <div key={`news-skeleton-${key}`} className={`overflow-hidden rounded-lg border ${i === 0 ? "md:col-span-2" : ""}`}>
                              <Skeleton className={`w-full rounded-none ${i === 0 ? "h-48" : "h-36"}`} />
                              <div className="space-y-2 p-4">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )
                  : newsPosts && newsPosts.length > 0
                    ? (
                        <motion.div key="news-loaded" {...(shouldAnimateEntrance ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2 } } : {})}>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {newsPosts.slice(0, 5).map((post, i) => (
                              <div
                                key={post.slug}
                                className={`${newsItemAnimationClass} ${i === 0 ? "md:col-span-2" : ""}`.trim()}
                                style={shouldAnimateEntrance ? { animationDelay: `${Math.min(i * 100, 600)}ms`, animationFillMode: "backwards" } : undefined}
                              >
                                <NewsCard post={post} featured={i === 0} />
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )
                    : (
                        <motion.div key="news-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                          <p className="py-8 text-center text-sm text-muted-foreground">{t("news.empty")}</p>
                        </motion.div>
                      )}
              </AnimatePresence>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-3 border-t border-border/30 pt-1 sm:grid-cols-2">
            <div className={newsItemAnimationClass} style={shouldAnimateEntrance ? { animationDelay: "200ms", animationFillMode: "backwards" } : undefined}>
              <ConnectBanner />
            </div>
            <div className={newsItemAnimationClass} style={shouldAnimateEntrance ? { animationDelay: "275ms", animationFillMode: "backwards" } : undefined}>
              <SupportCard />
            </div>
          </div>
        </div>

        <aside className="space-y-4 lg:col-span-1">
          <motion.div {...getRevealMotion(reduceMotion, shouldAnimateEntrance, 0.05)} className={CARD_CLASS}>
            <CardOverlay />
            <SectionHeader icon={<Wifi className="size-4" />} title={t("statuses.serverStatus")}>
              {serverStatus
                ? (
                    <span className={`flex items-center gap-1.5 text-xs font-medium ${serverStatus.is_online && !serverStatus.is_on_maintenance ? "text-[#8C977D]" : serverStatus.is_on_maintenance ? "text-orange-500" : "text-red-500"}`}>
                      <span className={`size-1.5 rounded-full ${serverStatus.is_online && !serverStatus.is_on_maintenance ? "status-online-pulse bg-[#8C977D]" : serverStatus.is_on_maintenance ? "bg-orange-500" : "bg-red-500"}`} />
                      {serverStatus.is_online && !serverStatus.is_on_maintenance ? t("statuses.online") : serverStatus.is_on_maintenance ? t("statuses.underMaintenance") : t("statuses.offline")}
                    </span>
                  )
                : null}
            </SectionHeader>
            <div className="relative p-4 pt-3">
              <ServerStatsWidget serverStatus={serverStatus} animateCounters={isFirstMountRef.current && !reduceMotion} />
            </div>
          </motion.div>

          <motion.div {...getRevealMotion(reduceMotion, shouldAnimateEntrance, 0.15)} className={CARD_CLASS}>
            <CardOverlay />
            <SectionHeader icon={<Music className="size-4" />} title={t("beatmaps.title")}>
              <Link href="/beatmaps/search" className="flex items-center gap-1 rounded-md px-1 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                {t("beatmaps.viewAll")}
                <ArrowRight className="size-3.5" />
              </Link>
            </SectionHeader>
            <div className="relative p-4 pt-3">
              <AnimatePresence mode="wait">
                {beatmapsLoading
                  ? (
                      <motion.div key="beatmaps-skeleton" exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                        <div className="space-y-2">
                          {["a", "b", "c", "d", "e", "f"].map(key => (
                            <Skeleton key={`skeleton-${key}`} className="h-16 w-full rounded-lg" />
                          ))}
                        </div>
                      </motion.div>
                    )
                  : beatmapSets.length > 0
                    ? (
                        <motion.div key="beatmaps-loaded" {...(shouldAnimateEntrance ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2 } } : {})}>
                          <div className="space-y-2">
                            {beatmapSets.map((set, i) => (
                              <div
                                key={set.id}
                                className={newsItemAnimationClass}
                                style={shouldAnimateEntrance ? { animationDelay: `${Math.min(i * 75, 600)}ms`, animationFillMode: "backwards" } : undefined}
                              >
                                <BeatmapsetRowElement beatmapSet={set} hideStatus hideDifficulties />
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )
                    : (
                        <motion.div key="beatmaps-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                          <p className="py-8 text-center text-sm text-muted-foreground">{t("beatmaps.empty")}</p>
                        </motion.div>
                      )}
              </AnimatePresence>
            </div>
          </motion.div>
        </aside>
      </div>

      <ServerMaintenanceDialog open={!!isMaintenanceDialogOpen} setOpen={setMaintenanceDialogOpen} />
    </div>
  );
}
