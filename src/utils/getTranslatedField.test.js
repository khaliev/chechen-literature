import { describe, it, expect } from 'vitest';
import { getFieldInLanguage, getTranslatedField } from './getTranslatedField.js';

const item = {
  title: { ce: 'Нана', ru: 'Мать', en: null, fr: '' },
};

describe('getFieldInLanguage (strict, for literary text)', () => {
  it('returns the exact language without fallback', () => {
    expect(getFieldInLanguage(item, 'title', 'ru')).toMatchObject({
      text: 'Мать',
      isFallback: false,
    });
  });
  it('never substitutes another language', () => {
    expect(getFieldInLanguage(item, 'title', 'en')).toMatchObject({
      text: '',
      isFallback: true,
    });
  });
  it('treats blank strings as missing', () => {
    expect(getFieldInLanguage(item, 'title', 'fr').text).toBe('');
  });
});

describe('getTranslatedField (metadata fallback chain)', () => {
  it('falls back to Chechen then to any language', () => {
    expect(getTranslatedField(item, 'title', 'en').text).toBe('Нана');
    expect(getTranslatedField({ title: { en: 'Hi' } }, 'title', 'ru').text).toBe('Hi');
  });
  it('returns empty for missing fields', () => {
    expect(getTranslatedField({}, 'title', 'ce').text).toBe('');
  });
});
