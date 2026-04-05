"use client";

import type { RefObject } from "react";

import type { ProfileSectionId } from "@/lib/hooks/api/user/useUserProfile";
import { cn } from "@/lib/utils";

interface ProfileStickyTabsProps {
  sections: Array<{ id: ProfileSectionId; label: string }>;
  activeSection: ProfileSectionId;
  topOffset: number;
  containerRef: RefObject<HTMLDivElement | null>;
  onSelect: (sectionId: ProfileSectionId) => void;
}

export function ProfileStickyTabs({
  sections,
  activeSection,
  topOffset,
  containerRef,
  onSelect,
}: ProfileStickyTabsProps) {
  return (
    <div
      ref={containerRef}
      data-profile-sticky-tabs="true"
      className="sticky z-40 mt-3 overflow-hidden rounded-[14px] border border-border/50 bg-card/90 shadow-lg backdrop-blur"
      style={{ top: topOffset }}
    >
      <div className="flex overflow-x-auto p-2">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSelect(section.id)}
              className={cn(
                "relative flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="whitespace-nowrap">{section.label}</span>
              {isActive && (
                <span className="absolute inset-x-3 bottom-0 h-[2px] rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
