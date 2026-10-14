import { useEffect, useMemo } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useSearch } from '@/hooks/useSearch';
import { usePagination } from '@/hooks/usePagination';
import { getAllTags } from '@/utils/searchUtils';
import { buildPageTitle, setPageTitle } from '@/utils/pageMeta';
import SearchBar from '@/components/features/SearchBar';
import PoemCard from '@/components/features/PoemCard';
import Button from '@/components/ui/Button';
import { catalogWorks } from '@/data/catalog';
import './Home.css';

export default function Home() {
  const { t } = useTranslation();
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
  } = useSearch(catalogWorks);
  const allTags = useMemo(() => getAllTags(contentWorks), [contentWorks]);
  const paginationKey = JSON.stringify({
    query,
    type: filters.type,
    tags: filters.tags,
    sortBy,
    contentLanguage,
  });
  const { visibleCount, showMore } = usePagination(paginationKey);
  const visibleResults = results.slice(0, visibleCount);

  useEffect(() => {
    setPageTitle(buildPageTitle([t('home_hero_title')], t('site_title')));
  }, [t]);

  return (
    <div className="home">
      {/* Hero Section — also serves as canonical answer block for AI crawlers */}
      <section className="home__hero">
        <h1 className="home__hero-title">{t('home_hero_title')}</h1>
        <p className="home__hero-subtitle">{t('home_hero_subtitle')}</p>
      </section>

      {/* Search & Filters */}
      <section className="home__search">
        <SearchBar
          query={query}
          setQuery={setQuery}
          filters={filters}
          setFilters={setFilters}
          sortBy={sortBy}
          setSortBy={setSortBy}
          allTags={allTags}
          contentLanguage={contentLanguage}
          setContentLanguage={setContentLanguage}
        />
      </section>

      {/* Results */}
      <section className="home__results">
        {results.length > 0 ? (
          <>
            <div className="home__grid">
              {visibleResults.map((work) => (
                <PoemCard key={work.id} work={work} contentLanguage={contentLanguage} />
              ))}
            </div>
            {visibleCount < results.length && (
              <div className="home__pagination">
                <p className="home__count">
                  {visibleResults.length} / {results.length}
                </p>
                <Button variant="secondary" onClick={showMore}>
                  {t('show_more')}
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className="home__no-results">{t('search_no_results')}</p>
        )}
      </section>
    </div>
  );
}
