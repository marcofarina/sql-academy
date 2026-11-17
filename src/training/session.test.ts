import { expect, test } from 'vitest';
import type { Chapter, Difficulty, Exercise } from '../themes/contract.ts';
import { eligibleExercises, generateSession, type SessionConfig } from './session.ts';

function exercise(id: string, chapter: Chapter, difficulty: Difficulty, keywords: string[]): Exercise {
  return { id, chapter, difficulty, keywords, title: id, prompt: id, expectedQuery: 'SELECT 1', hints: [], tables: ['t'] };
}

// 12 esercizi: 6 facili, 4 medi, 2 difficili, su tre capitoli.
const bank: Exercise[] = [
  ...Array.from({ length: 6 }, (_, i) => exercise(`f${i}`, 'una-tabella', 'facile', ['SELECT', 'WHERE'])),
  ...Array.from({ length: 4 }, (_, i) => exercise(`m${i}`, 'join', 'medio', ['SELECT', 'JOIN'])),
  ...Array.from({ length: 2 }, (_, i) => exercise(`d${i}`, 'aggregazioni', 'difficile', ['GROUP BY'])),
];

const all: SessionConfig = {
  length: 5,
  difficulty: 'bilanciata',
  chapters: ['una-tabella', 'join', 'aggregazioni', 'sottoquery-viste'],
  keywords: [],
};

/** Generatore pseudocasuale con seme, per test ripetibili. */
function seeded(seed: number): () => number {
  return () => {
    seed = (seed * 1_103_515_245 + 12_345) % 2 ** 31;
    return seed / 2 ** 31;
  };
}

test('la sessione ha la lunghezza chiesta e nessun esercizio ripetuto', () => {
  for (let seed = 1; seed <= 50; seed++) {
    for (const length of [5, 10] as const) {
      const session = generateSession(bank, { ...all, length }, seeded(seed));
      expect(session).toHaveLength(length);
      expect(new Set(session.map((e) => e.id)).size).toBe(length);
    }
  }
});

test('bilanciata: le difficoltà in parti il più possibile uguali, dalla più facile', () => {
  const session = generateSession(bank, { ...all, length: 5 }, seeded(7));
  const counts = { facile: 0, medio: 0, difficile: 0 };
  session.forEach((e) => counts[e.difficulty]++);
  expect(counts).toEqual({ facile: 2, medio: 2, difficile: 1 });
  expect(session.map((e) => e.difficulty)).toEqual(['facile', 'facile', 'medio', 'medio', 'difficile']);
});

test('bilanciata con una difficoltà scarsa: le altre colmano la differenza', () => {
  const session = generateSession(bank, { ...all, length: 10 }, seeded(3));
  expect(session.filter((e) => e.difficulty === 'difficile')).toHaveLength(2);
  expect(session).toHaveLength(10);
});

test('difficoltà singola, capitoli e parole chiave filtrano gli esercizi', () => {
  expect(generateSession(bank, { ...all, difficulty: 'medio' }).every((e) => e.difficulty === 'medio')).toBe(true);
  expect(generateSession(bank, { ...all, chapters: ['join'] }).every((e) => e.chapter === 'join')).toBe(true);
  const withJoin = eligibleExercises(bank, { ...all, keywords: ['JOIN', 'GROUP BY'] });
  expect(withJoin.map((e) => e.id)).toEqual(['m0', 'm1', 'm2', 'm3', 'd0', 'd1']);
});

test('filtri che non trovano abbastanza esercizi: sessione più corta, mai esercizi fuori dai filtri', () => {
  const session = generateSession(bank, { ...all, length: 20, difficulty: 'difficile' }, seeded(5));
  expect(session.map((e) => e.id).sort()).toEqual(['d0', 'd1']);
  expect(generateSession(bank, { ...all, length: 20 })).toHaveLength(12);
  expect(generateSession(bank, { ...all, chapters: ['sottoquery-viste'] })).toEqual([]);
});
