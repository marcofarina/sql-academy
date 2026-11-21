import { expect, test } from 'vitest';
import { canonicalHash, formatRoute, parseRoute, returnLink } from './route.ts';

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

test('un hash con codifica malformata apre la pagina non trovata', () => {
  expect(parseRoute('#/%')).toEqual({ page: 'not-found' });
  expect(canonicalHash('#/lotr/addestramento/%E0%A4')).toBeUndefined();
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

test('le pagine della classifica e dell’informativa', () => {
  expect(parseRoute('#/classifica')).toEqual({ page: 'classifica' });
  expect(parseRoute('#/informativa/')).toEqual({ page: 'informativa' });
  expect(formatRoute({ page: 'classifica' })).toBe('#/classifica');
  expect(formatRoute({ page: 'informativa' })).toBe('#/informativa');
  expect(canonicalHash('#/classifica')).toBeUndefined();
});

test('la destinazione di ritorno conserva l’esercizio e nomina la provenienza', () => {
  const title = (id: string) => id === 'lotr' ? 'Il Signore degli Anelli' : undefined;
  const hash = '#/lotr/addestramento/ex-001';
  expect(returnLink(hash, title)).toEqual({ href: hash, label: 'Torna a Il Signore degli Anelli' });
  expect(returnLink('#/zaino', title)).toEqual({ href: '#/zaino', label: 'Torna allo zaino' });
  expect(returnLink('#/classifica', title)).toEqual({ href: '#/classifica', label: 'Torna alla classifica' });
  expect(returnLink('#/informativa', title)).toEqual({ href: '#/informativa', label: 'Torna all’informativa' });
  expect(returnLink('#/narnia/sandbox', title)).toEqual({ href: '#/narnia/sandbox', label: 'Torna alla pagina non trovata' });
  expect(returnLink('#/%', title)).toEqual({ href: '#/%', label: 'Torna alla pagina non trovata' });
});

test('dalla home o senza provenienza il ritorno va all’elenco dei temi', () => {
  for (const hash of [null, '#/']) {
    expect(returnLink(hash, () => undefined)).toEqual({ href: '#/', label: 'Tutti i temi' });
  }
});

test('un mondo della classifica ha un indirizzo e conserva il link di ritorno', () => {
  const hash = '#/classifica/lotr';
  expect(formatRoute({ page: 'classifica', themeId: 'lotr' })).toBe(hash);
  expect(parseRoute(hash)).toEqual({ page: 'classifica', themeId: 'lotr' });
  expect(returnLink(hash, () => undefined)).toEqual({ href: hash, label: 'Torna alla classifica' });
});
