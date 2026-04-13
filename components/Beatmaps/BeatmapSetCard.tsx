"use client";

import { Download, Heart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import AudioPreview from "@/app/(website)/user/[id]/components/AudioPreview";
import AudioProgressBar from "@/components/AudioProgressBar";
import { BeatmapDifficultyPopup } from "@/components/Beatmaps/BeatmapDifficultyPopup";
import DifficultyIcon from "@/components/DifficultyIcon";
import {
  useBeatmapSetFavouriteStatus,
  useUpdateBeatmapSetFavouriteStatus,
} from "@/lib/hooks/api/beatmap/useBeatmapSetFavouriteStatus";
import useSelf from "@/lib/hooks/useSelf";
import { useT } from "@/lib/i18n/utils";
import type { BeatmapSetResponse } from "@/lib/types/api";
import { cn } from "@/lib/utils";
import { makeBeatmapSearchUrl } from "@/lib/utils/beatmapSearch";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";
import { getStarRatingColor } from "@/lib/utils/getStarRatingColor";
import { getStatusPillStyle } from "@/lib/utils/getStatusPillStyle";

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
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [thumbLoaded, setThumbLoaded] = useState(false);
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

  const handleRowMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    showTimeoutRef.current = setTimeout(() => setShowPopup(true), 100);
  };

  const handleRowMouseLeave = () => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    hideTimeoutRef.current = setTimeout(() => setShowPopup(false), 500);
  };

  const handlePopupMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const handlePopupMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => setShowPopup(false), 500);
  };

  const handleCardMouseLeave = () => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setShowPopup(false);
  };

  const isAdmin = pathname.includes("/admin/");
  const beatmapSetUrl = `${isAdmin ? "/admin" : ""}/beatmapsets/${beatmapSet.id}`;
  const downloadUrl = `https://osu.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/d/${beatmapSet.id}`;

  const sortedBeatmaps = [...beatmapSet.beatmaps].sort((a, b) => {
    if (a.mode_int !== b.mode_int)
      return a.mode_int - b.mode_int;
    return getBeatmapStarRating(a) - getBeatmapStarRating(b);
  });

  const isCompact = sortedBeatmaps.length > 12;
  const beatmapGroups: Array<{ mode: (typeof sortedBeatmaps)[number]["mode"]; beatmaps: Array<(typeof sortedBeatmaps)[number]> }> = [];
  for (const beatmap of sortedBeatmaps) {
    const last = beatmapGroups.at(-1);
    if (last?.mode === beatmap.mode) {
      last.beatmaps.push(beatmap);
    }
    else {
      beatmapGroups.push({ mode: beatmap.mode, beatmaps: [beatmap] });
    }
  }

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
      onMouseLeave={handleCardMouseLeave}
      className={cn(
        "group relative h-[120px] overflow-hidden rounded-[10px] border border-border/50 shadow-md transition-[border-color,border-radius] duration-150 md:h-[100px]",
        showPopup && "rounded-b-none border-transparent",
      )}
    >
      {/* Full-card cover image background */}
      <Link href={beatmapSetUrl} className="absolute inset-px z-0 overflow-hidden rounded-[inherit]">
        <div className="size-full" style={{ backgroundColor: "hsl(var(--secondary))" }}>
          <img
            src={`https://assets.ppy.sh/beatmaps/${beatmapSet.id}/covers/cover@2x.jpg`}
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
        {/* Play area */}
        <div className="relative w-[90px] flex-shrink-0 overflow-hidden md:w-[100px]">
          <div className="absolute inset-0" style={{ backgroundColor: "hsl(var(--secondary))" }}>
            <img
              src={`https://assets.ppy.sh/beatmaps/${beatmapSet.id}/covers/list@2x.jpg`}
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
              beatmapSet={beatmapSet}
              className="size-full rounded-none !p-0"
            />
          </div>
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
            className={cn(
              "absolute inset-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100",
              showPopup && "opacity-100",
            )}
            style={{
              background: "linear-gradient(90deg, hsl(var(--secondary) / 0.6) 0%, hsl(var(--secondary) / 0.4) 100%)",
            }}
          />

          {/* Info content */}
          <div className="relative flex h-full min-w-0 flex-col px-2.5 pb-1.5 pt-1">
            <h3
              className="truncate text-lg font-semibold leading-tight"
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.75)" }}
            >
              <Link
                href={makeBeatmapSearchUrl("title", beatmapSet.title)}
                className="pointer-events-auto text-white transition-colors duration-150 hover:text-primary"
                onClick={e => e.stopPropagation()}
              >
                {beatmapSet.title}
              </Link>
            </h3>
            <p
              className="truncate text-sm font-semibold leading-tight"
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.75)" }}
            >
              <Link
                href={makeBeatmapSearchUrl("artist", beatmapSet.artist)}
                className="pointer-events-auto text-foreground/80 transition-colors duration-150 hover:text-primary"
                onClick={e => e.stopPropagation()}
              >
                {beatmapSet.artist}
              </Link>
            </p>

            <p className="truncate text-xs font-semibold leading-tight text-muted-foreground">
              {t("mappedBy")}
              {" "}
              <span className="text-foreground/70">{beatmapSet.creator}</span>
            </p>

            {/* Status pill + difficulty dots */}
            <div
              className="pointer-events-auto -mx-[3px] mt-auto flex items-center"
              onMouseEnter={handleRowMouseEnter}
              onMouseLeave={handleRowMouseLeave}
            >
              <span
                className="mx-[3px] flex-shrink-0 rounded-full px-[5px] text-[10px] font-extrabold uppercase leading-[14px]"
                style={{
                  backgroundColor: pillStyle.bg,
                  color: pillStyle.color,
                }}
              >
                {beatmapSet.status}
              </span>
              {beatmapGroups.map(group => (
                <div key={group.mode} className="mx-[3px] flex items-center text-muted-foreground">
                  <DifficultyIcon
                    gameMode={group.mode}
                    className="m-0 mr-[3px] flex items-center p-0 text-[14px] leading-none"
                  />
                  {isCompact
                    ? (
                        <span className="text-[10px] font-semibold">
                          {group.beatmaps.length}
                        </span>
                      )
                    : group.beatmaps.map(beatmap => (
                        <div
                          key={beatmap.id}
                          className="mr-px h-3 w-1.5 rounded-full"
                          style={{ backgroundColor: getStarRatingColor(getBeatmapStarRating(beatmap)) }}
                        />
                      ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Menu area */}
        {self && (
          <div className="pointer-events-auto hidden w-[10px] flex-shrink-0 flex-col items-center justify-center gap-1.5 overflow-hidden bg-card transition-[width] duration-150 ease-in-out md:flex md:group-hover:w-[40px]">
            <button
              onClick={handleFavourite}
              className="rounded-sm p-1.5 text-muted-foreground transition-[color,background-color,opacity] duration-150 hover:bg-accent hover:text-pink-500 md:opacity-0 md:group-hover:opacity-100"
            >
              <Heart
                className={cn(
                  "size-4",
                  favourited && "fill-pink-500 text-pink-500",
                )}
              />
            </button>
            <a
              href={downloadUrl}
              onClick={e => e.stopPropagation()}
              className="rounded-sm p-1.5 text-muted-foreground transition-[color,background-color,opacity] duration-150 hover:bg-accent hover:text-primary md:opacity-0 md:group-hover:opacity-100"
            >
              <Download className="size-4" />
            </a>
          </div>
        )}

        {/* Inverted corners */}
        {self && (
          <>
            <div
              className="pointer-events-none absolute right-[10px] top-0 z-20 hidden h-[10px] w-[10px] bg-card transition-[right] duration-150 ease-in-out md:block md:group-hover:right-[40px]"
              style={{ clipPath: 'path("M11 -1 L11 10 L10 10 A10 10 0 0 0 0 0 L0 -1 Z")' }}
            />
            <div
              className="pointer-events-none absolute bottom-0 right-[10px] z-20 hidden h-[10px] w-[10px] bg-card transition-[right] duration-150 ease-in-out md:block md:group-hover:right-[40px]"
              style={{ clipPath: 'path("M11 11 L11 0 L10 0 A10 10 0 0 1 0 10 L0 11 Z")' }}
            />
          </>
        )}
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
