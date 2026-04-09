"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { useBeatmap } from "@/lib/hooks/api/beatmap/useBeatmap";
import type { ScoreResponse } from "@/lib/types/api";
import { cn } from "@/lib/utils";
import { getGradeDisplayName, getGradeHexColor } from "@/lib/utils/getGradeColor";
import { getStatusPillStyle } from "@/lib/utils/getStatusPillStyle";
import { timeSince } from "@/lib/utils/timeSince";

interface ProfileScoreRowProps {
  score: ScoreResponse;
  metricValue: string;
  metricLabel?: string;
  detailText?: string;
}

export function ProfileScoreRow({
  score,
  metricValue,
  metricLabel,
  detailText,
}: ProfileScoreRowProps) {
  const beatmapQuery = useBeatmap(score.beatmap_id);
  const beatmap = beatmapQuery.data;
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [thumbLoaded, setThumbLoaded] = useState(false);
  const wasCached = useRef(!!beatmap);
  const pillStyle = beatmap?.status ? getStatusPillStyle(beatmap.status) : null;

  if (!beatmap && !wasCached.current) {
    return (
      <div className="group relative h-[120px] overflow-hidden rounded-[10px] border border-border/50 bg-secondary/40 shadow-md md:h-[100px]">
        <div className="flex h-full">
          <Skeleton className="w-[90px] flex-shrink-0 rounded-none rounded-l-[10px] md:w-[100px]" />
          <div className="flex flex-1 flex-col justify-center gap-1.5 px-3">
            <Skeleton className="h-4 w-44 rounded-md" />
            <Skeleton className="h-3.5 w-32 rounded-md" />
            <Skeleton className="mt-1 h-3 w-24 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/score/${score.id}`}
      className={cn(
        "group relative block h-[120px] overflow-hidden rounded-[10px] border border-border/50 shadow-md transition-[border-color] duration-150 hover:border-primary/30 md:h-[100px]",
        !wasCached.current && "profile-crossfade-in",
      )}
    >
      {/* Full-card cover image background */}
      <div className="absolute inset-px z-0 overflow-hidden rounded-[inherit]">
        <div className="size-full" style={{ backgroundColor: "hsl(var(--secondary))" }}>
          {beatmap && (
            <img
              src={`https://assets.ppy.sh/beatmaps/${beatmap.beatmapset_id}/covers/cover@2x.jpg`}
              alt=""
              onLoad={() => setCoverLoaded(true)}
              className={cn(
                "size-full object-cover transition-opacity duration-500",
                coverLoaded ? "opacity-100" : "opacity-0",
              )}
            />
          )}
        </div>
      </div>

      {/* Content layer */}
      <div className="pointer-events-none relative z-10 flex h-full">
        {/* Thumbnail area */}
        <div className="relative w-[90px] flex-shrink-0 overflow-hidden md:w-[100px]">
          <div className="absolute inset-0" style={{ backgroundColor: "hsl(var(--secondary))" }}>
            {beatmap && (
              <img
                src={`https://assets.ppy.sh/beatmaps/${beatmap.beatmapset_id}/covers/list@2x.jpg`}
                alt=""
                onLoad={() => setThumbLoaded(true)}
                className={cn(
                  "size-full object-cover transition-opacity duration-500",
                  thumbLoaded ? "opacity-100" : "opacity-0",
                )}
              />
            )}
          </div>
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Info area */}
        <div className="relative -ml-[10px] flex min-w-0 flex-1 flex-col overflow-hidden rounded-l-[10px]">
          {/* Base gradient bg */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(90deg, hsl(var(--card)) 0%, hsl(var(--card) / 0.85) 100%)",
            }}
          />
          {/* Hover tint overlay */}
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
            style={{
              background: "linear-gradient(90deg, hsl(var(--secondary) / 0.6) 0%, hsl(var(--secondary) / 0.4) 100%)",
            }}
          />

          {/* Info content */}
          <div className="relative flex h-full min-w-0 flex-col px-2.5 py-1.5">
            {/* Top: beatmap info + stats */}
            <div className="flex min-w-0 items-start gap-3">
              <div className="min-w-0 flex-1">
                <h3
                  className="truncate text-[15px] font-semibold leading-tight"
                  style={{ textShadow: "0 1px 3px rgba(0,0,0,0.75)" }}
                >
                  <span className="text-white">{beatmap?.title}</span>
                </h3>
                <p
                  className="truncate text-sm font-semibold leading-tight"
                  style={{ textShadow: "0 1px 3px rgba(0,0,0,0.75)" }}
                >
                  <span className="text-foreground/80">{beatmap?.artist}</span>
                </p>
                {pillStyle && beatmap?.status && (
                  <span
                    className="mt-0.5 inline-block rounded-full px-[5px] text-[10px] font-extrabold uppercase leading-[14px]"
                    style={{
                      backgroundColor: pillStyle.bg,
                      color: pillStyle.color,
                    }}
                  >
                    {beatmap.status}
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="flex flex-shrink-0 items-center gap-2">
                <div className="text-right">
                  <p className="text-lg font-bold leading-tight text-primary">
                    {metricValue}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {score.accuracy.toFixed(2)}%
                  </p>
                </div>
                <div
                  className="text-3xl font-black"
                  style={{
                    color: getGradeHexColor(score.grade),
                    textShadow: `0 0 12px ${getGradeHexColor(score.grade)}40`,
                  }}
                >
                  {getGradeDisplayName(score.grade)}
                </div>
              </div>
            </div>

            {/* Bottom row: version, time, mods, metric label */}
            <div className="mt-auto flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
              {beatmap?.version && (
                <span className="truncate">[{beatmap.version}]</span>
              )}
              <span>·</span>
              <span className="flex-shrink-0">{timeSince(score.when_played)}</span>
              {score.mods && (
                <>
                  <span>·</span>
                  <span className="flex-shrink-0">{score.mods}</span>
                </>
              )}
              {(detailText || metricLabel) && (
                <span className="ml-auto flex-shrink-0 text-foreground/60">
                  {detailText}
                  {detailText && metricLabel && " · "}
                  {metricLabel}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
