import { expect, test } from 'vitest';
import { haProblemi, testoStato } from './labels.ts';
import type { StatoZaino } from './sincronizza.ts';

const stato = (cambi: Partial<StatoZaino>): StatoZaino => ({
  supportato: true,
  fase: 'sincronizzato',
  motivo: null,
  inSospeso: false,
  byte: null,
  ultima: null,
  ...cambi,
});

test('nessun testo con lo zaino scollegato', () => {
  expect(testoStato(stato({ fase: 'scollegato' }))).toBeNull();
  expect(haProblemi(stato({ fase: 'scollegato' }))).toBe(false);
});

test('sincronizzato, con e senza modifiche in sospeso', () => {
  expect(testoStato(stato({}))).toBe('Zaino collegato.');
  expect(testoStato(stato({ ultima: '2026-11-19T07:05:00.000Z', inSospeso: true }))).toMatch(/^Zaino sincronizzato alle \d\d:\d\d\. Alcune modifiche partono fra poco\.$/);
});

test('errori e rete assente sono problemi, ognuno con il suo testo', () => {
  expect(haProblemi(stato({ fase: 'offline' }))).toBe(true);
  expect(haProblemi(stato({ fase: 'errore', motivo: 'servizio' }))).toBe(true);
  const testi = (['pieno', 'cancellato', 'aggiorna', 'illeggibile', 'servizio'] as const).map((motivo) => testoStato(stato({ fase: 'errore', motivo })));
  expect(new Set(testi).size).toBe(5);
});
