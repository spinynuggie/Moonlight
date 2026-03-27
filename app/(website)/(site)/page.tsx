"use client";
import { ArrowRight, Music, Newspaper, Wifi } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";

import ServerStatsWidget from "@/app/(website)/(site)/components/ServerStatsWidget";
import SupportCard from "@/app/(website)/(site)/components/SupportCard";
import NewsCard from "@/app/(website)/news/components/NewsCard";
import BeatmapsetRowElement from "@/components/BeatmapsetRowElement";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import ServerMaintenanceDialog from "@/components/ServerMaintenanceDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBeatmapsetSearch } from "@/lib/hooks/api/beatmap/useBeatmapsetSearch";
import { useNews } from "@/lib/hooks/api/useNews";
import { useServerStatus } from "@/lib/hooks/api/useServerStatus";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";
import useSelf from "@/lib/hooks/useSelf";
import { useT } from "@/lib/i18n/utils";
import type { BeatmapSetEventsResponse } from "@/lib/types/api";
import { BeatmapEventType, BeatmapStatusWeb } from "@/lib/types/api";

export default function Home() {
  const [isMaintenanceDialogOpen, setMaintenanceDialogOpen] = useState<
    boolean | null
  >(null);

  const t = useT("pages.mainPage");
  const tGeneral = useT("general");

  const { self, isLoading: selfLoading } = useSelf();

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

  useScrollReveal();

  return (
    <div className="w-full space-y-6">
      {/* ═══════════════ HERO BANNER ═══════════════ */}
      <section className="hero-animate flex items-center justify-between gap-4 pt-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            <span className="title-glow text-primary">
              {tGeneral("serverTitle.split.part1")}
            </span>
            <span className="text-current">
              {tGeneral("serverTitle.split.part2")}
            </span>
          </h1>
          <p className="mt-1 text-xs font-medium tracking-wide text-muted-foreground">
            {self
              ? t("features.greeting", { username: self.username })
              : t("features.motto")}
          </p>
        </div>
        {!self && !selfLoading && (
          <Button
            className="smooth-transition shrink-0 animate-gradient bg-gradient-to-r from-[#8DA3B9] to-[#252525]/50 bg-[length:300%_300%] shadow-[0_0_25px_rgba(141,163,185,0.25)] hover:scale-105 hover:shadow-[0_0_35px_rgba(141,163,185,0.35)]"
            asChild
          >
            <Link href="/register">{t("features.buttons.register")}</Link>
          </Button>
        )}
      </section>

      {/* ═══════════════ TWO-COLUMN CONTENT ═══════════════ */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ─── Left Column: News ─── */}
        <section className="scroll-reveal lg:col-span-2">
          <PrettyHeader
            icon={<Newspaper className="size-5" />}
            text={t("news.title")}
          >
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              asChild
            >
              <Link href="/news">
                {t("news.viewAll")}
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </PrettyHeader>
          <RoundedContent>
            {newsLoading
              ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton
                        key={`news-skeleton-${i}`}
                        className="h-64 w-full rounded-lg"
                      />
                    ))}
                  </div>
                )
              : newsPosts && newsPosts.length > 0
                ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {newsPosts.slice(0, 5).map((post, i) => (
                        <div
                          key={post.slug}
                          className={`beatmap-stagger ${i === 0 ? "md:col-span-2" : ""}`}
                          style={{ animationDelay: `${i * 100}ms` }}
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
          </RoundedContent>
        </section>

        {/* ─── Right Column: Sidebar Widgets ─── */}
        <aside className="space-y-4 lg:col-span-1">
          <div className="scroll-reveal">
            <PrettyHeader
              icon={<Wifi className="size-5" />}
              text={t("statuses.serverStatus")}
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
            </PrettyHeader>
            <RoundedContent>
              <ServerStatsWidget serverStatus={serverStatus} />
            </RoundedContent>
          </div>

          <div className="scroll-reveal scroll-reveal-delay-1">
            <PrettyHeader
              icon={<Music className="size-5" />}
              text={t("beatmaps.title")}
            >
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                asChild
              >
                <Link href="/beatmaps/search">
                  {t("beatmaps.viewAll")}
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
            </PrettyHeader>
            <RoundedContent>
              {beatmapsLoading
                ? (
                    <div className="space-y-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={`skeleton-${i}`} className="h-16 w-full rounded-lg" />
                      ))}
                    </div>
                  )
                : beatmapSets.length > 0
                  ? (
                      <div className="space-y-2">
                        {beatmapSets.map((set, i) => (
                          <div key={set.id} className="beatmap-stagger" style={{ animationDelay: `${i * 75}ms` }}>
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
            </RoundedContent>
          </div>

          <div className="scroll-reveal scroll-reveal-delay-2">
            <SupportCard />
          </div>
        </aside>
      </div>

      <ServerMaintenanceDialog
        open={!!isMaintenanceDialogOpen}
        setOpen={setMaintenanceDialogOpen}
      />
    </div>
  );
}
