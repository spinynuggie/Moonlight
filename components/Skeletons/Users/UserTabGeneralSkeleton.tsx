import { Skeleton } from "@/components/ui/skeleton";

export function UserTabGeneralSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-4">
      <div className="col-span-2 flex flex-col sm:col-span-1">
        <Skeleton className="h-14 w-full rounded-t-lg" />
        <div className="space-y-3 rounded-b-lg border bg-accent p-4">
          <Skeleton className="h-10 w-full" />
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex items-center justify-between py-0.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-28" />
            </div>
          ))}
          <div className="my-1 border-b" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>

      <div className="col-span-2 flex flex-col">
        <Skeleton className="h-14 w-full rounded-t-lg" />
        <div className="rounded-b-lg border bg-accent p-4">
          <Skeleton className="h-52 w-full rounded-lg" />
          <div className="mt-2 flex justify-end gap-2">
            <Skeleton className="h-9 w-20 rounded-md" />
            <Skeleton className="h-9 w-16 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
