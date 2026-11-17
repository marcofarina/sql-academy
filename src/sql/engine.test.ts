import { afterAll, expect, test } from 'vitest';
import { findTheme } from '../themes/registry.ts';
import { EngineError, SqlError, SqlTimeoutError, type DatabaseSource } from './engine.ts';
import { createNodeEngine } from './testing/nodeEngine.ts';

const engine = createNodeEngine({ timeoutMs: 1_500 });
afterAll(() => engine.dispose());

const source: DatabaseSource = {
  key: 'prova',
  script: `
    CREATE TABLE casate (id INTEGER PRIMARY KEY, nome TEXT NOT NULL);
    CREATE TABLE maghi (
      id INTEGER PRIMARY KEY,
      nome TEXT NOT NULL,
      casata_id INTEGER REFERENCES casate (id)
    );
    INSERT INTO casate VALUES (1, 'Grifondoro'), (2, 'Serpeverde');
    INSERT INTO maghi VALUES (1, 'Harry', 1), (2, 'Draco', 2), (3, 'Dobby', NULL);
  `,
};

/** Non termina mai: conta le righe di una ricorsione senza fine. */
const ENDLESS_QUERY =
  'WITH RECURSIVE r(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM r) SELECT count(*) FROM r';

test('esegue una query valida', async () => {
  const db = await engine.open(source);
  const result = await db.run('SELECT id, nome FROM casate ORDER BY id');

  expect(result.resultSets).toEqual([
    {
      columns: ['id', 'nome'],
      rows: [
        [1, 'Grifondoro'],
        [2, 'Serpeverde'],
      ],
      totalRows: 2,
      truncated: false,
    },
  ]);
  expect(result.rowsModified).toBe(0);
  await db.close();
});

test('esegue la query della pagina sul tema Star Wars', async () => {
  const script = await findTheme('star-wars')!.loadDatabaseScript();
  const db = await engine.open({ key: 'star-wars', script });
  const [pianeti] = (await db.run('SELECT * FROM pianeti')).resultSets;

  expect(pianeti.columns).toEqual(['id', 'nome', 'clima', 'terreno', 'popolazione', 'settore_galattico']);
  expect(pianeti.totalRows).toBe(15);
  await db.close();
});

test('uno script dà un insieme di risultati per ogni SELECT e conta le righe modificate', async () => {
  const db = await engine.open(source);
  const result = await db.run(`
    SELECT count(*) AS n FROM maghi;
    DELETE FROM maghi WHERE casata_id IS NULL;
    SELECT nome FROM maghi WHERE casata_id IS NULL;
    SELECT count(*) AS n FROM maghi;
  `);

  expect(result.resultSets.map((set) => set.rows)).toEqual([[[3]], [], [[2]]]);
  expect(result.rowsModified).toBe(1);
  await db.close();
});

test('restituisce NULL come null', async () => {
  const db = await engine.open(source);
  const [set] = (await db.run("SELECT casata_id FROM maghi WHERE nome = 'Dobby'")).resultSets;
  expect(set.rows).toEqual([[null]]);
  await db.close();
});

test('restituisce l’errore di sintassi di SQLite come messaggio', async () => {
  const db = await engine.open(source);
  const error = await db.run('SELEC * FROM casate').catch((e: unknown) => e);

  expect(error).toBeInstanceOf(SqlError);
  expect((error as SqlError).message).toBe('near "SELEC": syntax error');
  // Dopo un errore il database resta utilizzabile.
  expect((await db.run('SELECT count(*) FROM casate')).resultSets[0].rows).toEqual([[2]]);
  await db.close();
});

test('fa rispettare le chiavi esterne', async () => {
  const db = await engine.open(source);
  await expect(db.run("INSERT INTO maghi VALUES (9, 'Nessuno', 99)")).rejects.toThrow(
    'FOREIGN KEY constraint failed',
  );
  await db.close();
});

test('limita le righe restituite e dichiara il troncamento', async () => {
  const db = await engine.open(source);
  const [set] = (await db.run('SELECT nome FROM maghi ORDER BY id', { maxRows: 2 })).resultSets;

  expect(set.rows).toEqual([['Harry'], ['Draco']]);
  expect(set.totalRows).toBe(3);
  expect(set.truncated).toBe(true);
  await db.close();
});

test('ripristina il database dopo un DROP TABLE', async () => {
  const db = await engine.open(source);
  await db.run('DROP TABLE maghi');
  await expect(db.run('SELECT * FROM maghi')).rejects.toThrow('no such table: maghi');

  await db.reset();
  expect((await db.run('SELECT count(*) FROM maghi')).resultSets[0].rows).toEqual([[3]]);
  await db.close();
});

test('due database della stessa sorgente sono indipendenti', async () => {
  const first = await engine.open(source);
  const second = await engine.open(source);
  await first.run('DELETE FROM maghi');

  expect((await first.run('SELECT count(*) FROM maghi')).resultSets[0].rows).toEqual([[0]]);
  expect((await second.run('SELECT count(*) FROM maghi')).resultSets[0].rows).toEqual([[3]]);
  await first.close();
  await second.close();
});

test('il watchdog interrompe una query che non termina e il database riparte dallo stato iniziale', async () => {
  const db = await engine.open(source);
  await db.run('DELETE FROM maghi');

  const started = Date.now();
  const error = await db.run(ENDLESS_QUERY, { timeoutMs: 300 }).catch((e: unknown) => e);

  expect(error).toBeInstanceOf(SqlTimeoutError);
  expect(Date.now() - started).toBeLessThan(1_500);
  // Il worker è rinato: il database c’è ancora ed è tornato allo stato iniziale.
  expect((await db.run('SELECT count(*) FROM maghi')).resultSets[0].rows).toEqual([[3]]);
  await db.close();
});

test('uno script di sorgente sbagliato è un errore del motore, con il nome della sorgente', async () => {
  const error = await engine.open({ key: 'rotto', script: 'CREATE TABLE (' }).catch((e: unknown) => e);

  expect(error).toBeInstanceOf(EngineError);
  expect((error as EngineError).message).toMatch(/^Errore nel database «rotto»: /);
});

test('un database chiuso rifiuta le richieste', async () => {
  const db = await engine.open(source);
  await db.close();
  await expect(db.run('SELECT 1')).rejects.toBeInstanceOf(EngineError);
});
