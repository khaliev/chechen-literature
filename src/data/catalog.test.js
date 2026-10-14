import { describe, it, expect } from 'vitest';
import { catalogWorks, loadFullWorks } from './catalog.js';

describe('catalogWorks (lightweight, index-only)', () => {
  it('exposes all indexed works with derived author names', () => {
    expect(catalogWorks.length).toBe(291);
    const nana = catalogWorks.find((w) => w.id === 'nana');
    expect(nana.author_en).toBe('Shaikhi Arsanukayev');
    expect(nana.available_languages).toContain('ce');
  });
});

describe('loadFullWorks (lazy full texts)', () => {
  it('loads every full record and indexes by id', async () => {
    const { fullWorks, fullWorksById } = await loadFullWorks();
    expect(fullWorks.length).toBe(291);
    expect(fullWorksById.get('nana').text.ce).toMatch(/Нана/);
  });
  it('returns the cached instance on subsequent calls', async () => {
    const first = await loadFullWorks();
    expect(await loadFullWorks()).toBe(first);
  });
});
