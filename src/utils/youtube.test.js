import { describe, it, expect } from 'vitest';
import { getYouTubeId, getYouTubeEmbedUrl } from './youtube.js';

describe('getYouTubeId', () => {
  it('parses youtu.be links', () => {
    expect(getYouTubeId('https://youtu.be/Cj8-AwUSVyg')).toBe('Cj8-AwUSVyg');
  });
  it('parses watch URLs with extra params', () => {
    expect(getYouTubeId('https://www.youtube.com/watch?v=Cj8-AwUSVyg&t=30s')).toBe('Cj8-AwUSVyg');
  });
  it('parses embed and shorts URLs', () => {
    expect(getYouTubeId('https://www.youtube.com/embed/Cj8-AwUSVyg')).toBe('Cj8-AwUSVyg');
    expect(getYouTubeId('https://www.youtube.com/shorts/Cj8-AwUSVyg')).toBe('Cj8-AwUSVyg');
  });
  it('returns null for non-YouTube or malformed URLs', () => {
    expect(getYouTubeId('https://example.com/video')).toBe(null);
    expect(getYouTubeId('https://www.youtube.com/watch')).toBe(null);
    expect(getYouTubeId('')).toBe(null);
    expect(getYouTubeId(null)).toBe(null);
  });
});

describe('getYouTubeEmbedUrl', () => {
  it('uses the nocookie domain', () => {
    expect(getYouTubeEmbedUrl('Cj8-AwUSVyg')).toBe(
      'https://www.youtube-nocookie.com/embed/Cj8-AwUSVyg'
    );
  });
});
