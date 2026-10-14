// ESLint flat config — socle P1.
// Couvre le JS/JSX applicatif + les scripts node. Les JSON de données
// sont validés par `npm run validate-data`, pas par ESLint.
import reactPlugin from 'eslint-plugin-react';
const browserGlobals = {
  window: 'readonly',
  document: 'readonly',
  localStorage: 'readonly',
  navigator: 'readonly',
};

const nodeGlobals = {
  process: 'readonly',
  console: 'readonly',
  setTimeout: 'readonly',
  clearTimeout: 'readonly',
  URL: 'readonly',
};

export default [
  {
    ignores: ['node_modules/**', 'dist/**', 'dist-ssr/**', 'coverage/**', 'src/data/**'],
  },
  {
    files: ['src/**/*.{js,jsx}'],
    plugins: { react: reactPlugin },
    settings: { react: { version: '18.2' } },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...browserGlobals, ...nodeGlobals, React: 'readonly' },
    },
    rules: {
      ...reactPlugin.configs['jsx-runtime'].rules,
      'react/jsx-uses-vars': 'error',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'no-empty': 'warn',
    },
  },
  {
    files: ['scripts/**/*.mjs', 'vite.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: nodeGlobals,
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
    },
  },
];
