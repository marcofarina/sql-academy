import { Icon } from '../icons/Icon.tsx';
import { ResultsView } from './ResultsView.tsx';
import { SchemaPanel } from './SchemaPanel.tsx';
import { SqlEditor } from './SqlEditor.tsx';
import type { SandboxController } from './useSandbox.ts';

interface SandboxSectionProps {
  controller: SandboxController;
  query: string;
  onQueryChange(query: string): void;
}

/** La sandbox: editor, comandi, risultati e tabelle del tema. */
export function SandboxSection({ controller, query, onQueryChange }: SandboxSectionProps) {
  const { state, outcome, busy, run, reset } = controller;

  if (state.status === 'loading') return <p role="status">Preparazione del database…</p>;
  if (state.status === 'failed') {
    return (
      <div className="notice notice-error" role="alert">
        <Icon name="circle-xmark" />
        <div>
          <p className="notice-title">Il database non si è aperto</p>
          <pre>{state.message}</pre>
        </div>
      </div>
    );
  }

  const canRun = !busy && query.trim() !== '';
  const runQuery = () => {
    if (canRun) run(query);
  };

  return (
    <div className="sandbox">
      <div className="sandbox-main">
        <p className="lead">
          Il database è tuo: esegui qualunque istruzione, anche quelle che modificano i dati. «Ripristina database» lo
          riporta allo stato iniziale.
        </p>
        <SqlEditor
          initialValue={query}
          tables={state.sandbox.tables}
          onChange={onQueryChange}
          onRun={runQuery}
          label="Query SQL"
        />
        <div className="toolbar">
          <button type="button" className="primary" onClick={runQuery} disabled={!canRun}>
            <Icon name="circle-play" />
            Esegui
          </button>
          <button type="button" onClick={reset} disabled={busy}>
            <Icon name="circle-arrow-rotate-left" />
            Ripristina database
          </button>
          <span className="shortcut">
            oppure <kbd>Ctrl</kbd>+<kbd>Invio</kbd> (<kbd>Cmd</kbd>+<kbd>Invio</kbd> su Mac)
          </span>
        </div>
        <div aria-live="polite">{busy ? <p role="status">Esecuzione…</p> : <ResultsView outcome={outcome} />}</div>
      </div>
      <SchemaPanel tables={state.sandbox.tables} />
    </div>
  );
}
