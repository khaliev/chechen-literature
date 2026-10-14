# Relecture tchétchène requise (clés ajoutées en P2/P3/P4)

Les traductions tchétchènes (`src/locales/ce.json`) ci-dessous sont des
propositions, pas du tchétchène relu par un locuteur natif. À vérifier et
corriger :

| Clé           | Valeur actuelle (ce)   | RU (référence)       | EN (référence) |
| ------------- | ---------------------- | -------------------- | -------------- |
| `show_more`   | Кхин гайта             | Показать ещё         | Show more      |
| `works_label` | Белхаш                 | Произведения         | Works          |
| `share`       | Декъа                  | Поделиться           | Share          |
| `link_copied` | Хьажорг копи яьна      | Ссылка скопирована   | Link copied    |

Contexte d'usage :

- `show_more` : bouton « afficher plus » sous les grilles de résultats
  (pagination, 24 par page).
- `works_label` : compteur sur la page auteur (« N … »).
- `share` / `link_copied` : bouton de partage sur les pages d'œuvres
  (Web Share API ou copie du lien).

Après correction, aucune action technique requise : les 4 fichiers
`src/locales/*.json` doivent garder exactement le même jeu de clés
(`npm run validate-data` ne le vérifie pas, mais la CI peut être étendue).

## Textes à vérifier par un locuteur natif

- **`mokhmad-mamakaev-hazachu-yoi-tulg`** (prose, `prose.json`) : résidus
  OCR non réparables mécaniquement (fragments latins : `xloнc`, `yrrapе`,
  `yьcrarlaн`, `rloнах`, `Iaxap`, `TӀе`, `perӀа`). Le validateur signale le
  cas en permanence (`mélange latin/cyrillique`) jusqu'à correction manuelle.
  Source propre recherchée sans succès le 2026-10-14.
- **`hajimuradov-tsergyakkkhar`** : `- 1-Ӏа-1!` — chiffres `1` ambigus
  (interjection `Ӏа-Ӏа` ? comptage ?). Laissé tel quel volontairement.
- **Traductions de titres FR/EN/RU ajoutées le 2026-10-14** (lots nohchalla) :
  traductions littérales non relues, à valider idéalement par un bilingue.
