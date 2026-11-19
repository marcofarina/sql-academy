/**
 * Testi dell’interfaccia sui punti (F14): costi sui pulsanti d’aiuto, motivi
 * di un pulsante disattivato, premio di un esercizio. Funzioni pure: i conti
 * restano in `points.ts`, qui si leggono soltanto le offerte e i progressi.
 */

import type { ExerciseProgress } from '../progress/progress.ts';
import { REWARD, type Offer, type PointsExercise } from './points.ts';

/** «1 punto», «5 punti». */
export function pointsLabel(n: number): string {
  return `${n} ${n === 1 ? 'punto' : 'punti'}`;
}

/** Il prezzo scritto sul pulsante di un aiuto: «gratis» oppure «5 punti». Vuoto se non c’è nulla da comprare. */
export function costLabel(offer: Offer): string {
  if (offer.status === 'unavailable') return '';
  if (offer.status === 'available' && offer.waiver !== null) return 'gratis';
  return pointsLabel(offer.cost);
}

/** Perché il pulsante di un aiuto è disattivato, in una frase; `undefined` se si può usare. */
export function disabledReason(offer: Offer, balance: number): string | undefined {
  if (offer.status === 'locked') return 'La soluzione si apre dopo l’ultimo suggerimento.';
  if (offer.status === 'available' && offer.missing > 0) {
    return `Hai ${pointsLabel(balance)}: te ne ${offer.missing === 1 ? 'manca 1' : `mancano ${offer.missing}`}.`;
  }
  return undefined;
}

/**
 * Il premio di un esercizio visto dal percorso e dal catalogo:
 * - `pending`: ancora da incassare;
 * - `earned`: incassato alla prima risoluzione;
 * - `lost`: niente premio, perché la soluzione è stata vista prima di risolverlo.
 */
export type RewardStatus = 'pending' | 'earned' | 'lost';

export function rewardStatus(state: ExerciseProgress): RewardStatus {
  if (state.pointsEarned > 0) return 'earned';
  if (state.solutionBeforeSolve || state.solved) return 'lost';
  return 'pending';
}

/** Il premio scritto per esteso, per il nome accessibile e il titolo: «Premio: 10 punti, incassato». */
export function rewardDescription(exercise: PointsExercise, state: ExerciseProgress): string {
  const status = rewardStatus(state);
  if (status === 'earned') return `Premio: ${pointsLabel(state.pointsEarned)}, incassato`;
  if (status === 'lost') return 'Nessun premio: soluzione vista prima di risolvere';
  return `Premio: ${pointsLabel(REWARD[exercise.difficulty])}, da incassare`;
}
