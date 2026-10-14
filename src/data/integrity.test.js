import { describe, it, expect } from 'vitest';
import indexData from './index.json';
import poemsData from './poems.json';
import songsData from './songs.json';
import proseData from './prose.json';

// Miroir allégé de scripts/validate-data.mjs : protège la règle P0
// "index.json est généré depuis le full, jamais édité à la main".
describe('data integrity (P0 guardrail)', () => {
  const full = [...poemsData, ...songsData, ...proseData];
  const fullIds = new Set(full.map((w) => w.id));
  const indexIds = new Set(indexData.map((w) => w.id));

  it('every index entry has a full record (no orphans)', () => {
    const orphans = indexData.filter((w) => !fullIds.has(w.id)).map((w) => w.id);
    expect(orphans).toEqual([]);
  });

  it('every full record is in the index (no missing)', () => {
    const missing = full.filter((w) => !indexIds.has(w.id)).map((w) => w.id);
    expect(missing).toEqual([]);
  });

  it('ids are unique in full and index', () => {
    expect(fullIds.size).toBe(full.length);
    expect(indexIds.size).toBe(indexData.length);
  });

  it('every full record has text in at least one language', () => {
    const empty = full
      .filter((w) => !['ce', 'ru', 'en', 'fr'].some((l) => w.text?.[l]?.trim()))
      .map((w) => w.id);
    expect(empty).toEqual([]);
  });

  it('external_links entries are objects with url (no legacy strings)', () => {
    const bad = [];
    for (const w of full) {
      for (const l of w.external_links || []) {
        if (typeof l === 'string' || !l?.url?.trim()) bad.push(w.id);
      }
    }
    expect(bad).toEqual([]);
  });
});
