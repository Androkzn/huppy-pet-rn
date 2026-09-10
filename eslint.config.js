/**
 * ESLint configuration.
 *
 * Expo's shared config carries the React, React Native and import rules that
 * match this toolchain; the additions below are the ones worth failing a build
 * over in an app this size.
 */

const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  ...expoConfig,
  {
    ignores: [
      'ios/**',
      'android/**',
      '.maestro-results/**',
      'node_modules/**',
    ],
  },
  {
    // Jest's globals are injected by the runner, not imported.
    files: ['jest.setup.js', '**/__tests__/**', '**/*.test.{ts,tsx}'],
    languageOptions: {
      globals: {
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
    rules: { 'no-undef': 'off' },
  },
  {
    rules: {
      // Reanimated drives animation by assigning to a shared value's `.value`
      // — that is its documented API, not a mutation React needs to know about.
      // The rule cannot tell a shared value from ordinary state, so every
      // `scale.value = withSpring(...)` reads as an error.
      'react-hooks/immutability': 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // TypeScript resolves names and reports unused locals itself, and the
      // base rules misread enum members and type-only imports as dead code.
      // `npm run type-check` is what fails a build over those.
      'no-undef': 'off',
      'no-unused-vars': 'off',
      // A default export imported under its own name is the convention here
      // (`import MealCard from './MealCard'`), not a mistake.
      'import/no-named-as-default': 'off',
    },
  },
];
