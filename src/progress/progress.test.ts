import { expect, test } from 'vitest';
import {
  MAX_QUERY_LENGTH,
  clearProgress,
  loadProgress,
  parseProgress,
  progressKey,
  saveProgress,
  serializeProgress,
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
  exercises: {
    'ex-001': { solved: true, attempts: 2, hintsRevealed: 1, solutionSeen: false, lastQuery: 'SELECT * FROM pianeti' },
  },
};

test('la chiave contiene tema e versione', () => {
  expect(progressKey('star-wars')).toBe('sql-academy:star-wars:v1');
});

test('salvare e rileggere restituisce gli stessi progressi', () => {
  const storage = memoryStorage();
  expect(saveProgress(storage, 'star-wars', sample)).toBe(true);
  expect(loadProgress(storage, 'star-wars')).toEqual(sample);
  expect(loadProgress(storage, 'altro-tema')).toEqual({ exercises: {} });
});

test('JSON rotto, valori estranei e versione diversa danno progressi vuoti', () => {
  expect(parseProgress(null)).toEqual({ exercises: {} });
  expect(parseProgress('{non è json')).toEqual({ exercises: {} });
  expect(parseProgress('42')).toEqual({ exercises: {} });
  expect(parseProgress('[]')).toEqual({ exercises: {} });
  expect(parseProgress(JSON.stringify({ version: 0, exercises: sample.exercises }))).toEqual({ exercises: {} });
  expect(parseProgress(JSON.stringify({ exercises: sample.exercises }))).toEqual({ exercises: {} });
});

test('voci malformate: si scartano o si correggono campo per campo', () => {
  const text = JSON.stringify({
    version: 1,
    exercises: {
      'ex-001': 'risolto',
      'ex-002': { solved: 'sì', attempts: -3, hintsRevealed: 1.5, lastQuery: 7 },
      'ex-003': { solved: true, lastQuery: 'x'.repeat(MAX_QUERY_LENGTH + 10) },
    },
  });
  const progress = parseProgress(text);
  expect(progress.exercises['ex-001']).toBeUndefined();
  expect(progress.exercises['ex-002']).toEqual({
    solved: false,
    attempts: 0,
    hintsRevealed: 0,
    solutionSeen: false,
    lastQuery: '',
  });
  expect(progress.exercises['ex-003'].solved).toBe(true);
  expect(progress.exercises['ex-003'].lastQuery).toHaveLength(MAX_QUERY_LENGTH);
});

test('il testo salvato ha la forma documentata', () => {
  expect(JSON.parse(serializeProgress(sample))).toEqual({ version: 1, exercises: sample.exercises });
});

test('senza archivio, o con un archivio che solleva eccezioni, nulla si rompe', () => {
  expect(loadProgress(undefined, 'star-wars')).toEqual({ exercises: {} });
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
  expect(loadProgress(broken, 'star-wars')).toEqual({ exercises: {} });
  expect(saveProgress(broken, 'star-wars', sample)).toBe(false);
  expect(() => clearProgress(broken, 'star-wars')).not.toThrow();
});

test('azzerare cancella solo il tema indicato', () => {
  const storage = memoryStorage();
  saveProgress(storage, 'star-wars', sample);
  saveProgress(storage, 'altro-tema', sample);
  clearProgress(storage, 'star-wars');
  expect(loadProgress(storage, 'star-wars')).toEqual({ exercises: {} });
  expect(loadProgress(storage, 'altro-tema')).toEqual(sample);
});
