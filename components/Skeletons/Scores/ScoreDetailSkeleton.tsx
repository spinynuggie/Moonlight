import { Skeleton } from "@/components/ui/skeleton";

export function ScoreDetailSkeleton() {
  return (
    <div className="space-y-3">
      {/* Hero card */}
      <div className="overflow-hidden rounded-[10px] border border-border/50 shadow-md">
        {/* Beatmap info bar */}
        <div className="bg-card/90 px-4 py-3 md:px-8">
          <Skeleton className="h-7 w-72" />
          <div className="mt-2 flex items-center gap-2.5">
            <Skeleton className="size-4 rounded" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-14 rounded-full" />
          </div>
        </div>

        {/* Hero section */}
        <div
          className="relative min-h-[240px]"
          style={{ backgroundColor: "hsl(var(--secondary))" }}
        >
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "hsl(var(--card) / 0.78)" }}
          />
          <div className="relative flex flex-col items-center gap-5 px-4 py-6 md:flex-row md:items-center md:gap-8 md:p-8">
            {/* Tower placeholder */}
            <div className="flex flex-row-reverse gap-1 md:flex-col md:gap-1.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="size-9 rounded md:size-10"
                />
              ))}
            </div>

            {/* Dial placeholder */}
            <Skeleton className="size-[200px] flex-shrink-0 rounded-full" />

            {/* Player info placeholder */}
            <div className="flex flex-1 flex-col items-center gap-3 md:items-start">
              <div className="flex gap-1">
                <Skeleton className="h-7 w-10 rounded-md" />
                <Skeleton className="h-7 w-10 rounded-md" />
              </div>
              <Skeleton className="h-14 w-64 md:h-16 md:w-80" />
              <Skeleton className="h-7 w-48 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats section */}
      <div className="overflow-hidden rounded-[10px] border border-border/50 bg-card shadow-md">
        <div className="flex flex-col gap-5 p-4 md:flex-row md:gap-8 md:p-5">
          {/* User info placeholder */}
          <div className="flex items-center gap-3 md:w-[280px]">
            <Skeleton className="size-10 flex-shrink-0 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>

          {/* Stats grid placeholder */}
          <div className="flex-1 space-y-1.5">
            <div className="grid grid-cols-3 gap-[2px]">
              {["Accuracy", "Combo", "PP"].map(label => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1 py-2"
                >
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-12" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-[2px]">
              {["Great", "Ok", "Meh", "Miss"].map(label => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1 py-2"
                >
                  <Skeleton className="h-5 w-12 rounded-full" />
                  <Skeleton className="h-5 w-8" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
