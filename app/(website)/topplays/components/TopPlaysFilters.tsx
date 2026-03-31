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
}

function FilterOption({ label, active, disabled, onClick }: FilterOptionProps) {
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
    >
      {label}
    </button>
  );
}

interface TopPlaysFiltersProps {
  activeMode: GameMode;
  onModeChange: (mode: GameMode) => void;
}

export function TopPlaysFilters({
  activeMode,
  onModeChange,
}: TopPlaysFiltersProps) {
  const t = useT("pages.topplays");

  const vanilla = gameModeToVanilla(activeMode);
  const gamerule = gameModeToGamerule(activeMode);

  const modeEntries = Object.entries(GameRulesGameModes[gamerule] ?? {});
  const ruleEntries = Object.entries(GameRuleFlags[vanilla] ?? {});

  return (
    <div className="grid gap-x-3 gap-y-1.5 md:grid-cols-[auto_1fr]">
      <span className="pt-0.5 text-[13px] font-medium text-muted-foreground">
        {t("filters.mode")}
      </span>
      <div className="flex flex-wrap gap-0.5">
        {modeEntries.map(([label, mode]) => (
          <FilterOption
            key={label}
            label={label}
            active={activeMode === mode}
            disabled={mode === null}
            onClick={() => mode != null && onModeChange(mode)}
          />
        ))}
      </div>

      <span className="pt-0.5 text-[13px] font-medium text-muted-foreground">
        {t("filters.rule")}
      </span>
      <div className="flex flex-wrap gap-0.5">
        {ruleEntries.map(([label, mode]) => (
          <FilterOption
            key={label}
            label={label}
            active={mode != null
              && gameModeToGamerule(activeMode) === gameModeToGamerule(mode)}
            disabled={mode === null}
            onClick={() => mode != null && onModeChange(mode)}
          />
        ))}
      </div>
    </div>
  );
}
