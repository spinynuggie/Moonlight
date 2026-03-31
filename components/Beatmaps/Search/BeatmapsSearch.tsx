"use client";

import { ChevronDown, Search, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { BeatmapSetCard } from "@/components/Beatmaps/BeatmapSetCard";
import { BeatmapsSearchFilters } from "@/components/Beatmaps/Search/BeatmapsSearchFilters";
import { FilterPanel } from "@/components/FilterPanel";
import { BeatmapSetCardSkeleton } from "@/components/Skeletons/Beatmaps/BeatmapSetCardSkeleton";
import { Input } from "@/components/ui/input";
import { useBeatmapsetSearch } from "@/lib/hooks/api/beatmap/useBeatmapsetSearch";
import useDebounce from "@/lib/hooks/useDebounce";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";
import { useT } from "@/lib/i18n/utils";
import { BeatmapStatusWeb, GameMode } from "@/lib/types/api";
import { cn } from "@/lib/utils";

const ALL_STATUSES = Object.values(BeatmapStatusWeb).filter(
  v => v !== BeatmapStatusWeb.UNKNOWN,
);

type FilterKey = "query" | "artist" | "title";

export default function BeatmapsSearch() {
  const t = useT("pages.beatmaps.components.search");
  const searchParams = useSearchParams();
  const urlArtist = searchParams.get("artist");
  const urlTitle = searchParams.get("title");
  const urlQuery = searchParams.get("q");
  const urlFilterValue = urlArtist ?? urlTitle ?? urlQuery;
  const urlFilterKey: FilterKey = urlArtist ? "artist" : urlTitle ? "title" : "query";

  const [modeFilter, setModeFilter] = useState<GameMode>(GameMode.STANDARD);
  const [statusFilter, setStatusFilter] = useState<BeatmapStatusWeb[] | null>([
    BeatmapStatusWeb.RANKED,
    BeatmapStatusWeb.LOVED,
    BeatmapStatusWeb.APPROVED,
  ]);

  const [searchQuery, setSearchQuery] = useState(urlFilterValue ?? "");
  const [filterKey, setFilterKey] = useState<FilterKey>(urlFilterKey);
  const [textFadeIn, setTextFadeIn] = useState(false);
  const [textFadeOut, setTextFadeOut] = useState(false);
  const searchValue = useDebounce<string>(searchQuery, 450);

  useEffect(() => {
    if (urlFilterValue !== null) {
      setSearchQuery(urlFilterValue);
      setFilterKey(urlFilterKey);
      setTextFadeIn(true);
      const timer = setTimeout(() => setTextFadeIn(false), 400);
      return () => clearTimeout(timer);
    }
  }, [urlFilterValue, urlFilterKey]);

  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClear = useCallback(() => {
    setTextFadeOut(true);
    clearTimerRef.current = setTimeout(() => {
      setSearchQuery("");
      setFilterKey("query");
      setTextFadeOut(false);
    }, 250);
  }, []);

  const { data, setSize, size, isLoading } = useBeatmapsetSearch(
    filterKey === "query" ? searchValue : "",
    24,
    statusFilter ?? ALL_STATUSES,
    modeFilter,
    undefined,
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
      keepPreviousData: true,
    },
    filterKey === "artist" ? searchValue : undefined,
    filterKey === "title" ? searchValue : undefined,
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
      <FilterPanel>
        {/* Search input */}
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("searchPlaceholder")}
              className={cn(
                "h-9 border-border/50 bg-secondary px-9 shadow-none transition-[border-color,box-shadow] duration-150 focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/25",
                textFadeIn && "animate-search-text-fade-in",
                textFadeOut && "animate-search-text-fade-out",
              )}
              value={searchQuery}
              onChange={(e) => {
                if (clearTimerRef.current) {
                  clearTimeout(clearTimerRef.current);
                  setTextFadeOut(false);
                }
                setSearchQuery(e.target.value);
                setFilterKey("query");
              }}
            />
            <button
              type="button"
              onClick={handleClear}
              tabIndex={searchQuery ? 0 : -1}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground transition-[opacity,transform,color] duration-200 hover:text-foreground",
                searchQuery
                  ? "scale-100 opacity-100"
                  : "pointer-events-none scale-75 opacity-0",
              )}
            >
              <X className="size-3.5" />
            </button>
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
      </FilterPanel>

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
