import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { getFieldInLanguage, getTranslatedField } from '@/utils/getTranslatedField';
import { getPreferredContentLanguage } from '@/utils/contentLanguage';
import { getWorkAuthor } from '@/utils/authorName';
import Tag from '../ui/Tag';
import './PoemCard.css';

const PoemCard = ({ work, contentLanguage }) => {
  const { language } = useLanguage();
  const { t } = useTranslation();

  if (!work) return null;

  const selectedContentLanguage = contentLanguage || language;
  const displayLanguage = getPreferredContentLanguage(work, selectedContentLanguage);
  const exactTitle = getFieldInLanguage(work, 'title', displayLanguage);
  const exactPreview = getFieldInLanguage(work, 'text_preview', displayLanguage);
  const titleField = exactTitle.text
    ? exactTitle
    : getTranslatedField(work, 'title', displayLanguage);
  const previewField = exactPreview.text
    ? exactPreview
    : getTranslatedField(work, 'text_preview', displayLanguage);
  const showLanguageBadge = selectedContentLanguage === 'all' || displayLanguage !== language;
  const authorName = getWorkAuthor(work, language);
  const detailPath = `/${work.type}/${work.id}?lang=${displayLanguage}`;

  return (
    <Link to={detailPath} className="poem-card">
      <div className="poem-card__type">
        {t(work.type === 'prose' ? 'filter_prose' : `filter_${work.type}s`)}
      </div>
      <div className="poem-card__title-row">
        <h3 className="poem-card__title">{titleField.text}</h3>
        {showLanguageBadge && (
          <span className="poem-card__language" title={t('content_language_label')}>
            {t(`language_${displayLanguage}`)}
          </span>
        )}
      </div>
      <p className="poem-card__author">{authorName}</p>
      <p className="poem-card__preview">{previewField.text}</p>

      {work.tags && work.tags.length > 0 && (
        <div className="poem-card__tags">
          {work.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
      )}
    </Link>
  );
};

export default PoemCard;
