import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  {
    ignores: ['dist', 'node_modules'],
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // 1. Transforme les erreurs de variables inutilisées en simples avertissements non bloquants
      'no-unused-vars': [
        'warn',
        { 
          vars: 'all', 
          args: 'after-used', 
          ignoreRestSiblings: true,
          varsIgnorePattern: '^React$',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      
      // 2. Désactive complètement la règle stricte qui bloque tes useEffects/setStates
      'react-hooks/set-state-in-effect': 'off',
      
      // 3. Désactive les avertissements de dépendances manquantes (exhaustive-deps)
      'react-hooks/exhaustive-deps': 'off',
      
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
];