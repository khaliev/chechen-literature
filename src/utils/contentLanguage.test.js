import { describe, it, expect } from 'vitest';
import {
  CONTENT_LANGUAGES,
  getAvailableContentLanguages,
  hasContentInLanguage,
  getPreferredContentLanguage,
} from './contentLanguage.js';

describe('getAvailableContentLanguages', () => {
  it('derives languages from non-empty text fields', () => {
    const work = { text: { ce: 'abc', ru: '  ', en: null, fr: 'x' } };
    expect(getAvailableContentLanguages(work)).toEqual(['ce', 'fr']);
  });

  it('honours an explicit available_languages list', () => {
    const work = { available_languages: ['ru', 'xx'], text: { ce: 'abc' } };
    expect(getAvailableContentLanguages(work)).toEqual(['ru']);
  });

  it('returns [] when nothing present', () => {
    expect(getAvailableContentLanguages({})).toEqual([]);
    expect(getAvailableContentLanguages(null)).toEqual([]);
  });
});

describe('hasContentInLanguage', () => {
  const work = { text: { ce: 'a', ru: 'b', en: null, fr: null } };
  it('matches exact language', () => {
    expect(hasContentInLanguage(work, 'ce')).toBe(true);
    expect(hasContentInLanguage(work, 'en')).toBe(false);
  });
  it("'all' is true when any language exists", () => {
    expect(hasContentInLanguage(work, 'all')).toBe(true);
    expect(hasContentInLanguage({}, 'all')).toBe(false);
  });
});

describe('getPreferredContentLanguage', () => {
  it('prefers the requested language when available', () => {
    const work = { text: { ce: 'a', ru: 'b', en: null, fr: null } };
    expect(getPreferredContentLanguage(work, 'ru')).toBe('ru');
  });
  it('falls back to the first available language', () => {
    const work = { text: { ce: '', ru: 'b', en: null, fr: null } };
    expect(getPreferredContentLanguage(work, 'ce')).toBe('ru');
  });
  it('never returns an unsupported language', () => {
    const work = { text: { ce: 'a', ru: null, en: null, fr: null } };
    expect(CONTENT_LANGUAGES).toContain(getPreferredContentLanguage(work, 'all'));
  });
});
