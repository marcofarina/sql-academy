/**
 * Schema di colori delle pagine fuori dai temi (pagina iniziale, Zaino,
 * Classifica, Informativa, Docente). Senza una scelta segue
 * `prefers-color-scheme`, anche quando il sistema cambia a pagina aperta; la
 * scelta dello studente è un segno per tutto il sito, `sql-academy:schema`,
 * nell’area corrente dello zaino (`src/zaino/area.ts`), come la guida già
 * vista. Lo cancellano «Azzera i progressi» ed «Esci dallo zaino» (decisione
 * «Dati nel browser» del piano `portale-v2`).
 *
 * Lo schema vale come attributo `data-schema` della radice del documento:
 * `src/styles.css` ne ricava la veste neutra chiara o scura.
 */
import { useSyncExternalStore } from 'react';
import type { Scheme } from '../themes/contract.ts';
import { storageDi } from '../zaino/area.ts';
import { initialScheme, isScheme } from './scheme.ts';

export const SITE_SCHEME_KEY = 'sql-academy:schema';

const DARK_QUERY = '(prefers-color-scheme: dark)';
const listeners = new Set<() => void>();
let current: Scheme = 'chiaro';

function prefersDark(): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia(DARK_QUERY).matches;
}

function savedScheme(storage: Storage | null): string | null {
  try {
    return storage?.getItem(SITE_SCHEME_KEY) ?? null;
  } catch {
    return null;
  }
}

function apply(scheme: Scheme): void {
  current = scheme;
  // Fuori dal browser (prove dello zaino) non c’è un documento da aggiornare.
  if (typeof document !== 'undefined' && document.documentElement) document.documentElement.dataset.schema = scheme;
  listeners.forEach((listener) => listener());
}

/** Applica lo schema salvato o quello del sistema; da chiamare prima del primo disegno. */
export function startSiteScheme(storage: Storage | null = storageDi()): void {
  apply(initialScheme(savedScheme(storage), prefersDark()));
  if (typeof window.matchMedia !== 'function') return;
  window.matchMedia(DARK_QUERY).addEventListener('change', (event) => {
    // Una scelta esplicita vale più della preferenza del sistema.
    if (!isScheme(savedScheme(storageDi()))) apply(event.matches ? 'scuro' : 'chiaro');
  });
}

/** Sceglie lo schema delle pagine fuori dai temi e lo ricorda. */
export function chooseSiteScheme(scheme: Scheme, storage: Storage | null = storageDi()): void {
  try {
    storage?.setItem(SITE_SCHEME_KEY, scheme);
  } catch {
    // Archivio non raggiungibile: la scelta vale finché la pagina resta aperta.
  }
  apply(scheme);
}

/** Dimentica la scelta: le pagine tornano a seguire il sistema. */
export function clearSiteScheme(storage: Storage | null = storageDi()): void {
  try {
    storage?.removeItem(SITE_SCHEME_KEY);
  } catch {
    // Archivio non raggiungibile: non c’è nulla da togliere.
  }
  apply(prefersDark() ? 'scuro' : 'chiaro');
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Lo schema corrente delle pagine fuori dai temi, aggiornato a ogni cambio. */
export function useSiteScheme(): Scheme {
  return useSyncExternalStore(subscribe, () => current, () => 'chiaro');
}
