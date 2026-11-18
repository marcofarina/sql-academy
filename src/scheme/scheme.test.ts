import { expect, test } from 'vitest';
import { initialScheme, schemeKey } from './scheme.ts';

test('la chiave è per tema, accanto a quella dei progressi', () => {
  expect(schemeKey('star-wars')).toBe('sql-academy:star-wars:schema');
});

test('alla prima visita segue la preferenza del sistema, poi la scelta salvata', () => {
  expect(initialScheme(null, true)).toBe('scuro');
  expect(initialScheme(null, false)).toBe('chiaro');
  expect(initialScheme('chiaro', true)).toBe('chiaro');
  expect(initialScheme('viola', true)).toBe('scuro');
});
