"use client";

import { cn } from "@/lib/utils";

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
        animation: `fade-in 300ms ease-out ${200 + index * 50}ms backwards`,
      } : undefined}
    >
      {label}
    </button>
  );
}
