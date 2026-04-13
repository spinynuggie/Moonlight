"use client";

import { Play } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import type { BeatmapResponse } from "@/lib/types/api";
import { cn } from "@/lib/utils";
import { getStatusPillStyle } from "@/lib/utils/getStatusPillStyle";

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
  const [thumbLoaded, setThumbLoaded] = useState(false);
  const pillStyle = getStatusPillStyle(beatmap.status);

  return (
    <Link
      href={`/beatmapsets/${beatmap.beatmapset_id}/${beatmap.id}`}
      className={cn(
        "group relative block h-[120px] overflow-hidden rounded-[10px] border border-border/50 shadow-md transition-[border-color] duration-150 hover:border-primary/30 md:h-[100px]",
        className,
      )}
    >
      {/* Full-card cover image background */}
      <div className="absolute inset-px z-0 overflow-hidden rounded-[inherit]">
        <div className="size-full" style={{ backgroundColor: "hsl(var(--secondary))" }}>
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
        </div>
      </div>

      {/* Content layer */}
      <div className="pointer-events-none relative z-10 flex h-full">
        {/* Thumbnail area */}
        <div className="relative w-[90px] flex-shrink-0 overflow-hidden md:w-[100px]">
          <div className="absolute inset-0" style={{ backgroundColor: "hsl(var(--secondary))" }}>
            {beatmap.beatmapset_id && (
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
        <div className="relative ml-[-10px] flex min-w-0 flex-1 flex-col overflow-hidden rounded-l-[10px]">
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
            {/* Top: beatmap info + play count */}
            <div className="flex min-w-0 items-start gap-3">
              <div className="min-w-0 flex-1">
                <h3
                  className="truncate text-[15px] font-semibold leading-tight"
                  style={{ textShadow: "0 1px 3px rgba(0,0,0,0.75)" }}
                >
                  <span className="text-white">{beatmap.title}</span>
                </h3>
                <p
                  className="truncate text-sm font-semibold leading-tight"
                  style={{ textShadow: "0 1px 3px rgba(0,0,0,0.75)" }}
                >
                  <span className="text-foreground/80">{beatmap.artist}</span>
                </p>
                {beatmap.status && (
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

              {/* Play count */}
              <div className="flex flex-shrink-0 items-center gap-1.5 self-center text-right">
                <Play className="size-6 fill-primary text-primary" />
                <p className="text-lg font-bold leading-tight text-primary">
                  {playcount.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Bottom row: version */}
            <div className="mt-auto flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
              {beatmap.version && (
                <span className="truncate">[{beatmap.version}]</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
