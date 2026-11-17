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
}

export interface TableInfo {
  name: string;
  columns: ColumnInfo[];
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
  SELECT m.name, p.name, p.type, p.pk
  FROM sqlite_schema AS m JOIN pragma_table_info(m.name) AS p
  WHERE m.type = 'table' AND m.name NOT LIKE 'sqlite_%'
  ORDER BY m.name, p.cid`;

export async function readTables(database: SqlDatabase): Promise<TableInfo[]> {
  const [resultSet] = (await database.run(SCHEMA_QUERY, { maxRows: 10_000 })).resultSets;
  const tables: TableInfo[] = [];
  for (const [table, column, type, pk] of resultSet?.rows ?? []) {
    let current = tables.at(-1);
    if (current?.name !== table) {
      current = { name: String(table), columns: [] };
      tables.push(current);
    }
    current.columns.push({ name: String(column), type: String(type ?? ''), primaryKey: Number(pk) > 0 });
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
