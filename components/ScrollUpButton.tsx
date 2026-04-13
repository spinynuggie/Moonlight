"use client";
import { ArrowUp } from "lucide-react";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { AudioContext } from "@/lib/providers/AudioProvider";
import { cn } from "@/lib/utils";

export default function ScrollUpButton() {
  const audioContext = useContext(AudioContext);
  const isPlayerVisible = !!audioContext?.currentTrack;
  const pathname = usePathname();
  const isFullMode = /^\/(?:beatmapsets|beatmaps)/.test(pathname);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const scrollListener = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", scrollListener, { passive: true });
    return () => window.removeEventListener("scroll", scrollListener);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Button
      size="icon"
      variant="secondary"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={cn(
        "fixed right-6 z-50 size-10 rounded-full shadow-lg",
        "bg-card hover:bg-accent",
        "transition-all duration-300 ease-out hover:scale-110 hover:shadow-xl",
        isPlayerVisible
          ? isFullMode ? "bottom-24" : "bottom-[7.5rem]"
          : "bottom-6",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <ArrowUp className="size-4" />
    </Button>
  );
}
