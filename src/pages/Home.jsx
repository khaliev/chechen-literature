import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useSearch } from '@/hooks/useSearch';
import { usePagination } from '@/hooks/usePagination';
import { getAllTags } from '@/utils/searchUtils';
import { getPreferredContentLanguage } from '@/utils/contentLanguage';
import { buildPageTitle, setPageTitle } from '@/utils/pageMeta';
import SearchBar from '@/components/features/SearchBar';
import CatalogGrid from '@/components/features/CatalogGrid';
import Button from '@/components/ui/Button';
import { catalogWorks } from '@/data/catalog';
import './Home.css';

export default function Home() {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();
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

  const handleRandomWork = () => {
    const pool = contentWorks.length > 0 ? contentWorks : catalogWorks;
    if (!pool.length) return;
    const randomWork = pool[Math.floor(Math.random() * pool.length)];
    const displayLang = getPreferredContentLanguage(randomWork, contentLanguage || language);
    navigate(`/${randomWork.type}/${randomWork.id}?lang=${displayLang}`);
  };

  useEffect(() => {
    setPageTitle(buildPageTitle([t('home_hero_title')], t('site_title')));
  }, [t]);

  return (
    <div className="home">
      {/* Hero Section — also serves as canonical answer block for AI crawlers */}
      <section className="home__hero">
        <h1 className="home__hero-title">{t('home_hero_title')}</h1>
        <p className="home__hero-subtitle">{t('home_hero_subtitle')}</p>
        <div className="home__hero-actions">
          <Button variant="secondary" size="sm" onClick={handleRandomWork}>
            {t('random_work')}
          </Button>
        </div>
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
        <CatalogGrid
          results={results}
          visibleResults={visibleResults}
          visibleCount={visibleCount}
          showMore={showMore}
          contentLanguage={contentLanguage}
        />
      </section>
    </div>
  );
}
