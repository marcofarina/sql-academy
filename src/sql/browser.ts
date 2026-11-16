/** Il motore SQL del portale nel browser: un solo worker per pagina. */

import { createEngine } from './bridge.ts';
import type { SqlEngine } from './engine.ts';
import type { Response } from './protocol.ts';

export const engine: SqlEngine = createEngine((events) => {
  const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
  worker.onmessage = (event: MessageEvent<Response>) => events.onMessage(event.data);
  worker.onerror = (event) => events.onError(event.message);
  return worker;
});
