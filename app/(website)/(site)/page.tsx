"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Music, Newspaper, Wifi } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import ConnectBanner from "@/app/(website)/(site)/components/ConnectBanner";
import LandingPage from "@/app/(website)/(site)/components/LandingPage";
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

function getRevealMotion(shouldReduceMotion: boolean, delay = 0) {
  if (shouldReduceMotion) {
    return {};
  }

  return {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" as const, delay },
  };
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
    <div className="flex items-center justify-between gap-3 border-b border-border/40 px-4 py-3">
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
    return null;

  return self ? <HomeLoggedIn /> : <LandingPage />;
}

function HomeLoggedIn() {
  const [isMaintenanceDialogOpen, setMaintenanceDialogOpen] = useState<
    boolean | null
  >(null);
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = shouldReduceMotion ?? false;

  const t = useT("pages.mainPage");
  const tGeneral = useT("general");

  const { self } = useSelf();

  const serverStatusQuery = useServerStatus();
  const serverStatus = serverStatusQuery.data;

  const { data: newsPosts, isLoading: newsLoading } = useNews();

  const beatmapSearch = useBeatmapsetSearch("", 6, [BeatmapStatusWeb.RANKED], undefined, true, { revalidateOnFocus: false });
  const beatmapSets = beatmapSearch.data?.[0]?.sets ?? [];
  const beatmapsLoading = beatmapSearch.isLoading;

  useEffect(() => {
    if (serverStatus?.is_on_maintenance && isMaintenanceDialogOpen == null) {
      setMaintenanceDialogOpen(true);
    }
  }, [serverStatus?.is_on_maintenance, isMaintenanceDialogOpen]);

  return (
    <div className="w-full space-y-4">
      <motion.section
        {...getRevealMotion(reduceMotion, 0)}
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
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            <span className="title-glow text-primary">
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
      </motion.section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
        <div className="space-y-5 lg:col-span-2">
          <motion.div
            {...getRevealMotion(reduceMotion, 0.1)}
            className="overflow-hidden rounded-[10px] border border-border/50 bg-card shadow-md"
          >
            <SectionHeader
              icon={<Newspaper className="size-4" />}
              title={t("news.title")}
            >
              <Link
                href="/news"
                className="flex items-center gap-1 rounded-md px-1 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {t("news.viewAll")}
                <ArrowRight className="size-3.5" />
              </Link>
            </SectionHeader>

            <div className="p-4">
              <AnimatePresence mode="wait">
                {newsLoading ? (
                  <motion.div key="news-skeleton" exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {["hero", "a", "b", "c"].map((key, i) => (
                        <div
                          key={`news-skeleton-${key}`}
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
                  </motion.div>
                ) : newsPosts && newsPosts.length > 0
                  ? (
                      <motion.div key="news-loaded" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {newsPosts.slice(0, 5).map((post, i) => (
                            <div
                              key={post.slug}
                              className={`motion-safe:duration-300 motion-safe:animate-in motion-safe:fade-in motion-reduce:animate-none ${i === 0 ? "md:col-span-2" : ""}`}
                              style={{
                                animationDelay: `${Math.min(i * 100, 600)}ms`,
                                animationFillMode: "backwards",
                              }}
                            >
                              <NewsCard post={post} featured={i === 0} />
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )
                  : (
                      <motion.div key="news-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                        <p className="py-8 text-center text-sm text-muted-foreground">
                          {t("news.empty")}
                        </p>
                      </motion.div>
                    )}
              </AnimatePresence>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-3 border-t border-border/30 pt-1 sm:grid-cols-2">
            <div
              className="motion-safe:duration-300 motion-safe:animate-in motion-safe:fade-in motion-reduce:animate-none"
              style={{ animationDelay: "200ms", animationFillMode: "backwards" }}
            >
              <ConnectBanner />
            </div>
            <div
              className="motion-safe:duration-300 motion-safe:animate-in motion-safe:fade-in motion-reduce:animate-none"
              style={{ animationDelay: "275ms", animationFillMode: "backwards" }}
            >
              <SupportCard />
            </div>
          </div>
        </div>

        <aside className="space-y-4 lg:col-span-1">
          <motion.div
            {...getRevealMotion(reduceMotion, 0.05)}
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

          <motion.div
            {...getRevealMotion(reduceMotion, 0.15)}
            className="overflow-hidden rounded-[10px] border border-border/50 bg-card shadow-md"
          >
            <SectionHeader
              icon={<Music className="size-4" />}
              title={t("beatmaps.title")}
            >
              <Link
                href="/beatmaps/search"
                className="flex items-center gap-1 rounded-md px-1 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {t("beatmaps.viewAll")}
                <ArrowRight className="size-3.5" />
              </Link>
            </SectionHeader>

            <div className="p-4 pt-3">
              <AnimatePresence mode="wait">
                {beatmapsLoading ? (
                  <motion.div key="beatmaps-skeleton" exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                    <div className="space-y-2">
                      {["a", "b", "c", "d", "e", "f"].map(key => (
                        <Skeleton key={`skeleton-${key}`} className="h-16 w-full rounded-lg" />
                      ))}
                    </div>
                  </motion.div>
                ) : beatmapSets.length > 0
                  ? (
                      <motion.div key="beatmaps-loaded" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                        <div className="space-y-2">
                          {beatmapSets.map((set, i) => (
                            <div
                              key={set.id}
                              className="motion-safe:duration-300 motion-safe:animate-in motion-safe:fade-in motion-reduce:animate-none"
                              style={{
                                animationDelay: `${Math.min(i * 75, 600)}ms`,
                                animationFillMode: "backwards",
                              }}
                            >
                              <BeatmapsetRowElement beatmapSet={set} hideStatus hideDifficulties />
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )
                  : (
                      <motion.div key="beatmaps-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                        <p className="py-8 text-center text-sm text-muted-foreground">
                          {t("beatmaps.empty")}
                        </p>
                      </motion.div>
                    )}
              </AnimatePresence>
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
