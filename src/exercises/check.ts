/**
 * Controllo degli esercizi di un tema fuori dal browser: ogni query attesa
 * deve girare sul database del tema e dare un risultato confrontabile.
 * Lo usa `npm run check:themes` (`scripts/check-themes.ts`).
 */

import { CHAPTERS, DIFFICULTIES, EXERCISE_ID_PATTERN, type Exercise } from '../themes/contract.ts';
import { SqlError, SqlTimeoutError, type SqlEngine } from '../sql/engine.ts';
import { ExerciseError, runExpected } from './verify.ts';
import { SESSION_ITEM } from '../routing/route.ts';

export interface ThemeToCheck {
  id: string;
  /** `schema.sql` seguito da `dati.sql`. */
  script: string;
  exercises: Exercise[];
}

const isText = (value: unknown): value is string => typeof value === 'string' && value.trim() !== '';
const isTextList = (value: unknown): value is string[] => Array.isArray(value) && value.every(isText);

/** Problemi di forma di un esercizio: i file dei temi arrivano qui senza passare dal compilatore. */
function shapeProblems(exercise: Exercise): string[] {
  const problems: string[] = [];
  if (!(CHAPTERS as readonly unknown[]).includes(exercise.chapter)) {
    problems.push(`capitolo «${exercise.chapter}» non previsto (${CHAPTERS.join(', ')})`);
  }
  if (!(DIFFICULTIES as readonly unknown[]).includes(exercise.difficulty)) {
    problems.push(`difficoltà «${exercise.difficulty}» non prevista (${DIFFICULTIES.join(', ')})`);
  }
  if (!isText(exercise.title)) problems.push('manca il titolo');
  if (!isText(exercise.prompt)) problems.push('manca la consegna');
  if (!isTextList(exercise.keywords)) problems.push('le parole chiave non sono un elenco di testi');
  if (!isTextList(exercise.hints)) problems.push('i suggerimenti non sono un elenco di testi');
  if (!isTextList(exercise.tables) || exercise.tables.length === 0) {
    problems.push('manca l’elenco delle tabelle coinvolte');
  }
  return problems;
}

/**
 * Controlla un tema e restituisce i problemi trovati, uno per riga, ciascuno
 * con il nome dell’esercizio. Elenco vuoto: il tema è a posto.
 */
export async function checkTheme(engine: SqlEngine, theme: ThemeToCheck): Promise<string[]> {
  if (!Array.isArray(theme.exercises)) {
    return [`${theme.id}: esercizi.ts non esporta un elenco di esercizi come default`];
  }

  const problems: string[] = [];
  const db = await engine.open({ key: theme.id, script: theme.script });
  try {
    const [objects] = (await db.run("SELECT lower(name) FROM sqlite_master WHERE type IN ('table', 'view')")).resultSets;
    const tables = new Set(objects.rows.map((row) => row[0]));
    const seen = new Set<string>();

    for (const [index, exercise] of theme.exercises.entries()) {
      if (!isText(exercise?.id) || !EXERCISE_ID_PATTERN.test(exercise.id)) {
        problems.push(`${theme.id}: l’esercizio in posizione ${index + 1} ha un id non valido (minuscole, cifre, trattini)`);
        continue;
      }
      const report = (problem: string) => problems.push(`${theme.id}/${exercise.id}: ${problem}`);

      if (seen.has(exercise.id)) report('id usato da più di un esercizio');
      if (exercise.id === SESSION_ITEM) report(`l’id «${SESSION_ITEM}» è riservato alla sessione di addestramento`);
      seen.add(exercise.id);
      shapeProblems(exercise).forEach(report);

      if (isTextList(exercise.tables)) {
        for (const table of exercise.tables) {
          if (!tables.has(table.toLowerCase())) report(`la tabella «${table}» non esiste nel tema`);
        }
      }

      if (!isText(exercise.expectedQuery)) {
        report('manca la query attesa');
        continue;
      }
      try {
        const { rowsModified } = await db.run(exercise.expectedQuery, { maxRows: 0 });
        if (rowsModified > 0) {
          report('la query attesa modifica i dati');
          await db.reset();
          continue;
        }
        const expected = await runExpected(db, exercise.expectedQuery);
        if (expected.totalRows === 0) report('la query attesa restituisce zero righe');
      } catch (error) {
        // Dopo un errore il database può essere rimasto a metà di uno script.
        await db.reset();
        if (error instanceof ExerciseError) report(error.message);
        else if (error instanceof SqlError) report(`la query attesa dà errore: ${error.message}`);
        else if (error instanceof SqlTimeoutError) report('la query attesa non termina');
        else throw error;
      }
    }
  } finally {
    await db.close();
  }
  return problems;
}
