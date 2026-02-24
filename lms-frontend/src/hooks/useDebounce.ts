import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function usePagination(totalPages: number, initialPage = 1) {
  const [page, setPage] = useState(initialPage);

  const goToPage = (p: number) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  const nextPage = () => goToPage(page + 1);
  const prevPage = () => goToPage(page - 1);
  const resetPage = () => setPage(1);

  return {
    page,
    goToPage,
    nextPage,
    prevPage,
    resetPage,
    canNext: page < totalPages,
    canPrev: page > 1,
  };
}
