import { useState, useMemo, useEffect, useRef } from 'react';
import {
  createSearchIndex,
  filterByContentLanguage,
  filterByType,
  filterByTags,
  sortWorks,
} from '../utils/searchUtils';
import { useLanguage } from '../context/LanguageContext';

/**
 * Custom search hook with language-aware content filtering, debounced text
 * search, type/tag filters, and sorting.
 *
 * @param {Array} works - Array of literary work objects (from index.json)
 * @returns {Object} Search state and setters
 */
export function useSearch(works) {
  const { language } = useLanguage();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [contentLanguage, setContentLanguage] = useState(language);
  const [filters, setFilters] = useState({
    type: 'all', // 'all' | 'poem' | 'song' | 'prose'
    tags: [], // array of selected tag strings
  });
  const [sortBy, setSortBy] = useState('date'); // 'alphabetical' | 'author' | 'date'
  const timerRef = useRef(null);

  // When the interface language changes, make it the new default content language.
  useEffect(() => {
    setContentLanguage(language);
  }, [language]);

  // Debounce the search query (300ms)
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timerRef.current);
  }, [query]);

  const contentWorks = useMemo(
    () => filterByContentLanguage(works, contentLanguage),
    [works, contentLanguage]
  );

  // Create Fuse.js index using only the selected content language's works.
  const fuseIndex = useMemo(() => createSearchIndex(contentWorks), [contentWorks]);

  // Compute results: text search → type filter → tag filter → sort
  const results = useMemo(() => {
    let result;

    // Step 1: Text search (or return all if no query)
    if (debouncedQuery.trim()) {
      result = fuseIndex.search(debouncedQuery).map((r) => r.item);
    } else {
      result = [...contentWorks];
    }

    // Step 2: Filter by type
    result = filterByType(result, filters.type);

    // Step 3: Filter by tags
    result = filterByTags(result, filters.tags);

    // Step 4: Sort (only when no text query, to preserve relevance ranking)
    if (!debouncedQuery.trim()) {
      result = sortWorks(result, sortBy, contentLanguage === 'all' ? language : contentLanguage);
    }

    return result;
  }, [debouncedQuery, contentWorks, fuseIndex, filters, sortBy, language]);

  return {
    query,
    setQuery,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    results,
    contentWorks,
    contentLanguage,
    setContentLanguage,
  };
}
