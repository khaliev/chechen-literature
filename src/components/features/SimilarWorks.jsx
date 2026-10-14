import { useTranslation } from '@/hooks/useTranslation';
import PoemCard from './PoemCard';
import './SimilarWorks.css';

const SimilarWorks = ({ works = [], contentLanguage }) => {
  const { t } = useTranslation();

  if (!works || works.length === 0) {
    return null;
  }

  return (
    <section className="similar-works">
      <h2 className="similar-works__title">{t('similar_works')}</h2>
      <div className="similar-works__grid">
        {works.map((w) => (
          <PoemCard key={w.id} work={w} contentLanguage={contentLanguage} />
        ))}
      </div>
    </section>
  );
};

export default SimilarWorks;
