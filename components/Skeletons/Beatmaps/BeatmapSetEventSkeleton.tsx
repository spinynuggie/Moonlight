import { Skeleton } from "@/components/ui/skeleton";

export function BeatmapSetEventSkeleton() {
  return (
    <div className="flex rounded-lg bg-accent p-2">
      <div className="flex w-full flex-wrap place-content-between items-center gap-5 text-sm font-normal">
        <div className="flex w-3/4 gap-5">
          <Skeleton className="h-4 w-14" />
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="size-5 rounded-full" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="size-4" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}
