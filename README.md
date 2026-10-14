# Нохчийн литература / Chechen Literature Portal

Современный веб-портал для публикации чеченской поэзии (байташ), героических песен (иллеш) и прозы.
Доступен на 4 языках: чеченский, русский, английский, французский.

## Технологии

- React 18 + Vite
- React Router (клиентский роутинг)
- Fuse.js (fuzzy-поиск)
- CSS Custom Properties (тёмная/светлая тема)
- Bunny Fonts (Inter + Noto Serif)

## Запуск

```bash
npm install
npm run dev
```

Откройте http://localhost:5173

## Сборка для продакшена

```bash
npm run build
npm run preview
```

## Contrôles qualité (P1)

```bash
npm run validate-data   # cohérence index.json ↔ poems/songs/prose.json
npm run lint            # ESLint (JS/JSX + scripts)
npm run format:check    # Prettier (check) / npm run format (write)
npm run test            # Vitest (30 tests : utils + intégrité données)
npm run check           # validate-data + lint + test
```

La CI GitHub Actions (`.github/workflows/ci.yml`) lance `validate-data`,
`lint`, `test` et `build` à chaque push sur `main` et chaque PR.

## Как добавить новое произведение

1. Откройте файл `src/data/poems.json` (или `songs.json` / `prose.json`)
2. Добавьте новый объект по образцу существующих:

```json
{
  "id": "unique-slug",
  "type": "poem",
  "title": { "ce": "Цlе", "ru": "Название", "en": null, "fr": null },
  "author": "Имя автора",
  "author_years": "1930–2012",
  "year_written": null,
  "tags": ["тег1", "тег2"],
  "text": { "ce": "Текст стиха...", "ru": null, "en": null, "fr": null },
  "text_preview": { "ce": "Первые 2 строки..." },
  "external_links": [],
  "source": "Источник",
  "date_added": "2026-08-03"
}
```

3. Régénérez le catalogue léger (source unique = fichiers full) puis validez :

```bash
npm run generate-index
npm run validate-data
```

> `src/data/index.json` n'est plus édité à la main : il est généré depuis
> `poems.json` / `songs.json` / `prose.json` (ordre existant conservé, nouvelles
> œuvres ajoutées à la fin). `npm run build` lance aussi `validate-data`.
> Les entrées d'index sans texte plein sont archivées dans
> `src/data/pending-restore.json` en attente de restauration.

## Author name transliteration (EN / FR)

Author names are stored in Chechen Cyrillic (`"author"`), because that is the
canonical spelling of the archive. When the interface language is English or
French, the UI renders them in Latin script so they can be read and
pronounced:

| Чеченский (data) | English             | Français             |
| ---------------- | ------------------- | -------------------- |
| Муса Гешаев      | Musa Geshayev       | Moussa Gechayev      |
| Раиса Ахматова   | Raisa Akhmatova     | Raissa Akhmatova     |
| Шайхи Арсанукаев | Shaikhi Arsanukayev | Chaikhi Arsanoukayev |

The reviewed transcriptions live in `src/utils/authorName.js`
(`AUTHOR_NAMES`, keyed by the Cyrillic name). Every new author must be added
there; until then, a fallback transliteration (same rules: `у → u/ou`,
`ш → sh/ch`, `ч → ch/tch`, `е` after a vowel → `yev` glide, etc.) is applied
automatically. Chechen and Russian keep the original Cyrillic name.

Search and author sorting also use these Latin forms when the interface is in
English or French (`author_en` / `author_fr` derived in `src/data/catalog.js`).

## Как добавить перевод

1. Найдите произведение в JSON-файле
2. Заполните `null`-поля нужного языка в полях `title`, `text`, `text_preview`:

```json
"title": { "ce": "Нана", "ru": "Мать", "en": "Mother", "fr": "Mère" }
```

## Как добавить новый язык интерфейса

1. Создайте файл `src/locales/xx.json` (скопируйте `en.json` как шаблон)
2. Переведите все строки
3. Добавьте код языка в массив `LANGUAGES` в `src/context/LanguageContext.jsx`
4. Импортируйте файл в `src/hooks/useTranslation.js`
5. Добавьте флаг в `src/assets/flags/` и обновите `LanguageSwitcher.jsx`

## Деплой на GitHub Pages

1. В `vite.config.js` установите `base: '/repository-name/'`
2. Запустите `npm run build`
3. Содержимое папки `dist/` задеплойте на GitHub Pages

## Sitemap et SEO

- Chaque page définit son `document.title` (`src/utils/pageMeta.js`) : œuvre —
  auteur — site, section — site, 404 — site.
- `public/robots.txt` est committé (pensez à y mettre l'URL absolue du
  sitemap une fois le domaine connu).
- `public/sitemap.xml` est **généré** (git-ignoré), jamais committé :

```bash
npm run generate-sitemap -- --site-url=https://votre-domaine.com
```

Relancez-le avant chaque déploiement important (nouvelles œuvres = nouvelles
URLs : `/`, `/category/*`, `/author/*`, `/poem|song|prose/:id`).

## Pages et fonctionnalités (P3)

- **Page auteur** `/author/:slug` (slug = nom cyrillique encodé) : toutes les
  œuvres d'un auteur, avec recherche et pagination. Liée depuis le nom
  d'auteur de chaque page d'œuvre.
- **Partage** sur chaque œuvre : Web Share API sur mobile, copie du lien dans
  le presse-papiers sur desktop.
- **Vidéos YouTube** : les liens YouTube des `external_links` sont affichés en
  lecteur embarqué (`youtube-nocookie`, chargement paresseux) ; les autres
  liens restent une liste classique. Les URLs `placeholder` sont rejetées par
  `npm run validate-data`.
- **Impression** : `@media print` dans `globals.css` (texte seul, sans
  navigation ni widgets).

## Лицензия

MIT
