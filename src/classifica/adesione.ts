/**
 * L’adesione alla classifica (F17): il gettone che identifica lo studente
 * presso il servizio della classifica, o `null` se non partecipa.
 *
 * Vive nell’area dello zaino (`src/zaino/area.ts`), nella chiave
 * `sql-academy:classifica`, e viaggia nella sezione `sql-academy` dello zaino
 * (`src/zaino/sezione.ts`): così ogni dispositivo che apre lo stesso zaino
 * compare in classifica con lo stesso nome. Si partecipa solo con lo zaino
 * aperto (Marco, 2026-11-19): «Esci dallo zaino» toglie anche l’adesione da
 * questo browser, ma non la cancella dal servizio.
 *
 * Forma: `{ gettone: string | null, at: number }`. `at` è l’istante in
 * millisecondi dell’ultima scelta; fra due copie vince la più recente, così
 * anche l’uscita fatta su un dispositivo arriva agli altri.
 */
import { storageDi, suCambioArea } from '../zaino/area.ts';

export const CHIAVE_ADESIONE = 'sql-academy:classifica';

/** 32 byte in base64url, come vuole il servizio. */
const GETTONE = /^[A-Za-z0-9_-]{43}$/;

export interface Adesione {
  gettone: string | null;
  at: number;
}

export const NESSUNA_ADESIONE: Adesione = { gettone: null, at: 0 };

/** Pura, commutativa, idempotente: vince la scelta più recente; a pari istante il gettone maggiore. */
export function unisciAdesioni(a: Adesione, b: Adesione): Adesione {
  if (a.at !== b.at) return a.at > b.at ? a : b;
  return (a.gettone ?? '') >= (b.gettone ?? '') ? a : b;
}

/** Un’adesione arrivata dallo zaino o dal browser: null se non ha la forma attesa. */
export function validaAdesione(x: unknown): Adesione | null {
  if (typeof x !== 'object' || x === null) return null;
  const { gettone, at } = x as { gettone?: unknown; at?: unknown };
  if (!(gettone === null || (typeof gettone === 'string' && GETTONE.test(gettone)))) return null;
  if (typeof at !== 'number' || !Number.isFinite(at) || at < 0) return null;
  return { gettone, at };
}

/** Un gettone nuovo: 32 byte casuali in base64url. */
export function nuovoGettone(): string {
  const byte = crypto.getRandomValues(new Uint8Array(32));
  let binario = '';
  for (const b of byte) binario += String.fromCharCode(b);
  return btoa(binario).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/* ------------------------------------------------------------ archivio */

const ascoltatori = new Set<() => void>();
const locali = new Set<() => void>();
let inMemoria: Adesione | null = null;
let cache: { testo: string | null; adesione: Adesione } = { testo: null, adesione: NESSUNA_ADESIONE };
let osserva = false;

function avvisa(locale: boolean): void {
  for (const f of ascoltatori) f();
  if (locale) for (const f of locali) f();
}

export function leggiAdesione(): Adesione {
  if (inMemoria) return inMemoria;
  let testo: string | null;
  try {
    testo = storageDi()?.getItem(CHIAVE_ADESIONE) ?? null;
  } catch {
    return NESSUNA_ADESIONE;
  }
  if (testo === cache.testo) return cache.adesione;
  let adesione = NESSUNA_ADESIONE;
  try {
    adesione = validaAdesione(JSON.parse(testo ?? 'null')) ?? NESSUNA_ADESIONE;
  } catch {
    // Testo rovinato: come se non ci fosse.
  }
  cache = { testo, adesione };
  return adesione;
}

function scrivi(adesione: Adesione): void {
  try {
    const storage = storageDi();
    if (!storage) throw new Error('archivio assente');
    storage.setItem(CHIAVE_ADESIONE, JSON.stringify(adesione));
    inMemoria = null;
  } catch {
    inMemoria = adesione;
  }
}

/** Una scelta fatta in questa pagina: parte anche la sincronizzazione dello zaino. */
export function cambiaAdesione(gettone: string | null, adesso = Date.now()): void {
  scrivi({ gettone, at: Math.max(adesso, leggiAdesione().at + 1) });
  avvisa(true);
}

/** Un’adesione arrivata dallo zaino: si scrive senza far ripartire la sincronizzazione. */
export function sostituisciAdesione(adesione: Adesione): void {
  if (JSON.stringify(adesione) === JSON.stringify(leggiAdesione())) return;
  scrivi(adesione);
  avvisa(false);
}

/** Toglie l’adesione da questo browser («Esci dallo zaino»); il servizio non lo sa. */
export function svuotaAdesione(): void {
  inMemoria = null;
  try {
    storageDi()?.removeItem(CHIAVE_ADESIONE);
  } catch {
    // Archivio non raggiungibile: non c’è nulla da togliere.
  }
  avvisa(false);
}

function osservaCambi(): void {
  if (osserva || typeof window === 'undefined') return;
  osserva = true;
  window.addEventListener('storage', (event) => {
    if (event.key === null || event.key === CHIAVE_ADESIONE) avvisa(false);
  });
  suCambioArea(
    () => undefined,
    () => {
      inMemoria = null;
      avvisa(false);
    },
  );
}

/** Qualunque cambiamento dell’adesione, anche arrivato dallo zaino o da un’altra scheda. */
export function iscrivitiAdesione(f: () => void): () => void {
  osservaCambi();
  ascoltatori.add(f);
  return () => ascoltatori.delete(f);
}

/** Solo le scelte fatte in questa pagina, per lo zaino. */
export function iscrivitiAdesioneLocale(f: () => void): () => void {
  locali.add(f);
  return () => locali.delete(f);
}
