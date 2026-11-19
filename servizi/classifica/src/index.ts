/**
 * Servizio della classifica di SQL Academy (piano docs/plans/portale-v1,
 * fase F16). Classifica pubblica per tema e generale (somma dei temi).
 *
 * Il partecipante si presenta con un gettone casuale di 256 bit
 * (`Authorization: Bearer <43 caratteri base64url>`), che il portale genera e
 * conserva nello zaino; il servizio ne conserva solo l’impronta SHA-256. Al
 * primo invio il servizio assegna un nome casuale, che non si cambia.
 *
 *   PUT    /v1/punteggio            progressi di uno o più temi → 200 · 401 · 413 · 422 · 429
 *   DELETE /v1/punteggio            esce dalla classifica: cancella nome e punti → 204 · 401
 *   GET    /v1/classifica[?tema=]   primi 50 → 200 · 400
 *   GET    /v1/posizione[?tema=]    nome, posizione e vicini → 200 · 401 · 404
 *
 * Corpo di PUT: `{ "themes": { "<tema>": <progressi del tema> } }`, con i
 * progressi nella forma del portale (`ThemeProgress`). I temi assenti non
 * cambiano. I punti li ricalcola `punti.ts`; un progresso impossibile è 422.
 * Se i punti di un tema crescono più in fretta di quanto uno studente possa
 * guadagnarli (CRESCITA), l’invio è 429 con `Retry-After` e nulla cambia:
 * riprovando più tardi passa.
 *
 * Protezioni: corpo fino a 128 KB, limite di frequenza per IP (binding
 * `LIMITE`), CORS solo per il portale, `Cache-Control` di un minuto sulla
 * classifica pubblica, partecipanti fermi da 18 mesi cancellati dal Cron
 * Trigger. Il Worker non scrive log e non conserva indirizzi né User-Agent.
 */

import { nomeACaso } from './nomi';
import { ricalcola, temaEsiste } from './punti';

export interface Env {
  DB: D1Database;
  LIMITE?: RateLimit;
}

const MAX_CORPO = 128 * 1024;
/** Un partecipante fermo da 18 mesi si cancella. */
const DURATA_MS = 548 * 24 * 60 * 60 * 1000;
/**
 * Crescita ammessa dei punti di un tema: SCATTO subito, più RITMO al minuto
 * dall’ultima volta che sono cambiati. 300 punti sono da 10 a 30 esercizi;
 * 60 al minuto sono due difficili al minuto, senza pause.
 */
const CRESCITA = { scatto: 300, ritmo: 60 };
const PRIMI = 50;
const VICINI = 2;

const ORIGINI = new Set(['http://localhost:5173']);

function intestazioniCors(origine: string | null): Headers {
  const h = new Headers();
  if (origine && ORIGINI.has(origine)) {
    h.set('Access-Control-Allow-Origin', origine);
    h.set('Access-Control-Expose-Headers', 'Retry-After');
  }
  h.set('Vary', 'Origin');
  return h;
}

function risposta(
  stato: number,
  origine: string | null,
  corpo: string | object | null = null,
  extra: Record<string, string> = {},
): Response {
  const h = intestazioniCors(origine);
  h.set('Cache-Control', 'no-store');
  for (const [k, v] of Object.entries(extra)) h.set(k, v);
  let testo: string | null = null;
  if (typeof corpo === 'string') {
    h.set('Content-Type', 'text/plain; charset=utf-8');
    testo = corpo;
  } else if (corpo !== null) {
    h.set('Content-Type', 'application/json; charset=utf-8');
    testo = JSON.stringify(corpo);
  }
  return new Response(testo, { status: stato, headers: h });
}

/** L’impronta del gettone di `Authorization: Bearer …`; null se manca o non è un gettone. */
async function impronta(richiesta: Request): Promise<string | null> {
  const m = richiesta.headers.get('Authorization')?.match(/^Bearer ([A-Za-z0-9_-]{43})$/);
  if (!m) return null;
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(m[1]));
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function leggiCorpo(richiesta: Request): Promise<string | 'troppo'> {
  const dichiarata = Number(richiesta.headers.get('Content-Length') ?? NaN);
  if (dichiarata > MAX_CORPO) return 'troppo';
  if (!richiesta.body) return '';
  const lettore = richiesta.body.getReader();
  const pezzi: Uint8Array[] = [];
  let totale = 0;
  for (;;) {
    const { done, value } = await lettore.read();
    if (done) break;
    totale += value.byteLength;
    if (totale > MAX_CORPO) {
      await lettore.cancel();
      return 'troppo';
    }
    pezzi.push(value);
  }
  const tutto = new Uint8Array(totale);
  let i = 0;
  for (const p of pezzi) {
    tutto.set(p, i);
    i += p.byteLength;
  }
  return new TextDecoder().decode(tutto);
}

interface Partecipante {
  id: number;
  nome: string;
  creato: number;
}

const cercaPartecipante = (env: Env, imp: string) =>
  env.DB.prepare('SELECT id, nome, creato FROM partecipanti WHERE impronta = ?')
    .bind(imp)
    .first<Partecipante>();

/** Il partecipante del gettone; al primo invio lo crea con un nome libero. */
async function partecipante(env: Env, imp: string, adesso: number): Promise<Partecipante> {
  for (let tentativo = 0; tentativo < 20; tentativo++) {
    const trovato = await cercaPartecipante(env, imp);
    if (trovato) return trovato;
    // Se il nome è già preso, o lo stesso gettone arriva due volte insieme,
    // non si inserisce nulla e si riprova: il secondo caso lo trova la SELECT.
    const creato = await env.DB.prepare(
      'INSERT INTO partecipanti (impronta, nome, creato, aggiornato) VALUES (?, ?, ?, ?) ' +
        'ON CONFLICT DO NOTHING RETURNING id, nome, creato',
    )
      .bind(imp, nomeACaso(), adesso, adesso)
      .first<Partecipante>();
    if (creato) return creato;
  }
  throw new Error('nessun nome libero');
}

async function invia(env: Env, imp: string, r: Request, o: string | null) {
  const testo = await leggiCorpo(r);
  if (testo === 'troppo') return risposta(413, o, 'corpo troppo grande');
  let corpo: unknown;
  try {
    corpo = JSON.parse(testo);
  } catch {
    return risposta(400, o, 'JSON non valido');
  }
  const themes = (corpo as { themes?: unknown } | null)?.themes;
  if (typeof themes !== 'object' || themes === null || Array.isArray(themes))
    return risposta(400, o, 'manca themes');

  const nuovi = new Map<string, number>();
  for (const [tema, progressi] of Object.entries(themes)) {
    const esito = ricalcola(tema, progressi);
    if (!esito.ok) return risposta(422, o, esito.motivo);
    nuovi.set(tema, esito.punti);
  }

  const adesso = Date.now();
  const p = await partecipante(env, imp, adesso);
  const { results: righe } = await env.DB.prepare(
    'SELECT tema, punti, raggiunto FROM punteggi WHERE partecipante = ?',
  )
    .bind(p.id)
    .all<{ tema: string; punti: number; raggiunto: number }>();
  const vecchi = new Map(righe.map((x) => [x.tema, x]));

  // Crescita: tutto o niente, così un invio respinto non lascia metà temi aggiornati.
  let attesa = 0;
  for (const [tema, punti] of nuovi) {
    const prima = vecchi.get(tema) ?? { punti: 0, raggiunto: p.creato };
    const salto = punti - prima.punti;
    const minuti = Math.max(0, adesso - prima.raggiunto) / 60_000;
    const ammesso = CRESCITA.scatto + CRESCITA.ritmo * minuti;
    if (salto > ammesso) attesa = Math.max(attesa, Math.ceil(((salto - ammesso) / CRESCITA.ritmo) * 60));
  }
  if (attesa > 0)
    return risposta(429, o, 'punti cresciuti troppo in fretta', { 'Retry-After': String(attesa) });

  const scritture = [
    env.DB.prepare('UPDATE partecipanti SET aggiornato = ? WHERE id = ?').bind(adesso, p.id),
  ];
  for (const [tema, punti] of nuovi) {
    if (vecchi.get(tema)?.punti === punti) continue;
    scritture.push(
      env.DB.prepare(
        'INSERT INTO punteggi (partecipante, tema, punti, raggiunto) VALUES (?, ?, ?, ?) ' +
          'ON CONFLICT (partecipante, tema) DO UPDATE SET punti = excluded.punti, raggiunto = excluded.raggiunto',
      ).bind(p.id, tema, punti, adesso),
    );
    vecchi.set(tema, { tema, punti, raggiunto: adesso });
  }
  await env.DB.batch(scritture);

  const punti = Object.fromEntries([...vecchi.values()].map((x) => [x.tema, x.punti]));
  const totale = Object.values(punti).reduce((a, b) => a + b, 0);
  return risposta(200, o, { name: p.nome, themes: punti, total: totale });
}

async function esci(env: Env, imp: string, o: string | null) {
  const p = await cercaPartecipante(env, imp);
  if (p)
    await env.DB.batch([
      env.DB.prepare('DELETE FROM punteggi WHERE partecipante = ?').bind(p.id),
      env.DB.prepare('DELETE FROM partecipanti WHERE id = ?').bind(p.id),
    ]);
  return risposta(204, o);
}

/**
 * La classifica come tabella `c (id, nome, punti, posizione)`: di un tema, o
 * generale. A pari punti viene prima chi li ha raggiunti prima. Il tema, se
 * c’è, è il parametro ?1.
 */
function classifica(tema: string | null): string {
  const sorgente = tema
    ? 'SELECT partecipante, punti, raggiunto FROM punteggi WHERE tema = ?1'
    : 'SELECT partecipante, SUM(punti) AS punti, MAX(raggiunto) AS raggiunto FROM punteggi GROUP BY partecipante';
  return (
    `WITH s AS (${sorgente}), c AS (SELECT p.id, p.nome, s.punti, ` +
    'ROW_NUMBER() OVER (ORDER BY s.punti DESC, s.raggiunto, p.id) AS posizione ' +
    'FROM s JOIN partecipanti p ON p.id = s.partecipante)'
  );
}

interface Riga {
  id: number;
  nome: string;
  punti: number;
  posizione: number;
}

const voce = (r: Riga) => ({ rank: r.posizione, name: r.nome, points: r.punti });

async function primi(env: Env, tema: string | null, o: string | null) {
  const q = env.DB.prepare(
    `${classifica(tema)} SELECT id, nome, punti, posizione FROM c WHERE posizione <= ${PRIMI} ORDER BY posizione`,
  );
  const { results } = await (tema ? q.bind(tema) : q).all<Riga>();
  return risposta(200, o, { theme: tema, entries: results.map(voce) }, { 'Cache-Control': 'public, max-age=60' });
}

async function posizione(env: Env, imp: string, tema: string | null, o: string | null) {
  const p = await cercaPartecipante(env, imp);
  if (!p) return risposta(404, o, 'non partecipi alla classifica');
  const id = tema ? '?2' : '?1';
  const q = env.DB.prepare(
    `${classifica(tema)}, me AS (SELECT posizione FROM c WHERE id = ${id}) ` +
      `SELECT c.id, nome, punti, c.posizione FROM c, me ` +
      `WHERE c.posizione BETWEEN me.posizione - ${VICINI} AND me.posizione + ${VICINI} ORDER BY c.posizione`,
  );
  const { results } = await (tema ? q.bind(tema, p.id) : q.bind(p.id)).all<Riga>();
  const io = results.find((r) => r.id === p.id);
  return risposta(200, o, {
    name: p.nome,
    theme: tema,
    rank: io?.posizione ?? null,
    points: io?.punti ?? 0,
    neighbors: results.map((r) => ({ ...voce(r), me: r.id === p.id })),
  });
}

export default {
  async fetch(richiesta: Request, env: Env): Promise<Response> {
    const url = new URL(richiesta.url);
    const origine = richiesta.headers.get('Origin');
    // Una pagina di un altro sito non deve poter usare il servizio. Le
    // richieste senza Origin (script, curl) passano: non sono un browser.
    if (origine && !ORIGINI.has(origine)) return risposta(403, null, 'origine non ammessa');

    const percorso = url.pathname;
    if (!['/v1/punteggio', '/v1/classifica', '/v1/posizione'].includes(percorso))
      return risposta(404, origine, 'non trovato');

    if (richiesta.method === 'OPTIONS') {
      const h = intestazioniCors(origine);
      if (origine) {
        h.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE');
        h.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
        h.set('Access-Control-Max-Age', '7200');
      }
      return new Response(null, { status: 204, headers: h });
    }

    if (env.LIMITE) {
      const ip = richiesta.headers.get('CF-Connecting-IP') ?? 'sconosciuto';
      const { success } = await env.LIMITE.limit({ key: ip });
      if (!success) return risposta(429, origine, 'troppe richieste', { 'Retry-After': '60' });
    }

    const tema = url.searchParams.get('tema');
    if (tema !== null && !temaEsiste(tema)) return risposta(400, origine, 'tema sconosciuto');

    const metodi = percorso === '/v1/punteggio' ? ['PUT', 'DELETE'] : ['GET'];
    if (!metodi.includes(richiesta.method))
      return risposta(405, origine, 'metodo non ammesso', { Allow: [...metodi, 'OPTIONS'].join(', ') });

    if (percorso === '/v1/classifica') return primi(env, tema, origine);

    const imp = await impronta(richiesta);
    if (!imp) return risposta(401, origine, 'gettone mancante o non valido');
    if (percorso === '/v1/posizione') return posizione(env, imp, tema, origine);
    return richiesta.method === 'PUT' ? invia(env, imp, richiesta, origine) : esci(env, imp, origine);
  },

  /** Cron Trigger giornaliero: via i partecipanti fermi da 18 mesi, con i loro punti. */
  async scheduled(_evento: ScheduledController, env: Env): Promise<void> {
    const limite = Date.now() - DURATA_MS;
    await env.DB.batch([
      env.DB.prepare(
        'DELETE FROM punteggi WHERE partecipante IN (SELECT id FROM partecipanti WHERE aggiornato < ?)',
      ).bind(limite),
      env.DB.prepare('DELETE FROM partecipanti WHERE aggiornato < ?').bind(limite),
    ]);
  },
} satisfies ExportedHandler<Env>;
