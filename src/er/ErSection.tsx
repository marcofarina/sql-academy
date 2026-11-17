import { useEffect, useMemo, useState } from 'react';
import { Icon } from '../icons/Icon.tsx';
import type { ErDiagram as Diagram, Theme } from '../themes/contract.ts';
import { describeDiagram } from './describe.ts';
import { ErDiagram } from './ErDiagram.tsx';

type ErState = { status: 'loading' } | { status: 'missing' } | { status: 'failed'; message: string } | { status: 'ready'; diagram: Diagram };

/** Lo schema ER del tema, dichiarato in `themes/<id>/er.ts`. */
export function ErSection({ theme }: { theme: Theme }) {
  const [state, setState] = useState<ErState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    theme.loadEr().then(
      (diagram) => !cancelled && setState(diagram ? { status: 'ready', diagram } : { status: 'missing' }),
      (error: unknown) => !cancelled && setState({ status: 'failed', message: String(error) }),
    );
    return () => {
      cancelled = true;
    };
  }, [theme]);

  if (state.status === 'loading') return <p className="placeholder">Caricamento dello schema ER…</p>;
  if (state.status === 'missing') return <p className="placeholder">Questo tema non ha ancora uno schema ER.</p>;
  if (state.status === 'failed') {
    return (
      <div className="notice notice-error" role="alert">
        <Icon name="circle-xmark" />
        <div>
          <p className="notice-title">Lo schema ER non si è caricato</p>
          <pre>{state.message}</pre>
        </div>
      </div>
    );
  }
  return <ReadyDiagram diagram={state.diagram} />;
}

function ReadyDiagram({ diagram }: { diagram: Diagram }) {
  const sentences = useMemo(() => describeDiagram(diagram), [diagram]);
  return (
    <div className="er">
      <ErDiagram diagram={diagram} />
      <details className="er-description">
        <summary>Il diagramma descritto a parole</summary>
        <ul>
          {sentences.map((sentence) => (
            <li key={sentence}>{sentence}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}
