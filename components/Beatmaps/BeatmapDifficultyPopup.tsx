"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import DifficultyIcon from "@/components/DifficultyIcon";
import type { BeatmapResponse } from "@/lib/types/api";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";
import { getStarRatingColor } from "@/lib/utils/getStarRatingColor";

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
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (visible && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom,
        left: rect.left,
        width: rect.width,
      });
    }
  }, [visible, cardRef]);

  if (!mounted)
    return null;

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed z-[60] overflow-hidden rounded-b-xl border border-t-0 border-border/50 bg-card shadow-lg"
          style={{
            top: position.top,
            left: position.left,
            width: position.width,
          }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="max-h-[300px] overflow-y-auto p-1.5">
            {beatmaps.map(beatmap => (
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
                <span className="flex-1 truncate text-foreground">
                  {beatmap.version}
                </span>
                <span
                  className="flex-shrink-0 text-[11px] font-medium"
                  style={{ color: getStarRatingColor(getBeatmapStarRating(beatmap)) }}
                >
                  ★ {getBeatmapStarRating(beatmap).toFixed(2)}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
