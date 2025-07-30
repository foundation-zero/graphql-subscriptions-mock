import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    clearMocks: true,
    globals: true,
    environment: 'node',
    include: ['tests/unit/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['tests/integration/**/*.*'],
  },

  root: resolve(__dirname),

  resolve: {
    alias: [
      { find: '@lib', replacement: resolve(__dirname, 'lib') },
      { find: '@types', replacement: resolve(__dirname, 'lib/types') },
      { find: '@utils', replacement: resolve(__dirname, 'lib/utils') },
    ],
  },
});
