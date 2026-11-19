import { expect, test } from 'vitest';
import { EMPTY_EXERCISE_PROGRESS, mergeProgress, readThemeData, type ExerciseProgress, type ThemeProgress } from './progress.ts';

const exercise = (change: Partial<ExerciseProgress>): ExerciseProgress => ({ ...EMPTY_EXERCISE_PROGRESS, ...change });

const a: ThemeProgress = {
  epoch: 1,
  freeHintUsed: false,
  exercises: {
    'ex-001': exercise({ solved: true, attempts: 3, pointsEarned: 10, lastQuery: 'SELECT 1', queryAt: 100 }),
    'ex-002': exercise({ attempts: 1, hintsRevealed: 2, pointsSpent: 3, lastQuery: 'SELECT a', queryAt: 300 }),
  },
};

const b: ThemeProgress = {
  epoch: 1,
  freeHintUsed: true,
  exercises: {
    'ex-002': exercise({ attempts: 4, hintsRevealed: 1, solutionSeen: true, solutionBeforeSolve: true, pointsSpent: 8, lastQuery: 'SELECT b', queryAt: 200 }),
    'ex-003': exercise({ solved: true, attempts: 1, pointsEarned: 20 }),
  },
};

const other: ThemeProgress = {
  epoch: 2,
  freeHintUsed: false,
  exercises: { 'ex-009': exercise({ solved: true, attempts: 1, pointsEarned: 30 }) },
};

/** Il JSON confronta anche l’ordine delle chiavi, quindi degli esercizi. */
const text = (p: ThemeProgress) => JSON.stringify(p);

test('nella stessa epoca: massimo campo per campo, «o» sui booleani, unione degli esercizi', () => {
  const merged = mergeProgress(a, b);
  expect(merged.epoch).toBe(1);
  expect(merged.freeHintUsed).toBe(true);
  expect(Object.keys(merged.exercises)).toEqual(['ex-001', 'ex-002', 'ex-003']);
  expect(merged.exercises['ex-001']).toEqual(a.exercises['ex-001']);
  expect(merged.exercises['ex-003']).toEqual(b.exercises['ex-003']);
  expect(merged.exercises['ex-002']).toEqual({
    solved: false,
    attempts: 4,
    hintsRevealed: 2,
    solutionSeen: true,
    solutionBeforeSolve: true,
    pointsEarned: 0,
    pointsSpent: 8,
    lastQuery: 'SELECT a',
    queryAt: 300,
  });
});

test('l’unione è commutativa', () => {
  expect(text(mergeProgress(a, b))).toBe(text(mergeProgress(b, a)));
  expect(text(mergeProgress(a, other))).toBe(text(mergeProgress(other, a)));
});

test('l’unione è idempotente e associativa', () => {
  const ab = mergeProgress(a, b);
  expect(mergeProgress(ab, ab)).toEqual(ab);
  expect(mergeProgress(ab, a)).toEqual(ab);
  expect(mergeProgress(mergeProgress(a, b), other)).toEqual(mergeProgress(a, mergeProgress(b, other)));
});

test('fra epoche diverse vince la più alta, per intero', () => {
  expect(mergeProgress(a, other)).toEqual(other);
  expect(mergeProgress(other, b)).toEqual(other);
  // Un azzeramento (epoca più alta, nessun esercizio) non si ripopola con i dati vecchi.
  const reset: ThemeProgress = { epoch: 2, freeHintUsed: false, exercises: {} };
  expect(mergeProgress(mergeProgress(a, b), reset)).toEqual(reset);
});

test('ultima query: vince la più recente; a parità di ora decide il testo, in tutti e due gli ordini', () => {
  const x: ThemeProgress = { ...a, exercises: { 'ex-001': exercise({ lastQuery: 'SELECT x', queryAt: 50 }) } };
  const y: ThemeProgress = { ...a, exercises: { 'ex-001': exercise({ lastQuery: 'SELECT y', queryAt: 50 }) } };
  expect(mergeProgress(x, y).exercises['ex-001'].lastQuery).toBe('SELECT y');
  expect(mergeProgress(y, x).exercises['ex-001'].lastQuery).toBe('SELECT y');
});

test('readThemeData legge un oggetto senza versione e scarta le voci malformate', () => {
  expect(readThemeData(null)).toBeNull();
  expect(readThemeData({ epoch: 1 })).toBeNull();
  expect(readThemeData({ epoch: 3, freeHintUsed: true, exercises: { 'ex-001': { solved: true, queryAt: -4 }, 'ex-002': 7 } })).toEqual({
    epoch: 3,
    freeHintUsed: true,
    exercises: { 'ex-001': exercise({ solved: true }) },
  });
});
