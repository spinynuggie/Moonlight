"use client";

import Link from "next/link";

import DifficultyIcon from "@/components/DifficultyIcon";
import { useT } from "@/lib/i18n/utils";
import type { BeatmapResponse, ScoreResponse } from "@/lib/types/api";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";
import { getStatusPillStyle } from "@/lib/utils/getStatusPillStyle";

interface ScoreBeatmapInfoProps {
  beatmap: BeatmapResponse;
  score: ScoreResponse;
}

export function ScoreBeatmapInfo({ beatmap, score }: ScoreBeatmapInfoProps) {
  const t = useT("pages.score");
  const pillStyle = getStatusPillStyle(beatmap.status);
  const starRating = getBeatmapStarRating(beatmap);

  return (
    <div className="bg-card/90 px-4 py-3 md:px-8">
      <Link
        href={`/beatmapsets/${beatmap.beatmapset_id}/${beatmap.id}`}
        className="group/title"
      >
        <h2 className="text-2xl font-bold leading-tight text-white transition-colors group-hover/title:text-primary">
          {beatmap.title}
          <span className="ml-2 text-xl font-semibold text-foreground/70">
            by {beatmap.artist}
          </span>
        </h2>
      </Link>

      <div className="mt-1.5 flex flex-wrap items-center gap-2.5 text-base">
        <div className="flex items-center gap-1 text-yellow-400">
          <DifficultyIcon
            iconColor="#facc15"
            gameMode={score.game_mode}
            className="flex-shrink-0 text-sm"
          />
          <span className="whitespace-nowrap">
            ★ {starRating.toFixed(2)}
          </span>
        </div>

        <span className="text-foreground/50">
          {beatmap.version || t("beatmap.versionUnknown")}
        </span>

        {beatmap.creator && (
          <span className="text-sm text-foreground/40">
            {t("beatmap.mappedBy")} {beatmap.creator}
          </span>
        )}

        {beatmap.status && (
          <span
            className="rounded-full px-[6px] text-[10px] font-extrabold uppercase leading-[16px]"
            style={{
              backgroundColor: pillStyle.bg,
              color: pillStyle.color,
            }}
          >
            {beatmap.status}
          </span>
        )}
      </div>
    </div>
  );
}
