import { useEffect, useMemo, useState } from 'react';
import { Icon } from '../icons/Icon.tsx';
import type { TableInfo } from '../sandbox/session.ts';
import type { SandboxController } from '../sandbox/useSandbox.ts';
import type { Theme } from '../themes/contract.ts';
import { describeTables } from './describe.ts';
import { defaultLayout } from './layout.ts';
import { LogicalDiagram } from './LogicalDiagram.tsx';
import type { LogicalLayout } from './types.ts';

type View = 'schema' | 'sql';

/**
 * Il modello logico del tema, letto dal database: tabelle, colonne e chiavi
 * non stanno in un file scritto a mano. `logico.ts` del tema dice solo dove
 * disegnare le tabelle. Usa le tabelle che la sandbox legge all’apertura,
 * cioè quelle del database iniziale, anche se lo studente ne ha modificato la copia.
 */
export function LogicalSection({ theme, controller }: { theme: Theme; controller: SandboxController }) {
  const [view, setView] = useState<View>('schema');
  // `null`: posizioni in caricamento; `undefined`: il tema non ha `logico.ts`.
  const [layout, setLayout] = useState<LogicalLayout | undefined | null>(null);
  const { state } = controller;

  useEffect(() => {
    let cancelled = false;
    theme.loadLogical().then(
      (loaded) => !cancelled && setLayout(loaded),
      () => !cancelled && setLayout(undefined),
    );
    return () => {
      cancelled = true;
    };
  }, [theme]);

  if (state.status === 'loading' || layout === null) return <p className="placeholder">Caricamento del database…</p>;
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
  const { tables } = state.sandbox;

  return (
    <div className="logical">
      <div className="view-switch" role="group" aria-label="Vista del modello logico">
        <button type="button" aria-pressed={view === 'schema'} onClick={() => setView('schema')}>
          <Icon name="table" />
          Schema
        </button>
        <button type="button" aria-pressed={view === 'sql'} onClick={() => setView('sql')}>
          <Icon name="code" />
          Codice SQL
        </button>
      </div>
      {view === 'schema' ? (
        <SchemaView tables={tables} layout={layout ?? defaultLayout(tables)} title={`Modello logico del database ${theme.manifest.title}`} />
      ) : (
        <SqlView tables={tables} />
      )}
    </div>
  );
}

function SchemaView({ tables, layout, title }: { tables: TableInfo[]; layout: LogicalLayout; title: string }) {
  const sentences = useMemo(() => describeTables(tables), [tables]);
  return (
    <>
      <ul className="logical-legend" aria-label="Legenda">
        <li>
          <span className="logical-legend-key">
            <Icon name="key" /> <span className="pk">id</span>
          </span>
          chiave primaria
        </li>
        <li>
          <span className="logical-legend-key">
            <Icon name="link" /> <span className="fk">id</span>
          </span>
          chiave esterna
        </li>
        <li>
          <svg className="logical-legend-line" viewBox="0 0 64 22" width="64" height="22" aria-hidden="true">
            <line x1="2" y1="16" x2="62" y2="16" />
            <text x="4" y="11">N</text>
            <text x="60" y="11" textAnchor="end">1</text>
          </svg>
          associazione uno a molti
        </li>
      </ul>
      <LogicalDiagram tables={tables} layout={layout} title={title} />
      <details className="er-description">
        <summary>Il diagramma descritto a parole</summary>
        <ul>
          {sentences.map((sentence) => (
            <li key={sentence}>{sentence}</li>
          ))}
        </ul>
      </details>
    </>
  );
}

type CopyState = 'idle' | 'copied' | 'failed';

function SqlView({ tables }: { tables: TableInfo[] }) {
  const [copy, setCopy] = useState<CopyState>('idle');
  const code = tables.map((table) => `${table.sql};`).join('\n\n');

  const onCopy = () => {
    navigator.clipboard.writeText(code).then(
      () => setCopy('copied'),
      () => setCopy('failed'),
    );
    window.setTimeout(() => setCopy('idle'), 2500);
  };

  return (
    <div className="sql-view">
      <div className="sql-view-actions">
        <button type="button" onClick={onCopy}>
          <Icon name="copy" />
          Copia il codice
        </button>
        <span role="status" className="copy-status">
          {copy === 'copied' ? 'Copiato negli appunti.' : copy === 'failed' ? 'Copia non riuscita: seleziona il testo a mano.' : ''}
        </span>
      </div>
      <pre className="sql-code">
        <code>{code}</code>
      </pre>
    </div>
  );
}
