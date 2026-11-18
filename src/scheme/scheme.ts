/**
 * Schema di colori di un tema (chiaro o scuro), per i temi che ne dichiarano
 * due (`schemes` nel manifest). Alla prima visita segue `prefers-color-scheme`;
 * la scelta dello studente si conserva in `localStorage`, per tema, nella
 * chiave `sql-academy:<tema>:schema`, accanto a quella dei progressi.
 *
 * Ogni accesso all’archivio è in `try/catch`: senza `localStorage` la scelta
 * vale solo per la pagina aperta.
 */

import { SCHEMES, type Scheme } from '../themes/contract.ts';

export function schemeKey(themeId: string): string {
  return `sql-academy:${themeId}:schema`;
}

export function isScheme(value: unknown): value is Scheme {
  return typeof value === 'string' && (SCHEMES as readonly string[]).includes(value);
}

/** Lo schema iniziale: quello salvato, altrimenti la preferenza del sistema. */
export function initialScheme(saved: string | null, prefersDark: boolean): Scheme {
  if (isScheme(saved)) return saved;
  return prefersDark ? 'scuro' : 'chiaro';
}

export function loadScheme(themeId: string): Scheme {
  let saved: string | null = null;
  try {
    saved = window.localStorage.getItem(schemeKey(themeId));
  } catch {
    // Archivio non disponibile: si segue la preferenza del sistema.
  }
  const prefersDark = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return initialScheme(saved, prefersDark);
}

export function saveScheme(themeId: string, scheme: Scheme): void {
  try {
    window.localStorage.setItem(schemeKey(themeId), scheme);
  } catch {
    // Archivio non disponibile: la scelta resta nella pagina.
  }
}
