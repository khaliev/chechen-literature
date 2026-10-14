#!/usr/bin/env node
/**
 * generate-index.mjs — reconstruit src/data/index.json depuis la source unique :
 *   poems.json + songs.json + prose.json
 *
 * Garanties "ne casse rien" :
 *   - conserve l'ordre actuel d'index.json pour les ids existants
 *   - ajoute à la FIN les œuvres du full absentes de l'index (ordre des fichiers full)
 *   - supprime de l'index les ids sans full (orphelins) — ils doivent d'abord
 *     être archivés dans pending-restore.json (voir --dry-run pour auditer)
 *   - resynchronise title/author/tags/text_preview/available_languages depuis
 *     le full (normalise à 7 clés ; available_languages rend l'index
 *     autosuffisant pour le filtrage par langue, sans charger les textes)
 *
 * Usage:
 *   node scripts/generate-index.mjs --dry-run   -> audit sans écrire
 *   node scripts/generate-index.mjs             -> écrit index.json
 *   npm run generate-index
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '../src/data');
const DRY_RUN = process.argv.includes('--dry-run');

function load(name) {
  return JSON.parse(readFileSync(path.join(DATA_DIR, name), 'utf-8'));
}

const poems = load('poems.json');
const songs = load('songs.json');
const prose = load('prose.json');
const currentIndex = load('index.json');

const fullById = new Map([...poems, ...songs, ...prose].map((w) => [w.id, w]));
const indexById = new Map(currentIndex.map((w) => [w.id, w]));

const orphans = currentIndex.filter((w) => !fullById.has(w.id));
const missing = [...fullById.values()].filter((w) => !indexById.has(w.id));

const LANGS = ['ce', 'ru', 'en', 'fr'];
const isPresentText = (v) => typeof v === 'string' && v.trim().length > 0;

function makePreview(text) {
  if (!isPresentText(text)) return '';
  const firstLine =
    text
      .split('\n')
      .find((line) => line.trim())
      ?.trim() || '';
  return firstLine.length > 160 ? `${firstLine.slice(0, 157)}…` : firstLine;
}

function toIndexEntry(full) {
  const availableLanguages = LANGS.filter((lang) => isPresentText(full.text?.[lang]));
  const textPreview = { ...(full.text_preview || {}) };
  // Garantit un aperçu pour chaque langue disponible (même logique que
  // l'ancien backfill runtime de catalog.js, désormais figée à la génération).
  for (const lang of availableLanguages) {
    if (!isPresentText(textPreview[lang])) {
      textPreview[lang] = makePreview(full.text?.[lang]);
    }
  }
  return {
    id: full.id,
    type: full.type,
    title: full.title,
    author: full.author,
    tags: full.tags || [],
    text_preview: textPreview,
    available_languages: availableLanguages,
  };
}

// Ordre stable : ordre actuel de l'index (sans orphelins), puis nouveaux à la fin.
const next = [];
for (const entry of currentIndex) {
  const full = fullById.get(entry.id);
  if (full) next.push(toIndexEntry(full));
}
for (const full of [...poems, ...songs, ...prose]) {
  if (!indexById.has(full.id)) next.push(toIndexEntry(full));
}

console.log(
  `full total: ${fullById.size} | index actuel: ${currentIndex.length} | prochain: ${next.length}`
);
console.log(
  `orphelins (retirés de l'index): ${orphans.length}${orphans.length ? ' -> ' + orphans.map((w) => w.id).join(', ') : ''}`
);
console.log(
  `manquants (ajoutés à l'index): ${missing.length}${missing.length ? ' -> ' + missing.map((w) => w.id).join(', ') : ''}`
);

// Détecte les désynchronisations qui seront écrasées (titre/auteur/tags/preview)
let resync = 0;
for (const entry of next) {
  const old = indexById.get(entry.id);
  if (
    old &&
    JSON.stringify(old) !== JSON.stringify({ ...old, ...entry }) &&
    JSON.stringify({
      id: old.id,
      type: old.type,
      title: old.title,
      author: old.author,
      tags: old.tags,
      text_preview: old.text_preview,
      available_languages: old.available_languages,
    }) !== JSON.stringify(entry)
  ) {
    resync += 1;
  }
}
console.log(`entrées resynchronisées depuis le full: ${resync}`);

if (DRY_RUN) {
  console.log('(dry-run: index.json non modifié)');
  process.exit(0);
}

writeFileSync(path.join(DATA_DIR, 'index.json'), JSON.stringify(next, null, 2) + '\n', 'utf-8');
console.log('✅ index.json régénéré');
