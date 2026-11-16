import { afterAll, expect, test } from 'vitest';
import type { DatabaseSource } from '../sql/engine.ts';
import { createNodeEngine } from '../sql/testing/nodeEngine.ts';
import { findTheme } from '../themes/registry.ts';
import { checkTheme } from './check.ts';
import { describeVerdict, ExerciseError, verifyAnswer } from './verify.ts';

const engine = createNodeEngine({ timeoutMs: 1_500 });
afterAll(() => engine.dispose());

const source: DatabaseSource = {
  key: 'verifica',
  script: `
    CREATE TABLE pianeti (id INTEGER PRIMARY KEY, nome TEXT NOT NULL, clima TEXT NOT NULL, diametro INTEGER);
    INSERT INTO pianeti VALUES
      (1, 'Tatooine', 'desertico', 10465),
      (2, 'Alderaan', 'temperato', 12500),
      (3, 'Naboo', 'temperato', 12120),
      (4, 'Dagobah', 'paludoso', NULL);
  `,
};

const verdict = async (expectedQuery: string, studentSql: string) =>
  (await verifyAnswer(engine, source, expectedQuery, studentSql)).verdict;

test('una risposta scritta in un altro modo ma con lo stesso risultato è corretta', async () => {
  const result = await verifyAnswer(
    engine,
    source,
    "SELECT nome FROM pianeti WHERE clima = 'temperato'",
    "SELECT nome FROM pianeti WHERE clima LIKE 'temp%' AND id > 0",
  );
  expect(result.verdict).toEqual({ kind: 'correct' });
  expect(result.student?.totalRows).toBe(2);
  expect(describeVerdict(result.verdict)).toBe('Risposta corretta.');
});

test('alias di colonna diversi non sono un errore', async () => {
  expect(await verdict('SELECT COUNT(*) AS totale FROM pianeti', 'SELECT COUNT(*) FROM pianeti')).toEqual({
    kind: 'correct',
  });
  expect(
    await verdict('SELECT nome, clima FROM pianeti', 'SELECT clima AS tipo, nome AS pianeta FROM pianeti'),
  ).toEqual({ kind: 'correct' });
});

test('SELECT * vale quanto l’elenco esplicito di tutte le colonne, in qualunque ordine', async () => {
  const explicit = 'SELECT diametro, clima, nome, id FROM pianeti';
  expect(await verdict('SELECT * FROM pianeti', explicit)).toEqual({ kind: 'correct' });
  expect(await verdict(explicit, 'SELECT * FROM pianeti')).toEqual({ kind: 'correct' });
});

test('SELECT * contro un elenco parziale: colonne in più, con i nomi', async () => {
  const result = await verdict('SELECT nome, clima FROM pianeti', 'SELECT * FROM pianeti');
  expect(result).toEqual({ kind: 'columns', actual: 4, expected: 2, missing: [], extra: ['id', 'diametro'] });
  expect(describeVerdict(result)).toBe('Il risultato ha 4 colonne: ne servono 2. In più: id, diametro.');
});

test('colonna mancante', async () => {
  const result = await verdict('SELECT nome, clima FROM pianeti', 'SELECT nome FROM pianeti');
  expect(describeVerdict(result)).toBe('Il risultato ha una colonna: ne servono 2. Manca: clima.');
});

test('numero di righe diverso', async () => {
  const result = await verdict("SELECT nome FROM pianeti WHERE clima = 'temperato'", 'SELECT nome FROM pianeti');
  expect(result).toEqual({ kind: 'rows', actual: 4, expected: 2 });
  expect(describeVerdict(result)).toBe('Il risultato ha righe in più: 4 invece di 2.');
});

test('stesso numero di righe, valori diversi: si indica la prima riga diversa', async () => {
  const result = await verdict(
    "SELECT nome FROM pianeti WHERE clima = 'temperato'",
    'SELECT nome FROM pianeti WHERE id <= 2',
  );
  expect(result).toEqual({ kind: 'values', rowNumber: 1, row: ['Tatooine'] });
  expect(describeVerdict(result)).toContain('è la numero 1: (Tatooine).');
});

test('l’ordine conta solo se la query attesa ha un ORDER BY esterno', async () => {
  const reversed = 'SELECT nome FROM pianeti ORDER BY nome DESC';
  expect(await verdict('SELECT nome FROM pianeti', reversed)).toEqual({ kind: 'correct' });

  const result = await verdict('SELECT nome FROM pianeti ORDER BY nome', reversed);
  expect(result).toMatchObject({ kind: 'order', rowNumber: 1 });
  expect(describeVerdict(result)).toContain('Controlla ORDER BY');
});

test('NULL e medie calcolate in altro modo', async () => {
  expect(
    await verdict('SELECT nome, diametro FROM pianeti', 'SELECT nome, COALESCE(diametro, 0) FROM pianeti'),
  ).toMatchObject({ kind: 'values', rowNumber: 4, row: ['Dagobah', 0] });
  expect(
    await verdict('SELECT AVG(diametro) FROM pianeti', 'SELECT SUM(diametro) * 1.0 / COUNT(diametro) FROM pianeti'),
  ).toEqual({ kind: 'correct' });
});

test('una query dello studente con errore riporta il messaggio di SQLite', async () => {
  const result = await verifyAnswer(engine, source, 'SELECT nome FROM pianeti', 'SELECT nome FORM pianeti');
  expect(result.student).toBeNull();
  expect(result.verdict.kind).toBe('error');
  expect(describeVerdict(result.verdict)).toMatch(/^SQLite ha segnalato un errore: .*syntax error/);
});

test('una query dello studente che non termina è interrotta', async () => {
  const endless = 'WITH RECURSIVE r(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM r) SELECT count(*) FROM r';
  const result = await verdict('SELECT nome FROM pianeti', endless);
  expect(result).toEqual({ kind: 'timeout', timeoutMs: 1_500 });
  expect(describeVerdict(result)).toBe('La query è stata interrotta dopo 1.5 s perché non terminava.');
});

test('una risposta che modifica i dati non altera il confronto né le verifiche successive', async () => {
  const expectedQuery = 'SELECT nome FROM pianeti';

  // Senza SELECT non c’è un risultato da confrontare.
  expect(await verdict(expectedQuery, 'DELETE FROM pianeti')).toEqual({ kind: 'no-result' });
  // La query attesa gira sul database iniziale: la cancellazione si vede solo nel risultato dello studente.
  expect(await verdict(expectedQuery, 'DELETE FROM pianeti WHERE id > 1; SELECT nome FROM pianeti')).toEqual({
    kind: 'rows',
    actual: 1,
    expected: 4,
  });
  expect(await verdict(expectedQuery, 'DROP TABLE pianeti')).toEqual({ kind: 'no-result' });
  // Dopo le modifiche, una risposta giusta resta giusta.
  expect(await verdict(expectedQuery, 'SELECT nome FROM pianeti')).toEqual({ kind: 'correct' });
});

test('un esercizio sbagliato è un errore dell’autore, non un esito', async () => {
  await expect(verifyAnswer(engine, source, 'SELECT nome FROM lune', 'SELECT 1')).rejects.toThrow(ExerciseError);
  await expect(verifyAnswer(engine, source, 'DELETE FROM pianeti', 'SELECT 1')).rejects.toThrow(
    /non restituisce un risultato/,
  );
});

const exercise = {
  id: 'pianeti-temperati',
  chapter: 'una-tabella',
  difficulty: 'facile',
  keywords: ['WHERE'],
  title: 'Pianeti temperati',
  prompt: 'Elenca i pianeti temperati.',
  expectedQuery: "SELECT nome FROM pianeti WHERE clima = 'temperato'",
  hints: [],
  tables: ['pianeti'],
} as const;

const check = (...exercises: object[]) =>
  checkTheme(engine, { id: 'prova', script: source.script, exercises: exercises as never });

test('il controllo dei temi accetta un esercizio valido', async () => {
  expect(await check(exercise)).toEqual([]);
});

test('il controllo dei temi nomina l’esercizio e il problema', async () => {
  const problems = await check(
    exercise,
    { ...exercise },
    { ...exercise, id: 'errore', expectedQuery: 'SELECT nome FORM pianeti' },
    { ...exercise, id: 'vuoto', expectedQuery: "SELECT nome FROM pianeti WHERE clima = 'lavico'" },
    { ...exercise, id: 'tabella', tables: ['pianeti', 'lune'] },
    { ...exercise, id: 'modifica', expectedQuery: 'DELETE FROM pianeti; SELECT nome FROM pianeti' },
    { ...exercise, id: 'forma', chapter: 'viste', difficulty: 'media', title: '' },
    { ...exercise, id: 'Non Valido' },
    // Dopo «modifica» il database è stato ripristinato: questo esercizio è a posto.
    { ...exercise, id: 'ultimo', expectedQuery: 'SELECT COUNT(*) FROM pianeti' },
  );

  expect(problems).toEqual([
    'prova/pianeti-temperati: id usato da più di un esercizio',
    expect.stringMatching(/^prova\/errore: la query attesa dà errore: .*syntax error/),
    'prova/vuoto: la query attesa restituisce zero righe',
    'prova/tabella: la tabella «lune» non esiste nel tema',
    'prova/modifica: la query attesa modifica i dati',
    expect.stringMatching(/^prova\/forma: capitolo «viste» non previsto/),
    expect.stringMatching(/^prova\/forma: difficoltà «media» non prevista/),
    'prova/forma: manca il titolo',
    'prova: l’esercizio in posizione 8 ha un id non valido (minuscole, cifre, trattini)',
  ]);
});

test('gli esercizi del tema Star Wars si caricano dal registro e superano il controllo', async () => {
  const theme = findTheme('star-wars')!;
  const exercises = await theme.loadExercises();
  expect(exercises.length).toBeGreaterThan(0);
  expect(await checkTheme(engine, { id: 'star-wars', script: await theme.loadDatabaseScript(), exercises })).toEqual([]);

  // La query attesa di ogni esercizio è una risposta corretta al proprio esercizio.
  const source = { key: 'star-wars', script: await theme.loadDatabaseScript() };
  for (const { expectedQuery } of exercises) {
    expect((await verifyAnswer(engine, source, expectedQuery, expectedQuery)).verdict).toEqual({ kind: 'correct' });
  }
});
