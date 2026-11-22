/**
 * Verifica di una risposta: esegue la query attesa e quella dello studente e
 * ne confronta i risultati (regole in `compare.ts`).
 *
 * Entrambe girano su una copia del database iniziale del tema, aperta e chiusa
 * qui: né le prove fatte prima dallo studente né una risposta che modifica i
 * dati possono alterare il confronto. Di uno script di più istruzioni conta
 * l’ultimo risultato.
 */

import {
  SqlError,
  SqlTimeoutError,
  type DatabaseSource,
  type ResultSet,
  type SqlEngine,
  type SqlValue,
} from '../sql/engine.ts';
import { compareResults, hasOuterOrderBy, type Mismatch } from './compare.ts';

/** Righe confrontate al massimo. Una query attesa che ne restituisce di più è un errore dell’esercizio. */
export const VERIFY_MAX_ROWS = 10_000;

export type Verdict =
  | { kind: 'correct' }
  /** SQLite ha rifiutato la query dello studente; `message` è il suo messaggio. */
  | { kind: 'error'; message: string }
  /** La query dello studente non terminava ed è stata interrotta. */
  | { kind: 'timeout'; timeoutMs: number }
  | Mismatch;

export interface Verification {
  verdict: Verdict;
  /** L’ultimo risultato della query dello studente, al massimo `VERIFY_MAX_ROWS` righe; `null` se non ne ha prodotti. */
  student: ResultSet | null;
}

/** L’esercizio è sbagliato: la query attesa non gira o non dà un risultato confrontabile. Errore dell’autore, non dello studente. */
export class ExerciseError extends Error {
  override name = 'ExerciseError';
}

/**
 * Esegue la query attesa su un database appena ripristinato.
 * Rifiuta con `ExerciseError` se non dà un risultato confrontabile.
 */
export async function runExpected(
  db: { run: (sql: string, options: { maxRows: number }) => Promise<{ resultSets: ResultSet[] }> },
  expectedQuery: string,
): Promise<ResultSet> {
  let expected: ResultSet | undefined;
  try {
    expected = (await db.run(expectedQuery, { maxRows: VERIFY_MAX_ROWS })).resultSets.at(-1);
  } catch (error) {
    if (error instanceof SqlError) {
      throw new ExerciseError(`la query attesa dà errore: ${error.message}`, { cause: error });
    }
    if (error instanceof SqlTimeoutError) {
      throw new ExerciseError('la query attesa non termina', { cause: error });
    }
    throw error;
  }
  if (!expected) throw new ExerciseError('la query attesa non restituisce un risultato');
  if (expected.truncated) {
    throw new ExerciseError(`la query attesa restituisce più di ${VERIFY_MAX_ROWS} righe`);
  }
  return expected;
}

/**
 * Verifica la risposta `studentSql` a un esercizio del tema `source`.
 * Rifiuta con `ExerciseError` se è l’esercizio a essere sbagliato.
 */
export async function verifyAnswer(
  engine: SqlEngine,
  source: DatabaseSource,
  expectedQuery: string,
  studentSql: string,
): Promise<Verification> {
  const db = await engine.open(source);
  try {
    const expected = await runExpected(db, expectedQuery);
    await db.reset();

    let student: ResultSet | null;
    try {
      student = (await db.run(studentSql, { maxRows: VERIFY_MAX_ROWS })).resultSets.at(-1) ?? null;
    } catch (error) {
      if (error instanceof SqlError) return { verdict: { kind: 'error', message: error.message }, student: null };
      if (error instanceof SqlTimeoutError) {
        return { verdict: { kind: 'timeout', timeoutMs: error.timeoutMs }, student: null };
      }
      throw error;
    }

    const mismatch = compareResults(student, expected, hasOuterOrderBy(expectedQuery));
    return { verdict: mismatch ?? { kind: 'correct' }, student };
  } finally {
    await db.close();
  }
}

function count(n: number, one: string, many: string): string {
  return n === 1 ? `una ${one}` : `${n} ${many}`;
}

function formatRow(row: SqlValue[]): string {
  const cell = (value: SqlValue) =>
    value === null ? 'NULL' : value instanceof Uint8Array ? 'BLOB' : String(value);
  return `(${row.map(cell).join(', ')})`;
}

/** Il messaggio che spiega l’esito dopo che SQLite ha eseguito o interrotto la query. */
export function describeVerdict(verdict: Exclude<Verdict, { kind: 'error' }>): string {
  switch (verdict.kind) {
    case 'correct':
      return 'Risposta corretta.';
    case 'timeout':
      return `La query è stata interrotta dopo ${verdict.timeoutMs / 1000} s perché non terminava.`;
    case 'no-result':
      return 'La query non restituisce un risultato: l’esercizio chiede una SELECT.';
    case 'columns': {
      const { actual, expected, missing, extra } = verdict;
      const base =
        `Il risultato ha ${count(actual, 'colonna', 'colonne')}: ` +
        (expected === 1 ? 'ne serve una.' : `ne servono ${expected}.`);
      // I nomi non contano nel confronto: si citano solo quando non lasciano dubbi.
      if (actual > expected && missing.length === 0) return `${base} In più: ${extra.join(', ')}.`;
      if (actual < expected && extra.length === 0) {
        return `${base} ${missing.length === 1 ? 'Manca' : 'Mancano'}: ${missing.join(', ')}.`;
      }
      return base;
    }
    case 'rows':
      return verdict.actual > verdict.expected
        ? `Il risultato ha righe in più: ${verdict.actual} invece di ${verdict.expected}.`
        : `Al risultato mancano delle righe: ${verdict.actual} invece di ${verdict.expected}.`;
    case 'values':
      return (
        'Il numero di righe è giusto, ma i valori non coincidono. ' +
        `La prima riga che non compare nel risultato atteso è la numero ${verdict.rowNumber}: ${formatRow(verdict.row)}.`
      );
    case 'order':
      return (
        'Le righe sono giuste, ma in un ordine diverso: ' +
        `la prima fuori posto è la numero ${verdict.rowNumber}. Controlla ORDER BY.`
      );
  }
}
