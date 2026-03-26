"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, Volume1, Volume2, VolumeX, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { AudioEqualizer } from "@/components/AudioEqualizer";
import useAudioPlayer from "@/lib/hooks/useAudioPlayer";
import { cn } from "@/lib/utils";

function formatTime(seconds: number): string {
  if (!seconds || !Number.isFinite(seconds))
    return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function AudioPlayerBar() {
  const {
    playerRef,
    currentTrack,
    isPlaying,
    duration,
    play,
    pause,
    stop,
    seek,
    volume,
    setVolume,
    isMuted,
    toggleMute,
  } = useAudioPlayer();

  const pathname = usePathname();
  const isFullMode = /^\/(?:beatmapsets|beatmaps)/.test(pathname);

  const progressRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const timeDisplayRef = useRef<HTMLSpanElement>(null);

  const [isSeeking, setIsSeeking] = useState(false);
  const [isSeekingVolume, setIsSeekingVolume] = useState(false);
  const [coverError, setCoverError] = useState(false);

  useEffect(() => {
    setCoverError(false);
  }, [currentTrack?.id]);

  useEffect(() => {
    let rafId: number;
    const tick = () => {
      const audio = playerRef.current;
      if (audio) {
        const time = audio.currentTime;
        const dur = audio.duration;
        if (progressFillRef.current && dur && Number.isFinite(dur)) {
          progressFillRef.current.style.clipPath = `inset(0 ${(1 - time / dur) * 100}% 0 0)`;
        }
        if (timeDisplayRef.current) {
          timeDisplayRef.current.textContent = formatTime(time);
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    if (isPlaying) {
      rafId = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, playerRef]);

  useEffect(() => {
    if (!isPlaying && playerRef.current) {
      const time = playerRef.current.currentTime;
      const dur = playerRef.current.duration;
      if (progressFillRef.current) {
        progressFillRef.current.style.clipPath
          = dur && Number.isFinite(dur) ? `inset(0 ${(1 - time / dur) * 100}% 0 0)` : "inset(0 100% 0 0)";
      }
      if (timeDisplayRef.current) {
        timeDisplayRef.current.textContent = formatTime(time);
      }
    }
  }, [isPlaying, playerRef]);

  const displayVolume = isMuted ? 0 : volume;

  const handleProgressSeek = useCallback(
    (clientX: number) => {
      if (!progressRef.current || !playerRef.current)
        return;
      const dur = playerRef.current.duration;
      if (!dur || !Number.isFinite(dur))
        return;
      const rect = progressRef.current.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      seek(ratio * dur);
      if (progressFillRef.current) {
        progressFillRef.current.style.clipPath = `inset(0 ${(1 - ratio) * 100}% 0 0)`;
      }
      if (timeDisplayRef.current) {
        timeDisplayRef.current.textContent = formatTime(ratio * dur);
      }
    },
    [seek, playerRef],
  );

  const handleVolumeSeek = useCallback(
    (clientX: number, bar: HTMLDivElement) => {
      const rect = bar.getBoundingClientRect();
      setVolume(Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)));
    },
    [setVolume],
  );

  const VolumeIcon
    = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <AnimatePresence>
      {currentTrack && (
        <motion.div
          layout
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{
            layout: { type: "spring", stiffness: 300, damping: 30 },
            y: { type: "spring", stiffness: 400, damping: 35 },
            opacity: { duration: 0.15 },
          }}
          className={cn(
            "fixed z-50 overflow-hidden border-border bg-background/95 backdrop-blur-lg",
            isFullMode
              ? "inset-x-0 bottom-0 border-t"
              : "bottom-4 right-4 w-[320px] rounded-xl border shadow-2xl",
          )}
        >
          <div
            ref={progressRef}
            className="group/progress relative h-1 w-full cursor-pointer transition-[height] duration-150 hover:h-1.5"
            onPointerDown={(e) => {
              setIsSeeking(true);
              e.currentTarget.setPointerCapture(e.pointerId);
              handleProgressSeek(e.clientX);
            }}
            onPointerMove={(e) => {
              if (isSeeking)
                handleProgressSeek(e.clientX);
            }}
            onPointerUp={() => setIsSeeking(false)}
            onPointerCancel={() => setIsSeeking(false)}
          >
            <div className="absolute inset-0 bg-muted-foreground/20" />
            <div
              ref={progressFillRef}
              className="absolute inset-0 bg-primary will-change-[clip-path]"
              style={{ clipPath: "inset(0 100% 0 0)" }}
            />
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {isFullMode ? (
              <motion.div
                key="full"
                layout="position"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-3 px-4 py-2"
              >
                <div className="min-w-0 flex-1 overflow-hidden">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={currentTrack.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center gap-3"
                    >
                      <div className="relative size-10 flex-shrink-0 overflow-hidden rounded">
                        {!coverError ? (
                          <img
                            src={`https://assets.ppy.sh/beatmaps/${currentTrack.id}/covers/list.jpg`}
                            alt={currentTrack.title}
                            className="size-full object-cover"
                            onError={() => setCoverError(true)}
                          />
                        ) : (
                          <div className="size-full bg-muted" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          {isPlaying && (
                            <AudioEqualizer className="h-3 flex-shrink-0 text-primary" />
                          )}
                          <Link
                            href={`/beatmapsets/${currentTrack.id}`}
                            className="smooth-transition truncate text-sm font-semibold hover:text-primary"
                          >
                            {currentTrack.title}
                          </Link>
                        </div>
                        <p className="truncate text-xs text-muted-foreground">
                          {currentTrack.artist}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="flex flex-shrink-0 items-center gap-3">
                  <button
                    onClick={() => (isPlaying ? pause() : play())}
                    className="smooth-transition flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground hover:brightness-110"
                  >
                    {isPlaying ? (
                      <Pause className="size-4 fill-current" />
                    ) : (
                      <Play className="size-4 fill-current pl-0.5" />
                    )}
                  </button>

                  <span className="hidden text-xs tabular-nums text-muted-foreground sm:block">
                    <span ref={timeDisplayRef}>0:00</span>
                    {" / "}
                    {formatTime(duration)}
                  </span>
                </div>

                <div className="flex flex-shrink-0 items-center gap-2">
                  <div className="group/volume hidden items-center gap-1.5 sm:flex">
                    <button
                      onClick={toggleMute}
                      className="smooth-transition flex size-7 items-center justify-center rounded text-muted-foreground hover:text-foreground"
                    >
                      <VolumeIcon className="size-4" />
                    </button>

                    <div
                      className="relative h-1 w-20 cursor-pointer rounded-full bg-muted-foreground/20"
                      onPointerDown={(e) => {
                        setIsSeekingVolume(true);
                        e.currentTarget.setPointerCapture(e.pointerId);
                        handleVolumeSeek(e.clientX, e.currentTarget);
                      }}
                      onPointerMove={(e) => {
                        if (isSeekingVolume)
                          handleVolumeSeek(e.clientX, e.currentTarget);
                      }}
                      onPointerUp={() => setIsSeekingVolume(false)}
                      onPointerCancel={() => setIsSeekingVolume(false)}
                    >
                      <div
                        className={cn(
                          "absolute inset-y-0 left-0 rounded-full bg-primary",
                          isSeekingVolume ? "" : "smooth-transition",
                        )}
                        style={{ width: `${displayVolume * 100}%` }}
                      />
                      <div
                        className={cn(
                          "absolute top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-primary-foreground opacity-0 transition-opacity hover:opacity-100",
                          isSeekingVolume
                            ? "opacity-100"
                            : "group-hover/volume:opacity-100",
                        )}
                        style={{ left: `calc(${displayVolume * 100}% - 5px)` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={stop}
                    className="smooth-transition flex size-7 items-center justify-center rounded text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="mini"
                layout="position"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2.5 px-3 py-2"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={currentTrack.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex min-w-0 flex-1 items-center gap-2.5"
                  >
                    <div className="relative size-9 flex-shrink-0 overflow-hidden rounded">
                      {!coverError ? (
                        <img
                          src={`https://assets.ppy.sh/beatmaps/${currentTrack.id}/covers/list.jpg`}
                          alt={currentTrack.title}
                          className="size-full object-cover"
                          onError={() => setCoverError(true)}
                        />
                      ) : (
                        <div className="size-full bg-muted" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        {isPlaying && (
                          <AudioEqualizer className="h-2.5 flex-shrink-0 text-primary" />
                        )}
                        <Link
                          href={`/beatmapsets/${currentTrack.id}`}
                          className="smooth-transition truncate text-xs font-semibold hover:text-primary"
                        >
                          {currentTrack.title}
                        </Link>
                      </div>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {currentTrack.artist}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="flex flex-shrink-0 items-center gap-1.5">
                  <div className="group/mini-vol flex items-center">
                    <button
                      onClick={toggleMute}
                      className="smooth-transition flex size-6 items-center justify-center rounded text-muted-foreground hover:text-foreground"
                    >
                      <VolumeIcon className="size-3.5" />
                    </button>
                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-200",
                        isSeekingVolume
                          ? "ml-1 w-14"
                          : "w-0 group-hover/mini-vol:ml-1 group-hover/mini-vol:w-14",
                      )}
                    >
                      <div
                        className="relative h-1 w-14 cursor-pointer rounded-full bg-muted-foreground/20"
                        onPointerDown={(e) => {
                          setIsSeekingVolume(true);
                          e.currentTarget.setPointerCapture(e.pointerId);
                          handleVolumeSeek(e.clientX, e.currentTarget);
                        }}
                        onPointerMove={(e) => {
                          if (isSeekingVolume)
                            handleVolumeSeek(e.clientX, e.currentTarget);
                        }}
                        onPointerUp={() => setIsSeekingVolume(false)}
                        onPointerCancel={() => setIsSeekingVolume(false)}
                      >
                        <div
                          className={cn(
                            "absolute inset-y-0 left-0 rounded-full bg-primary",
                            isSeekingVolume ? "" : "smooth-transition",
                          )}
                          style={{ width: `${displayVolume * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => (isPlaying ? pause() : play())}
                    className="smooth-transition flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground hover:brightness-110"
                  >
                    {isPlaying ? (
                      <Pause className="size-3.5 fill-current" />
                    ) : (
                      <Play className="size-3.5 fill-current pl-0.5" />
                    )}
                  </button>
                  <button
                    onClick={stop}
                    className="smooth-transition flex size-6 items-center justify-center rounded text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
