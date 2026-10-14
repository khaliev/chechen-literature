import { useTranslation } from '@/hooks/useTranslation';
import PoemCard from './PoemCard';
import Button from '../ui/Button';
import './CatalogGrid.css';

export default function CatalogGrid({
  results = [],
  visibleResults = [],
  visibleCount = 0,
  showMore,
  contentLanguage,
}) {
  const { t } = useTranslation();

  if (results.length === 0) {
    return <p className="catalog-grid__no-results">{t('search_no_results')}</p>;
  }

  return (
    <>
      <div className="catalog-grid">
        {visibleResults.map((work) => (
          <PoemCard key={work.id} work={work} contentLanguage={contentLanguage} />
        ))}
      </div>
      {visibleCount < results.length && (
        <div className="catalog-grid__pagination">
          <p className="catalog-grid__count">
            {visibleResults.length} / {results.length}
          </p>
          <Button variant="secondary" onClick={showMore}>
            {t('show_more')}
          </Button>
        </div>
      )}
    </>
  );
}
