import { expect, test } from 'vitest';
import {
  EMPTY_EXERCISE_PROGRESS,
  MAX_QUERY_LENGTH,
  balanceOf,
  clearProgress,
  emptyProgress,
  loadProgress,
  parseProgress,
  progressKey,
  resetProgress,
  saveProgress,
  serializeProgress,
  withQuery,
  type ThemeProgress,
} from './progress.ts';

function memoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (index) => [...data.keys()][index] ?? null,
    removeItem: (key) => void data.delete(key),
    setItem: (key, value) => void data.set(key, String(value)),
  };
}

const sample: ThemeProgress = {
  epoch: 2,
  freeHintUsed: true,
  exercises: {
    'ex-001': {
      solved: true,
      attempts: 2,
      hintsRevealed: 1,
      solutionSeen: false,
      solutionBeforeSolve: false,
      pointsEarned: 10,
      pointsSpent: 3,
      lastQuery: 'SELECT * FROM pianeti',
      queryAt: 1_763_500_000_000,
      solvedAt: 1_763_400_000_000,
      reviewStep: 1,
      reviewAt: 1_763_600_000_000,
    },
  },
};

test('la chiave contiene tema e versione 2', () => {
  expect(progressKey('star-wars')).toBe('sql-academy:star-wars:v2');
});

test('salvare e rileggere restituisce gli stessi progressi', () => {
  const storage = memoryStorage();
  expect(saveProgress(storage, 'star-wars', sample)).toBe(true);
  expect(loadProgress(storage, 'star-wars')).toEqual(sample);
  expect(loadProgress(storage, 'altro-tema')).toEqual(emptyProgress());
});

test('JSON rotto, valori estranei e versione diversa danno progressi vuoti', () => {
  expect(parseProgress(null)).toEqual(emptyProgress());
  expect(parseProgress('{non è json')).toEqual(emptyProgress());
  expect(parseProgress('42')).toEqual(emptyProgress());
  expect(parseProgress('[]')).toEqual(emptyProgress());
  expect(parseProgress(JSON.stringify({ version: 0, exercises: sample.exercises }))).toEqual(emptyProgress());
  expect(parseProgress(JSON.stringify({ exercises: sample.exercises }))).toEqual(emptyProgress());
});

test('i dati della versione 1 si ignorano, senza migrazione', () => {
  const v1 = JSON.stringify({
    version: 1,
    exercises: { 'ex-001': { solved: true, attempts: 2, hintsRevealed: 1, solutionSeen: true, lastQuery: 'SELECT 1' } },
  });
  expect(parseProgress(v1)).toEqual(emptyProgress());
  const storage = memoryStorage();
  storage.setItem('sql-academy:star-wars:v1', v1);
  expect(loadProgress(storage, 'star-wars')).toEqual(emptyProgress());
});

test('voci malformate: si scartano o si correggono campo per campo', () => {
  const text = JSON.stringify({
    version: 2,
    epoch: -1,
    freeHintUsed: 'sì',
    exercises: {
      'ex-001': 'risolto',
      'ex-002': { solved: 'sì', attempts: -3, hintsRevealed: 1.5, lastQuery: 7, pointsEarned: -10, pointsSpent: 2.5 },
      'ex-003': { solved: true, pointsEarned: '10', lastQuery: 'x'.repeat(MAX_QUERY_LENGTH + 10) },
    },
  });
  const progress = parseProgress(text);
  expect(progress.epoch).toBe(0);
  expect(progress.freeHintUsed).toBe(false);
  expect(progress.exercises['ex-001']).toBeUndefined();
  expect(progress.exercises['ex-002']).toEqual(EMPTY_EXERCISE_PROGRESS);
  expect(progress.exercises['ex-003'].solved).toBe(true);
  expect(progress.exercises['ex-003'].pointsEarned).toBe(0);
  expect(progress.exercises['ex-003'].lastQuery).toHaveLength(MAX_QUERY_LENGTH);
});

test('il testo salvato ha la forma documentata', () => {
  expect(JSON.parse(serializeProgress(sample))).toEqual({
    version: 2,
    epoch: 2,
    freeHintUsed: true,
    exercises: sample.exercises,
  });
});

test('senza archivio, o con un archivio che solleva eccezioni, nulla si rompe', () => {
  expect(loadProgress(undefined, 'star-wars')).toEqual(emptyProgress());
  expect(saveProgress(undefined, 'star-wars', sample)).toBe(false);
  const broken = memoryStorage();
  broken.getItem = () => {
    throw new Error('SecurityError');
  };
  broken.setItem = () => {
    throw new Error('QuotaExceededError');
  };
  broken.removeItem = () => {
    throw new Error('SecurityError');
  };
  expect(loadProgress(broken, 'star-wars')).toEqual(emptyProgress());
  expect(saveProgress(broken, 'star-wars', sample)).toBe(false);
  expect(() => clearProgress(broken, 'star-wars')).not.toThrow();
});

test('cancellare l’archivio toglie solo il tema indicato', () => {
  const storage = memoryStorage();
  saveProgress(storage, 'star-wars', sample);
  saveProgress(storage, 'altro-tema', sample);
  clearProgress(storage, 'star-wars');
  expect(loadProgress(storage, 'star-wars')).toEqual(emptyProgress());
  expect(loadProgress(storage, 'altro-tema')).toEqual(sample);
});

test('il saldo è guadagni meno spese, mai sotto zero', () => {
  expect(balanceOf(emptyProgress())).toBe(0);
  expect(balanceOf(sample)).toBe(7);
  const overdrawn: ThemeProgress = {
    ...sample,
    exercises: { a: { ...EMPTY_EXERCISE_PROGRESS, pointsSpent: 5 } },
  };
  expect(balanceOf(overdrawn)).toBe(0);
});

test('azzerare svuota saldo e aiuto gratuito e fa salire l’epoca di uno', () => {
  const reset = resetProgress(sample);
  expect(reset).toEqual({ exercises: {}, freeHintUsed: false, epoch: 3 });
  expect(balanceOf(reset)).toBe(0);
  expect(resetProgress(reset).epoch).toBe(4);
});

test('salvare la query lascia intatto il resto e ne registra l’ora', () => {
  const next = withQuery(sample, 'ex-001', 'SELECT 1', 2000);
  expect(next.exercises['ex-001']).toEqual({ ...sample.exercises['ex-001'], lastQuery: 'SELECT 1', queryAt: 2000 });
  expect(next.freeHintUsed).toBe(true);
  expect(withQuery(emptyProgress(), 'ex-009', 'x', 5).exercises['ex-009']).toEqual({ ...EMPTY_EXERCISE_PROGRESS, lastQuery: 'x', queryAt: 5 });
});

test('la stessa query non cambia nulla, nemmeno l’ora', () => {
  expect(withQuery(sample, 'ex-001', 'SELECT * FROM pianeti', 9999)).toBe(sample);
});
