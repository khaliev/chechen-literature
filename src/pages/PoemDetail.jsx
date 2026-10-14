import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { getFieldInLanguage, getTranslatedField } from '@/utils/getTranslatedField';
import {
  CONTENT_LANGUAGES,
  getAvailableContentLanguages,
  getLanguageLabelKey,
  hasContentInLanguage,
} from '@/utils/contentLanguage';
import { findSimilarWorks } from '@/utils/searchUtils';
import { getWorkAuthor } from '@/utils/authorName';
import { buildPageTitle, setPageTitle } from '@/utils/pageMeta';
import SimilarWorks from '@/components/features/SimilarWorks';
import Tag from '@/components/ui/Tag';
import Button from '@/components/ui/Button';
import { catalogWorks, loadFullWorks } from '@/data/catalog';
import './PoemDetail.css';

export default function PoemDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const requestedContentLanguage = searchParams.get('lang');
  const initialContentLanguage = CONTENT_LANGUAGES.includes(requestedContentLanguage)
    ? requestedContentLanguage
    : language;
  const [contentLanguage, setContentLanguage] = useState(initialContentLanguage);
  const [showTranslation, setShowTranslation] = useState(false);
  const [shareState, setShareState] = useState('idle'); // 'idle' | 'shared' | 'copied'
  // Full texts are lazy-loaded (code-split) so catalog pages stay light.
  const [work, setWork] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setIsLoading(true);
    loadFullWorks().then(({ fullWorksById }) => {
      if (!alive) return;
      setWork(fullWorksById.get(id) || null);
      setIsLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [id]);
  const availableLanguages = useMemo(() => getAvailableContentLanguages(work), [work]);
  const activeText = getFieldInLanguage(work, 'text', contentLanguage);
  const titleLanguage = activeText.text
    ? contentLanguage
    : availableLanguages[0] || contentLanguage;
  const title = getFieldInLanguage(work, 'title', titleLanguage);
  const displayTitle = title.text ? title : getTranslatedField(work, 'title', titleLanguage);
  const translationLanguage = availableLanguages.find((lang) => lang !== contentLanguage);
  const translationText = translationLanguage
    ? getFieldInLanguage(work, 'text', translationLanguage)
    : { text: '', isFallback: false, language: null };

  const similarWorks = useMemo(() => {
    if (!work) return [];
    const languageWorks = catalogWorks.filter((catalogWork) =>
      hasContentInLanguage(catalogWork, language)
    );
    return findSimilarWorks(work, languageWorks);
  }, [work, language]);

  useEffect(() => {
    setContentLanguage(initialContentLanguage);
    setShowTranslation(false);
    setShareState('idle');
  }, [id, language, requestedContentLanguage]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: document.title, url });
        setShareState('shared');
      } catch {
        // Partage annulé par l'utilisateur : on ne change rien.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setShareState('copied');
    } catch {
      // Presse-papiers indisponible : on ne change rien.
    }
  };

  const displayTitleText = displayTitle.text;
  useEffect(() => {
    if (isLoading) {
      setPageTitle(t('site_title'));
    } else if (!work) {
      setPageTitle(buildPageTitle([t('page_not_found')], t('site_title')));
    } else {
      setPageTitle(
        buildPageTitle([displayTitleText, getWorkAuthor(work, language)], t('site_title'))
      );
    }
  }, [work, isLoading, id, language, displayTitleText, t]);

  if (isLoading) {
    return (
      <div className="poem-detail poem-detail--loading">
        <p>{t('loading')}</p>
      </div>
    );
  }

  if (!work) {
    return (
      <div className="poem-detail poem-detail--not-found">
        <h1>{t('page_not_found')}</h1>
        <Link to="/">{t('go_home')}</Link>
      </div>
    );
  }

  const languageLabel = t(getLanguageLabelKey(contentLanguage));
  const textUnavailableMessage = t('text_unavailable').replace('{language}', languageLabel);
  const authorName = getWorkAuthor(work, language);
  // Normalise les liens externes : les anciennes données utilisaient parfois
  // des chaînes brutes au lieu d'objets {label, url}. Les chaînes vides sont ignorées.
  const externalLinks = (work.external_links || [])
    .map((link) => {
      if (typeof link === 'string') {
        const url = link.trim();
        return url ? { label: url, url } : null;
      }
      if (link?.url?.trim()) return link;
      return null;
    })
    .filter(Boolean);

  return (
    <article className="poem-detail">
      {/* Canonical answer block for AI crawlers */}
      <div className="poem-detail__meta-block">
        <p>
          «{displayTitle.text}» —{' '}
          {work.type === 'poem'
            ? t('filter_poems').toLowerCase()
            : work.type === 'song'
              ? t('filter_songs').toLowerCase()
              : t('filter_prose').toLowerCase()}{' '}
          {t('author_label').toLowerCase()}: {authorName}
          {work.author_years && ` (${work.author_years})`}.
          {work.year_written && ` ${t('year_label')}: ${work.year_written}.`}
        </p>
      </div>

      <header className="poem-detail__header">
        <span className="poem-detail__type">
          {work.type === 'poem'
            ? t('filter_poems')
            : work.type === 'song'
              ? t('filter_songs')
              : t('filter_prose')}
        </span>
        <h1 className="poem-detail__title">{displayTitle.text}</h1>
        <span className="poem-detail__content-language">
          {t('content_language_label')}: {t(getLanguageLabelKey(titleLanguage))}
        </span>
        <div className="poem-detail__author-info">
          <Link className="poem-detail__author" to={`/author/${encodeURIComponent(work.author)}`}>
            {authorName}
          </Link>
          {work.author_years && <span className="poem-detail__years">({work.author_years})</span>}
        </div>
        {work.year_written && (
          <span className="poem-detail__year">
            {t('year_label')}: {work.year_written}
          </span>
        )}
      </header>

      <div className="poem-detail__actions">
        <Button variant="secondary" size="sm" onClick={handleShare}>
          {shareState === 'idle'
            ? t('share')
            : shareState === 'copied'
              ? `✓ ${t('link_copied')}`
              : `✓ ${t('share')}`}
        </Button>
      </div>

      {/* Tags */}
      {work.tags?.length > 0 && (
        <div className="poem-detail__tags">
          {work.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
      )}

      {/* Main text: never silently substitute another language. */}
      <div className="poem-detail__text">
        {activeText.text ? (
          <div
            className={`poem-detail__text-content${
              work.type === 'prose' ? ' poem-detail__text-content--prose' : ''
            }`}
          >
            {activeText.text.split('\n').map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </div>
        ) : (
          <div className="poem-detail__unavailable">
            <p className="poem-detail__fallback-notice">{textUnavailableMessage}</p>
            {availableLanguages.length > 0 && (
              <div className="poem-detail__available-languages">
                <span>{t('available_languages_label')}:</span>
                {availableLanguages.map((availableLanguage) => (
                  <Button
                    key={availableLanguage}
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setContentLanguage(availableLanguage);
                      setShowTranslation(false);
                    }}
                  >
                    {t(getLanguageLabelKey(availableLanguage))}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Translation toggle */}
      {activeText.text && translationText.text && (
        <div className="poem-detail__translation">
          <Button variant="secondary" onClick={() => setShowTranslation(!showTranslation)}>
            {showTranslation ? '▲ ' : '▼ '}
            {t('show_translation')} ({t(getLanguageLabelKey(translationLanguage))})
          </Button>
          {showTranslation && (
            <div
              className={`poem-detail__translation-text animate-fade-in${
                work.type === 'prose' ? ' poem-detail__translation-text--prose' : ''
              }`}
            >
              {translationText.text.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* External links */}
      {externalLinks.length > 0 && (
        <div className="poem-detail__links">
          <h3>{t('external_links')}</h3>
          <ul>
            {externalLinks.map((link, i) => (
              <li key={i}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.label || link.url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Source */}
      {work.source && (
        <p className="poem-detail__source">
          {t('source_label')}: {work.source}
        </p>
      )}

      {/* Similar works */}
      <SimilarWorks works={similarWorks} contentLanguage={language} />
    </article>
  );
}
