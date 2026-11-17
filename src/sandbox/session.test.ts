import { afterAll, expect, test } from 'vitest';
import { createNodeEngine } from '../sql/testing/nodeEngine.ts';
import { findTheme } from '../themes/registry.ts';
import { openSandbox, type SandboxOutcome } from './session.ts';

const engine = createNodeEngine({ timeoutMs: 1_500 });
afterAll(() => engine.dispose());

const source = {
  key: 'sandbox-prova',
  script: `
    CREATE TABLE casate (id INTEGER PRIMARY KEY, nome TEXT NOT NULL);
    CREATE TABLE maghi (id INTEGER PRIMARY KEY, nome TEXT, casata_id INTEGER REFERENCES casate (id));
    INSERT INTO casate VALUES (1, 'Grifondoro'), (2, 'Serpeverde');
    INSERT INTO maghi VALUES (1, 'Harry', 1), (2, '', 2), (3, NULL, NULL);
  `,
};

function rowsOf(outcome: SandboxOutcome) {
  if (outcome.kind !== 'result') throw new Error(`atteso un risultato, ottenuto ${outcome.kind}`);
  return outcome.result.resultSets.map((set) => set.rows);
}

test('legge tabelle, colonne, tipi e chiavi dal database', async () => {
  const sandbox = await openSandbox(engine, source);
  expect(sandbox.tables).toEqual([
    {
      name: 'casate',
      columns: [
        { name: 'id', type: 'INTEGER', primaryKey: true },
        { name: 'nome', type: 'TEXT', primaryKey: false },
      ],
      sql: 'CREATE TABLE casate (id INTEGER PRIMARY KEY, nome TEXT NOT NULL)',
    },
    {
      name: 'maghi',
      columns: [
        { name: 'id', type: 'INTEGER', primaryKey: true },
        { name: 'nome', type: 'TEXT', primaryKey: false },
        { name: 'casata_id', type: 'INTEGER', primaryKey: false, foreignKey: { table: 'casate', column: 'id' } },
      ],
      sql: 'CREATE TABLE maghi (id INTEGER PRIMARY KEY, nome TEXT, casata_id INTEGER REFERENCES casate (id))',
    },
  ]);
  await sandbox.close();
});

test('una chiave esterna senza colonna di arrivo rimanda alla chiave primaria', async () => {
  const sandbox = await openSandbox(engine, {
    key: 'sandbox-chiave-implicita',
    script: `
      CREATE TABLE casate (nome TEXT PRIMARY KEY);
      CREATE TABLE maghi (id INTEGER PRIMARY KEY, casata TEXT REFERENCES casate);
    `,
  });
  expect(sandbox.tables[1].columns[1].foreignKey).toEqual({ table: 'casate', column: 'nome' });
  await sandbox.close();
});

test('NULL e stringa vuota restano distinti', async () => {
  const sandbox = await openSandbox(engine, source);
  expect(rowsOf(await sandbox.run('SELECT nome FROM maghi ORDER BY id'))).toEqual([[['Harry'], [''], [null]]]);
  await sandbox.close();
});

test('uno script dà un insieme di risultati per istruzione', async () => {
  const sandbox = await openSandbox(engine, source);
  expect(rowsOf(await sandbox.run('SELECT 1; SELECT 2, 3;'))).toEqual([[[1]], [[2, 3]]]);
  await sandbox.close();
});

test('errore di SQLite riportato per intero', async () => {
  const sandbox = await openSandbox(engine, source);
  expect(await sandbox.run('SELEC * FROM casate')).toEqual({
    kind: 'sql-error',
    message: 'near "SELEC": syntax error',
  });
  await sandbox.close();
});

test('DROP TABLE e ripristino', async () => {
  const sandbox = await openSandbox(engine, source);
  expect(rowsOf(await sandbox.run('DROP TABLE maghi;'))).toEqual([]);
  expect(await sandbox.run('SELECT * FROM maghi')).toEqual({ kind: 'sql-error', message: 'no such table: maghi' });
  expect(await sandbox.reset()).toEqual({ kind: 'reset' });
  expect(rowsOf(await sandbox.run('SELECT count(*) FROM maghi'))).toEqual([[[3]]]);
  await sandbox.close();
});

test('query interrotta dal watchdog: avviso e database di nuovo iniziale', async () => {
  const sandbox = await openSandbox(engine, source);
  await sandbox.run("DELETE FROM maghi");
  const outcome = await sandbox.run(
    'WITH RECURSIVE r(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM r) SELECT count(*) FROM r',
  );
  expect(outcome.kind).toBe('timeout');
  expect(rowsOf(await sandbox.run('SELECT count(*) FROM maghi'))).toEqual([[[3]]]);
  await sandbox.close();
});

test('si apre sul tema Star Wars', async () => {
  const theme = findTheme('star-wars')!;
  const sandbox = await openSandbox(engine, { key: 'star-wars', script: await theme.loadDatabaseScript() });
  expect(sandbox.tables.map((table) => table.name)).toContain('pianeti');
  expect(rowsOf(await sandbox.run('SELECT count(*) > 0 FROM pianeti'))).toEqual([[[1]]]);
  await sandbox.close();
});
