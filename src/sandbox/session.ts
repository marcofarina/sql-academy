/**
 * La sandbox: un database privato dello studente, costruito dallo script del
 * tema, su cui gira qualunque istruzione. Indipendente da React per poterla provare in Node.
 */

import {
  SqlError,
  SqlTimeoutError,
  type DatabaseSource,
  type RunResult,
  type SqlDatabase,
  type SqlEngine,
} from '../sql/engine.ts';

export interface ColumnInfo {
  name: string;
  /** Tipo dichiarato nello schema; stringa vuota se manca. */
  type: string;
  primaryKey: boolean;
  /** La colonna e la tabella a cui rimanda, se è (parte di) una chiave esterna. */
  foreignKey?: { table: string; column: string };
}

export interface TableInfo {
  name: string;
  columns: ColumnInfo[];
  /** L’istruzione `CREATE TABLE` così come è stata scritta in `schema.sql`. */
  sql: string;
}

/** Esito di un’azione nella sandbox, da mostrare allo studente. */
export type SandboxOutcome =
  | { kind: 'result'; result: RunResult }
  | { kind: 'sql-error'; message: string }
  | { kind: 'timeout'; message: string }
  | { kind: 'reset' };

export interface Sandbox {
  /** Tabelle e colonne del database iniziale del tema, lette dal database stesso. */
  tables: TableInfo[];
  run(sql: string): Promise<SandboxOutcome>;
  reset(): Promise<SandboxOutcome>;
  close(): Promise<void>;
}

const SCHEMA_QUERY = `
  SELECT m.name, m.sql, p.name, p.type, p.pk
  FROM sqlite_schema AS m JOIN pragma_table_info(m.name) AS p
  WHERE m.type = 'table' AND m.name NOT LIKE 'sqlite_%'
  ORDER BY m.name, p.cid`;

const FOREIGN_KEY_QUERY = `
  SELECT m.name, f."from", f."table", f."to"
  FROM sqlite_schema AS m JOIN pragma_foreign_key_list(m.name) AS f
  WHERE m.type = 'table' AND m.name NOT LIKE 'sqlite_%'`;

/** Tabelle, colonne, chiavi primarie ed esterne del database, in ordine alfabetico di tabella. */
export async function readTables(database: SqlDatabase): Promise<TableInfo[]> {
  const [schema] = (await database.run(SCHEMA_QUERY, { maxRows: 10_000 })).resultSets;
  const tables: TableInfo[] = [];
  for (const [table, sql, column, type, pk] of schema?.rows ?? []) {
    let current = tables.at(-1);
    if (current?.name !== table) {
      current = { name: String(table), columns: [], sql: String(sql) };
      tables.push(current);
    }
    current.columns.push({ name: String(column), type: String(type ?? ''), primaryKey: Number(pk) > 0 });
  }

  const [foreignKeys] = (await database.run(FOREIGN_KEY_QUERY, { maxRows: 10_000 })).resultSets;
  for (const [table, from, target, to] of foreignKeys?.rows ?? []) {
    const column = tables.find((t) => t.name === table)?.columns.find((c) => c.name === from);
    if (!column) continue;
    // Senza colonna di arrivo la chiave esterna rimanda alla chiave primaria della tabella.
    const targetColumn =
      to === null ? tables.find((t) => t.name === target)?.columns.find((c) => c.primaryKey)?.name : String(to);
    column.foreignKey = { table: String(target), column: targetColumn ?? '' };
  }
  return tables;
}

export async function openSandbox(engine: SqlEngine, source: DatabaseSource): Promise<Sandbox> {
  const database = await engine.open(source);
  const tables = await readTables(database);

  return {
    tables,
    async run(sql) {
      try {
        return { kind: 'result', result: await database.run(sql) };
      } catch (error) {
        if (error instanceof SqlError) return { kind: 'sql-error', message: error.message };
        if (error instanceof SqlTimeoutError) return { kind: 'timeout', message: error.message };
        throw error;
      }
    },
    async reset() {
      await database.reset();
      return { kind: 'reset' };
    },
    close: () => database.close(),
  };
}
