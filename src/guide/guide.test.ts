import { expect, test } from 'vitest';
import { clearGuide, GUIDE_KEY, guideSeen, markGuideSeen } from './guide.ts';

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

test('la guida si vede finché non si chiude, e torna dopo la cancellazione', () => {
  const storage = memoryStorage();
  expect(guideSeen(storage)).toBe(false);
  markGuideSeen(storage);
  expect(storage.getItem(GUIDE_KEY)).toBe('1');
  expect(guideSeen(storage)).toBe(true);
  clearGuide(storage);
  expect(guideSeen(storage)).toBe(false);
});

test('senza archivio, o con un archivio che solleva eccezioni, nulla si rompe', () => {
  expect(guideSeen(null)).toBe(false);
  expect(() => markGuideSeen(null)).not.toThrow();
  const broken = memoryStorage();
  broken.getItem = () => {
    throw new Error('SecurityError');
  };
  broken.setItem = broken.getItem;
  broken.removeItem = broken.getItem;
  expect(guideSeen(broken)).toBe(false);
  expect(() => markGuideSeen(broken)).not.toThrow();
  expect(() => clearGuide(broken)).not.toThrow();
});
