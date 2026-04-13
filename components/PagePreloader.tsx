"use client";

import { memo, useEffect } from "react";

interface PagePreloaderProps {
  isReady: boolean;
}

export default memo(function PagePreloader({ isReady }: PagePreloaderProps) {
  useEffect(() => {
    if (isReady) {
      document.dispatchEvent(new CustomEvent("preloader-ready"));
    }
  }, [isReady]);

  return null;
});
