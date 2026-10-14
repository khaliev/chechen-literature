import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  createSearchIndex,
  filterByContentLanguage,
  filterByType,
  filterByTags,
  getDefaultContentLanguage,
  sortWorks,
} from '../utils/searchUtils';
import { CONTENT_LANGUAGES } from '../utils/contentLanguage';
import { useLanguage } from '../context/LanguageContext';

const VALID_TYPES = ['all', 'poem', 'song', 'prose'];
const VALID_SORTS = ['date', 'language', 'alphabetical', 'author'];
const VALID_LANGS = [...CONTENT_LANGUAGES, 'all'];

/**
 * Custom search hook with language-aware content filtering, debounced text
 * search, type/tag filters, sorting, and URL query parameter synchronization.
 *
 * @param {Array} works - Array of literary work objects (from index.json)
 * @returns {Object} Search state and setters
 */
export function useSearch(works) {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultContentLanguage = useMemo(
    () => getDefaultContentLanguage(works, language),
    [works, language]
  );

  const [query, setQuery] = useState(() => searchParams.get('q') || '');
  const [debouncedQuery, setDebouncedQuery] = useState(() => searchParams.get('q') || '');

  const [contentLanguage, setContentLanguage] = useState(() => {
    const urlLang = searchParams.get('lang');
    return VALID_LANGS.includes(urlLang) ? urlLang : defaultContentLanguage;
  });

  const [filters, setFilters] = useState(() => {
    const urlType = searchParams.get('type');
    const urlTags = [...searchParams.getAll('tag'), ...(searchParams.get('tags')?.split(',') || [])]
      .map((t) => t.trim())
      .filter(Boolean);
    return {
      type: VALID_TYPES.includes(urlType) ? urlType : 'all',
      tags: Array.from(new Set(urlTags)),
    };
  });

  const [sortBy, setSortBy] = useState(() => {
    const urlSort = searchParams.get('sort');
    return VALID_SORTS.includes(urlSort) ? urlSort : 'date';
  });

  const timerRef = useRef(null);
  const prevLanguageRef = useRef(language);
  const searchKey = searchParams.toString();

  // When the interface language changes, pick the matching default again
  useEffect(() => {
    if (prevLanguageRef.current !== language) {
      prevLanguageRef.current = language;
      setContentLanguage(getDefaultContentLanguage(works, language));
    }
  }, [language, works]);

  // Sync state when URL changes externally (e.g., clicking a tag link or browser back/forward)
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    const urlType = searchParams.get('type');
    const urlSort = searchParams.get('sort');
    const urlLang = searchParams.get('lang');
    const urlTags = Array.from(
      new Set(
        [...searchParams.getAll('tag'), ...(searchParams.get('tags')?.split(',') || [])]
          .map((t) => t.trim())
          .filter(Boolean)
      )
    );

    setQuery((prev) => (prev === urlQuery ? prev : urlQuery));
    setDebouncedQuery((prev) => (prev === urlQuery ? prev : urlQuery));
    setFilters((prev) => {
      const nextType = VALID_TYPES.includes(urlType) ? urlType : 'all';
      if (prev.type === nextType && JSON.stringify(prev.tags) === JSON.stringify(urlTags)) {
        return prev;
      }
      return { type: nextType, tags: urlTags };
    });
    setSortBy((prev) => {
      const nextSort = VALID_SORTS.includes(urlSort) ? urlSort : 'date';
      return prev === nextSort ? prev : nextSort;
    });
    setContentLanguage((prev) => {
      const nextLang = VALID_LANGS.includes(urlLang) ? urlLang : defaultContentLanguage;
      return prev === nextLang ? prev : nextLang;
    });
  }, [searchKey, defaultContentLanguage]);

  // Debounce the search query (300ms)
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timerRef.current);
  }, [query]);

  // Write state changes back to URL search params
  useEffect(() => {
    const nextParams = {};
    if (debouncedQuery.trim()) nextParams.q = debouncedQuery.trim();
    if (filters.type && filters.type !== 'all') nextParams.type = filters.type;
    if (filters.tags?.length > 0) nextParams.tag = filters.tags;
    if (sortBy && sortBy !== 'date') nextParams.sort = sortBy;
    if (contentLanguage && contentLanguage !== defaultContentLanguage) {
      nextParams.lang = contentLanguage;
    }

    const currentSnapshot = JSON.stringify({
      q: searchParams.get('q') || undefined,
      type: searchParams.get('type') || undefined,
      tag: searchParams.getAll('tag').length ? searchParams.getAll('tag') : undefined,
      sort: searchParams.get('sort') || undefined,
      lang: searchParams.get('lang') || undefined,
    });

    if (JSON.stringify(nextParams) !== currentSnapshot) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [debouncedQuery, filters, sortBy, contentLanguage, defaultContentLanguage, setSearchParams]);

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
  }, [debouncedQuery, contentWorks, fuseIndex, filters, sortBy, language, contentLanguage]);

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
