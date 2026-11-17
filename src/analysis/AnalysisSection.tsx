import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Icon } from '../icons/Icon.tsx';
import type { Theme } from '../themes/contract.ts';
import { parseMarkdown, type Block, type Inline } from './markdown.ts';

type AnalysisState = { status: 'loading' } | { status: 'missing' } | { status: 'failed'; message: string } | { status: 'ready'; text: string };

/** L’analisi del dominio, scritta in `themes/<id>/analisi.md`. */
export function AnalysisSection({ theme }: { theme: Theme }) {
  const [state, setState] = useState<AnalysisState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    theme.loadAnalysis().then(
      (text) => !cancelled && setState(text ? { status: 'ready', text } : { status: 'missing' }),
      (error: unknown) => !cancelled && setState({ status: 'failed', message: String(error) }),
    );
    return () => {
      cancelled = true;
    };
  }, [theme]);

  if (state.status === 'loading') return <p className="placeholder">Caricamento dell’analisi…</p>;
  if (state.status === 'missing') return <p className="placeholder">Questo tema non ha ancora un’analisi.</p>;
  if (state.status === 'failed') {
    return (
      <div className="notice notice-error" role="alert">
        <Icon name="circle-xmark" />
        <div>
          <p className="notice-title">L’analisi non si è caricata</p>
          <pre>{state.message}</pre>
        </div>
      </div>
    );
  }
  return <ReadyAnalysis text={state.text} />;
}

function ReadyAnalysis({ text }: { text: string }) {
  const blocks = useMemo(() => parseMarkdown(text), [text]);
  return <article className="analysis">{blocks.map(renderBlock)}</article>;
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
  // Il titolo della pagina è già un h1 (il nome della sezione): i titoli del file scendono di un livello.
  const Heading = `h${Math.min(block.level + 1, 6)}` as 'h2';
  return <Heading key={index}>{renderInlines(block.content)}</Heading>;
}
