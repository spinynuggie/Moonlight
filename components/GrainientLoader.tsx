"use client";
import dynamic from "next/dynamic";

const GrainientComponent = dynamic(() => import("./Grainient"), {
  ssr: false,
});

export default function GrainientLoader() {
  return <GrainientComponent className="pointer-events-none fixed inset-0 -z-20" />;
}
