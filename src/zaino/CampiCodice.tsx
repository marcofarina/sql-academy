/** Le quattro parole in ordine, con suggerimenti dall’elenco dello zaino. */
import { useId, useRef, useState } from 'react';
import { normalizzaCodice, pulisciParola } from './cifra.ts';
import { PAROLE } from './parole.ts';

const ORDINALI = ['Prima', 'Seconda', 'Terza', 'Quarta'];

/** Le caselle condivise dai moduli di apertura e creazione dello zaino. */
export function CampiCodice({ parole, onChange, errore }: {
  parole: string[];
  onChange: (parole: string[]) => void;
  errore?: number | null;
}) {
  const id = useId();
  const campi = useRef<(HTMLInputElement | null)[]>([]);
  const [fuoco, setFuoco] = useState<number | null>(null);
  const [scelta, setScelta] = useState(-1);
  const prefisso = fuoco === null ? '' : pulisciParola(parole[fuoco]);
  const proposte = prefisso.length >= 2 ? PAROLE.filter((p) => p.startsWith(prefisso)).slice(0, 6) : [];

  function scrivi(i: number, parola: string) {
    onChange(parole.map((attuale, indice) => indice === i ? parola : attuale));
    setScelta(-1);
  }

  function avanti(i: number) {
    setFuoco(null);
    campi.current[i + 1]?.focus();
  }

  function accetta(i: number, parola: string) {
    scrivi(i, parola);
    avanti(i);
  }

  return (
    <fieldset className="zaino-parole">
      <legend className="visually-hidden">Codice dello zaino, quattro parole in ordine</legend>
      {parole.map((parola, i) => {
        const aperto = fuoco === i && proposte.length > 0;
        const lista = `${id}-parola-${i}`;
        return (
          <div className="zaino-parola" key={ORDINALI[i]} data-errata={errore === i || undefined}>
            <label className="zaino-etichetta" htmlFor={lista}>
              <span className="zaino-numero" aria-hidden="true">{i + 1}</span>
              <span className="zaino-ordinale" aria-hidden="true">{ORDINALI[i].toLowerCase()}</span>
              <span className="visually-hidden">{ORDINALI[i]} parola</span>
            </label>
            <input
              id={lista}
              ref={(campo) => { campi.current[i] = campo; }}
              className="zaino-input"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={aperto}
              aria-controls={aperto ? `${lista}-lista` : undefined}
              aria-activedescendant={aperto && scelta >= 0 ? `${lista}-opzione-${scelta}` : undefined}
              aria-invalid={errore === i || undefined}
              aria-describedby={errore === i ? 'zaino-parola-errata' : undefined}
              type="text"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              translate="no"
              value={parola}
              onFocus={() => { setFuoco(i); setScelta(-1); }}
              onBlur={() => setFuoco(null)}
              onChange={(event) => { scrivi(i, event.target.value); setFuoco(i); }}
              onPaste={(event) => {
                const testo = event.clipboardData.getData('text').trim();
                const pezzi = testo.split(/[\s-]+/);
                const codice = pezzi.length === 4 ? pezzi : normalizzaCodice(testo)?.split('-');
                if (codice?.length !== 4) return;
                event.preventDefault();
                onChange(codice);
                setFuoco(null);
                campi.current[3]?.focus();
              }}
              onKeyDown={(event) => {
                if (event.nativeEvent.isComposing) return;
                const { key, shiftKey } = event;
                if (key === 'Escape' && aperto) {
                  event.preventDefault();
                  setFuoco(null);
                } else if (key === 'ArrowDown' || key === 'ArrowUp') {
                  if (!aperto) {
                    setFuoco(i);
                    return;
                  }
                  event.preventDefault();
                  setScelta((s) => key === 'ArrowDown' ? (s + 1) % proposte.length : (s <= 0 ? proposte.length - 1 : s - 1));
                } else if (aperto && scelta >= 0 && (key === 'Enter' || (key === 'Tab' && !shiftKey))) {
                  // Nell’ultima casella Tab accetta e prosegue sul controllo successivo.
                  if (key === 'Enter' || i < 3) event.preventDefault();
                  accetta(i, proposte[scelta]);
                } else if (key === ' ') {
                  event.preventDefault();
                  avanti(i);
                }
              }}
            />
            {aperto && (
              <ul id={`${lista}-lista`} className="zaino-proposte" role="listbox" aria-label={`Suggerimenti per la parola ${i + 1}`} translate="no">
                {proposte.map((p, indice) => (
                  <li
                    id={`${lista}-opzione-${indice}`}
                    key={p}
                    role="option"
                    aria-selected={scelta === indice}
                    onPointerDown={(event) => event.preventDefault()}
                    onClick={() => accetta(i, p)}
                  >
                    <strong>{p.slice(0, prefisso.length)}</strong>{p.slice(prefisso.length)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </fieldset>
  );
}
