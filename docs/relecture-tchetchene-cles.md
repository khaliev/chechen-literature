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
