"use client";
import { ArrowRight, BookOpen, Music, Newspaper } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import RecentUsersIcons from "@/app/(website)/(site)/components/RecentUsersIcons";
import ServerStatus from "@/app/(website)/(site)/components/ServerStatus";
import NewsCard from "@/app/(website)/news/components/NewsCard";
import BeatmapsetRowElement from "@/components/BeatmapsetRowElement";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import ServerMaintenanceDialog from "@/components/ServerMaintenanceDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBeatmapsetSearch } from "@/lib/hooks/api/beatmap/useBeatmapsetSearch";
import { useNews } from "@/lib/hooks/api/useNews";
import { useServerStatus } from "@/lib/hooks/api/useServerStatus";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";
import { useT } from "@/lib/i18n/utils";
import { BeatmapStatusWeb } from "@/lib/types/api";

export default function Home() {
  const [isMaintenanceDialogOpen, setMaintenanceDialogOpen] = useState<
    boolean | null
  >(null);

  const t = useT("pages.mainPage");
  const tGeneral = useT("general");

  const serverStatusQuery = useServerStatus();
  const serverStatus = serverStatusQuery.data;

  const { data: newsPosts, isLoading: newsLoading } = useNews();

  const beatmapSearch = useBeatmapsetSearch("", 6, [BeatmapStatusWeb.RANKED], undefined, true);
  const beatmapSets = beatmapSearch.data?.[0]?.sets ?? [];
  const beatmapsLoading = beatmapSearch.isLoading;

  useEffect(() => {
    if (serverStatus?.is_on_maintenance && isMaintenanceDialogOpen == null) {
      setMaintenanceDialogOpen(true);
    }
  }, [serverStatus?.is_on_maintenance, isMaintenanceDialogOpen]);

  useScrollReveal();

  return (
    <div className="w-full space-y-6">
      {/* ═══════════════ WELCOME ═══════════════ */}
      <section className="pb-4 pt-8 text-center">
        <h1 className="hero-animate text-5xl font-semibold tracking-tight sm:text-6xl">
          <span className="title-glow text-primary">
            {tGeneral("serverTitle.split.part1")}
          </span>
          <span className="text-current">
            {tGeneral("serverTitle.split.part2")}
          </span>
        </h1>
        <p className="hero-animate hero-animate-delay-1 mt-3 text-sm font-medium tracking-wide text-muted-foreground">
          {t("features.motto")}
        </p>
        <p className="hero-animate hero-animate-delay-2 mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {t("features.description")}
        </p>
        <div className="hero-animate hero-animate-delay-3 mt-6 flex items-center justify-center gap-3">
          <Button
            className="smooth-transition animate-gradient bg-gradient-to-r from-[#8DA3B9] to-[#252525]/50 bg-[length:300%_300%] shadow-[0_0_25px_rgba(141,163,185,0.25)] hover:scale-105 hover:shadow-[0_0_35px_rgba(141,163,185,0.35)]"
            size="lg"
            asChild
          >
            <Link href="/register">{t("features.buttons.register")}</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/wiki#How%20to%20connect">
              {t("features.buttons.wiki")}
            </Link>
          </Button>
        </div>
      </section>

      {/* ═══════════════ SERVER STATUS ═══════════════ */}
      <section className="hero-animate hero-animate-delay-4">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <ServerStatus
            type="server_status"
            data={
              serverStatus
                ? serverStatus.is_online
                  ? serverStatus.is_on_maintenance
                    ? t("statuses.underMaintenance")
                    : t("statuses.online")
                  : t("statuses.offline")
                : undefined
            }
          />
          <ServerStatus type="total_users" data={serverStatus?.total_users}>
            {serverStatus && (
              <RecentUsersIcons users={serverStatus.recent_users!} />
            )}
          </ServerStatus>
          <ServerStatus type="users_online" data={serverStatus?.users_online}>
            {serverStatus && (
              <RecentUsersIcons users={serverStatus.current_users_online!} />
            )}
          </ServerStatus>
          <ServerStatus
            type="total_scores"
            data={serverStatus?.total_scores ?? undefined}
          />
        </div>
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
                    {Array.from({ length: 3 }).map((_, i) => (
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
                      {newsPosts.slice(0, 3).map(post => (
                        <NewsCard key={post.slug} post={post} />
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

        {/* ─── Right Column: Newly Ranked Beatmaps ─── */}
        <section className="scroll-reveal scroll-reveal-delay-1">
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
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={`skeleton-${i}`} className="h-16 w-full rounded-lg" />
                    ))}
                  </div>
                )
              : beatmapSets.length > 0
                ? (
                    <div className="space-y-2">
                      {beatmapSets.map(set => (
                        <BeatmapsetRowElement key={set.id} beatmapSet={set} hideStatus hideDifficulties />
                      ))}
                    </div>
                  )
                : (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      {t("beatmaps.empty")}
                    </p>
                  )}
          </RoundedContent>
        </section>
      </div>

      {/* ═══════════════ CONNECTION GUIDE ═══════════════ */}
      <section className="scroll-reveal scroll-reveal-delay-2">
        <Card className="border bg-card">
          <CardContent className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:justify-between">
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-semibold tracking-tight">
                {t("connectGuide.title")}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("connectGuide.description")}
              </p>
            </div>
            <Button className="shrink-0" asChild>
              <Link href="/wiki#How%20to%20connect">
                <BookOpen className="mr-2 size-4" />
                {t("connectGuide.button")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <ServerMaintenanceDialog
        open={!!isMaintenanceDialogOpen}
        setOpen={setMaintenanceDialogOpen}
      />
    </div>
  );
}
