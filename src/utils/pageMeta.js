/**
 * Builds a document title like "Нана — Шайхи Арсанукаев — Нохчийн литература".
 * Pure function so it stays testable without a DOM.
 */
export function buildPageTitle(parts, siteTitle) {
  return [...parts, siteTitle].filter(Boolean).join(' — ');
}

/** Sets document.title, no-op outside the browser (tests, SSR). */
export function setPageTitle(title) {
  if (typeof document !== 'undefined') {
    document.title = title;
  }
}
