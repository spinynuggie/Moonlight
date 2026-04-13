import { Skeleton } from "@/components/ui/skeleton";

export function BeatmapPlayedOverviewSkeleton() {
  return (
    <div className="flex min-h-[88px] overflow-hidden rounded-[12px] border border-border/40 bg-secondary/40">
      <div className="flex w-full items-center gap-3 p-3">
        <Skeleton className="size-11 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1 space-y-1.5">
          <Skeleton className="h-4 w-44 rounded-md" />
          <Skeleton className="h-3.5 w-32 rounded-md" />
        </div>
        <Skeleton className="h-7 w-14 shrink-0 rounded-md" />
      </div>
    </div>
  );
}
