"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, Volume1, Volume2, VolumeX, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { AudioEqualizer } from "@/components/AudioEqualizer";
import useAudioPlayer from "@/lib/hooks/useAudioPlayer";
import { useWaveform } from "@/lib/hooks/useWaveform";
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

  const [isSeekingVolume, setIsSeekingVolume] = useState(false);
  const [coverError, setCoverError] = useState(false);

  const isHoveringRef = useRef(false);
  const isSeekingRef = useRef(false);
  const progressRectRef = useRef<DOMRect | null>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const waveformCanvasRef = useRef<HTMLCanvasElement>(null);
  const tooltipTimeRef = useRef<HTMLSpanElement>(null);
  const colorsRef = useRef({ primary: "", muted: "" });

  const peaks = useWaveform(currentTrack?.id ?? null);
  const peaksRef = useRef<number[]>([]);
  peaksRef.current = peaks;

  useEffect(() => {
    setCoverError(false);
  }, [currentTrack?.id]);

  useEffect(() => {
    const style = getComputedStyle(document.documentElement);
    colorsRef.current.primary = `hsl(${style.getPropertyValue("--primary").trim()})`;
    colorsRef.current.muted = `hsl(${style.getPropertyValue("--muted-foreground").trim()})`;
  }, []);

  useEffect(() => {
    const canvas = waveformCanvasRef.current;
    if (!canvas)
      return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 160 * dpr;
    canvas.height = 40 * dpr;
  }, []);

  useEffect(() => {
    const update = () => {
      if (progressRef.current) {
        progressRectRef.current = progressRef.current.getBoundingClientRect();
      }
    };
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!currentTrack) {
      if (thumbRef.current)
        thumbRef.current.style.opacity = "0";
      if (tooltipRef.current)
        tooltipRef.current.style.opacity = "0";
      isHoveringRef.current = false;
    }
  }, [currentTrack]);

  useEffect(() => {
    let rafId: number;
    const tick = () => {
      const audio = playerRef.current;
      if (audio) {
        const time = audio.currentTime;
        const dur = audio.duration;
        if (progressFillRef.current && dur && Number.isFinite(dur)) {
          progressFillRef.current.style.transform = `scaleX(${time / dur})`;
        }
        if (timeDisplayRef.current) {
          timeDisplayRef.current.textContent = formatTime(time);
        }
        if (
          thumbRef.current
          && (isHoveringRef.current || isSeekingRef.current)
          && dur
          && Number.isFinite(dur)
        ) {
          const rect = progressRectRef.current;
          if (rect) {
            thumbRef.current.style.left = `${rect.left + (time / dur) * rect.width}px`;
            thumbRef.current.style.top = `${rect.top + rect.height / 2}px`;
          }
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
        progressFillRef.current.style.transform
          = dur && Number.isFinite(dur) ? `scaleX(${time / dur})` : "scaleX(0)";
      }
      if (timeDisplayRef.current) {
        timeDisplayRef.current.textContent = formatTime(time);
      }
      if (
        thumbRef.current
        && (isHoveringRef.current || isSeekingRef.current)
        && dur
        && Number.isFinite(dur)
      ) {
        const rect = progressRectRef.current;
        if (rect) {
          thumbRef.current.style.left = `${rect.left + (time / dur) * rect.width}px`;
          thumbRef.current.style.top = `${rect.top + rect.height / 2}px`;
        }
      }
    }
  }, [isPlaying, playerRef]);

  const displayVolume = isMuted ? 0 : volume;

  const drawWaveformPreview = useCallback((hoverRatio: number) => {
    const canvas = waveformCanvasRef.current;
    const p = peaksRef.current;
    if (!canvas || p.length === 0)
      return;

    const ctx = canvas.getContext("2d");
    if (!ctx)
      return;

    const dpr = window.devicePixelRatio || 1;
    const w = 160;
    const h = 40;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const barCount = p.length;
    const totalBarW = w / barCount;
    const barW = Math.max(1, totalBarW * 0.6);
    const minH = 2;

    for (let i = 0; i < barCount; i++) {
      const x = i * totalBarW + (totalBarW - barW) / 2;
      const barH = Math.max(minH, p[i] * (h - 6)) + 2;
      const y = (h - barH) / 2;

      ctx.fillStyle = (i + 0.5) / barCount <= hoverRatio
        ? colorsRef.current.primary
        : colorsRef.current.muted;

      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(x, y, barW, barH, barW / 2);
      }
      else {
        ctx.rect(x, y, barW, barH);
      }
      ctx.fill();
    }
  }, []);

  const updateTooltipPosition = useCallback((clientX: number) => {
    if (!progressRef.current || !playerRef.current)
      return;
    const dur = playerRef.current.duration;
    if (!dur || !Number.isFinite(dur))
      return;

    const rect = progressRef.current.getBoundingClientRect();
    progressRectRef.current = rect;
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));

    if (tooltipRef.current) {
      const tooltipW = tooltipRef.current.offsetWidth || 176;
      const halfW = tooltipW / 2;
      const clampedX = Math.max(rect.left + halfW, Math.min(rect.right - halfW, clientX));
      tooltipRef.current.style.left = `${clampedX}px`;
      tooltipRef.current.style.top = `${rect.top - 8}px`;
    }

    if (tooltipTimeRef.current) {
      tooltipTimeRef.current.textContent = formatTime(ratio * dur);
    }

    drawWaveformPreview(ratio);
  }, [playerRef, drawWaveformPreview]);

  const handleProgressSeek = useCallback(
    (clientX: number) => {
      if (!progressRef.current || !playerRef.current)
        return;
      const dur = playerRef.current.duration;
      if (!dur || !Number.isFinite(dur))
        return;
      const rect = progressRef.current.getBoundingClientRect();
      progressRectRef.current = rect;
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      seek(ratio * dur);
      if (progressFillRef.current) {
        progressFillRef.current.style.transform = `scaleX(${ratio})`;
      }
      if (timeDisplayRef.current) {
        timeDisplayRef.current.textContent = formatTime(ratio * dur);
      }
      if (thumbRef.current) {
        thumbRef.current.style.left = `${rect.left + ratio * rect.width}px`;
        thumbRef.current.style.top = `${rect.top + rect.height / 2}px`;
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
    <>
      <div
        ref={thumbRef}
        className="pointer-events-none fixed z-[60] size-3.5 rounded-full bg-primary shadow-md"
        style={{
          opacity: 0,
          transform: "translate(-50%, -50%) scale(1)",
          transition: "opacity 150ms, transform 150ms",
        }}
      />

      <div
        ref={tooltipRef}
        className="pointer-events-none fixed z-[60] flex flex-col items-center rounded-lg border border-border bg-background/95 p-2 shadow-xl backdrop-blur-md"
        style={{
          opacity: 0,
          transform: "translate(-50%, -100%)",
          transition: "opacity 150ms",
        }}
      >
        <canvas
          ref={waveformCanvasRef}
          className="rounded-sm"
          style={{ width: 160, height: 40 }}
        />
        <span
          ref={tooltipTimeRef}
          className="mt-1.5 text-center text-[11px] font-medium tabular-nums text-foreground"
        >
          0:00
        </span>
      </div>

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
              className="group/progress relative h-1.5 w-full cursor-pointer transition-[height] duration-150 hover:h-2"
              onPointerEnter={(e) => {
                isHoveringRef.current = true;
                progressRectRef.current = progressRef.current?.getBoundingClientRect() ?? null;
                if (thumbRef.current)
                  thumbRef.current.style.opacity = "1";
                if (tooltipRef.current)
                  tooltipRef.current.style.opacity = "1";
                updateTooltipPosition(e.clientX);

                if (thumbRef.current && playerRef.current) {
                  const dur = playerRef.current.duration;
                  const time = playerRef.current.currentTime;
                  const rect = progressRectRef.current;
                  if (rect && dur && Number.isFinite(dur)) {
                    thumbRef.current.style.left = `${rect.left + (time / dur) * rect.width}px`;
                    thumbRef.current.style.top = `${rect.top + rect.height / 2}px`;
                  }
                }
              }}
              onPointerLeave={() => {
                isHoveringRef.current = false;
                if (!isSeekingRef.current) {
                  if (thumbRef.current)
                    thumbRef.current.style.opacity = "0";
                  if (tooltipRef.current)
                    tooltipRef.current.style.opacity = "0";
                }
              }}
              onPointerDown={(e) => {
                isSeekingRef.current = true;
                e.currentTarget.setPointerCapture(e.pointerId);
                handleProgressSeek(e.clientX);
                if (thumbRef.current) {
                  thumbRef.current.style.opacity = "1";
                  thumbRef.current.style.transform = "translate(-50%, -50%) scale(1.5)";
                }
              }}
              onPointerMove={(e) => {
                if (isSeekingRef.current)
                  handleProgressSeek(e.clientX);
                updateTooltipPosition(e.clientX);
              }}
              onPointerUp={() => {
                isSeekingRef.current = false;
                if (thumbRef.current) {
                  thumbRef.current.style.transform = "translate(-50%, -50%) scale(1)";
                }
                if (!isHoveringRef.current) {
                  if (thumbRef.current)
                    thumbRef.current.style.opacity = "0";
                  if (tooltipRef.current)
                    tooltipRef.current.style.opacity = "0";
                }
              }}
              onPointerCancel={() => {
                isSeekingRef.current = false;
                if (thumbRef.current) {
                  thumbRef.current.style.opacity = "0";
                  thumbRef.current.style.transform = "translate(-50%, -50%) scale(1)";
                }
                if (tooltipRef.current)
                  tooltipRef.current.style.opacity = "0";
              }}
            >
              <div className="absolute inset-0 bg-muted-foreground/20" />
              <div
                ref={progressFillRef}
                className="absolute inset-0 origin-left bg-primary will-change-transform"
                style={{ transform: "scaleX(0)" }}
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
    </>
  );
}
