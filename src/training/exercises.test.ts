import { expect, test } from 'vitest';
import type { Exercise } from '../themes/contract.ts';
import { buildPath, filterCatalog, formatQuery } from './exercises.ts';

const base = { expectedQuery: 'SELECT 1', hints: ['uno', 'due'] };
const bank: Exercise[] = [
  { ...base, id: 'b', chapter: 'join', difficulty: 'difficile', keywords: ['JOIN'], title: 'Navi e piloti', prompt: 'Elenca le navi.', tables: ['astronavi'] },
  { ...base, id: 'a', chapter: 'una-tabella', difficulty: 'medio', keywords: ['WHERE'], title: 'Pianeti caldi', prompt: 'Città più calde.', tables: ['pianeti'] },
  { ...base, id: 'c', chapter: 'join', difficulty: 'facile', keywords: ['LEFT JOIN', 'JOIN'], title: 'Specie', prompt: 'Specie senza pianeta.', tables: ['specie', 'pianeti'] },
];

test('percorso: capitoli nell’ordine del libro, esercizi per difficoltà', () => {
  const path = buildPath(bank);
  expect(path.map((g) => g.chapter)).toEqual(['una-tabella', 'join']);
  expect(path[1].exercises.map((e) => e.id)).toEqual(['c', 'b']);
});

test('catalogo: filtri per parola chiave, tabella, capitolo e testo senza accenti', () => {
  expect(filterCatalog(bank, { text: '', keyword: 'JOIN' }).map((e) => e.id)).toEqual(['c', 'b']);
  expect(filterCatalog(bank, { text: '', table: 'pianeti' }).map((e) => e.id)).toEqual(['a', 'c']);
  expect(filterCatalog(bank, { text: '', chapter: 'una-tabella' }).map((e) => e.id)).toEqual(['a']);
  expect(filterCatalog(bank, { text: 'CITTA calde' }).map((e) => e.id)).toEqual(['a']);
  expect(filterCatalog(bank, { text: 'navi', difficulty: 'facile' })).toEqual([]);
});

test('la query mostrata perde il rientro comune', () => {
  expect(formatQuery('\n      SELECT nome\n      FROM pianeti\n        WHERE x = 1')).toBe('SELECT nome\nFROM pianeti\n  WHERE x = 1');
});
