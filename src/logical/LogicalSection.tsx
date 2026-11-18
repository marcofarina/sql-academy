import { useState } from 'react';
import { Icon } from '../icons/Icon.tsx';
import type { ColumnInfo, TableInfo } from '../sandbox/session.ts';
import type { SandboxController } from '../sandbox/useSandbox.ts';

type View = 'schema' | 'sql';

/**
 * Il modello logico del tema, letto dal database: nessun file scritto a mano.
 * Usa le tabelle che la sandbox legge all’apertura, cioè quelle del database
 * iniziale, anche se lo studente ne ha modificato la copia.
 */
export function LogicalSection({ controller }: { controller: SandboxController }) {
  const [view, setView] = useState<View>('schema');
  const { state } = controller;

  if (state.status === 'loading') return <p className="placeholder">Caricamento del database…</p>;
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
      {view === 'schema' ? <SchemaView tables={tables} /> : <SqlView tables={tables} />}
    </div>
  );
}

function SchemaView({ tables }: { tables: TableInfo[] }) {
  return (
    <>
      <p className="logical-legend">
        <span>
          <Icon name="key" /> <span className="pk">sottolineata</span>: chiave primaria
        </span>
        <span>
          <Icon name="link" /> <span className="fk">in corsivo</span>: chiave esterna
        </span>
      </p>
      <ul className="relations">
        {tables.map((table) => {
          const foreignKeys = table.columns.filter((c) => c.foreignKey);
          return (
            <li key={table.name}>
              <p className="relation">
                <strong>{table.name}</strong>(
                {table.columns.map((column, i) => (
                  <span key={column.name}>
                    {i > 0 && ', '}
                    <Attribute column={column} />
                  </span>
                ))}
                )
              </p>
              {foreignKeys.length > 0 && (
                <ul className="foreign-keys">
                  {foreignKeys.map((column) => (
                    <li key={column.name}>
                      <Icon name="link" />
                      <code>
                        {table.name}.{column.name}
                      </code>{' '}
                      si riferisce a{' '}
                      <code>
                        {column.foreignKey!.table}.{column.foreignKey!.column}
                      </code>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}

/** Un attributo nella notazione del libro, con le icone accanto: le icone dicono a voce ciò che sottolineatura e corsivo dicono alla vista. */
function Attribute({ column }: { column: ColumnInfo }) {
  const classes = [column.primaryKey && 'pk', column.foreignKey && 'fk'].filter(Boolean).join(' ');
  return (
    <span className="attribute">
      {column.primaryKey && <Icon name="key" title="Chiave primaria" />}
      {column.foreignKey && <Icon name="link" title="Chiave esterna" />}
      <span className={classes || undefined}>{column.name}</span>
    </span>
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
