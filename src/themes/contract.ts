/**
 * Contratto di un tema.
 *
 * Un tema è una cartella `themes/<id>/` con file dai nomi fissi: il codice
 * comune li trova per nome (vedi `registry.ts`), senza elenchi scritti a mano.
 * Aggiungere un tema significa aggiungere una cartella; nessun file fuori da
 * `themes/<id>/` va modificato.
 *
 *   theme.ts      manifest, esportato come `default` (tipo `ThemeManifest`)
 *   schema.sql    CREATE TABLE, con le chiavi esterne dichiarate
 *   dati.sql      INSERT
 *   esercizi.ts   esercizi, esportati come `default` (tipo `Exercise[]`); facoltativo
 *   analisi.md    testo del dominio, in Markdown minimo (vedi `src/analysis/markdown.ts`); facoltativo
 *   er.ts         schema ER, esportato come `default` (tipo `ErDiagram`); facoltativo
 *   stile.css     variabili e decorazioni del tema (F08)
 *
 * Sono obbligatori `theme.ts`, `schema.sql` e `dati.sql`.
 *
 * `theme.ts`, `esercizi.ts` ed `er.ts` sono caricati anche da Node senza passare
 * da Vite (`npm run check:themes`): dal codice comune importano solo tipi, con `import type`.
 *
 * Il modello logico non ha un file: si legge dal database del tema.
 */

import type { ErDiagram } from '../er/types.ts';

export type { ErDiagram } from '../er/types.ts';

/** Il manifest di un tema: ciò che serve per elencarlo senza caricarne i contenuti. */
export interface ThemeManifest {
  /** Identificativo stabile, uguale al nome della cartella: minuscole, cifre e trattini. */
  id: string;
  /** Nome mostrato allo studente. */
  title: string;
  /** Una o due frasi per l’elenco dei temi. */
  description: string;
}

/** Forma ammessa per l’`id` di un tema (compare negli URL e nelle chiavi di `localStorage`). */
export const THEME_ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** I capitoli del libro allenati dal portale (capitoli 6–9 del *Manuale dell’Archivista*), nell’ordine. */
export const CHAPTERS = ['una-tabella', 'join', 'aggregazioni', 'sottoquery-viste'] as const;
export type Chapter = (typeof CHAPTERS)[number];

export const DIFFICULTIES = ['facile', 'medio', 'difficile'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

/** Forma ammessa per l’`id` di un esercizio (compare nelle chiavi di `localStorage`). */
export const EXERCISE_ID_PATTERN = THEME_ID_PATTERN;

/**
 * Un esercizio: una consegna e la query che la risolve.
 *
 * La risposta dello studente è corretta se dà lo stesso risultato di
 * `expectedQuery` sul database iniziale del tema; le regole del confronto sono
 * in `src/exercises/compare.ts`. Chi scrive un esercizio tenga presente che:
 *
 * - nomi e ordine delle colonne non contano, quindi la consegna non deve
 *   prescrivere alias;
 * - l’ordine delle righe conta solo se `expectedQuery` ha un `ORDER BY`
 *   esterno: in quel caso la consegna deve chiedere l’ordinamento, e
 *   l’`ORDER BY` deve fissare l’ordine di tutte le righe (a parità di chiave,
 *   aggiungere un secondo criterio), altrimenti una risposta giusta può
 *   essere respinta;
 * - `expectedQuery` restituisce almeno una riga e non modifica i dati.
 */
export interface Exercise {
  /** Identificativo stabile e unico nel tema: i progressi dello studente lo usano come chiave. Non va cambiato dopo la pubblicazione. */
  id: string;
  chapter: Chapter;
  difficulty: Difficulty;
  /** Parole chiave SQL che l’esercizio allena, in maiuscolo: `WHERE`, `GROUP BY`, `LEFT JOIN`… */
  keywords: string[];
  title: string;
  /** La consegna: che cosa deve restituire la query. */
  prompt: string;
  /** La query di riferimento, di norma una sola `SELECT`. Di uno script di più istruzioni conta l’ultimo risultato. */
  expectedQuery: string;
  /** Suggerimenti, dal più vago al più esplicito. */
  hints: string[];
  /** Tabelle del tema coinvolte nella soluzione. */
  tables: string[];
}

/** Un tema scoperto: il manifest, subito disponibile, e i contenuti caricati a richiesta. */
export interface Theme {
  manifest: ThemeManifest;
  /**
   * Carica lo script che costruisce il database del tema: `schema.sql` seguito
   * da `dati.sql`. I file si scaricano solo alla prima chiamata.
   */
  loadDatabaseScript(): Promise<string>;
  /** Carica gli esercizi del tema (`esercizi.ts`); elenco vuoto se il file manca. */
  loadExercises(): Promise<Exercise[]>;
  /** Carica lo schema ER del tema (`er.ts`); `undefined` se il file manca. */
  loadEr(): Promise<ErDiagram | undefined>;
  /** Carica il testo dell’analisi (`analisi.md`); `undefined` se il file manca. */
  loadAnalysis(): Promise<string | undefined>;
}
