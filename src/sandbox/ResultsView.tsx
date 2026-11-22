/** Risultati delle query ed esiti delle azioni della sandbox. */

import { Icon } from '../icons/Icon.tsx';
import type { ResultSet, SqlValue } from '../sql/engine.ts';
import { SqlErrorNotice } from './SqlErrorNotice.tsx';
import type { SandboxOutcome, TableInfo } from './session.ts';

function Cell({ value }: { value: SqlValue }) {
  if (value === null) return <td><span className="null">NULL</span></td>;
  if (value instanceof Uint8Array) return <td><span className="blob">BLOB, {value.length} byte</span></td>;
  return <td className={typeof value === 'number' ? 'number' : undefined}>{String(value)}</td>;
}

function righe(n: number): string {
  return n === 1 ? '1 riga' : `${n} righe`;
}

/** Tabella di un risultato SQL, con il numero di righe nella didascalia. */
export function ResultTable({ resultSet, caption }: { resultSet: ResultSet; caption: string }) {
  const { columns, rows, totalRows, truncated } = resultSet;
  return (
    <figure className="result">
      <figcaption>
        {caption}: {righe(totalRows)}
        {truncated && (
          <span className="truncated">
            {' '}
            — mostrate le prime {rows.length}
          </span>
        )}
      </figcaption>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                {row.map((value, cell) => (
                  <Cell key={cell} value={value} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

/** Esito dell’ultima azione nella sandbox: risultati, errore di SQLite, interruzione o ripristino. */
export function ResultsView({ outcome, tables }: { outcome: SandboxOutcome | undefined; tables: readonly TableInfo[] }) {
  if (!outcome) return null;

  switch (outcome.kind) {
    case 'sql-error':
      return <SqlErrorNotice message={outcome.message} tables={tables} />;
    case 'timeout':
      return (
        <div className="notice notice-warning" role="alert">
          <Icon name="triangle-exclamation" />
          <div>
            <p className="notice-title">Query interrotta</p>
            <p>{outcome.message}</p>
          </div>
        </div>
      );
    case 'reset':
      return (
        <p className="notice" role="status">
          <Icon name="circle-arrow-rotate-left" />
          Database ripristinato allo stato iniziale.
        </p>
      );
    case 'result': {
      const { resultSets, rowsModified, durationMs } = outcome.result;
      const many = resultSets.length > 1;
      return (
        <div className="results" role="status">
          <p className="results-summary">
            {resultSets.length === 0 && 'Istruzioni eseguite, nessun risultato da mostrare. '}
            {rowsModified > 0 && `Righe inserite, modificate o cancellate: ${rowsModified}. `}
            Tempo: {Math.round(durationMs)} ms.
          </p>
          {resultSets.map((resultSet, index) => (
            <ResultTable
              key={index}
              resultSet={resultSet}
              caption={many ? `Risultato ${index + 1} di ${resultSets.length}` : 'Risultato'}
            />
          ))}
        </div>
      );
    }
  }
}
