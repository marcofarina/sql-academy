import { useEffect, useState } from 'react';
import { openSandbox, type Sandbox } from '../sandbox/session.ts';
import { engine } from '../sql/browser.ts';
import type { DatabaseSource } from '../sql/engine.ts';
import type { Exercise, Theme } from '../themes/contract.ts';

export type TrainingState =
  | { status: 'loading' }
  | { status: 'failed'; message: string }
  | {
      status: 'ready';
      exercises: Exercise[];
      /** Sorgente del database del tema, per la verifica delle risposte. */
      source: DatabaseSource;
      /** Database dell’addestramento, separato da quello della sandbox: «Esegui» lo ripristina prima di ogni query. */
      db: Sandbox;
    };

/** Esercizi e database dell’addestramento del tema, caricati all’apertura del tema. */
export function useTraining(theme: Theme): TrainingState {
  const [state, setState] = useState<TrainingState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    let opened: Sandbox | undefined;
    (async () => {
      const [script, exercises] = await Promise.all([theme.loadDatabaseScript(), theme.loadExercises()]);
      const source = { key: theme.manifest.id, script };
      opened = await openSandbox(engine, source);
      if (cancelled) await opened.close();
      else setState({ status: 'ready', exercises, source, db: opened });
    })().catch((error: unknown) => {
      if (!cancelled) setState({ status: 'failed', message: String(error) });
    });
    return () => {
      cancelled = true;
      void opened?.close().catch(() => {});
    };
  }, [theme]);

  return state;
}
