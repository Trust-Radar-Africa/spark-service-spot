import { useState, useMemo, useEffect, useCallback } from 'react';

export const ITEMS_PER_PAGE_OPTIONS = [5, 10, 25, 50] as const;
export type ItemsPerPageOption = typeof ITEMS_PER_PAGE_OPTIONS[number];

interface UseItemsPerPageResult<T> {
  itemsPerPage: ItemsPerPageOption;
  setItemsPerPage: (value: ItemsPerPageOption) => void;
  currentPage: number;
  totalPages: number;
  paginatedItems: T[];
  goToPage: (page: number) => void;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  getPageNumbers: () => (number | 'ellipsis')[];
}

export function useItemsPerPage<T>(
  items: T[],
  defaultItemsPerPage: ItemsPerPageOption = 5,
  storageKey?: string
): UseItemsPerPageResult<T> {
  // Load from localStorage if available
  const getInitialItemsPerPage = (): ItemsPerPageOption => {
    if (storageKey && typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      if (stored && ITEMS_PER_PAGE_OPTIONS.includes(Number(stored) as ItemsPerPageOption)) {
        return Number(stored) as ItemsPerPageOption;
      }
    }
    return defaultItemsPerPage;
  };

  const [itemsPerPage, setItemsPerPageState] = useState<ItemsPerPageOption>(getInitialItemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const setItemsPerPage = useCallback((value: ItemsPerPageOption) => {
    setItemsPerPageState(value);
    setCurrentPage(1); // Reset to first page when changing items per page
    if (storageKey) {
      localStorage.setItem(storageKey, String(value));
    }
  }, [storageKey]);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Reset to page 1 if current page is out of bounds
  const validCurrentPage = useMemo(() => {
    if (currentPage > totalPages) {
      return 1;
    }
    return currentPage;
  }, [currentPage, totalPages]);

  // Reset page when items change significantly
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const paginatedItems = useMemo(() => {
    return items.slice(startIndex, endIndex);
  }, [items, startIndex, endIndex]);

  const goToPage = useCallback((page: number) => {
    const newPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(newPage);
  }, [totalPages]);

  const getPageNumbers = useCallback((): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (validCurrentPage <= 3) {
        pages.push(1, 2, 3, 'ellipsis', totalPages);
      } else if (validCurrentPage >= totalPages - 2) {
        pages.push(1, 'ellipsis', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, 'ellipsis', validCurrentPage, 'ellipsis', totalPages);
      }
    }
    return pages;
  }, [totalPages, validCurrentPage]);

  return {
    itemsPerPage,
    setItemsPerPage,
    currentPage: validCurrentPage,
    totalPages,
    paginatedItems,
    goToPage,
    startIndex: startIndex + 1, // 1-indexed for display
    endIndex,
    totalItems,
    getPageNumbers,
  };
}
