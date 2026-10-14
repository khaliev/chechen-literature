import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import './Header.css';

const Header = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

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
        </nav>

        <div className="header__actions">
          <div className="header__actions-desktop">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          <button
            className="header__hamburger"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
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
          <div className="header__mobile-content" onClick={(e) => e.stopPropagation()}>
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
            </nav>
            <div className="header__mobile-actions">
              <LanguageSwitcher />
              <div className="header__mobile-theme">
                <ThemeToggle />
              </div>
            </div>
            <button className="header__mobile-close" onClick={closeMenu}>
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
