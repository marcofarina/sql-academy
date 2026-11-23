/**
 * Nucleo del motore: SQLite (`sql.js`) dietro il protocollo di `protocol.ts`.
 *
 * Non sa di girare in un worker: riceve una richiesta e restituisce la
 * risposta. Lo usano il Web Worker del browser (`worker.ts`) e il worker di
 * Node dei test (`testing/nodeWorker.ts`).
 *
 * Ripristino: per ogni sorgente lo script si esegue una volta sola e se ne
 * conserva la copia serializzata (il «seed»). Aprire o ripristinare un
 * database significa ripartire da quella copia.
 *
 * Questo file è caricato anche da Node senza passare da Vite: gli import di
 * valori devono indicare l’estensione `.ts` e quelli di tipi usare `import type`.
 */

import type { Database, SqlJsStatic } from 'sql.js';
import type { ResultSet, RunResult } from './engine.ts';
import type { Request, Response } from './protocol.ts';

/** Massimo di insiemi di risultati restituiti per script. */
const MAX_RESULT_SETS = 20;
/** Limite di memoria di SQLite per connessione: 64 MiB. */
const HARD_HEAP_LIMIT = 64 * 1024 * 1024;

interface Seed {
  script: string;
  bytes: Uint8Array;
}

interface OpenDatabase {
  db: Database;
  seedKey: string;
}

/** I PRAGMA valgono per connessione: vanno riapplicati a ogni apertura. */
function applyPragmas(db: Database): void {
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec(`PRAGMA hard_heap_limit = ${HARD_HEAP_LIMIT};`);
}

function totalChanges(db: Database): number {
  return db.exec('SELECT total_changes()')[0].values[0][0] as number;
}

/**
 * Esegue lo script un’istruzione alla volta. Le righe oltre `maxRows` si
 * contano ma non si raccolgono: non attraversano mai il confine del worker.
 */
function runScript(db: Database, sql: string, maxRows: number): RunResult {
  const started = performance.now();
  const before = totalChanges(db);
  const resultSets: ResultSet[] = [];

  for (const statement of db.iterateStatements(sql)) {
    try {
      const columns = statement.getColumnNames();
      const rows: ResultSet['rows'] = [];
      let totalRows = 0;
      while (statement.step()) {
        totalRows++;
        if (rows.length < maxRows) rows.push(statement.get());
      }
      // Senza colonne è un’istruzione che non restituisce righe (CREATE, INSERT…).
      if (columns.length > 0 && resultSets.length < MAX_RESULT_SETS) {
        resultSets.push({ columns, rows, totalRows, truncated: totalRows > rows.length });
      }
    } finally {
      statement.free();
    }
  }

  return {
    resultSets,
    rowsModified: Math.max(0, totalChanges(db) - before),
    durationMs: performance.now() - started,
  };
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export interface Core {
  handle(request: Request): Response;
}

export function createCore(SQL: SqlJsStatic): Core {
  const seeds = new Map<string, Seed>();
  const databases = new Map<number, OpenDatabase>();

  function ensureSeed(seedKey: string, script: string): void {
    // Stessa chiave con uno script diverso: la sorgente è cambiata, il seed si rifà.
    if (seeds.get(seedKey)?.script === script) return;
    const db = new SQL.Database();
    try {
      applyPragmas(db);
      db.exec(script);
      seeds.set(seedKey, { script, bytes: db.export() });
    } catch (error) {
      throw new Error(`Errore nel database «${seedKey}»: ${messageOf(error)}`, { cause: error });
    } finally {
      db.close();
    }
  }

  function openFromSeed(seedKey: string): Database {
    const db = new SQL.Database(seeds.get(seedKey)!.bytes);
    applyPragmas(db);
    return db;
  }

  function opened(dbId: number): OpenDatabase {
    const entry = databases.get(dbId);
    if (!entry) throw new Error('Database non aperto');
    return entry;
  }

  function execute(request: Request): Response {
    const { id, dbId } = request;
    switch (request.type) {
      case 'open': {
        ensureSeed(request.seedKey, request.script);
        databases.get(dbId)?.db.close();
        databases.set(dbId, { db: openFromSeed(request.seedKey), seedKey: request.seedKey });
        return { type: 'done', id };
      }
      case 'run':
        return { type: 'result', id, result: runScript(opened(dbId).db, request.sql, request.maxRows) };
      case 'export':
        return { type: 'exported', id, bytes: opened(dbId).db.export() };
      case 'reset': {
        const entry = opened(dbId);
        entry.db.close();
        entry.db = openFromSeed(entry.seedKey);
        return { type: 'done', id };
      }
      case 'close': {
        databases.get(dbId)?.db.close();
        databases.delete(dbId);
        return { type: 'done', id };
      }
    }
  }

  return {
    handle(request) {
      try {
        return execute(request);
      } catch (error) {
        return { type: 'error', id: request.id, message: messageOf(error) };
      }
    },
  };
}
