"use client";

import Image from "next/image";
import { use, useEffect, useRef, useState } from "react";

import { ScoreDetailSkeleton } from "@/components/Skeletons/Scores/ScoreDetailSkeleton";
import { useBeatmap } from "@/lib/hooks/api/beatmap/useBeatmap";
import { useDownloadReplay } from "@/lib/hooks/api/score/useDownloadReplay";
import { useScore } from "@/lib/hooks/api/score/useScore";
import { useUser } from "@/lib/hooks/api/user/useUser";
import useSelf from "@/lib/hooks/useSelf";
import { useT } from "@/lib/i18n/utils";
import { cn } from "@/lib/utils";
import { tryParseNumber } from "@/lib/utils/type.util";

import { ScoreHero } from "./components/ScoreHero";
import { ScoreStatsSection } from "./components/ScoreStatsSection";

export default function Score(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const paramsId = tryParseNumber(params.id) ?? 0;
  const t = useT("pages.score");

  const { self } = useSelf();

  const { isLoading: isReplayLoading, downloadReplay }
    = useDownloadReplay(paramsId);

  const scoreQuery = useScore(paramsId);
  const score = scoreQuery.data;

  const userQuery = useUser(score?.user_id ?? null);
  const beatmapQuery = useBeatmap(score?.beatmap_id ?? null);

  const user = userQuery?.data;
  const beatmap = beatmapQuery?.data;

  const isLoadingAny
    = scoreQuery?.isLoading
      || userQuery?.isLoading
      || beatmapQuery?.isLoading;

  const hasAllData = !!(score && user && beatmap);

  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isCrossfading, setIsCrossfading] = useState(false);
  const dataReadyRef = useRef(false);

  useEffect(() => {
    if (hasAllData && !dataReadyRef.current) {
      dataReadyRef.current = true;
      setIsCrossfading(true);
      const timer = setTimeout(() => {
        setShowSkeleton(false);
        setIsCrossfading(false);
      }, 400);
      return () => clearTimeout(timer);
    }
    if (!isLoadingAny && !hasAllData && !dataReadyRef.current) {
      setShowSkeleton(false);
    }
  }, [hasAllData, isLoadingAny]);

  const errorMessage
    = scoreQuery.error?.message
      ?? userQuery?.error?.message
      ?? beatmapQuery?.error?.message
      ?? t("error.notFound");

  return (
    <div className="flex flex-col space-y-3">
      {/* Content area with crossfade */}
      <div className="relative">
        {/* Skeleton */}
        {showSkeleton && (
          <div
            className={cn(
              isCrossfading
              && "profile-crossfade-out pointer-events-none absolute inset-x-0 top-0 z-10",
            )}
          >
            <ScoreDetailSkeleton />
          </div>
        )}

        {/* Real content */}
        {hasAllData && (
          <div
            className={cn(
              "space-y-3",
              isCrossfading && "profile-crossfade-in",
            )}
          >
            <ScoreHero
              score={score}
              beatmap={beatmap}
              isReplayLoading={isReplayLoading}
              canDownloadReplay={!!self && score.has_replay}
              onDownloadReplay={downloadReplay}
              downloadReplayLabel={t("actions.downloadReplay")}
            />

            <ScoreStatsSection
              score={score}
              beatmap={beatmap}
              user={user}
            />
          </div>
        )}

        {/* Error state */}
        {!isLoadingAny && !hasAllData && !showSkeleton && (
          <div className="overflow-hidden rounded-[10px] border border-border/50 bg-card p-8 shadow-md">
            <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
              <div className="flex flex-col space-y-2">
                <h1 className="text-4xl">{errorMessage}</h1>
                <p>{t("error.description")}</p>
              </div>
              <Image
                src="/images/user-not-found.png"
                alt="404"
                width={200}
                height={400}
                className="max-w-fit"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
