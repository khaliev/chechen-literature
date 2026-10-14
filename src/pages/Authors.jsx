import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { getAuthorName } from '@/utils/authorName';
import { buildPageTitle, setPageTitle } from '@/utils/pageMeta';
import Input from '@/components/ui/Input';
import { catalogWorks } from '@/data/catalog';
import './Authors.css';

const SearchIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

export default function Authors() {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('count'); // 'count' | 'alphabetical'

  useEffect(() => {
    setPageTitle(buildPageTitle([t('nav_authors')], t('site_title')));
  }, [t]);

  const authorsList = useMemo(() => {
    const map = new Map();
    for (const work of catalogWorks) {
      if (!work.author) continue;
      if (!map.has(work.author)) {
        map.set(work.author, {
          canonical: work.author,
          displayName: getAuthorName(work.author, language),
          author_en: work.author_en,
          author_fr: work.author_fr,
          count: 0,
          poems: 0,
          songs: 0,
          prose: 0,
        });
      }
      const entry = map.get(work.author);
      entry.count += 1;
      if (work.type === 'poem') entry.poems += 1;
      else if (work.type === 'song') entry.songs += 1;
      else if (work.type === 'prose') entry.prose += 1;
    }

    let list = Array.from(map.values()).map((entry) => ({
      ...entry,
      displayName: getAuthorName(entry.canonical, language),
    }));

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (a) =>
          a.canonical.toLowerCase().includes(q) ||
          a.displayName.toLowerCase().includes(q) ||
          a.author_en?.toLowerCase().includes(q) ||
          a.author_fr?.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'alphabetical') {
      list.sort((a, b) => a.displayName.localeCompare(b.displayName));
    } else {
      list.sort((a, b) => b.count - a.count || a.displayName.localeCompare(b.displayName));
    }

    return list;
  }, [language, query, sortBy]);

  return (
    <div className="authors">
      <header className="authors__header">
        <h1 className="authors__title">{t('nav_authors')}</h1>
        <p className="authors__count">
          {authorsList.length} {t('authors_count_label')}
        </p>
      </header>

      <section className="authors__controls">
        <div className="authors__search">
          <Input
            icon={<SearchIcon />}
            placeholder={t('search_placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="authors__sort">
          <label className="authors__sort-label" htmlFor="authors-sort">
            {t('sort_label')}
          </label>
          <select
            id="authors-sort"
            className="authors__sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="count">{t('sort_by_works_count')}</option>
            <option value="alphabetical">{t('sort_alphabetical')}</option>
          </select>
        </div>
      </section>

      {authorsList.length > 0 ? (
        <div className="authors__grid">
          {authorsList.map((author) => (
            <Link
              key={author.canonical}
              to={`/author/${encodeURIComponent(author.canonical)}`}
              className="author-card"
            >
              <div className="author-card__header">
                <h2 className="author-card__name">{author.displayName}</h2>
                <span className="author-card__badge">{author.count}</span>
              </div>
              {author.displayName !== author.canonical && (
                <p className="author-card__original">{author.canonical}</p>
              )}
              <div className="author-card__breakdown">
                {author.poems > 0 && (
                  <span>
                    {author.poems} {t('filter_poems').toLowerCase()}
                  </span>
                )}
                {author.songs > 0 && (
                  <span>
                    {author.songs} {t('filter_songs').toLowerCase()}
                  </span>
                )}
                {author.prose > 0 && (
                  <span>
                    {author.prose} {t('filter_prose').toLowerCase()}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="authors__no-results">{t('search_no_results')}</p>
      )}
    </div>
  );
}
