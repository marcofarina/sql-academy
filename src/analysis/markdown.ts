/**
 * Markdown minimo per `analisi.md`: titoli (`#`), paragrafi, elenchi puntati
 * (`- `), corsivo (`*…*`) e grassetto (`**…**`). Basta per un testo di dominio;
 * il resto della sintassi resta testo così com’è.
 */

export type Inline = { kind: 'text' | 'em' | 'strong'; text: string };

export type Block =
  | { kind: 'heading'; level: number; content: Inline[] }
  | { kind: 'paragraph'; content: Inline[] }
  | { kind: 'list'; items: Inline[][] };

/** Divide una riga di testo in pezzi semplici, in corsivo o in grassetto. */
export function parseInline(text: string): Inline[] {
  const result: Inline[] = [];
  const pattern = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    if (match.index > last) result.push({ kind: 'text', text: text.slice(last, match.index) });
    result.push(match[1] !== undefined ? { kind: 'strong', text: match[1] } : { kind: 'em', text: match[2] });
    last = match.index + match[0].length;
  }
  if (last < text.length) result.push({ kind: 'text', text: text.slice(last) });
  return result;
}

/** Divide il testo in blocchi separati da righe vuote. */
export function parseMarkdown(source: string): Block[] {
  const blocks: Block[] = [];
  for (const chunk of source.replace(/\r\n/g, '\n').split(/\n\s*\n/)) {
    const lines = chunk.split('\n').map((line) => line.trim()).filter(Boolean);
    if (lines.length === 0) continue;
    const heading = /^(#{1,6})\s+(.*)$/.exec(lines[0]);
    if (heading && lines.length === 1) {
      blocks.push({ kind: 'heading', level: heading[1].length, content: parseInline(heading[2]) });
    } else if (lines.every((line) => line.startsWith('- '))) {
      blocks.push({ kind: 'list', items: lines.map((line) => parseInline(line.slice(2))) });
    } else {
      blocks.push({ kind: 'paragraph', content: parseInline(lines.join(' ')) });
    }
  }
  return blocks;
}
