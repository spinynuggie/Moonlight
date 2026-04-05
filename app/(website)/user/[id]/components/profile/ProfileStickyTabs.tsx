"use client";

import type { RefObject } from "react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import type { ProfileSectionId } from "@/lib/hooks/api/user/useUserProfile";
import { cn } from "@/lib/utils";

interface ProfileStickyTabsProps {
  sections: Array<{ id: ProfileSectionId; label: string }>;
  activeSection: ProfileSectionId;
  topOffset: number;
  containerRef: RefObject<HTMLDivElement | null>;
  onSelect: (sectionId: ProfileSectionId) => void;
  isSticky: boolean;
}

export function ProfileStickyTabs({
  sections,
  activeSection,
  topOffset,
  containerRef,
  onSelect,
  isSticky,
}: ProfileStickyTabsProps) {
  const tabRefs = useRef<Map<ProfileSectionId, HTMLButtonElement>>(new Map());
  const navRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState({
    highlight: { left: 0, width: 0 },
    ready: false,
  });

  const [showEntranceAnim, setShowEntranceAnim] = useState(false);
  const prevStickyRef = useRef(false);

  useEffect(() => {
    if (isSticky && !prevStickyRef.current) {
      setShowEntranceAnim(true);
      const timer = setTimeout(() => setShowEntranceAnim(false), 250);
      prevStickyRef.current = true;
      return () => clearTimeout(timer);
    }
    prevStickyRef.current = isSticky;
  }, [isSticky]);

  const updatePositions = useCallback(() => {
    const nav = navRef.current;
    const tab = tabRefs.current.get(activeSection);
    if (!nav || !tab)
      return;

    setPositions({
      highlight: { left: tab.offsetLeft, width: tab.offsetWidth },
      ready: true,
    });
  }, [activeSection]);

  useLayoutEffect(() => {
    updatePositions();
  }, [updatePositions]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav)
      return;

    const observer = new ResizeObserver(() => updatePositions());
    observer.observe(nav);
    return () => observer.disconnect();
  }, [updatePositions]);

  return (
    <div
      ref={containerRef}
      data-profile-sticky-tabs="true"
      className={cn(
        "sticky z-40 mt-3 overflow-hidden rounded-[14px] border backdrop-blur",
        "transition-[box-shadow,border-color,background-color] duration-300",
        isSticky
          ? "border-border/70 bg-card/95 shadow-xl"
          : "border-border/50 bg-card/90 shadow-lg",
        showEntranceAnim && "sticky-tabs-enter",
      )}
      style={{ top: topOffset }}
    >
      <div ref={navRef} className="relative flex overflow-x-auto p-2">
        <span
          className={cn(
            "pointer-events-none absolute inset-y-2 rounded-lg bg-primary/[0.08] transition-[left,width] duration-300 ease-in-out",
            !positions.ready && "opacity-0",
          )}
          style={{
            left: positions.highlight.left,
            width: positions.highlight.width,
          }}
        />
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              ref={(el) => {
                if (el)
                  tabRefs.current.set(section.id, el);
                else tabRefs.current.delete(section.id);
              }}
              type="button"
              onClick={() => onSelect(section.id)}
              className={cn(
                "relative flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-300",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="whitespace-nowrap">{section.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
