import indexData from './index.json';
import poemsData from './poems.json';
import songsData from './songs.json';
import proseData from './prose.json';
import { getAvailableContentLanguages, isPresentText } from '@/utils/contentLanguage';
import { getAuthorName } from '@/utils/authorName';

export const fullWorks = [...poemsData, ...songsData, ...proseData];

const fullWorksById = new Map(fullWorks.map((work) => [work.id, work]));

function makePreview(text) {
  if (!isPresentText(text)) return '';
  const firstLine =
    text
      .split('\n')
      .find((line) => line.trim())
      ?.trim() || '';
  return firstLine.length > 160 ? `${firstLine.slice(0, 157)}…` : firstLine;
}

/**
 * The index contains lightweight catalog records. Add derived availability and
 * language-correct previews without changing the source JSON records.
 */
export const catalogWorks = indexData.map((catalogWork) => {
  const fullWork = fullWorksById.get(catalogWork.id);
  if (!fullWork) {
    return { ...catalogWork, available_languages: [] };
  }

  const availableLanguages = getAvailableContentLanguages(fullWork);
  const textPreview = { ...(catalogWork.text_preview || {}) };

  // Some legacy previews were stored under `ce` even when the full text is
  // only Russian/English. Keep existing excerpts, but add a correct preview
  // for every language that has a full text.
  availableLanguages.forEach((language) => {
    if (!isPresentText(textPreview[language])) {
      textPreview[language] = makePreview(fullWork.text?.[language]);
    }
  });

  return {
    ...catalogWork,
    // Latin transcriptions of the author name, used for search and sorting
    // when the interface language is English or French.
    author_en: getAuthorName(catalogWork.author, 'en'),
    author_fr: getAuthorName(catalogWork.author, 'fr'),
    available_languages: availableLanguages,
    text_preview: textPreview,
  };
});

export { fullWorksById };
