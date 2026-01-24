import { LucideIcon, FileX, Inbox, Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'default' | 'search' | 'filtered';
}

const variantIcons: Record<string, LucideIcon> = {
  default: Inbox,
  search: Search,
  filtered: FileX,
};

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'default',
}: EmptyStateProps) {
  const Icon = icon || variantIcons[variant];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="rounded-full bg-muted p-4 mb-6">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-6 max-w-md">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}

// Pre-configured empty states for common scenarios
export function NoResultsState({ onClearFilters }: { onClearFilters?: () => void }) {
  return (
    <EmptyState
      variant="filtered"
      title="No results found"
      description="Try adjusting your search or filter criteria to find what you're looking for."
      actionLabel={onClearFilters ? 'Clear Filters' : undefined}
      onAction={onClearFilters}
    />
  );
}

export function NoCandidatesState({ onRefresh }: { onRefresh?: () => void }) {
  return (
    <EmptyState
      icon={Users}
      title="No candidates yet"
      description="When candidates apply through the careers page, they will appear here."
      actionLabel={onRefresh ? 'Refresh' : undefined}
      onAction={onRefresh}
    />
  );
}

export function NoDataState({ 
  entityName = 'items',
  onRefresh 
}: { 
  entityName?: string;
  onRefresh?: () => void;
}) {
  return (
    <EmptyState
      title={`No ${entityName} found`}
      description={`There are no ${entityName} to display. Data will appear here once it's available from the server.`}
      actionLabel={onRefresh ? 'Refresh' : undefined}
      onAction={onRefresh}
    />
  );
}
