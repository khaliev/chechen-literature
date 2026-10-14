#!/usr/bin/env node
/**
 * validate-data.mjs — garde-fou P0, 100% lecture seule.
 *
 * Vérifie la cohérence entre :
 *   src/data/poems.json + songs.json + prose.json  (source de vérité)
 *   src/data/index.json                            (catalogue léger)
 *
 * Usage:
 *   node scripts/validate-data.mjs        -> exit 0 si OK, 1 sinon
 *   npm run validate-data
 *
 * Ne modifie AUCUN fichier.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '../src/data');
const LANGS = ['ce', 'ru', 'en', 'fr'];
const TYPES = ['poem', 'song', 'prose'];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

let errors = [];
let warnings = [];

function load(name) {
  const raw = readFileSync(path.join(DATA_DIR, name), 'utf-8');
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) {
    errors.push(`${name}: la racine doit être un tableau JSON`);
    return [];
  }
  return data;
}

function isPresent(v) {
  return typeof v === 'string' ? v.trim().length > 0 : v !== null && v !== undefined;
}

function checkFullFile(name, works, seenIds) {
  works.forEach((w, i) => {
    const where = `${name}[${i}] (id=${w?.id ?? '?'})`;
    if (!w.id || typeof w.id !== 'string') errors.push(`${where}: "id" manquant ou non-string`);
    else {
      if (seenIds.has(w.id)) errors.push(`${where}: id dupliqué "${w.id}"`);
      seenIds.set(w.id, name);
    }
    if (!TYPES.includes(w.type))
      errors.push(`${where}: "type" invalide (${JSON.stringify(w.type)})`);
    if (!w.author || typeof w.author !== 'string') errors.push(`${where}: "author" manquant`);
    for (const f of ['title', 'text', 'text_preview']) {
      if (!w[f] || typeof w[f] !== 'object') {
        errors.push(`${where}: "${f}" manquant ou non-objet`);
        continue;
      }
      for (const lang of Object.keys(w[f])) {
        if (!LANGS.includes(lang))
          warnings.push(`${where}: "${f}" a une clé de langue inattendue "${lang}"`);
      }
    }
    const hasText = LANGS.some((l) => isPresent(w.text?.[l]));
    if (!hasText) errors.push(`${where}: aucun texte plein dans aucune langue`);
    const hasPreview = LANGS.some((l) => isPresent(w.text_preview?.[l]));
    if (!hasPreview) warnings.push(`${where}: aucun text_preview (la carte sera vide)`);
    if (w.date_added && !DATE_RE.test(w.date_added)) {
      errors.push(`${where}: "date_added" doit être YYYY-MM-DD (${JSON.stringify(w.date_added)})`);
    }
    if (w.external_links !== undefined) {
      if (!Array.isArray(w.external_links))
        errors.push(`${where}: "external_links" doit être un tableau`);
      else {
        w.external_links.forEach((l, j) => {
          if (typeof l === 'string') {
            if (!l.trim()) errors.push(`${where}: external_links[${j}] est une chaîne vide`);
            else
              warnings.push(
                `${where}: external_links[${j}] est une chaîne legacy, convertir en {label, url}`
              );
            return;
          }
          if (!l?.url || typeof l.url !== 'string' || !l.url.trim()) {
            errors.push(`${where}: external_links[${j}].url manquant`);
          } else if (/placeholder|example\.com|xxx/i.test(l.url)) {
            errors.push(`${where}: external_links[${j}].url est un placeholder (${l.url})`);
          }
        });
      }
    }
  });
}

const poems = load('poems.json');
const songs = load('songs.json');
const prose = load('prose.json');
const index = load('index.json');

const seenIds = new Map();
checkFullFile('poems.json', poems, seenIds);
checkFullFile('songs.json', songs, seenIds);
checkFullFile('prose.json', prose, seenIds);

const fullById = new Map([...poems, ...songs, ...prose].map((w) => [w.id, w]));

// --- Contrôles index ---
const indexIds = new Set();
index.forEach((w, i) => {
  const where = `index.json[${i}] (id=${w?.id ?? '?'})`;
  if (!w.id) {
    errors.push(`${where}: "id" manquant`);
    return;
  }
  if (indexIds.has(w.id)) errors.push(`${where}: id dupliqué dans index.json "${w.id}"`);
  indexIds.add(w.id);
  if (!TYPES.includes(w.type)) errors.push(`${where}: "type" invalide`);
  // Schéma attendu du catalogue léger : exactement ces 7 clés.
  // available_languages rend l'index autosuffisant pour le filtrage par langue
  // (les textes pleins sont chargés à la demande sur les pages d'œuvres).
  const expected = ['author', 'available_languages', 'id', 'tags', 'text_preview', 'title', 'type']
    .sort()
    .join(',');
  const actual = Object.keys(w).sort().join(',');
  if (actual !== expected) {
    warnings.push(
      `${where}: clés inattendues (attendu id/type/title/author/tags/text_preview/available_languages, trouvé: ${Object.keys(w).sort().join(',')})`
    );
  }
  if (!fullById.has(w.id)) {
    errors.push(
      `${where}: ORPHELIN — présent dans index.json mais absent de poems/songs/prose.json`
    );
  } else {
    const full = fullById.get(w.id);
    if (full.type !== w.type) errors.push(`${where}: type "${w.type}" != full "${full.type}"`);
    if (full.author !== w.author)
      warnings.push(
        `${where}: author désynchronisé (index=${JSON.stringify(w.author)} full=${JSON.stringify(full.author)})`
      );
    const derived = LANGS.filter((lang) => isPresent(full.text?.[lang]));
    if (JSON.stringify(w.available_languages) !== JSON.stringify(derived)) {
      errors.push(
        `${where}: available_languages désynchronisé (index=${JSON.stringify(w.available_languages)} full=${JSON.stringify(derived)}) — relancez generate-index`
      );
    }
    for (const lang of derived) {
      if (!isPresent(w.text_preview?.[lang])) {
        errors.push(
          `${where}: text_preview manquant pour "${lang}" (texte plein disponible) — relancez generate-index`
        );
      }
    }
  }
});

for (const [id] of fullById) {
  if (!indexIds.has(id))
    errors.push(`index.json: MANQUANT — "${id}" existe dans le full mais pas dans le catalogue`);
}

// --- Couverture ---
const cov = Object.fromEntries(LANGS.map((l) => [l, 0]));
for (const w of fullById.values()) {
  for (const l of LANGS) if (isPresent(w.text?.[l])) cov[l] += 1;
}

console.log(
  `full: poems=${poems.length} songs=${songs.length} prose=${prose.length} total=${fullById.size}`
);
console.log(`index: ${index.length}`);
console.log(`couverture texte plein: ${LANGS.map((l) => `${l}=${cov[l]}`).join(' ')}`);

if (warnings.length) {
  console.log(`\n⚠ ${warnings.length} avertissement(s):`);
  for (const w of warnings) console.log(`  - ${w}`);
}
if (errors.length) {
  console.log(`\n❌ ${errors.length} erreur(s):`);
  for (const e of errors) console.log(`  - ${e}`);
  process.exit(1);
}
console.log('\n✅ données cohérentes');
