"use client";
import { ChevronDown } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { FilterPanel } from "@/components/FilterPanel";
import { TopPlayCardSkeleton } from "@/components/Skeletons/Scores/TopPlayCardSkeleton";
import { useTopScores } from "@/lib/hooks/api/score/useTopScores";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";
import { useT } from "@/lib/i18n/utils";
import { GameMode } from "@/lib/types/api";
import { isInstance } from "@/lib/utils/type.util";

import TopPlayCard from "./components/TopPlayCard";
import { TopPlaysFilters } from "./components/TopPlaysFilters";

export default function Topplays() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useT("pages.topplays");

  const mode = searchParams.get("mode") ?? GameMode.STANDARD;

  const [activeMode, setActiveMode] = useState(
    () => (isInstance(mode, GameMode) ? (mode as GameMode) : GameMode.STANDARD),
  );

  const { data, setSize, size, isLoading, isValidating } = useTopScores(activeMode, 20, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  const isLoadingMore
    = isLoading || (size > 0 && data && data[size - 1] === undefined);

  const [isCrossfading, setIsCrossfading] = useState(false);

  const handleModeChange = useCallback((mode: GameMode) => {
    if (mode !== activeMode) {
      setIsCrossfading(true);
    }
    setActiveMode(mode);
  }, [activeMode]);

  useEffect(() => {
    if (!isValidating && isCrossfading) {
      setIsCrossfading(false);
    }
  }, [isValidating, isCrossfading]);

  const handleShowMore = useCallback(() => {
    setSize(size + 1);
  }, [setSize, size]);

  useScrollReveal();

  const scores = useMemo(
    () => data?.flatMap(item => item.scores),
    [data],
  );

  const hasScores = (scores?.length ?? 0) > 0;

  const showInitialSkeleton
    = (isLoading || isValidating) && !hasScores;

  const totalCountScores
    = data?.find(item => item.total_count !== undefined)?.total_count ?? 0;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  useEffect(() => {
    window.history.replaceState(
      null,
      "",
      `${pathname}?${createQueryString("mode", activeMode.toString())}`,
    );
  }, [activeMode, pathname, createQueryString]);

  return (
    <div className="space-y-2">
      {/* Filter panel */}
      <FilterPanel>
        <div className="px-3 py-2.5">
          <TopPlaysFilters
            activeMode={activeMode}
            onModeChange={handleModeChange}
          />
        </div>
      </FilterPanel>

      {/* Results */}
      <div className="scroll-reveal space-y-4">
        <div
          className="grid grid-cols-1 gap-[10px] transition-opacity duration-300 lg:grid-cols-2"
          style={{ opacity: isCrossfading ? 0.5 : 1 }}
        >
          {showInitialSkeleton
            ? Array.from({ length: 8 }, (_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="duration-300 animate-in fade-in"
                  style={{
                    animationDelay: `${Math.min(i * 75, 600)}ms`,
                    animationFillMode: "backwards",
                  }}
                >
                  <TopPlayCardSkeleton />
                </div>
              ))
            : (
                <>
                  {scores?.map((score, i) => (
                    <div
                      key={`score-${score.id}`}
                      className="duration-300 animate-in fade-in"
                      style={{
                        animationDelay: `${Math.min(i * 75, 600)}ms`,
                        animationFillMode: "backwards",
                      }}
                    >
                      <TopPlayCard score={score} />
                    </div>
                  ))}

                  {isLoadingMore && hasScores && (
                    Array.from({ length: 4 }, (_, i) => (
                      <div
                        key={`loading-more-skeleton-${i}`}
                        className="duration-300 animate-in fade-in"
                        style={{
                          animationDelay: `${Math.min(i * 75, 600)}ms`,
                          animationFillMode: "backwards",
                        }}
                      >
                        <TopPlayCardSkeleton />
                      </div>
                    ))
                  )}
                </>
              )}
        </div>

        {scores && scores.length < 100 && scores.length < totalCountScores && (
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
