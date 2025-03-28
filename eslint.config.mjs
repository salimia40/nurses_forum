// eslint.config.mjs
import eslint from 'eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import typescriptEslintParser from '@typescript-eslint/parser';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import drizzlePlugin from 'eslint-plugin-drizzle';
import pluginRouter from '@tanstack/eslint-plugin-router';

export default [
  // Ignore patterns (migrated from .eslintignore)
  {
    ignores: [
      'node_modules',
      'dist',
      'build',
      '.next',
      'public',
      'coverage',
      '**/*.d.ts',
      'bun.lockb',
      './build.ts',
      './commitlint.config.js',
    ],
  },

  // Base config for all JavaScript and TypeScript files
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: typescriptEslintParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        // Node globals
        process: 'readonly',
        // Add any other globals you need
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      '@typescript-eslint': typescriptEslintPlugin,
      prettier: prettierPlugin,
      drizzle: drizzlePlugin,
      '@tanstack/router': pluginRouter,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // React plugin rules
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      // React Hooks plugin rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // TypeScript plugin rules
      '@typescript-eslint/no-unused-vars': ['warn'],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',

      // Prettier integration
      'prettier/prettier': 'warn',

      // Drizzle plugin rules
      'drizzle/enforce-update-with-where': 'error',
      'drizzle/enforce-delete-with-where': 'error',

      // Router plugin rules
      '@tanstack/router/create-route-property-order': 'error',
    },
  },

  // Bun-specific configuration (migrated from .eslintrc.bun.json)
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      globals: {
        // Bun globals
        Bun: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
      'import/no-nodejs-modules': 'off',
    },
  },

  // Apply Prettier config (must be last to override other configs)
  prettierConfig,
];
