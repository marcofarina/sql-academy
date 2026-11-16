/**
 * Confronto fra il risultato della query dello studente e quello della query
 * attesa. Qui si decide che cosa il portale chiama «risposta corretta».
 *
 * Regole (fissate nella fase F02; le prime due decise da Marco il 2026-11-16):
 *
 * - **Nomi delle colonne:** non contano. `COUNT(*)` e `COUNT(*) AS totale`
 *   sono la stessa colonna. I nomi servono solo a rendere più precisi i
 *   messaggi quando il numero di colonne è sbagliato.
 * - **Ordine delle colonne:** non conta. `SELECT clima, nome` vale quanto
 *   `SELECT nome, clima`, e `SELECT *` quanto l’elenco delle stesse colonne.
 *   Si cerca una corrispondenza fra le colonne dello studente e quelle attese
 *   che renda uguali le righe; a parità si preferisce lo stesso nome, poi la
 *   stessa posizione.
 * - **Numero di colonne:** conta. Una colonna in più o in meno è un errore.
 * - **Ordine delle righe:** conta solo se la query attesa ha un `ORDER BY`
 *   esterno (`hasOuterOrderBy`). Altrimenti le righe si confrontano come
 *   insieme con ripetizioni.
 * - **Righe duplicate:** contano. Ogni riga deve comparire lo stesso numero
 *   di volte: un `DISTINCT` dimenticato o di troppo è un errore.
 * - **`NULL`:** è uguale solo a `NULL`; è diverso da `0` e dalla stringa vuota.
 * - **Numeri:** si confrontano a 12 cifre significative, per assorbire gli
 *   arrotondamenti di `AVG` e delle divisioni. Interi e reali non si
 *   distinguono (`3` è uguale a `3.0`); un numero è diverso dal testo con le
 *   stesse cifre (`3` è diverso da `'3'`).
 * - **Testo:** confronto esatto, maiuscole e spazi compresi.
 *
 * Limite noto: se l’`ORDER BY` atteso lascia righe a pari merito, il loro
 * ordine reciproco è arbitrario e una risposta giusta può risultare «in ordine
 * diverso». Gli esercizi devono avere un ordinamento completo (vedi `Exercise`).
 */

import type { ResultSet, SqlValue } from '../sql/engine.ts';

/** Perché il risultato dello studente non coincide con quello atteso. */
export type Mismatch =
  /** Lo script dello studente non contiene istruzioni che restituiscono righe. */
  | { kind: 'no-result' }
  /**
   * Numero di colonne diverso. `missing` ed `extra` confrontano i nomi senza
   * distinguere le maiuscole: sono un indizio, non un giudizio.
   */
  | { kind: 'columns'; actual: number; expected: number; missing: string[]; extra: string[] }
  /** Numero di righe diverso. */
  | { kind: 'rows'; actual: number; expected: number }
  /**
   * Stesse dimensioni, valori diversi. `rowNumber` (da 1) e `row` indicano la
   * prima riga dello studente che non compare nel risultato atteso.
   */
  | { kind: 'values'; rowNumber: number; row: SqlValue[] }
  /** Le righe sono quelle giuste ma in un altro ordine; `rowNumber` (da 1) è la prima fuori posto. */
  | { kind: 'order'; rowNumber: number; row: SqlValue[]; expectedRow: SqlValue[] };

/**
 * `true` se l’ultima istruzione dello script ha un `ORDER BY` esterno, cioè
 * fuori da ogni parentesi: quelli di sottoquery, CTE e funzioni finestra non
 * fissano l’ordine del risultato. Commenti, stringhe e nomi fra virgolette
 * sono ignorati.
 */
export function hasOuterOrderBy(sql: string): boolean {
  const bare = sql.replace(
    /--[^\n]*|\/\*[\s\S]*?(?:\*\/|$)|'(?:[^']|'')*'|"(?:[^"]|"")*"|`(?:[^`]|``)*`|\[[^\]]*\]/g,
    ' ',
  );
  const statements = [''];
  let depth = 0;
  for (const char of bare) {
    if (char === '(') depth++;
    else if (char === ')') depth = Math.max(0, depth - 1);
    else if (depth > 0) continue;
    else if (char === ';') statements.push('');
    else statements[statements.length - 1] += char;
  }
  const last = statements.findLast((statement) => statement.trim() !== '') ?? '';
  return /\border\s+by\b/i.test(last);
}

/** Chiave di confronto di una cella: due celle sono uguali se hanno la stessa chiave. */
function cellKey(value: SqlValue): string {
  if (value === null) return 'N';
  if (typeof value === 'number') return `D${Number(value.toPrecision(12))}`;
  if (typeof value === 'string') return `S${value}`;
  return `B${Array.from(value, (byte) => byte.toString(16).padStart(2, '0')).join('')}`;
}

/** Aggiunge una cella alla chiave di una riga, senza ambiguità sui confini. */
function extend(rowKey: string, cell: string): string {
  return `${rowKey}${cell.length}:${cell}`;
}

function sameSequence(a: string[], b: string[]): boolean {
  return a.every((key, index) => key === b[index]);
}

/** Differenza fra due elenchi di nomi, con ripetizioni e senza distinguere le maiuscole. */
function namesNotIn(names: string[], others: string[]): string[] {
  const available = others.map((name) => name.toLowerCase());
  return names.filter((name) => {
    const index = available.indexOf(name.toLowerCase());
    if (index < 0) return true;
    available.splice(index, 1);
    return false;
  });
}

/** Oltre questo numero di tentativi la ricerca della corrispondenza fra colonne si ferma. */
const MAX_SEARCH_STEPS = 20_000;

/**
 * Confronta due risultati completi (non troncati). Restituisce `null` se
 * coincidono secondo le regole in testa al file, altrimenti il motivo.
 */
export function compareResults(
  student: ResultSet | null,
  expected: ResultSet,
  ordered: boolean,
): Mismatch | null {
  if (!student) return { kind: 'no-result' };

  const width = expected.columns.length;
  if (student.columns.length !== width) {
    return {
      kind: 'columns',
      actual: student.columns.length,
      expected: width,
      missing: namesNotIn(expected.columns, student.columns),
      extra: namesNotIn(student.columns, expected.columns),
    };
  }
  if (student.totalRows !== expected.totalRows) {
    return { kind: 'rows', actual: student.totalRows, expected: expected.totalRows };
  }

  const studentCells = student.rows.map((row) => row.map(cellKey));
  const expectedCells = expected.rows.map((row) => row.map(cellKey));
  const height = expectedCells.length;

  // prefixes[k][r]: chiave delle prime k colonne della riga attesa r.
  const prefixes: string[][] = [Array<string>(height).fill('')];
  for (let k = 0; k < width; k++) {
    prefixes.push(prefixes[k].map((key, r) => extend(key, expectedCells[r][k])));
  }
  const sortedPrefixes = prefixes.map((keys) => [...keys].sort());

  const studentNames = student.columns.map((name) => name.toLowerCase());
  const expectedNames = expected.columns.map((name) => name.toLowerCase());

  /** Colonne dello studente candidate per la colonna attesa k: stesso nome, poi stessa posizione, poi le altre. */
  function candidates(k: number, used: boolean[]): number[] {
    const rank = (j: number) => (studentNames[j] === expectedNames[k] ? 0 : j === k ? 1 : 2);
    return [...Array(width).keys()].filter((j) => !used[j]).sort((a, b) => rank(a) - rank(b) || a - b);
  }

  let steps = 0;
  let wrongOrderAt: number | null = null;

  /**
   * Assegna una colonna dello studente a ogni colonna attesa, da sinistra.
   * Un’assegnazione parziale si abbandona appena le righe, limitate alle
   * colonne assegnate, non sono più le stesse: così le n! permutazioni non si
   * provano mai tutte. `true` se trova una corrispondenza che rende uguali i
   * risultati.
   */
  function search(k: number, used: boolean[], keys: string[]): boolean {
    if (k === width) {
      if (!ordered || sameSequence(keys, prefixes[width])) return true;
      wrongOrderAt ??= keys.findIndex((key, r) => key !== prefixes[width][r]);
      return false;
    }
    for (const j of candidates(k, used)) {
      if (++steps > MAX_SEARCH_STEPS) return false;
      const next = keys.map((key, r) => extend(key, studentCells[r][j]));
      if (!sameSequence([...next].sort(), sortedPrefixes[k + 1])) continue;
      used[j] = true;
      const found = search(k + 1, used, next);
      used[j] = false;
      if (found) return true;
    }
    return false;
  }

  if (search(0, Array<boolean>(width).fill(false), Array<string>(height).fill(''))) return null;

  if (wrongOrderAt !== null) {
    return {
      kind: 'order',
      rowNumber: wrongOrderAt + 1,
      row: student.rows[wrongOrderAt],
      expectedRow: expected.rows[wrongOrderAt],
    };
  }

  // Per indicare la prima riga diversa serve comunque una corrispondenza fra
  // le colonne: per nome se i nomi coincidono tutti, altrimenti per posizione.
  const byName = expectedNames.map((name) => studentNames.indexOf(name));
  const mapping =
    new Set(studentNames).size === width && byName.every((j) => j >= 0)
      ? byName
      : [...Array(width).keys()];
  const remaining = new Map<string, number>();
  for (const key of prefixes[width]) remaining.set(key, (remaining.get(key) ?? 0) + 1);
  let firstDifferent = 0;
  for (let r = 0; r < height; r++) {
    const key = mapping.reduce((acc, j) => extend(acc, studentCells[r][j]), '');
    const left = remaining.get(key) ?? 0;
    if (left === 0) {
      firstDifferent = r;
      break;
    }
    remaining.set(key, left - 1);
  }
  return { kind: 'values', rowNumber: firstDifferent + 1, row: student.rows[firstDifferent] };
}
