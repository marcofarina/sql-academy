/**
 * Disposizione del diagramma del modello logico: dalle tabelle lette dal
 * database e dalle posizioni di `themes/<id>/logico.ts` ai riquadri, alle linee
 * e alle cardinalità. Senza React e senza DOM, così gira anche in Node
 * (`npm run check:themes` e i test).
 *
 * Le tabelle stanno su una griglia. Fra due colonne c’è una corsia verticale,
 * fra due righe una corsia orizzontale, larghe quanto serve alle linee che le
 * usano: ogni linea ha un binario proprio in ogni corsia. Una linea esce dalla
 * riga della chiave esterna, scende o sale nella corsia accanto al riquadro e,
 * se la tabella di arrivo non si affaccia sulla stessa corsia, attraversa la
 * griglia lungo una corsia orizzontale. Le corsie sono vuote per costruzione:
 * le linee non attraversano i riquadri.
 */
import type { ColumnInfo, TableInfo } from '../sandbox/session.ts';
import type { LogicalLayout } from './types.ts';

export type TextKind = 'title' | 'name' | 'type';
/** Larghezza in px di un testo nel carattere del suo tipo. */
export type Measure = (text: string, kind: TextKind) => number;

export const FONT: Record<TextKind, number> = { title: 15, name: 14, type: 11.5 };
export const HEAD = 30;
export const ROW = 22;
export const PAD = 10;
export const ICON = 13;
const ICON_GAP = 3;
const TYPE_GAP = 16;
/** Spazio fra il riquadro e il primo binario di una corsia, per le cardinalità. */
const LABEL = 18;
const TRACK = 12;
const GUTTER_MIN = 56;
const CHANNEL_MIN = 40;
const MARGIN = 4;

/** Stima per Node: il browser misura il testo con il carattere vero. */
export const estimate: Measure = (text, kind) => text.length * FONT[kind] * (kind === 'title' ? 0.62 : 0.56);

export interface Relation {
  from: { table: string; column: string };
  to: { table: string; column: string };
}

/** Le chiavi esterne del database, una per colonna, nell’ordine delle tabelle e delle colonne. */
export function relationsOf(tables: readonly TableInfo[]): Relation[] {
  return tables.flatMap((table) =>
    table.columns
      .filter((column) => column.foreignKey)
      .map((column) => ({ from: { table: table.name, column: column.name }, to: { ...column.foreignKey! } })),
  );
}

/**
 * Coerenza fra `logico.ts` e le tabelle: ogni tabella compare una volta, in
 * una cella propria con coordinate intere non negative. Restituisce i problemi
 * in italiano; elenco vuoto se il file è coerente.
 */
export function checkLayoutCoherence(layout: LogicalLayout, tables: readonly string[]): string[] {
  const problems: string[] = [];
  const existing = new Set(tables);
  const cells = new Map<string, string>();
  for (const [table, position] of Object.entries(layout.tabelle ?? {})) {
    if (!existing.has(table)) problems.push(`la tabella «${table}» non esiste nel database`);
    const { col, riga } = position ?? {};
    if (!Number.isInteger(col) || !Number.isInteger(riga) || col < 0 || riga < 0) {
      problems.push(`la tabella «${table}» ha una posizione non valida: col e riga sono interi da 0`);
      continue;
    }
    const cell = `${col},${riga}`;
    const other = cells.get(cell);
    if (other) problems.push(`le tabelle «${other}» e «${table}» stanno nella stessa cella (col ${col}, riga ${riga})`);
    else cells.set(cell, table);
  }
  for (const table of tables) {
    if (!(table in (layout.tabelle ?? {}))) problems.push(`la tabella «${table}» non ha una posizione`);
  }
  return problems;
}

/** Senza `logico.ts`: le tabelle in ordine, tre per riga. */
export function defaultLayout(tables: readonly TableInfo[]): LogicalLayout {
  return {
    tabelle: Object.fromEntries(tables.map((table, i) => [table.name, { col: i % 3, riga: Math.floor(i / 3) }])),
  };
}

export interface RowBox {
  column: ColumnInfo;
  /** Centro verticale della riga. */
  y: number;
}

export interface Box {
  table: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rows: RowBox[];
}

export type Point = [number, number];

export interface Line {
  relation: Relation;
  points: Point[];
}

export interface Label {
  x: number;
  y: number;
  text: '1' | 'N';
  anchor: 'start' | 'end';
}

export interface Drawing {
  width: number;
  height: number;
  /** Larghezza riservata alle icone in fondo a ogni riga. */
  iconSlot: number;
  boxes: Box[];
  lines: Line[];
  labels: Label[];
}

const iconCount = (column: ColumnInfo) => (column.primaryKey ? 1 : 0) + (column.foreignKey ? 1 : 0);

/** Calcola riquadri, linee e cardinalità. Le tabelle senza posizione si accodano in fondo, tre per riga. */
export function layoutDiagram(tables: readonly TableInfo[], layout: LogicalLayout, measure: Measure = estimate): Drawing {
  const byName = new Map(tables.map((table) => [table.name, table]));
  const place = new Map<string, { col: number; riga: number }>();
  for (const table of tables) {
    const position = layout.tabelle[table.name];
    if (position) place.set(table.name, position);
  }
  const lastRow = Math.max(-1, ...[...place.values()].map((p) => p.riga));
  tables
    .filter((table) => !place.has(table.name))
    .forEach((table, i) => place.set(table.name, { col: i % 3, riga: lastRow + 1 + Math.floor(i / 3) }));

  const cols = Math.max(0, ...[...place.values()].map((p) => p.col)) + 1;
  const bands = Math.max(0, ...[...place.values()].map((p) => p.riga)) + 1;

  // Misure dei riquadri: in una colonna hanno tutti la stessa larghezza.
  const maxIcons = Math.max(1, ...tables.flatMap((t) => t.columns.map(iconCount)));
  const iconSlot = maxIcons * (ICON + ICON_GAP);
  const colW = Array<number>(cols).fill(0);
  const bandH = Array<number>(bands).fill(0);
  for (const table of tables) {
    const { col, riga } = place.get(table.name)!;
    const name = Math.max(0, ...table.columns.map((c) => measure(c.name, 'name')));
    const type = Math.max(0, ...table.columns.map((c) => measure(c.type, 'type')));
    const w = Math.max(PAD + measure(table.name, 'title') + PAD, PAD + name + TYPE_GAP + type + 6 + iconSlot + PAD);
    colW[col] = Math.max(colW[col], Math.ceil(w));
    bandH[riga] = Math.max(bandH[riga], HEAD + table.columns.length * ROW);
  }

  // Percorsi: prima le corsie, poi le misure delle corsie, infine le coordinate.
  const relations = relationsOf(tables).filter((r) => byName.has(r.to.table));
  const routes: { relation: Relation; ca: number; ra: number; cb: number; rb: number; ga: number; gb: number; channel?: number }[] =
    relations.map((relation) => {
      const { col: ca, riga: ra } = place.get(relation.from.table)!;
      const { col: cb, riga: rb } = place.get(relation.to.table)!;
      const [ga, gb] = cb > ca ? [ca + 1, cb] : cb < ca ? [ca, cb + 1] : [ca + 1, ca + 1];
      const channel = ga === gb ? undefined : ra < rb ? ra + 1 : ra > rb ? ra : ra + 1;
      return { relation, ca, ra, cb, rb, ga, gb, channel };
    });

  // Binari nelle corsie verticali. Un tratto che entra nella corsia dal
  // riquadro di sinistra arriva fino al binario della sua linea; uno che entra
  // da destra parte dal suo binario. Se due tratti opposti stanno alla stessa
  // altezza, la linea attaccata a sinistra deve avere il binario più a sinistra,
  // altrimenti i due tratti si sovrappongono: l’ordine dei binari rispetta questi
  // vincoli e, a parità, l’ordine delle chiavi esterne.
  const gutterLines: number[][] = Array.from({ length: cols + 1 }, () => []);
  routes.forEach((r, i) => {
    gutterLines[r.ga].push(i);
    if (r.gb !== r.ga) gutterLines[r.gb].push(i);
  });
  const stubRows = (i: number, g: number, side: 'left' | 'right') => {
    const r = routes[i];
    const ends = [
      { g: r.ga, col: r.ca, table: r.relation.from.table, column: r.relation.from.column },
      { g: r.gb, col: r.cb, table: r.relation.to.table, column: r.relation.to.column },
    ];
    return ends
      .filter((e) => e.g === g && e.col === (side === 'left' ? g - 1 : g))
      .map((e) => `${place.get(e.table)!.riga}:${byName.get(e.table)!.columns.findIndex((c) => c.name === e.column)}`);
  };
  for (let g = 0; g <= cols; g++) gutterLines[g] = orderTracks(gutterLines[g], (i, j) => {
    const left = stubRows(i, g, 'left');
    return stubRows(j, g, 'right').some((row) => left.includes(row));
  });

  const channelLines: number[][] = Array.from({ length: bands + 1 }, () => []);
  routes.forEach((r, i) => r.channel !== undefined && channelLines[r.channel].push(i));

  const gutterW = gutterLines.map((lines, g) => {
    const outer = g === 0 || g === cols;
    if (lines.length === 0) return outer ? MARGIN : GUTTER_MIN;
    return Math.max(outer ? 0 : GUTTER_MIN, 2 * LABEL + (lines.length - 1) * TRACK);
  });
  const channelH = channelLines.map((lines, h) => {
    const outer = h === 0 || h === bands;
    if (lines.length === 0) return outer ? MARGIN : CHANNEL_MIN;
    return Math.max(outer ? 0 : CHANNEL_MIN, (lines.length + 1) * TRACK);
  });

  const gutterX: number[] = [];
  const colX: number[] = [];
  let x = 0;
  for (let c = 0; c <= cols; c++) {
    gutterX.push(x);
    x += gutterW[c];
    if (c < cols) {
      colX.push(x);
      x += colW[c];
    }
  }
  const width = x;
  const channelY: number[] = [];
  const bandY: number[] = [];
  let y = 0;
  for (let r = 0; r <= bands; r++) {
    channelY.push(y);
    y += channelH[r];
    if (r < bands) {
      bandY.push(y);
      y += bandH[r];
    }
  }
  const height = y;

  const boxes = new Map<string, Box>();
  for (const table of tables) {
    const { col, riga } = place.get(table.name)!;
    const top = bandY[riga];
    boxes.set(table.name, {
      table: table.name,
      x: colX[col],
      y: top,
      w: colW[col],
      h: HEAD + table.columns.length * ROW,
      rows: table.columns.map((column, i) => ({ column, y: top + HEAD + i * ROW + ROW / 2 })),
    });
  }

  const trackX = (i: number, g: number) => {
    const lines = gutterLines[g];
    const k = lines.indexOf(i);
    const span = (lines.length - 1) * TRACK;
    return gutterX[g] + gutterW[g] / 2 - span / 2 + k * TRACK;
  };
  const trackY = (i: number, h: number) => {
    const lines = channelLines[h];
    const k = lines.indexOf(i);
    return channelY[h] + ((k + 1) * channelH[h]) / (lines.length + 1);
  };
  const rowY = (table: string, column: string) => boxes.get(table)!.rows.find((r) => r.column.name === column)!.y;
  const sideX = (box: Box, g: number, col: number) => (g === col ? box.x : box.x + box.w);

  const lines: Line[] = [];
  const labels = new Map<string, Label>();
  const addLabel = (box: Box, g: number, col: number, yRow: number, text: '1' | 'N') => {
    const left = g === col; // la corsia sta a sinistra del riquadro
    const xs = sideX(box, g, col);
    const label: Label = { x: left ? xs - 5 : xs + 5, y: yRow - 4, text, anchor: left ? 'end' : 'start' };
    labels.set(`${label.x},${label.y},${text}`, label);
  };

  routes.forEach((r, i) => {
    const a = boxes.get(r.relation.from.table)!;
    const b = boxes.get(r.relation.to.table)!;
    const ya = rowY(r.relation.from.table, r.relation.from.column);
    const yb = rowY(r.relation.to.table, r.relation.to.column);
    const xa = sideX(a, r.ga, r.ca);
    const xb = sideX(b, r.gb, r.cb);
    const ta = trackX(i, r.ga);
    const points: Point[] = [[xa, ya], [ta, ya]];
    if (r.channel === undefined) {
      points.push([ta, yb]);
    } else {
      const yc = trackY(i, r.channel);
      const tb = trackX(i, r.gb);
      points.push([ta, yc], [tb, yc], [tb, yb]);
    }
    points.push([xb, yb]);
    lines.push({ relation: r.relation, points: simplify(points) });
    addLabel(a, r.ga, r.ca, ya, 'N');
    addLabel(b, r.gb, r.cb, yb, '1');
  });

  return { width, height, iconSlot, boxes: [...boxes.values()], lines, labels: [...labels.values()] };
}

/**
 * Ordina le linee di una corsia: `before(i, j)` dice che `i` deve stare prima
 * di `j`. Ordinamento topologico che a parità tiene l’ordine di partenza; se i
 * vincoli formano un ciclo, le linee rimaste si accodano nell’ordine di partenza
 * e `drawingProblems` segnala la sovrapposizione.
 */
function orderTracks(lines: number[], before: (i: number, j: number) => boolean): number[] {
  const rest = [...lines];
  const out: number[] = [];
  while (rest.length > 0) {
    const free = rest.findIndex((j) => !rest.some((i) => i !== j && before(i, j)));
    out.push(...rest.splice(free === -1 ? 0 : free, 1));
  }
  return out;
}

/** Toglie i punti ripetuti e quelli allineati, che non cambiano direzione. */
function simplify(points: Point[]): Point[] {
  const out: Point[] = [];
  for (const p of points) {
    const last = out.at(-1);
    if (last && last[0] === p[0] && last[1] === p[1]) continue;
    const prev = out.at(-2);
    if (prev && last && ((prev[0] === last[0] && last[0] === p[0]) || (prev[1] === last[1] && last[1] === p[1]))) {
      out[out.length - 1] = p;
      continue;
    }
    out.push(p);
  }
  return out;
}

type Segment = { x0: number; y0: number; x1: number; y1: number };

const segmentsOf = (line: Line): Segment[] =>
  line.points.slice(1).map((p, i) => {
    const q = line.points[i];
    return { x0: Math.min(q[0], p[0]), y0: Math.min(q[1], p[1]), x1: Math.max(q[0], p[0]), y1: Math.max(q[1], p[1]) };
  });

/**
 * Controlla il disegno: nessuna linea attraversa un riquadro e due linee non
 * corrono sovrapposte, salvo quelle che arrivano alla stessa chiave primaria e
 * si uniscono nell’ultimo tratto. Restituisce i problemi in italiano.
 */
export function drawingProblems(drawing: Drawing): string[] {
  const problems: string[] = [];
  const name = (l: Line) => `${l.relation.from.table}.${l.relation.from.column}`;
  for (const line of drawing.lines) {
    for (const s of segmentsOf(line)) {
      for (const box of drawing.boxes) {
        const inside = s.x1 > box.x + 0.5 && s.x0 < box.x + box.w - 0.5 && s.y1 > box.y + 0.5 && s.y0 < box.y + box.h - 0.5;
        if (inside) problems.push(`la linea di ${name(line)} attraversa la tabella «${box.table}»`);
      }
    }
  }
  drawing.lines.forEach((l1, i) => {
    drawing.lines.slice(i + 1).forEach((l2) => {
      if (l1.relation.to.table === l2.relation.to.table && l1.relation.to.column === l2.relation.to.column) return;
      for (const s of segmentsOf(l1)) {
        for (const t of segmentsOf(l2)) {
          const horizontal = s.y0 === s.y1 && t.y0 === t.y1 && s.y0 === t.y0 && Math.min(s.x1, t.x1) - Math.max(s.x0, t.x0) > 0.5;
          const vertical = s.x0 === s.x1 && t.x0 === t.x1 && s.x0 === t.x0 && Math.min(s.y1, t.y1) - Math.max(s.y0, t.y0) > 0.5;
          if (horizontal || vertical) problems.push(`le linee di ${name(l1)} e ${name(l2)} si sovrappongono`);
        }
      }
    });
  });
  return [...new Set(problems)];
}
