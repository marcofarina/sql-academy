/** La scelta della classifica generale o di un mondo, in colonna o in un pannello. */
import { useEffect, useRef } from 'react';
import { Icon } from '../icons/Icon.tsx';
import { formatRoute } from '../routing/route.ts';
import type { Theme } from '../themes/contract.ts';
import { MondoPallino } from '../themes/MondoPallino.tsx';
import type { Posizione } from './servizio.ts';

interface Scelta {
  themes: Theme[];
  mondo?: Theme;
  posizioni: Record<string, Posizione>;
}

function Voci({ themes, mondo, posizioni, onScelta }: Scelta & { onScelta?: () => void }) {
  return (
    <nav className="classifica-nav" aria-label="Quale classifica">
      {[undefined, ...themes].map((tema) => {
        const id = tema?.manifest.id;
        const nome = tema?.manifest.title ?? 'Generale';
        const rank = posizioni[id ?? '']?.rank;
        return (
          <a key={id ?? 'generale'} href={formatRoute({ page: 'classifica', themeId: id })}
            aria-current={mondo === tema ? 'page' : undefined}
            aria-label={rank ? `${nome}, sei ${rank}º` : `${nome}, ${rank === null ? 'nessun punto' : 'posizione non disponibile'}`}
            onClick={onScelta}>
            {id ? <MondoPallino id={id} /> : <Icon name="trophy" />}
            <span>{nome}</span>
            <strong aria-hidden="true">{rank ? `${rank}º` : '—'}</strong>
          </a>
        );
      })}
    </nav>
  );
}

/** La colonna delle classifiche nella disposizione a due colonne. */
export function ElencoClassifiche(scelta: Scelta) {
  return (
    <div className="classifica-scelta">
      <h2>Quale classifica</h2>
      <Voci {...scelta} />
    </div>
  );
}

/** Il pannello del telefono usa il dialogo nativo per confinare e restituire il fuoco. */
export function PannelloClassifiche({ themes, mondo, posizioni }: Scelta) {
  const pannello = useRef<HTMLDialogElement>(null);
  const pulsante = useRef<HTMLButtonElement>(null);
  const rank = posizioni[mondo?.manifest.id ?? '']?.rank;

  useEffect(() => {
    pannello.current?.close();
  }, [mondo]);

  return (
    <div className="classifica-selettore">
      <button type="button" aria-haspopup="dialog" aria-controls="classifica-pannello"
        ref={pulsante} onClick={() => pannello.current?.showModal()} className="classifica-cambia">
        <span>
          <small>Classifica</small>
          {mondo?.manifest.title ?? 'Generale'}{rank ? ` · sei ${rank}º` : ''}
        </span>
        <span><Icon name="list" />Cambia</span>
      </button>
      <dialog id="classifica-pannello" ref={pannello} aria-modal="true" aria-labelledby="classifica-quale"
        onClose={() => pulsante.current?.focus()}
        onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close(); }}>
        <div className="classifica-pannello-interno">
          <div className="classifica-pannello-testa">
            <h2 id="classifica-quale">Quale classifica</h2>
            <button type="button" onClick={() => pannello.current?.close()}>Chiudi</button>
          </div>
          <Voci themes={themes} mondo={mondo} posizioni={posizioni} onScelta={() => pannello.current?.close()} />
        </div>
      </dialog>
    </div>
  );
}
