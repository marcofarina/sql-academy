/** Spiegazioni e indizi per i messaggi più comuni di SQLite. */

import type { TableInfo } from './session.ts';

interface Explanation {
  text: string;
  hint: string;
}

const list = new Intl.ListFormat('it', { type: 'conjunction' });

function quote(name: string): string {
  return `«${name}»`;
}

/** Distanza di Levenshtein, con una riga della matrice per volta. */
function editDistance(name: string, candidate: string): number {
  let previous = Array.from({ length: candidate.length + 1 }, (_, index) => index);
  for (let i = 0; i < name.length; i++) {
    const current = [i + 1];
    for (let j = 0; j < candidate.length; j++) {
      const substitution = name[i] === candidate[j] ? 0 : 1;
      current.push(Math.min(previous[j + 1] + 1, current[j] + 1, previous[j] + substitution));
    }
    previous = current;
  }
  return previous[candidate.length];
}

/** Fino a tre nomi simili, a partire da quelli con meno modifiche. */
function similarNames(name: string, candidates: Iterable<string>): string[] {
  const normalized = name.toLowerCase();
  const limit = name.length < 5 ? 1 : 2;
  const nearby: { name: string; distance: number }[] = [];
  for (const candidate of candidates) {
    if (Math.abs(normalized.length - candidate.length) > limit) continue;
    const distance = editDistance(normalized, candidate.toLowerCase());
    if (distance <= limit) nearby.push({ name: candidate, distance });
  }
  return nearby.sort((a, b) => a.distance - b.distance).slice(0, 3).map((item) => item.name);
}

function columnHint(reference: string, tables: readonly TableInfo[]): string {
  const parts = reference.split('.');
  const column = parts.at(-1) ?? reference;
  const qualifier = parts.at(-2)?.toLowerCase();
  const table = tables.find((candidate) => candidate.name.toLowerCase() === qualifier);
  const owners = new Map<string, string[]>();
  for (const owner of table ? [table] : tables) {
    for (const candidate of owner.columns) {
      const names = owners.get(candidate.name) ?? [];
      names.push(owner.name);
      owners.set(candidate.name, names);
    }
  }

  const matches = similarNames(column, owners.keys());
  const check = 'Controlla le colonne delle tabelle che usi.';
  if (matches.length === 0) return `Apri lo schema. ${check}`;
  const suggestions = matches.map((name) => `${quote(name)} in ${list.format(owners.get(name)!.map(quote))}`);
  return `Nello schema trovi ${list.format(suggestions)}. ${check}`;
}

function tableHint(reference: string, tables: readonly TableInfo[]): string {
  const name = reference.split('.').at(-1) ?? reference;
  const matches = similarNames(name, tables.map((table) => table.name));
  if (matches.length === 0 || matches[0].toLowerCase() === name.toLowerCase()) {
    return 'Confronta il nome con l’elenco delle tabelle nello schema.';
  }
  return matches.length === 1
    ? `Nello schema trovi la tabella ${quote(matches[0])}.`
    : `Nello schema trovi le tabelle ${list.format(matches.map(quote))}.`;
}

/** Traduce un messaggio di SQLite e propone un controllo a partire dallo schema del tema. */
export function explainSqlError(message: string, tables: readonly TableInfo[]): Explanation {
  const column = /^no such column: (.+)$/s.exec(message)?.[1];
  if (column) return { text: `SQLite non trova la colonna ${quote(column)} nella query.`, hint: columnHint(column, tables) };

  const table = /^no such table: (.+)$/s.exec(message)?.[1];
  if (table) return { text: `SQLite non trova la tabella ${quote(table)}.`, hint: tableHint(table, tables) };

  const ambiguous = /^ambiguous column name: (.+)$/s.exec(message)?.[1];
  if (ambiguous) {
    return {
      text: `Più tabelle della query hanno una colonna ${quote(ambiguous)}. Indica a quale tabella ti riferisci.`,
      hint: 'Scrivi il nome o l’alias della tabella seguito da un punto e dal nome della colonna.',
    };
  }

  const token = /^near "(.+)": syntax error$/s.exec(message)?.[1];
  if (token) {
    return {
      text: `SQLite ha trovato un errore di sintassi vicino a ${quote(token)}.`,
      hint: 'Rileggi la query a partire dalle parole che precedono quel punto.',
    };
  }
  if (message === 'incomplete input') {
    return {
      text: 'La query è incompleta.',
      hint: 'Controlla l’ultima clausola e verifica di aver chiuso parentesi e virgolette.',
    };
  }

  const aggregate = /^misuse of aggregate function (.+)$/s.exec(message)?.[1];
  if (aggregate) {
    return {
      text: `In quel punto della query SQLite non consente la funzione di aggregazione ${quote(aggregate)}.`,
      hint: 'Se l’hai scritta in WHERE, controlla se il filtro riguarda le singole righe o il risultato dell’aggregazione.',
    };
  }

  if (/^(?:\d+ values for \d+ columns|table .+ has \d+ columns but \d+ values were supplied)$/s.test(message)) {
    return {
      text: 'INSERT ha ricevuto un numero di valori diverso dal numero di colonne da riempire.',
      hint: 'Fai corrispondere ogni valore a una colonna, nello stesso ordine. Se vuoi riempire solo alcune colonne, elencale dopo il nome della tabella.',
    };
  }

  if (message === 'FOREIGN KEY constraint failed') {
    return {
      text: 'La modifica viola una chiave esterna.',
      hint: 'Se inserisci o aggiorni un riferimento, verifica che la riga a cui rimanda esista. Se cancelli una riga, controlla se altre righe la usano come riferimento.',
    };
  }

  const required = /^NOT NULL constraint failed: (.+)$/s.exec(message)?.[1];
  if (required) {
    return {
      text: `La colonna ${quote(required)} richiede un valore diverso da NULL.`,
      hint: 'Nella INSERT o UPDATE, controlla il valore assegnato a quella colonna.',
    };
  }

  const unique = /^UNIQUE constraint failed: (.+)$/s.exec(message)?.[1];
  if (unique) {
    const columns = unique.split(', ');
    return columns.length === 1
      ? {
          text: `Il valore di ${quote(unique)} deve essere univoco.`,
          hint: 'Controlla se esiste già una riga con quel valore.',
        }
      : {
          text: `La combinazione dei valori di ${list.format(columns.map(quote))} deve essere univoca.`,
          hint: 'Controlla se esiste già una riga con gli stessi valori in quelle colonne.',
        };
  }

  return {
    text: 'SQLite ha interrotto l’esecuzione della query.',
    hint: 'Se hai eseguito più istruzioni insieme, provale una alla volta per individuare quella che causa l’errore.',
  };
}
