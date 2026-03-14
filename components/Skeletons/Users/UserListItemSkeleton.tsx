import { Skeleton } from "@/components/ui/skeleton";

export function UserListItemSkeleton() {
  return (
    <div className="relative flex items-center justify-between rounded-lg bg-card px-3 py-2 shadow-md">
      <div className="flex flex-grow items-center gap-3 overflow-hidden">
        <Skeleton className="size-12 flex-none rounded-full" />

        <div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-12 rounded-full" />
            <Skeleton className="size-8 rounded" />
          </div>
          <div className="mt-1 flex items-center space-x-2 rounded-t-lg p-0.5">
            <Skeleton className="size-4 rounded-full" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
      </div>

      <Skeleton className="size-10 rounded-md" />
    </div>
  );
}
