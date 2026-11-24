import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { chooseSiteScheme, clearSiteScheme, SITE_SCHEME_KEY, startSiteScheme } from './siteScheme.ts';

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

let dark = false;
let onChange: ((event: { matches: boolean }) => void) | undefined;
const root = { dataset: {} as Record<string, string> };

beforeEach(() => {
  dark = false;
  onChange = undefined;
  root.dataset = {};
  vi.stubGlobal('document', { documentElement: root });
  vi.stubGlobal('window', {
    matchMedia: () => ({
      get matches() {
        return dark;
      },
      addEventListener: (_: string, listener: (event: { matches: boolean }) => void) => {
        onChange = listener;
      },
    }),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

test('senza scelta segue il sistema, anche quando cambia a pagina aperta', () => {
  dark = true;
  startSiteScheme(memoryStorage());
  expect(root.dataset.schema).toBe('scuro');
  onChange?.({ matches: false });
  expect(root.dataset.schema).toBe('chiaro');
});

test('la scelta salvata vale più del sistema e sparisce con la cancellazione', () => {
  const storage = memoryStorage();
  dark = true;
  chooseSiteScheme('chiaro', storage);
  expect(storage.getItem(SITE_SCHEME_KEY)).toBe('chiaro');
  startSiteScheme(storage);
  expect(root.dataset.schema).toBe('chiaro');
  clearSiteScheme(storage);
  expect(storage.getItem(SITE_SCHEME_KEY)).toBeNull();
  expect(root.dataset.schema).toBe('scuro');
});

test('senza archivio la scelta vale per la pagina aperta', () => {
  expect(() => chooseSiteScheme('scuro', null)).not.toThrow();
  expect(root.dataset.schema).toBe('scuro');
});
