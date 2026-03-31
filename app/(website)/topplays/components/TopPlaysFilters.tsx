"use client";

import {
  GameRuleFlags,
  GameRulesGameModes,
} from "@/lib/hooks/api/types";
import { useT } from "@/lib/i18n/utils";
import type { GameMode } from "@/lib/types/api";
import { cn } from "@/lib/utils";
import {
  gameModeToGamerule,
  gameModeToVanilla,
} from "@/lib/utils/gameMode.util";

interface FilterOptionProps {
  label: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  index?: number;
}

export function FilterOption({ label, active, disabled, onClick, index }: FilterOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "whitespace-nowrap rounded px-1.5 py-0.5 text-[13px] transition-all duration-150",
        active
          ? "bg-secondary font-semibold text-foreground"
          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground/70",
        disabled && "pointer-events-none opacity-30",
      )}
      style={index !== undefined ? {
        animation: `fade-in 150ms ease-out ${index * 30}ms backwards`,
      } : undefined}
    >
      {label}
    </button>
  );
}

interface TopPlaysFiltersProps {
  activeMode: GameMode;
  onModeChange: (mode: GameMode) => void;
  className?: string;
}

export function TopPlaysFilters({
  activeMode,
  onModeChange,
  className,
}: TopPlaysFiltersProps) {
  const t = useT("pages.topplays");

  const vanilla = gameModeToVanilla(activeMode);
  const gamerule = gameModeToGamerule(activeMode);

  const modeEntries = Object.entries(GameRulesGameModes[gamerule] ?? {});
  const ruleEntries = Object.entries(GameRuleFlags[vanilla] ?? {});

  return (
    <div className={className ?? "grid gap-x-3 gap-y-1.5 md:grid-cols-[auto_1fr]"}>
      <span
        className="pt-0.5 text-[13px] font-medium text-muted-foreground"
        style={{ animation: "fade-in 150ms ease-out backwards" }}
      >
        {t("modeLabel")}
      </span>
      <div className="flex flex-wrap gap-0.5">
        {modeEntries.map(([label, mode], i) => (
          <FilterOption
            key={label}
            label={label}
            active={activeMode === mode}
            disabled={mode === null}
            onClick={() => mode != null && onModeChange(mode)}
            index={i}
          />
        ))}
      </div>

      <span
        className="pt-0.5 text-[13px] font-medium text-muted-foreground"
        style={{ animation: `fade-in 150ms ease-out ${modeEntries.length * 30}ms backwards` }}
      >
        {t("ruleLabel")}
      </span>
      <div className="flex flex-wrap gap-0.5">
        {ruleEntries.map(([label, mode], i) => (
          <FilterOption
            key={label}
            label={label}
            active={mode != null
              && gameModeToGamerule(activeMode) === gameModeToGamerule(mode)}
            disabled={mode === null}
            onClick={() => mode != null && onModeChange(mode)}
            index={modeEntries.length + i}
          />
        ))}
      </div>
    </div>
  );
}
