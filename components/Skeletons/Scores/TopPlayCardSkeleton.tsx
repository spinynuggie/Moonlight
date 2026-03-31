import { Skeleton } from "@/components/ui/skeleton";

export function TopPlayCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[10px] border border-border/50 shadow-md">
      <div className="relative flex h-[120px]">
        {/* Thumbnail skeleton */}
        <div className="w-[90px] flex-shrink-0 md:w-[100px]">
          <Skeleton className="size-full rounded-none" />
        </div>

        {/* Info area skeleton */}
        <div className="flex flex-1 flex-col justify-between bg-card px-2.5 py-1.5">
          {/* Top section */}
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1 space-y-1.5">
              <Skeleton className="h-4 w-3/5" />
              <Skeleton className="h-3.5 w-2/5" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <div className="flex flex-col items-end gap-1">
              <Skeleton className="h-5 w-14" />
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-4 w-6" />
            </div>
          </div>

          {/* Bottom section */}
          <div className="flex items-center gap-1.5">
            <Skeleton className="size-[22px] rounded-full" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="ml-auto h-3 w-10" />
          </div>
        </div>
      </div>
    </div>
  );
}
