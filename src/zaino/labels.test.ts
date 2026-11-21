import { expect, test } from 'vitest';
import { statoPillola, testoStato } from './labels.ts';
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

test('con lo zaino scollegato i progressi restano nel browser', () => {
  expect(testoStato(stato({ fase: 'scollegato' }))).toBe('Zaino non collegato: i progressi restano in questo browser.');
});

test('sincronizzato, con e senza modifiche in sospeso', () => {
  expect(testoStato(stato({}))).toBe('Zaino collegato.');
  expect(testoStato(stato({ ultima: '2026-11-19T07:05:00.000Z', inSospeso: true }))).toMatch(/^Zaino sincronizzato alle \d\d:\d\d\. Alcune modifiche partono fra poco\.$/);
});

test('errori e rete assente sono problemi, ognuno con il suo testo', () => {
  expect(testoStato(stato({ fase: 'offline' }))).toMatch(/^Sei senza rete/);
  const testi = (['pieno', 'cancellato', 'aggiorna', 'illeggibile', 'servizio'] as const).map((motivo) => testoStato(stato({ fase: 'errore', motivo })));
  expect(new Set(testi).size).toBe(5);
});

test('la pillola distingue i sei stati, anche con modifiche in sospeso', () => {
  expect(statoPillola(stato({ fase: 'scollegato' }))).toEqual({ fase: 'scollegato', parola: 'non collegato' });
  expect(statoPillola(stato({}))).toEqual({ fase: 'sincronizzato', parola: 'salvato' });
  expect(statoPillola(stato({ inSospeso: true }))).toEqual({ fase: 'in-attesa', parola: 'in attesa' });
  expect(statoPillola(stato({ fase: 'in-corso', inSospeso: true }))).toEqual({ fase: 'in-corso', parola: 'salvataggio…' });
  expect(statoPillola(stato({ fase: 'offline', inSospeso: true }))).toEqual({ fase: 'offline', parola: 'senza rete' });
  expect(statoPillola(stato({ fase: 'errore', inSospeso: true }))).toEqual({ fase: 'errore', parola: 'errore' });
});
