"use client";

import { GripVertical } from "lucide-react";
import Link from "next/link";

import { useBeatmap } from "@/lib/hooks/api/beatmap/useBeatmap";
import type { ScoreResponse } from "@/lib/types/api";
import { cn } from "@/lib/utils";
import { getGradeColor } from "@/lib/utils/getGradeColor";
import { timeSince } from "@/lib/utils/timeSince";

interface ProfileScoreRowProps {
  score: ScoreResponse;
  metricValue: string;
  metricLabel?: string;
  detailText?: string;
  dragEnabled?: boolean;
  onDragStart?: () => void;
  onDragEnter?: () => void;
  onDrop?: () => void;
}

export function ProfileScoreRow({
  score,
  metricValue,
  metricLabel,
  detailText,
  dragEnabled = false,
  onDragStart,
  onDragEnter,
  onDrop,
}: ProfileScoreRowProps) {
  const beatmapQuery = useBeatmap(score.beatmap_id);
  const beatmap = beatmapQuery.data;

  return (
    <Link
      href={`/score/${score.id}`}
      draggable={dragEnabled}
      onDragStart={onDragStart}
      onDragEnter={(e) => {
        e.preventDefault();
        onDragEnter?.();
      }}
      onDragOver={e => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onDrop?.();
      }}
      className="group relative flex min-h-[88px] overflow-hidden rounded-[12px] border border-border/40 bg-secondary/40 transition-colors hover:border-primary/30 hover:bg-secondary/55"
    >
      <div className="absolute inset-0 opacity-35">
        {beatmap && (
          <img
            src={`https://assets.ppy.sh/beatmaps/${beatmap.beatmapset_id}/covers/cover@2x.jpg`}
            alt=""
            className="size-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-card via-card/90 to-card/80" />
      </div>

      <div className="relative z-10 flex w-full items-center gap-3 p-3">
        <div className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-full bg-card/80 text-base font-extrabold shadow-sm",
          getGradeColor(score.grade),
        )}
        >
          {score.grade}
        </div>

        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-foreground md:text-base">
            {beatmap?.title ?? "Unknown beatmap"}
          </div>
          <div className="truncate text-xs font-medium text-muted-foreground md:text-sm">
            {beatmap?.artist ?? "Unknown artist"}
            {beatmap?.version ? ` • [${beatmap.version}]` : ""}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
            <span>{timeSince(score.when_played)}</span>
            {score.mods && <span>{score.mods}</span>}
            <span>{score.accuracy.toFixed(2)}%</span>
            {detailText && <span>{detailText}</span>}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <div className="text-right">
            <div className="text-base font-bold text-primary md:text-lg">
              {metricValue}
            </div>
            {metricLabel && (
              <div className="text-[11px] text-muted-foreground">
                {metricLabel}
              </div>
            )}
          </div>
          {dragEnabled && (
            <GripVertical className="size-4 text-muted-foreground/60" />
          )}
        </div>
      </div>
    </Link>
  );
}
