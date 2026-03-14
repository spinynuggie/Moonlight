import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function BeatmapSetCardSkeleton() {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="h-32 bg-muted">
        <div className="relative flex size-full flex-col justify-between bg-gradient-to-t from-black/90 to-black/30 p-3">
          <div className="flex justify-start">
            <Skeleton className="size-6 rounded-lg bg-white/20" />
          </div>
          <div className="flex">
            <div className="flex-grow">
              <Skeleton className="mb-1 h-4 w-3/4 bg-white/20" />
              <Skeleton className="h-3 w-1/2 bg-white/20" />
            </div>
            <Skeleton className="mt-auto size-8 rounded bg-white/20" />
          </div>
        </div>
      </div>
      <CardContent className="flex flex-grow flex-col p-3">
        <div className="mb-4 flex flex-wrap gap-1">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="w-18 h-6 rounded-full" />
        </div>
        <div className="mt-auto flex items-center justify-between gap-1 text-xs">
          <div>
            <Skeleton className="mb-1 h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div>
            <Skeleton className="mb-1 h-4 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-3">
        <Skeleton className="h-8 w-full" />
      </CardFooter>
    </Card>
  );
}
