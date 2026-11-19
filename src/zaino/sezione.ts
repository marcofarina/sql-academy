/**
 * I progressi di SQL Academy come sezione `sql-academy` dello zaino (F15). Si
 * registra all’import: lo importa `src/main.tsx` prima di avviare lo zaino.
 *
 * Forma dei dati della sezione, formato 1: i progressi di ogni tema, come in
 * `src/progress/progress.ts` ma senza `version` (la porta il formato):
 *
 *   { "themes": { "star-wars": { "epoch": 0, "freeHintUsed": true, "exercises": { … } } } }
 *
 * L’unione è `mergeProgress` tema per tema; i temi che questa versione del
 * portale non conosce si conservano come gli altri.
 */
import { THEME_ID_PATTERN } from '../themes/contract.ts';
import { emptyProgress, mergeProgress, readThemeData, type ThemeProgress } from '../progress/progress.ts';
import { clearAllProgress, readProgress, replaceProgress, storedThemeIds, subscribeLocalChanges } from '../progress/store.ts';
import { canonico, registraSezione } from './sezioni.ts';
import type { TipoSezione } from './tipi.ts';

export const NOME_SEZIONE = 'sql-academy';

export interface DatiSqlAcademy {
  themes: Record<string, ThemeProgress>;
}

/** Pura, commutativa, idempotente: i temi delle due parti, uniti uno per uno. */
export function unisciDati(a: DatiSqlAcademy, b: DatiSqlAcademy): DatiSqlAcademy {
  const ids = [...new Set([...Object.keys(a.themes), ...Object.keys(b.themes)])].sort();
  const themes: Record<string, ThemeProgress> = {};
  for (const id of ids) {
    const x = a.themes[id] ?? emptyProgress();
    const y = b.themes[id] ?? emptyProgress();
    themes[id] = mergeProgress(x, y);
  }
  return { themes };
}

/** Dati arrivati dallo zaino: null se non hanno la forma attesa; temi e voci malformati si scartano. */
export function validaDati(dati: unknown): DatiSqlAcademy | null {
  if (typeof dati !== 'object' || dati === null) return null;
  const grezzi = (dati as { themes?: unknown }).themes;
  if (typeof grezzi !== 'object' || grezzi === null || Array.isArray(grezzi)) return null;
  const themes: Record<string, ThemeProgress> = {};
  for (const [id, valore] of Object.entries(grezzi)) {
    const progress = THEME_ID_PATTERN.test(id) ? readThemeData(valore) : null;
    if (progress) themes[id] = progress;
  }
  return { themes };
}

export const sezioneSqlAcademy: TipoSezione<DatiSqlAcademy> = {
  nome: NOME_SEZIONE,
  formato: 1,
  vuota: () => ({ themes: {} }),
  leggi: () => ({ themes: Object.fromEntries(storedThemeIds().map((id) => [id, readProgress(id)])) }),
  scrivi: (dati) => {
    for (const [id, progress] of Object.entries(dati.themes)) {
      if (canonico(progress) !== canonico(readProgress(id))) replaceProgress(id, progress);
    }
  },
  unisci: unisciDati,
  iscriviti: subscribeLocalChanges,
  valida: validaDati,
  svuota: clearAllProgress,
};

registraSezione(sezioneSqlAcademy);
