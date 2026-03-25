import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminBeatmapsetDetailSkeleton() {
  return (
    <div className="flex size-full flex-col space-y-4">
      <Skeleton className="h-9 w-44 rounded-md" />

      <div className="relative rounded-lg border p-0 lg:h-64">
        <div className="h-full rounded-lg bg-card/60 p-2 md:p-4 lg:px-6">
          <div className="flex h-full flex-col justify-between">
            <div>
              <Skeleton className="mb-2 h-8 w-64 bg-white/20" />
              <Skeleton className="h-5 w-40 bg-white/20" />
            </div>

            <div className="flex flex-col space-y-2">
              <div className="flex flex-row items-center">
                <Skeleton className="size-12 rounded-lg bg-white/20" />
                <div className="ml-2 space-y-1">
                  <Skeleton className="h-3 w-32 bg-white/20" />
                  <Skeleton className="h-3 w-28 bg-white/20" />
                  <Skeleton className="h-3 w-24 bg-white/20" />
                </div>
              </div>
              <div className="flex flex-row flex-wrap items-center gap-2">
                <Skeleton className="h-9 w-20 rounded-md bg-white/20" />
                <Skeleton className="h-9 w-24 rounded-md bg-white/20" />
                <Skeleton className="h-9 w-32 rounded-md bg-white/20" />
                <Skeleton className="h-9 w-32 rounded-md bg-white/20" />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 -z-10 overflow-hidden rounded-lg">
          <Skeleton className="size-full rounded-none" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-3">
          <CardHeader>
            <Skeleton className="mb-1 h-5 w-32" />
            <Skeleton className="h-3 w-56" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full rounded-md" />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <Skeleton className="mb-1 h-5 w-36" />
            <Skeleton className="h-3 w-44" />
          </CardHeader>
          <CardContent className="space-y-2">
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
