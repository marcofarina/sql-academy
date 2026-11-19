/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Indirizzo del servizio dello zaino (F15), senza `/` finale. */
  readonly VITE_ZAINO_URL?: string;
}

declare module 'virtual:theme-stats' {
  import type { ThemeStats } from './themes/contract.ts';
  /** Conteggi di ogni tema, per `id`, calcolati al build da `scripts/themeStatsPlugin.ts`. */
  const stats: Record<string, ThemeStats>;
  export default stats;
}
