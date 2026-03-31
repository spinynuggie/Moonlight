"use client";
import { motion } from "framer-motion";
import { ArrowRight, Music, Newspaper, Wifi } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";

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
import type { BeatmapSetEventsResponse } from "@/lib/types/api";
import { BeatmapEventType, BeatmapStatusWeb } from "@/lib/types/api";

function CTACardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-[10px] border border-border/50 bg-card p-5 shadow-md">
      <div className="flex flex-col items-center gap-3 text-center">
        <Skeleton className="size-10 rounded-full" />
        <div className="w-full space-y-2">
          <Skeleton className="mx-auto h-4 w-32" />
          <Skeleton className="mx-auto h-3 w-48" />
        </div>
        <Skeleton className="h-8 w-full rounded-md" />
      </div>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-4 pt-4">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">{icon}</span>
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function Home() {
  const [isMaintenanceDialogOpen, setMaintenanceDialogOpen] = useState<
    boolean | null
  >(null);

  const t = useT("pages.mainPage");
  const tGeneral = useT("general");

  const { self } = useSelf();

  const serverStatusQuery = useServerStatus();
  const serverStatus = serverStatusQuery.data;

  const { data: newsPosts, isLoading: newsLoading } = useNews();

  const beatmapSearch = useBeatmapsetSearch("", 6, [BeatmapStatusWeb.RANKED], undefined, true);
  const beatmapSets = beatmapSearch.data?.[0]?.sets ?? [];
  const beatmapsLoading = beatmapSearch.isLoading;

  const { data: eventsData } = useSWR<BeatmapSetEventsResponse>(
    beatmapSets.length > 0 ? "beatmapset/events?limit=50" : null,
  );

  const rankedDateMap = useMemo(() => {
    const map = new Map<number, string>();
    if (!eventsData?.events)
      return map;
    for (const event of eventsData.events) {
      if (
        event.type === BeatmapEventType.BEATMAP_STATUS_CHANGED
        && event.new_status === BeatmapStatusWeb.RANKED
        && !map.has(event.beatmapset_id)
      ) {
        map.set(event.beatmapset_id, event.created_at);
      }
    }
    return map;
  }, [eventsData]);

  useEffect(() => {
    if (serverStatus?.is_on_maintenance && isMaintenanceDialogOpen == null) {
      setMaintenanceDialogOpen(true);
    }
  }, [serverStatus?.is_on_maintenance, isMaintenanceDialogOpen]);

  return (
    <div className="w-full space-y-4">
      {/* ═══════════════ HERO BANNER ═══════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[10px] border border-border/50 bg-card shadow-md"
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
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="title-glow text-primary">
              {tGeneral("serverTitle.split.part1")}
            </span>
            <span className="text-current">
              {tGeneral("serverTitle.split.part2")}
            </span>
          </h1>
          <p className="mt-2 text-sm font-medium tracking-wide text-muted-foreground">
            {self
              ? t("features.greeting", { username: self.username })
              : t("features.motto")}
          </p>
        </div>
      </motion.section>

      {/* ═══════════════ TWO-COLUMN CONTENT ═══════════════ */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* ─── Left Column: News + CTAs ─── */}
        <div className="space-y-4 lg:col-span-2">
          {/* News Section */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
            className="overflow-hidden rounded-[10px] border border-border/50 bg-card shadow-md"
          >
            <SectionHeader
              icon={<Newspaper className="size-4" />}
              title={t("news.title")}
            >
              <Link
                href="/news"
                className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("news.viewAll")}
                <ArrowRight className="size-3.5" />
              </Link>
            </SectionHeader>

            <div className="p-4">
              {newsLoading
                ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={`news-skeleton-${i}`}
                          className={`overflow-hidden rounded-lg border ${i === 0 ? "md:col-span-2" : ""}`}
                        >
                          <Skeleton className={`w-full rounded-none ${i === 0 ? "h-48" : "h-36"}`} />
                          <div className="space-y-2 p-4">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                : newsPosts && newsPosts.length > 0
                  ? (
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {newsPosts.slice(0, 5).map((post, i) => (
                          <div
                            key={post.slug}
                            className={`duration-300 animate-in fade-in ${i === 0 ? "md:col-span-2" : ""}`}
                            style={{
                              animationDelay: `${Math.min(i * 100, 600)}ms`,
                              animationFillMode: "backwards",
                            }}
                          >
                            <NewsCard post={post} featured={i === 0} />
                          </div>
                        ))}
                      </div>
                    )
                  : (
                      <p className="py-8 text-center text-sm text-muted-foreground">
                        {t("news.empty")}
                      </p>
                    )}
            </div>
          </motion.div>

          {/* CTA Cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {newsLoading
              ? (
                  <>
                    <CTACardSkeleton />
                    <CTACardSkeleton />
                  </>
                )
              : (
                  <>
                    <div
                      className="duration-300 animate-in fade-in"
                      style={{ animationDelay: "200ms", animationFillMode: "backwards" }}
                    >
                      <ConnectBanner />
                    </div>
                    <div
                      className="duration-300 animate-in fade-in"
                      style={{ animationDelay: "275ms", animationFillMode: "backwards" }}
                    >
                      <SupportCard />
                    </div>
                  </>
                )}
          </div>
        </div>

        {/* ─── Right Column: Sidebar Widgets ─── */}
        <aside className="space-y-3 lg:col-span-1">
          {/* Server Status */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
            className="overflow-hidden rounded-[10px] border border-border/50 bg-card shadow-md"
          >
            <SectionHeader
              icon={<Wifi className="size-4" />}
              title={t("statuses.serverStatus")}
            >
              {serverStatus
                ? (
                    <span
                      className={`flex items-center gap-1.5 text-xs font-medium ${
                        serverStatus.is_online && !serverStatus.is_on_maintenance
                          ? "text-[#8C977D]"
                          : serverStatus.is_on_maintenance
                            ? "text-orange-500"
                            : "text-red-500"
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          serverStatus.is_online && !serverStatus.is_on_maintenance
                            ? "status-online-pulse bg-[#8C977D]"
                            : serverStatus.is_on_maintenance
                              ? "bg-orange-500"
                              : "bg-red-500"
                        }`}
                      />
                      {serverStatus.is_online && !serverStatus.is_on_maintenance
                        ? t("statuses.online")
                        : serverStatus.is_on_maintenance
                          ? t("statuses.underMaintenance")
                          : t("statuses.offline")}
                    </span>
                  )
                : null}
            </SectionHeader>

            <div className="p-4 pt-3">
              <ServerStatsWidget serverStatus={serverStatus} />
            </div>
          </motion.div>

          {/* Recently Ranked Beatmaps */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
            className="overflow-hidden rounded-[10px] border border-border/50 bg-card shadow-md"
          >
            <SectionHeader
              icon={<Music className="size-4" />}
              title={t("beatmaps.title")}
            >
              <Link
                href="/beatmaps/search"
                className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("beatmaps.viewAll")}
                <ArrowRight className="size-3.5" />
              </Link>
            </SectionHeader>

            <div className="p-4 pt-3">
              {beatmapsLoading
                ? (
                    <div className="space-y-2">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={`skeleton-${i}`} className="h-16 w-full rounded-lg" />
                      ))}
                    </div>
                  )
                : beatmapSets.length > 0
                  ? (
                      <div className="space-y-2">
                        {beatmapSets.map((set, i) => (
                          <div
                            key={set.id}
                            className="duration-300 animate-in fade-in"
                            style={{
                              animationDelay: `${Math.min(i * 75, 600)}ms`,
                              animationFillMode: "backwards",
                            }}
                          >
                            <BeatmapsetRowElement beatmapSet={set} hideStatus hideDifficulties rankedDate={rankedDateMap.get(set.id)} />
                          </div>
                        ))}
                      </div>
                    )
                  : (
                      <p className="py-8 text-center text-sm text-muted-foreground">
                        {t("beatmaps.empty")}
                      </p>
                    )}
            </div>
          </motion.div>
        </aside>
      </div>

      <ServerMaintenanceDialog
        open={!!isMaintenanceDialogOpen}
        setOpen={setMaintenanceDialogOpen}
      />
    </div>
  );
}
