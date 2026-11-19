/**
 * Prova del servizio della classifica (piano docs/plans/portale-v1, fase
 * F16): protocollo, ricalcolo dei punti, controlli di plausibilità e CORS,
 * contro un servizio vivo.
 *
 * Uso: npm run prova -- http://localhost:8787
 *
 * Iscrive due partecipanti con gettoni casuali e li cancella alla fine. Esce
 * con 1 se un caso fallisce, 2 se il servizio non risponde.
 */
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { readFileSync } from 'node:fs';

const BASE = (process.argv[2] ?? 'http://localhost:8787').replace(/\/$/, '');
const PORTALE = 'http://localhost:5173';
const DATI = JSON.parse(readFileSync(new URL('./src/esercizi.json', import.meta.url), 'utf8'));

const esiti = [];
async function caso(nome, fn) {
  try {
    await fn();
    esiti.push({ nome, ok: true });
  } catch (e) {
    esiti.push({ nome, ok: false, errore: e.message.split('\n')[0] });
  }
}

const gettone = () => randomBytes(32).toString('base64url');
const io = gettone();
const altro = gettone();

function chiama(percorso, { metodo = 'GET', gettone: g, corpo, intestazioni = {} } = {}) {
  const h = { ...intestazioni };
  if (g) h.Authorization = `Bearer ${g}`;
  if (corpo !== undefined) h['Content-Type'] = 'application/json';
  return fetch(`${BASE}${percorso}`, {
    method: metodo,
    headers: h,
    body: corpo === undefined ? undefined : typeof corpo === 'string' ? corpo : JSON.stringify(corpo),
  });
}

const invia = (g, themes) => chiama('/v1/punteggio', { metodo: 'PUT', gettone: g, corpo: { themes } });

/** Il primo esercizio di `tema` con quella difficoltà, escludendo quelli già usati. */
const usati = new Set();
function esercizio(tema, difficolta) {
  const [id, es] = Object.entries(DATI.themes[tema]).find(
    ([id, es]) => es.difficulty === difficolta && es.hints >= 2 && !usati.has(`${tema}/${id}`),
  );
  usati.add(`${tema}/${id}`);
  return { id, ...es };
}

const stato = (x) => ({ solved: false, hintsRevealed: 0, solutionBeforeSolve: false, pointsSpent: 0, ...x });

const sw = {
  facile: esercizio('star-wars', 'facile'),
  medio: esercizio('star-wars', 'medio'),
  difficile: esercizio('star-wars', 'difficile'),
  altro: esercizio('star-wars', 'facile'),
};

// Atteso: 10 (facile risolto) + 20 − 5 (medio risolto con un suggerimento pagato)
// + 0 (difficile non risolto, aiuto gratuito) = 25.
const giusti = {
  freeHintUsed: true,
  exercises: {
    [sw.facile.id]: stato({ solved: true, attempts: 3, lastQuery: 'SELECT 1' }),
    [sw.medio.id]: stato({ solved: true, hintsRevealed: 1, pointsSpent: 5 }),
    [sw.difficile.id]: stato({ hintsRevealed: 1 }),
  },
};

/** I progressi giusti con un esercizio cambiato. */
const con = (id, x, extra = {}) => ({
  ...giusti,
  ...extra,
  exercises: { ...giusti.exercises, [id]: stato(x) },
});

async function main() {
  try {
    await fetch(`${BASE}/v1/classifica`);
  } catch (e) {
    console.error(`Il servizio ${BASE} non risponde (${e.message}).`);
    process.exit(2);
  }

  await caso('classifica pubblica senza gettone → 200, cache di un minuto', async () => {
    const r = await chiama('/v1/classifica');
    assert.equal(r.status, 200);
    assert.equal(r.headers.get('Cache-Control'), 'public, max-age=60');
    const c = await r.json();
    assert.equal(c.theme, null);
    assert.ok(Array.isArray(c.entries));
  });

  await caso('tema sconosciuto nella classifica → 400', async () => {
    assert.equal((await chiama('/v1/classifica?tema=hogwarts')).status, 400);
  });

  await caso('invio senza gettone → 401', async () => {
    assert.equal((await invia(undefined, {})).status, 401);
  });

  await caso('gettone sbagliato (troppo corto) → 401', async () => {
    assert.equal((await invia('abc', {})).status, 401);
    assert.equal((await chiama('/v1/posizione', { gettone: `${io}=` })).status, 401);
  });

  await caso('posizione di un gettone mai visto → 404', async () => {
    assert.equal((await chiama('/v1/posizione', { gettone: io })).status, 404);
  });

  let nome = null;
  await caso('iscrizione: nome assegnato, zero punti', async () => {
    const r = await invia(io, { 'star-wars': { freeHintUsed: false, exercises: {} } });
    assert.equal(r.status, 200);
    const c = await r.json();
    assert.match(c.name, /^\p{Lu}\p{Ll}+ \p{Lu}\p{Ll}+ \d{2}$/u);
    assert.deepEqual(c.themes, { 'star-wars': 0 });
    nome = c.name;
  });

  await caso('punteggio corretto ricalcolato: 25, stesso nome', async () => {
    const r = await invia(io, { 'star-wars': giusti });
    assert.equal(r.status, 200);
    const c = await r.json();
    assert.equal(c.name, nome);
    assert.deepEqual(c.themes, { 'star-wars': 25 });
    assert.equal(c.total, 25);
  });

  await caso('i punti guadagnati dichiarati si ignorano', async () => {
    const r = await invia(io, {
      'star-wars': con(sw.facile.id, { solved: true, pointsEarned: 9999 }),
    });
    assert.equal(r.status, 200);
    assert.equal((await r.json()).total, 25);
  });

  const impossibili = [
    ['tema sconosciuto', { hogwarts: { freeHintUsed: false, exercises: {} } }],
    ['esercizio sconosciuto', { 'star-wars': con('ex-999', { solved: true }) }],
    ['suggerimenti oltre il numero', { 'star-wars': con(sw.altro.id, { hintsRevealed: sw.altro.hints + 1 }) }],
    [
      'soluzione senza tutti i suggerimenti',
      { 'star-wars': con(sw.altro.id, { solved: true, solutionBeforeSolve: true, hintsRevealed: 1, pointsSpent: 23 }) },
    ],
    ['spesa che nessun acquisto dà', { 'star-wars': con(sw.altro.id, { solved: true, hintsRevealed: 1, pointsSpent: 4 }) }],
    ['suggerimenti aperti non pagati', { 'star-wars': con(sw.altro.id, { hintsRevealed: 2, pointsSpent: 0 }) }],
    ['due aiuti gratuiti', { 'star-wars': con(sw.altro.id, { hintsRevealed: 1, pointsSpent: 0 }) }],
    [
      'aiuto gratuito senza averlo usato',
      { 'star-wars': { ...giusti, freeHintUsed: false } },
    ],
    [
      'saldo negativo',
      {
        'star-wars': {
          freeHintUsed: true,
          exercises: { [sw.altro.id]: stato({ hintsRevealed: 2, pointsSpent: 3 }) },
        },
      },
    ],
    ['campo non valido', { 'star-wars': con(sw.altro.id, { solved: 'sì' }) }],
  ];
  for (const [nomeCaso, themes] of impossibili)
    await caso(`impossibile: ${nomeCaso} → 422`, async () => {
      const r = await invia(io, themes);
      assert.equal(r.status, 422, await r.text());
    });

  await caso('dopo i rifiuti i punti sono ancora 25', async () => {
    const c = await (await chiama('/v1/posizione?tema=star-wars', { gettone: io })).json();
    assert.equal(c.points, 25);
  });

  await caso('corpo non JSON → 400, corpo oltre 128 KB → 413', async () => {
    assert.equal((await chiama('/v1/punteggio', { metodo: 'PUT', gettone: io, corpo: '{' })).status, 400);
    const r = await chiama('/v1/punteggio', { metodo: 'PUT', gettone: io, corpo: 'x'.repeat(129 * 1024) });
    assert.equal(r.status, 413);
  });

  await caso('crescita troppo rapida → 429 con Retry-After, nulla cambia', async () => {
    const tutti = Object.fromEntries(Object.keys(DATI.themes['star-wars']).map((id) => [id, stato({ solved: true })]));
    const r = await invia(io, { 'star-wars': { freeHintUsed: false, exercises: tutti } });
    assert.equal(r.status, 429);
    assert.ok(Number(r.headers.get('Retry-After')) > 60);
    const c = await (await chiama('/v1/posizione?tema=star-wars', { gettone: io })).json();
    assert.equal(c.points, 25);
  });

  await caso('un tema in più non cambia gli altri; la generale li somma', async () => {
    const lotr = esercizio('lotr', 'difficile');
    const r = await invia(io, {
      lotr: { freeHintUsed: false, exercises: { [lotr.id]: stato({ solved: true }) } },
    });
    assert.equal(r.status, 200);
    const c = await r.json();
    assert.deepEqual(c.themes, { 'star-wars': 25, lotr: 30 });
    assert.equal(c.total, 55);
  });

  await caso('un secondo partecipante ha un altro nome', async () => {
    const r = await invia(altro, { 'star-wars': { freeHintUsed: false, exercises: { [sw.facile.id]: stato({ solved: true }) } } });
    assert.equal(r.status, 200);
    assert.notEqual((await r.json()).name, nome);
  });

  await caso('classifica del tema e generale mostrano nome e punti', async () => {
    const tema = await (await chiama('/v1/classifica?tema=star-wars')).json();
    assert.equal(tema.theme, 'star-wars');
    assert.equal(tema.entries.find((e) => e.name === nome)?.points, 25);
    const generale = await (await chiama('/v1/classifica')).json();
    assert.equal(generale.entries.find((e) => e.name === nome)?.points, 55);
    assert.ok(generale.entries.length <= 50);
    assert.ok(Object.keys(generale.entries[0]).sort().join() === 'name,points,rank');
  });

  await caso('posizione: nome, posizione e vicini, con «me»', async () => {
    const c = await (await chiama('/v1/posizione', { gettone: io })).json();
    assert.equal(c.name, nome);
    assert.equal(c.points, 55);
    assert.ok(c.rank >= 1);
    const me = c.neighbors.filter((v) => v.me);
    assert.equal(me.length, 1);
    assert.equal(me[0].rank, c.rank);
    assert.ok(c.neighbors.length <= 5);
  });

  await caso('CORS: preflight dal portale ammesso, Authorization compresa', async () => {
    const r = await chiama('/v1/punteggio', {
      metodo: 'OPTIONS',
      intestazioni: {
        Origin: PORTALE,
        'Access-Control-Request-Method': 'PUT',
        'Access-Control-Request-Headers': 'authorization, content-type',
      },
    });
    assert.equal(r.status, 204);
    assert.equal(r.headers.get('Access-Control-Allow-Origin'), PORTALE);
    assert.match(r.headers.get('Access-Control-Allow-Headers'), /Authorization/);
    assert.match(r.headers.get('Access-Control-Allow-Methods'), /PUT/);
  });

  await caso('CORS: risposta al portale con Allow-Origin', async () => {
    const r = await chiama('/v1/classifica', { intestazioni: { Origin: PORTALE } });
    assert.equal(r.status, 200);
    assert.equal(r.headers.get('Access-Control-Allow-Origin'), PORTALE);
  });

  await caso('CORS: un altro sito → 403', async () => {
    const r = await chiama('/v1/classifica', { intestazioni: { Origin: 'https://esempio.it' } });
    assert.equal(r.status, 403);
    assert.equal(r.headers.get('Access-Control-Allow-Origin'), null);
  });

  await caso('metodo sbagliato → 405, percorso sbagliato → 404', async () => {
    assert.equal((await chiama('/v1/classifica', { metodo: 'DELETE' })).status, 405);
    assert.equal((await chiama('/v1/altro')).status, 404);
  });

  await caso('uscita dalla classifica → 204, poi 404 e nome sparito', async () => {
    const r = await chiama('/v1/punteggio', { metodo: 'DELETE', gettone: io });
    assert.equal(r.status, 204);
    assert.equal((await chiama('/v1/posizione', { gettone: io })).status, 404);
    const generale = await (await chiama('/v1/classifica')).json();
    assert.equal(generale.entries.find((e) => e.name === nome), undefined);
  });

  await caso('seconda uscita → 204 (nulla da cancellare)', async () => {
    assert.equal((await chiama('/v1/punteggio', { metodo: 'DELETE', gettone: io })).status, 204);
  });

  await chiama('/v1/punteggio', { metodo: 'DELETE', gettone: altro });

  for (const e of esiti) console.log(`${e.ok ? '✓' : '✗'} ${e.nome}${e.ok ? '' : `\n    ${e.errore}`}`);
  const falliti = esiti.filter((e) => !e.ok).length;
  console.log(`\n${esiti.length - falliti} superati, ${falliti} falliti.`);
  process.exit(falliti ? 1 : 0);
}

await main();
