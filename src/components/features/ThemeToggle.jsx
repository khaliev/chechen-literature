import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/hooks/useTranslation';
import Button from '../ui/Button';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const handleToggle = (e) => {
    // Anchor the circular reveal at the button position (top-right)
    const el = e.currentTarget;
    if (el) {
      const rect = el.getBoundingClientRect();
      document.documentElement.style.setProperty('--theme-x', `${rect.left + rect.width / 2}px`);
      document.documentElement.style.setProperty('--theme-y', `${rect.top + rect.height / 2}px`);
    }
    toggleTheme();
  };

  return (
    <Button
      variant="icon"
      onClick={handleToggle}
      className="theme-toggle"
      aria-label={theme === 'dark' ? t('theme_light') : t('theme_dark')}
    >
      {theme === 'dark' ? (
        <svg
          className="theme-toggle__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      ) : (
        <svg
          className="theme-toggle__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      )}
    </Button>
  );
};

export default ThemeToggle;
