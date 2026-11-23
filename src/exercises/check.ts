/**
 * Controllo degli esercizi di un tema fuori dal browser: ogni query attesa
 * deve girare sul database del tema e dare un risultato confrontabile e non
 * ambiguo. Lo usa `npm run check:themes` (`scripts/check-themes.ts`).
 *
 * Errori: forma, query che non gira, zero righe, ordine del risultato che
 * dipende dall’ordine di lettura delle righe, parole chiave dichiarate ma
 * assenti, `WHERE` che non esclude nessuna riga.
 * Avvisi (da giustificare caso per caso): risultato identico a quello di un
 * altro esercizio, una sola riga per una consegna al plurale, clausole usate
 * ma non dichiarate fra le parole chiave. I primi due ignorano i risultati di
 * una sola cella.
 */

import { CHAPTERS, DIFFICULTIES, EXERCISE_ID_PATTERN, type Exercise } from '../themes/contract.ts';
import { SqlError, SqlTimeoutError, type ResultSet, type SqlDatabase, type SqlEngine } from '../sql/engine.ts';
import { compareResults, hasOuterOrderBy } from './compare.ts';
import { asksForMany, missingKeywords, tieBreakVariants, undeclaredKeywords } from './quality.ts';
import { ExerciseError, runExpected } from './verify.ts';
import { CONSEGNA_ITEM, SESSION_ITEM } from '../routing/route.ts';

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

/** Esito del controllo: una riga per caso, ciascuna con il nome dell’esercizio. */
export interface CheckReport {
  /** Difetti da correggere: `check:themes` fallisce. */
  problems: string[];
  /** Casi sospetti, da correggere o giustificare: `check:themes` li stampa e non fallisce. */
  warnings: string[];
}

/**
 * `true` se il risultato della query attesa non è unico. Con un `ORDER BY`
 * esterno, si completano i criteri con le colonne del risultato in due versi
 * opposti (`tieBreakVariants`); senza, si rileggono le tabelle in ordine
 * inverso (`reverse_unordered_selects`, che SQLite applica solo alle query
 * senza `ORDER BY`): così si scopre un `LIMIT` che sceglie righe a caso.
 */
async function dependsOnScanOrder(db: SqlDatabase, query: string, expected: ResultSet): Promise<boolean> {
  const variants = tieBreakVariants(query, expected.columns.length);
  if (variants) {
    const [ascending, descending] = await Promise.all(variants.map((variant) => runExpected(db, variant)));
    return compareResults(descending, ascending, true) !== null;
  }
  await db.run('PRAGMA reverse_unordered_selects = ON');
  try {
    const reversed = await runExpected(db, query);
    return compareResults(reversed, expected, hasOuterOrderBy(query)) !== null;
  } finally {
    await db.run('PRAGMA reverse_unordered_selects = OFF');
  }
}

/** Controlla un tema. Due elenchi vuoti: il tema è a posto. */
export async function checkTheme(engine: SqlEngine, theme: ThemeToCheck): Promise<CheckReport> {
  if (!Array.isArray(theme.exercises)) {
    return { problems: [`${theme.id}: esercizi.ts non esporta un elenco di esercizi come default`], warnings: [] };
  }

  const problems: string[] = [];
  const warnings: string[] = [];
  const results: { id: string; result: ResultSet }[] = [];
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
      const warn = (warning: string) => warnings.push(`${theme.id}/${exercise.id}: ${warning}`);

      if (seen.has(exercise.id)) report('id usato da più di un esercizio');
      if (exercise.id === SESSION_ITEM) report(`l’id «${SESSION_ITEM}» è riservato alla sessione di addestramento`);
      if (exercise.id === CONSEGNA_ITEM) report(`l’id «${CONSEGNA_ITEM}» è riservato alle consegne del docente`);
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
      if (isTextList(exercise.keywords)) {
        const missing = missingKeywords(exercise.keywords, exercise.expectedQuery);
        if (missing.length > 0) report(`parole chiave assenti dalla query attesa: ${missing.join(', ')}`);
        const undeclared = undeclaredKeywords(exercise.keywords, exercise.expectedQuery);
        if (undeclared.length > 0) warn(`la query attesa usa parole chiave non dichiarate: ${undeclared.join(', ')}`);
      }
      try {
        const { rowsModified } = await db.run(exercise.expectedQuery, { maxRows: 0 });
        if (rowsModified > 0) {
          report('la query attesa modifica i dati');
          await db.reset();
          continue;
        }
        const expected = await runExpected(db, exercise.expectedQuery);
        if (expected.totalRows === 0) {
          report('la query attesa restituisce zero righe');
          continue;
        }
        // Un risultato di una sola cella è un conteggio o una somma: una riga per costruzione,
        // e due numeri uguali in esercizi diversi sono una coincidenza.
        const singleCell = expected.totalRows === 1 && expected.columns.length === 1;
        if (!singleCell) results.push({ id: exercise.id, result: expected });

        if (await dependsOnScanOrder(db, exercise.expectedQuery, expected)) {
          report('il risultato cambia con l’ordine di lettura delle righe: ORDER BY o LIMIT con righe a pari merito');
        }
        if (
          exercise.keywords?.includes('WHERE') &&
          exercise.tables?.length === 1 &&
          tables.has(exercise.tables[0].toLowerCase())
        ) {
          const [count] = (await db.run(`SELECT COUNT(*) FROM "${exercise.tables[0]}"`)).resultSets;
          if (expected.totalRows === count.rows[0][0]) {
            report(`il WHERE non esclude nessuna riga: il risultato ha tutte le righe di ${exercise.tables[0]}`);
          }
        }
        if (expected.totalRows === 1 && !singleCell && isText(exercise.prompt) && asksForMany(exercise.prompt)) {
          warn('la query attesa restituisce una sola riga, ma la consegna sembra chiederne più d’una');
        }
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

  // Risultati identici: stesse righe, colonne in qualunque ordine e righe in qualunque ordine.
  for (const [index, a] of results.entries()) {
    const twins = results
      .slice(index + 1)
      .filter(
        (b) =>
          b.result.columns.length === a.result.columns.length &&
          b.result.totalRows === a.result.totalRows &&
          compareResults(b.result, a.result, false) === null,
      );
    if (twins.length > 0) {
      warnings.push(`${theme.id}/${a.id}: stesso risultato atteso di ${twins.map((b) => b.id).join(', ')}`);
    }
  }
  return { problems, warnings };
}
