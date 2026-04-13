"use client";

import dynamic from "next/dynamic";

const LineWaves = dynamic(() => import("@/components/LineWaves"), {
  ssr: false,
});

export default function LineWavesLoader() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <LineWaves
        color1="#8DA3B9"
        color2="#8DA3B9"
        color3="#8DA3B9"
        brightness={0.05}
        speed={0.15}
        warpIntensity={1}
        enableMouseInteraction={false}
      />
    </div>
  );
}
