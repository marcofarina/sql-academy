import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { emptyProgress, withQuery, type ThemeProgress } from '../progress/progress.ts';
import { clearAllProgress, updateProgress } from '../progress/store.ts';
import { canonico } from '../zaino/sezioni.ts';
import { unisciDati, validaDati } from '../zaino/sezione.ts';
import {
  NESSUNA_ADESIONE,
  cambiaAdesione,
  leggiAdesione,
  nuovoGettone,
  sostituisciAdesione,
  svuotaAdesione,
  unisciAdesioni,
  validaAdesione,
  type Adesione,
} from './adesione.ts';
import { ATTESE, RITARDO, creaControllore, temaDelMotivo, type Controllore } from './invio.ts';
import { testoRifiuto, testoStato } from './labels.ts';
import { inviaPunteggio, progressiDaInviare, type Fetch } from './servizio.ts';

const G1 = 'a'.repeat(43);
const G2 = 'b'.repeat(43);

function risolto(progress: ThemeProgress, id: string): ThemeProgress {
  return {
    ...progress,
    exercises: {
      ...progress.exercises,
      [id]: { ...(progress.exercises[id] ?? emptyProgress().exercises[id]), solved: true, attempts: 1, hintsRevealed: 0, solutionSeen: false, solutionBeforeSolve: false, pointsEarned: 10, pointsSpent: 0, lastQuery: 'SELECT 1', queryAt: 1 },
    },
  };
}

/* --------------------------------------------------------------- adesione */

test('adesioni: vince la più recente; commutativa e idempotente', () => {
  const a: Adesione = { gettone: G1, at: 10 };
  const b: Adesione = { gettone: null, at: 20 };
  const c: Adesione = { gettone: G2, at: 20 };
  expect(unisciAdesioni(a, b)).toEqual(b);
  expect(unisciAdesioni(b, a)).toEqual(b);
  expect(unisciAdesioni(b, c)).toEqual(unisciAdesioni(c, b));
  expect(unisciAdesioni(b, c)).toEqual(c);
  expect(unisciAdesioni(a, a)).toEqual(a);
});

test('validaAdesione accetta solo gettoni di 43 caratteri base64url e istanti validi', () => {
  expect(validaAdesione({ gettone: G1, at: 5 })).toEqual({ gettone: G1, at: 5 });
  expect(validaAdesione({ gettone: null, at: 0 })).toEqual({ gettone: null, at: 0 });
  expect(validaAdesione({ gettone: 'corto', at: 5 })).toBeNull();
  expect(validaAdesione({ gettone: G1, at: -1 })).toBeNull();
  expect(validaAdesione(null)).toBeNull();
  expect(nuovoGettone()).toMatch(/^[A-Za-z0-9_-]{43}$/);
});

test('la sezione dello zaino porta l’adesione e la unisce', () => {
  const a = { themes: {}, classifica: { gettone: G1, at: 10 } };
  const b = { themes: {} };
  expect(unisciDati(a, b).classifica).toEqual({ gettone: G1, at: 10 });
  expect(canonico(unisciDati(a, b))).toBe(canonico(unisciDati(b, a)));
  expect(unisciDati(b, b)).toEqual({ themes: {} });
  expect(validaDati({ themes: {}, classifica: { gettone: G1, at: 3 } })).toEqual({ themes: {}, classifica: { gettone: G1, at: 3 } });
  expect(validaDati({ themes: {}, classifica: { gettone: 'x', at: 3 } })).toEqual({ themes: {} });
});

/* ---------------------------------------------------------------- servizio */

test('al servizio arrivano solo i campi dei punti, senza query né esercizi solo aperti', () => {
  let p = withQuery(emptyProgress(), 'ex-002', 'SELECT 2', 5);
  p = risolto(p, 'ex-001');
  expect(progressiDaInviare(p)).toEqual({
    freeHintUsed: false,
    exercises: { 'ex-001': { solved: true, hintsRevealed: 0, solutionBeforeSolve: false, pointsSpent: 0 } },
  });
});

test('esiti delle risposte: 200, 422, 429 con Retry-After, 500, rete assente', async () => {
  const con = (r: Response | Error): Fetch => async () => {
    if (r instanceof Error) throw r;
    return r;
  };
  const json = { name: 'Lontra Tenace 42', total: 10 };
  expect(await inviaPunteggio(con(Response.json(json)), 'x', G1, {})).toEqual({ tipo: 'ok', dati: json });
  expect(await inviaPunteggio(con(new Response('lotr: saldo negativo', { status: 422 })), 'x', G1, {})).toEqual({ tipo: 'respinta', motivo: 'lotr: saldo negativo' });
  expect(await inviaPunteggio(con(new Response('', { status: 429, headers: { 'Retry-After': '90' } })), 'x', G1, {})).toEqual({ tipo: 'attendi', secondi: 90 });
  expect(await inviaPunteggio(con(new Response('', { status: 500 })), 'x', G1, {})).toEqual({ tipo: 'irraggiungibile' });
  expect(await inviaPunteggio(con(new TypeError('rete')), 'x', G1, {})).toEqual({ tipo: 'irraggiungibile' });
});

test('il tema di un motivo del servizio', () => {
  expect(temaDelMotivo('star-wars/ex-001: spesa impossibile', ['star-wars', 'lotr'])).toBe('star-wars');
  expect(temaDelMotivo('lotr: più di un aiuto gratuito', ['star-wars', 'lotr'])).toBe('lotr');
  expect(temaDelMotivo('manca themes', ['lotr'])).toBeNull();
});

/* -------------------------------------------------------------- controllore */

interface Chiamata {
  metodo: string;
  url: string;
  gettone: string | null;
  corpo: unknown;
}

let chiamate: Chiamata[];
let risposte: ((c: Chiamata) => Response | Error)[];
let zainoAperto: boolean;
let c: Controllore;

const finto: Fetch = async (input, init) => {
  const chiamata: Chiamata = {
    metodo: init?.method ?? 'GET',
    url: String(input),
    gettone: (init?.headers as Record<string, string> | undefined)?.Authorization?.replace('Bearer ', '') ?? null,
    corpo: init?.body ? JSON.parse(String(init.body)) : null,
  };
  chiamate.push(chiamata);
  const r = (risposte.shift() ?? (() => (chiamata.metodo === 'DELETE' ? new Response(null, { status: 204 }) : Response.json({ name: 'Lontra Tenace 42', total: 0 }))))(chiamata);
  if (r instanceof Error) throw r;
  return r;
};

const put = () => chiamate.filter((x) => x.metodo === 'PUT');

beforeEach(() => {
  vi.useFakeTimers();
  chiamate = [];
  risposte = [];
  zainoAperto = true;
  clearAllProgress();
  svuotaAdesione();
  c = creaControllore({ base: 'http://classifica', fetch: finto, temi: ['star-wars', 'lotr'], zainoAperto: () => zainoAperto });
  c.avvia();
});

afterEach(() => {
  c.ferma();
  vi.useRealTimers();
});

test('senza zaino non si partecipa e non parte nessuna richiesta', async () => {
  zainoAperto = false;
  expect(await c.partecipa()).toBe('senza-zaino');
  await vi.runAllTimersAsync();
  expect(chiamate).toEqual([]);
  expect(leggiAdesione()).toEqual(NESSUNA_ADESIONE);
  expect(testoStato(c.leggi())).toBeNull();
});

test('partecipare: iscrizione senza temi, poi i progressi; il nome arriva dal servizio', async () => {
  updateProgress('star-wars', (p) => risolto(p, 'ex-001'));
  expect(await c.partecipa()).toBe('ok');
  expect(put()[0].corpo).toEqual({ themes: {} });
  await vi.runAllTimersAsync();
  expect(put()).toHaveLength(2);
  expect(put()[1].corpo).toEqual({ themes: { 'star-wars': progressiDaInviare(risolto(emptyProgress(), 'ex-001')) } });
  expect(put()[1].gettone).toBe(leggiAdesione().gettone);
  expect(c.leggi()).toMatchObject({ fase: 'aggiornata', nome: 'Lontra Tenace 42' });
});

test('invio con attesa: un cambiamento parte dopo RITARDO, una query scritta non parte affatto', async () => {
  await c.partecipa();
  await vi.runAllTimersAsync();
  const prima = put().length;
  updateProgress('lotr', (p) => risolto(p, 'ex-001'));
  await vi.advanceTimersByTimeAsync(RITARDO - 100);
  expect(put()).toHaveLength(prima);
  await vi.advanceTimersByTimeAsync(200);
  expect(put()).toHaveLength(prima + 1);
  for (let i = 0; i < 5; i += 1) updateProgress('lotr', (p) => withQuery(p, 'ex-002', `SELECT ${i}`, i + 10));
  await vi.runAllTimersAsync();
  expect(put()).toHaveLength(prima + 1);
});

test('429: si riprova dopo Retry-After, senza anticipare', async () => {
  await c.partecipa();
  risposte.push(() => new Response('', { status: 429, headers: { 'Retry-After': '120' } }));
  updateProgress('star-wars', (p) => risolto(p, 'ex-001'));
  await vi.advanceTimersByTimeAsync(RITARDO);
  expect(c.leggi().fase).toBe('in-attesa');
  expect(testoStato(c.leggi())).toMatch(/un po’ alla volta/);
  const dopoIl429 = put().length;
  updateProgress('star-wars', (p) => risolto(p, 'ex-002'));
  await vi.advanceTimersByTimeAsync(60_000);
  expect(put()).toHaveLength(dopoIl429);
  await vi.advanceTimersByTimeAsync(60_000);
  expect(put()).toHaveLength(dopoIl429 + 1);
  expect(c.leggi().fase).toBe('aggiornata');
});

test('servizio fermo: attese crescenti, poi si riprende', async () => {
  await c.partecipa();
  risposte.push(() => new TypeError('rete'), () => new Response('', { status: 503 }));
  updateProgress('star-wars', (p) => risolto(p, 'ex-001'));
  await vi.advanceTimersByTimeAsync(RITARDO);
  expect(c.leggi().fase).toBe('irraggiungibile');
  const n = put().length;
  await vi.advanceTimersByTimeAsync(ATTESE[0]);
  expect(put()).toHaveLength(n + 1);
  expect(c.leggi().fase).toBe('irraggiungibile');
  await vi.advanceTimersByTimeAsync(ATTESE[1] - 1);
  expect(put()).toHaveLength(n + 1);
  await vi.advanceTimersByTimeAsync(1);
  expect(put()).toHaveLength(n + 2);
  expect(c.leggi().fase).toBe('aggiornata');
});

test('422 su un tema: quel tema resta fuori, gli altri partono subito, e torna quando cambia', async () => {
  await c.partecipa();
  await vi.runAllTimersAsync();
  updateProgress('star-wars', (p) => risolto(p, 'ex-001'));
  updateProgress('lotr', (p) => risolto(p, 'ex-001'));
  risposte.push(() => new Response('lotr: più di un aiuto gratuito', { status: 422 }));
  const n = put().length;
  await vi.runAllTimersAsync();
  expect(put()).toHaveLength(n + 2);
  expect(Object.keys((put()[n + 1].corpo as { themes: object }).themes)).toEqual(['star-wars']);
  expect(c.leggi()).toMatchObject({ fase: 'aggiornata', respinti: { lotr: 'lotr: più di un aiuto gratuito' } });
  expect(testoRifiuto('lotr: più di un aiuto gratuito', 'Il Signore degli Anelli')).toMatch(/^Il Signore degli Anelli: risultano due aiuti gratuiti/);
  updateProgress('lotr', (p) => risolto(p, 'ex-002'));
  await vi.runAllTimersAsync();
  expect(Object.keys((put().at(-1)!.corpo as { themes: object }).themes).sort()).toEqual(['lotr', 'star-wars']);
  expect(c.leggi().respinti).toEqual({});
});

test('uscire: il servizio cancella la riga, poi la scelta si spegne', async () => {
  await c.partecipa();
  await vi.runAllTimersAsync();
  const gettone = leggiAdesione().gettone;
  expect(await c.smetti()).toBe('ok');
  expect(chiamate.at(-1)).toMatchObject({ metodo: 'DELETE', gettone });
  expect(leggiAdesione().gettone).toBeNull();
  await vi.runAllTimersAsync();
  expect(c.leggi().fase).toBe('spenta');
});

test('uscire senza rete: la scelta resta accesa', async () => {
  await c.partecipa();
  await vi.runAllTimersAsync();
  risposte.push(() => new TypeError('rete'));
  expect(await c.smetti()).toBe('irraggiungibile');
  expect(leggiAdesione().gettone).not.toBeNull();
});

test('un gettone diverso arrivato dallo zaino fa uscire il vecchio; «Esci dallo zaino» no', async () => {
  await c.partecipa();
  await vi.runAllTimersAsync();
  const vecchio = leggiAdesione().gettone;
  sostituisciAdesione({ gettone: G2, at: leggiAdesione().at + 1 });
  await vi.runAllTimersAsync();
  expect(chiamate.some((x) => x.metodo === 'DELETE' && x.gettone === vecchio)).toBe(true);
  expect(put().at(-1)!.gettone).toBe(G2);
  const n = chiamate.length;
  svuotaAdesione();
  await vi.runAllTimersAsync();
  expect(chiamate.slice(n).some((x) => x.metodo === 'DELETE')).toBe(false);
  expect(c.leggi().fase).toBe('spenta');
});

test('cambiaAdesione non torna indietro nel tempo', () => {
  cambiaAdesione(G1, 100);
  cambiaAdesione(null, 50);
  expect(leggiAdesione()).toEqual({ gettone: null, at: 101 });
});
