import { Skeleton } from "@/components/ui/skeleton";

export function UserElementSkeleton() {
  return (
    <div className="relative h-36 w-full overflow-hidden rounded-lg">
      <div className="relative flex h-full flex-col place-content-between">
        <Skeleton className="absolute inset-0 rounded-lg" />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative flex h-24 place-content-between p-4">
          <div className="relative flex items-start overflow-hidden">
            <Skeleton className="mr-4 size-12 flex-none rounded-full bg-white/20" />
            <div>
              <Skeleton className="mb-2 h-5 w-28 bg-white/20" />
              <div className="flex items-center gap-2">
                <Skeleton className="size-8 rounded bg-white/20" />
                <Skeleton className="h-5 w-12 rounded-full bg-white/20" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex w-full flex-row rounded-b-lg bg-black/50 px-4 py-2">
          <div className="flex w-full items-center space-x-2">
            <Skeleton className="size-4 rounded-full bg-white/20" />
            <Skeleton className="h-3 w-24 bg-white/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
