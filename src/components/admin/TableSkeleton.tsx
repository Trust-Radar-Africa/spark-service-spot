import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TableSkeletonProps {
  columns: number;
  rows?: number;
  hasCheckbox?: boolean;
}

export function TableSkeleton({ columns, rows = 5, hasCheckbox = true }: TableSkeletonProps) {
  const totalColumns = hasCheckbox ? columns + 1 : columns;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {hasCheckbox && (
            <TableHead className="w-[40px]">
              <Skeleton className="h-4 w-4" />
            </TableHead>
          )}
          {Array.from({ length: columns }).map((_, i) => (
            <TableHead key={i}>
              <Skeleton className="h-4 w-24" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {hasCheckbox && (
              <TableCell>
                <Skeleton className="h-4 w-4" />
              </TableCell>
            )}
            {Array.from({ length: columns }).map((_, colIndex) => (
              <TableCell key={colIndex}>
                <Skeleton className="h-4 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
