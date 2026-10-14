import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useSearch } from '@/hooks/useSearch';
import { usePagination } from '@/hooks/usePagination';
import { getAllTags } from '@/utils/searchUtils';
import { getAuthorName } from '@/utils/authorName';
import { buildPageTitle, setPageTitle } from '@/utils/pageMeta';
import SearchBar from '@/components/features/SearchBar';
import PoemCard from '@/components/features/PoemCard';
import Button from '@/components/ui/Button';
import { catalogWorks } from '@/data/catalog';
import NotFound from './NotFound';
import './Author.css';

export default function Author() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const { t } = useTranslation();
  // The slug is the URI-encoded canonical (Cyrillic) author name.
  const author = useMemo(() => {
    try {
      return decodeURIComponent(slug || '');
    } catch {
      return '';
    }
  }, [slug]);

  const authorWorks = useMemo(() => catalogWorks.filter((w) => w.author === author), [author]);

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
  } = useSearch(authorWorks);
  const allTags = useMemo(() => getAllTags(contentWorks), [contentWorks]);
  const authorName = getAuthorName(author, language);

  const paginationKey = JSON.stringify({
    author,
    query,
    tags: filters.tags,
    sortBy,
    contentLanguage,
  });
  const { visibleCount, showMore } = usePagination(paginationKey);
  const visibleResults = results.slice(0, visibleCount);

  useEffect(() => {
    setPageTitle(buildPageTitle([authorName], t('site_title')));
  }, [authorName, t]);

  if (!author || authorWorks.length === 0) {
    return <NotFound />;
  }

  return (
    <div className="author">
      <header className="author__header">
        <span className="author__eyebrow">{t('author_label')}</span>
        <h1 className="author__title">{authorName}</h1>
        <p className="author__count">
          {contentWorks.length} {t('works_label').toLowerCase()}
        </p>
      </header>

      <section className="author__search">
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

      <section className="author__results">
        {results.length > 0 ? (
          <>
            <div className="author__grid">
              {visibleResults.map((work) => (
                <PoemCard key={work.id} work={work} contentLanguage={contentLanguage} />
              ))}
            </div>
            {visibleCount < results.length && (
              <div className="author__pagination">
                <p className="author__pagination-count">
                  {visibleResults.length} / {results.length}
                </p>
                <Button variant="secondary" onClick={showMore}>
                  {t('show_more')}
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className="author__no-results">{t('search_no_results')}</p>
        )}
      </section>
    </div>
  );
}
