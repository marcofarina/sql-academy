import { expect, test } from 'vitest';
import { EMPTY_EXERCISE_PROGRESS, emptyProgress, type ExerciseProgress, type ThemeProgress } from '../progress/progress.ts';
import type { Exercise } from '../themes/contract.ts';
import { lastExercise } from './resume.ts';

const exercise = (id: string): Exercise => ({
  id,
  chapter: 'una-tabella',
  difficulty: 'facile',
  keywords: ['SELECT'],
  title: `Titolo ${id}`,
  prompt: id,
  expectedQuery: 'SELECT 1',
  hints: [],
  tables: ['t'],
});

const bank = ['ex-001', 'ex-002', 'ex-003'].map(exercise);

function progressWith(entries: Record<string, Partial<ExerciseProgress>>): ThemeProgress {
  const exercises = Object.fromEntries(
    Object.entries(entries).map(([id, change]) => [id, { ...EMPTY_EXERCISE_PROGRESS, ...change }]),
  );
  return { ...emptyProgress(), exercises };
}

test('senza query scritte non c’è un ultimo esercizio', () => {
  expect(lastExercise(bank, emptyProgress())).toBeUndefined();
  expect(lastExercise(bank, progressWith({ 'ex-001': { solved: true, attempts: 2 } }))).toBeUndefined();
  expect(lastExercise([], progressWith({ 'ex-001': { lastQuery: 'SELECT 1', queryAt: 10 } }))).toBeUndefined();
});

test('vince la query scritta più di recente, risolto o no', () => {
  const progress = progressWith({
    'ex-001': { lastQuery: 'SELECT a', queryAt: 300, solved: true },
    'ex-002': { lastQuery: 'SELECT b', queryAt: 100 },
    'ex-003': { lastQuery: 'SELECT c', queryAt: 200 },
  });
  expect(lastExercise(bank, progress)?.id).toBe('ex-001');
});

test('gli esercizi che il tema non ha più si ignorano', () => {
  const progress = progressWith({
    'ex-999': { lastQuery: 'SELECT z', queryAt: 900 },
    'ex-002': { lastQuery: 'SELECT b', queryAt: 100 },
  });
  expect(lastExercise(bank, progress)?.id).toBe('ex-002');
});

test('a parità di ora vince il primo nell’ordine degli esercizi', () => {
  const progress = progressWith({
    'ex-003': { lastQuery: 'SELECT c', queryAt: 50 },
    'ex-002': { lastQuery: 'SELECT b', queryAt: 50 },
  });
  expect(lastExercise(bank, progress)?.id).toBe('ex-002');
});

test('una query senza ora (dati di prima di `queryAt`) non conta', () => {
  const progress = progressWith({ 'ex-001': { lastQuery: 'SELECT a', queryAt: 0 } });
  expect(lastExercise(bank, progress)).toBeUndefined();
});
