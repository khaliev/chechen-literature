import { describe, it, expect } from 'vitest';
import { buildPageTitle, setPageTitle } from './pageMeta.js';

describe('buildPageTitle', () => {
  it('joins parts with the site title', () => {
    expect(buildPageTitle(['Нана', 'Шайхи Арсанукаев'], 'Нохчийн литература')).toBe(
      'Нана — Шайхи Арсанукаев — Нохчийн литература'
    );
  });
  it('skips empty parts', () => {
    expect(buildPageTitle(['', null, 'Home'], 'Site')).toBe('Home — Site');
    expect(buildPageTitle([], 'Site')).toBe('Site');
  });
});

describe('setPageTitle', () => {
  it('is a no-op without a DOM', () => {
    expect(() => setPageTitle('x')).not.toThrow();
  });
});
