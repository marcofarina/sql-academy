/**
 * Routing con hash: `#/` è l’elenco dei temi, `#/<tema>/<sezione>` una sezione
 * di un tema. GitHub Pages non riscrive gli URL, quindi il percorso sta nell’hash.
 *
 * `#/zaino` è la pagina dello zaino (F15), `#/classifica` quella della
 * classifica (`#/classifica/<tema>` per un mondo) e `#/informativa` quella dei dati: nessun tema può usare
 * questi nomi come `id`.
 *
 * Solo l’addestramento ha un elemento in più: `#/<tema>/addestramento/<id>` apre
 * un esercizio, `#/<tema>/addestramento/sessione` la sessione configurabile.
 */

export const SECTIONS = [
  { id: 'sandbox', label: 'Sandbox', icon: 'terminal-window' },
  { id: 'addestramento', label: 'Addestramento', icon: 'bullseye' },
  { id: 'query', label: 'Tutte le query', icon: 'list' },
  { id: 'traccia', label: 'Traccia', icon: 'file-lines' },
  { id: 'er', label: 'Schema ER', icon: 'entity-relationship' },
  { id: 'logico', label: 'Modello logico', icon: 'table' },
] as const;

export type SectionId = (typeof SECTIONS)[number]['id'];

export const DEFAULT_SECTION: SectionId = 'sandbox';

/** L’elemento dell’addestramento che apre la sessione; nessun esercizio può avere questo `id`. */
export const SESSION_ITEM = 'sessione';

export type ThemeRoute = {
  page: 'theme';
  themeId: string;
  section: SectionId;
  /** Solo nell’addestramento: l’`id` di un esercizio oppure `SESSION_ITEM`. */
  item?: string;
};

/** La pagina dello zaino; il suo nome è riservato e nessun tema può usarlo come `id`. */
export const ZAINO_PAGE = 'zaino';

/** Le pagine del portale fuori dai temi: i loro nomi sono riservati (F15, F17). */
export const PORTAL_PAGES = [ZAINO_PAGE, 'classifica', 'informativa'] as const;

export type PortalPage = (typeof PORTAL_PAGES)[number];

function isPortalPage(value: string): value is PortalPage {
  return (PORTAL_PAGES as readonly string[]).includes(value);
}

/** Una pagina del portale; distribuita su ogni nome, così `route.page` restringe il tipo. */
export type PortalRoute = { page: 'zaino' | 'informativa' } | { page: 'classifica'; themeId?: string };

export type Route = { page: 'home' } | PortalRoute | ThemeRoute | { page: 'not-found' };

function isSection(value: string): value is SectionId {
  return SECTIONS.some((section) => section.id === value);
}

/** Interpreta l’hash della pagina. Non controlla che il tema esista: lo fa chi ha il registro. */
export function parseRoute(hash: string): Route {
  let parts: string[];
  try {
    parts = hash.replace(/^#/, '').split('/').filter(Boolean).map(decodeURIComponent);
  } catch {
    return { page: 'not-found' };
  }
  if (parts.length === 0) return { page: 'home' };
  if (parts.length === 1 && isPortalPage(parts[0])) return { page: parts[0] };
  if (parts[0] === 'classifica' && parts.length === 2) return { page: 'classifica', themeId: parts[1] };
  const [themeId, section = DEFAULT_SECTION, ...rest] = parts;
  if (!isSection(section)) return { page: 'not-found' };
  if (rest.length === 0) return { page: 'theme', themeId, section };
  if (rest.length === 1 && section === 'addestramento') return { page: 'theme', themeId, section, item: rest[0] };
  return { page: 'not-found' };
}

/** Scrive l’indirizzo di una pagina o di una sezione del portale. */
export function formatRoute(route: { page: 'home' } | PortalRoute | ThemeRoute): string {
  if (route.page === 'home') return '#/';
  if (route.page === 'classifica' && route.themeId) return `#/classifica/${encodeURIComponent(route.themeId)}`;
  if (route.page !== 'theme') return `#/${route.page}`;
  const base = `#/${encodeURIComponent(route.themeId)}/${route.section}`;
  return route.item === undefined ? base : `${base}/${encodeURIComponent(route.item)}`;
}

/** L’hash canonico della stessa pagina, se diverso da quello dato: `#/star-wars` → `#/star-wars/sandbox`. */
export function canonicalHash(hash: string): string | undefined {
  const route = parseRoute(hash);
  if (route.page === 'not-found') return undefined;
  const canonical = formatRoute(route);
  return canonical === hash || (route.page === 'home' && hash === '') ? undefined : canonical;
}

/** Il ritorno nomina la pagina visitata e ne conserva l’indirizzo completo. */
export function returnLink(hash: string | null, themeTitle: (id: string) => string | undefined) {
  if (hash === null) return { href: '#/', label: 'Tutti i temi' };
  const route = parseRoute(hash);
  if (route.page === 'home') return { href: '#/', label: 'Tutti i temi' };

  let label = 'Torna alla pagina non trovata';
  if (route.page === 'theme') {
    const title = themeTitle(route.themeId);
    if (title) label = `Torna a ${title}`;
  } else if (route.page === 'zaino') {
    label = 'Torna allo zaino';
  } else if (route.page === 'classifica') {
    label = 'Torna alla classifica';
  } else if (route.page === 'informativa') {
    label = 'Torna all’informativa';
  }
  return { href: hash, label };
}
