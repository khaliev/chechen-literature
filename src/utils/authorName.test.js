import { describe, it, expect } from 'vitest';
import { getAuthorName, getWorkAuthor } from './authorName.js';

describe('getAuthorName', () => {
  it('keeps Cyrillic for ce/ru', () => {
    expect(getAuthorName('Муса Гешаев', 'ce')).toBe('Муса Гешаев');
    expect(getAuthorName('Муса Гешаев', 'ru')).toBe('Муса Гешаев');
  });
  it('uses reviewed transcriptions for known authors', () => {
    expect(getAuthorName('Муса Гешаев', 'en')).toBe('Musa Geshayev');
    expect(getAuthorName('Муса Гешаев', 'fr')).toBe('Moussa Gechayev');
  });
  it('falls back to transliteration for unknown authors', () => {
    const en = getAuthorName('Тест Тестов', 'en');
    const fr = getAuthorName('Тест Тестов', 'fr');
    expect(en).toMatch(/Test/);
    expect(fr).toMatch(/Test/);
    expect(en).not.toMatch(/[А-Яа-я]/);
  });
  it('passes through falsy values', () => {
    expect(getAuthorName('', 'en')).toBe('');
  });
});

describe('getWorkAuthor', () => {
  it('reads work.author', () => {
    expect(getWorkAuthor({ author: 'Муса Гешаев' }, 'fr')).toBe('Moussa Gechayev');
  });
});
