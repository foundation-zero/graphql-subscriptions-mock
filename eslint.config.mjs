import love from 'eslint-config-love';
import prettier from 'eslint-plugin-prettier/recommended';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ...love,
    files: ['**/*.ts'],
    rules: {
      ...love.rules,
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-magic-numbers': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/init-declarations': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unsafe-type-assertion': 'off',
      '@typescript-eslint/no-unnecessary-type-parameters': 'off',
      '@typescript-eslint/require-await': 'off',
      'no-console': 'off',
    },
  },
  {
    ignores: ['node_modules', 'dist'],
  },
  prettier,
];
