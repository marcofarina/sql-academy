import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Icon } from '../icons/Icon.tsx';
import type { Theme } from '../themes/contract.ts';
import { parseMarkdown, type Block, type Inline } from './markdown.ts';

type TraceState = { status: 'loading' } | { status: 'missing' } | { status: 'failed'; message: string } | { status: 'ready'; text: string };

/**
 * La traccia del tema, scritta in `themes/<id>/traccia.md`: il testo del problema da cui nasce il database.
 * La pagina non ha il titolo della sezione: l’`h1` è il titolo del testo, con l’icona della sezione accanto.
 */
export function TraceSection({ theme, icon }: { theme: Theme; icon: ReactNode }) {
  const [state, setState] = useState<TraceState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    theme.loadTrace().then(
      (text) => !cancelled && setState(text ? { status: 'ready', text } : { status: 'missing' }),
      (error: unknown) => !cancelled && setState({ status: 'failed', message: String(error) }),
    );
    return () => {
      cancelled = true;
    };
  }, [theme]);

  if (state.status === 'ready') return <ReadyTrace text={state.text} icon={icon} />;
  // Finché il testo non c’è, il titolo della pagina è il nome della sezione.
  return (
    <>
      <h1>
        {icon}
        Traccia
      </h1>
      {state.status === 'loading' ? (
        <p className="placeholder">Caricamento della traccia…</p>
      ) : state.status === 'missing' ? (
        <p className="placeholder">Questo tema non ha ancora una traccia.</p>
      ) : (
        <div className="notice notice-error" role="alert">
          <Icon name="circle-xmark" />
          <div>
            <p className="notice-title">La traccia non si è caricata</p>
            <pre>{state.message}</pre>
          </div>
        </div>
      )}
    </>
  );
}

function ReadyTrace({ text, icon }: { text: string; icon: ReactNode }) {
  const blocks = useMemo(() => parseMarkdown(text), [text]);
  // Il primo titolo `#` del file è il titolo della pagina.
  const titleIndex = blocks.findIndex((block) => block.kind === 'heading' && block.level === 1);
  return (
    <article className="trace">
      {blocks.map((block, index) =>
        index === titleIndex && block.kind === 'heading' ? (
          <h1 key={index}>
            {icon}
            {renderInlines(block.content)}
          </h1>
        ) : (
          renderBlock(block, index)
        ),
      )}
    </article>
  );
}

function renderInlines(content: Inline[]): ReactNode[] {
  return content.map((piece, index) =>
    piece.kind === 'strong' ? (
      <strong key={index}>{piece.text}</strong>
    ) : piece.kind === 'em' ? (
      <em key={index}>{piece.text}</em>
    ) : (
      piece.text
    ),
  );
}

function renderBlock(block: Block, index: number): ReactNode {
  if (block.kind === 'list') {
    return (
      <ul key={index}>
        {block.items.map((item, i) => (
          <li key={i}>{renderInlines(item)}</li>
        ))}
      </ul>
    );
  }
  if (block.kind === 'paragraph') return <p key={index}>{renderInlines(block.content)}</p>;
  // L’h1 è uno solo, il titolo del testo: gli altri titoli scendono almeno a h2.
  const Heading = `h${Math.min(Math.max(block.level, 2), 6)}` as 'h2';
  return <Heading key={index}>{renderInlines(block.content)}</Heading>;
}
