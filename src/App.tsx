/**
 * Pagina minima della fase F01: elenca i temi scoperti ed esegue una query sul
 * tema scelto. La fase F03 la sostituisce con la navigazione e la sandbox.
 */

import { useEffect, useState } from 'react';
import { engine } from './sql/browser.ts';
import type { ResultSet } from './sql/engine.ts';
import type { Theme } from './themes/contract.ts';
import { themes } from './themes/registry.ts';

const DEMO_QUERY = 'SELECT * FROM pianeti';

type DemoState =
  | { status: 'loading' }
  | { status: 'done'; resultSet: ResultSet | undefined }
  | { status: 'error'; message: string };

function QueryDemo({ theme }: { theme: Theme }) {
  const [state, setState] = useState<DemoState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const script = await theme.loadDatabaseScript();
      const database = await engine.open({ key: theme.manifest.id, script });
      try {
        return (await database.run(DEMO_QUERY)).resultSets[0];
      } finally {
        await database.close();
      }
    })().then(
      (resultSet) => {
        if (!cancelled) setState({ status: 'done', resultSet });
      },
      (error: unknown) => {
        if (!cancelled) setState({ status: 'error', message: String(error) });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [theme]);

  if (state.status === 'loading') return <p>Esecuzione in corso…</p>;
  if (state.status === 'error') return <p role="alert">{state.message}</p>;
  if (!state.resultSet) return <p>La query non ha restituito righe.</p>;

  const { columns, rows } = state.resultSet;
  return (
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            {row.map((value, cell) => (
              <td key={cell}>{value === null ? 'NULL' : String(value)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function App() {
  const [selected, setSelected] = useState<Theme | undefined>(themes[0]);

  return (
    <main>
      <h1>SQL Academy</h1>
      <h2>Temi</h2>
      <ul>
        {themes.map((theme) => (
          <li key={theme.manifest.id}>
            <button type="button" onClick={() => setSelected(theme)}>
              {theme.manifest.title}
            </button>{' '}
            {theme.manifest.description}
          </li>
        ))}
      </ul>
      {selected && (
        <section>
          <h2>
            {selected.manifest.title}: <code>{DEMO_QUERY}</code>
          </h2>
          <QueryDemo key={selected.manifest.id} theme={selected} />
        </section>
      )}
    </main>
  );
}
