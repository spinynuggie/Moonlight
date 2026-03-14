import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LeaderboardTableSkeletonProps {
  rows?: number;
}

export function LeaderboardTableSkeleton({ rows = 10 }: LeaderboardTableSkeletonProps) {
  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-4 w-10" />
              </TableHead>
              <TableHead />
              <TableHead />
              <TableHead>
                <Skeleton className="ml-auto h-4 w-20" />
              </TableHead>
              <TableHead>
                <Skeleton className="ml-auto h-4 w-16" />
              </TableHead>
              <TableHead>
                <Skeleton className="ml-auto h-4 w-20" />
              </TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: rows }, (_, i) => (
              <TableRow
                key={`skeleton-row-${i}`}
                className="duration-300 animate-in fade-in"
                style={{ animationDelay: `${Math.min(i * 75, 600)}ms`, animationFillMode: "backwards" }}
              >
                <TableCell>
                  <Skeleton className="ml-auto h-5 w-8" />
                </TableCell>
                <TableCell>
                  <Skeleton className="size-6 rounded" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2 p-3">
                    <Skeleton className="size-10 rounded-full" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="ml-auto h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="ml-auto h-4 w-14" />
                </TableCell>
                <TableCell>
                  <Skeleton className="ml-auto h-4 w-10" />
                </TableCell>
                <TableCell>
                  <Skeleton className="ml-auto size-8 rounded" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
