import { useState, useCallback, useMemo } from 'react';

export function useBulkSelection<T extends { id: number | string }>(items: T[]) {
  const [selectedIds, setSelectedIds] = useState<Set<number | string>>(new Set());

  const toggleItem = useCallback((id: number | string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(items.map((item) => item.id)));
    } else {
      setSelectedIds(new Set());
    }
  }, [items]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const isSelected = useCallback(
    (id: number | string) => selectedIds.has(id),
    [selectedIds]
  );

  const selectedItems = useMemo(
    () => items.filter((item) => selectedIds.has(item.id)),
    [items, selectedIds]
  );

  const allSelected = useMemo(
    () => items.length > 0 && selectedIds.size === items.length,
    [items.length, selectedIds.size]
  );

  const someSelected = useMemo(
    () => selectedIds.size > 0 && selectedIds.size < items.length,
    [selectedIds.size, items.length]
  );

  return {
    selectedIds,
    selectedItems,
    selectedCount: selectedIds.size,
    toggleItem,
    selectAll,
    clearSelection,
    isSelected,
    allSelected,
    someSelected,
  };
}
