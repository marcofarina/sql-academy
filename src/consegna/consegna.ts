/**
 * Formato del link di una consegna (F14 del piano `portale-v2`). Funzioni
 * pure, senza React né browser.
 *
 * Il docente sceglie alcuni esercizi di un tema; il link porta con sé la
 * consegna, senza server:
 *
 *   #/lotr/addestramento/consegna/1.3.17.42.101/Join%20e%20gruppi
 *
 * Il codice `1.3.17.42.101` comincia con la versione del formato (1), seguita
 * dagli esercizi nell’ordine scelto dal docente, separati da punti. Un id
 * `ex-NNN` si scrive con il solo numero (`ex-003` → `3`); un id di altra forma
 * si scrive per intero (gli id non contengono punti: `src/exercises/check.ts`).
 * Un id di sole cifre non entra in una consegna: si leggerebbe come `ex-NNN`.
 * Il titolo, facoltativo, è l’ultimo elemento dell’indirizzo.
 */

/** La versione del formato scritta oggi. */
export const CONSEGNA_VERSION = 1;

/** Esercizi al massimo in una consegna: il link deve restare corto. */
export const CONSEGNA_MAX = 30;

/** Lunghezza massima del titolo. */
export const TITOLO_MAX = 80;

const NUMBERED = /^ex-(\d{3,})$/;
const NUMBER = /^\d{1,6}$/;
// Un id scritto per intero ha almeno una lettera: un elemento di sole cifre è sempre un numero.
const LITERAL = /^(?=[^.]*[a-z])[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** La consegna come la porta l’indirizzo: il codice e, se c’è, il titolo. */
export interface ConsegnaLink {
  code: string;
  title?: string;
}

/** La consegna letta rispetto agli esercizi del tema. */
export type ConsegnaLetta =
  | {
      ok: true;
      /** Gli esercizi che il tema ha, nell’ordine del link, senza ripetizioni. */
      ids: string[];
      /** Quanti esercizi del link il tema non ha. */
      missing: number;
      title?: string;
    }
  /** Codice illeggibile, versione sconosciuta o nessun esercizio del tema. */
  | { ok: false; reason: 'illeggibile' | 'vuota' };

/** Un id come elemento del codice: `ex-003` → `3`. */
function token(id: string): string {
  const match = NUMBERED.exec(id);
  if (match && `ex-${String(Number(match[1])).padStart(3, '0')}` === id) return String(Number(match[1]));
  return id;
}

/** Un elemento del codice come id: `3` → `ex-003`; `undefined` se non è un elemento valido. */
function idOf(part: string): string | undefined {
  if (NUMBER.test(part)) return `ex-${String(Number(part)).padStart(3, '0')}`;
  return LITERAL.test(part) ? part : undefined;
}

/** Il titolo pulito: spazi compattati, al massimo `TITOLO_MAX` caratteri; `undefined` se vuoto. */
export function cleanTitle(title: string | undefined): string | undefined {
  const clean = (title ?? '').replace(/\s+/g, ' ').trim().slice(0, TITOLO_MAX).trim();
  return clean === '' ? undefined : clean;
}

/** Il codice della consegna per gli esercizi `ids`, nell’ordine dato. */
export function encodeConsegna(ids: readonly string[]): string {
  return [String(CONSEGNA_VERSION), ...ids.map(token)].join('.');
}

/**
 * Gli id scritti nel codice, nell’ordine del link e senza ripetizioni;
 * `undefined` se il codice è illeggibile, di un’altra versione o troppo lungo.
 * Un punto finale non conta: resta attaccato al link incollato a fine frase.
 */
export function decodeConsegna(code: string): string[] | undefined {
  const [version, ...parts] = code.replace(/\.$/, '').split('.');
  if (version !== String(CONSEGNA_VERSION) || parts.length === 0 || parts.length > CONSEGNA_MAX) return undefined;
  const ids: string[] = [];
  for (const part of parts) {
    const id = idOf(part);
    if (id === undefined) return undefined;
    if (!ids.includes(id)) ids.push(id);
  }
  return ids;
}

/** Legge la consegna del link rispetto agli esercizi del tema: scarta quelli che il tema non ha. */
export function readConsegna(link: ConsegnaLink, themeIds: readonly string[]): ConsegnaLetta {
  const ids = decodeConsegna(link.code);
  if (!ids) return { ok: false, reason: 'illeggibile' };
  const found = ids.filter((id) => themeIds.includes(id));
  if (found.length === 0) return { ok: false, reason: 'vuota' };
  const title = cleanTitle(link.title);
  return { ok: true, ids: found, missing: ids.length - found.length, ...(title ? { title } : {}) };
}
