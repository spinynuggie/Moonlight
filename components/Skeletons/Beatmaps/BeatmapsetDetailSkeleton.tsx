import { Skeleton } from "@/components/ui/skeleton";

export function BeatmapsetDetailSkeleton() {
  return (
    <div className="rounded-lg border bg-card shadow">
      {/* Banner area */}
      <div className="relative z-20 flex h-full min-h-48 md:min-h-64 lg:min-h-80">
        <div className="flex flex-grow rounded-t-lg p-3 md:p-4 lg:px-6">
          <div className="flex flex-grow flex-col justify-between space-y-4 lg:mb-4 lg:flex-row lg:space-y-0">
            {/* Left side */}
            <div className="flex flex-col justify-between space-y-3 lg:space-y-0">
              {/* Difficulty selector dots */}
              <div className="flex items-center space-x-1 rounded-xl bg-secondary p-1.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Skeleton key={i} className="size-6 rounded-full bg-white/20" />
                ))}
              </div>

              {/* Title + artist */}
              <div>
                <Skeleton className="mb-2 h-8 w-64 bg-white/20" />
                <Skeleton className="h-5 w-40 bg-white/20" />
              </div>

              {/* Creator info */}
              <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                  <Skeleton className="size-12 rounded-lg bg-white/20" />
                  <div className="ml-2 space-y-1">
                    <Skeleton className="h-3 w-32 bg-white/20" />
                    <Skeleton className="h-3 w-28 bg-white/20" />
                    <Skeleton className="h-3 w-24 bg-white/20" />
                  </div>
                </div>
                {/* Action buttons */}
                <div className="flex flex-row flex-wrap items-center gap-2">
                  <Skeleton className="h-9 w-20 rounded-md bg-white/20" />
                  <Skeleton className="h-9 w-24 rounded-md bg-white/20" />
                  <Skeleton className="size-9 rounded-md bg-white/20" />
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex w-full flex-col justify-between space-y-4 lg:w-auto lg:min-w-64 lg:space-y-0">
              {/* Status badge — centered pill */}
              <div className="flex justify-center">
                <Skeleton className="h-7 w-20 rounded-full bg-white/20" />
              </div>
              {/* Difficulty info panel */}
              <div className="space-y-2 rounded-xl bg-secondary p-3">
                <Skeleton className="h-9 w-full rounded-md bg-white/10" />
                <div className="space-y-1.5 pt-1">
                  <Skeleton className="h-3 w-full bg-white/10" />
                  <Skeleton className="h-3 w-full bg-white/10" />
                </div>
                <Skeleton className="h-px w-full bg-white/10" />
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-3 w-8 bg-white/10" />
                    <Skeleton className="h-2 flex-1 rounded-sm bg-white/10" />
                    <Skeleton className="h-3 w-6 bg-white/10" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-t-lg">
          <Skeleton className="size-full rounded-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        </div>
      </div>

      {/* Description + info below */}
      <div className="bg-card p-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <div className="flex flex-col lg:col-span-3 lg:h-80">
            <div className="rounded-t-lg bg-card p-4">
              <Skeleton className="h-5 w-28" />
            </div>
            <div className="rounded-b-lg border bg-accent p-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-3 w-4/6" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:col-span-2 lg:h-80">
            <div className="space-y-3">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
