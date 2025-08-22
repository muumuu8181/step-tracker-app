import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['CHANGE/improvements/tests/unit/**/*.test.ts', 'CHANGE/improvements/tests/integration/**/*.test.ts'],
    exclude: ['CHANGE/improvements/tests/e2e/**/*']
  },
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, '../../../PROTECT/core-system/core'),
      '@shared': path.resolve(__dirname, '../../../PROTECT/core-system/shared'),
      '@web': path.resolve(__dirname, '../../../CREATE/web/app/src')
    }
  }
});