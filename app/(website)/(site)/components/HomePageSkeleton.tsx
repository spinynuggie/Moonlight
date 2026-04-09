import { Skeleton } from "@/components/ui/skeleton";

export default function HomePageSkeleton() {
  return (
    <div className="w-full space-y-4">
      {/* Hero */}
      <div className="overflow-hidden rounded-xl border border-border/50 bg-card shadow-md">
        <div className="p-6">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="mt-2 h-4 w-80" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
        {/* Main column */}
        <div className="space-y-5 lg:col-span-2">
          {/* News card */}
          <div className="overflow-hidden rounded-xl border border-border/50 bg-card shadow-md">
            <div className="flex items-center gap-2 px-4 py-3">
              <Skeleton className="size-4 rounded" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Featured card skeleton */}
                <div className="overflow-hidden rounded-xl border border-border/40 md:col-span-2">
                  <Skeleton className="h-48 w-full rounded-none" />
                  <div className="space-y-2 p-4 pt-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                {/* Regular card skeletons */}
                {["a", "b", "c"].map(key => (
                  <div key={key} className="overflow-hidden rounded-xl border border-border/40">
                    <Skeleton className="h-36 w-full rounded-none" />
                    <div className="space-y-2 p-4 pt-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Connect + Support row */}
          <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
            <Skeleton className="h-[140px] rounded-xl" />
            <Skeleton className="h-[140px] rounded-xl" />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 lg:col-span-1">
          {/* Server status */}
          <div className="overflow-hidden rounded-xl border border-border/50 bg-card shadow-md">
            <div className="flex items-center gap-2 px-4 py-3">
              <Skeleton className="size-4 rounded" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-0.5 p-4 pt-3">
              {["a", "b", "c"].map(key => (
                <div key={key} className="flex items-center gap-2.5 py-2.5">
                  <Skeleton className="size-3.5 rounded" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="ml-auto h-5 w-12" />
                </div>
              ))}
            </div>
          </div>

          {/* Beatmaps */}
          <div className="overflow-hidden rounded-xl border border-border/50 bg-card shadow-md">
            <div className="flex items-center gap-2 px-4 py-3">
              <Skeleton className="size-4 rounded" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="space-y-2 p-4 pt-3">
              {["a", "b", "c", "d", "e", "f"].map(key => (
                <Skeleton key={key} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
