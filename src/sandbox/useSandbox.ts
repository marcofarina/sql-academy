import { useCallback, useEffect, useState } from 'react';
import { engine } from '../sql/browser.ts';
import type { Theme } from '../themes/contract.ts';
import { openSandbox, type Sandbox, type SandboxOutcome } from './session.ts';

export type SandboxState =
  | { status: 'loading' }
  | { status: 'failed'; message: string }
  | { status: 'ready'; sandbox: Sandbox };

export interface SandboxController {
  state: SandboxState;
  /** Esito dell’ultima azione; `undefined` prima della prima. */
  outcome: SandboxOutcome | undefined;
  busy: boolean;
  run(sql: string): void;
  reset(): void;
}

/**
 * La sandbox del tema: aperta quando il tema si apre, chiusa quando lo si lascia.
 * Chi la usa monta un componente nuovo per ogni tema (`key`), così lo stato non passa da un tema all’altro.
 */
export function useSandbox(theme: Theme): SandboxController {
  const [state, setState] = useState<SandboxState>({ status: 'loading' });
  const [outcome, setOutcome] = useState<SandboxOutcome>();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let opened: Sandbox | undefined;
    (async () => {
      const script = await theme.loadDatabaseScript();
      opened = await openSandbox(engine, { key: theme.manifest.id, script });
      if (cancelled) await opened.close();
      else setState({ status: 'ready', sandbox: opened });
    })().catch((error: unknown) => {
      if (!cancelled) setState({ status: 'failed', message: String(error) });
    });
    return () => {
      cancelled = true;
      void opened?.close().catch(() => {});
    };
  }, [theme]);

  const perform = useCallback(
    (action: (sandbox: Sandbox) => Promise<SandboxOutcome>) => {
      if (state.status !== 'ready' || busy) return;
      setBusy(true);
      action(state.sandbox)
        .then(setOutcome, (error: unknown) => setState({ status: 'failed', message: String(error) }))
        .finally(() => setBusy(false));
    },
    [state, busy],
  );

  return {
    state,
    outcome,
    busy,
    run: useCallback((sql: string) => perform((sandbox) => sandbox.run(sql)), [perform]),
    reset: useCallback(() => perform((sandbox) => sandbox.reset()), [perform]),
  };
}
