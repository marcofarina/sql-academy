/**
 * Conteggi di un tema per la scheda della locandina: tabelle e righe del
 * database iniziale, esercizi per difficoltà e per capitolo.
 *
 * Li calcola al build il plugin `themeStatsPlugin` (vedi `vite.config.ts`),
 * così la pagina iniziale non scarica SQLite. Caricato anche da Node: gli import
 * di valori indicano l’estensione `.ts`, quelli di tipi usano `import type`.
 */

import type { Database } from 'sql.js';
import { CHAPTERS, DIFFICULTIES, type Exercise, type ThemeStats } from './contract.ts';

/** Le tabelle utente del database, in ordine di creazione, con il numero di righe. */
export function countTables(db: Database): ThemeStats['tables'] {
  const [names] = db.exec("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY rowid");
  return (names?.values ?? []).map(([name]) => {
    const quoted = `"${String(name).replace(/"/g, '""')}"`;
    const [count] = db.exec(`SELECT COUNT(*) FROM ${quoted}`);
    return { name: String(name), rows: Number(count.values[0][0]) };
  });
}

export function countExercises(exercises: Exercise[]): Omit<ThemeStats, 'tables'> {
  const byDifficulty = Object.fromEntries(DIFFICULTIES.map((d) => [d, 0])) as ThemeStats['byDifficulty'];
  const byChapter = Object.fromEntries(CHAPTERS.map((c) => [c, 0])) as ThemeStats['byChapter'];
  for (const exercise of exercises) {
    byDifficulty[exercise.difficulty] += 1;
    byChapter[exercise.chapter] += 1;
  }
  return { exercises: exercises.length, byDifficulty, byChapter };
}
