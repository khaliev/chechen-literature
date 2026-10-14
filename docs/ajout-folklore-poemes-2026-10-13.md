# Ajout de poèmes tchétchènes et d'illis du folklore (фольклор)

> Date d'ajout : 2026-10-13

Ajout de **13 nouvelles œuvres** (8 poèmes + 6 илли) + **1 texte complet manquant**,
après recherche web approfondie. Textes transcrits **tels quels depuis les sources** —
aucun contenu inventé ; seules les traductions FR de « Little Soldier » ont été produites
(le texte EN original est conservé à l'identique).

> **Retrait (même jour)** : le poème « Там, на Востоке… » (Сенаар) de Саид-Хамзат Нунуев
> (`nunuev-tam-na-vostoke`) a été supprimé à la demande de l'utilisateur — retiré de
> `poems.json` et `index.json`.

## Lot — poèmes d'auteurs tchétchènes

| Titre | Auteur | Langues | Source |
|---|---|---|---|
| Даймахке / К родине | Мохьмад Мамакаев | ce | [Маршо Радио](https://www.radiomarsho.com/a/27540511.html) — **texte complet ajouté** à la fiche index existante `mokhmad-mamakaev-daymehke` (108 fiches de l'index n'avaient pas de texte ; celle-ci est désormais complète) |
| Нана / Мать (1940) | Мохьмад Мамакаев | ce | [infourok.ru](https://infourok.ru/user/isakova-birlant-navrdinovna/blog/nana-mamakaev-mohmad-141025.html) |
| ТӀе кхечи суьйренаш тийна / Строки нежной любви | Хамзат Магомадов | ce | [Нохчалла.com](https://nohchalla.com/literatura/chechenskie-stihi/hamzat-magomadov/759-1-135) |
| Езачух къаьсташ / Слова возлюбленной («Ма ала езнариг соьга») | Хамзат Магомадов | ce | [Нохчалла.com](https://nohchalla.com/literatura/chechenskie-stihi/hamzat-magomadov/728-%D0%B5%D0%B7%D0%B0%D1%87%D1%83%D1%85-%D0%BA%D1%8A%D0%B0%D1%8C%D1%81%D1%82%D0%B0%D1%88) |
| Во тьме глухих тысячелетий (1995) | Саид-Хамзат Нунуев (**nouvel auteur**) | ru | [Нохчалла.com](https://nohchalla.com/literatura/chechenskie-stihi/said-khamzat-nunuev/1624-vo-tme-glukhikh-tysyacheletij) |
| ~~Там, на Востоке… (Сенаар)~~ | Саид-Хамзат Нунуев | ru | **retiré à la demande de l'utilisateur** |
| Ты печален, брат чеченец (1995) | Саид-Хамзат Нунуев | ru | [Нохчалла.com](https://nohchalla.com/literatura/chechenskie-stihi/said-khamzat-nunuev/1622-ty-pechalen-brat-chechenets) |
| Little Soldier / Petit soldat | Роза Бино (déjà presente) | en + fr (traduction fournie) | [Waynakh Online](https://www.waynakh.com/eng/2012/06/little-soldier/) |

## Lot — илли du folklore tchétchène (auteur : Халкъан / народный)

Textes en **russe** (переложение/запись И. Б. Мунаева) issus de la collection en ligne
« Чеченская народная поэзия XIX–XX вв. » sur **groznycity.ru** (56 pages au total ;
6 илли complets repérés et transcrits intégralement) :

| Илли (ru) | Pages source | Remarque |
|---|---|---|
| Илли о Чёрном Ногае | p. 11–14 | — |
| Илли о горном пастухе | p. 14–16 | — |
| Илли о Жаммирзе, сыне Мады из Чечана | p. 18–21 | — |
| Илли о Храбром Чеге и Бейбулате, сыне Таймы | p. 21–24 | — |
| Илли о Сыне Вдовы и князе Мусосте | p. 24–27 | — |
| Илли о Сайлахе, у которой брата нет | p. 29–31 | — |

**Écartés pour doublon avec le projet** (présents en тхьан-кхелл / déjà collectés) :
« Илли о Сыне Вдовы и князе Монце » (= `illi-ela-montsa`), « Илли о Шихмирзе, сыне Зайты »
(= `illi-zaytan-shihmirza`), « Илли о грузинском князе Анзоре » (proche de
`illi-anzoran-zaza`). « Илли о Бахадуре Хушпаре » (début p. 31) non ajouté : texte
très long, au-delà de la plage collectée.

## Palotchka

Conformément à `docs/prompt-palotchka.md`, les4 textes tchétchènes saisis avec des
substituts (`1`, `I` latin — ex. `т1ома`, `к1ант`, `ДIаалахь`, `Iалашбал`) ont été
normalisés en **Ӏ (U+04C0)**. Vérification finale : **aucune** occurrence résiduelle
de `1`/`I`/`l`/`|` collée au cyrillique dans les nouveaux textes. Le millésime
`(1940 ш)` a été laissé intact (chiffres non convertis).

## Notes

- **Nom d'auteur** : `Мохьмад Мамакаев` est le nom tchétchène de Магомед Мамакаев
  (1910–1973, poète classique tchétchène — cf. ce.wikipedia). Les entrées du projet
  utilisaient déjà les deux graphies ; celle de la source est conservée.
- **Traductions** : les илли et les poèmes de Нунуев sont disponibles en version
  originale (ru) uniquement ; les titres ont été traduits en en/fr. « Little Soldier »
  est le seul texte du lot avec traduction FR complète du corps du poème.
- **Fichiers modifiés** : `src/data/poems.json` (111 → 118), `src/data/songs.json`
  (17 → 23), `src/data/index.json` (245 → 257, après retrait de `nunuev-tam-na-vostoke`).
  `prose.json` inchangé.
- **Sauvegarde** : `src/data/backups/2026-10-13-folklore-poemes/`.
  Rollback : `cp src/data/backups/2026-10-13-folklore-poemes/*.json src/data/`
- **Vérifications** : index ↔ fichiers complets cohérents, pas de doublons d'id,
  `npm run build` ✅.
