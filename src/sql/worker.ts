/** Web Worker del browser: carica SQLite e passa le richieste al nucleo. */

import initSqlJs from 'sql.js';
// Il file WASM è servito dal sito, non da una CDN.
import wasmUrl from 'sql.js/dist/sql-wasm-browser.wasm?url';
import { createCore } from './core.ts';
import type { Request, Response } from './protocol.ts';

const scope = self as unknown as {
  postMessage(response: Response): void;
  onmessage: ((event: MessageEvent<Request>) => void) | null;
};

initSqlJs({ locateFile: () => wasmUrl }).then(
  (SQL) => {
    const core = createCore(SQL);
    scope.onmessage = (event) => scope.postMessage(core.handle(event.data));
    scope.postMessage({ type: 'ready' });
  },
  (error: unknown) => scope.postMessage({ type: 'boot-error', message: String(error) }),
);
