/** Il codice da conservare, con la copia negli appunti. */
import { useState } from 'react';
import { Icon } from '../icons/Icon.tsx';
import { formattaCodice } from './cifra.ts';

/** Mostra le quattro parole numerate o il codice precedente in gruppi di quattro caratteri. */
export function BloccoCodice({ codice }: { codice: string }) {
  const [copiato, setCopiato] = useState<boolean | null>(null);
  const formattato = formattaCodice(codice);
  return (
    <div data-zaino-codice="">
      {codice.includes('-') ? (
        <ol className="zaino-codice-parole" translate="no" aria-label="Le quattro parole del codice">
          {codice.split('-').map((parola, i) => (
            <li key={i}><span className="zaino-numero" aria-hidden="true">{i + 1}</span>{parola}</li>
          ))}
        </ol>
      ) : <p className="zaino-codice" translate="no">{formattato}</p>}
      <div className="toolbar">
        <button type="button" onClick={async () => {
          try {
            await navigator.clipboard.writeText(formattato);
            setCopiato(true);
          } catch {
            setCopiato(false);
          }
        }}>
          <Icon name="copy" />Copia il codice
        </button>
        <span role="status">{copiato === true ? 'Codice copiato.' : copiato === false ? 'Non sono riuscito a copiare. Seleziona il codice e copialo.' : ''}</span>
      </div>
    </div>
  );
}
