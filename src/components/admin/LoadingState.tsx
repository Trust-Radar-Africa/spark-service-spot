import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface LoadingStateProps {
  variant?: 'spinner' | 'skeleton' | 'table' | 'cards' | 'page';
  rows?: number;
  columns?: number;
  message?: string;
}

export function LoadingState({
  variant = 'skeleton',
  rows = 5,
  columns = 4,
  message = 'Loading...',
}: LoadingStateProps) {
  if (variant === 'spinner') {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className="space-y-4 animate-fade-in">
        {/* Table header skeleton */}
        <div className="flex gap-4 p-4 bg-muted/50 rounded-t-lg">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
        {/* Table rows skeleton */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="flex gap-4 p-4 border-b border-border/50"
            style={{ animationDelay: `${rowIndex * 50}ms` }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={colIndex}
                className={`h-4 ${colIndex === 0 ? 'w-10' : 'flex-1'}`}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
        {Array.from({ length: rows }).map((_, i) => (
          <Card key={i} style={{ animationDelay: `${i * 100}ms` }}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (variant === 'page') {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Header skeleton */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Stats cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table skeleton */}
        <Card>
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <div className="flex gap-4">
                <Skeleton className="h-10 flex-1 max-w-sm" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
            <LoadingState variant="table" rows={5} columns={5} />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default skeleton
  return (
    <div className="space-y-4 animate-fade-in">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex gap-4"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Specific loading components for common use cases
export function TableLoadingSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return <LoadingState variant="table" rows={rows} columns={columns} />;
}

export function CardsLoadingSkeleton({ count = 4 }: { count?: number }) {
  return <LoadingState variant="cards" rows={count} />;
}

export function PageLoadingSkeleton() {
  return <LoadingState variant="page" />;
}

export function SpinnerLoading({ message }: { message?: string }) {
  return <LoadingState variant="spinner" message={message} />;
}
