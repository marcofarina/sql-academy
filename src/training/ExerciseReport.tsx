/** Bozze di segnalazione compilate nel browser per e-mail e GitHub. */
import { useState } from 'react';
import { Icon } from '../icons/Icon.tsx';

const MAILBOX = 'info@rainbowbits.cloud';
const GITHUB_ISSUE = 'https://github.com/marcofarina/sql-academy/issues/new';
// Mantiene brevi i link anche per i programmi di posta con limiti più stretti del browser.
const MAX_LINK_LENGTH = 1800;

function mailto(subject: string, body: string): string {
  const fields = new URLSearchParams({ subject, body: body.replace(/\r\n?|\n/g, '\r\n') });
  return `mailto:${MAILBOX}?${fields.toString().replace(/\+/g, '%20')}`;
}

function issueUrl(title: string, body: string): string {
  return `${GITHUB_ISSUE}?${new URLSearchParams({ title, body })}`;
}

/** Apre le bozze con la query dell’editor, che lo studente può scegliere di omettere. */
export function ExerciseReport({ themeId, exerciseId, query }: { themeId: string; exerciseId: string; query: string }) {
  const [includeQuery, setIncludeQuery] = useState(true);
  const hasQuery = query.trim() !== '';
  const sql = hasQuery && includeQuery ? query : '';
  const subject = `SQL Academy · ${themeId}/${exerciseId}`;
  const context = `Tema: ${themeId}\nEsercizio: ${exerciseId}\nVersione del sito: ${__SITE_REVISION__}`;
  const base = `Descrivi il problema e indica cosa ti aspettavi.\n\n${context}`;
  const mailDraft = sql.length <= MAX_LINK_LENGTH ? mailto(subject, sql ? `${base}\n\nQuery:\n${sql}` : base) : '';
  // Il rientro conserva la query come codice anche se contiene righe con delimitatori Markdown.
  const issueDraft = sql.length <= MAX_LINK_LENGTH
    ? issueUrl(subject, sql ? `${base}\n\nQuery:\n\n${sql.replace(/^/gm, '    ')}` : base)
    : '';
  const pasteQuery = !mailDraft || !issueDraft || mailDraft.length > MAX_LINK_LENGTH || issueDraft.length > MAX_LINK_LENGTH;

  return (
    <details className="exercise-report">
      <summary><Icon name="flag" /> Segnala un problema</summary>
      {hasQuery && (
        <p>
          <label>
            <input type="checkbox" checked={includeQuery} onChange={(event) => setIncludeQuery(event.target.checked)} />{' '}
            Includi la mia query
          </label>
          <br />
          Controlla la query nell’editor prima di condividerla. Elimina eventuali dati personali.
        </p>
      )}
      {pasteQuery && (
        <label className="exercise-report-copy">
          La query è troppo lunga per il link. Copia la query qui sotto e incollala nella bozza.
          <textarea readOnly rows={4} value={sql} />
        </label>
      )}
      <p>
        Se invii l’e-mail, chi la riceve vede il tuo indirizzo. Su GitHub serve un account.
        Chiunque può leggere la segnalazione dopo che la pubblichi.
      </p>
      <div className="toolbar">
        <a className="button" href={pasteQuery ? mailto(subject, base) : mailDraft}>Apri una bozza e-mail</a>
        <a className="button" href={pasteQuery ? issueUrl(subject, base) : issueDraft} target="_blank" rel="noreferrer">
          Apri una bozza su GitHub
        </a>
      </div>
    </details>
  );
}
