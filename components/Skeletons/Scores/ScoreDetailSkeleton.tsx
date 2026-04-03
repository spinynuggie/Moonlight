import { Skeleton } from "@/components/ui/skeleton";

export function ScoreDetailSkeleton() {
  return (
    <div className="space-y-3">
      <div className="md:h-68 relative z-20">
        <div className="flex h-full flex-col place-content-between rounded-lg bg-card/65 p-5 md:flex-row">
          {/* Left side */}
          <div className="flex size-full flex-col overflow-hidden">
            <div className="flex items-center space-x-1">
              <Skeleton className="size-5 rounded bg-white/20" />
              <Skeleton className="h-6 w-64 bg-white/20" />
            </div>
            <Skeleton className="mt-2 h-5 w-40 bg-white/20" />

            <Skeleton className="m-auto mt-6 h-20 w-16 rounded bg-white/20 md:m-0 md:mt-6" />

            <div className="mt-auto flex space-x-1">
              <Skeleton className="h-7 w-10 rounded-md bg-white/20" />
              <Skeleton className="h-7 w-10 rounded-md bg-white/20" />
            </div>
          </div>

          <div className="my-4 h-px w-full bg-border/30 md:hidden" />

          {/* Right side */}
          <div className="w-full flex-col place-content-between items-center space-y-4 md:flex md:w-1/2">
            <div className="flex w-full flex-col">
              <div className="flex items-center justify-end gap-0.5">
                <Skeleton className="mr-1 size-4 rounded bg-white/20" />
                <Skeleton className="h-4 w-12 bg-white/20" />
                <Skeleton className="ml-1 h-4 w-32 bg-white/20" />
              </div>
              <div className="mt-1 flex justify-end">
                <Skeleton className="h-3 w-36 bg-white/20" />
              </div>
            </div>

            <div className="w-full">
              <div className="flex justify-end">
                <Skeleton className="h-12 w-48 bg-white/20" />
              </div>
              <div className="mt-2 space-y-1 text-right">
                <Skeleton className="ml-auto h-4 w-44 bg-white/20" />
                <Skeleton className="ml-auto h-4 w-36 bg-white/20" />
              </div>
            </div>

            <div className="flex w-full justify-end space-x-2">
              <Skeleton className="h-9 w-36 rounded-md bg-white/20" />
              <Skeleton className="size-9 rounded-md bg-white/20" />
            </div>
          </div>
        </div>

        <div className="absolute inset-0 -z-10 overflow-hidden rounded-lg">
          <Skeleton className="size-full rounded-none" />
        </div>
      </div>

      {/* User + Score Stats */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <div className="relative h-36 w-full overflow-hidden rounded-lg">
            <Skeleton className="absolute inset-0 rounded-lg" />
            <div className="absolute inset-0 bg-card/50" />
            <div className="relative flex h-24 p-4">
              <Skeleton className="mr-4 size-12 flex-none rounded-full bg-white/20" />
              <div>
                <Skeleton className="mb-2 h-5 w-28 bg-white/20" />
                <Skeleton className="h-4 w-20 bg-white/20" />
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-3">
          <div className="flex flex-col space-y-1.5">
            <div className="grid grid-cols-3 gap-1.5">
              {["Accuracy", "Combo", "PP"].map(label => (
                <div key={label} className="rounded-lg border border-border/30 bg-secondary/60 p-2.5 text-center">
                  <Skeleton className="mx-auto mb-1.5 h-3 w-14" />
                  <Skeleton className="mx-auto h-5 w-12" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {["Great", "Ok", "Meh", "Miss"].map(label => (
                <div key={label} className="rounded-lg border border-border/30 bg-secondary/60 p-2.5 text-center">
                  <Skeleton className="mx-auto mb-1.5 h-3 w-10" />
                  <Skeleton className="mx-auto h-4 w-8" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
