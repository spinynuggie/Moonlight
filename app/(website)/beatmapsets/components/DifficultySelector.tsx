"use client";

import { useState } from "react";

import DifficultyIcon from "@/components/DifficultyIcon";
import type { BeatmapResponse, BeatmapSetResponse, GameMode } from "@/lib/types/api";
import { cn } from "@/lib/utils";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";

interface DifficultySelectorProps {
  beatmapset: BeatmapSetResponse;
  difficulties: BeatmapResponse[];
  activeDifficulty: BeatmapResponse;
  setDifficulty: (difficulty: BeatmapResponse) => void;
  activeGameMode: GameMode;
  className?: string;
}

export default function DifficultySelector({
  beatmapset,
  difficulties,
  activeDifficulty,
  setDifficulty,
  activeGameMode,
  className,
}: DifficultySelectorProps) {
  const [hoveredDifficulty, setHoveredDifficulty]
    = useState<BeatmapResponse | null>(null);

  const selectedDifficulty = hoveredDifficulty ?? activeDifficulty;

  return (
    <div className="flex flex-col space-y-1 ">
      <div
        className={cn(
          "mr-6 flex w-fit flex-wrap rounded-lg bg-terracotta-700 bg-opacity-80",
          className,
        )}
      >
        {difficulties
          .sort(
            (a, b) =>
              getBeatmapStarRating(a, activeGameMode)
              - getBeatmapStarRating(b, activeGameMode),
          )
          .sort((a, b) => a.mode_int - b.mode_int) // Lazy sort, but it works since osu! (0) is always lower than other modes
          .map(difficulty => (
            <div
              className={cn(
                "cursor-pointer rounded-lg border-2 border-yellow-pastel border-opacity-0 p-1 transition-all  duration-200 ease-in-out hover:border-opacity-100 hover:bg-terracotta-800",
                activeDifficulty.id === difficulty.id
                  ? "border-opacity-100"
                  : "",
              )}
              key={difficulty.id}
              onMouseOver={() => setHoveredDifficulty(difficulty)}
              onMouseLeave={() => setHoveredDifficulty(null)}
              onClick={() => setDifficulty(difficulty)}
            >
              <DifficultyIcon
                difficulty={difficulty}
                gameMode={activeGameMode}
              />
            </div>
          ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-lg text-foreground">{selectedDifficulty.version}</p>
        {selectedDifficulty.creator_id !== beatmapset.creator_id && (
          <p className="text-sm font-light text-foreground">
            mapped by&nbsp;
            <span className="font-bold text-foreground/80">
              {selectedDifficulty.creator}
            </span>
          </p>
        )}

        {hoveredDifficulty && (
          <p className="text-xs text-yellow-400">
            ★
            {" "}
            {getBeatmapStarRating(hoveredDifficulty, activeGameMode).toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
}
