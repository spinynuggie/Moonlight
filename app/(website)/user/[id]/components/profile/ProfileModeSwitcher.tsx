"use client";

import { Star } from "lucide-react";

import { GameModeIcon } from "@/components/DifficultyIcon";
import { Button } from "@/components/ui/button";
import type { GameMode } from "@/lib/types/api";
import { GameMode as GameModeEnum } from "@/lib/types/api";
import { cn } from "@/lib/utils";

const PROFILE_MODES = [
  {
    mode: GameModeEnum.STANDARD,
    label: "osu!",
  },
  {
    mode: GameModeEnum.TAIKO,
    label: "taiko",
  },
  {
    mode: GameModeEnum.CATCH_THE_BEAT,
    label: "fruits",
  },
  {
    mode: GameModeEnum.MANIA,
    label: "mania",
  },
] as const;

interface ProfileModeSwitcherProps {
  activeMode: GameMode;
  defaultMode: GameMode;
  onSelect: (mode: GameMode) => void;
  className?: string;
}

export function ProfileModeSwitcher({
  activeMode,
  defaultMode,
  onSelect,
  className,
}: ProfileModeSwitcherProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1", className)}>
      {PROFILE_MODES.map(({ mode, label }) => {
        const isActive = activeMode === mode;
        const isDefault = defaultMode === mode;

        return (
          <Button
            key={mode}
            size="sm"
            variant={isActive ? "default" : "secondary"}
            className={cn(
              "relative h-9 min-w-[74px] gap-2 rounded-full px-3 text-xs font-semibold uppercase tracking-[0.18em]",
              isActive && "text-black",
            )}
            onClick={() => onSelect(mode)}
          >
            <GameModeIcon mode={mode} className="text-sm" />
            <span>{label}</span>
            {isDefault && (
              <Star className="absolute -right-1 -top-1 size-3 fill-yellow-400 text-yellow-400" />
            )}
          </Button>
        );
      })}
    </div>
  );
}
