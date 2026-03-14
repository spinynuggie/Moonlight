import { Skeleton } from "@/components/ui/skeleton";

interface UserScoreMinimalSkeletonProps {
  showUser?: boolean;
}

export function UserScoreMinimalSkeleton({
  showUser = true,
}: UserScoreMinimalSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-card text-white shadow">
      <div className="relative h-28">
        <div className="size-full rounded-none bg-muted/50" />

        <div className="absolute inset-0 flex items-center bg-black/60">
          <div className="flex size-full place-content-between px-4 py-2">
            <div className="flex h-full flex-col justify-between overflow-hidden">
              <div className="flex-col">
                <div className="line-clamp-2 space-y-1.5">
                  <Skeleton className="h-3.5 w-44 bg-white/15" />
                  <Skeleton className="h-3 w-28 bg-white/15" />
                </div>
                <div className="mt-2 flex items-center space-x-2">
                  <Skeleton className="h-3 w-20 rounded-sm bg-white/10" />
                </div>
              </div>

              {showUser && (
                <div className="flex items-center">
                  <Skeleton className="size-8 rounded-full bg-white/15" />
                  <Skeleton className="mx-1 h-3 w-20 bg-white/15" />
                </div>
              )}
            </div>

            <div className="mx-2 flex items-center">
              <div className="space-y-1.5 text-end">
                <Skeleton className="ml-auto h-4 w-10 bg-white/10" />
                <Skeleton className="ml-auto h-6 w-16 bg-white/15" />
                <Skeleton className="ml-auto h-3.5 w-20 bg-white/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
