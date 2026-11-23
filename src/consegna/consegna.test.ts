import { describe, expect, test } from 'vitest';
import { CONSEGNA_MAX, cleanTitle, decodeConsegna, encodeConsegna, readConsegna, TITOLO_MAX } from './consegna.ts';

const THEME = ['ex-001', 'ex-003', 'ex-017', 'ex-042', 'ex-101', 'ex-1000', 'nodo-speciale'];

describe('scrittura del codice', () => {
  test('versione, poi i numeri degli esercizi nell’ordine dato', () => {
    expect(encodeConsegna(['ex-042', 'ex-003', 'ex-101', 'ex-017'])).toBe('1.42.3.101.17');
  });

  test('un id di altra forma si scrive per intero', () => {
    expect(encodeConsegna(['nodo-speciale', 'ex-1000'])).toBe('1.nodo-speciale.1000');
  });

  test('un id con zeri non canonici non perde le cifre', () => {
    expect(encodeConsegna(['ex-0042'])).toBe('1.ex-0042');
    expect(decodeConsegna('1.ex-0042')).toEqual(['ex-0042']);
  });
});

describe('lettura del codice', () => {
  test('è l’inverso della scrittura e conserva l’ordine', () => {
    const ids = ['ex-042', 'ex-003', 'ex-1000', 'nodo-speciale', 'ex-001'];
    expect(decodeConsegna(encodeConsegna(ids))).toEqual(ids);
  });

  test('un punto finale, incollato a fine frase, non conta', () => {
    expect(decodeConsegna('1.3.17.')).toEqual(['ex-003', 'ex-017']);
    expect(decodeConsegna('1.3.17..')).toBeUndefined();
  });

  test('le ripetizioni si tolgono, resta la prima', () => {
    expect(decodeConsegna('1.3.17.3.042')).toEqual(['ex-003', 'ex-017', 'ex-042']);
  });

  test.each([
    ['', 'vuoto'],
    ['1', 'senza esercizi'],
    ['2.3.17', 'di un’altra versione'],
    ['v1.3.17', 'con la versione scritta male'],
    ['1.3..17', 'con un elemento vuoto'],
    ['1.3.<script>', 'con caratteri estranei'],
    ['1.3.Ex-017', 'con maiuscole'],
    ['1.1234567', 'con un numero troppo lungo'],
    [`1.${Array.from({ length: CONSEGNA_MAX + 1 }, (_, i) => i + 1).join('.')}`, 'troppo lungo'],
  ])('un codice %j (%s) è illeggibile', (code) => {
    expect(decodeConsegna(code)).toBeUndefined();
  });

  test(`fino a ${CONSEGNA_MAX} esercizi il codice si legge`, () => {
    const code = `1.${Array.from({ length: CONSEGNA_MAX }, (_, i) => i + 1).join('.')}`;
    expect(decodeConsegna(code)).toHaveLength(CONSEGNA_MAX);
  });
});

describe('lettura rispetto al tema', () => {
  test('tiene gli esercizi del tema nell’ordine del link', () => {
    expect(readConsegna({ code: '1.42.3.101.17', title: 'Join e gruppi' }, THEME)).toEqual({
      ok: true,
      ids: ['ex-042', 'ex-003', 'ex-101', 'ex-017'],
      missing: 0,
      title: 'Join e gruppi',
    });
  });

  test('scarta gli esercizi che il tema non ha e li conta', () => {
    expect(readConsegna({ code: '1.3.999.17.500' }, THEME)).toEqual({ ok: true, ids: ['ex-003', 'ex-017'], missing: 2 });
  });

  test('nessun esercizio del tema: consegna vuota', () => {
    expect(readConsegna({ code: '1.998.999' }, THEME)).toEqual({ ok: false, reason: 'vuota' });
  });

  test('un link manomesso è illeggibile, senza eccezioni', () => {
    expect(readConsegna({ code: '1.3.%%' }, THEME)).toEqual({ ok: false, reason: 'illeggibile' });
    expect(readConsegna({ code: '9.3' }, THEME)).toEqual({ ok: false, reason: 'illeggibile' });
  });
});

describe('titolo', () => {
  test('spazi compattati e tagliati ai bordi; vuoto diventa assente', () => {
    expect(cleanTitle('  Join   e\tgruppi ')).toBe('Join e gruppi');
    expect(cleanTitle('   ')).toBeUndefined();
    expect(cleanTitle(undefined)).toBeUndefined();
  });

  test(`al massimo ${TITOLO_MAX} caratteri`, () => {
    expect(cleanTitle('a'.repeat(TITOLO_MAX + 20))).toHaveLength(TITOLO_MAX);
  });
});
