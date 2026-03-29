"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import DifficultyIcon from "@/components/DifficultyIcon";
import type { BeatmapResponse } from "@/lib/types/api";
import { cn } from "@/lib/utils";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";
import { getStarRatingColor } from "@/lib/utils/getStarRatingColor";

function getDifficultyBadgeTextColor(hexColor: string): string {
  const r = Number.parseInt(hexColor.slice(1, 3), 16);
  const g = Number.parseInt(hexColor.slice(3, 5), 16);
  const b = Number.parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "hsl(220, 10%, 25%)" : "white";
}

interface BeatmapDifficultyPopupProps {
  beatmaps: BeatmapResponse[];
  beatmapSetId: number;
  cardRef: React.RefObject<HTMLDivElement | null>;
  visible: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function BeatmapDifficultyPopup({
  beatmaps,
  beatmapSetId,
  cardRef,
  visible,
  onMouseEnter,
  onMouseLeave,
}: BeatmapDifficultyPopupProps) {
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, cardHeight: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (visible && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom - 1,
        left: rect.left,
        width: rect.width,
        cardHeight: rect.height,
      });
    }
  }, [visible, cardRef]);

  if (!mounted)
    return null;

  return createPortal(
    <div
      className={cn(
        "fixed z-[60] transition-opacity duration-150 ease-in-out",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      style={{
        top: position.top,
        left: position.left,
        width: position.width,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative">
        {/* Inverted corners — popup top */}
        <div
          className="pointer-events-none absolute left-0 top-[-10px] z-10 h-[10px] w-[10px] bg-card"
          style={{ clipPath: 'path("M-1 11 L-1 0 L0 0 A10 10 0 0 0 10 10 L10 11 Z")' }}
        />
        <div
          className="pointer-events-none absolute right-0 top-[-10px] z-10 h-[10px] w-[10px] bg-card"
          style={{ clipPath: 'path("M11 11 L11 0 L10 0 A10 10 0 0 1 0 10 L0 11 Z")' }}
        />

        {/* Popup content */}
        <div className="rounded-b-[10px] bg-card">
          <div className="max-h-[50vh] overflow-y-auto py-2.5">
            {beatmaps.map((beatmap) => {
              const sr = getBeatmapStarRating(beatmap);
              const srColor = getStarRatingColor(sr);
              return (
                <Link
                  key={beatmap.id}
                  href={`/beatmapsets/${beatmapSetId}/${beatmap.id}`}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors duration-100 hover:bg-secondary"
                >
                  <DifficultyIcon
                    difficulty={beatmap}
                    gameMode={beatmap.mode}
                    className="text-base"
                  />
                  <span
                    className="flex-shrink-0 rounded-full px-1.5 py-px text-[11px] font-bold leading-[14px]"
                    style={{
                      backgroundColor: srColor,
                      color: getDifficultyBadgeTextColor(srColor),
                    }}
                  >
                    ★ {sr.toFixed(2)}
                  </span>
                  <span className="flex-1 truncate text-foreground">
                    {beatmap.version}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Unified border/shadow overlay — wraps both card and popup as one unit */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 z-20 w-full rounded-[10px] border-2 border-primary shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
          style={{ height: `calc(100% + ${position.cardHeight - 1}px)` }}
        />
      </div>
    </div>,
    document.body,
  );
}
