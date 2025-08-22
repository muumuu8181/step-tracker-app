import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, '../../../'),
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, '../../../CREATE/web/app/index.html')
    },
    outDir: path.resolve(__dirname, '../../../PROTECT/deployment/dist'),
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, '../../../PROTECT/core-system/core'),
      '@shared': path.resolve(__dirname, '../../../PROTECT/core-system/shared'),
      '@web': path.resolve(__dirname, '../../../CREATE/web/app/src')
    }
  },
  server: {
    port: 3000,
    open: true,
    host: true
  }
});