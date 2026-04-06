"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Heart,
  MoreHorizontal,
  Pause,
  Play,
  Volume1,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  useBeatmapSetFavouriteStatus,
  useUpdateBeatmapSetFavouriteStatus,
} from "@/lib/hooks/api/beatmap/useBeatmapSetFavouriteStatus";
import useAudioPlayer from "@/lib/hooks/useAudioPlayer";
import useSelf from "@/lib/hooks/useSelf";
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
    duration: _duration,
    play,
    pause,
    stop,
    seek,
    volume,
    setVolume,
    isMuted,
    toggleMute,
  } = useAudioPlayer();
  const { self } = useSelf();

  const trackId = currentTrack?.id ?? 0;
  const { data: favouriteData } = useBeatmapSetFavouriteStatus(trackId);
  const { trigger: toggleFavourite } = useUpdateBeatmapSetFavouriteStatus(trackId);
  const favourited = favouriteData?.favourited ?? false;

  const progressRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);

  const [isSeekingVolume, setIsSeekingVolume] = useState(false);
  const [coverError, setCoverError] = useState(false);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const [renderTrack, setRenderTrack] = useState<typeof currentTrack>(null);
  const [isBarVisible, setIsBarVisible] = useState(false);
  const [incomingViz, setIncomingViz] = useState<{ trackId: number | null; opacity: number; bpm: number }>({ trackId: null, opacity: 0, bpm: 160 });
  const [outgoingViz, setOutgoingViz] = useState<{ trackId: number | null; opacity: number; bpm: number }>({ trackId: null, opacity: 0, bpm: 160 });
  const incomingVizRef = useRef(incomingViz);
  const outgoingVizRef = useRef(outgoingViz);
  const wasPlayingRef = useRef(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const vizSwitchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const vizClearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const vizFadeInTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isHoveringRef = useRef(false);
  const isSeekingRef = useRef(false);
  const progressRectRef = useRef<DOMRect | null>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const waveformCanvasRef = useRef<HTMLCanvasElement>(null);
  const ambientCanvasRef = useRef<HTMLCanvasElement>(null);
  const ambientOutgoingCanvasRef = useRef<HTMLCanvasElement>(null);
  const ambientRafRef = useRef<number | null>(null);
  const ambientOutgoingRafRef = useRef<number | null>(null);
  const ambientStartTsRef = useRef<number>(0);
  const ambientOutgoingStartTsRef = useRef<number>(0);
  const tooltipTimeRef = useRef<HTMLSpanElement>(null);
  const colorsRef = useRef({ primary: "", muted: "" });

  const peaks = useWaveform(trackId || null);
  const peaksRef = useRef<number[]>([]);
  peaksRef.current = peaks;

  useEffect(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (currentTrack) {
      setRenderTrack(currentTrack);
      setIsBarVisible(true);
      return;
    }

    setIsBarVisible(false);
    hideTimerRef.current = setTimeout(() => {
      setRenderTrack(null);
      hideTimerRef.current = null;
    }, 320);
  }, [currentTrack]);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
      if (vizSwitchTimerRef.current) {
        clearTimeout(vizSwitchTimerRef.current);
      }
      if (vizClearTimerRef.current) {
        clearTimeout(vizClearTimerRef.current);
      }
      if (vizFadeInTimerRef.current) {
        clearTimeout(vizFadeInTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setCoverError(false);
  }, [renderTrack?.id]);

  useEffect(() => {
    incomingVizRef.current = incomingViz;
  }, [incomingViz]);

  useEffect(() => {
    outgoingVizRef.current = outgoingViz;
  }, [outgoingViz]);

  useEffect(() => {
    const FADE_MS = 280;
    const activeId = currentTrack?.id ?? null;
    const trackBpm = currentTrack?.bpm ?? 160;
    const wasPlaying = wasPlayingRef.current;

    if (vizSwitchTimerRef.current) {
      clearTimeout(vizSwitchTimerRef.current);
      vizSwitchTimerRef.current = null;
    }
    if (vizClearTimerRef.current) {
      clearTimeout(vizClearTimerRef.current);
      vizClearTimerRef.current = null;
    }
    if (vizFadeInTimerRef.current) {
      clearTimeout(vizFadeInTimerRef.current);
      vizFadeInTimerRef.current = null;
    }

    const currentIncoming = incomingVizRef.current;

    // Pause/stop/end: smoothly fade both layers, then clear.
    if (!isPlaying || !activeId) {
      setIncomingViz(prev => ({ ...prev, opacity: 0 }));
      setOutgoingViz(prev => ({ ...prev, opacity: 0 }));

      vizClearTimerRef.current = setTimeout(() => {
        setIncomingViz(prev => (prev.opacity === 0 ? { trackId: null, opacity: 0, bpm: 160 } : prev));
        setOutgoingViz({ trackId: null, opacity: 0, bpm: 160 });
        vizClearTimerRef.current = null;
      }, FADE_MS + 20);
      wasPlayingRef.current = false;
      return;
    }

    // First load while playing: fade incoming in.
    if (!currentIncoming.trackId) {
      setOutgoingViz({ trackId: null, opacity: 0, bpm: 160 });
      setIncomingViz({ trackId: activeId, opacity: 0, bpm: trackBpm });
      vizFadeInTimerRef.current = setTimeout(() => {
        setIncomingViz(prev => (prev.trackId === activeId ? { ...prev, opacity: 1 } : prev));
        vizFadeInTimerRef.current = null;
      }, 32);
      wasPlayingRef.current = true;
      return;
    }

    // Track switch while playing: full fade-out, then fade-in (no overlap).
    if (currentIncoming.trackId !== activeId) {
      const previousId = currentIncoming.trackId;
      const previousBpm = currentIncoming.bpm;
      setOutgoingViz({ trackId: previousId, opacity: 1, bpm: previousBpm });
      setIncomingViz({ trackId: activeId, opacity: 0, bpm: trackBpm });

      requestAnimationFrame(() => {
        setOutgoingViz(prev => (prev.trackId === previousId ? { ...prev, opacity: 0 } : prev));
      });

      vizSwitchTimerRef.current = setTimeout(() => {
        setOutgoingViz(prev => (prev.trackId === previousId ? { trackId: null, opacity: 0, bpm: 160 } : prev));
        vizFadeInTimerRef.current = setTimeout(() => {
          setIncomingViz(prev => (prev.trackId === activeId ? { ...prev, opacity: 1 } : prev));
          vizFadeInTimerRef.current = null;
        }, 32);
        vizSwitchTimerRef.current = null;
      }, FADE_MS + 20);
      wasPlayingRef.current = true;
      return;
    }

    // Resume from pause on same track: force fresh fade-in.
    if (!wasPlaying && currentIncoming.trackId === activeId) {
      setIncomingViz(prev => ({ ...prev, opacity: 0 }));
      vizFadeInTimerRef.current = setTimeout(() => {
        setIncomingViz(prev => (prev.trackId === activeId ? { ...prev, opacity: 1 } : prev));
        vizFadeInTimerRef.current = null;
      }, 32);
      setOutgoingViz(prev => (prev.trackId ? { ...prev, opacity: 0 } : prev));
      wasPlayingRef.current = true;
      return;
    }

    // Already same track and playing: ensure visible.
    setIncomingViz(prev => ({ ...prev, opacity: 1 }));
    setOutgoingViz(prev => (prev.trackId ? { ...prev, opacity: 0 } : prev));
    wasPlayingRef.current = true;
  }, [currentTrack?.id, currentTrack?.bpm, isPlaying]);

  useEffect(() => {
    const style = getComputedStyle(document.documentElement);
    colorsRef.current.primary = `hsl(${style.getPropertyValue("--primary").trim()})`;
    colorsRef.current.muted = `hsl(${style.getPropertyValue("--muted-foreground").trim()})`;
  }, []);

  useEffect(() => {
    setPortalRoot(document.body);
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

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = Math.max(1, rect.width || 176);
    const h = Math.max(1, rect.height || 44);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);

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

  const drawAmbientEqualizerFrame = useCallback((canvas: HTMLCanvasElement | null, elapsedMs: number, seed: number, bpm: number) => {
    if (!canvas)
      return;

    const ctx = canvas.getContext("2d");
    if (!ctx)
      return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = Math.max(1, rect.width);
    const h = Math.max(1, rect.height);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const bars = Math.max(24, Math.floor(w / 7));
    const totalBarW = w / bars;
    const barW = Math.max(1.5, totalBarW * 0.55);
    const maxH = h * 0.85;
    const t = elapsedMs / 1000;
    const primary = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim();

    const beatSec = 60 / Math.max(60, bpm);
    const halfBeatSec = beatSec / 2;

    const sr = (s: number) => {
      const x = Math.sin(s * 127.1 + seed * 311.7) * 43758.5453;
      return x - Math.floor(x);
    };

    for (let i = 0; i < bars; i++) {
      const x = i * totalBarW + (totalBarW - barW) / 2;
      const n = i / bars;

      const heightMul = 0.3 + 0.7 * sr(i + 0.1);
      const phaseOffset = sr(i + 0.5) * beatSec;
      const subdivRespond = sr(i + 0.9);

      const beatPhase = ((t + phaseOffset) % beatSec) / beatSec;
      const beatPulse = Math.pow(1 - beatPhase, 2.8);

      const halfPhase = ((t + phaseOffset * 0.7) % halfBeatSec) / halfBeatSec;
      const halfPulse = Math.pow(1 - halfPhase, 3.2) * 0.4 * subdivRespond;

      const envelope = 0.55 + 0.45 * Math.sin(t * 0.8 + i * 0.12 + seed * 0.01);

      const amplitude = Math.max(0.05, (beatPulse * 0.65 + halfPulse * 0.25 + 0.1) * envelope * heightMul);
      const barH = Math.max(2, amplitude * maxH);
      const y = h - barH;

      const alpha = 0.12 + 0.26 * n + 0.08 * beatPulse;

      ctx.fillStyle = `hsl(${primary} / ${alpha})`;
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

  useEffect(() => {
    const { trackId, bpm } = incomingViz;
    if (!trackId) {
      if (ambientRafRef.current !== null) {
        cancelAnimationFrame(ambientRafRef.current);
        ambientRafRef.current = null;
      }
      const canvas = ambientCanvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    ambientStartTsRef.current = performance.now();
    const render = (ts: number) => {
      drawAmbientEqualizerFrame(ambientCanvasRef.current, ts - ambientStartTsRef.current, trackId, bpm);
      ambientRafRef.current = requestAnimationFrame(render);
    };
    ambientRafRef.current = requestAnimationFrame(render);
    return () => {
      if (ambientRafRef.current !== null) {
        cancelAnimationFrame(ambientRafRef.current);
        ambientRafRef.current = null;
      }
    };
  }, [incomingViz, drawAmbientEqualizerFrame]);

  useEffect(() => {
    const { trackId, bpm } = outgoingViz;
    if (!trackId) {
      const canvas = ambientOutgoingCanvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      if (ambientOutgoingRafRef.current !== null) {
        cancelAnimationFrame(ambientOutgoingRafRef.current);
        ambientOutgoingRafRef.current = null;
      }
      return;
    }

    ambientOutgoingStartTsRef.current = performance.now();
    const render = (ts: number) => {
      drawAmbientEqualizerFrame(ambientOutgoingCanvasRef.current, ts - ambientOutgoingStartTsRef.current, trackId, bpm);
      ambientOutgoingRafRef.current = requestAnimationFrame(render);
    };
    ambientOutgoingRafRef.current = requestAnimationFrame(render);
    return () => {
      if (ambientOutgoingRafRef.current !== null) {
        cancelAnimationFrame(ambientOutgoingRafRef.current);
        ambientOutgoingRafRef.current = null;
      }
    };
  }, [outgoingViz, drawAmbientEqualizerFrame]);

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

  const handleFavourite = useCallback(async () => {
    if (!self || !trackId)
      return;
    await toggleFavourite(
      { favourited: !favourited },
      { optimisticData: { favourited: !favourited } },
    );
  }, [self, trackId, toggleFavourite, favourited]);

  const VolumeIcon
    = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  if (!portalRoot)
    return null;

  return createPortal(
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
        className="pointer-events-none fixed z-[60] overflow-hidden rounded-xl border border-border/70 bg-background/90 shadow-2xl backdrop-blur-xl"
        style={{
          opacity: 0,
          transform: "translate(-50%, -105%)",
          transition: "opacity 150ms",
        }}
      >
        <div className="bg-gradient-to-r from-primary/15 via-primary/5 to-transparent px-2.5 py-1">
          <span
            ref={tooltipTimeRef}
            className="text-center text-[11px] font-semibold tabular-nums text-foreground/90"
          >
            0:00
          </span>
        </div>
        <div className="p-2">
          <canvas
            ref={waveformCanvasRef}
            className="rounded-[6px]"
            style={{ width: 176, height: 44 }}
          />
        </div>
      </div>

      <AnimatePresence>
        {renderTrack && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: isBarVisible ? 0 : "100%", opacity: isBarVisible ? 1 : 0 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{
              y: { duration: 0.3, ease: "easeInOut" },
              opacity: { duration: 0.3, ease: "easeInOut" },
            }}
            className="fixed inset-x-0 bottom-0 z-50 border-t border-border/90 bg-background/85 backdrop-blur-xl"
          >
            <motion.div
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              className="pointer-events-none absolute inset-y-0 left-0 w-[42vw] min-w-[240px] max-w-[520px]"
              style={{
                maskImage: "linear-gradient(to right, black 0%, rgba(0,0,0,0.88) 50%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to right, black 0%, rgba(0,0,0,0.88) 50%, transparent 100%)",
              }}
            >
              {outgoingViz.trackId && (
                <motion.div
                  initial={false}
                  animate={{ opacity: outgoingViz.opacity }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <canvas
                    ref={ambientOutgoingCanvasRef}
                    className="size-full"
                    style={{
                      filter: "blur(0.2px) saturate(1.2)",
                      mixBlendMode: "screen",
                    }}
                  />
                </motion.div>
              )}
              {incomingViz.trackId && (
                <motion.div
                  initial={false}
                  animate={{ opacity: incomingViz.opacity }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <canvas
                    ref={ambientCanvasRef}
                    className="size-full"
                    style={{
                      filter: "blur(0.2px) saturate(1.2)",
                      mixBlendMode: "screen",
                    }}
                  />
                </motion.div>
              )}
            </motion.div>

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

            <div className="hidden grid-cols-[minmax(220px,1fr)_minmax(300px,1.2fr)_minmax(220px,1fr)] items-center gap-4 px-4 py-2 md:grid">
              <div className="relative min-w-0">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={renderTrack.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                    className="flex min-w-0 items-center gap-3"
                  >
                    <div className="relative size-12 overflow-hidden rounded-md bg-muted">
                      {!coverError ? (
                        <img
                          src={`https://assets.ppy.sh/beatmaps/${renderTrack.id}/covers/list.jpg`}
                          alt={renderTrack.title}
                          className="size-full object-cover"
                          onError={() => setCoverError(true)}
                        />
                      ) : (
                        <div className="size-full bg-muted" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/beatmapsets/${renderTrack.id}`}
                        className="block truncate text-sm font-semibold hover:text-primary"
                      >
                        {renderTrack.title}
                      </Link>
                      <p className="truncate text-xs text-muted-foreground">{renderTrack.artist}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-center">
                <button
                  onClick={() => (isPlaying ? pause() : play())}
                  className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground hover:brightness-110"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="size-4 fill-current" />
                  ) : (
                    <Play className="size-4 fill-current pl-0.5" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8 text-muted-foreground hover:text-pink-500"
                  onClick={handleFavourite}
                  disabled={!self || !trackId}
                >
                  <Heart className={cn("size-4", favourited && "fill-pink-500 text-pink-500")} />
                </Button>
                <div className="group/volume flex items-center gap-1.5">
                  <button
                    onClick={toggleMute}
                    className="flex size-7 items-center justify-center rounded text-muted-foreground hover:text-foreground"
                  >
                    <VolumeIcon className="size-4" />
                  </button>
                  <div
                    className="relative h-1 w-24 cursor-pointer rounded-full bg-muted-foreground/20"
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
                <button
                  onClick={stop}
                  className="flex size-7 items-center justify-center rounded text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            <div className="px-3 pb-2 pt-1 md:hidden">
              <div className="flex items-center gap-2">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={renderTrack.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="flex min-w-0 flex-1 items-center gap-2"
                  >
                    <div className="relative size-9 overflow-hidden rounded bg-muted">
                      {!coverError ? (
                        <img
                          src={`https://assets.ppy.sh/beatmaps/${renderTrack.id}/covers/list.jpg`}
                          alt={renderTrack.title}
                          className="size-full object-cover"
                          onError={() => setCoverError(true)}
                        />
                      ) : (
                        <div className="size-full bg-muted" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/beatmapsets/${renderTrack.id}`}
                        className="block truncate text-sm font-semibold hover:text-primary"
                      >
                        {renderTrack.title}
                      </Link>
                      <p className="truncate text-xs text-muted-foreground">{renderTrack.artist}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
                <button
                  onClick={() => (isPlaying ? pause() : play())}
                  className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground"
                >
                  {isPlaying ? (
                    <Pause className="size-4 fill-current" />
                  ) : (
                    <Play className="size-4 fill-current pl-0.5" />
                  )}
                </button>
                <Drawer>
                  <DrawerTrigger asChild>
                    <button className="flex size-8 items-center justify-center rounded text-muted-foreground">
                      <MoreHorizontal className="size-4" />
                    </button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle className="truncate">
                        {renderTrack.title}
                      </DrawerTitle>
                    </DrawerHeader>
                    <div className="space-y-4 px-4 pb-6">
                      <button
                        onClick={handleFavourite}
                        disabled={!self || !trackId}
                        className="flex w-full items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
                      >
                        Favourite
                        <Heart className={cn("size-4", favourited && "fill-pink-500 text-pink-500")} />
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={toggleMute}
                          className="flex size-8 items-center justify-center rounded text-muted-foreground hover:text-foreground"
                        >
                          <VolumeIcon className="size-4" />
                        </button>
                        <div
                          className="relative h-1.5 w-full cursor-pointer rounded-full bg-muted-foreground/20"
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
                      <button
                        onClick={stop}
                        className="flex w-full items-center justify-between rounded-md border border-border px-3 py-2 text-sm text-destructive"
                      >
                        Stop
                        <X className="size-4" />
                      </button>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    portalRoot,
  );
}
