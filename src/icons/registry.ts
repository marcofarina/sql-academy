/**
 * Icone comuni del portale: i file SVG di RB Icons in `src/assets/icons/`,
 * scoperti al build e incorporati come testo, così ereditano il colore del testo.
 *
 * Per aggiungere un’icona comune basta copiarne il file nella cartella (sempre
 * passando dalla skill `icone-rb`). Un tema porta le proprie icone in
 * `themes/<id>/icone/` e le passa al componente `Icon` con la prop `svg`.
 */

/** Dal percorso del file al nome dell’icona: `…/circle-play.svg` → `circle-play`. */
export function iconName(path: string): string {
  const match = /([^/]+)\.svg$/.exec(path);
  if (!match) throw new Error(`Percorso di icona non riconosciuto: ${path}`);
  return match[1];
}

function byName(modules: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(modules).map(([path, svg]) => [iconName(path), svg]));
}

export const commonIcons: Record<string, string> = byName(
  import.meta.glob<string>('../assets/icons/*.svg', { query: '?raw', import: 'default', eager: true }),
);

/**
 * Prepara il testo di un SVG per l’inserimento nella pagina: senza `title`
 * l’icona è decorativa (`aria-hidden`), con `title` ha `role="img"` e il titolo.
 */
export function prepareSvg(svg: string, title?: string): string {
  const open = /<svg\b[^>]*>/.exec(svg);
  if (!open) throw new Error('Il file non contiene un elemento <svg>');
  const attributes = title
    ? ' class="icon" role="img" focusable="false"'
    : ' class="icon" aria-hidden="true" focusable="false"';
  const tag = open[0].replace(/^<svg\b/, `<svg${attributes}`);
  const titleTag = title ? `<title>${escapeXml(title)}</title>` : '';
  return svg.slice(0, open.index) + tag + titleTag + svg.slice(open.index + open[0].length);
}

function escapeXml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
