/** Verifiche del formato, dell’unione e della sincronizzazione dei progressi nello zaino. */
import { expect, test, vi } from 'vitest';
import { EMPTY_EXERCISE_PROGRESS, type ThemeProgress } from '../progress/progress.ts';
import { cifra, decifra, derivaChiavi, formattaCodice, normalizzaCodice, nuovoCodice } from './cifra.ts';
import { PAROLE } from './parole.ts';
import { NOME_SEZIONE, unisciDati, validaDati, type DatiSqlAcademy } from './sezione.ts';
import { canonico, unisciContenuti } from './sezioni.ts';
import type { ContenutoZaino } from './tipi.ts';

// Vettore calcolato il 2026-11-19 con `src/lib/zaino/cifra.ts` del libro: se cambia, lo zaino non è più lo stesso.
const CODICE = '0123456789ABCDEFGHJK';
const ID_DEL_LIBRO = 'JueDRI9JZAq00A_djI_EyyXxZxwuhl3lwAWMhPvDeZM';
const BLOB_DEL_LIBRO =
  'kkc4GBc5ZhI4sF166ppbFtV1tQ5fnH5yEoak0/nxJwfSPLixECZYOjybuDU99gUL1PNmJ9CcBcC/QUK8QA3dnzx/FI1zR55XDDyDDIcCtV8wksW7B1gtxRp82sTyG/lOacwQtMZfjWiJ6dsL9mtVnVSPlxqiL+PWHNbqUpywM4jyfcWf29X4d5PHnbfq';

const quaderno = { formato: 1, modificata: '2026-11-19T07:00:00.000Z', dati: { annotazioni: [] } };

const progressi = (solved: boolean, epoch = 0): ThemeProgress => ({
  epoch,
  freeHintUsed: false,
  exercises: { 'ex-001': { ...EMPTY_EXERCISE_PROGRESS, solved, attempts: 1, pointsEarned: solved ? 10 : 0 } },
});

test('dal codice lo stesso id del libro, e il blob del libro si decifra', async () => {
  const { id, chiave } = await derivaChiavi(CODICE);
  expect(id).toBe(ID_DEL_LIBRO);
  const blob = Uint8Array.from(atob(BLOB_DEL_LIBRO), (c) => c.charCodeAt(0));
  expect(await decifra(blob.buffer, chiave)).toEqual({ formato: 1, sezioni: { quaderno } });
});

test('cifrare e decifrare restituisce il contenuto; il testo non resta in chiaro', async () => {
  const { chiave } = await derivaChiavi(CODICE);
  const contenuto: ContenutoZaino = {
    formato: 1,
    sezioni: { [NOME_SEZIONE]: { formato: 1, modificata: '2026-11-19T08:00:00.000Z', dati: { themes: { 'star-wars': progressi(true) } } } },
  };
  const blob = await cifra(contenuto, chiave);
  expect(new TextDecoder().decode(blob)).not.toContain('star-wars');
  expect(await decifra(blob.buffer, chiave)).toEqual(contenuto);
  const altra = await derivaChiavi('ZZZZZZZZZZZZZZZZZZZZ');
  await expect(decifra(blob.buffer, altra.chiave)).rejects.toThrow();
});

test('codici di prima: normalizzazione di Crockford e gruppi da quattro', () => {
  expect(normalizzaCodice('0123-4567 89ab cdef ghjk')).toBe(CODICE);
  expect(normalizzaCodice('O1234567890123456789'.replace('O', 'o'))).toBe('01234567890123456789');
  expect(normalizzaCodice('troppo corto')).toBeNull();
  expect(formattaCodice(CODICE)).toBe('0123-4567-89AB-CDEF-GHJK');
});

test('elenco delle parole: 2048 diverse, a–z, 4–9 lettere, prime quattro uniche', () => {
  expect(PAROLE).toHaveLength(2048);
  expect(new Set(PAROLE).size).toBe(2048);
  for (const p of PAROLE) expect(p).toMatch(/^[a-z]{4,9}$/);
  expect(new Set(PAROLE.map((p) => p.slice(0, 4))).size).toBe(2048);
});

test('nuovoCodice: quattro parole dell’elenco, già nella forma canonica', () => {
  for (let i = 0; i < 200; i += 1) {
    const c = nuovoCodice();
    expect(c.split('-').every((p) => PAROLE.includes(p))).toBe(true);
    expect(c.split('-')).toHaveLength(4);
    expect(normalizzaCodice(c)).toBe(c);
    expect(formattaCodice(c)).toBe(c);
  }
});

test('codici a parole: maiuscole, accenti, separatori e prime quattro lettere', () => {
  const c = 'volpe-faro-miele-trono';
  for (const scritto of ['volpe faro miele trono', ' Volpe  FARO miele trono ', 'vòlpe-fàro-mièle-tronò', 'volpefaromieletrono', 'volp faro miel tron'])
    expect(normalizzaCodice(scritto)).toBe(c);
  for (const scritto of ['volpe faro miele', 'volpe faro miele xyzw', 'vol faro miele trono', 'volpfaromieltron'])
    expect(normalizzaCodice(scritto)).toBeNull();
});

test('codice a parole: lo stesso id del libro', async () => {
  // Calcolato il 2026-11-19 con `src/lib/zaino/cifra.ts` del libro (commit 6fe2e49).
  expect((await derivaChiavi('volpe-faro-miele-trono')).id).toBe('NQEq8sscP7-vuar6sKFfQUf-Aj6JlWUAYsO5cpYa86k');
});

test('la sezione del quaderno, che il portale non conosce, passa intatta in tutti e due gli ordini', () => {
  const dalLibro: ContenutoZaino = { formato: 1, sezioni: { quaderno } };
  const dalPortale: ContenutoZaino = {
    formato: 1,
    sezioni: { [NOME_SEZIONE]: { formato: 1, modificata: '2026-11-19T08:00:00.000Z', dati: { themes: { 'star-wars': progressi(true) } } } },
  };
  const unito = unisciContenuti(dalLibro, dalPortale);
  expect(unito.sezioni.quaderno).toBe(quaderno);
  expect(unito.sezioni[NOME_SEZIONE].dati).toEqual(dalPortale.sezioni[NOME_SEZIONE].dati);
  expect(canonico(unisciContenuti(dalPortale, dalLibro))).toBe(canonico(unito));
  expect(canonico(unisciContenuti(unito, unito))).toBe(canonico(unito));
});

test('sezione sql-academy: temi uniti uno per uno, commutativa e idempotente', () => {
  const a: DatiSqlAcademy = { themes: { 'star-wars': progressi(true), lotr: progressi(false) } };
  const b: DatiSqlAcademy = { themes: { 'star-wars': progressi(false, 1), 'tema-futuro': progressi(true) } };
  const ab = unisciDati(a, b);
  expect(Object.keys(ab.themes)).toEqual(['lotr', 'star-wars', 'tema-futuro']);
  expect(ab.themes['star-wars'].epoch).toBe(1);
  expect(ab.themes['star-wars'].exercises['ex-001'].solved).toBe(false);
  expect(canonico(unisciDati(b, a))).toBe(canonico(ab));
  expect(canonico(unisciDati(ab, ab))).toBe(canonico(ab));
});

test('validaDati scarta forme sbagliate, id di tema non validi e temi malformati', () => {
  expect(validaDati(null)).toBeNull();
  expect(validaDati({ themes: [] })).toBeNull();
  expect(validaDati({ themes: { 'Non Valido': progressi(true), lotr: 3, 'star-wars': progressi(true) } })).toEqual({
    themes: { 'star-wars': progressi(true) },
  });
});

test('la risposta corretta anticipa il salvataggio e si accoda alla scrittura già in corso', async () => {
  vi.resetModules();
  const window = new EventTarget();
  vi.stubGlobal('window', window);
  const browser = { onLine: true };
  vi.stubGlobal('navigator', browser);
  vi.stubGlobal('document', new EventTarget());
  let rispondi: (response: Response) => void = () => undefined;
  const fetch = vi.fn<typeof globalThis.fetch>()
    .mockResolvedValueOnce(new Response(null, { headers: { ETag: '"1"' } }))
    .mockImplementationOnce(() => new Promise((resolve) => { rispondi = resolve; }))
    .mockResolvedValueOnce(new Response(null, { headers: { ETag: '"3"' } }));
  vi.stubGlobal('fetch', fetch);

  try {
    await import('./sezione.ts');
    const { anticipaSalvataggioZaino, avviaZaino, crea, esci, leggiStatoZaino } = await import('./sincronizza.ts');
    const { updateProgress } = await import('../progress/store.ts');
    avviaZaino('http://localhost:8787');
    const codice = await crea();
    expect(fetch).toHaveBeenCalledTimes(1);

    updateProgress('star-wars', () => progressi(true));
    expect(leggiStatoZaino().inSospeso).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(1);
    anticipaSalvataggioZaino();
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    expect(leggiStatoZaino().fase).toBe('in-corso');

    updateProgress('lotr', () => progressi(true));
    anticipaSalvataggioZaino();
    expect(fetch).toHaveBeenCalledTimes(2);
    rispondi(new Response(null, { headers: { ETag: '"2"' } }));
    await vi.waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(3);
      expect(leggiStatoZaino()).toMatchObject({ fase: 'sincronizzato', inSospeso: false });
    });
    expect(fetch.mock.calls[2][1]?.headers).toMatchObject({ 'If-Match': '"2"' });
    const { chiave } = await derivaChiavi(codice);
    const blob = fetch.mock.calls[2][1]?.body;
    expect(await decifra(blob as ArrayBuffer, chiave)).toMatchObject({
      sezioni: { [NOME_SEZIONE]: { dati: { themes: { 'star-wars': progressi(true), lotr: progressi(true) } } } },
    });

    browser.onLine = false;
    updateProgress('lotr', () => progressi(false, 1));
    anticipaSalvataggioZaino();
    expect(leggiStatoZaino().inSospeso).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(3);

    // Evita un tentativo di rete durante la chiusura del test e ripulisce il timer.
    fetch.mockRejectedValueOnce(new TypeError('senza rete'));
    await esci();
    expect(leggiStatoZaino().fase).toBe('scollegato');
  } finally {
    vi.unstubAllGlobals();
  }
});
