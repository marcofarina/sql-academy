/**
 * Routing con hash: `#/` è l’elenco dei temi, `#/<tema>/<sezione>` una sezione
 * di un tema. GitHub Pages non riscrive gli URL, quindi il percorso sta nell’hash.
 */

export const SECTIONS = [
  { id: 'sandbox', label: 'Sandbox', icon: 'terminal-window' },
  { id: 'addestramento', label: 'Addestramento', icon: 'bullseye' },
  { id: 'query', label: 'Tutte le query', icon: 'list' },
  { id: 'analisi', label: 'Analisi', icon: 'file-lines' },
  { id: 'er', label: 'Schema ER', icon: 'entity-relationship' },
  { id: 'logico', label: 'Modello logico', icon: 'table' },
] as const;

export type SectionId = (typeof SECTIONS)[number]['id'];

export const DEFAULT_SECTION: SectionId = 'sandbox';

export type Route =
  | { page: 'home' }
  | { page: 'theme'; themeId: string; section: SectionId }
  | { page: 'not-found' };

function isSection(value: string): value is SectionId {
  return SECTIONS.some((section) => section.id === value);
}

/** Interpreta l’hash della pagina. Non controlla che il tema esista: lo fa chi ha il registro. */
export function parseRoute(hash: string): Route {
  const parts = hash.replace(/^#/, '').split('/').filter(Boolean).map(decodeURIComponent);
  if (parts.length === 0) return { page: 'home' };
  const [themeId, section = DEFAULT_SECTION, ...rest] = parts;
  if (rest.length > 0 || !isSection(section)) return { page: 'not-found' };
  return { page: 'theme', themeId, section };
}

export function formatRoute(route: { page: 'home' } | { page: 'theme'; themeId: string; section: SectionId }): string {
  if (route.page === 'home') return '#/';
  return `#/${encodeURIComponent(route.themeId)}/${route.section}`;
}

/** L’hash canonico della stessa pagina, se diverso da quello dato: `#/star-wars` → `#/star-wars/sandbox`. */
export function canonicalHash(hash: string): string | undefined {
  const route = parseRoute(hash);
  if (route.page === 'not-found') return undefined;
  const canonical = formatRoute(route);
  return canonical === hash || (route.page === 'home' && hash === '') ? undefined : canonical;
}
