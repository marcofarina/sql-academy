/** Messaggi e indizi verificati contro il motore SQLite del portale. */

import { afterAll, beforeAll, expect, test } from 'vitest';
import { createNodeEngine } from '../sql/testing/nodeEngine.ts';
import { findTheme } from '../themes/registry.ts';
import { explainSqlError } from './explainSqlError.ts';
import { openSandbox, type Sandbox } from './session.ts';

const engine = createNodeEngine({ timeoutMs: 1_500 });
let sandbox: Sandbox;

beforeAll(async () => {
  const theme = findTheme('star-wars')!;
  const script = await theme.loadDatabaseScript();
  sandbox = await openSandbox(engine, {
    key: 'star-wars-errori',
    script: script + `
      CREATE TABLE squadre (nome TEXT, stagione INTEGER, UNIQUE (nome, stagione));
      INSERT INTO squadre VALUES ('Rogue', 1);
    `,
  });
});

afterAll(() => engine.dispose());

test.each([
  {
    query: 'SELECT nme FROM personaggi',
    message: 'no such column: nme',
    text: 'SQLite non trova la colonna «nme» nella query.',
    hint: '«nome»',
  },
  {
    query: 'SELECT * FROM personaggio',
    message: 'no such table: personaggio',
    text: 'SQLite non trova la tabella «personaggio».',
    hint: 'Nello schema trovi la tabella «personaggi».',
  },
  {
    query: 'SELECT nome FROM personaggi JOIN specie ON personaggi.specie_id = specie.id',
    message: 'ambiguous column name: nome',
    text: 'Più tabelle della query hanno una colonna «nome». Indica a quale tabella ti riferisci.',
    hint: 'Scrivi il nome o l’alias della tabella',
  },
  {
    query: 'SELECT nome FORM personaggi',
    message: 'near "personaggi": syntax error',
    text: 'SQLite ha trovato un errore di sintassi vicino a «personaggi».',
    hint: 'Rileggi la query a partire dalle parole che precedono quel punto.',
  },
  {
    query: 'SELECT nome FROM',
    message: 'incomplete input',
    text: 'La query è incompleta.',
    hint: 'Controlla l’ultima clausola',
  },
  {
    query: 'SELECT nome FROM personaggi WHERE COUNT(*) > 1',
    message: 'misuse of aggregate function COUNT()',
    text: 'In quel punto della query SQLite non consente la funzione di aggregazione «COUNT()».',
    hint: 'Se l’hai scritta in WHERE',
  },
  {
    query: "INSERT INTO personaggi (nome, ruolo) VALUES ('Ahsoka')",
    message: '1 values for 2 columns',
    text: 'INSERT ha ricevuto un numero di valori diverso dal numero di colonne da riempire.',
    hint: 'Fai corrispondere ogni valore a una colonna',
  },
  {
    query: "INSERT INTO pianeti VALUES ('Tatooine')",
    message: 'table pianeti has 6 columns but 1 values were supplied',
    text: 'INSERT ha ricevuto un numero di valori diverso dal numero di colonne da riempire.',
    hint: 'Fai corrispondere ogni valore a una colonna',
  },
  {
    query: "INSERT INTO personaggi (nome, specie_id) VALUES ('Esempio', -1)",
    message: 'FOREIGN KEY constraint failed',
    text: 'La modifica viola una chiave esterna.',
    hint: 'verifica che la riga a cui rimanda esista',
  },
  {
    query: 'INSERT INTO personaggi (nome) VALUES (NULL)',
    message: 'NOT NULL constraint failed: personaggi.nome',
    text: 'La colonna «personaggi.nome» richiede un valore diverso da NULL.',
    hint: 'controlla il valore assegnato a quella colonna',
  },
  {
    query: "INSERT INTO personaggi (id, nome) VALUES (1, 'Esempio')",
    message: 'UNIQUE constraint failed: personaggi.id',
    text: 'Il valore di «personaggi.id» deve essere univoco.',
    hint: 'Controlla se esiste già una riga con quel valore.',
  },
  {
    query: "INSERT INTO squadre VALUES ('Rogue', 1)",
    message: 'UNIQUE constraint failed: squadre.nome, squadre.stagione',
    text: 'La combinazione dei valori di «squadre.nome» e «squadre.stagione» deve essere univoca.',
    hint: 'Controlla se esiste già una riga con gli stessi valori',
  },
  {
    query: 'SELECT funzione_inesistente(nome) FROM personaggi',
    message: 'no such function: funzione_inesistente',
    text: 'SQLite ha interrotto l’esecuzione della query.',
    hint: 'provale una alla volta',
  },
])('spiega $message', async ({ query, message, text, hint }) => {
  const outcome = await sandbox.run(query);
  expect(outcome).toEqual({ kind: 'sql-error', message });
  if (outcome.kind !== 'sql-error') throw new Error('Atteso un errore di SQLite');
  const explanation = explainSqlError(outcome.message, sandbox.tables);
  expect(explanation.text).toBe(text);
  expect(explanation.hint).toContain(hint);
});

test('uno stesso nome di colonna può comparire in più tabelle', () => {
  const { hint } = explainSqlError('no such column: nme', sandbox.tables);
  expect(hint).toContain('«nome» in');
  expect(hint).toContain('«personaggi»');
  expect(hint).toContain('«specie»');
});

test('se il nome della tabella è esplicito, cerca solo fra le sue colonne', () => {
  const { hint } = explainSqlError('no such column: PERSONAGGI.NME', sandbox.tables);
  expect(hint).toBe('Nello schema trovi «nome» in «personaggi». Controlla le colonne delle tabelle che usi.');
});

test('rimanda allo schema se nessun nome assomiglia a quello segnalato', () => {
  expect(explainSqlError('no such column: fantacolonna', sandbox.tables).hint).toBe(
    'Apri lo schema. Controlla le colonne delle tabelle che usi.',
  );
});
