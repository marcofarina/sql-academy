import { expect, test } from 'vitest';
import { canonicalHash, formatRoute, parseRoute } from './route.ts';

test('hash vuoto o radice: elenco dei temi', () => {
  expect(parseRoute('')).toEqual({ page: 'home' });
  expect(parseRoute('#')).toEqual({ page: 'home' });
  expect(parseRoute('#/')).toEqual({ page: 'home' });
});

test('tema e sezione', () => {
  expect(parseRoute('#/star-wars/sandbox')).toEqual({ page: 'theme', themeId: 'star-wars', section: 'sandbox' });
  expect(parseRoute('#/star-wars/logico')).toEqual({ page: 'theme', themeId: 'star-wars', section: 'logico' });
});

test('tema senza sezione: la sandbox', () => {
  expect(parseRoute('#/star-wars')).toEqual({ page: 'theme', themeId: 'star-wars', section: 'sandbox' });
  expect(parseRoute('#/star-wars/')).toEqual({ page: 'theme', themeId: 'star-wars', section: 'sandbox' });
});

test('sezione sconosciuta o percorso troppo lungo: pagina non trovata', () => {
  expect(parseRoute('#/star-wars/cucina')).toEqual({ page: 'not-found' });
  expect(parseRoute('#/star-wars/sandbox/altro')).toEqual({ page: 'not-found' });
});

test('un tema inesistente è comunque un percorso valido: lo scarta chi ha il registro', () => {
  expect(parseRoute('#/narnia/sandbox')).toEqual({ page: 'theme', themeId: 'narnia', section: 'sandbox' });
});

test('formatRoute è l’inverso di parseRoute', () => {
  expect(formatRoute({ page: 'home' })).toBe('#/');
  const hash = formatRoute({ page: 'theme', themeId: 'star-wars', section: 'er' });
  expect(hash).toBe('#/star-wars/er');
  expect(parseRoute(hash)).toEqual({ page: 'theme', themeId: 'star-wars', section: 'er' });
});

test('hash canonico', () => {
  expect(canonicalHash('#/star-wars')).toBe('#/star-wars/sandbox');
  expect(canonicalHash('#/star-wars/sandbox')).toBeUndefined();
  expect(canonicalHash('')).toBeUndefined();
  expect(canonicalHash('#')).toBe('#/');
  expect(canonicalHash('#/star-wars/cucina')).toBeUndefined();
});

test('addestramento: esercizio o sessione', () => {
  expect(parseRoute('#/star-wars/addestramento/ex-001')).toEqual({
    page: 'theme',
    themeId: 'star-wars',
    section: 'addestramento',
    item: 'ex-001',
  });
  expect(parseRoute('#/star-wars/addestramento/sessione')).toMatchObject({ item: 'sessione' });
  expect(parseRoute('#/star-wars/query/ex-001')).toEqual({ page: 'not-found' });
  expect(parseRoute('#/star-wars/addestramento/ex-001/altro')).toEqual({ page: 'not-found' });
  const hash = formatRoute({ page: 'theme', themeId: 'star-wars', section: 'addestramento', item: 'ex-001' });
  expect(hash).toBe('#/star-wars/addestramento/ex-001');
  expect(canonicalHash(hash)).toBeUndefined();
});

test('la pagina dello zaino', () => {
  expect(parseRoute('#/zaino')).toEqual({ page: 'zaino' });
  expect(parseRoute('#/zaino/')).toEqual({ page: 'zaino' });
  expect(formatRoute({ page: 'zaino' })).toBe('#/zaino');
  expect(canonicalHash('#/zaino')).toBeUndefined();
});
