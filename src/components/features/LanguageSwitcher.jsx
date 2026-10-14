import { useLanguage } from '@/context/LanguageContext';
import './LanguageSwitcher.css';

import nokhchiychoFlag from '@/assets/flags/nokhchiycho.svg';
import russiaFlag from '@/assets/flags/russia.svg';
import ukFlag from '@/assets/flags/uk.svg';
import franceFlag from '@/assets/flags/france.svg';

const FLAGS = {
  ce: nokhchiychoFlag,
  ru: russiaFlag,
  en: ukFlag,
  fr: franceFlag,
};

const LABELS = {
  ce: 'CE',
  ru: 'RU',
  en: 'EN',
  fr: 'FR',
};

const LanguageSwitcher = () => {
  const { language, setLanguage, languages } = useLanguage();

  const availableLangs = languages || ['ce', 'ru', 'en', 'fr'];

  return (
    <div className="language-switcher">
      {availableLangs.map((lang) => (
        <button
          key={lang}
          className={`lang-btn ${language === lang ? 'lang-btn--active' : ''}`}
          onClick={() => setLanguage(lang)}
        >
          <img src={FLAGS[lang]} alt={lang} className="lang-flag" />
          <span className="lang-label">{LABELS[lang]}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
