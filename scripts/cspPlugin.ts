/**
 * Plugin di Vite: aggiunge al sito costruito una Content Security Policy in un
 * `<meta>`, perché GitHub Pages non permette di impostare intestazioni HTTP.
 *
 * Vale solo per la build: in sviluppo Vite inserisce script in linea e un
 * WebSocket per il ricaricamento, che la politica bloccherebbe.
 */

import type { Plugin } from 'vite';
import { loadEnv } from 'vite';

/** Indirizzi di produzione dei servizi, gli stessi di `src/main.tsx`. */
const SERVIZI = {
  VITE_ZAINO_URL: 'https://zaino.rainbowbits.cloud',
  VITE_CLASSIFICA_URL: 'https://sql-classifica.rainbowbits.cloud',
};

/** Compone la politica: tutto dal sito stesso, in rete solo zaino e classifica. */
export function contentSecurityPolicy(servizi: string[]): string {
  const origini = [...new Set(servizi.map((url) => new URL(url).origin))];
  return [
    "default-src 'self'",
    "script-src 'self'",
    // CodeMirror inserisce fogli di stile e le icone SVG hanno attributi `style`.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    `connect-src 'self' ${origini.join(' ')}`,
    "worker-src 'self'",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'none'",
  ].join('; ');
}

/** Inserisce la politica in testa a `index.html`, prima di ogni script. */
export function cspPlugin(): Plugin {
  let policy = '';
  return {
    name: 'sql-academy-csp',
    apply: 'build',
    configResolved(config) {
      const env = loadEnv(config.mode, config.envDir || config.root, 'VITE_');
      policy = contentSecurityPolicy(
        Object.entries(SERVIZI).map(([nome, predefinito]) => env[nome] ?? predefinito),
      );
    },
    transformIndexHtml() {
      return [{ tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: policy }, injectTo: 'head-prepend' }];
    },
  };
}
