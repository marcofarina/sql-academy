import { Icon } from '../icons/Icon.tsx';
import type { TableInfo } from './session.ts';

/** Le tabelle del tema con colonne e tipi, lette dal database. */
export function SchemaPanel({ tables }: { tables: TableInfo[] }) {
  return (
    <aside className="schema-panel" aria-labelledby="schema-panel-title">
      <h2 id="schema-panel-title">Tabelle</h2>
      {tables.map((table) => (
        <details key={table.name} open={tables.length <= 4}>
          <summary>
            <code>{table.name}</code>
          </summary>
          <ul>
            {table.columns.map((column) => (
              <li key={column.name}>
                <code>{column.name}</code> <span className="column-type">{column.type || 'senza tipo'}</span>
                {column.primaryKey && (
                  <span className="badge">
                    <Icon name="key" title="Chiave primaria" />
                  </span>
                )}
              </li>
            ))}
          </ul>
        </details>
      ))}
    </aside>
  );
}
