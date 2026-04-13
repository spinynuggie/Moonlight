"use client";

import { useMemo } from "react";

const peaksCache = new Map<number, number[]>();

function mulberry32(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generatePeaks(trackId: number): number[] {
  if (peaksCache.has(trackId))
    return peaksCache.get(trackId)!;

  const rand = mulberry32(trackId);
  const count = 100;
  const raw: number[] = [];

  let prev = 0.4 + rand() * 0.2;
  for (let i = 0; i < count; i++) {
    const target = 0.15 + rand() * 0.85;
    prev += (target - prev) * (0.3 + rand() * 0.4);
    raw.push(Math.max(0.08, Math.min(1, prev)));
  }

  const max = Math.max(...raw);
  const normalized = raw.map(p => p / max);
  peaksCache.set(trackId, normalized);
  return normalized;
}

export function useWaveform(trackId: number | null): number[] {
  return useMemo(() => {
    if (!trackId)
      return [];
    return generatePeaks(trackId);
  }, [trackId]);
}
