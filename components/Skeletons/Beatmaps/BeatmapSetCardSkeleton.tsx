import { Skeleton } from "@/components/ui/skeleton";

export function BeatmapSetCardSkeleton() {
  return (
    <div className="flex h-[100px] overflow-hidden rounded-xl border border-border/50 shadow-md">
      {/* Play area skeleton */}
      <div className="w-20 flex-shrink-0">
        <Skeleton className="size-full rounded-none" />
      </div>

      {/* Info area skeleton */}
      <div className="flex flex-1 flex-col justify-between bg-card px-3 py-2">
        <div className="space-y-1">
          <Skeleton className="h-4 w-3/5" />
          <Skeleton className="h-3 w-2/5" />
          <Skeleton className="h-2.5 w-1/3" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-14 rounded-full" />
          <div className="flex items-center gap-[2px]">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-[10px] w-[5px] rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
