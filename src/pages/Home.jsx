import { useMemo } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useSearch } from '@/hooks/useSearch';
import { getAllTags } from '@/utils/searchUtils';
import SearchBar from '@/components/features/SearchBar';
import PoemCard from '@/components/features/PoemCard';
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
          <div className="home__grid">
            {results.map((work) => (
              <PoemCard key={work.id} work={work} contentLanguage={contentLanguage} />
            ))}
          </div>
        ) : (
          <p className="home__no-results">{t('search_no_results')}</p>
        )}
      </section>
    </div>
  );
}
