"use client";
import { ChevronDown, LucideHistory } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import GameModeSelector from "@/components/GameModeSelector";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import { UserScoreMinimalSkeleton } from "@/components/Skeletons/Scores/UserScoreMinimalSkeleton";
import { Button } from "@/components/ui/button";
import { useTopScores } from "@/lib/hooks/api/score/useTopScores";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";
import { useT } from "@/lib/i18n/utils";
import { GameMode } from "@/lib/types/api";
import { isInstance } from "@/lib/utils/type.util";

import UserScoreMinimal from "./components/UserScoreMinimal";

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
    <div className="flex w-full flex-col space-y-4">
      <PrettyHeader
        text={t("header")}
        icon={<LucideHistory />}
        roundBottom={true}
      />
      <div>
        <PrettyHeader className="border-0">
          <GameModeSelector
            activeMode={activeMode}
            setActiveMode={handleModeChange}
          />
        </PrettyHeader>

        <div className="scroll-reveal mb-4 rounded-b-3xl bg-card">
          <RoundedContent className="h-fit max-h-none min-h-0 rounded-t-xl bg-card">
            <div
              className="grid grid-cols-1 gap-4 transition-opacity duration-300 lg:grid-cols-2"
              style={{ opacity: isCrossfading ? 0.5 : 1 }}
            >
              {showInitialSkeleton
                ? Array.from({ length: 8 }, (_, i) => (
                    <div
                      key={`skeleton-${i}`}
                      className="mb-2 duration-300 animate-in fade-in"
                      style={{
                        animationDelay: `${Math.min(i * 75, 600)}ms`,
                        animationFillMode: "backwards",
                      }}
                    >
                      <UserScoreMinimalSkeleton />
                    </div>
                  ))
                : (
                    <>
                      {scores?.map((score, i) => (
                        <div
                          key={`score-${score.id}`}
                          className="mb-2 duration-300 animate-in fade-in"
                          style={{
                            animationDelay: `${Math.min(i * 75, 600)}ms`,
                            animationFillMode: "backwards",
                          }}
                        >
                          <UserScoreMinimal score={score} />
                        </div>
                      ))}

                      {isLoadingMore && hasScores && (
                        Array.from({ length: 4 }, (_, i) => (
                          <div
                            key={`loading-more-skeleton-${i}`}
                            className="mb-2 duration-300 animate-in fade-in"
                            style={{
                              animationDelay: `${Math.min(i * 75, 600)}ms`,
                              animationFillMode: "backwards",
                            }}
                          >
                            <UserScoreMinimalSkeleton />
                          </div>
                        ))
                      )}
                    </>
                  )}
            </div>

            {scores && scores.length < 100 && scores.length < totalCountScores && (
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
          </RoundedContent>
        </div>
      </div>
    </div>
  );
}
