"use client";

import { Download, Heart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import AudioPreview from "@/app/(website)/user/[id]/components/AudioPreview";
import AudioProgressBar from "@/components/AudioProgressBar";
import { BeatmapDifficultyPopup } from "@/components/Beatmaps/BeatmapDifficultyPopup";
import {
  useBeatmapSetFavouriteStatus,
  useUpdateBeatmapSetFavouriteStatus,
} from "@/lib/hooks/api/beatmap/useBeatmapSetFavouriteStatus";
import useSelf from "@/lib/hooks/useSelf";
import { useT } from "@/lib/i18n/utils";
import type { BeatmapSetResponse } from "@/lib/types/api";
import { cn } from "@/lib/utils";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";
import { getStarRatingColor } from "@/lib/utils/getStarRatingColor";

function getStatusPillStyle(status: string): { bg: string; color: string } {
  const darkText = "hsl(220, 10%, 25%)";
  const styles: Record<string, { bg: string; color: string }> = {
    ranked: { bg: "hsl(90, 100%, 70%)", color: darkText },
    approved: { bg: "hsl(90, 100%, 70%)", color: darkText },
    loved: { bg: "hsl(333, 100%, 70%)", color: darkText },
    qualified: { bg: "hsl(200, 100%, 70%)", color: darkText },
    pending: { bg: "hsl(45, 100%, 70%)", color: darkText },
    wip: { bg: "hsl(20, 100%, 70%)", color: darkText },
    graveyard: { bg: "hsl(0, 0%, 0%)", color: "hsl(220, 10%, 40%)" },
  };
  return styles[status.toLowerCase()] ?? { bg: "hsl(0, 0%, 0%)", color: "hsl(220, 10%, 40%)" };
}

interface BeatmapSetCardProps {
  beatmapSet: BeatmapSetResponse;
}

export function BeatmapSetCard({ beatmapSet }: BeatmapSetCardProps) {
  const t = useT("components.beatmapSetCard");
  const pathname = usePathname();
  const cardRef = useRef<HTMLDivElement>(null);
  const { self } = useSelf();

  const { data: favouriteData } = useBeatmapSetFavouriteStatus(beatmapSet.id);
  const { trigger: toggleFavourite } = useUpdateBeatmapSetFavouriteStatus(beatmapSet.id);
  const favourited = favouriteData?.favourited ?? false;

  const [showPopup, setShowPopup] = useState(false);
  const showTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (showTimeoutRef.current)
        clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current)
        clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (showPopup) {
      const handleScroll = () => {
        setShowPopup(false);
        if (showTimeoutRef.current)
          clearTimeout(showTimeoutRef.current);
        if (hideTimeoutRef.current)
          clearTimeout(hideTimeoutRef.current);
      };
      window.addEventListener("scroll", handleScroll, true);
      return () => window.removeEventListener("scroll", handleScroll, true);
    }
  }, [showPopup]);

  const handleDotsMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    showTimeoutRef.current = setTimeout(() => setShowPopup(true), 100);
  };

  const handleDotsMouseLeave = () => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    hideTimeoutRef.current = setTimeout(() => setShowPopup(false), 400);
  };

  const handlePopupMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const handlePopupMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => setShowPopup(false), 400);
  };

  const isAdmin = pathname.includes("/admin/");
  const beatmapSetUrl = `${isAdmin ? "/admin" : ""}/beatmapsets/${beatmapSet.id}`;
  const downloadUrl = `https://osu.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/d/${beatmapSet.id}`;

  const sortedBeatmaps = [...beatmapSet.beatmaps].sort((a, b) => {
    if (a.mode_int !== b.mode_int)
      return a.mode_int - b.mode_int;
    return getBeatmapStarRating(a) - getBeatmapStarRating(b);
  });

  const pillStyle = getStatusPillStyle(beatmapSet.status);

  const handleFavourite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!self)
      return;
    toggleFavourite(
      { favourited: !favourited },
      { optimisticData: { favourited: !favourited } },
    );
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "group relative h-[100px] overflow-hidden rounded-[10px] border border-border/50 shadow-md",
        showPopup && "rounded-b-none border-b-transparent",
      )}
    >
      {/* Full-card cover image background */}
      <Link href={beatmapSetUrl} className="absolute inset-px z-0 overflow-hidden rounded-[inherit]">
        <div
          className="size-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(https://assets.ppy.sh/beatmaps/${beatmapSet.id}/covers/cover@2x.jpg)`,
            backgroundColor: "hsl(var(--secondary))",
          }}
        />
      </Link>

      {/* Content layer */}
      <div className="pointer-events-none relative z-10 flex h-full">
        {/* Play area */}
        <div className="relative w-20 flex-shrink-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(https://assets.ppy.sh/beatmaps/${beatmapSet.id}/covers/list@2x.jpg)`,
              backgroundColor: "hsl(var(--secondary))",
            }}
          />
          <div className="absolute inset-0 bg-black/30 transition-all duration-150 md:bg-black/0 md:group-hover:bg-black/60" />
          <div className="pointer-events-auto absolute inset-0 flex items-center justify-center opacity-100 transition-opacity duration-150 md:opacity-0 md:group-hover:opacity-100">
            <AudioPreview
              beatmapSet={beatmapSet}
              className="size-full rounded-none p-0"
            />
          </div>
        </div>

        {/* Info area */}
        <div className="relative flex min-w-0 flex-1 flex-col">
          {/* Base gradient bg — always visible */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(90deg, hsl(var(--card)) 0%, hsl(var(--card) / 0.85) 100%)",
            }}
          />
          {/* Hover tint overlay — fades in on top */}
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
            style={{
              background: "linear-gradient(90deg, hsl(var(--secondary) / 0.6) 0%, hsl(var(--secondary) / 0.4) 100%)",
            }}
          />

          {/* Info content — flat flex column, mt-auto on mapper absorbs remaining space */}
          <div className="relative flex h-full min-w-0 flex-col px-2.5 pb-1.5 pt-1">
            <h3
              className="truncate text-lg font-semibold leading-tight text-white"
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.75)" }}
            >
              {beatmapSet.title}
            </h3>
            <p
              className="truncate text-sm font-semibold leading-tight text-foreground/80"
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.75)" }}
            >
              {beatmapSet.artist}
            </p>

            <p className="truncate text-xs font-semibold leading-tight text-muted-foreground">
              {t("mappedBy")}
              {" "}
              <span className="text-foreground/70">{beatmapSet.creator}</span>
            </p>

            {/* Status pill + Difficulty dots */}
            <div className="pointer-events-auto mt-auto flex items-center gap-2">
              <span
                className="flex-shrink-0 rounded-full px-[5px] text-[10px] font-extrabold uppercase leading-[14px]"
                style={{
                  backgroundColor: pillStyle.bg,
                  color: pillStyle.color,
                }}
              >
                {beatmapSet.status}
              </span>
              <div
                className="flex items-center gap-px"
                onMouseEnter={handleDotsMouseEnter}
                onMouseLeave={handleDotsMouseLeave}
              >
                {sortedBeatmaps.length <= 12
                  ? sortedBeatmaps.map(beatmap => (
                      <div
                        key={beatmap.id}
                        className="h-3 w-1.5 rounded-full transition-transform duration-100 hover:scale-125"
                        style={{ backgroundColor: getStarRatingColor(getBeatmapStarRating(beatmap)) }}
                      />
                    ))
                  : (
                      <span className="text-[10px] font-semibold text-muted-foreground">
                        {t("difficulties", { count: sortedBeatmaps.length })}
                      </span>
                    )}
              </div>
            </div>
          </div>
        </div>

        {/* Menu area */}
        <div className="pointer-events-auto flex w-[40px] flex-shrink-0 flex-col items-center justify-center gap-1.5 overflow-hidden bg-card transition-[width] duration-150 ease-in-out md:w-[10px] md:group-hover:w-[40px]">
          <button
            onClick={handleFavourite}
            disabled={!self}
            className="rounded-sm p-1.5 text-muted-foreground transition-[color,background-color,opacity] duration-150 hover:bg-accent hover:text-pink-500 disabled:opacity-30 md:opacity-0 md:group-hover:opacity-100"
          >
            <Heart
              className={cn(
                "size-4",
                favourited && "fill-pink-500 text-pink-500",
              )}
            />
          </button>
          {self && (
            <a
              href={downloadUrl}
              onClick={e => e.stopPropagation()}
              className="rounded-sm p-1.5 text-muted-foreground transition-[color,background-color,opacity] duration-150 hover:bg-accent hover:text-primary md:opacity-0 md:group-hover:opacity-100"
            >
              <Download className="size-4" />
            </a>
          )}
        </div>
      </div>

      {/* Audio progress bar */}
      <AudioProgressBar
        audioId={beatmapSet.id}
        className="absolute bottom-0 left-0 z-20 h-0.5 w-full"
      />

      {/* Difficulty popup */}
      <BeatmapDifficultyPopup
        beatmaps={sortedBeatmaps}
        beatmapSetId={beatmapSet.id}
        cardRef={cardRef}
        visible={showPopup}
        onMouseEnter={handlePopupMouseEnter}
        onMouseLeave={handlePopupMouseLeave}
      />
    </div>
  );
}
