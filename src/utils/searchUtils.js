import Fuse from 'fuse.js';
import { getAvailableContentLanguages, hasContentInLanguage } from './contentLanguage';
import { getAuthorName } from './authorName';

/**
 * Fuse.js configuration for searching literary works.
 * Searches across titles (all languages), author names, tags, and text previews.
 * Weights prioritize title and author matches over text content.
 */
export const FUSE_OPTIONS = {
  keys: [
    { name: 'title.ce', weight: 2.0 },
    { name: 'title.ru', weight: 2.0 },
    { name: 'title.en', weight: 2.0 },
    { name: 'title.fr', weight: 2.0 },
    { name: 'author', weight: 1.5 },
    { name: 'author_en', weight: 1.5 },
    { name: 'author_fr', weight: 1.5 },
    { name: 'tags', weight: 1.0 },
    { name: 'text_preview.ce', weight: 0.5 },
    { name: 'text_preview.ru', weight: 0.5 },
    { name: 'text_preview.en', weight: 0.5 },
    { name: 'text_preview.fr', weight: 0.5 },
  ],
  threshold: 0.4, // Allows fuzzy matching with typos
  includeScore: true,
  minMatchCharLength: 2,
};

/**
 * Creates a new Fuse.js search instance with the given works data.
 */
export function createSearchIndex(works) {
  return new Fuse(works, FUSE_OPTIONS);
}

/**
 * Filters works by the language of their full text.
 * `all` is an explicit opt-in for the multilingual catalog view.
 */
export function filterByContentLanguage(works, language) {
  if (!language) return works;
  return works.filter((work) => hasContentInLanguage(work, language));
}

/**
 * Filters works by type (poem, song, prose).
 * Returns all works if typeFilter is null or 'all'.
 */
export function filterByType(works, typeFilter) {
  if (!typeFilter || typeFilter === 'all') return works;
  return works.filter((w) => w.type === typeFilter);
}

/**
 * Filters works by tags. A work matches if it has ANY of the selected tags.
 * Returns all works if selectedTags is empty.
 */
export function filterByTags(works, selectedTags) {
  if (!selectedTags || selectedTags.length === 0) return works;
  return works.filter((w) => w.tags?.some((tag) => selectedTags.includes(tag)));
}

/**
 * Sorts works by the given criteria.
 * @param {Array} works
 * @param {string} sortBy - 'alphabetical' | 'author' | 'date' | 'language'
 * @param {string} lang - Current language for title sorting
 */
export function sortWorks(works, sortBy, lang = 'ce') {
  const sorted = [...works];
  switch (sortBy) {
    case 'alphabetical':
      return sorted.sort((a, b) => {
        const titleA = a.title?.[lang] || a.title?.ce || '';
        const titleB = b.title?.[lang] || b.title?.ce || '';
        return titleA.localeCompare(titleB);
      });
    case 'author':
      return sorted.sort((a, b) => {
        const authorA = getAuthorName(a.author, lang) || '';
        const authorB = getAuthorName(b.author, lang) || '';
        return authorA.localeCompare(authorB);
      });
    case 'language': {
      const languageOrder = ['ce', 'ru', 'en', 'fr'];
      const getTextLanguage = (work) => {
        const availableLanguages = getAvailableContentLanguages(work);
        if (lang !== 'all' && availableLanguages.includes(lang)) return lang;
        return availableLanguages[0] || '';
      };

      return sorted.sort((a, b) => {
        const languageA = getTextLanguage(a);
        const languageB = getTextLanguage(b);
        const languageDifference =
          languageOrder.indexOf(languageA) - languageOrder.indexOf(languageB);

        if (languageDifference !== 0) return languageDifference;

        const titleLanguage = lang === 'all' ? languageA : lang;
        const titleA = a.title?.[titleLanguage] || a.title?.ce || '';
        const titleB = b.title?.[titleLanguage] || b.title?.ce || '';
        return titleA.localeCompare(titleB);
      });
    }
    case 'date':
      return sorted.sort((a, b) => new Date(b.date_added || 0) - new Date(a.date_added || 0));
    default:
      return sorted;
  }
}

/**
 * Extracts all unique tags from a list of works, sorted alphabetically.
 * The order is stable across page loads (no shuffle) so the tag cloud
 * is predictable for users and tests.
 */
export function getAllTags(works) {
  const tagSet = new Set();
  works.forEach((w) => w.tags?.forEach((tag) => tagSet.add(tag)));
  return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
}

/**
 * Finds works similar to the given work based on shared tags.
 * Returns up to `limit` works, excluding the current one.
 */
export function findSimilarWorks(currentWork, allWorks, limit = 4) {
  if (!currentWork?.tags?.length) return [];

  return allWorks
    .filter((w) => w.id !== currentWork.id)
    .map((w) => ({
      ...w,
      // Score = number of shared tags
      similarityScore: w.tags?.filter((t) => currentWork.tags.includes(t)).length || 0,
    }))
    .filter((w) => w.similarityScore > 0)
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit);
}
