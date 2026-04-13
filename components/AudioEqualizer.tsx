import { cn } from "@/lib/utils";

export function AudioEqualizer({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-end gap-[2px]", className)}>
      {[0, 150, 300, 100].map(delay => (
        <span
          key={delay}
          className="equalizer-bar w-[3px] rounded-full bg-current"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
}
