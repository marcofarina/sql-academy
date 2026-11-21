/**
 * Sincronizzazione dello zaino. Copiata dal libro *Python Doesn’t Byte*
 * (`src/lib/zaino/sincronizza.ts`, piano `pm/piano-2026-11-quaderno.md` del suo
 * repo) e adattata (F15 del piano `portale-v1`): stesso protocollo, quindi lo
 * stesso zaino del libro. Rispetto al libro mancano «Cancella lo zaino» e
 * «Cambia codice», che lo studente trova sulla pagina `/zaino` del libro.
 *
 * Il server conserva un blob cifrato e una versione; unisce il client:
 *
 *   GET → decifra → unisciContenuti(locale, remoto) → ogni sezione nota porta
 *   la sua parte in locale → se il risultato differisce dal remoto, PUT con
 *   If-Match (If-None-Match: * se lo zaino non esiste ancora); su 412 si
 *   ricomincia, al massimo 3 volte.
 *
 * In `sql-academy:zaino` (storage dell'area corrente) restano il codice, la versione
 * e l'ultimo contenuto visto sul server (`ultimo`), che porta le sezioni che
 * questo client non sa leggere: ripartono intatte a ogni PUT. Con `ultimo`,
 * dopo una modifica locale basta il PUT (una richiesta invece di due); il GET
 * serve al caricamento, al ritorno sulla scheda e dopo un 412.
 *
 * Quando: al caricamento, quando la scheda torna visibile (non prima di 30 s
 * dall'ultima lettura), dopo una risposta corretta o 5 s dopo le altre
 * modifiche, quando la scheda si nasconde (`keepalive` sotto i 64 KB) e quando
 * torna la rete. Sugli errori, attese crescenti: 30 s, 1, 2, 5, poi 15 minuti.
 *
 * Un 404 su uno zaino che questo dispositivo ha già visto vuol dire che lo
 * zaino è stato cancellato (dal libro con «Cancella lo zaino» o «Cambia
 * codice», oppure dopo 18 mesi fermo): non si ricrea, perché ridarebbe vita a un codice che lo
 * studente ha voluto buttare.
 */
import { useSyncExternalStore } from 'react';

import { areaCorrente, impostaTemporanea, storageDi } from './area';
import {
  cifra,
  decifra,
  derivaChiavi,
  normalizzaCodice,
  nuovoCodice,
  zainoSupportato,
  type Chiavi,
} from './cifra';
import {
  canonico,
  registraSezione,
  sezioniRegistrate,
  tipoSezione,
  unisciContenuti,
  validaContenuto,
} from './sezioni';
import {
  contenutoVuoto,
  type ContenutoZaino,
  type Sezione,
  type TipoSezione,
} from './tipi';

export const CHIAVE_ZAINO = 'sql-academy:zaino';
/** Dimensione massima di un blob, come nel servizio. */
export const MAX_BLOB = 256 * 1024;
/** Oltre questa dimensione `fetch` non accetta `keepalive`. */
const MAX_KEEPALIVE = 64 * 1024;
const RITARDO_MODIFICA = 5000;
const INTERVALLO_LETTURA = 30_000;
const ATTESE = [30_000, 60_000, 120_000, 300_000, 900_000];
const TENTATIVI = 3;

export type FaseZaino =
  | 'scollegato'
  | 'sincronizzato'
  | 'in-corso'
  | 'offline'
  | 'errore';

/**
 * - `servizio`: 5xx, 429, quota esaurita; si riprova da sé.
 * - `pieno`: il contenuto cifrato supera i 256 KB.
 * - `cancellato`: lo zaino non c'è più sul server.
 * - `aggiorna`: lo zaino l'ha scritto un sito più nuovo; ricaricare la pagina.
 * - `illeggibile`: il blob non si decifra con questo codice.
 */
export type MotivoErrore =
  | 'servizio'
  | 'pieno'
  | 'cancellato'
  | 'aggiorna'
  | 'illeggibile';

export interface StatoZaino {
  /** Il browser ha crypto.subtle e CompressionStream (https o localhost). */
  supportato: boolean;
  fase: FaseZaino;
  motivo: MotivoErrore | null;
  /** Ci sono modifiche locali non ancora nello zaino. */
  inSospeso: boolean;
  /** Byte dell'ultimo blob letto o scritto, su MAX_BLOB. */
  byte: number | null;
  /** ISO 8601 dell'ultima sincronizzazione riuscita. */
  ultima: string | null;
}

interface Memoria {
  codice: string;
  /** null finché lo zaino non è stato visto sul server. */
  versione: number | null;
  ultimo: ContenutoZaino | null;
}

const STATO_SERVER: StatoZaino = {
  supportato: false,
  fase: 'scollegato',
  motivo: null,
  inSospeso: false,
  byte: null,
  ultima: null,
};

let servizio = '';
let avviato = false;
let stato: StatoZaino = STATO_SERVER;
let memoriaInRam: Memoria | null = null;
let chiaviCache: { codice: string; chiavi: Promise<Chiavi> } | null = null;
let corrente: Promise<void> | null = null;
let ancora: OpzioniCiclo | null = null;
let applicando = false;
let timerModifica: ReturnType<typeof setTimeout> | null = null;
let timerRiprova: ReturnType<typeof setTimeout> | null = null;
let attesa = 0;
/** Conta le modifiche locali: dice se ne sono arrivate durante un ciclo. */
let modifiche = 0;
let ultimaLettura = 0;
const seguite = new Set<string>();
const ascoltatori = new Set<() => void>();

/* -------------------------------------------------------------- stato */

function cambiaStato(cambi: Partial<StatoZaino>): void {
  const nuovo = { ...stato, ...cambi };
  if (canonico(nuovo) === canonico(stato)) return;
  stato = nuovo;
  for (const f of ascoltatori) f();
}

function iscriviti(f: () => void): () => void {
  ascoltatori.add(f);
  return () => ascoltatori.delete(f);
}

export function leggiStatoZaino(): StatoZaino {
  return stato;
}

function iscrivitiRete(f: () => void): () => void {
  window.addEventListener('online', f);
  window.addEventListener('offline', f);
  return () => {
    window.removeEventListener('online', f);
    window.removeEventListener('offline', f);
  };
}

/** Stato per l’interfaccia: la rete assente è visibile anche fra due salvataggi. */
export function useStatoZaino(): StatoZaino {
  const stato = useSyncExternalStore(iscriviti, leggiStatoZaino, () => STATO_SERVER);
  const online = useSyncExternalStore(iscrivitiRete, () => navigator.onLine, () => true);
  if (!online && (stato.fase === 'sincronizzato' || stato.fase === 'in-corso')) {
    return { ...stato, fase: 'offline' };
  }
  return stato;
}

/* ------------------------------------------------------------ memoria */

function leggiMemoria(): Memoria | null {
  const storage = storageDi();
  if (!storage) return memoriaInRam;
  try {
    const m = JSON.parse(storage.getItem(CHIAVE_ZAINO) ?? 'null') as Memoria;
    if (!m || typeof m.codice !== 'string') return null;
    return {
      codice: m.codice,
      versione: typeof m.versione === 'number' ? m.versione : null,
      ultimo: m.ultimo ? validaContenuto(m.ultimo) : null,
    };
  } catch {
    return memoriaInRam;
  }
}

function salvaMemoria(m: Memoria | null): void {
  memoriaInRam = m;
  try {
    const storage = storageDi();
    if (!storage) return;
    if (m) storage.setItem(CHIAVE_ZAINO, JSON.stringify(m));
    else storage.removeItem(CHIAVE_ZAINO);
  } catch {
    /* storage pieno o negato: resta la copia in memoria */
  }
}

function chiaviDi(codice: string): Promise<Chiavi> {
  if (chiaviCache?.codice !== codice)
    chiaviCache = { codice, chiavi: derivaChiavi(codice) };
  return chiaviCache.chiavi;
}

/** Il codice dello zaino collegato, per «Mostra il codice». */
export function codiceZaino(): string | null {
  return leggiMemoria()?.codice ?? null;
}

/** Il codice collegato, che si aggiorna a ogni cambio di stato dello zaino. */
export function useCodiceZaino(): string | null {
  return useSyncExternalStore(iscriviti, codiceZaino, () => null);
}

/* ------------------------------------------------------------ sezioni */

function adesso(dopo?: string): string {
  const prima = dopo ? Date.parse(dopo) : NaN;
  const t = Date.now();
  return new Date(
    Number.isNaN(prima) || t > prima ? t : prima + 1,
  ).toISOString();
}

function leggibile(tipo: TipoSezione<unknown>, s: Sezione): unknown {
  return s.formato <= tipo.formato ? tipo.valida(s.dati) : null;
}

/**
 * Il contenuto di questo dispositivo: le sezioni registrate lette dallo
 * storage, più le sezioni che questo client non sa leggere, come erano
 * nell'ultimo contenuto visto sul server.
 */
function contenutoLocale(ultimo: ContenutoZaino | null): ContenutoZaino {
  const sezioni: Record<string, Sezione> = {};
  for (const [nome, s] of Object.entries(ultimo?.sezioni ?? {})) {
    const tipo = tipoSezione(nome);
    if (!tipo || s.formato > tipo.formato) sezioni[nome] = s;
  }
  for (const tipo of sezioniRegistrate()) {
    if (sezioni[tipo.nome]) continue;
    const dati = tipo.leggi();
    const prec = ultimo?.sezioni[tipo.nome];
    const datiPrec = prec ? leggibile(tipo, prec) : null;
    const uguale =
      datiPrec !== null &&
      canonico(tipo.unisci(dati, dati)) ===
        canonico(tipo.unisci(datiPrec, datiPrec));
    sezioni[tipo.nome] = {
      formato: tipo.formato,
      modificata: uguale && prec ? prec.modificata : adesso(prec?.modificata),
      dati,
    };
  }
  return { formato: 1, sezioni };
}

function pota(c: ContenutoZaino): ContenutoZaino {
  const sezioni = { ...c.sezioni };
  for (const tipo of sezioniRegistrate()) {
    const s = sezioni[tipo.nome];
    if (!s || !tipo.pota || s.formato > tipo.formato) continue;
    const dati = tipo.pota(s.dati, Date.now());
    if (dati !== s.dati) sezioni[tipo.nome] = { ...s, dati };
  }
  return { formato: 1, sezioni };
}

/** Porta in locale la parte di ogni sezione registrata. */
function applica(c: ContenutoZaino): void {
  applicando = true;
  try {
    for (const tipo of sezioniRegistrate()) {
      const s = c.sezioni[tipo.nome];
      if (!s) continue;
      const dati = leggibile(tipo, s);
      if (dati !== null) tipo.scrivi(dati);
    }
  } finally {
    applicando = false;
  }
}

/* ---------------------------------------------------------- protocollo */

class ErroreServizio extends Error {
  readonly status: number;
  constructor(status: number) {
    super(`zaino: HTTP ${status}`);
    this.status = status;
  }
}

class Fermo extends Error {
  readonly motivo: MotivoErrore;
  constructor(motivo: MotivoErrore) {
    super(`zaino: ${motivo}`);
    this.motivo = motivo;
  }
}

const indirizzo = (id: string) => `${servizio}/v1/zaino/${id}`;

function versioneDa(r: Response): number {
  const v = Number(r.headers.get('ETag')?.replace(/^W\/|"/g, ''));
  if (!Number.isInteger(v)) throw new ErroreServizio(r.status);
  return v;
}

interface Letto {
  contenuto: ContenutoZaino;
  versione: number;
  byte: number;
}

/** GET; null su 404. */
async function leggiRemoto(chiavi: Chiavi): Promise<Letto | null> {
  const r = await fetch(indirizzo(chiavi.id), { cache: 'no-store' });
  if (r.status === 404) return null;
  if (!r.ok) throw new ErroreServizio(r.status);
  const versione = versioneDa(r);
  const blob = await r.arrayBuffer();
  let grezzo: unknown;
  try {
    grezzo = await decifra(blob, chiavi.chiave);
  } catch {
    throw new Fermo('illeggibile');
  }
  const formato = (grezzo as { formato?: unknown } | null)?.formato;
  if (typeof formato === 'number' && formato > 1) throw new Fermo('aggiorna');
  const contenuto = validaContenuto(grezzo);
  if (!contenuto) throw new Fermo('illeggibile');
  ultimaLettura = Date.now();
  return { contenuto, versione, byte: blob.byteLength };
}

/** Cifra una copia e la scrive solo se la versione sul servizio coincide. */
async function scriviRemoto(contenuto: ContenutoZaino, chiavi: Chiavi, versione: number | null, keepalive = false) {
  const blob = await cifra(contenuto, chiavi.chiave);
  const byte = blob.byteLength;
  if (byte > MAX_BLOB) {
    if (versione !== null || leggiMemoria()) cambiaStato({ byte });
    throw new Fermo('pieno');
  }
  const risposta = await fetch(indirizzo(chiavi.id), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/octet-stream',
      ...(versione === null ? { 'If-None-Match': '*' } : { 'If-Match': `"${versione}"` }),
    },
    body: blob,
    keepalive: keepalive && byte < MAX_KEEPALIVE,
  });
  if (risposta.status === 413) throw new Fermo('pieno');
  return { risposta, byte };
}

interface OpzioniCiclo {
  /** Rileggere il server anche se si conosce l'ultima versione. */
  completa: boolean;
  /** Anticipo dopo una risposta corretta: vale solo se c’è ancora da scrivere e si può tentare. */
  anticipata?: boolean;
  /** La scheda si sta nascondendo: `keepalive`. */
  keepalive?: boolean;
  /** Già letto da `apri`. */
  letto?: Letto;
}

async function ciclo(o: OpzioniCiclo): Promise<void> {
  const m = leggiMemoria();
  if (!m) return;
  const chiavi = await chiaviDi(m.codice);
  cambiaStato({ fase: 'in-corso', motivo: null });
  let rileggi = o.completa || m.versione === null || !m.ultimo;
  let letto = o.letto ?? null;
  for (let tentativo = 0; tentativo < TENTATIVI; tentativo += 1) {
    let remoto: ContenutoZaino | null;
    let versione: number | null;
    if (letto) {
      ({ contenuto: remoto, versione } = letto);
      cambiaStato({ byte: letto.byte });
      letto = null;
    } else if (rileggi) {
      const r = await leggiRemoto(chiavi);
      if (!r && m.versione !== null) throw new Fermo('cancellato');
      remoto = r?.contenuto ?? null;
      versione = r?.versione ?? null;
      if (r) cambiaStato({ byte: r.byte });
    } else {
      remoto = m.ultimo;
      versione = m.versione;
    }

    const unito = pota(
      unisciContenuti(contenutoLocale(remoto), remoto ?? contenutoVuoto()),
    );
    applica(unito);

    if (remoto && versione !== null && canonico(unito) === canonico(remoto)) {
      m.versione = versione;
      m.ultimo = remoto;
      salvaMemoria(m);
      return;
    }

    const { risposta: r, byte } = await scriviRemoto(unito, chiavi, versione, o.keepalive);
    if (r.status === 412) {
      rileggi = true;
      continue;
    }
    if (!r.ok) throw new ErroreServizio(r.status);
    m.versione = versioneDa(r);
    m.ultimo = unito;
    salvaMemoria(m);
    cambiaStato({ byte });
    return;
  }
  throw new ErroreServizio(412);
}

function programmaRiprova(): void {
  if (timerRiprova) clearTimeout(timerRiprova);
  const ms = ATTESE[Math.min(attesa, ATTESE.length - 1)];
  attesa += 1;
  timerRiprova = setTimeout(() => {
    timerRiprova = null;
    void sincronizza({ completa: true });
  }, ms);
}

/** Un ciclo alla volta; le richieste che arrivano nel frattempo si accodano in una. */
function sincronizza(o: OpzioniCiclo): Promise<void> {
  if (o.anticipata && (!stato.inSospeso || bloccato() || timerRiprova || navigator.onLine === false)) {
    return Promise.resolve();
  }
  if (corrente) {
    ancora = {
      completa: o.completa || !!ancora?.completa,
      keepalive: o.keepalive || ancora?.keepalive,
      anticipata: o.anticipata && (ancora === null || ancora.anticipata),
    };
    return corrente;
  }
  if (!leggiMemoria()) return Promise.resolve();
  if (timerModifica) clearTimeout(timerModifica);
  timerModifica = null;
  const modificheAllInizio = modifiche;
  corrente = (async () => {
    try {
      await ciclo(o);
      attesa = 0;
      if (timerRiprova) clearTimeout(timerRiprova);
      timerRiprova = null;
      cambiaStato({
        fase: 'sincronizzato',
        motivo: null,
        inSospeso: modifiche !== modificheAllInizio,
        ultima: new Date().toISOString(),
      });
    } catch (e) {
      if (!leggiMemoria()) {
        cambiaStato({ fase: 'scollegato', motivo: null });
      } else if (e instanceof Fermo) {
        cambiaStato({ fase: 'errore', motivo: e.motivo });
      } else if (e instanceof ErroreServizio) {
        cambiaStato({ fase: 'errore', motivo: 'servizio' });
        programmaRiprova();
      } else {
        // fetch rifiutata: niente rete (o servizio irraggiungibile).
        cambiaStato({ fase: 'offline', motivo: null });
        programmaRiprova();
      }
    } finally {
      corrente = null;
    }
    const dopo = ancora;
    ancora = null;
    if (dopo && leggiMemoria()) await sincronizza(dopo);
  })();
  return corrente;
}

/* ------------------------------------------------------------ eventi */

function suModificaLocale(): void {
  if (applicando || !leggiMemoria()) return;
  modifiche += 1;
  cambiaStato({ inSospeso: true });
  // Dopo un errore decide l'attesa crescente: le modifiche partono con il
  // prossimo tentativo, non ogni 5 secondi.
  if (bloccato() || timerRiprova) return;
  if (timerModifica) clearTimeout(timerModifica);
  timerModifica = setTimeout(() => {
    timerModifica = null;
    void sincronizza({ completa: false });
  }, RITARDO_MODIFICA);
}

function segui(tipo: TipoSezione<unknown>): void {
  if (seguite.has(tipo.nome)) return;
  seguite.add(tipo.nome);
  tipo.iscriviti(suModificaLocale);
}

function suVisibilita(): void {
  if (!leggiMemoria() || bloccato()) return;
  if (document.visibilityState === 'hidden') {
    if (stato.inSospeso && !timerRiprova)
      void sincronizza({ completa: false, keepalive: true });
  } else if (Date.now() - ultimaLettura > INTERVALLO_LETTURA) {
    void sincronizza({ completa: true });
  }
}

function suStorage(e: StorageEvent): void {
  if (e.key !== CHIAVE_ZAINO || e.storageArea !== storageDi()) return;
  // Un'altra scheda ha aperto, chiuso o sincronizzato lo zaino.
  if (e.newValue === null) {
    fermaTimer();
    cambiaStato({ fase: 'scollegato', motivo: null, inSospeso: false });
  } else if (stato.fase === 'scollegato') {
    void sincronizza({ completa: true });
  }
}

function suRete(): void {
  if (!leggiMemoria() || bloccato()) return;
  attesa = 0;
  void sincronizza({ completa: true });
}

function bloccato(): boolean {
  return stato.motivo === 'cancellato' || stato.motivo === 'aggiorna';
}

function fermaTimer(): void {
  if (timerModifica) clearTimeout(timerModifica);
  if (timerRiprova) clearTimeout(timerRiprova);
  timerModifica = null;
  timerRiprova = null;
  attesa = 0;
}

/* -------------------------------------------------------------- API */

export type EsitoApri =
  | 'aperto'
  | 'non-supportato'
  | 'gia-collegato'
  | 'codice-non-valido'
  | 'inesistente'
  | 'offline'
  | 'servizio'
  | 'illeggibile'
  | 'aggiorna';

/** Anticipa la scrittura dopo aver registrato una risposta corretta nei progressi locali. */
export function anticipaSalvataggioZaino(): void {
  void sincronizza({ completa: false, anticipata: true });
}

let collegamentoInCorso = false;

/** Il servizio ha già uno zaino con il codice confermato. */
export class CodiceGiaUsato extends Error {}

/** Crea uno zaino con i dati locali e collega il browser solo dopo la conferma del servizio. */
export async function crea(confermato?: string): Promise<string> {
  if (!zainoSupportato()) throw new Error('zaino: browser non supportato');
  if (leggiMemoria() || collegamentoInCorso) throw new Error('zaino: collegamento già avviato');
  if (confermato !== undefined && (!confermato.includes('-') || normalizzaCodice(confermato) !== confermato)) {
    throw new Error('zaino: codice nuovo non valido');
  }
  collegamentoInCorso = true;
  try {
    for (let tentativo = 0; tentativo < TENTATIVI; tentativo += 1) {
      const codice = confermato ?? nuovoCodice();
      const chiavi = await derivaChiavi(codice);
      const ultimo = pota(contenutoLocale(null));
      const { risposta, byte } = await scriviRemoto(ultimo, chiavi, null);
      if (risposta.status === 412) {
        if (confermato !== undefined) throw new CodiceGiaUsato();
        continue;
      }
      if (!risposta.ok) throw new ErroreServizio(risposta.status);
      const versione = versioneDa(risposta);
      if (leggiMemoria()) throw new Error('zaino: già collegato in un’altra scheda');
      fermaTimer();
      salvaMemoria({ codice, versione, ultimo });
      chiaviCache = { codice, chiavi: Promise.resolve(chiavi) };
      cambiaStato({ fase: 'sincronizzato', motivo: null, ultima: new Date().toISOString(), byte, inSospeso: false });
      // I progressi possono cambiare mentre aspettiamo la risposta del servizio.
      if (canonico(pota(contenutoLocale(ultimo))) !== canonico(ultimo)) suModificaLocale();
      return codice;
    }
    throw new CodiceGiaUsato();
  } finally {
    collegamentoInCorso = false;
  }
}

export interface OpzioniApri {
  /**
   * «Non è il mio computer»: codice, zaino e sezioni stanno in
   * `sessionStorage` e spariscono con la scheda; `localStorage` non si tocca.
   */
  temporaneo?: boolean;
}

/** Collega questo dispositivo a uno zaino che esiste già. */
export async function apri(
  scritto: string,
  opzioni: OpzioniApri = {},
): Promise<EsitoApri> {
  if (!zainoSupportato()) return 'non-supportato';
  if (leggiMemoria() || collegamentoInCorso) return 'gia-collegato';
  const codice = normalizzaCodice(scritto);
  if (!codice) return 'codice-non-valido';
  collegamentoInCorso = true;
  try {
    const chiavi = await chiaviDi(codice);
    let letto: Letto | null;
    try {
      letto = await leggiRemoto(chiavi);
    } catch (e) {
      if (e instanceof Fermo)
        return e.motivo === 'aggiorna' ? 'aggiorna' : 'illeggibile';
      return e instanceof ErroreServizio ? 'servizio' : 'offline';
    }
    if (!letto) return 'inesistente';
    if (leggiMemoria()) return 'gia-collegato';
    // Solo adesso, a zaino trovato, si può cambiare l’area dei progressi.
    if (opzioni.temporaneo && !impostaTemporanea(true)) return 'non-supportato';
    salvaMemoria({ codice, versione: letto.versione, ultimo: null });
    fermaTimer();
    await sincronizza({ completa: true, letto });
    return 'aperto';
  } finally {
    collegamentoInCorso = false;
  }
}

/**
 * Scollega questo dispositivo: prova a portare nello zaino le ultime
 * modifiche, poi toglie dal browser il codice e i dati di ogni sezione.
 */
export async function esci(): Promise<void> {
  // Una lettura già avviata può ancora portare progressi dal servizio al browser.
  await corrente;
  if (stato.inSospeso && !bloccato()) {
    await sincronizza({ completa: false }).catch(() => undefined);
  }
  fermaTimer();
  salvaMemoria(null);
  chiaviCache = null;
  for (const tipo of sezioniRegistrate()) tipo.svuota();
  // In modalità temporanea la scheda torna all'area normale: i progressi del
  // browser, mai toccati, riappaiono.
  impostaTemporanea(false);
  cambiaStato({
    fase: 'scollegato',
    motivo: null,
    inSospeso: false,
    byte: null,
    ultima: null,
  });
}

/* ------------------------------------------------------------- sonda */

export interface AccessoZaino {
  stato(): StatoZaino;
  codice(): string | null;
  /** L'id che vede il server, per gli script di verifica. */
  id(): Promise<string | null>;
  crea(): Promise<string>;
  apri(codice: string, opzioni?: OpzioniApri): Promise<EsitoApri>;
  esci(): Promise<void>;
  /** Sincronizza adesso, rileggendo il server. */
  sincronizza(): Promise<StatoZaino>;
  /** Registra una sezione (per provare le sezioni che un client non conosce). */
  registraSezione(tipo: TipoSezione<unknown>): void;
}

declare global {
  interface Window {
    __zaino?: AccessoZaino;
  }
}

/**
 * Avvia lo zaino in questa scheda: una volta sola, da `src/main.tsx`. Le
 * sezioni vanno registrate prima (import di `src/zaino/sezione.ts`).
 */
export function avviaZaino(urlServizio: string): void {
  if (avviato || typeof window === 'undefined') return;
  avviato = true;
  servizio = urlServizio.replace(/\/$/, '');
  window.__zaino = {
    stato: leggiStatoZaino,
    codice: codiceZaino,
    async id() {
      const c = codiceZaino();
      return c ? (await chiaviDi(c)).id : null;
    },
    crea,
    apri,
    esci,
    async sincronizza() {
      await sincronizza({ completa: true });
      return stato;
    },
    registraSezione(tipo) {
      registraSezione(tipo);
      segui(tipo);
    },
  };
  const supportato = zainoSupportato();
  stato = { ...STATO_SERVER, supportato };
  for (const f of ascoltatori) f();
  if (!supportato) return;
  // Un segno di modalità temporanea senza zaino (apertura interrotta) non
  // deve nascondere i progressi salvati nel browser.
  if (areaCorrente() === 'session' && !leggiMemoria()) impostaTemporanea(false);
  for (const tipo of sezioniRegistrate()) segui(tipo);
  document.addEventListener('visibilitychange', suVisibilita);
  window.addEventListener('storage', suStorage);
  window.addEventListener('online', suRete);
  if (leggiMemoria()) void sincronizza({ completa: true });
}
