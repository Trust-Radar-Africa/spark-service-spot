import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ITEMS_PER_PAGE_OPTIONS, ItemsPerPageOption } from '@/hooks/useItemsPerPage';

interface ItemsPerPageSelectProps {
  value: ItemsPerPageOption;
  onChange: (value: ItemsPerPageOption) => void;
  className?: string;
}

export default function ItemsPerPageSelect({ 
  value, 
  onChange,
  className 
}: ItemsPerPageSelectProps) {
  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <span className="text-sm text-muted-foreground whitespace-nowrap">Show</span>
      <Select
        value={String(value)}
        onValueChange={(val) => onChange(Number(val) as ItemsPerPageOption)}
      >
        <SelectTrigger className="w-[70px] h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ITEMS_PER_PAGE_OPTIONS.map((option) => (
            <SelectItem key={option} value={String(option)}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-sm text-muted-foreground whitespace-nowrap">per page</span>
    </div>
  );
}
