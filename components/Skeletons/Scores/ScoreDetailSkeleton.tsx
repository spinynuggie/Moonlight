import { Skeleton } from "@/components/ui/skeleton";

export function ScoreDetailSkeleton() {
  return (
    <div className="space-y-3">
      {/* Hero card */}
      <div className="overflow-hidden rounded-[10px] border border-border/50 shadow-md">
        <div className="relative">
          {/* Info area */}
          <div className="relative flex min-w-0 flex-1 flex-col">
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(90deg, hsl(var(--card)) 0%, hsl(var(--card) / 0.85) 100%)",
              }}
            />

            <div className="relative flex min-w-0 flex-col p-4 md:p-5">
              {/* Top section */}
              <div className="flex flex-col gap-5 md:flex-row md:gap-6">
                {/* Left: beatmap info */}
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-6 w-64" />
                  <Skeleton className="h-5 w-40" />
                  <div className="flex items-center gap-1 pt-1">
                    <Skeleton className="size-4 rounded" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-3.5 w-36" />
                  <Skeleton className="h-4 w-16 rounded-full" />
                </div>

                {/* Right: score overview */}
                <div className="flex items-start gap-4 md:flex-col md:items-end">
                  <Skeleton className="h-16 w-20 rounded-lg md:h-20 md:w-24" />
                  <div className="flex flex-col gap-1.5 md:items-end">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-4 w-32" />
                    <div className="mt-1 flex gap-1">
                      <Skeleton className="h-7 w-10 rounded-md" />
                      <Skeleton className="h-7 w-10 rounded-md" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom: user + actions */}
              <div className="mt-5 flex items-center gap-3 border-t border-border/30 pt-4">
                <Skeleton className="size-8 flex-shrink-0 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-36" />
                </div>
                <div className="ml-auto flex gap-2">
                  <Skeleton className="h-8 w-36 rounded-md" />
                  <Skeleton className="size-8 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Score stats */}
      <div className="flex flex-col space-y-2">
        <div className="grid grid-cols-3 gap-1.5">
          {["Accuracy", "Combo", "PP"].map(label => (
            <div key={label} className="rounded-[10px] border border-border/50 bg-secondary/50 p-3 text-center shadow-sm">
              <Skeleton className="mx-auto mb-2 h-3 w-14" />
              <Skeleton className="mx-auto h-5 w-12" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {["Great", "Ok", "Meh", "Miss"].map(label => (
            <div key={label} className="rounded-[10px] border border-border/50 bg-secondary/50 p-3 text-center shadow-sm">
              <Skeleton className="mx-auto mb-2 h-3 w-10" />
              <Skeleton className="mx-auto h-4 w-8" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
