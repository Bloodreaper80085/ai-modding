import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(
  process.env.ELECTRON
    ? {
        plugins: [react()],
        optimizeDeps: {
          exclude: ['lucide-react'],
        },
        build: {
          outDir: 'dist',
          rollupOptions: {
            input: path.resolve(__dirname, 'index.html'),
          },
        },
        server: {
          middlewareMode: true,
        },
      }
    : {
        plugins: [react()],
        optimizeDeps: {
          exclude: ['lucide-react'],
        },
      }
);