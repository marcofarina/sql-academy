/**
 * Ricalcolo dei punti di un tema dai progressi inviati dal portale, con le
 * regole di F13 (`src/points/points.ts` del portale) e le tabelle copiate in
 * `esercizi.json` da `npm run classifica:dati`.
 *
 * Il server non si fida dei punti guadagnati: li ricalcola dalla difficoltà.
 * Dei punti spesi non può conoscere l’ordine degli acquisti, perciò accetta la
 * cifra dichiarata solo se è una spesa possibile per quell’esercizio:
 *
 *   spesi = k × prezzo del suggerimento (+ prezzo della soluzione, se vista
 *           prima di risolvere), con 0 ≤ k ≤ suggerimenti aperti.
 *
 * Se l’esercizio non è risolto, o la soluzione è stata vista prima, tutti i
 * suggerimenti sono stati comprati prima della risoluzione: k vale quanti ne
 * sono aperti, o uno di meno se lì è stato speso l’aiuto gratuito. Questi
 * sconti, nel tema, sono al massimo uno, e nessuno se l’aiuto gratuito non è
 * stato usato. Un esercizio risolto senza soluzione può avere k minore: i
 * suggerimenti aperti dopo la risoluzione sono gratuiti.
 *
 * Il formato dei progressi è quello del portale (`ThemeProgress`), di cui il
 * server legge solo i campi qui sotto; gli altri si ignorano. Un tipo di
 * attività in più (le CTF) sarà un’altra chiave accanto a `exercises`.
 */

import dati from './esercizi.json';

type Difficolta = 'facile' | 'medio' | 'difficile';

interface Dati {
  reward: Record<Difficolta, number>;
  hintCost: Record<Difficolta, number>;
  solutionCost: Record<Difficolta, number>;
  themes: Record<string, Record<string, { difficulty: Difficolta; hints: number }>>;
}

const DATI = dati as Dati;

export const temi = (): string[] => Object.keys(DATI.themes);
export const temaEsiste = (id: string): boolean => Object.hasOwn(DATI.themes, id);

export type Esito = { ok: true; punti: number } | { ok: false; motivo: string };

const oggetto = (x: unknown): x is Record<string, unknown> =>
  typeof x === 'object' && x !== null && !Array.isArray(x);
const intero = (x: unknown): x is number => Number.isSafeInteger(x) && (x as number) >= 0;

/** I punti del tema `tema` dai progressi `progressi`, o il motivo per cui sono impossibili. */
export function ricalcola(tema: string, progressi: unknown): Esito {
  const esercizi = DATI.themes[tema];
  if (!esercizi) return { ok: false, motivo: `tema sconosciuto: ${tema}` };
  if (!oggetto(progressi) || !oggetto(progressi.exercises))
    return { ok: false, motivo: `${tema}: manca exercises` };
  const aiutoGratuito = progressi.freeHintUsed === true;

  let guadagnati = 0;
  let spesi = 0;
  let sconti = 0;
  for (const [id, stato] of Object.entries(progressi.exercises)) {
    const es = Object.hasOwn(esercizi, id) ? esercizi[id] : undefined;
    if (!es) return { ok: false, motivo: `${tema}: esercizio sconosciuto ${id}` };
    if (!oggetto(stato)) return { ok: false, motivo: `${tema}/${id}: stato non valido` };
    const { solved, hintsRevealed: aperti, solutionBeforeSolve: primaSoluzione, pointsSpent } = stato;
    if (typeof solved !== 'boolean' || typeof primaSoluzione !== 'boolean' || !intero(aperti) || !intero(pointsSpent))
      return { ok: false, motivo: `${tema}/${id}: campi mancanti o non validi` };
    if (aperti > es.hints) return { ok: false, motivo: `${tema}/${id}: suggerimenti oltre il numero` };
    if (primaSoluzione && aperti < es.hints)
      return { ok: false, motivo: `${tema}/${id}: soluzione senza tutti i suggerimenti` };

    const prezzo = DATI.hintCost[es.difficulty];
    const resto = pointsSpent - (primaSoluzione ? DATI.solutionCost[es.difficulty] : 0);
    const k = resto / prezzo;
    if (resto < 0 || !Number.isInteger(k) || k > aperti)
      return { ok: false, motivo: `${tema}/${id}: spesa impossibile` };
    if (!solved || primaSoluzione) {
      if (k < aperti - 1) return { ok: false, motivo: `${tema}/${id}: spesa impossibile` };
      if (k === aperti - 1) sconti += 1;
    }

    if (solved && !primaSoluzione) guadagnati += DATI.reward[es.difficulty];
    spesi += pointsSpent;
  }
  if (sconti > (aiutoGratuito ? 1 : 0)) return { ok: false, motivo: `${tema}: più di un aiuto gratuito` };
  if (guadagnati < spesi) return { ok: false, motivo: `${tema}: saldo negativo` };
  return { ok: true, punti: guadagnati - spesi };
}
