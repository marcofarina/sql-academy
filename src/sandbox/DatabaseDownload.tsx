/** Download del database iniziale e degli script originali del tema. */

import { useState } from 'react';
import { engine } from '../sql/browser.ts';
import type { Theme } from '../themes/contract.ts';

function saveFile(name: string, content: BlobPart, type: string): void {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

/** Offre i file iniziali del tema, senza includere le modifiche della sandbox. */
export function DatabaseDownload({ theme }: { theme: Theme }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  async function download(kind: 'database' | 'schema' | 'data') {
    setBusy(true);
    setError(false);
    try {
      if (kind === 'database') {
        const script = await theme.loadDatabaseScript();
        const database = await engine.open({ key: theme.manifest.id, script });
        try {
          const bytes = await database.export();
          saveFile(`${theme.manifest.id}.sqlite`, new Uint8Array(bytes).buffer, 'application/vnd.sqlite3');
        } finally {
          await database.close();
        }
      } else {
        const content = await (kind === 'schema' ? theme.loadSchema() : theme.loadData());
        saveFile(kind === 'schema' ? 'schema.sql' : 'dati.sql', content, 'text/plain;charset=utf-8');
      }
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-label="Scarica il database">
      <h2>Scarica il database</h2>
      <p>Scarica il database iniziale per usarlo con Python o DB Browser for SQLite. Le modifiche fatte nella sandbox non sono incluse.</p>
      <div className="toolbar">
        <button type="button" disabled={busy} onClick={() => void download('database')}>Database SQLite</button>
        <button type="button" disabled={busy} onClick={() => void download('schema')}>schema.sql</button>
        <button type="button" disabled={busy} onClick={() => void download('data')}>dati.sql</button>
      </div>
      {error && <p role="alert">Download non riuscito. Riprova.</p>}
    </section>
  );
}
