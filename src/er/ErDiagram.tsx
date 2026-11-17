/**
 * Diagramma Entità-Associazione in notazione Batini (rettangolo, rombo,
 * lecca-lecca, cardinalità (min,max)) con il tratto di Excalidraw: rough.js
 * per le linee, Excalifont per il testo. Copiato dal componente <DiagrammaER>
 * del libro; disposizione e disegno stanno in `layout.ts`.
 */

import { useId, useMemo } from 'react';
import { describeDiagram } from './describe.ts';
import { calcola } from './layout.ts';
import type { DiagrammaERProps } from './types.ts';

/** Corpo minimo (px) sotto cui il testo più piccolo, 14 px, non deve scendere. */
const MIN_FONT = 11;
const SMALL_FONT = 14;

export function ErDiagram({ diagram }: { diagram: DiagrammaERProps }) {
  const { forme, testi, vb } = useMemo(() => calcola(diagram), [diagram]);
  const description = useMemo(
    () => diagram.descrizione ?? describeDiagram(diagram).join(' '),
    [diagram],
  );
  const titleId = `er-${useId().replace(/[^\w-]/g, '')}`;

  return (
    <figure className="er-figure">
      <svg
        className="er-diagram"
        viewBox={`${vb.x} ${vb.y} ${vb.l} ${vb.a}`}
        style={{
          maxWidth: `${Math.round(vb.l)}px`,
          minWidth: `${Math.round((vb.l * MIN_FONT) / SMALL_FONT)}px`,
        }}
        role="img"
        aria-labelledby={titleId}
      >
        <title id={titleId}>{diagram.titolo}</title>
        <desc>{description}</desc>
        {forme.map((f, i) => (
          <path key={i} d={f.d} className={`er-${f.tipo} ${f.riempimento ? 'er-fill' : 'er-stroke'}`} />
        ))}
        {testi.map((t, i) => (
          <text key={i} x={t.x} y={t.y} fontSize={t.size} textAnchor={t.anchor} className="er-text">
            {t.testo}
          </text>
        ))}
      </svg>
    </figure>
  );
}
