"use client";

import { FilterOption } from "@/components/FilterOption";
import { useT } from "@/lib/i18n/utils";
import { BeatmapStatusWeb, GameMode } from "@/lib/types/api";

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
        style={{ animation: "fade-in 300ms ease-out 200ms backwards" }}
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
        style={{ animation: `fade-in 300ms ease-out ${200 + modeOptions.length * 50}ms backwards` }}
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
