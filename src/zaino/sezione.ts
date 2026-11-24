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
 *
 * Da F17 la sezione porta anche l’adesione alla classifica, facoltativa:
 *
 *   { "themes": { … }, "classifica": { "gettone": "…", "at": 1763500000000 } }
 *
 * Fra due adesioni vince la più recente (`unisciAdesioni`).
 */
import { THEME_ID_PATTERN } from '../themes/contract.ts';
import { emptyProgress, mergeProgress, readThemeData, type ThemeProgress } from '../progress/progress.ts';
import { clearAllProgress, readProgress, replaceProgress, storedThemeIds, subscribeLocalChanges } from '../progress/store.ts';
import { clearAllSessions } from '../training/sessionStorage.ts';
import { clearGuide } from '../guide/guide.ts';
import { clearSiteScheme } from '../scheme/siteScheme.ts';
import { storageDi } from './area.ts';
import {
  NESSUNA_ADESIONE,
  iscrivitiAdesioneLocale,
  leggiAdesione,
  sostituisciAdesione,
  svuotaAdesione,
  unisciAdesioni,
  validaAdesione,
  type Adesione,
} from '../classifica/adesione.ts';
import { canonico, registraSezione } from './sezioni.ts';
import type { TipoSezione } from './tipi.ts';

export const NOME_SEZIONE = 'sql-academy';

export interface DatiSqlAcademy {
  themes: Record<string, ThemeProgress>;
  /** L’adesione alla classifica (F17); assente se nessun dispositivo l’ha mai scelta. */
  classifica?: Adesione;
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
  if (!a.classifica && !b.classifica) return { themes };
  return { themes, classifica: unisciAdesioni(a.classifica ?? NESSUNA_ADESIONE, b.classifica ?? NESSUNA_ADESIONE) };
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
  const classifica = validaAdesione((dati as { classifica?: unknown }).classifica);
  return classifica ? { themes, classifica } : { themes };
}

function leggi(): DatiSqlAcademy {
  const themes = Object.fromEntries(storedThemeIds().map((id) => [id, readProgress(id)]));
  const classifica = leggiAdesione();
  return classifica.at > 0 ? { themes, classifica } : { themes };
}

export const sezioneSqlAcademy: TipoSezione<DatiSqlAcademy> = {
  nome: NOME_SEZIONE,
  formato: 1,
  vuota: () => ({ themes: {} }),
  leggi,
  scrivi: (dati) => {
    for (const [id, progress] of Object.entries(dati.themes)) {
      if (canonico(progress) !== canonico(readProgress(id))) replaceProgress(id, progress);
    }
    if (dati.classifica) sostituisciAdesione(dati.classifica);
  },
  unisci: unisciDati,
  iscriviti: (avvisa) => {
    const smetti = [subscribeLocalChanges(avvisa), iscrivitiAdesioneLocale(avvisa)];
    return () => smetti.forEach((f) => f());
  },
  valida: validaDati,
  svuota: () => {
    clearAllProgress();
    // La sessione in corso è legata ai progressi appena tolti: va via con loro.
    clearAllSessions(storageDi());
    // Anche la guida già vista (F16): chi usa il computer dopo la ritrova.
    clearGuide(storageDi());
    // E lo schema scelto per le pagine fuori dai temi.
    clearSiteScheme(storageDi());
    svuotaAdesione();
  },
};

registraSezione(sezioneSqlAcademy);
