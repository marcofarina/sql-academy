/**
 * Interfaccia del motore SQL.
 *
 * Il resto del portale dipende solo da questo file: apre il database di un
 * tema, esegue script, ripristina, chiude. L’implementazione (SQLite in un Web
 * Worker, con watchdog) sta in `bridge.ts`; l’istanza per il browser in
 * `browser.ts`.
 */

/** Valore di una cella. I BLOB arrivano come `Uint8Array`. */
export type SqlValue = number | string | Uint8Array | null;

/** Il risultato di una istruzione che restituisce righe. */
export interface ResultSet {
  columns: string[];
  /** Al massimo `maxRows` righe. */
  rows: SqlValue[][];
  /** Righe prodotte dall’istruzione, comprese quelle non restituite. */
  totalRows: number;
  /** `true` se `rows` contiene meno righe di `totalRows`. */
  truncated: boolean;
}

export interface RunResult {
  /** Un elemento per ogni istruzione dello script che restituisce righe, nell’ordine. */
  resultSets: ResultSet[];
  /** Righe inserite, modificate o cancellate dallo script. */
  rowsModified: number;
  durationMs: number;
}

export interface RunOptions {
  /** Massimo di righe restituite per ogni insieme di risultati. */
  maxRows?: number;
  /** Tempo massimo prima che il watchdog interrompa l’esecuzione. */
  timeoutMs?: number;
}

/** Da che cosa nasce un database: lo script SQL che lo costruisce da vuoto. */
export interface DatabaseSource {
  /** Identifica lo script (per un tema, il suo `id`): il motore ne conserva la copia iniziale. */
  key: string;
  /** Istruzioni SQL che creano tabelle e dati. */
  script: string;
}

/**
 * Un database in memoria, privato di chi lo ha aperto.
 * Aprire due volte la stessa sorgente dà due database indipendenti.
 */
export interface SqlDatabase {
  /**
   * Esegue uno script di una o più istruzioni. Rifiuta con `SqlError` se
   * SQLite segnala un errore (le istruzioni precedenti restano eseguite) e con
   * `SqlTimeoutError` se lo script non termina in tempo.
   */
  run(sql: string, options?: RunOptions): Promise<RunResult>;
  /** Riporta il database allo stato iniziale. */
  reset(): Promise<void>;
  /** Libera il database. Dopo la chiusura ogni altra chiamata è rifiutata. */
  close(): Promise<void>;
}

export interface SqlEngine {
  /** Apre un database nuovo, costruito dalla sorgente. Rifiuta con `EngineError` se lo script della sorgente è sbagliato. */
  open(source: DatabaseSource): Promise<SqlDatabase>;
  /** Termina il worker e rifiuta le richieste in corso. */
  dispose(): void;
}

/** Errore segnalato da SQLite sullo script eseguito: `message` è il suo messaggio, per intero. */
export class SqlError extends Error {
  override name = 'SqlError';
}

/**
 * Il watchdog ha interrotto uno script che non terminava. Il worker è stato
 * terminato: tutti i database aperti ripartono dallo stato iniziale.
 */
export class SqlTimeoutError extends Error {
  override name = 'SqlTimeoutError';
  timeoutMs: number;

  constructor(timeoutMs: number) {
    super(
      `Esecuzione interrotta dopo ${timeoutMs / 1000} s: la query non terminava. ` +
        'Il database è stato ripristinato.',
    );
    this.timeoutMs = timeoutMs;
  }
}

/** Il motore non funziona: caricamento fallito, sorgente sbagliata, database chiuso. */
export class EngineError extends Error {
  override name = 'EngineError';
}
