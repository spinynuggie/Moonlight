"use client";

import { useCallback, useEffect, useRef } from "react";

const BAR_COUNT = 120;
const OVERFLOW = 48;
const BPM = 160;
const SEED = 42;

export default function HeroVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const startTsRef = useRef<number>(0);
  const primaryRef = useRef<string>("");

  const draw = useCallback((canvas: HTMLCanvasElement, elapsedMs: number) => {
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

    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(cx, cy) - OVERFLOW;
    if (radius <= 0)
      return;

    const t = elapsedMs / 1000;
    const primary = primaryRef.current;

    const maxBarH = OVERFLOW * 0.85;
    const barW = Math.max(1.5, ((2 * Math.PI * radius) / BAR_COUNT) * 0.55);

    const beatSec = 60 / BPM;
    const halfBeatSec = beatSec / 2;

    const sr = (s: number) => {
      const x = Math.sin(s * 127.1 + SEED * 311.7) * 43758.5453;
      return x - Math.floor(x);
    };

    for (let i = 0; i < BAR_COUNT; i++) {
      const angle = (i / BAR_COUNT) * Math.PI * 2 - Math.PI / 2;
      const n = i / BAR_COUNT;

      const heightMul = 0.3 + 0.7 * sr(i + 0.1);
      const phaseOffset = sr(i + 0.5) * beatSec;
      const subdivRespond = sr(i + 0.9);

      const beatPhase = ((t + phaseOffset) % beatSec) / beatSec;
      const beatPulse = Math.pow(1 - beatPhase, 2.8);

      const halfPhase = ((t + phaseOffset * 0.7) % halfBeatSec) / halfBeatSec;
      const halfPulse = Math.pow(1 - halfPhase, 3.2) * 0.4 * subdivRespond;

      const envelope = 0.55 + 0.45 * Math.sin(t * 0.8 + i * 0.12 + SEED * 0.01);

      const amplitude = Math.max(0.05, (beatPulse * 0.65 + halfPulse * 0.25 + 0.1) * envelope * heightMul);
      const barH = Math.max(2, amplitude * maxBarH);

      const alpha = 0.12 + 0.26 * n + 0.08 * beatPulse;

      const x1 = cx + Math.cos(angle) * radius;
      const y1 = cy + Math.sin(angle) * radius;
      const x2 = cx + Math.cos(angle) * (radius + barH);
      const y2 = cy + Math.sin(angle) * (radius + barH);

      ctx.strokeStyle = `hsl(${primary} / ${alpha})`;
      ctx.lineWidth = barW;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }, []);

  useEffect(() => {
    primaryRef.current = getComputedStyle(document.documentElement)
      .getPropertyValue("--primary")
      .trim();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches)
      return;

    startTsRef.current = performance.now();
    const render = (ts: number) => {
      if (canvasRef.current) {
        draw(canvasRef.current, ts - startTsRef.current);
      }
      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute size-full"
      style={{
        inset: `-${OVERFLOW}px`,
        width: `calc(100% + ${OVERFLOW * 2}px)`,
        height: `calc(100% + ${OVERFLOW * 2}px)`,
      }}
      aria-hidden
    />
  );
}
