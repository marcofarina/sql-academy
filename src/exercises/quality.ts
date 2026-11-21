/**
 * Controlli di qualità degli esercizi che non richiedono il database: parole
 * chiave dichiarate e usate, consegne al plurale. Li usa `checkTheme`
 * (`check.ts`), che aggiunge quelli sul risultato delle query attese.
 */

/** Toglie commenti e stringhe: le parole chiave si cercano solo nel codice. */
function bareSql(sql: string): string {
  return sql.replace(/--[^\n]*|\/\*[\s\S]*?(?:\*\/|$)|'(?:[^']|'')*'/g, ' ');
}

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Espressione che trova una parola chiave dichiarata: spazi qualunque fra le parole, confini di parola ai bordi. */
function keywordPattern(keyword: string): RegExp {
  const body = keyword.trim().split(/\s+/).map(escape).join('\\s+');
  const start = /^\w/.test(keyword) ? '\\b' : '';
  const end = /\w$/.test(keyword) ? '\\b' : '';
  return new RegExp(`${start}${body}${end}`, 'i');
}

/** Parole chiave dichiarate che non compaiono nella query attesa. */
export function missingKeywords(keywords: string[], sql: string): string[] {
  const bare = bareSql(sql);
  return keywords.filter((keyword) => !keywordPattern(keyword).test(bare));
}

/**
 * Clausole e funzioni che, se usate, vanno dichiarate fra le parole chiave.
 * Le forme negate e `LEFT JOIN` sono distinte da quelle semplici: chi usa
 * solo `NOT IN` non deve dichiarare anche `IN`.
 */
const DETECTED: [keyword: string, pattern: RegExp][] = [
  ['WHERE', /\bWHERE\b/i],
  ['LEFT JOIN', /\bLEFT\s+(?:OUTER\s+)?JOIN\b/i],
  ['JOIN', /(?<!\bLEFT\s+(?:OUTER\s+)?)\bJOIN\b/i],
  ['GROUP BY', /\bGROUP\s+BY\b/i],
  ['HAVING', /\bHAVING\b/i],
  ['ORDER BY', /\bORDER\s+BY\b/i],
  ['LIMIT', /\bLIMIT\b/i],
  ['OFFSET', /\bOFFSET\b/i],
  ['DISTINCT', /\bDISTINCT\b/i],
  ['UNION', /\bUNION\b/i],
  ['WITH', /^\s*WITH\b/i],
  ['EXISTS', /(?<!\bNOT\s+)\bEXISTS\b/i],
  ['NOT EXISTS', /\bNOT\s+EXISTS\b/i],
  ['IN', /(?<!\bNOT\s+)\bIN\s*\(/i],
  ['NOT IN', /\bNOT\s+IN\b/i],
  ['LIKE', /(?<!\bNOT\s+)\bLIKE\b/i],
  ['NOT LIKE', /\bNOT\s+LIKE\b/i],
  ['IS NULL', /\bIS\s+NULL\b/i],
  ['IS NOT NULL', /\bIS\s+NOT\s+NULL\b/i],
  ['BETWEEN', /\bBETWEEN\b/i],
  ['CASE', /\bCASE\b/i],
  ['COUNT', /\bCOUNT\s*\(/i],
  ['SUM', /\bSUM\s*\(/i],
  ['AVG', /\bAVG\s*\(/i],
  ['MIN', /\bMIN\s*\(/i],
  ['MAX', /\bMAX\s*\(/i],
];

/** Clausole e funzioni usate nella query attesa ma assenti dalle parole chiave dichiarate. */
export function undeclaredKeywords(keywords: string[], sql: string): string[] {
  const bare = bareSql(sql);
  const declared = new Set(keywords.map((keyword) => keyword.trim().toUpperCase()));
  return DETECTED.filter(([keyword, pattern]) => !declared.has(keyword) && pattern.test(bare)).map(
    ([keyword]) => keyword,
  );
}

/**
 * Indizi di una consegna che chiede più righe: «tutti», «quali», «elenca», o
 * il verbo iniziale seguito da un articolo plurale («Mostra i…», «Trova le…»).
 * È un’euristica: produce falsi positivi, per questo genera solo avvisi.
 */
const PLURAL = /\b(?:tutti|tutte|quali|elenca)\b|^\s*\p{L}+\s+(?:i|gli|le)\s/iu;

export function asksForMany(prompt: string): boolean {
  return PLURAL.test(prompt);
}

/** Copre commenti, stringhe e nomi fra virgolette con spazi, senza cambiare le posizioni. */
function maskSql(sql: string): string {
  return sql.replace(
    /--[^\n]*|\/\*[\s\S]*?(?:\*\/|$)|'(?:[^']|'')*'|"(?:[^"]|"")*"|`(?:[^`]|``)*`|\[[^\]]*\]/g,
    (match) => ' '.repeat(match.length),
  );
}

/**
 * Due varianti della query con l’`ORDER BY` esterno completato dalle colonne
 * del risultato, per posizione: una volta crescenti, una volta decrescenti.
 * Se danno risultati diversi, l’ordinamento originale lascia righe a pari
 * merito che si distinguono nel risultato: l’ordine richiesto, o le righe
 * scelte da `LIMIT`, non sono unici. `null` se la query non ha un `ORDER BY`
 * esterno.
 */
export function tieBreakVariants(sql: string, width: number): [string, string] | null {
  const masked = maskSql(sql);
  // Inizio dell’ultima istruzione e parole chiave fuori da ogni parentesi.
  let depth = 0;
  let start = 0;
  const outer: { index: number; word: string }[] = [];
  const words = /\(|\)|;|\border\s+by\b|\blimit\b/gi;
  for (const match of masked.matchAll(words)) {
    const token = match[0].toLowerCase();
    if (token === '(') depth++;
    else if (token === ')') depth = Math.max(0, depth - 1);
    else if (depth > 0) continue;
    else if (token === ';') {
      if (masked.slice(match.index + 1).trim() !== '') {
        start = match.index + 1;
        outer.length = 0;
      }
    } else outer.push({ index: match.index, word: token.startsWith('order') ? 'order' : 'limit' });
  }
  const orderAt = outer.findLastIndex((token) => token.word === 'order');
  if (orderAt < 0 || outer[orderAt].index < start) return null;
  const limit = outer.slice(orderAt + 1).find((token) => token.word === 'limit');
  const end = limit ? limit.index : masked.trimEnd().replace(/;\s*$/, '').length;

  const positions = [...Array(width).keys()].map((i) => i + 1);
  const insert = (direction: string) =>
    `${sql.slice(0, end).trimEnd()}, ${positions.map((p) => `${p} ${direction}`).join(', ')} ${sql.slice(end)}`;
  return [insert('ASC'), insert('DESC')];
}
