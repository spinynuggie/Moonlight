import { Skeleton } from "@/components/ui/skeleton";

export function UserProfileSkeleton() {
  return (
    <div className="rounded-lg border bg-card shadow">
      {/* Banner */}
      <div className="relative h-32 md:h-44 lg:h-64">
        <Skeleton className="size-full rounded-t-lg" />
        <div className="absolute inset-0 flex w-full bg-gradient-to-t from-card via-transparent to-transparent">
          <div className="relative flex flex-grow place-content-between items-end overflow-hidden px-4 py-2 md:p-6">
            {/* Avatar + username area */}
            <div className="flex w-3/4 items-end space-x-4">
              <div className="relative size-16 flex-none md:size-32">
                <Skeleton className="size-full rounded-full bg-white/20" />
                <Skeleton className="absolute bottom-1 right-1 size-5 rounded-full bg-white/30 md:size-10" />
              </div>
              <div className="flex min-w-0 flex-grow -translate-y-1 flex-col md:-translate-y-2">
                <div className="flex flex-row flex-wrap gap-x-2">
                  <Skeleton className="h-5 w-36 bg-white/20 md:h-8 md:w-48" />
                  <Skeleton className="h-5 w-16 rounded-full bg-white/20" />
                </div>
                <Skeleton className="mt-1 h-3 w-28 bg-white/20 md:h-4 md:w-36" />
              </div>
            </div>

            {/* Rank boxes */}
            <div className="flex flex-col space-y-2 rounded bg-card/75 px-2 py-1 text-center md:min-w-24">
              <div className="flex items-center">
                <Skeleton className="mr-2 size-5 rounded bg-white/20 md:size-6" />
                <Skeleton className="h-5 w-12 bg-white/20 md:h-7 md:w-16" />
              </div>
              <div className="flex items-center">
                <Skeleton className="mr-2 size-5 rounded bg-white/20 md:size-6" />
                <Skeleton className="h-5 w-12 bg-white/20 md:h-7 md:w-16" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info section */}
      <div className="bg-card px-6 py-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>

        <hr className="my-2" />

        {/* Tab bar */}
        <div className="my-2">
          <div className="flex space-x-2 border-b border-border pb-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>

        {/* Content placeholder */}
        <div className="mt-4 space-y-4">
          <Skeleton className="h-48 w-full rounded-lg" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
