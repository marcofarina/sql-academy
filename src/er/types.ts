/**
 * Tipi del diagramma ER, copiati dal componente <DiagrammaER> del libro
 * (`python-doesnt-byte/src/components/DiagrammaER/types.ts`) con i nomi dei
 * campi in italiano, così un diagramma passa dal libro al portale senza
 * riscriverlo. Aggiunte del portale: `tabella` su entità e associazioni e il
 * tipo `ErDiagram` del file `themes/<id>/er.ts`.
 */
export type Lato = 'sopra' | 'sotto' | 'sinistra' | 'destra';

export type Attributo =
  | string
  | {
      nome: string;
      /** Default: `latoAttributi` del proprietario. */
      lato?: Lato;
      /** Identificatore semplice: cerchio pieno. */
      identificatore?: boolean;
      /** `(0,1)` opzionale; `(1,N)` o `(0,N)` multivalore; `(1,1)` non si scrive. */
      card?: string;
      /** Attributo composto: nomi dei componenti. */
      componenti?: string[];
    };

export interface Entita {
  id: string;
  /** Default: `id`. */
  etichetta?: string;
  col: number;
  riga: number;
  attributi?: Attributo[];
  /** Default: `'sopra'`. */
  latoAttributi?: Lato;
  /** Identificatore composto: nomi di almeno 2 attributi. */
  identificatore?: string[];
  /**
   * Solo nel portale: la tabella che traduce l’entità. Default: `id`.
   * `null` se l’entità non ha una tabella propria.
   */
  tabella?: string | null;
}

export interface Partecipazione {
  entita: string;
  /**
   * Cardinalità in notazione (min,max), es. `(1,1)`, `(0,N)` o `(2,2)`.
   * Facoltativa: senza, la linea non ha etichetta (lezioni che vengono prima
   * delle cardinalità).
   */
  card?: string;
}

export interface Associazione {
  id: string;
  etichetta?: string;
  col: number;
  riga: number;
  tra: [Partecipazione, Partecipazione];
  /** Associazione con attributi propri (molti a molti). */
  attributi?: Attributo[];
  /** Default: perpendicolare alle linee. */
  latoAttributi?: Lato;
  /**
   * Solo nel portale: la tabella di associazione che la traduce, se ne ha una
   * (di norma un’associazione molti a molti). Senza, l’associazione è tradotta
   * da una chiave esterna.
   */
  tabella?: string;
}

export type Copertura = '(t,e)' | '(t,o)' | '(p,e)' | '(p,o)';

export interface Generalizzazione {
  padre: string;
  figli: string[];
  copertura: Copertura;
}

export interface DiagrammaERProps {
  /** Obbligatorio: <title> dell'SVG. */
  titolo: string;
  /** <desc> dell'SVG. Nel portale, se manca, la scrive `describe.ts` dalle entità e dalle associazioni. */
  descrizione?: string;
  entita: Entita[];
  associazioni?: Associazione[];
  generalizzazioni?: Generalizzazione[];
  /** Larghezza e altezza della cella della griglia. Default `[210, 170]`. */
  cella?: [number, number];
}

/**
 * Il contenuto di `themes/<id>/er.ts`, esportato come `default`: lo schema ER
 * del tema, nella stessa forma delle props del componente del libro.
 * Entità e associazioni stanno su una griglia di celle (`col`, `riga`, anche
 * con valori decimali); `npm run check:themes` controlla che il disegno sia
 * valido e coerente con le tabelle del tema.
 */
export type ErDiagram = DiagrammaERProps;

/* ── Output del layout (indipendente da React e dai CSS) ─────────────── */

export type TipoForma =
  | 'entita'
  | 'associazione'
  | 'pallino'
  | 'pallinoPieno'
  | 'ellisse'
  | 'freccia'
  | 'linea';

export interface Forma {
  d: string;
  /** Path di riempimento (rough.js) o di tratto. */
  riempimento: boolean;
  tipo: TipoForma;
}

export type TipoTesto = 'entita' | 'assoc' | 'attr' | 'card' | 'cardAttr';

export interface Testo {
  x: number;
  y: number;
  testo: string;
  size: number;
  tipo: TipoTesto;
  anchor: 'start' | 'middle' | 'end';
}

export interface Disegno {
  forme: Forma[];
  testi: Testo[];
  vb: { x: number; y: number; l: number; a: number };
}
