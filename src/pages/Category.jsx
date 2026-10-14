import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { useSearch } from '@/hooks/useSearch';
import { getAllTags } from '@/utils/searchUtils';
import SearchBar from '@/components/features/SearchBar';
import PoemCard from '@/components/features/PoemCard';
import { catalogWorks } from '@/data/catalog';
import './Category.css';

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
          <div className="category__grid">
            {results.map((work) => (
              <PoemCard key={work.id} work={work} contentLanguage={contentLanguage} />
            ))}
          </div>
        ) : (
          <p className="category__no-results">{t('search_no_results')}</p>
        )}
      </section>
    </div>
  );
}
