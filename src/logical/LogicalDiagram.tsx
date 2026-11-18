/**
 * Il modello logico come diagramma UML: un riquadro per tabella, una riga per
 * colonna, linee ortogonali dalla chiave esterna alla chiave primaria con le
 * cardinalità 1 e N. La disposizione sta in `layout.ts`; qui si misura il
 * testo con i caratteri della veste e si disegna.
 */
import { useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { commonIcons } from '../icons/registry.ts';
import type { TableInfo } from '../sandbox/session.ts';
import { describeTables } from './describe.ts';
import { estimate, FONT, HEAD, ICON, layoutDiagram, PAD, ROW, type Measure, type TextKind } from './layout.ts';
import type { LogicalLayout } from './types.ts';

/** Corpo minimo (px) sotto cui il testo più piccolo non deve scendere quando il diagramma si stringe. */
const MIN_FONT = 10;

/** Misura il testo con i caratteri della veste, dopo che si sono caricati. */
function useMeasure(ref: React.RefObject<SVGSVGElement | null>): Measure {
  const [measure, setMeasure] = useState<Measure>(() => estimate);
  useLayoutEffect(() => {
    const element = ref.current;
    const context = document.createElement('canvas').getContext('2d');
    if (!element || !context) return;
    const style = getComputedStyle(element);
    const body = style.getPropertyValue('--font-body').trim() || 'sans-serif';
    const mono = style.getPropertyValue('--font-mono').trim() || 'monospace';
    const fonts: Record<TextKind, string> = {
      title: `700 ${FONT.title}px ${body}`,
      name: `italic 400 ${FONT.name}px ${body}`,
      type: `400 ${FONT.type}px ${mono}`,
    };
    let cancelled = false;
    const update = () => {
      if (cancelled) return;
      setMeasure(() => (text: string, kind: TextKind) => {
        context.font = fonts[kind];
        return context.measureText(text).width;
      });
    };
    update();
    Promise.all(Object.values(fonts).map((font) => document.fonts.load(font))).then(update, () => {});
    return () => {
      cancelled = true;
    };
  }, [ref]);
  return measure;
}

/** Un’icona comune dentro l’SVG, nel quadrato (x, y, size). */
function placedIcon(name: string, x: number, y: number, size: number): string {
  return commonIcons[name].replace(/^<svg\b/, `<svg x="${x}" y="${y}" width="${size}" height="${size}" aria-hidden="true"`);
}

export function LogicalDiagram({ tables, layout, title }: { tables: TableInfo[]; layout: LogicalLayout; title: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const measure = useMeasure(ref);
  const drawing = useMemo(() => layoutDiagram(tables, layout, measure), [tables, layout, measure]);
  const description = useMemo(() => describeTables(tables).join(' '), [tables]);
  const titleId = `logico-${useId().replace(/[^\w-]/g, '')}`;
  const { width, height } = drawing;

  return (
    <figure className="er-figure logical-figure">
      <svg
        ref={ref}
        className="logical-diagram"
        viewBox={`0 0 ${width} ${height}`}
        style={{ maxWidth: `${Math.round(width)}px`, minWidth: `${Math.round((width * MIN_FONT) / FONT.type)}px` }}
        role="img"
        aria-labelledby={titleId}
      >
        <title id={titleId}>{title}</title>
        <desc>{description}</desc>
        {drawing.boxes.map((box) => {
          const typeX = box.x + box.w - PAD - drawing.iconSlot - 6;
          return (
            <g key={box.table}>
              <rect className="logical-box" x={box.x} y={box.y} width={box.w} height={box.h} rx={4} />
              {box.rows.map(
                (row) =>
                  row.column.primaryKey && (
                    <rect key={row.column.name} className="logical-pk-row" x={box.x + 1} y={row.y - ROW / 2} width={box.w - 2} height={ROW} />
                  ),
              )}
              <path
                className="logical-head"
                d={`M${box.x} ${box.y + HEAD}V${box.y + 4}a4 4 0 0 1 4 -4H${box.x + box.w - 4}a4 4 0 0 1 4 4V${box.y + HEAD}Z`}
              />
              <text className="logical-title" x={box.x + PAD} y={box.y + HEAD / 2} dominantBaseline="central">
                {box.table}
              </text>
              {box.rows.map((row) => {
                const icons = [row.column.primaryKey && 'key', row.column.foreignKey && 'link'].filter(Boolean) as string[];
                const classes = ['logical-name', row.column.primaryKey && 'is-pk', row.column.foreignKey && 'is-fk'].filter(Boolean).join(' ');
                return (
                  <g key={row.column.name}>
                    <text className={classes} x={box.x + PAD} y={row.y} dominantBaseline="central">
                      {row.column.name}
                    </text>
                    <text className="logical-type" x={typeX} y={row.y} dominantBaseline="central" textAnchor="end">
                      {row.column.type}
                    </text>
                    {icons.map((name, i) => (
                      <g
                        key={name}
                        className="logical-icon"
                        dangerouslySetInnerHTML={{
                          __html: placedIcon(name, box.x + box.w - PAD - drawing.iconSlot + i * (ICON + 3) + 3, row.y - ICON / 2, ICON),
                        }}
                      />
                    ))}
                  </g>
                );
              })}
            </g>
          );
        })}
        {drawing.lines.map((line) => (
          <polyline
            key={`${line.relation.from.table}.${line.relation.from.column}`}
            className="logical-line"
            points={line.points.map((p) => p.join(',')).join(' ')}
          />
        ))}
        {drawing.labels.map((label) => (
          <text key={`${label.x},${label.y},${label.text}`} className="logical-card" x={label.x} y={label.y} textAnchor={label.anchor}>
            {label.text}
          </text>
        ))}
      </svg>
    </figure>
  );
}
