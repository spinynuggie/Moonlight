"use client";
import dynamic from "next/dynamic";

const GrainientComponent = dynamic(() => import("./Grainient"), {
  ssr: false,
});

export default function GrainientLoader() {
  return (
    <GrainientComponent
      className="pointer-events-none absolute inset-0 -z-20 h-full md:fixed md:inset-0 md:h-auto"
      timeSpeed={0.2}
      colorBalance={0}
      warpStrength={1}
      warpFrequency={3}
      warpSpeed={1.5}
      warpAmplitude={40}
      blendAngle={0}
      blendSoftness={0.05}
      rotationAmount={300}
      noiseScale={2}
      grainAmount={0}
      grainScale={2}
      grainAnimated={true}
      contrast={1.2}
      gamma={1}
      saturation={1}
      centerX={0}
      centerY={0}
      zoom={0.9}
      color1="#252525"
      color2="#252525"
      color3="#8DA3B9"
    />
  );
}
