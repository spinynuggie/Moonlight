"use client";
import { useReducedMotion } from "framer-motion";
import { ArrowRight, Music, Newspaper, Wifi } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import ConnectBanner from "@/app/(website)/(site)/components/ConnectBanner";
import HomePageSkeleton from "@/app/(website)/(site)/components/HomePageSkeleton";
import LandingPage from "@/app/(website)/(site)/components/LandingPage";
import ServerStatsWidget from "@/app/(website)/(site)/components/ServerStatsWidget";
import SupportCard from "@/app/(website)/(site)/components/SupportCard";
import NewsCard from "@/app/(website)/news/components/NewsCard";
import BeatmapsetRowElement from "@/components/BeatmapsetRowElement";
import ServerMaintenanceDialog from "@/components/ServerMaintenanceDialog";
import { useBeatmapsetSearch } from "@/lib/hooks/api/beatmap/useBeatmapsetSearch";
import { useNews } from "@/lib/hooks/api/useNews";
import { useServerStatus } from "@/lib/hooks/api/useServerStatus";
import useSelf from "@/lib/hooks/useSelf";
import { useT } from "@/lib/i18n/utils";
import { BeatmapStatusWeb } from "@/lib/types/api";
import { cn } from "@/lib/utils";

const CARD_CLASS = "relative overflow-hidden rounded-xl border border-border/50 bg-card shadow-md transition-all duration-300 hover:border-primary/20 hover:shadow-[0_4px_32px_rgba(0,0,0,0.2),0_0_24px_hsl(var(--primary)/0.06)]";

let hasAnimated = false;

function CardOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-transparent" />
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
    <div
      className="relative flex items-center justify-between gap-3 px-4 py-3"
    >
      <div className="absolute inset-x-4 bottom-0 h-px bg-gradient-to-r from-border/60 via-border/30 to-transparent" />
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">{icon}</span>
        <h2 className="text-sm font-semibold tracking-tight text-foreground/95 sm:text-[15px]">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function Home() {
  const { self, isLoading } = useSelf();
  const resolvedRef = useRef(false);

  if (!isLoading)
    resolvedRef.current = true;
  if (!resolvedRef.current)
    return <HomePageSkeleton />;

  return self ? <HomeLoggedIn /> : <LandingPage />;
}

function HomeLoggedIn() {
  const [isMaintenanceDialogOpen, setMaintenanceDialogOpen] = useState<
    boolean | null
  >(null);
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = shouldReduceMotion ?? false;

  const isFirstMount = useRef(!hasAnimated);
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

  const isDataReady = !newsLoading && !beatmapsLoading && serverStatus !== undefined;
  const [showSkeleton, setShowSkeleton] = useState(!isDataReady);
  const [isCrossfading, setIsCrossfading] = useState(false);
  const dataReadyRef = useRef(isDataReady);

  useEffect(() => {
    if (isDataReady && !dataReadyRef.current) {
      dataReadyRef.current = true;
      setIsCrossfading(true);
      const timer = setTimeout(() => {
        setShowSkeleton(false);
        setIsCrossfading(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isDataReady]);

  useEffect(() => {
    if (serverStatus?.is_on_maintenance && isMaintenanceDialogOpen == null) {
      setMaintenanceDialogOpen(true);
    }
  }, [serverStatus?.is_on_maintenance, isMaintenanceDialogOpen]);

  const isRevisit = !isFirstMount.current;

  return (
    <div className="relative w-full">
      {showSkeleton && (
        <div
          className={cn(
            isCrossfading
            && "home-crossfade-out pointer-events-none absolute inset-x-0 top-0 z-10",
          )}
        >
          <HomePageSkeleton />
        </div>
      )}

      {isDataReady && (
        <div
          className={cn(
            "space-y-4",
            !reduceMotion && (isCrossfading ? "home-crossfade-in" : isRevisit && "home-quick-fade-in"),
          )}
        >
          <section className="relative overflow-hidden rounded-xl border border-border/50 bg-card shadow-md">
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
                <span className="text-primary">
                  {tGeneral("serverTitle.split.part1")}
                </span>
                <span className="text-current">
                  {tGeneral("serverTitle.split.part2")}
                </span>
              </h1>
              <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed tracking-wide text-muted-foreground">
                {self
                  ? t("features.greeting", { username: self.username })
                  : t("features.motto")}
              </p>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
            <div className="space-y-5 lg:col-span-2">
              <div className={CARD_CLASS}>
                <CardOverlay />
                <SectionHeader
                  icon={<Newspaper className="size-4" />}
                  title={t("news.title")}
                >
                  <Link
                    href="/news"
                    className="flex items-center gap-1 rounded-md px-1 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {t("news.viewAll")}
                    <ArrowRight className="size-3.5" />
                  </Link>
                </SectionHeader>

                <div className="relative p-4">
                  {newsPosts && newsPosts.length > 0
                    ? (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {newsPosts.slice(0, 5).map((post, i) => (
                            <div
                              key={post.slug}
                              className={i === 0 ? "md:col-span-2" : ""}
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
              </div>

              <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
                <ConnectBanner />
                <SupportCard />
              </div>
            </div>

            <aside className="space-y-4 lg:col-span-1">
              <div className={CARD_CLASS}>
                <CardOverlay />
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

                <div className="relative p-4 pt-3">
                  <ServerStatsWidget
                    serverStatus={serverStatus}
                    animateCounters={isFirstMount.current && !reduceMotion}
                  />
                </div>
              </div>

              <div className={CARD_CLASS}>
                <CardOverlay />
                <SectionHeader
                  icon={<Music className="size-4" />}
                  title={t("beatmaps.title")}
                >
                  <Link
                    href="/beatmaps/search"
                    className="flex items-center gap-1 rounded-md px-1 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {t("beatmaps.viewAll")}
                    <ArrowRight className="size-3.5" />
                  </Link>
                </SectionHeader>

                <div className="relative p-4 pt-3">
                  {beatmapSets.length > 0
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
                </div>
              </div>
            </aside>
          </div>

          <ServerMaintenanceDialog
            open={!!isMaintenanceDialogOpen}
            setOpen={setMaintenanceDialogOpen}
          />
        </div>
      )}
    </div>
  );
}
