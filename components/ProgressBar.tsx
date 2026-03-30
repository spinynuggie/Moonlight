import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  maxValue: number;
  className?: string;
}

export default function ProgressBar({
  value,
  maxValue,
  className,
}: ProgressBarProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="h-2 rounded-sm bg-card">
        <div
          className="h-full rounded-sm bg-primary"
          style={{ width: `${(value / maxValue) * 100}%`, transition: "width 300ms ease-out" }}
        />
      </div>
    </div>
  );
}
