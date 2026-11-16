/**
 * Worker di Node (`worker_threads`) con lo stesso nucleo del browser.
 * Node lo carica direttamente, senza Vite: vedi la nota in `core.ts`.
 */

import { parentPort } from 'node:worker_threads';
import initSqlJs from 'sql.js';
import { createCore } from '../core.ts';
import type { Request, Response } from '../protocol.ts';

const port = parentPort!;
const post = (response: Response) => port.postMessage(response);

initSqlJs().then(
  (SQL) => {
    const core = createCore(SQL);
    port.on('message', (request: Request) => post(core.handle(request)));
    post({ type: 'ready' });
  },
  (error: unknown) => post({ type: 'boot-error', message: String(error) }),
);
