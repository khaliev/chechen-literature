import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
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

const FONT_SCALES = [0.9, 1, 1.15, 1.3];
const DEFAULT_SCALE_INDEX = 1;

function getInitialScaleIndex() {
  try {
    const saved = Number(localStorage.getItem('reading_font_scale'));
    if (Number.isInteger(saved) && saved >= 0 && saved < FONT_SCALES.length) {
      return saved;
    }
  } catch {
    // Ignore localStorage errors
  }
  return DEFAULT_SCALE_INDEX;
}

function renderLiteraryText(text, type) {
  if (!text) return null;
  const blocks = text.split(/\n{2,}/);
  const blockClass = type === 'prose' ? 'poem-detail__paragraph' : 'poem-detail__stanza';
  return blocks.map((block, i) => (
    <p key={i} className={blockClass}>
      {block}
    </p>
  ));
}

export default function PoemDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const requestedContentLanguage = searchParams.get('lang');
  const initialContentLanguage = CONTENT_LANGUAGES.includes(requestedContentLanguage)
    ? requestedContentLanguage
    : language;
  const [contentLanguage, setContentLanguage] = useState(initialContentLanguage);
  const [translationMode, setTranslationMode] = useState('none'); // 'none' | 'parallel' | 'below'
  const [selectedTranslationLang, setSelectedTranslationLang] = useState(null);
  const [fontScaleIndex, setFontScaleIndex] = useState(getInitialScaleIndex);
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

  const otherLanguages = useMemo(
    () => availableLanguages.filter((lang) => lang !== contentLanguage),
    [availableLanguages, contentLanguage]
  );

  const translationLanguage = useMemo(() => {
    if (selectedTranslationLang && otherLanguages.includes(selectedTranslationLang)) {
      return selectedTranslationLang;
    }
    if (otherLanguages.includes(language)) return language;
    return otherLanguages[0] || null;
  }, [selectedTranslationLang, otherLanguages, language]);

  const translationText = translationLanguage
    ? getFieldInLanguage(work, 'text', translationLanguage)
    : { text: '', isFallback: false, language: null };
  const translationTitle = translationLanguage
    ? getFieldInLanguage(work, 'title', translationLanguage)
    : { text: '' };

  const similarWorks = useMemo(() => {
    if (!work) return [];
    const languageWorks = catalogWorks.filter((catalogWork) =>
      hasContentInLanguage(catalogWork, language)
    );
    return findSimilarWorks(work, languageWorks);
  }, [work, language]);

  useEffect(() => {
    setContentLanguage(initialContentLanguage);
    setTranslationMode('none');
    setSelectedTranslationLang(null);
    setShareState('idle');
  }, [id, language, requestedContentLanguage]);

  const updateFontScale = (nextIndex) => {
    const clamped = Math.max(0, Math.min(FONT_SCALES.length - 1, nextIndex));
    setFontScaleIndex(clamped);
    try {
      localStorage.setItem('reading_font_scale', String(clamped));
    } catch {
      // Ignore localStorage errors
    }
  };

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

  const isParallel = translationMode === 'parallel' && activeText.text && translationText.text;
  const fontScale = FONT_SCALES[fontScaleIndex] || 1;

  return (
    <article
      className={`poem-detail${isParallel ? ' poem-detail--parallel' : ''}`}
      style={{ '--reading-scale': fontScale }}
    >
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
        <div className="poem-detail__font-controls" role="group" aria-label={t('font_size_label')}>
          <button
            type="button"
            className="poem-detail__font-btn"
            onClick={() => updateFontScale(fontScaleIndex - 1)}
            disabled={fontScaleIndex === 0}
            aria-label={t('font_size_decrease')}
            title={t('font_size_decrease')}
          >
            A−
          </button>
          <button
            type="button"
            className="poem-detail__font-btn"
            onClick={() => updateFontScale(fontScaleIndex + 1)}
            disabled={fontScaleIndex === FONT_SCALES.length - 1}
            aria-label={t('font_size_increase')}
            title={t('font_size_increase')}
          >
            A+
          </button>
        </div>

        {availableLanguages.length > 1 && activeText.text && (
          <div className="poem-detail__lang-pills">
            {availableLanguages.map((lang) => (
              <button
                key={lang}
                type="button"
                className={`poem-detail__lang-pill${lang === contentLanguage ? ' active' : ''}`}
                onClick={() => {
                  setContentLanguage(lang);
                  if (selectedTranslationLang === lang) {
                    setSelectedTranslationLang(null);
                  }
                }}
              >
                {t(getLanguageLabelKey(lang))}
              </button>
            ))}
          </div>
        )}

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
            <Tag
              key={tag}
              label={tag}
              onClick={() => navigate(`/?tag=${encodeURIComponent(tag)}`)}
            />
          ))}
        </div>
      )}

      {/* Translation mode controls */}
      {activeText.text && translationText.text && (
        <div className="poem-detail__translation-controls">
          <Button
            variant={translationMode === 'parallel' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setTranslationMode(translationMode === 'parallel' ? 'none' : 'parallel')}
          >
            ⇄ {t('parallel_view')} ({t(getLanguageLabelKey(translationLanguage))})
          </Button>
          <Button
            variant={translationMode === 'below' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setTranslationMode(translationMode === 'below' ? 'none' : 'below')}
          >
            {translationMode === 'below' ? '▲ ' : '▼ '}
            {t('show_translation')} ({t(getLanguageLabelKey(translationLanguage))})
          </Button>
          {otherLanguages.length > 1 && translationMode !== 'none' && (
            <select
              className="poem-detail__translation-select"
              value={translationLanguage}
              onChange={(e) => setSelectedTranslationLang(e.target.value)}
              aria-label={t('available_languages_label')}
            >
              {otherLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {t(getLanguageLabelKey(lang))}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Main text (or parallel side-by-side view) */}
      <div className={`poem-detail__text${isParallel ? ' poem-detail__text--parallel' : ''}`}>
        {activeText.text ? (
          isParallel ? (
            <div className="poem-detail__parallel-grid animate-fade-in">
              <div className="poem-detail__parallel-col">
                <div className="poem-detail__parallel-header">
                  <span className="poem-detail__parallel-lang">
                    {t(getLanguageLabelKey(contentLanguage))}
                  </span>
                  {displayTitle.text && (
                    <h2 className="poem-detail__parallel-title">{displayTitle.text}</h2>
                  )}
                </div>
                <div
                  className={`poem-detail__text-content${
                    work.type === 'prose' ? ' poem-detail__text-content--prose' : ''
                  }`}
                >
                  {renderLiteraryText(activeText.text, work.type)}
                </div>
              </div>

              <div className="poem-detail__parallel-col poem-detail__parallel-col--translation">
                <div className="poem-detail__parallel-header">
                  <span className="poem-detail__parallel-lang">
                    {t(getLanguageLabelKey(translationLanguage))}
                  </span>
                  {translationTitle.text && (
                    <h2 className="poem-detail__parallel-title">{translationTitle.text}</h2>
                  )}
                </div>
                <div
                  className={`poem-detail__translation-text${
                    work.type === 'prose' ? ' poem-detail__translation-text--prose' : ''
                  }`}
                >
                  {renderLiteraryText(translationText.text, work.type)}
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`poem-detail__text-content${
                work.type === 'prose' ? ' poem-detail__text-content--prose' : ''
              }`}
            >
              {renderLiteraryText(activeText.text, work.type)}
            </div>
          )
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
                      setTranslationMode('none');
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

      {/* Below translation view */}
      {activeText.text && translationText.text && translationMode === 'below' && (
        <div className="poem-detail__translation animate-fade-in">
          {translationTitle.text && (
            <h2 className="poem-detail__translation-heading">{translationTitle.text}</h2>
          )}
          <div
            className={`poem-detail__translation-text${
              work.type === 'prose' ? ' poem-detail__translation-text--prose' : ''
            }`}
          >
            {renderLiteraryText(translationText.text, work.type)}
          </div>
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
