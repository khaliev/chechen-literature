import { useEffect, useState } from 'react';

export const PAGE_SIZE = 24;

/**
 * Progressive "show more" pagination for result grids.
 * `resetKey` must be a stable primitive (e.g. a JSON string of the search
 * state): pagination resets to the first page whenever it changes.
 */
export function usePagination(resetKey) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [resetKey]);

  const showMore = () => setVisibleCount((count) => count + PAGE_SIZE);

  return { visibleCount, showMore };
}
