import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: 'app/web',
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, 'core'),
      '@shared': path.resolve(__dirname, 'shared'),
      '@web': path.resolve(__dirname, 'app/web/src')
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: '../../dist',
    emptyOutDir: true
  }
});