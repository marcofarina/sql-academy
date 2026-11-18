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
 *   traccia.md    traccia: il testo del problema da cui nasce il database, in Markdown minimo (vedi `src/trace/markdown.ts`); facoltativo
 *   er.ts         schema ER, esportato come `default` (tipo `ErDiagram`); facoltativo
 *   logico.ts     posizioni delle tabelle nel diagramma del modello logico, esportate come `default` (tipo `LogicalLayout`); facoltativo
 *   stile.css     veste del guscio del tema: variabili e decorazioni; facoltativo
 *   locandina.css fronte della locandina sulla pagina iniziale; facoltativo
 *   icone/*.svg   icone RB proprie del tema, citate per nome dal manifest; facoltative
 *   fonts/        caratteri del tema con il loro file di licenza, citati da `stile.css`
 *
 * Sono obbligatori `theme.ts`, `schema.sql` e `dati.sql`.
 *
 * I fogli di stile del tema entrano nella pagina sempre, quindi ogni loro regola
 * deve restare confinata: in `stile.css` ogni selettore comincia con
 * `.theme[data-theme-id="<id>"]`, in `locandina.css` con
 * `.poster[data-theme-id="<id>"]` (lo controlla `npm run check:themes`).
 * Le variabili che `stile.css` può ridefinire sono in `src/styles.css`. Un tema
 * con due schemi di colori li distingue con `[data-scheme="chiaro"]` e
 * `[data-scheme="scuro"]` sulla stessa radice.
 *
 * L’indicatore della sezione attiva è un elemento solo, `.sections-indicator`:
 * il guscio gli dà posizione e misure della voce attiva e lo fa scorrere da una
 * voce all’altra. Il tema ne disegna l’aspetto con `.sections-indicator::after`,
 * posizionato rispetto alla voce (per esempio `bottom: 0`), senza transizioni proprie.
 *
 * `theme.ts`, `esercizi.ts`, `er.ts` e `logico.ts` sono caricati anche da Node senza passare
 * da Vite (`npm run check:themes`): dal codice comune importano solo tipi, con `import type`.
 *
 * Il modello logico si legge dal database del tema: `logico.ts` dice solo dove
 * disegnare ogni tabella. Senza il file le tabelle si dispongono tre per riga.
 */

import type { ErDiagram } from '../er/types.ts';
import type { LogicalLayout } from '../logical/types.ts';
import type { SectionId } from '../routing/route.ts';

export type { ErDiagram } from '../er/types.ts';
export type { LogicalLayout } from '../logical/types.ts';

/** Il manifest di un tema: ciò che serve per elencarlo senza caricarne i contenuti. */
export interface ThemeManifest {
  /** Identificativo stabile, uguale al nome della cartella: minuscole, cifre e trattini. */
  id: string;
  /** Nome mostrato allo studente. */
  title: string;
  /** Una o due frasi per l’elenco dei temi e per il retro della locandina. */
  description: string;
  /** Motto in cima al fronte della locandina, sulla pagina iniziale. */
  motto: string;
  /** Icone del tema valide in ogni schema; `schemes` le può sostituire per schema. */
  icons?: ThemeIcons;
  /**
   * Se presente, il tema ha uno schema chiaro e uno scuro e il guscio mostra il
   * selettore; per ogni schema le icone che cambiano (per esempio l’emblema).
   * Senza, il tema ha un solo schema e nessun selettore.
   */
  schemes?: Record<Scheme, ThemeIcons>;
}

export const SCHEMES = ['chiaro', 'scuro'] as const;
export type Scheme = (typeof SCHEMES)[number];

/**
 * Icone proprie di un tema: nomi di file in `themes/<id>/icone/`, senza estensione.
 * Tutte decorative; i componenti comuni le mostrano solo se il tema le dichiara.
 */
export interface ThemeIcons {
  /** Emblema accanto al nome del tema, nell’intestazione e sul selettore dello schema. */
  emblem?: string;
  /** Accanto a «Risolto», quando lo studente ha risolto un esercizio. */
  solved?: string;
  /** Negli stati vuoti: nessun esercizio corrisponde ai filtri. */
  empty?: string;
  /** Sui pulsanti che avviano una sessione di addestramento, al posto dell’icona comune `rocket`. */
  session?: string;
  /** Sul pulsante che azzera i progressi del tema, al posto dell’icona comune `trash-can`. */
  reset?: string;
  /** Icone che sostituiscono quelle comuni di alcune sezioni, nella barra delle sezioni e nel titolo. */
  sections?: Partial<Record<SectionId, string>>;
}

/** Conteggi di un tema calcolati al build (`virtual:theme-stats`), per la scheda della locandina. */
export interface ThemeStats {
  /** Tabelle del database iniziale, in ordine di creazione, con il numero di righe. */
  tables: { name: string; rows: number }[];
  exercises: number;
  byDifficulty: Record<Difficulty, number>;
  byChapter: Record<Chapter, number>;
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
  /** Le icone di `themes/<id>/icone/`, per nome: testo SVG da passare a `Icon`. */
  icons: Record<string, string>;
  /** Conteggi calcolati al build; `undefined` se il database del tema non si è costruito. */
  stats?: ThemeStats;
  /**
   * Carica lo script che costruisce il database del tema: `schema.sql` seguito
   * da `dati.sql`. I file si scaricano solo alla prima chiamata.
   */
  loadDatabaseScript(): Promise<string>;
  /** Carica gli esercizi del tema (`esercizi.ts`); elenco vuoto se il file manca. */
  loadExercises(): Promise<Exercise[]>;
  /** Carica lo schema ER del tema (`er.ts`); `undefined` se il file manca. */
  loadEr(): Promise<ErDiagram | undefined>;
  /** Carica le posizioni del modello logico (`logico.ts`); `undefined` se il file manca. */
  loadLogical(): Promise<LogicalLayout | undefined>;
  /** Carica il testo della traccia (`traccia.md`); `undefined` se il file manca. */
  loadTrace(): Promise<string | undefined>;
}
