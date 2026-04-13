"use client";

import { memo, useEffect } from "react";

interface PagePreloaderProps {
  isReady: boolean;
}

export default memo(function PagePreloader({ isReady }: PagePreloaderProps) {
  useEffect(() => {
    if (isReady) {
      // Dismiss the server-rendered preloader in layout.tsx
      document.dispatchEvent(new CustomEvent("preloader-ready"));
    }
  }, [isReady]);

  // Server-rendered preloader in layout.tsx handles the visual
  return null;
});
