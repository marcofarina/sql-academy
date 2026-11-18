import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { themeStatsPlugin } from './scripts/themeStatsPlugin.ts';

export default defineConfig({
  // Percorsi relativi: il sito funziona sotto qualunque sottocartella di GitHub Pages.
  base: './',
  plugins: [react(), themeStatsPlugin(fileURLToPath(new URL('./themes', import.meta.url)))],
  worker: { format: 'es' },
  test: {
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
});
