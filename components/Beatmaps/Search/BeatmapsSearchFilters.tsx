"use client";

import { useT } from "@/lib/i18n/utils";
import { BeatmapStatusWeb, GameMode } from "@/lib/types/api";
import { cn } from "@/lib/utils";

interface FilterOptionProps {
  label: string;
  active: boolean;
  onClick: () => void;
  index?: number;
}

function FilterOption({ label, active, onClick, index }: FilterOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "whitespace-nowrap rounded px-1.5 py-0.5 text-[13px] transition-all duration-150",
        active
          ? "bg-secondary font-semibold text-foreground"
          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground/70",
      )}
      style={index !== undefined ? {
        animation: `fade-in 150ms ease-out ${index * 30}ms backwards`,
      } : undefined}
    >
      {label}
    </button>
  );
}

const modeOptions: Array<{ key: string; value: GameMode }> = [
  { key: "standard", value: GameMode.STANDARD },
  { key: "taiko", value: GameMode.TAIKO },
  { key: "catch", value: GameMode.CATCH_THE_BEAT },
  { key: "mania", value: GameMode.MANIA },
];

const statusOptions: Array<{ key: string; value: BeatmapStatusWeb }> = [
  { key: "ranked", value: BeatmapStatusWeb.RANKED },
  { key: "approved", value: BeatmapStatusWeb.APPROVED },
  { key: "qualified", value: BeatmapStatusWeb.QUALIFIED },
  { key: "loved", value: BeatmapStatusWeb.LOVED },
  { key: "pending", value: BeatmapStatusWeb.PENDING },
  { key: "wip", value: BeatmapStatusWeb.WIP },
  { key: "graveyard", value: BeatmapStatusWeb.GRAVEYARD },
];

interface BeatmapsSearchFiltersProps {
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
  status: BeatmapStatusWeb[] | null;
  onStatusChange: (status: BeatmapStatusWeb[] | null) => void;
}

export function BeatmapsSearchFilters({
  mode,
  onModeChange,
  status,
  onStatusChange,
}: BeatmapsSearchFiltersProps) {
  const t = useT("pages.beatmaps.components.filters");

  const isAnyStatus = status === null || status.length === 0;

  const handleStatusToggle = (value: BeatmapStatusWeb) => {
    if (isAnyStatus) {
      onStatusChange([value]);
      return;
    }

    const newStatus = status!.includes(value)
      ? status!.filter(s => s !== value)
      : [...status!, value];

    onStatusChange(newStatus.length === 0 ? null : newStatus);
  };

  return (
    <div className="grid gap-x-3 gap-y-1.5 md:grid-cols-[auto_1fr]">
      <span
        className="pt-0.5 text-[13px] font-medium text-muted-foreground"
        style={{ animation: "fade-in 150ms ease-out backwards" }}
      >
        {t("mode.label")}
      </span>
      <div className="flex flex-wrap gap-0.5">
        {modeOptions.map((opt, i) => (
          <FilterOption
            key={opt.key}
            label={t(`mode.${opt.key}`)}
            active={mode === opt.value}
            onClick={() => onModeChange(opt.value)}
            index={i}
          />
        ))}
      </div>

      <span
        className="pt-0.5 text-[13px] font-medium text-muted-foreground"
        style={{ animation: `fade-in 150ms ease-out ${modeOptions.length * 30}ms backwards` }}
      >
        {t("status.label")}
      </span>
      <div className="flex flex-wrap gap-0.5">
        <FilterOption
          label={t("status.any")}
          active={isAnyStatus}
          onClick={() => onStatusChange(null)}
          index={modeOptions.length}
        />
        {statusOptions.map((opt, i) => (
          <FilterOption
            key={opt.key}
            label={t(`status.${opt.key}`)}
            active={!isAnyStatus && (status?.includes(opt.value) ?? false)}
            onClick={() => handleStatusToggle(opt.value)}
            index={modeOptions.length + 1 + i}
          />
        ))}
      </div>
    </div>
  );
}
