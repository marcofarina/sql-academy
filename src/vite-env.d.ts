/// <reference types="vite/client" />

/** Revisione Git del sito, impostata da Vite. */
declare const __SITE_REVISION__: string;

interface ImportMetaEnv {
  /** Indirizzo del servizio dello zaino (F15), senza `/` finale. */
  readonly VITE_ZAINO_URL?: string;
  /** Indirizzo del servizio della classifica (F17), senza `/` finale. */
  readonly VITE_CLASSIFICA_URL?: string;
}

declare module 'virtual:theme-stats' {
  import type { ThemeStats } from './themes/contract.ts';
  /** Conteggi di ogni tema, per `id`, calcolati al build da `scripts/themeStatsPlugin.ts`. */
  const stats: Record<string, ThemeStats>;
  export default stats;
}
