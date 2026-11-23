/**
 * Ponte fra il portale e il worker SQL: implementa `SqlEngine`.
 *
 * - Ciclo di vita: il worker nasce alla prima richiesta e rinasce dopo essere
 *   stato terminato.
 * - Watchdog: SQLite gira in modo sincrono dentro il worker, quindi l’unico
 *   modo di fermare una query che non termina è terminare il worker. Tutte le
 *   richieste in corso sono rifiutate con `SqlTimeoutError`; alla richiesta
 *   successiva i database aperti si ricostruiscono dalla loro sorgente, cioè
 *   ripartono dallo stato iniziale.
 *
 * Il worker si riceve come funzione `spawn`, così lo stesso ponte funziona con
 * il Web Worker del browser e con il worker di Node dei test.
 */

import {
  EngineError,
  SqlError,
  SqlTimeoutError,
  type DatabaseSource,
  type RunResult,
  type SqlDatabase,
  type SqlEngine,
} from './engine.ts';
import type { Request, Response } from './protocol.ts';

export interface WorkerHandle {
  postMessage(request: Request): void;
  terminate(): void;
}

export interface WorkerEvents {
  onMessage(response: Response): void;
  /** Errore non recuperabile nel worker (per esempio memoria esaurita). */
  onError(message: string): void;
}

export type SpawnWorker = (events: WorkerEvents) => WorkerHandle;

export interface EngineOptions {
  /** Tempo massimo di una richiesta, se `run` non ne indica uno. Predefinito: 5 s. */
  timeoutMs?: number;
  /** Tempo massimo per il caricamento di SQLite. Predefinito: 30 s. */
  bootTimeoutMs?: number;
  /** Righe restituite per insieme di risultati, se `run` non ne indica. Predefinito: 1000. */
  maxRows?: number;
}

type Timer = ReturnType<typeof setTimeout>;

interface Pending {
  resolve(response: Response): void;
  reject(error: Error): void;
  timer: Timer;
}

/** Una richiesta senza `id`: lo assegna il ponte. */
type RequestBody = Request extends infer R ? (R extends Request ? Omit<R, 'id'> : never) : never;

export function createEngine(spawn: SpawnWorker, options: EngineOptions = {}): SqlEngine {
  const defaultTimeoutMs = options.timeoutMs ?? 5_000;
  const bootTimeoutMs = options.bootTimeoutMs ?? 30_000;
  const defaultMaxRows = options.maxRows ?? 1_000;

  let worker: WorkerHandle | null = null;
  let ready: Promise<WorkerHandle> | null = null;
  let nextRequestId = 1;
  let nextDbId = 1;
  const pending = new Map<number, Pending>();
  /** Database aperti dal portale: sopravvivono al worker. */
  const sources = new Map<number, DatabaseSource>();
  /** Database aperti nel worker attuale: si svuota quando il worker muore. */
  const openedInWorker = new Map<number, Promise<void>>();

  /** Termina il worker e rifiuta tutte le richieste in corso. */
  function kill(reason: Error): void {
    worker?.terminate();
    worker = null;
    ready = null;
    openedInWorker.clear();
    for (const entry of pending.values()) {
      clearTimeout(entry.timer);
      entry.reject(reason);
    }
    pending.clear();
  }

  function ensureWorker(): Promise<WorkerHandle> {
    if (ready) return ready;

    ready = new Promise<WorkerHandle>((resolve, reject) => {
      const fail = (error: Error) => {
        clearTimeout(bootTimer);
        // Un evento di un worker già sostituito non deve toccare quello nuovo.
        if (worker === spawned) kill(error);
        reject(error);
      };
      const bootTimer: Timer = setTimeout(
        () => fail(new EngineError('Tempo scaduto nel caricamento del motore SQL')),
        bootTimeoutMs,
      );
      const spawned = spawn({
        onMessage(response) {
          if (response.type === 'ready') {
            clearTimeout(bootTimer);
            resolve(spawned);
          } else if (response.type === 'boot-error') {
            fail(new EngineError(`Caricamento del motore SQL fallito: ${response.message}`));
          } else {
            const entry = pending.get(response.id);
            if (!entry) return;
            pending.delete(response.id);
            clearTimeout(entry.timer);
            entry.resolve(response);
          }
        },
        onError(message) {
          fail(new EngineError(`Errore nel worker SQL: ${message}`));
        },
      });
      worker = spawned;
    });
    // Chi aspetta `ready` riceve l’errore; qui si evita solo il rifiuto non gestito.
    ready.catch(() => {});
    return ready;
  }

  /** Invia una richiesta e fa partire il watchdog. Un errore di SQLite diventa `SqlError`. */
  async function request(body: RequestBody, timeoutMs: number): Promise<Response> {
    const target = await ensureWorker();
    const response = await new Promise<Response>((resolve, reject) => {
      const id = nextRequestId++;
      const timer = setTimeout(() => kill(new SqlTimeoutError(timeoutMs)), timeoutMs);
      pending.set(id, { resolve, reject, timer });
      target.postMessage({ ...body, id } as Request);
    });
    if (response.type === 'error') throw new SqlError(response.message);
    return response;
  }

  /** Apre il database nel worker attuale, se non lo è già. */
  function ensureOpen(dbId: number): Promise<void> {
    const source = sources.get(dbId);
    if (!source) return Promise.reject(new EngineError('Database chiuso'));

    const existing = openedInWorker.get(dbId);
    if (existing) return existing;

    const opening: Promise<void> = request(
        { type: 'open', dbId, seedKey: source.key, script: source.script },
        defaultTimeoutMs,
      ).then(
        () => undefined,
        (error: Error) => {
          // Solo se nel frattempo un worker nuovo non ha già riaperto il database.
          if (openedInWorker.get(dbId) === opening) openedInWorker.delete(dbId);
          // Uno script di sorgente sbagliato è un errore del tema, non dello studente.
          throw error instanceof SqlError ? new EngineError(error.message) : error;
        },
    );
    openedInWorker.set(dbId, opening);
    return opening;
  }

  return {
    async open(source) {
      const dbId = nextDbId++;
      sources.set(dbId, source);
      try {
        await ensureOpen(dbId);
      } catch (error) {
        sources.delete(dbId);
        throw error;
      }

      const database: SqlDatabase = {
        async run(sql, runOptions = {}) {
          await ensureOpen(dbId);
          const response = await request(
            { type: 'run', dbId, sql, maxRows: runOptions.maxRows ?? defaultMaxRows },
            runOptions.timeoutMs ?? defaultTimeoutMs,
          );
          return (response as Extract<Response, { type: 'result' }>).result satisfies RunResult;
        },
        async export() {
          await ensureOpen(dbId);
          const response = await request({ type: 'export', dbId }, defaultTimeoutMs);
          return (response as Extract<Response, { type: 'exported' }>).bytes;
        },
        async reset() {
          await ensureOpen(dbId);
          await request({ type: 'reset', dbId }, defaultTimeoutMs);
        },
        async close() {
          if (!sources.delete(dbId)) return;
          if (openedInWorker.delete(dbId)) {
            await request({ type: 'close', dbId }, defaultTimeoutMs);
          }
        },
      };
      return database;
    },

    dispose() {
      kill(new EngineError('Motore SQL chiuso'));
    },
  };
}
