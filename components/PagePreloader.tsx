"use client";

import { memo, useEffect, useState } from "react";

interface PagePreloaderProps {
  isReady: boolean;
}

const h1Style: React.CSSProperties = {
  background: "linear-gradient(90deg, hsl(210 24% 64%), hsl(0 7% 89%), hsl(210 24% 64%))",
  backgroundSize: "200% 100%",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  filter: "drop-shadow(0 0 20px rgba(141, 163, 185, 0.25)) drop-shadow(0 0 48px rgba(141, 163, 185, 0.08))",
  animation: "preloader-gradient-morph 1s ease-in-out infinite 800ms",
};

const pStyle: React.CSSProperties = {
  filter: "drop-shadow(0 0 12px rgba(141, 163, 185, 0.15))",
  animationDelay: "100ms",
};

const dotContainerStyle: React.CSSProperties = { animationDelay: "200ms" };

const bgStyle: React.CSSProperties = {
  backgroundImage: "radial-gradient(circle, hsl(var(--primary) / 0.04) 1px, transparent 1px)",
  backgroundSize: "32px 32px",
  maskImage: "radial-gradient(circle 500px at center, black 0%, transparent 100%)",
  WebkitMaskImage: "radial-gradient(circle 500px at center, black 0%, transparent 100%)",
};

export default memo(function PagePreloader({ isReady }: PagePreloaderProps) {
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    if (isReady && !isHiding)
      setIsHiding(true);
  }, [isReady, isHiding]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-background will-change-transform ${isHiding ? "preloader-exit" : ""}`}>
      <div className={`pointer-events-none absolute inset-0 ${isHiding ? "preloader-bg-fade" : ""}`} style={bgStyle} />

      <div className={`relative flex flex-col items-center gap-3 rounded-2xl px-20 py-12 backdrop-blur-xl ${isHiding ? "preloader-content-exit" : ""}`}>
        <div className={`relative z-10 ${isHiding ? "" : "preloader-content-entry"}`}>
          <h1 className="pb-2 text-4xl font-bold tracking-tight sm:text-5xl" style={h1Style}>
            himejoshi
          </h1>
        </div>

        <p className={`relative z-10 text-sm font-medium text-muted-foreground ${isHiding ? "" : "preloader-content-entry"}`} style={pStyle}>
          Yet another osu! server
        </p>

        <div className={`relative z-10 flex gap-2 ${isHiding ? "" : "preloader-content-entry"}`} style={dotContainerStyle}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="size-2 rounded-full bg-primary"
              style={{ animation: "preloader-dot-pulse 1s ease-in-out infinite", animationDelay: `${i * 200 + 200}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
