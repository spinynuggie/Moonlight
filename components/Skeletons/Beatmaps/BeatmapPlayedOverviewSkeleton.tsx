import { Skeleton } from "@/components/ui/skeleton";

export function BeatmapPlayedOverviewSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg bg-card text-white shadow">
      <div className="relative h-20">
        <Skeleton className="size-full rounded-none" />

        <div className="absolute inset-0 flex items-center bg-black/60">
          <div className="flex w-full place-content-between items-center p-6">
            <div className="flex-row flex-wrap overflow-hidden">
              <div className="flex items-center space-x-1">
                <Skeleton className="size-5 rounded bg-white/20" />
                <Skeleton className="h-5 w-48 bg-white/20" />
              </div>
              <div className="mt-1 flex items-end space-x-3">
                <Skeleton className="h-4 w-24 bg-white/20" />
              </div>
            </div>

            <div className="flex min-w-12 items-center space-x-2">
              <Skeleton className="size-6 rounded bg-white/20" />
              <Skeleton className="h-7 w-10 bg-white/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
