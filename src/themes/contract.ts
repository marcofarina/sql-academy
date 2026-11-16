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
 *   esercizi.*    esercizi (formato fissato nella fase F02)
 *   analisi.md    testo del dominio (F07)
 *   er.ts         schema ER dichiarativo (F06)
 *   stile.css     variabili e decorazioni del tema (F08)
 *
 * In F01 sono obbligatori `theme.ts`, `schema.sql` e `dati.sql`.
 */

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

/** Un tema scoperto: il manifest, subito disponibile, e i contenuti caricati a richiesta. */
export interface Theme {
  manifest: ThemeManifest;
  /**
   * Carica lo script che costruisce il database del tema: `schema.sql` seguito
   * da `dati.sql`. I file si scaricano solo alla prima chiamata.
   */
  loadDatabaseScript(): Promise<string>;
}
