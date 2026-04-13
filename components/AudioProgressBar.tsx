"use client";

import { useEffect, useRef } from "react";

import useAudioPlayer from "@/lib/hooks/useAudioPlayer";
import { cn } from "@/lib/utils";

interface AudioProgressBarProps {
  audioId: number;
  className?: string;
}

export default function AudioProgressBar({ audioId, className }: AudioProgressBarProps) {
  const { playerRef, isPlaying } = useAudioPlayer();
  const containerRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    const audioSrc = `${audioId}.mp3`;

    const update = () => {
      const audio = playerRef.current;
      if (!fillRef.current || !containerRef.current)
        return;

      const matchesSrc = audio?.src?.includes(audioSrc);
      const dur = audio?.duration;
      const time = audio?.currentTime ?? 0;
      const hasProgress = matchesSrc && dur && Number.isFinite(dur) && time > 0 && time < dur;

      containerRef.current.style.display = hasProgress ? "" : "none";
      if (hasProgress) {
        fillRef.current.style.transform = `scaleX(${time / dur})`;
      }
    };

    const tick = () => {
      update();
      rafId = requestAnimationFrame(tick);
    };

    const isActive = isPlaying && playerRef.current?.src?.includes(audioSrc);

    if (isActive) {
      rafId = requestAnimationFrame(tick);
    }
    else {
      update();
    }

    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, audioId, playerRef]);

  return (
    <div ref={containerRef} className={cn("w-full", className)} style={{ display: "none" }}>
      <div className="h-full bg-transparent">
        <div
          ref={fillRef}
          className="size-full origin-left bg-primary will-change-transform"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </div>
  );
}
