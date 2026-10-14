# Restauration de la perte de données + poèmes en anglais et en français

> Date d'ajout : 2026-10-14

Trois opérations en un lot :

1. **restauration** de100 œuvres perdues lors d'un merge (181 → 111 entrées) ;
2. **ajout de 12 nouveaux poèmes** d'auteurs tchétchènes, dont **4 en anglais** et
   **8 en tchétchène + français** (textes réellement trouvés sur le web, aucun contenu
   inventé) ;
3. **3 corrections** d'entrées existantes ; puis **normalisation palotchka** des
   champs tchétchènes des4 fichiers de données.

## 1. Restauration (perte de données)

L'historique git montrait `poems.json` à **181 entrées** (commit `176ea47`) contre
**111** dans `main` : un merge avait écarté la version complète. Sur **101 ids
manquants**, **100 ont été restaurés** depuis `176ea47` (version canonique, qui
contient les18 poèmes EN/FR du lot du 2026-08-29) ; les fiches d'index existaient
déjà pour tous.

Écartés volontairement :

- `bisultanov-chabanekh` — **même poème** que `bisultanov-as-khan-chabaneh-gajga-jucur-ju`
  (doublon confirmé) ;
- `nemirovskaya-*` (2 entrées) — suppression déjà volontaire dans le commit `089a8f8`.

## 2. Lot — 12 nouveaux poèmes

**Critère d'ajout :** corps du texte EN ou FR obligatoire (les pages n'ayant que le
titre en français ont été écartées).

### En anglais (4)

| Titre | Auteur | Source |
|---|---|---|
| A Thoroughbred Night (1983) | Апти Бисултанов | [Waynakh Online](https://www.waynakh.com/eng/2009/05/a-thoroughbred-night-by-apti-bisultanov/) — 3 strophes |
| Khaibakh! | Апти Бисултанов | [Waynakh Online](https://www.waynakh.com/eng/2009/07/khaibakh-by-apti-bisultanov/) — poème sur le massacre de Khaybakh (27.02.1944) |
| Regret | Ильман Юсупов | [PoemHunter](https://www.poemhunter.com/poem/regret-152/) — 2 strophes |
| To Nokhchichoh | Ильман Юсупов | [PoemHunter](https://www.poemhunter.com/poem/to-nokhchichoh/) — 4 strophes + notes `*Nokhchichoh`, `**Churt` conservées |

### En tchétchène + français (8)

| Titre (ce / fr) | Auteur | Source |
|---|---|---|
| Даймохк / La Terre des Ancêtres | Апти Бисултанов | [Waynakh Online](https://www.waynakh.com/fr/2014/05/01/daymokhk-la-terre-des-ancetres-apti-bisoultanov/) — trad. Kissa Gatsaeva, 2 strophes ce+fr |
| Цхьалла / La Solitude (2002) | Апти Бисултанов | [Waynakh Online](https://www.waynakh.com/fr/2013/12/14/%d1%86%d1%85%d1%8c%d0%b0%d0%bb%d0%bb%d0%b0-la-solitude-apti-bisoultanov/) |
| Со-м хьан варий, Нохчийчоь / Je suis à toi, ma Tchétchénie | СаьӀид Гацаев (1938–2013) | [Waynakh Online](https://www.waynakh.com/fr/2014/01/13/said-gatsaev-je-suis-a-toi-ma-tchetchenie/) — article de Петимат Петирова ; trad. Kissa Gatsaeva, Martine Scolan |
| Хьо цӀерга хӀоьттина / Par le feu tu es passée | СаьӀид Гацаев | idem |
| Дика ду, бӀаьсте / Comme il est bon | СаьӀид Гацаев | idem |
| ХӀан, дуьло, цӀа гӀо вай / Et si nous y allions maintenant ? | СаьӀид Гацаев | idem |
| Чурт доцуш дуьсу вайн / De leurs pierres tombales privées | СаьӀид Гацаев | idem |
| ХӀун ду, сила мерза? / Existe-t-il une chose plus précieuse que l'âme ? | СаьӀид Гацаев | idem |

Les textes ont été **extraits programmatiquement** depuis les pages HTML sauvegardées
(mêmes ancres HTML que le site, strophes conservées) — ressaisie manuelle nulle part.

## 3. Corrections

| Entrée | Correction |
|---|---|
| `bisultanov-dagalecamash` | `text.en` rempli (**Memory**, 16 vers — page Waynakh EN, compte exact avec `text.ce`) |
| `bisultanov-degasta` | titres ru/en/fr corrigés — « Дагестан / Dagestan / Daghestan » → **« Родина / Homeland / La patrie »** (glose de la note (a) de la source : *« Deghasta ou Daîmokhk : La patrie »*) ; `text.fr` rempli (44 vers + notes (a)–(f)) ; lien Waynakh ajouté |
| `gatsaev-daimokhk` | œuvre restaurée puis `title.ce` + `text.ce` remplis (14 vers — version tchétchène de l'article Petirova, même poème que les traductions ru/en/fr déjà présentes) ; lien article ajouté, `source` enrichie |

## 4. Écartés (recherche web)

- **Auteurs non tchétchènes** (pages Waynakh EN) : Maetamm (Estonie), McPhillips
  (Irlande), Samniashvili (Géorgie) ; O'Donohue « On The Death Of The Beloved » ;
  Lermontov, Harrington — hors périmètre « auteurs tchétchènes ».
- **Doublons** : « Lonely Evening… » (PoemHunter) = `yusupov-ilman-lonely-night`
  déjà présent ; « Khaibakh! » EN ≠ « Khaibakh » translittéré de
  `bisultanov-hajbahah-jazjina-bajtash` (textes différents — les deux conservés).
- **Pages sans corps FR** : « Güyre / L'automne », « Noxçiyçö / Ma Tchétchénie »
  (Khatuyev-Dimaev) — seulement le titre en français.

## 5. Илли et contes en anglais/français : introuvables

Recherche menée à fond (Waynakh `/eng/`, `/fr/`, groznycity.ru, nohchalla.com,
PoemHunter) : **aucun илли ni conte du folklore tchétchène** n'existe en anglais ou
en français en ligne. Les илли collectés le sont en russe uniquement (lot du
2026-10-13) ; c'est un résultat nul, pas un oubli.

## 6. Palotchka (obligatoire après ajout — `docs/prompt-palotchka.md`)

Dry-run présenté et validé par l'utilisateur, puis application :

- **209 remplacements** dans **52 champs** — `poems.json` (34/173), `index.json`
  (18/36), `songs.json` et `prose.json` (0) ;
- décompte : **125** `ӏ` (U+04CF) → `Ӏ` (U+04C0) ; **65** `I` latin → `Ӏ` ;
  **19** chiffre `1` → `Ӏ` (ex. `к1антана` → `кӀантана`, `тIехь` → `тӀехь`) ;
- **0 cas ambigu** (aucun chiffre d'année/numéro touché) ;
- vérification finale : **0 occurrence résiduelle** de `1`/`I`/`l`/`|` collée au
  cyrillique ni de U+04CF dans les champs ciblés.

## 7. Notes et vérifications

- **Fichiers** : `poems.json` **111 → 118 (lot du 13.10) → 230** ; `index.json`
  **245 → 257 → 269** ; `songs.json` (23) et `prose.json` (9) inchangés par ce lot ;
  total œuvres **262** (= fiches), **7** fiches restent index-only
  (`bisultanov-chabanekh` +6 `mokhmad-mamakaev-*`, assumés).
- **Tags** : vocabulaire du projet uniquement (les fautes du lot ont été corrigées
  avant application : `стихаш` → `лирика`, `тӀом` → `назма`).
- **Sauvegardes** :
  - `src/data/backups/2026-10-14-restore-12-poems/` (avant restauration/ajouts)
  - `src/data/backups/2026-10-14-palotchka/` (avant normalisation)
  - Rollback : `cp src/data/backups/<date>/*.json src/data/`
- **Vérifications** : ids sans doublon, index ↔ œuvres cohérents,
  `npm run build` ✅.
