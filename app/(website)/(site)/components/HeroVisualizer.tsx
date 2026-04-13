"use client";

import { useCallback, useEffect, useRef } from "react";

const BAR_COUNT = 120;
const OVERFLOW = 200;
const BPM = 160;
const SEED = 42;

export default function HeroVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const dimensionsRef = useRef({ w: 0, h: 0, dpr: 1 });
  const rafRef = useRef<number | null>(null);
  const startTsRef = useRef<number>(0);
  const primaryRef = useRef<string>("");

  // Pre-calculate constant bar data to avoid repeating math in the loop
  const barDataRef = useRef<Array<{ angle: number; heightMul: number; phaseOffset: number }>>([]);

  useEffect(() => {
    const sr = (s: number) => {
      const x = Math.sin(s * 127.1 + SEED * 311.7) * 43758.5453;
      return x - Math.floor(x);
    };

    const data = [];
    for (let i = 0; i < BAR_COUNT; i++) {
      const freqBand = (i % (BAR_COUNT / 4)) / (BAR_COUNT / 4);
      const bassBoost = 1 - freqBand * 0.5;
      data.push({
        angle: (i / BAR_COUNT) * Math.PI * 2 - Math.PI / 2,
        heightMul: (0.4 + 0.6 * sr(i + 0.1)) * bassBoost,
        phaseOffset: sr(i + 0.5) * (60 / BPM) * 0.3,
      });
    }
    barDataRef.current = data;
  }, []);

  const draw = useCallback((elapsedMs: number) => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx)
      return;

    const { w, h, dpr } = dimensionsRef.current;
    if (w <= 0 || h <= 0)
      return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(cx, cy) - OVERFLOW;
    if (radius <= 0)
      return;

    const t = elapsedMs / 1000;
    const primary = primaryRef.current;
    const barData = barDataRef.current;

    const maxBarH = OVERFLOW * 0.85;
    const barW = Math.max(1.2, ((2 * Math.PI * radius) / BAR_COUNT) * 0.45);
    const beatSec = 60 / BPM;

    ctx.lineWidth = barW;
    ctx.lineCap = "round";

    for (let i = 0; i < BAR_COUNT; i++) {
      const { angle, heightMul, phaseOffset } = barData[i];

      const beatPhase = ((t + phaseOffset) % beatSec) / beatSec;
      const beatPulse = Math.pow(1 - beatPhase, 2.2);

      const wave1 = 0.5 + 0.5 * Math.sin(t * 1.2 + i * 0.08);
      const wave2 = 0.5 + 0.5 * Math.sin(t * 0.7 + i * 0.15 + 2);
      const envelope = 0.4 + 0.35 * wave1 + 0.25 * wave2;

      const idle = 0.08;
      const amplitude = Math.max(idle, (beatPulse * 0.75 + 0.25) * envelope * heightMul);
      const barH = Math.max(3, amplitude * maxBarH);

      const alpha = 0.15 + 0.35 * amplitude + 0.1 * beatPulse;

      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const x1 = cx + cosA * radius;
      const y1 = cy + sinA * radius;
      const x2 = cx + cosA * (radius + barH);
      const y2 = cy + sinA * (radius + barH);

      ctx.strokeStyle = `hsl(${primary} / ${alpha})`;
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
    const canvas = canvasRef.current;
    if (!canvas)
      return;

    const updateDimensions = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);

      dimensionsRef.current = { w, h, dpr };
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      contextRef.current = canvas.getContext("2d");
    };

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });

    resizeObserver.observe(canvas);
    updateDimensions();

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches)
      return;

    const canvas = canvasRef.current;
    if (!canvas)
      return;

    startTsRef.current = performance.now();
    let lastDrawTime = 0;
    const FRAME_INTERVAL = 1000 / 30; // Throttle to 30fps
    let isVisible = true;

    const render = (ts: number) => {
      if (!isVisible) {
        rafRef.current = null;
        return;
      }
      if (ts - lastDrawTime >= FRAME_INTERVAL) {
        draw(ts - startTsRef.current);
        lastDrawTime = ts;
      }
      rafRef.current = requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && rafRef.current === null) {
          rafRef.current = requestAnimationFrame(render);
        }
      },
      { threshold: 0 },
    );
    observer.observe(canvas);

    rafRef.current = requestAnimationFrame(render);

    return () => {
      observer.disconnect();
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
