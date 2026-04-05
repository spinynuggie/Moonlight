"use client";

import { PlayCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import BeatmapStatusIcon from "@/components/BeatmapStatus";
import type { BeatmapResponse } from "@/lib/types/api";
import { BeatmapStatusWeb } from "@/lib/types/api";
import { cn } from "@/lib/utils";

interface BeatmapPlayedOverviewProps {
  beatmap: BeatmapResponse;
  playcount: number;
  className?: string;
}

export default function BeatmapPlayedOverview({
  beatmap,
  playcount,
  className,
}: BeatmapPlayedOverviewProps) {
  const [coverLoaded, setCoverLoaded] = useState(false);

  return (
    <Link
      href={`/beatmapsets/${beatmap.beatmapset_id}/${beatmap.id}`}
      className={cn(
        "group relative flex min-h-[88px] overflow-hidden rounded-[12px] border border-border/40 bg-secondary/40 transition-colors hover:border-primary/30 hover:bg-secondary/55",
        className,
      )}
    >
      <div className="absolute inset-0">
        {beatmap.beatmapset_id && (
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
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, hsl(var(--card) / 0.88) 0%, hsl(var(--card) / 0.7) 50%, hsl(var(--card) / 0.55) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 flex w-full items-center gap-3 p-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-card/80 shadow-sm">
          <BeatmapStatusIcon status={beatmap.status ?? BeatmapStatusWeb.GRAVEYARD} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-foreground md:text-base">
            {beatmap.title}
          </div>
          <div className="truncate text-xs font-medium text-muted-foreground md:text-sm">
            {beatmap.artist}
            {beatmap.version ? ` • [${beatmap.version}]` : ""}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="text-right">
            <div className="flex items-center justify-end gap-1.5 text-base font-bold text-primary md:text-lg">
              <PlayCircle className="size-4" />
              {playcount.toLocaleString()}
            </div>
            <div className="text-[11px] text-muted-foreground">
              plays
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
