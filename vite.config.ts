/** Configurazione del sito, dei test e della revisione inclusa nelle segnalazioni. */
import react from '@vitejs/plugin-react';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { themeStatsPlugin } from './scripts/themeStatsPlugin.ts';

function siteRevision(): string {
  try {
    return execFileSync('git', ['rev-parse', '--short', 'HEAD'], {
      cwd: fileURLToPath(new URL('.', import.meta.url)),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    // Si può costruire il sito anche da un archivio senza la cronologia Git.
    return 'non disponibile';
  }
}

export default defineConfig({
  // Percorsi relativi: il sito funziona sotto qualunque sottocartella di GitHub Pages.
  base: './',
  define: { __SITE_REVISION__: JSON.stringify(siteRevision()) },
  plugins: [react(), themeStatsPlugin(fileURLToPath(new URL('./themes', import.meta.url)))],
  worker: { format: 'es' },
  test: {
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'servizi/*/src/**/*.test.ts'],
  },
});
