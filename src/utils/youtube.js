/**
 * Extracts a YouTube video id from watch / youtu.be / embed / shorts URLs.
 * Returns null when the URL is not a recognizable YouTube link.
 */
export function getYouTubeId(url) {
  if (typeof url !== 'string') return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?[^#]*v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/
  );
  return match ? match[1] : null;
}

/** Privacy-enhanced embed URL (no cookies until playback). */
export function getYouTubeEmbedUrl(id) {
  return `https://www.youtube-nocookie.com/embed/${id}`;
}
