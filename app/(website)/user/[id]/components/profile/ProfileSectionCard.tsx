"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { ProfileSectionId } from "@/lib/hooks/api/user/useUserProfile";
import { cn } from "@/lib/utils";

interface ProfileSectionCardProps {
  sectionId: ProfileSectionId;
  title: string;
  titleSuffix?: React.ReactNode;
  headerActions?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
  placeholder?: React.ReactNode;
  lazy?: boolean;
  loaded?: boolean;
  onVisible?: (sectionId: ProfileSectionId) => void;
  sectionRef?: (node: HTMLElement | null) => void;
}

export function ProfileSectionCard({
  sectionId,
  title,
  titleSuffix,
  headerActions,
  className,
  bodyClassName,
  children,
  placeholder,
  lazy = false,
  loaded = true,
  onVisible,
  sectionRef,
}: ProfileSectionCardProps) {
  const internalRef = useRef<HTMLElement | null>(null);
  const [phase, setPhase] = useState<"placeholder" | "crossfading" | "loaded">(
    !lazy || loaded ? "loaded" : "placeholder",
  );

  const handleRef = useCallback((node: HTMLElement | null) => {
    internalRef.current = node;
    sectionRef?.(node);
  }, [sectionRef]);

  useEffect(() => {
    const node = internalRef.current;
    if (!node || !lazy || loaded)
      return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onVisible?.(sectionId);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [lazy, loaded, onVisible, sectionId]);

  useEffect(() => {
    if (loaded && phase === "placeholder") {
      setPhase("crossfading");
      const timer = setTimeout(() => setPhase("loaded"), 300);
      return () => clearTimeout(timer);
    }
  }, [loaded, phase]);

  return (
    <section
      id={sectionId}
      ref={handleRef}
      className={cn(
        "overflow-hidden rounded-[16px] border border-border/50 bg-card shadow-md",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border/40 px-5 py-4">
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            {titleSuffix}
          </div>
          <span className="mt-1 h-[2px] w-10 rounded-full bg-primary" />
        </div>
        <div className="flex items-center gap-2">{headerActions}</div>
      </div>
      <div className={cn("relative overflow-hidden p-5", bodyClassName)}>
        {(phase === "crossfading" || phase === "loaded") && (
          <div className={cn(phase === "crossfading" && "profile-crossfade-in")}>
            {children}
          </div>
        )}
        {(phase === "placeholder" || phase === "crossfading") && (
          <div
            className={cn(
              phase === "crossfading"
              && "profile-crossfade-out pointer-events-none absolute inset-0 p-5",
            )}
          >
            {placeholder}
          </div>
        )}
      </div>
    </section>
  );
}
