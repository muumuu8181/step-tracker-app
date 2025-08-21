import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/unit/**/*.test.ts', 'tests/integration/**/*.test.ts'],
    exclude: ['tests/e2e/**/*']
  },
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, 'core'),
      '@shared': path.resolve(__dirname, 'shared'),
      '@web': path.resolve(__dirname, 'app/web/src')
    }
  }
});