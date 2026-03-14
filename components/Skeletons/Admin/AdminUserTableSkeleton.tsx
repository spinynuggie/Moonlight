import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AdminUserTableSkeletonProps {
  rows?: number;
}

export function AdminUserTableSkeleton({ rows = 10 }: AdminUserTableSkeletonProps) {
  return (
    <div>
      <div className="rounded-md border">
        <Table className="w-full min-w-max">
          <TableHeader>
            <TableRow>
              <TableHead><Skeleton className="h-4 w-8" /></TableHead>
              <TableHead><Skeleton className="h-4 w-8" /></TableHead>
              <TableHead><Skeleton className="h-4 w-20" /></TableHead>
              <TableHead><Skeleton className="h-4 w-16" /></TableHead>
              <TableHead><Skeleton className="h-4 w-16" /></TableHead>
              <TableHead><Skeleton className="h-4 w-12" /></TableHead>
              <TableHead><Skeleton className="h-4 w-16" /></TableHead>
              <TableHead><Skeleton className="h-4 w-12" /></TableHead>
              <TableHead><Skeleton className="h-4 w-14" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }, (_, i) => (
              <TableRow
                key={`skeleton-row-${i}`}
                className="duration-300 animate-in fade-in"
                style={{ animationDelay: `${Math.min(i * 75, 600)}ms`, animationFillMode: "backwards" }}
              >
                <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                <TableCell><Skeleton className="size-8 rounded" /></TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3 px-2">
                    <Skeleton className="size-10 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Skeleton className="h-5 w-12 rounded-full" />
                    <Skeleton className="h-5 w-10 rounded-full" />
                  </div>
                </TableCell>
                <TableCell><Skeleton className="h-5 w-10 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="size-2 rounded-full" />
                    <Skeleton className="h-4 w-14" />
                  </div>
                </TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-8 w-16 rounded-md" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
