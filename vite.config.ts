import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://arena.fastapicloud.dev',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  },
});
