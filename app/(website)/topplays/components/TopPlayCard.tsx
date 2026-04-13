"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import AudioPreview from "@/app/(website)/user/[id]/components/AudioPreview";
import UserHoverCard from "@/components/UserHoverCard";
import { useBeatmap } from "@/lib/hooks/api/beatmap/useBeatmap";
import { useT } from "@/lib/i18n/utils";
import type { BeatmapSetResponse, ScoreResponse } from "@/lib/types/api";
import { cn } from "@/lib/utils";
import { getGradeColor } from "@/lib/utils/getGradeColor";

interface TopPlayCardProps {
  score: ScoreResponse;
}

export default function TopPlayCard({ score }: TopPlayCardProps) {
  const t = useT("pages.topplays.components.userScoreMinimal");
  const beatmapQuery = useBeatmap(score.beatmap_id);
  const beatmap = beatmapQuery.data;
  const { user } = score;
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [thumbLoaded, setThumbLoaded] = useState(false);

  if (!beatmap)
    return null;

  const gradeColor = getGradeColor(score.grade);

  return (
    <div className="absolute inset-0 z-10 animate-in fade-in [animation-duration:300ms]">
      <div className="group relative h-[120px] overflow-hidden rounded-[10px] border border-border/50 shadow-md transition-[border-color] duration-150">
        {/* Full-card cover image background */}
        <Link
          href={`/score/${score.id}`}
          className="absolute inset-px z-0 overflow-hidden rounded-[inherit]"
        >
          <div className="size-full" style={{ backgroundColor: "hsl(var(--secondary))" }}>
            <img
              src={`https://assets.ppy.sh/beatmaps/${beatmap.beatmapset_id}/covers/cover@2x.jpg`}
              alt=""
              onLoad={() => setCoverLoaded(true)}
              className={cn(
                "size-full object-cover transition-opacity duration-500",
                coverLoaded ? "opacity-100" : "opacity-0",
              )}
            />
          </div>
        </Link>

        {/* Content layer */}
        <div className="pointer-events-none relative z-10 flex h-full">
          {/* Thumbnail area */}
          <div className="relative w-[90px] flex-shrink-0 overflow-hidden md:w-[100px]">
            <div className="absolute inset-0" style={{ backgroundColor: "hsl(var(--secondary))" }}>
              <img
                src={`https://assets.ppy.sh/beatmaps/${beatmap.beatmapset_id}/covers/list@2x.jpg`}
                alt=""
                onLoad={() => setThumbLoaded(true)}
                className={cn(
                  "size-full object-cover transition-opacity duration-500",
                  thumbLoaded ? "opacity-100" : "opacity-0",
                )}
              />
            </div>
            <div className="absolute inset-0 bg-black/30 transition-all duration-150 md:bg-black/0 md:group-hover:bg-black/60" />
            <div className="pointer-events-auto absolute inset-0 flex items-center justify-center opacity-100 transition-opacity duration-150 md:opacity-0 md:group-hover:opacity-100">
              <AudioPreview
                beatmapSet={{ id: beatmap.beatmapset_id, title: beatmap.title ?? "", artist: beatmap.artist ?? "" } as BeatmapSetResponse}
                className="size-full rounded-none p-0"
              />
            </div>
          </div>

          {/* Info area */}
          <div className="relative ml-[-10px] flex min-w-0 flex-1 flex-col overflow-hidden rounded-l-[10px]">
            {/* Gradient bg */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, hsl(var(--card)) 0%, hsl(var(--card) / 0.85) 100%)",
              }}
            />
            {/* Hover tint */}
            <div
              className="absolute inset-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
              style={{
                background:
                  "linear-gradient(90deg, hsl(var(--secondary) / 0.6) 0%, hsl(var(--secondary) / 0.4) 100%)",
              }}
            />

            {/* Info content */}
            <div className="relative flex h-full min-w-0 flex-col justify-between px-2.5 py-1.5">
              {/* Top: beatmap info + stats */}
              <div className="flex min-w-0 items-start gap-3">
                <div className="min-w-0 flex-1">
                  <h3
                    className="truncate text-[15px] font-semibold leading-tight"
                    style={{ textShadow: "0 1px 3px rgba(0,0,0,0.75)" }}
                  >
                    <span className="text-white">
                      {beatmap.title ?? "Unknown"}
                    </span>
                  </h3>
                  <p
                    className="truncate text-sm font-semibold leading-tight"
                    style={{ textShadow: "0 1px 3px rgba(0,0,0,0.75)" }}
                  >
                    <span className="text-foreground/80">
                      {beatmap.artist ?? "Unknown"}
                    </span>
                  </p>
                  <p className="truncate text-xs leading-tight text-muted-foreground">
                    [{beatmap.version}]
                  </p>
                </div>

                {/* Stats */}
                <div className="flex flex-shrink-0 flex-col items-end">
                  <p className="text-xl font-bold leading-tight text-primary">
                    {beatmap.is_ranked
                      ? score.performance_points.toFixed(0)
                      : "—"}
                    <span className="text-xs font-medium text-primary/70">
                      {t("pp")}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {score.accuracy.toFixed(2)}%
                  </p>
                  <p className={cn("text-sm font-bold", gradeColor)}>
                    {score.grade}
                  </p>
                </div>
              </div>

              {/* Bottom: user + mods */}
              <div className="pointer-events-auto flex items-center gap-1.5">
                <Image
                  src={user.avatar_url}
                  width={22}
                  height={22}
                  alt=""
                  className="rounded-full border border-border/50"
                />
                <UserHoverCard user={user} asChild>
                  <Link
                    href={`/user/${user.user_id}`}
                    className="truncate text-xs font-medium text-foreground/90 transition-colors duration-150 hover:text-primary"
                    onClick={e => e.stopPropagation()}
                  >
                    {user.username}
                  </Link>
                </UserHoverCard>
                {score.mods && (
                  <span className="ml-auto shrink-0 text-[11px] font-semibold text-muted-foreground">
                    {score.mods}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
