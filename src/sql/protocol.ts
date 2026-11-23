/** Messaggi fra il ponte (`bridge.ts`) e il worker (`core.ts`). */

import type { RunResult } from './engine.ts';

export type Request =
  | { type: 'open'; id: number; dbId: number; seedKey: string; script: string }
  | { type: 'run'; id: number; dbId: number; sql: string; maxRows: number }
  | { type: 'export'; id: number; dbId: number }
  | { type: 'reset'; id: number; dbId: number }
  | { type: 'close'; id: number; dbId: number };

export type Response =
  /** Il worker ha caricato SQLite e accetta richieste. */
  | { type: 'ready' }
  | { type: 'boot-error'; message: string }
  | { type: 'done'; id: number }
  | { type: 'exported'; id: number; bytes: Uint8Array }
  | { type: 'result'; id: number; result: RunResult }
  | { type: 'error'; id: number; message: string };
