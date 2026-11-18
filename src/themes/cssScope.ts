/**
 * Controllo dei fogli di stile di un tema: ogni selettore deve cominciare con
 * la radice del tema, perché i fogli di tutti i temi entrano nella pagina
 * (vedi `contract.ts`). Le regole `@font-face` e `@keyframes` non hanno
 * selettori e sono ammesse; dentro `@media` e `@supports` si controllano le
 * regole interne. Caricato anche da Node: nessun import.
 */

/** Restituisce i selettori che non cominciano con `scope`. */
export function unscopedSelectors(css: string, scope: string): string[] {
  const text = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const bad: string[] = [];
  let depth = 0;
  let start = 0;
  // Pila dei blocchi aperti: true se il blocco è una regola da saltare (font-face, keyframes, dichiarazioni).
  const skip: boolean[] = [];
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '{') {
      const prelude = text.slice(start, i).trim();
      const inside = skip.length > 0 && skip[skip.length - 1];
      if (inside) {
        skip.push(true);
      } else if (prelude.startsWith('@media') || prelude.startsWith('@supports')) {
        skip.push(false);
      } else if (prelude.startsWith('@')) {
        skip.push(true);
      } else {
        for (const selector of prelude.split(',').map((s) => s.trim())) {
          if (!selector.replace(/'/g, '"').startsWith(scope.replace(/'/g, '"'))) bad.push(selector);
        }
        skip.push(true);
      }
      depth++;
      start = i + 1;
    } else if (ch === '}') {
      skip.pop();
      depth--;
      start = i + 1;
    } else if (ch === ';' && (skip.length === 0 || !skip[skip.length - 1])) {
      start = i + 1;
    }
  }
  if (depth !== 0) bad.push('(parentesi graffe non bilanciate)');
  return bad;
}
