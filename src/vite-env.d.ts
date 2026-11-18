/// <reference types="vite/client" />

declare module 'virtual:theme-stats' {
  import type { ThemeStats } from './themes/contract.ts';
  /** Conteggi di ogni tema, per `id`, calcolati al build da `scripts/themeStatsPlugin.ts`. */
  const stats: Record<string, ThemeStats>;
  export default stats;
}
