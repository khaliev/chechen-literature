import indexData from './index.json';
import { getAuthorName } from '@/utils/authorName';

/**
 * Lightweight catalog: index.json is self-sufficient (titles, previews and
 * available_languages are frozen at generation time by generate-index).
 * Full texts (poems/songs/prose.json, ~1 Mo) are NOT bundled here — they are
 * lazy-loaded on demand by loadFullWorks() for work-detail pages.
 */
export const catalogWorks = indexData.map((catalogWork) => ({
  ...catalogWork,
  // Latin transcriptions of the author name, used for search and sorting
  // when the interface language is English or French.
  author_en: getAuthorName(catalogWork.author, 'en'),
  author_fr: getAuthorName(catalogWork.author, 'fr'),
}));

/**
 * Loads the full literary texts (code-split chunks, fetched once and cached).
 * Use on detail pages; catalog pages only need `catalogWorks`.
 */
let cache = null;
export async function loadFullWorks() {
  if (!cache) {
    const [poems, songs, prose] = await Promise.all([
      import('./poems.json').then((module) => module.default),
      import('./songs.json').then((module) => module.default),
      import('./prose.json').then((module) => module.default),
    ]);
    const fullWorks = [...poems, ...songs, ...prose];
    cache = { fullWorks, fullWorksById: new Map(fullWorks.map((work) => [work.id, work])) };
  }
  return cache;
}
