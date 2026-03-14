"use client";

import { useEffect, useState } from "react";

export function useIsMobile(maxWidth = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined")
      return;

    const mediaQuery = window.matchMedia(`(max-width: ${maxWidth}px)`);

    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(event.matches);
    };

    // Set initial value
    handleChange(mediaQuery);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    // Fallback for older browsers

    (mediaQuery as any).addListener?.(handleChange);
    return () => {
      (mediaQuery as any).removeListener?.(handleChange);
    };
  }, [maxWidth]);

  return isMobile;
}
