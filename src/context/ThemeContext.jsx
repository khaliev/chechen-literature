import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

function getInitialTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') return saved;
  // Respect OS preference on first visit
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  const applyTheme = useCallback((t) => {
    document.documentElement.setAttribute('data-theme', t);
    // Also set color-scheme for native elements (scrollbars, form controls)
    document.documentElement.style.colorScheme = t;
    localStorage.setItem('theme', t);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === 'light' ? 'dark' : 'light';
    if (typeof document !== 'undefined' && document.startViewTransition) {
      // Disable CSS transitions during the snapshot capture
      document.documentElement.classList.add('theme-transitioning');
      const vt = document.startViewTransition(() => {
        setTheme(next);
        applyTheme(next);
      });
      vt.finished
        .catch(() => {})
        .finally(() => document.documentElement.classList.remove('theme-transitioning'));
    } else {
      setTheme(next);
    }
  }, [theme, applyTheme]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
