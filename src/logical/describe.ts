/**
 * Il modello logico a parole, per chi usa un lettore di schermo e per chi lo
 * legge su uno schermo stretto: una frase per tabella, dalle stesse tabelle
 * da cui si disegna il diagramma.
 */
import type { ColumnInfo, TableInfo } from '../sandbox/session.ts';

function columnText(column: ColumnInfo): string {
  const notes: string[] = [];
  if (column.primaryKey) notes.push('chiave primaria');
  if (column.foreignKey) notes.push(`chiave esterna verso ${column.foreignKey.table}.${column.foreignKey.column}`);
  return notes.length > 0 ? `${column.name} (${notes.join(', ')})` : column.name;
}

export function describeTables(tables: readonly TableInfo[]): string[] {
  return tables.map((table) => `Tabella ${table.name}: ${table.columns.map(columnText).join(', ')}.`);
}
