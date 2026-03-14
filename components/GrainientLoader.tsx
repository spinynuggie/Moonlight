"use client";
import dynamic from "next/dynamic";

const GrainientComponent = dynamic(() => import("./Grainient"), {
  ssr: false,
});

export default function GrainientLoader() {
  return (
    <GrainientComponent
      className="pointer-events-none fixed inset-0 -z-20"
      grainAmount={0}
      grainAnimated={false}
      timeSpeed={0.12}
      contrast={1.05}
      saturation={0.85}
      warpSpeed={0.8}
      warpAmplitude={55}
      rotationAmount={200}
      blendSoftness={0.15}
    />
  );
}
