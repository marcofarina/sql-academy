/**
 * Il motore SQL fuori dal browser: stesso ponte e stesso nucleo, con un worker
 * di Node al posto del Web Worker. Serve ai test e agli script di controllo.
 */

import { Worker } from 'node:worker_threads';
import { createEngine, type EngineOptions } from '../bridge.ts';
import type { SqlEngine } from '../engine.ts';
import type { Response } from '../protocol.ts';

export function createNodeEngine(options?: EngineOptions): SqlEngine {
  return createEngine((events) => {
    const worker = new Worker(new URL('./nodeWorker.ts', import.meta.url));
    worker.on('message', (response: Response) => events.onMessage(response));
    worker.on('error', (error) => events.onError(String(error)));
    return {
      postMessage: (request) => worker.postMessage(request),
      terminate: () => void worker.terminate(),
    };
  }, options);
}
