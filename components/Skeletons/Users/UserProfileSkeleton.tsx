import { Fragment } from "react";

import { Skeleton } from "@/components/ui/skeleton";

export function UserProfileSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1000px]">
      <div className="mb-2 overflow-hidden rounded-[10px] border border-border/50 shadow-md">
        <div className="px-4 py-3">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <div className="overflow-hidden rounded-[10px] border border-border/50 shadow-md">
        <Skeleton className="h-[100px] w-full rounded-none md:h-[250px]" />

        <div className="relative flex h-[85px] items-end bg-secondary px-[10px] md:px-[50px]">
          <Skeleton className="absolute bottom-0 left-[10px] size-[120px] rounded-[40px] md:left-[50px]" />
          <div className="ml-[130px] flex flex-1 items-end gap-3 pb-4 md:ml-[140px]">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        <div className="bg-card p-[10px] md:px-[50px]">
          <div className="flex flex-col gap-4 xl:flex-row">
            <div className="flex flex-1 flex-col gap-3">
              <div className="flex gap-5">
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-7 w-28" />
                </div>
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-7 w-28" />
                </div>
              </div>
              <Skeleton className="h-[90px] w-full" />
              <div className="flex gap-4">
                {Array.from({ length: 8 }, (_, i) => (
                  <Skeleton key={i} className="h-6 w-12" />
                ))}
              </div>
            </div>
            <div className="hidden w-[2px] bg-border xl:mx-[15px] xl:block" />
            <div className="xl:w-[260px]">
              <div className="grid grid-cols-2 gap-x-5 gap-y-2">
                {Array.from({ length: 8 }, (_, i) => (
                  <Fragment key={i}>
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-20 justify-self-end" />
                  </Fragment>
                ))}
              </div>
              <div className="mt-3">
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>

        <div className="min-h-[50px] bg-muted p-[10px] md:px-[50px]">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {[96, 80, 112, 88].map(w => (
              <Skeleton key={w} className="h-4" style={{ width: w }} />
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
            {[80, 96, 72].map(w => (
              <Skeleton key={w} className="h-4" style={{ width: w }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
