/**
 * Le richieste al servizio della classifica (F16, protocollo nel dettaglio
 * della fase). Funzioni senza stato: il `fetch` si può sostituire nei test.
 *
 * Al servizio arrivano solo i campi dei progressi che servono a ricalcolare i
 * punti: niente query, niente tentativi, niente date.
 */
import type { ThemeProgress } from '../progress/progress.ts';

export type Fetch = typeof fetch;

/** I progressi di un tema come li legge il servizio. */
export interface ProgressiInviati {
  freeHintUsed: boolean;
  exercises: Record<string, { solved: boolean; hintsRevealed: number; solutionBeforeSolve: boolean; pointsSpent: number }>;
}

export function progressiDaInviare(progress: ThemeProgress): ProgressiInviati {
  const exercises: ProgressiInviati['exercises'] = {};
  for (const id of Object.keys(progress.exercises).sort()) {
    const e = progress.exercises[id];
    // Un esercizio solo aperto, o solo scritto, non conta per i punti.
    if (!e.solved && e.hintsRevealed === 0 && !e.solutionBeforeSolve && e.pointsSpent === 0) continue;
    exercises[id] = { solved: e.solved, hintsRevealed: e.hintsRevealed, solutionBeforeSolve: e.solutionBeforeSolve, pointsSpent: e.pointsSpent };
  }
  return { freeHintUsed: progress.freeHintUsed, exercises };
}

export interface Voce {
  rank: number;
  name: string;
  points: number;
}

export interface Posizione {
  name: string;
  rank: number | null;
  points: number;
  neighbors: (Voce & { me: boolean })[];
}

/**
 * Come è andata una richiesta:
 * - `ok`: riuscita, con i dati della risposta;
 * - `respinta`: 422 o 400, i progressi non sono accettabili (motivo del servizio); riprovare non serve;
 * - `attendi`: 429, si riprova dopo `secondi`;
 * - `sconosciuto`: 401 o 404, il servizio non conosce questo gettone;
 * - `irraggiungibile`: rete assente, 5xx, risposta illeggibile.
 */
export type Esito<T> =
  | { tipo: 'ok'; dati: T }
  | { tipo: 'respinta'; motivo: string }
  | { tipo: 'attendi'; secondi: number }
  | { tipo: 'sconosciuto' }
  | { tipo: 'irraggiungibile' };

async function richiesta<T>(f: Fetch, url: string, init: RequestInit, leggi: (r: Response) => Promise<T>): Promise<Esito<T>> {
  let r: Response;
  try {
    r = await f(url, init);
  } catch {
    return { tipo: 'irraggiungibile' };
  }
  try {
    if (r.ok) return { tipo: 'ok', dati: await leggi(r) };
    if (r.status === 400 || r.status === 413 || r.status === 422) return { tipo: 'respinta', motivo: (await r.text()).slice(0, 200) };
    if (r.status === 429) {
      const secondi = Number(r.headers.get('Retry-After'));
      return { tipo: 'attendi', secondi: Number.isFinite(secondi) && secondi > 0 ? secondi : 60 };
    }
    if (r.status === 401 || r.status === 404) return { tipo: 'sconosciuto' };
  } catch {
    // Corpo illeggibile: come un servizio che non risponde.
  }
  return { tipo: 'irraggiungibile' };
}

const conGettone = (gettone: string, altro: Record<string, string> = {}) => ({ Authorization: `Bearer ${gettone}`, ...altro });

const query = (tema: string | null) => (tema ? `?tema=${encodeURIComponent(tema)}` : '');

/** Invia i progressi: al primo invio il servizio iscrive e assegna il nome. */
export function inviaPunteggio(
  f: Fetch,
  base: string,
  gettone: string,
  themes: Record<string, ProgressiInviati>,
): Promise<Esito<{ name: string; total: number }>> {
  return richiesta(
    f,
    `${base}/v1/punteggio`,
    { method: 'PUT', headers: conGettone(gettone, { 'Content-Type': 'application/json' }), body: JSON.stringify({ themes }) },
    (r) => r.json(),
  );
}

/** Esce dalla classifica: il servizio cancella nome e punti. */
export function cancellaPunteggio(f: Fetch, base: string, gettone: string): Promise<Esito<null>> {
  return richiesta(f, `${base}/v1/punteggio`, { method: 'DELETE', headers: conGettone(gettone) }, async () => null);
}

/**
 * I primi 50, generale (`tema` null) o di un tema. Il servizio li lascia in
 * cache per un minuto; con `fresca` il browser non usa la sua copia (per chi
 * partecipa e vuole vedere subito i propri punti).
 */
export function leggiClassifica(f: Fetch, base: string, tema: string | null, fresca = false): Promise<Esito<Voce[]>> {
  const init: RequestInit = fresca ? { cache: 'no-cache' } : {};
  return richiesta(f, `${base}/v1/classifica${query(tema)}`, init, async (r) => ((await r.json()) as { entries: Voce[] }).entries);
}

/** La posizione del partecipante, con due vicini sopra e due sotto. */
export function leggiPosizione(f: Fetch, base: string, gettone: string, tema: string | null): Promise<Esito<Posizione>> {
  return richiesta(f, `${base}/v1/posizione${query(tema)}`, { headers: conGettone(gettone) }, (r) => r.json());
}
