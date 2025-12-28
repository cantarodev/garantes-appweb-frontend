import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['date-fns', 'date-fns-tz'],
  },
  resolve: {
    dedupe: ['date-fns', 'date-fns-tz'],
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), 'node_modules/$1'),
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), 'src/$1'),
      },
    ],
  },
  server: {
    allowedHosts:['front.cebralab.com'],
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  build: {
    sourcemap: true, // Habilita los source maps
  },
});
