"use client";

import type * as React from "react";

import { cn } from "@/lib/utils";

interface FilterOptionProps {
  label: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  index?: number;
  icon?: React.ReactNode;
}

export function FilterOption({ label, active, disabled, onClick, index, icon }: FilterOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center gap-1 whitespace-nowrap rounded px-2 py-1 text-[13px] transition-all duration-150",
        active
          ? "bg-secondary font-semibold text-primary"
          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground/70",
        disabled && "pointer-events-none opacity-30",
      )}
      style={index !== undefined ? {
        animation: `fade-in 300ms ease-out ${200 + index * 50}ms backwards`,
      } : undefined}
    >
      {label}
      {icon}
    </button>
  );
}
