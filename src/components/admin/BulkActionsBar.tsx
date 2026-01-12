import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, X, Download, Archive } from 'lucide-react';

interface BulkActionsBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: (checked: boolean) => void;
  allSelected: boolean;
  onDelete?: () => void;
  onExport?: () => void;
  onArchive?: () => void;
  onClearSelection: () => void;
  deleteLabel?: string;
}

export function BulkActionsBar({
  selectedCount,
  totalCount,
  onSelectAll,
  allSelected,
  onDelete,
  onExport,
  onArchive,
  onClearSelection,
  deleteLabel = 'Delete',
}: BulkActionsBarProps) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-4 p-3 bg-muted/50 rounded-lg border animate-in fade-in-0 slide-in-from-top-2 duration-200">
      <div className="flex items-center gap-3">
        <Checkbox
          checked={allSelected}
          onCheckedChange={onSelectAll}
          aria-label="Select all"
        />
        <span className="text-sm font-medium">
          {selectedCount} of {totalCount} selected
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="h-7 px-2 text-muted-foreground"
        >
          <X className="h-3 w-3 mr-1" />
          Clear
        </Button>
      </div>
      <div className="flex items-center gap-2">
        {onExport && (
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-1" />
            Export Selected
          </Button>
        )}
        {onArchive && (
          <Button variant="outline" size="sm" onClick={onArchive}>
            <Archive className="h-4 w-4 mr-1" />
            Archive
          </Button>
        )}
        {onDelete && (
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4 mr-1" />
            {deleteLabel} ({selectedCount})
          </Button>
        )}
      </div>
    </div>
  );
}
