"use client";

import { ChevronDown, Search } from "lucide-react";
import { useCallback, useState } from "react";

import { BeatmapSetCard } from "@/components/Beatmaps/BeatmapSetCard";
import { BeatmapsSearchFilters } from "@/components/Beatmaps/Search/BeatmapsSearchFilters";
import { BeatmapSetCardSkeleton } from "@/components/Skeletons/Beatmaps/BeatmapSetCardSkeleton";
import { Input } from "@/components/ui/input";
import { useBeatmapsetSearch } from "@/lib/hooks/api/beatmap/useBeatmapsetSearch";
import useDebounce from "@/lib/hooks/useDebounce";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";
import { useT } from "@/lib/i18n/utils";
import { BeatmapStatusWeb, GameMode } from "@/lib/types/api";

const ALL_STATUSES = Object.values(BeatmapStatusWeb).filter(
  v => v !== BeatmapStatusWeb.UNKNOWN,
);

export default function BeatmapsSearch() {
  const t = useT("pages.beatmaps.components.search");
  const [modeFilter, setModeFilter] = useState<GameMode>(GameMode.STANDARD);
  const [statusFilter, setStatusFilter] = useState<BeatmapStatusWeb[] | null>([
    BeatmapStatusWeb.RANKED,
    BeatmapStatusWeb.LOVED,
    BeatmapStatusWeb.APPROVED,
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const searchValue = useDebounce<string>(searchQuery, 450);

  const { data, setSize, size, isLoading } = useBeatmapsetSearch(
    searchValue,
    24,
    statusFilter ?? ALL_STATUSES,
    modeFilter,
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

  return (
    <div className="space-y-2">
      {/* Search panel */}
      <div className="overflow-hidden rounded-[10px] border border-border/50 bg-card shadow-md">
        {/* Search input */}
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("searchPlaceholder")}
              className="h-9 border-border/50 bg-secondary pl-9 shadow-none transition-[border-color,box-shadow] duration-150 focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/25"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="mx-3 border-t border-border/30" />

        {/* Filter rows */}
        <div className="px-3 py-2.5">
          <BeatmapsSearchFilters
            mode={modeFilter}
            onModeChange={setModeFilter}
            status={statusFilter}
            onStatusChange={setStatusFilter}
          />
        </div>
      </div>

      {/* Results */}
      <div className="scroll-reveal space-y-4">
        <div className="flex flex-wrap gap-[10px]">
          {beatmapsets?.map((beatmapSet, i) => (
            <div
              key={`beatmap-set-card-${beatmapSet.id}`}
              className="w-full duration-300 animate-in fade-in md:w-[calc(50%-5px)]"
              style={{ animationDelay: `${Math.min(i * 75, 600)}ms`, animationFillMode: "backwards" }}
            >
              <BeatmapSetCard beatmapSet={beatmapSet} />
            </div>
          ))}
          {isLoading && (!beatmapsets || beatmapsets.length === 0) && (
            Array.from({ length: 8 }, (_, i) => (
              <div
                key={`skeleton-${i}`}
                className="w-full duration-300 animate-in fade-in md:w-[calc(50%-5px)]"
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
                className="w-full duration-300 animate-in fade-in md:w-[calc(50%-5px)]"
                style={{ animationDelay: `${Math.min(i * 75, 600)}ms`, animationFillMode: "backwards" }}
              >
                <BeatmapSetCardSkeleton />
              </div>
            ))
          )}
        </div>
        {beatmapsets
          && beatmapsets?.length >= 24 && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleShowMore}
              disabled={isLoadingMore}
              className="flex w-full items-center justify-center gap-1.5 rounded-[10px] border border-border/50 bg-card py-2.5 text-sm font-medium text-muted-foreground shadow-md transition-colors duration-150 hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
            >
              <ChevronDown className="size-4" />
              {t("showMore")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
