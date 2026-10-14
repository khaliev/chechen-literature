import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { useSearch } from '@/hooks/useSearch';
import { usePagination } from '@/hooks/usePagination';
import { getAllTags } from '@/utils/searchUtils';
import { buildPageTitle, setPageTitle } from '@/utils/pageMeta';
import SearchBar from '@/components/features/SearchBar';
import PoemCard from '@/components/features/PoemCard';
import Button from '@/components/ui/Button';
import { catalogWorks } from '@/data/catalog';
import NotFound from './NotFound';
import './Category.css';

const VALID_TYPES = ['poem', 'song', 'prose'];

export default function Category() {
  const { type } = useParams(); // 'poem', 'song', 'prose'
  const { t } = useTranslation();

  // Pre-filter catalog data by type. useSearch applies content-language filtering.
  const categoryWorks = useMemo(() => catalogWorks.filter((w) => w.type === type), [type]);

  const {
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
  } = useSearch(categoryWorks);
  const allTags = useMemo(() => getAllTags(contentWorks), [contentWorks]);

  // Map type to translation key
  const titleKey = type === 'poem' ? 'nav_poems' : type === 'song' ? 'nav_songs' : 'nav_prose';

  const paginationKey = JSON.stringify({
    type,
    query,
    tags: filters.tags,
    sortBy,
    contentLanguage,
  });
  const { visibleCount, showMore } = usePagination(paginationKey);
  const visibleResults = results.slice(0, visibleCount);

  useEffect(() => {
    setPageTitle(buildPageTitle([t(titleKey)], t('site_title')));
  }, [t, titleKey]);

  if (!VALID_TYPES.includes(type)) {
    return <NotFound />;
  }

  return (
    <div className="category">
      <header className="category__header">
        <h1 className="category__title">{t(titleKey)}</h1>
        <p className="category__count">
          {contentWorks.length} {t(titleKey).toLowerCase()}
        </p>
      </header>

      <section className="category__search">
        <SearchBar
          query={query}
          setQuery={setQuery}
          filters={filters}
          setFilters={setFilters}
          sortBy={sortBy}
          setSortBy={setSortBy}
          allTags={allTags}
          hideTypeFilter={true}
          contentLanguage={contentLanguage}
          setContentLanguage={setContentLanguage}
        />
      </section>

      <section className="category__results">
        {results.length > 0 ? (
          <>
            <div className="category__grid">
              {visibleResults.map((work) => (
                <PoemCard key={work.id} work={work} contentLanguage={contentLanguage} />
              ))}
            </div>
            {visibleCount < results.length && (
              <div className="category__pagination">
                <p className="category__pagination-count">
                  {visibleResults.length} / {results.length}
                </p>
                <Button variant="secondary" onClick={showMore}>
                  {t('show_more')}
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className="category__no-results">{t('search_no_results')}</p>
        )}
      </section>
    </div>
  );
}
