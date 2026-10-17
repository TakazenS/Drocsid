import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import perfectionist from 'eslint-plugin-perfectionist';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      '@stylistic': stylistic,
      perfectionist,
    },
    rules: {
      // Points-virgules partout où c'est possible
      '@stylistic/indent': ['error', 2, { SwitchCase: 1 }],
      '@stylistic/jsx-indent-props': ['error', 2],
      '@stylistic/no-tabs': 'error',
      '@stylistic/no-mixed-spaces-and-tabs': 'error',
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/no-extra-semi': 'error',
      '@stylistic/member-delimiter-style': ['error', {
        multiline: { delimiter: 'semi', requireLast: true },
        singleline: { delimiter: 'semi', requireLast: true },
      }],

      // Imports triés alphabétiquement et par type
      'perfectionist/sort-imports': ['error', {
        type: 'alphabetical',
        order: 'asc',
        ignoreCase: true,
        newlinesBetween: 1,
        groups: [
          'type-import',                                    // import type { ... }
          ['value-builtin', 'value-external'],              // react, react-dom, librairies
          'value-internal',                                 // alias (@/..., ~/...)
          ['value-parent', 'value-sibling', 'value-index'], // composants .tsx/.ts du projet
          'side-effect',                                    // import './polyfill'
          'value-style',                                    // import styles from './X.module.css'
          'side-effect-style',                              // import './index.css'
          'unknown',
        ],
      }],
    },
  },
]);