import { expect, test } from 'vitest';
import type { ResultSet, SqlValue } from '../sql/engine.ts';
import { compareResults, hasOuterOrderBy } from './compare.ts';

function set(columns: string[], rows: SqlValue[][]): ResultSet {
  return { columns, rows, totalRows: rows.length, truncated: false };
}

const expected = set(
  ['nome', 'clima'],
  [
    ['Tatooine', 'desertico'],
    ['Naboo', 'temperato'],
    ['Hoth', 'ghiacciato'],
  ],
);

test('risultati identici coincidono', () => {
  expect(compareResults(expected, expected, true)).toBeNull();
});

test('i nomi delle colonne non contano', () => {
  const student = set(['n', 'c'], expected.rows);
  expect(compareResults(student, expected, true)).toBeNull();
});

test('l’ordine delle colonne non conta, nemmeno con nomi diversi', () => {
  const swapped = expected.rows.map(([nome, clima]) => [clima, nome]);
  expect(compareResults(set(['clima', 'nome'], swapped), expected, true)).toBeNull();
  expect(compareResults(set(['a', 'b'], swapped), expected, true)).toBeNull();
});

test('colonne scambiate di posto con gli stessi valori ma righe diverse non coincidono', () => {
  // Ogni colonna ha gli stessi valori di quella attesa, ma accoppiati in altro modo.
  const student = set(
    ['nome', 'clima'],
    [
      ['Tatooine', 'temperato'],
      ['Naboo', 'desertico'],
      ['Hoth', 'ghiacciato'],
    ],
  );
  expect(compareResults(student, expected, false)).toEqual({
    kind: 'values',
    rowNumber: 1,
    row: ['Tatooine', 'temperato'],
  });
});

test('molte colonne con gli stessi valori si abbinano senza provare tutte le permutazioni', () => {
  const width = 12;
  const rows = Array.from({ length: 30 }, (_, r) => Array.from({ length: width }, (_, k) => (r * (k + 1)) % 31));
  const names = Array.from({ length: width }, (_, k) => `c${k}`);
  const reversed = rows.map((row) => [...row].reverse());
  expect(compareResults(set(names, reversed), set(names, rows), true)).toBeNull();
});

test('senza ORDER BY l’ordine delle righe non conta', () => {
  const student = set(expected.columns, [...expected.rows].reverse());
  expect(compareResults(student, expected, false)).toBeNull();
});

test('con ORDER BY l’ordine delle righe conta e si indica la prima fuori posto', () => {
  const student = set(expected.columns, [expected.rows[0], expected.rows[2], expected.rows[1]]);
  expect(compareResults(student, expected, true)).toEqual({
    kind: 'order',
    rowNumber: 2,
    row: ['Hoth', 'ghiacciato'],
    expectedRow: ['Naboo', 'temperato'],
  });
});

test('le righe duplicate contano', () => {
  const twice = set(['clima'], [['temperato'], ['temperato'], ['desertico']]);
  const other = set(['clima'], [['temperato'], ['desertico'], ['desertico']]);
  expect(compareResults(twice, twice, false)).toBeNull();
  expect(compareResults(other, twice, false)).toMatchObject({ kind: 'values', rowNumber: 3 });
  expect(compareResults(set(['clima'], [['temperato'], ['desertico']]), twice, false)).toEqual({
    kind: 'rows',
    actual: 2,
    expected: 3,
  });
});

test('NULL è uguale solo a NULL', () => {
  const withNull = set(['x'], [[null]]);
  expect(compareResults(withNull, withNull, false)).toBeNull();
  expect(compareResults(set(['x'], [[0]]), withNull, false)).toMatchObject({ kind: 'values' });
  expect(compareResults(set(['x'], [['']]), withNull, false)).toMatchObject({ kind: 'values' });
});

test('i numeri si confrontano a 12 cifre significative', () => {
  const third = set(['media'], [[0.1 + 0.2]]);
  expect(compareResults(set(['media'], [[0.3]]), third, false)).toBeNull();
  expect(compareResults(set(['media'], [[0.3001]]), third, false)).toMatchObject({ kind: 'values' });
});

test('un intero e un reale di pari valore coincidono, un numero e un testo no', () => {
  const three = set(['x'], [[3]]);
  expect(compareResults(set(['x'], [[3.0]]), three, false)).toBeNull();
  expect(compareResults(set(['x'], [['3']]), three, false)).toMatchObject({ kind: 'values' });
});

test('il testo si confronta esattamente', () => {
  const naboo = set(['nome'], [['Naboo']]);
  expect(compareResults(set(['nome'], [['naboo']]), naboo, false)).toMatchObject({ kind: 'values' });
  expect(compareResults(set(['nome'], [['Naboo ']]), naboo, false)).toMatchObject({ kind: 'values' });
});

test('colonne in più o in meno: si riportano i nomi', () => {
  const more = set(['id', 'Nome', 'clima'], [[1, 'Tatooine', 'desertico']]);
  const one = set(['nome', 'clima'], [['Tatooine', 'desertico']]);
  expect(compareResults(more, one, false)).toEqual({
    kind: 'columns',
    actual: 3,
    expected: 2,
    missing: [],
    extra: ['id'],
  });
  expect(compareResults(set(['nome'], [['Tatooine']]), one, false)).toEqual({
    kind: 'columns',
    actual: 1,
    expected: 2,
    missing: ['clima'],
    extra: [],
  });
});

test('nessun risultato dallo studente', () => {
  expect(compareResults(null, expected, false)).toEqual({ kind: 'no-result' });
});

test('due risultati vuoti coincidono', () => {
  expect(compareResults(set(['a'], []), set(['b'], []), true)).toBeNull();
});

test.each([
  ['SELECT nome FROM pianeti ORDER BY nome', true],
  ['select nome from pianeti order\n  by nome desc limit 3;', true],
  ['SELECT nome FROM pianeti UNION SELECT nome FROM personaggi ORDER BY 1', true],
  ['SELECT nome FROM pianeti', false],
  ['SELECT * FROM (SELECT nome FROM pianeti ORDER BY nome)', false],
  ['WITH p AS (SELECT nome FROM pianeti ORDER BY nome) SELECT * FROM p', false],
  ['SELECT nome, ROW_NUMBER() OVER (ORDER BY nome) FROM pianeti', false],
  ["SELECT 'ORDER BY' FROM pianeti", false],
  ['SELECT nome AS "order by" FROM pianeti', false],
  ['SELECT nome FROM pianeti -- ORDER BY nome', false],
  ['SELECT nome FROM pianeti /* ORDER BY nome */', false],
  ['SELECT nome FROM pianeti ORDER BY nome; SELECT nome FROM pianeti', false],
  ['SELECT nome FROM pianeti; SELECT nome FROM pianeti ORDER BY nome;', true],
])('ORDER BY esterno in %j: %s', (sql, outer) => {
  expect(hasOuterOrderBy(sql)).toBe(outer);
});
