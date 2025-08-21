import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['CHANGE-変更する/improvements/tests/unit/**/*.test.ts', 'CHANGE-変更する/improvements/tests/integration/**/*.test.ts'],
    exclude: ['CHANGE-変更する/improvements/tests/e2e/**/*']
  },
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, 'PROTECT-保護された/core-system/core'),
      '@shared': path.resolve(__dirname, 'PROTECT-保護された/core-system/shared'),
      '@web': path.resolve(__dirname, 'app/web/src')
    }
  }
});