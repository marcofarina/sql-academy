import { afterAll, expect, test } from 'vitest';
import { openSandbox } from '../sandbox/session.ts';
import { createNodeEngine } from '../sql/testing/nodeEngine.ts';
import { findTheme } from '../themes/registry.ts';
import { describeTables } from './describe.ts';
import { checkLayoutCoherence, defaultLayout, drawingProblems, layoutDiagram, relationsOf, type Drawing } from './layout.ts';

const engine = createNodeEngine({ timeoutMs: 1_500 });
afterAll(() => engine.dispose());

const script = `
  CREATE TABLE maghi (id INTEGER PRIMARY KEY, nome TEXT, casata_id INTEGER REFERENCES casate (id));
  CREATE TABLE casate (id INTEGER PRIMARY KEY, nome TEXT);
  CREATE TABLE corsi (codice TEXT PRIMARY KEY);
  CREATE TABLE iscrizioni (
    mago_id INTEGER REFERENCES maghi (id),
    corso TEXT REFERENCES corsi,
    voto INTEGER,
    PRIMARY KEY (mago_id, corso)
  );
`;

async function tablesOf(source: string) {
  const sandbox = await openSandbox(engine, { key: `logico-${source.length}`, script: source });
  const { tables } = sandbox;
  await sandbox.close();
  return tables;
}

test('estrae dal database una relazione per ogni chiave esterna, anche dentro una chiave primaria composta', async () => {
  const tables = await tablesOf(script);
  expect(relationsOf(tables)).toEqual([
    { from: { table: 'iscrizioni', column: 'mago_id' }, to: { table: 'maghi', column: 'id' } },
    { from: { table: 'iscrizioni', column: 'corso' }, to: { table: 'corsi', column: 'codice' } },
    { from: { table: 'maghi', column: 'casata_id' }, to: { table: 'casate', column: 'id' } },
  ]);
  const iscrizioni = tables.find((t) => t.name === 'iscrizioni')!;
  expect(iscrizioni.columns.filter((c) => c.primaryKey && c.foreignKey).map((c) => c.name)).toEqual(['mago_id', 'corso']);
});

test('ogni linea parte dalla riga della chiave esterna e arriva alla riga della chiave primaria', async () => {
  const tables = await tablesOf(script);
  const layout = { tabelle: { casate: { col: 0, riga: 0 }, maghi: { col: 1, riga: 0 }, iscrizioni: { col: 2, riga: 0 }, corsi: { col: 0, riga: 1 } } };
  const drawing = layoutDiagram(tables, layout);
  expect(drawing.lines).toHaveLength(3);
  for (const line of drawing.lines) {
    const from = drawing.boxes.find((b) => b.table === line.relation.from.table)!;
    const to = drawing.boxes.find((b) => b.table === line.relation.to.table)!;
    const [xa, ya] = line.points[0];
    const [xb, yb] = line.points.at(-1)!;
    expect(ya).toBe(from.rows.find((r) => r.column.name === line.relation.from.column)!.y);
    expect(yb).toBe(to.rows.find((r) => r.column.name === line.relation.to.column)!.y);
    expect([from.x, from.x + from.w]).toContain(xa);
    expect([to.x, to.x + to.w]).toContain(xb);
    // Solo tratti orizzontali e verticali.
    line.points.slice(1).forEach((p, i) => {
      const q = line.points[i];
      expect(p[0] === q[0] || p[1] === q[1]).toBe(true);
    });
  }
  // iscrizioni → corsi salta due colonne: passa per una corsia orizzontale.
  expect(drawingProblems(drawing)).toEqual([]);
  expect(drawing.labels.filter((l) => l.text === 'N')).toHaveLength(3);
});

test('la disposizione predefinita mette le tabelle tre per riga, senza problemi', async () => {
  const tables = await tablesOf(script);
  const layout = defaultLayout(tables);
  expect(Object.values(layout.tabelle).map((p) => [p.col, p.riga])).toEqual([[0, 0], [1, 0], [2, 0], [0, 1]]);
  expect(drawingProblems(layoutDiagram(tables, layout))).toEqual([]);
});

test('logico.ts incoerente con le tabelle: problemi segnalati per nome', () => {
  const layout = { tabelle: { maghi: { col: 0, riga: 0 }, casate: { col: 0, riga: 0 }, draghi: { col: 1, riga: 0 }, corsi: { col: -1, riga: 0 } } };
  expect(checkLayoutCoherence(layout, ['maghi', 'casate', 'corsi', 'iscrizioni'])).toEqual([
    'le tabelle «maghi» e «casate» stanno nella stessa cella (col 0, riga 0)',
    'la tabella «draghi» non esiste nel database',
    'la tabella «corsi» ha una posizione non valida: col e riga sono interi da 0',
    'la tabella «iscrizioni» non ha una posizione',
  ]);
});

test('il controllo del disegno trova attraversamenti e sovrapposizioni', () => {
  const relation = (from: string, to: string) => ({ from: { table: from, column: 'x' }, to: { table: to, column: 'id' } });
  const drawing: Drawing = {
    width: 300,
    height: 100,
    iconSlot: 16,
    boxes: [{ table: 'muro', x: 100, y: 0, w: 50, h: 50, rows: [] }],
    labels: [],
    lines: [
      { relation: relation('a', 'b'), points: [[0, 20], [200, 20]] },
      { relation: relation('c', 'd'), points: [[0, 80], [60, 80]] },
      { relation: relation('e', 'f'), points: [[40, 80], [90, 80]] },
    ],
  };
  expect(drawingProblems(drawing)).toEqual([
    'la linea di a.x attraversa la tabella «muro»',
    'le linee di c.x e e.x si sovrappongono',
  ]);
});

test.each(['star-wars', 'lotr'])('il diagramma del tema %s ha una linea per chiave esterna e nessun problema', async (id) => {
  const theme = findTheme(id)!;
  const tables = await tablesOf(await theme.loadDatabaseScript());
  const layout = (await theme.loadLogical())!;
  expect(checkLayoutCoherence(layout, tables.map((t) => t.name))).toEqual([]);
  const drawing = layoutDiagram(tables, layout);
  expect(drawing.boxes).toHaveLength(tables.length);
  expect(drawing.lines).toHaveLength(relationsOf(tables).length);
  expect(drawingProblems(drawing)).toEqual([]);
});

test('la descrizione a parole nomina chiavi primarie ed esterne', async () => {
  const tables = await tablesOf(script);
  expect(describeTables(tables)).toContain(
    'Tabella iscrizioni: mago_id (chiave primaria, chiave esterna verso maghi.id), corso (chiave primaria, chiave esterna verso corsi.codice), voto.',
  );
});
