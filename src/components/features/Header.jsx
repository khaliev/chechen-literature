import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { getPreferredContentLanguage, hasContentInLanguage } from '@/utils/contentLanguage';
import { catalogWorks } from '@/data/catalog';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import './Header.css';

const Header = () => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const handleRandomWork = () => {
    closeMenu();
    if (!catalogWorks.length) return;
    const pool = catalogWorks.filter((w) => hasContentInLanguage(w, language));
    const candidates = pool.length > 0 ? pool : catalogWorks;
    const randomWork = candidates[Math.floor(Math.random() * candidates.length)];
    const displayLang = getPreferredContentLanguage(randomWork, language);
    navigate(`/${randomWork.type}/${randomWork.id}?lang=${displayLang}`);
  };

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeMenu();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isMenuOpen]);

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="header__logo" onClick={closeMenu}>
          {t('site_title') || 'Нохчийн литература'}
        </Link>

        <nav className="header__nav">
          <NavLink to="/" end>
            {t('nav_home')}
          </NavLink>
          <NavLink to="/category/poem">{t('nav_poems')}</NavLink>
          <NavLink to="/category/song">{t('nav_songs')}</NavLink>
          <NavLink to="/category/prose">{t('nav_prose')}</NavLink>
          <NavLink to="/authors">{t('nav_authors')}</NavLink>
        </nav>

        <div className="header__actions">
          <div className="header__actions-desktop">
            <button
              type="button"
              className="header__random-btn"
              onClick={handleRandomWork}
              title={t('random_work')}
              aria-label={t('random_work')}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="16 3 21 3 21 8"></polyline>
                <line x1="4" y1="20" x2="21" y2="3"></line>
                <polyline points="21 16 21 21 16 21"></polyline>
                <line x1="15" y1="15" x2="21" y2="21"></line>
                <line x1="4" y1="4" x2="9" y2="9"></line>
              </svg>
            </button>
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          <button
            className="header__hamburger"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? t('menu_close') : t('menu_open')}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="header__mobile-overlay" onClick={closeMenu}>
          <div
            className="header__mobile-content"
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t('site_title')}
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="header__mobile-nav">
              <NavLink to="/" end onClick={closeMenu}>
                {t('nav_home')}
              </NavLink>
              <NavLink to="/category/poem" onClick={closeMenu}>
                {t('nav_poems')}
              </NavLink>
              <NavLink to="/category/song" onClick={closeMenu}>
                {t('nav_songs')}
              </NavLink>
              <NavLink to="/category/prose" onClick={closeMenu}>
                {t('nav_prose')}
              </NavLink>
              <NavLink to="/authors" onClick={closeMenu}>
                {t('nav_authors')}
              </NavLink>
              <button type="button" className="header__mobile-random" onClick={handleRandomWork}>
                {t('random_work')}
              </button>
            </nav>
            <div className="header__mobile-actions">
              <LanguageSwitcher />
              <div className="header__mobile-theme">
                <ThemeToggle />
              </div>
            </div>
            <button
              className="header__mobile-close"
              onClick={closeMenu}
              aria-label={t('menu_close')}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
