/**
 * Coerenza fra lo schema ER di un tema e le tabelle del suo database: ogni
 * entità corrisponde a una tabella oppure è dichiarata senza tabella
 * (`tabella: null`); ogni tabella traduce un’entità oppure è la tabella di
 * un’associazione (`tabella` sull’associazione).
 */

import type { DiagrammaERProps } from './types.ts';

/** Restituisce i problemi trovati, in italiano; elenco vuoto se lo schema è coerente. */
export function checkErCoherence(diagram: DiagrammaERProps, tables: readonly string[]): string[] {
  const problems: string[] = [];
  const existing = new Set(tables);
  const translatedBy = new Map<string, string>();

  const claim = (table: string, element: string) => {
    if (!existing.has(table)) {
      problems.push(`${element} rimanda alla tabella «${table}», che non esiste`);
      return;
    }
    const other = translatedBy.get(table);
    if (other) problems.push(`${element} e ${other} rimandano entrambe alla tabella «${table}»`);
    else translatedBy.set(table, element);
  };

  for (const entita of diagram.entita) {
    const table = entita.tabella === undefined ? entita.id : entita.tabella;
    if (table !== null) claim(table, `l’entità «${entita.id}»`);
  }
  for (const associazione of diagram.associazioni ?? []) {
    if (associazione.tabella !== undefined) claim(associazione.tabella, `l’associazione «${associazione.id}»`);
  }
  for (const table of tables) {
    if (!translatedBy.has(table)) {
      problems.push(
        `la tabella «${table}» non compare nell’ER: dichiarala come tabella di un’entità o di un’associazione`,
      );
    }
  }
  return problems;
}
