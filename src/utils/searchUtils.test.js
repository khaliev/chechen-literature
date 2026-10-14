import { describe, it, expect } from 'vitest';
import {
  createSearchIndex,
  filterByType,
  filterByTags,
  sortWorks,
  getAllTags,
  findSimilarWorks,
} from './searchUtils.js';

const works = [
  {
    id: 'a',
    type: 'poem',
    title: { ce: 'Бана' },
    author: 'Б Автор',
    tags: ['x', 'y'],
    date_added: '2026-01-02',
  },
  {
    id: 'b',
    type: 'song',
    title: { ce: 'Айра' },
    author: 'А Автор',
    tags: ['y', 'z'],
    date_added: '2026-03-01',
  },
  { id: 'c', type: 'poem', title: { ce: 'Веда' }, author: 'В Автор', tags: [], date_added: null },
];

describe('filters', () => {
  it('filterByType keeps all on "all"', () => {
    expect(filterByType(works, 'all')).toHaveLength(3);
    expect(filterByType(works, 'poem').map((w) => w.id)).toEqual(['a', 'c']);
  });
  it('filterByTags matches ANY tag', () => {
    expect(filterByTags(works, []).map((w) => w.id)).toEqual(['a', 'b', 'c']);
    expect(filterByTags(works, ['z']).map((w) => w.id)).toEqual(['b']);
    expect(filterByTags(works, ['y']).map((w) => w.id)).toEqual(['a', 'b']);
  });
});

describe('sortWorks', () => {
  it('sorts by date desc', () => {
    expect(sortWorks(works, 'date').map((w) => w.id)[0]).toBe('b');
  });
  it('does not mutate the input', () => {
    const copy = [...works];
    sortWorks(works, 'alphabetical');
    expect(works.map((w) => w.id)).toEqual(copy.map((w) => w.id));
  });
});

describe('getAllTags', () => {
  it('returns unique tags in stable alphabetical order', () => {
    expect(getAllTags(works)).toEqual(['x', 'y', 'z']);
    expect(getAllTags(works)).toEqual(getAllTags(works));
  });
});

describe('findSimilarWorks', () => {
  it('ranks by shared tags and excludes self', () => {
    const res = findSimilarWorks(works[0], works);
    expect(res.map((w) => w.id)).toEqual(['b']);
    expect(findSimilarWorks(works[2], works)).toEqual([]);
  });
});

describe('createSearchIndex', () => {
  it('finds by title', () => {
    const idx = createSearchIndex(works);
    const hits = idx.search('Айра').map((r) => r.item.id);
    expect(hits).toContain('b');
  });
});
