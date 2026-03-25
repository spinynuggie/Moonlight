import { Skeleton } from "@/components/ui/skeleton";

export function BeatmapSetOverviewSkeleton() {
  return (
    <div className="relative flex h-24 overflow-hidden rounded-lg bg-muted">
      <div className="relative z-20 size-24 flex-shrink-0">
        <Skeleton className="size-full rounded-none" />
      </div>

      <div className="z-10 flex h-24 w-full flex-col justify-between overflow-hidden">
        <div className="flex size-full flex-col justify-between bg-card/50 px-3 py-1">
          <div>
            <div className="flex items-center">
              <Skeleton className="mr-1 size-4 rounded bg-white/20" />
              <Skeleton className="h-4 w-36 bg-white/20" />
            </div>
            <Skeleton className="mt-1 h-3 w-28 bg-white/20" />
            <Skeleton className="mt-0.5 h-2.5 w-24 bg-white/20" />
          </div>

          <div className="flex h-5 flex-row space-x-0.5">
            <Skeleton className="h-4 w-5 rounded bg-white/20" />
            <Skeleton className="h-4 w-5 rounded bg-white/20" />
            <Skeleton className="h-4 w-5 rounded bg-white/20" />
            <Skeleton className="h-4 w-5 rounded bg-white/20" />
            <Skeleton className="h-4 w-5 rounded bg-white/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
