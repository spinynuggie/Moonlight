"use client";

import { ChevronDown, Filter, Search } from "lucide-react";
import type * as React from "react";
import { useCallback, useState } from "react";
import { twMerge } from "tailwind-merge";

import BeatmapSetOverview from "@/app/(website)/user/[id]/components/BeatmapSetOverview";
import { BeatmapSetCard } from "@/components/Beatmaps/BeatmapSetCard";
import { BeatmapsSearchFilters } from "@/components/Beatmaps/Search/BeatmapsSearchFilters";
import { BeatmapSetCardSkeleton } from "@/components/Skeletons/Beatmaps/BeatmapSetCardSkeleton";
import { BeatmapSetOverviewSkeleton } from "@/components/Skeletons/Beatmaps/BeatmapSetOverviewSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBeatmapsetSearch } from "@/lib/hooks/api/beatmap/useBeatmapsetSearch";
import useDebounce from "@/lib/hooks/useDebounce";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";
import { useT } from "@/lib/i18n/utils";
import type { GameMode } from "@/lib/types/api";
import { BeatmapStatusWeb } from "@/lib/types/api";

export default function BeatmapsSearch({
  forceThreeGridCols = false,
}: {
  forceThreeGridCols?: boolean;
}) {
  const t = useT("pages.beatmaps.components.search");
  const [modeFilter, setModeFilter] = useState<GameMode | null>(null);
  const [statusFilter, setStatusFilter] = useState<BeatmapStatusWeb[] | null>([
    BeatmapStatusWeb.RANKED,
    BeatmapStatusWeb.LOVED,
    BeatmapStatusWeb.APPROVED,
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const searchValue = useDebounce<string>(searchQuery, 450);

  const [showFilters, setShowFilters] = useState(false);
  const [searchByCustomStatus, setSearchByCustomStatus] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  const { data, setSize, size, isLoading } = useBeatmapsetSearch(
    searchValue,
    searchByCustomStatus ? 12 : 24,
    statusFilter ?? undefined,
    modeFilter ?? undefined,
    searchByCustomStatus,
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
      keepPreviousData: true,
    },
  );

  useScrollReveal();

  const beatmapsets = data?.flatMap(item => item.sets);

  const isLoadingMore
    = isLoading || (size > 0 && data && data[size - 1] === undefined);

  const handleShowMore = useCallback(() => {
    setSize(size + 1);
  }, [setSize, size]);

  const applyFilters = useCallback(
    (filters: {
      mode: GameMode | null;
      status: BeatmapStatusWeb[] | null;
      searchByCustomStatus: boolean;
    }) => {
      const { mode, status, searchByCustomStatus } = filters;

      setModeFilter(mode);
      setStatusFilter(status ?? null);
      setSearchByCustomStatus(searchByCustomStatus);
    },
    [],
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex flex-1 items-center space-x-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              disabled={searchByCustomStatus}
              type="search"
              placeholder={t("searchPlaceholder")}
              className="pl-8"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            className="relative"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 size-4" />
            {t("filters")}
            {(statusFilter != null || modeFilter != null) && (
              <div className="absolute -left-2.5 -top-2.5 flex size-6 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground sm:-left-2 sm:-top-2">
                {[statusFilter, modeFilter].filter(v => v != null).length}
              </div>
            )}
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Tabs
            defaultValue="grid"
            value={viewMode}
            onValueChange={setViewMode}
            className="h-9 "
          >
            <TabsList className="grid h-9 min-w-[120px] grid-cols-2 bg-card shadow">
              <TabsTrigger value="grid">{t("viewMode.grid")}</TabsTrigger>
              <TabsTrigger value="list">{t("viewMode.list")}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div
        className="overflow-hidden transition-all duration-500 ease-in-out "
        style={{ maxHeight: showFilters ? "500px" : "0" }}
      >
        <div
          className={
            showFilters
              ? "scale-100 opacity-100 transition duration-500"
              : "scale-95 opacity-0 transition duration-300"
          }
        >
          <BeatmapsSearchFilters
            onApplyFilters={applyFilters}
            isLoading={!!isLoadingMore}
            defaultMode={modeFilter}
            defaultStatus={statusFilter}
            defaultSearchByCustomStatus={searchByCustomStatus}
          />
        </div>
      </div>

      <div className="scroll-reveal space-y-4">
        <Tabs value={viewMode}>
          <TabsContent value="grid" className="m-0">
            <div
              className={twMerge(
                `grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 `,
                forceThreeGridCols ? "" : "xl:grid-cols-4",
              )}
            >
              {beatmapsets?.map((beatmapSet, i) => (
                <div
                  key={`beatmap-set-card-${beatmapSet.id}`}
                  className="duration-300 animate-in fade-in"
                  style={{ animationDelay: `${Math.min(i * 75, 600)}ms`, animationFillMode: "backwards" }}
                >
                  <BeatmapSetCard beatmapSet={beatmapSet} />
                </div>
              ))}
              {isLoading && (!beatmapsets || beatmapsets.length === 0) && (
                Array.from({ length: 8 }, (_, i) => (
                  <div
                    key={`skeleton-${i}`}
                    className="duration-300 animate-in fade-in"
                    style={{ animationDelay: `${Math.min(i * 75, 600)}ms`, animationFillMode: "backwards" }}
                  >
                    <BeatmapSetCardSkeleton />
                  </div>
                ))
              )}
              {isLoadingMore && beatmapsets && beatmapsets.length > 0 && (
                Array.from({ length: 4 }, (_, i) => (
                  <div
                    key={`loading-more-skeleton-${i}`}
                    className="duration-300 animate-in fade-in"
                    style={{ animationDelay: `${Math.min(i * 75, 600)}ms`, animationFillMode: "backwards" }}
                  >
                    <BeatmapSetCardSkeleton />
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          <TabsContent value="list" className="m-0">
            <Card className="p-4">
              <CardContent className="grid grid-cols-1 gap-4 p-0 sm:grid-cols-2">
                {beatmapsets?.map((beatmapSet, i) => (
                  <div
                    key={`beatmap-set-overview-${beatmapSet.id}`}
                    className="duration-300 animate-in fade-in"
                    style={{ animationDelay: `${Math.min(i * 75, 600)}ms`, animationFillMode: "backwards" }}
                  >
                    <BeatmapSetOverview beatmapSet={beatmapSet} />
                  </div>
                ))}
                {isLoading && (!beatmapsets || beatmapsets.length === 0) && (
                  Array.from({ length: 8 }, (_, i) => (
                    <div
                      key={`list-skeleton-${i}`}
                      className="duration-300 animate-in fade-in"
                      style={{ animationDelay: `${Math.min(i * 75, 600)}ms`, animationFillMode: "backwards" }}
                    >
                      <BeatmapSetOverviewSkeleton />
                    </div>
                  ))
                )}
                {isLoadingMore && beatmapsets && beatmapsets.length > 0 && (
                  Array.from({ length: 4 }, (_, i) => (
                    <div
                      key={`list-loading-more-skeleton-${i}`}
                      className="duration-300 animate-in fade-in"
                      style={{ animationDelay: `${Math.min(i * 75, 600)}ms`, animationFillMode: "backwards" }}
                    >
                      <BeatmapSetOverviewSkeleton />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        {beatmapsets
          && beatmapsets?.length >= (searchByCustomStatus ? 12 : 24) && (
          <div className="mt-4 flex justify-center">
            <Button
              onClick={handleShowMore}
              className="flex w-full items-center justify-center md:w-1/2"
              isLoading={isLoadingMore}
              variant="secondary"
            >
              <ChevronDown />
              {t("showMore")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
