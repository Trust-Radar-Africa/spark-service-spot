import { useMemo, useState, useCallback } from "react";

interface UsePaginationResult<T> {
  currentPage: number;
  totalPages: number;
  paginatedItems: T[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  startIndex: number;
  endIndex: number;
  totalItems: number;
}

export function usePagination<T>(
  items: T[],
  itemsPerPage: number = 6
): UsePaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Reset to page 1 if items change and current page is out of bounds
  const validCurrentPage = useMemo(() => {
    if (currentPage > totalPages) {
      return 1;
    }
    return currentPage;
  }, [currentPage, totalPages]);

  // Calculate start and end indices
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  // Get paginated items
  const paginatedItems = useMemo(() => {
    return items.slice(startIndex, endIndex);
  }, [items, startIndex, endIndex]);

  const goToPage = useCallback(
    (page: number) => {
      const newPage = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(newPage);
      // Scroll to top of blog section
      window.scrollTo({ top: 400, behavior: "smooth" });
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    if (validCurrentPage < totalPages) {
      goToPage(validCurrentPage + 1);
    }
  }, [validCurrentPage, totalPages, goToPage]);

  const prevPage = useCallback(() => {
    if (validCurrentPage > 1) {
      goToPage(validCurrentPage - 1);
    }
  }, [validCurrentPage, goToPage]);

  const hasNextPage = validCurrentPage < totalPages;
  const hasPrevPage = validCurrentPage > 1;

  return {
    currentPage: validCurrentPage,
    totalPages,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage,
    startIndex: startIndex + 1, // 1-indexed for display
    endIndex,
    totalItems,
  };
}
