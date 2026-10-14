/**
 * Author name transliteration.
 *
 * Author names are stored in the data files in Chechen Cyrillic (e.g.
 * "Муса Гешаев"), because they are the canonical names used in the source
 * archive. When the interface language is English or French, those names are
 * rendered in Latin script so that non-Cyrillic readers can read and
 * pronounce them:
 *
 *   - English: Musa Geshayev        (Musa Geshayev)
 *   - French:  Moussa Gechayev      (Moussa Gechayev)
 *
 * The table below holds the reviewed spelling of every author currently in
 * the catalog. New authors are transliterated automatically by the fallback
 * rules, but should be added to the table as soon as they appear so the
 * spelling can be reviewed.
 */

const AUTHOR_NAMES = {
  'Абузар Айдамиров': { en: 'Abuzar Aydamirov', fr: 'Abouzar Aydamirov' },
  'Адам Ахматукаев': { en: 'Adam Akhatukayev', fr: 'Adam Akhatoukayev' },
  'Аза Атагинская': { en: 'Aza Ataginskaya', fr: 'Aza Ataginskaya' },
  'Апти Бисултанов': { en: 'Apti Bisultanov', fr: 'Apti Bissoultanov' },
  'Ахмад Сулейманов': { en: 'Akhmad Suleymanov', fr: 'Akhmad Souleymanov' },
  'Ваха Докаев': { en: 'Vakha Dokayev', fr: 'Vakha Dokayev' },
  'Вахит Хаджимурадов': { en: 'Vakhit Khadzhimuradov', fr: 'Vakhit Khadjimouradov' },
  'Зайтемиров Сайдик': { en: 'Zaytemirov Saydik', fr: 'Zaytemirov Saydik' },
  'Зелимхан Яндарбиев': { en: 'Zelimkhan Yandarbiyev', fr: 'Zelimkhan Yandarbiev' },
  'Ибрагим Юсупов': { en: 'Ibragim Yusupov', fr: 'Ibragim Youssoupov' },
  'Касумов Сайдмохьмад': { en: 'Kasumov Saydmokhmad', fr: 'Kassoumov Saydmokhmad' },
  'Леча Абдулаев': { en: 'Lecha Abdulayev', fr: 'Letcha Abdoulayev' },
  'Магомед Мамакаев': { en: 'Magomed Mamakayev', fr: 'Magomed Mamakayev' },
  'Магомет Сулаев': { en: 'Magomet Sulayev', fr: 'Magomet Soulayev' },
  'Мохьмад Мамакаев': { en: 'Mokhmad Mamakayev', fr: 'Mokhmad Mamakayev' },
  'Муса Ахмадов': { en: 'Musa Akhmadov', fr: 'Moussa Akhmadov' },
  'Муса Гешаев': { en: 'Musa Geshayev', fr: 'Moussa Gechayev' },
  'Насруди Ярычев': { en: 'Nasrudi Yarychev', fr: 'Nasrudi Yarytchev' },
  'Раиса Ахматова': { en: 'Raisa Akhmatova', fr: 'Raissa Akhmatova' },
  'Саид-Хасан Ойбуев': { en: 'Said-Khasan Oybuyev', fr: 'Said-Khassan Oybouyev' },
  'Умар Яричев': { en: 'Umar Yarychev', fr: 'Oumar Yarytchev' },
  'Фариза Цалдаева': { en: 'Fariza Tsaldayeva', fr: 'Fariza Tsaldayeva' },
  'Хава Ясмалина': { en: 'Khava Yasmalina', fr: 'Khava Yasmalina' },
  Халкъан: { en: 'Khalqan', fr: 'Khalqan' },
  'Хамзат Магомадов': { en: 'Khamzat Magomadov', fr: 'Khamzat Magomadov' },
  'Шаид Рашидов': { en: 'Shaid Rashidov', fr: 'Chaid Rachidov' },
  'Шайхи Арсанукаев': { en: 'Shaikhi Arsanukayev', fr: 'Chaikhi Arsanoukayev' },
  'Шарип Цуруев': { en: 'Sharip Tsuruyev', fr: 'Charip Tsourouyev' },
};

const LATIN_LANGUAGES = ['en', 'fr'];

/** Cyrillic letters that count as vowels for the "е → ye" rule. */
const CYRILLIC_VOWELS = 'аеёиоуыэюяАЕЁИОУЫЭЮЯ';

/**
 * Letter-by-letter fallback rules, used for authors that are not yet in
 * AUTHOR_NAMES. `'ə'` marks a letter that should be dropped.
 */
const EN_RULES = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'yo',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'kh',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'shch',
  ъ: 'ə',
  ы: 'y',
  ь: 'ə',
  э: 'e',
  ю: 'yu',
  я: 'ya',
  Ӏ: '’',
};

const FR_RULES = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'yo',
  ж: 'j',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'ou',
  ф: 'f',
  х: 'kh',
  ц: 'ts',
  ч: 'tch',
  ш: 'ch',
  щ: 'chtch',
  ъ: 'ə',
  ы: 'y',
  ь: 'ə',
  э: 'e',
  ю: 'you',
  я: 'ya',
  Ӏ: '’',
};

function getRules(language) {
  return language === 'fr' ? FR_RULES : EN_RULES;
}

/**
 * Fallback transliteration for author names not present in AUTHOR_NAMES.
 * Keeps the same principles as the reviewed table:
 *   - "е" after a vowel becomes "ye"/"yev" (e.g. "Гешаев" → "Geshayev"),
 *   - "у" stays "u" in English and becomes "ou" in French ("Муса" →
 *     "Musa" / "Moussa"),
 *   - "ш" is "sh" in English and "ch" in French ("Гешаев" → "Geshayev" /
 *     "Gechayev").
 */
function transliterate(author, language) {
  const rules = getRules(language);
  const chars = Array.from(author);
  let result = '';
  let previous = '';

  for (let i = 0; i < chars.length; i += 1) {
    const char = chars[i];
    const lower = char.toLowerCase();
    const rule = rules[lower];

    if (!rule) {
      result += char;
      previous = char;
      continue;
    }

    if (rule === 'ə') {
      previous = char;
      continue;
    }

    // In English, "е" after a vowel is pronounced as a "y" glide
    // ("Гешаев" → "Geshayev", "Докаев" → "Dokayev").
    let mapped = rule;
    if (language === 'en' && char === 'е' && previous && CYRILLIC_VOWELS.includes(previous)) {
      mapped = 'ye';
    }

    // French keeps the hard "s" sound by doubling "s" between vowels
    // ("Муса" → "Moussa", "Раиса" → "Raissa"), but not before a
    // consonant ("Насруди" → "Nasrudi").
    const next = chars[i + 1] || '';
    if (
      language === 'fr' &&
      char === 'с' &&
      previous &&
      CYRILLIC_VOWELS.includes(previous) &&
      CYRILLIC_VOWELS.includes(next)
    ) {
      mapped = 'ss';
    }

    // Preserve the case of the source letter.
    const isUppercase = char === char.toUpperCase() && char !== char.toLowerCase();
    result += isUppercase ? mapped.charAt(0).toUpperCase() + mapped.slice(1) : mapped;
    previous = char;
  }

  return result;
}

/**
 * Returns the author name rendered for the given interface language.
 * Chechen ("ce") and Russian ("ru") keep the original Cyrillic spelling;
 * English and French use the reviewed Latin transcription.
 */
export function getAuthorName(author, language) {
  if (!author) return author;
  if (!LATIN_LANGUAGES.includes(language)) return author;

  const reviewed = AUTHOR_NAMES[author]?.[language];
  return reviewed || transliterate(author, language);
}

/**
 * Convenience helper for work objects (they store the author as a plain
 * string in `author`).
 */
export function getWorkAuthor(work, language) {
  return getAuthorName(work?.author, language);
}

/** True when the given language renders author names in Latin script. */
export function isAuthorLatinLanguage(language) {
  return LATIN_LANGUAGES.includes(language);
}
