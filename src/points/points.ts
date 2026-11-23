/**
 * Regole del sistema a punti (F13). Funzioni pure, senza React né browser:
 * il servizio della classifica (F16) riusa le stesse tabelle nel Worker.
 *
 * Le regole valgono per ogni tema; un tema non le personalizza. Sono quelle
 * decise con Marco il 2026-11-17 (§ 2 di `docs/plans/portale-v1/F13-…`):
 *
 *  1. i punti sono per tema; il saldo parte da zero e non scende sotto zero;
 *  2. il primo aiuto del tema è gratuito, una volta sola, ed è un suggerimento;
 *  3. i suggerimenti si aprono uno alla volta, ciascuno al suo prezzo;
 *  4. la soluzione si compra solo dopo tutti i suggerimenti dell’esercizio;
 *  5. a esercizio risolto suggerimenti e soluzione sono gratis (e non
 *     consumano l’aiuto gratuito);
 *  6. il premio si incassa alla prima risoluzione, intero anche con suggerimenti;
 *  7. risolto dopo aver visto la soluzione: risolto, ma zero punti;
 *  8. rifare un esercizio già risolto non dà punti.
 *
 * Un esercizio può non avere una soluzione acquistabile (`solutionAvailable:
 * false`, per le future CTF): `solutionOffer` risponde «non disponibile».
 */

import { balanceOf, exerciseProgress, type ExerciseProgress, type ThemeProgress } from '../progress/progress.ts';
import type { Difficulty } from '../themes/contract.ts';

/** Premio della prima risoluzione. */
export const REWARD: Record<Difficulty, number> = { facile: 10, medio: 20, difficile: 30 };

/** Prezzo di un suggerimento: circa un quarto del premio, per eccesso. */
export const HINT_COST: Record<Difficulty, number> = { facile: 3, medio: 5, difficile: 8 };

/** Prezzo della soluzione: il doppio del premio, l’estrema ratio. */
export const SOLUTION_COST: Record<Difficulty, number> = { facile: 20, medio: 40, difficile: 60 };

/** Ciò che le regole sanno di un esercizio. `Exercise` del contratto del tema lo soddisfa. */
export interface PointsExercise {
  id: string;
  difficulty: Difficulty;
  hints: readonly string[];
  /** `false` per un esercizio senza soluzione acquistabile. Se assente, la soluzione c’è. */
  solutionAvailable?: boolean;
}

/** Ciò che serve sapere del tema per prezzare un aiuto. */
export interface Wallet {
  balance: number;
  freeHintUsed: boolean;
}

export function walletOf(progress: ThemeProgress): Wallet {
  return { balance: balanceOf(progress), freeHintUsed: progress.freeHintUsed };
}

/** Perché un aiuto non costa: è il primo del tema, oppure l’esercizio è già risolto. */
export type Waiver = 'first' | 'solved';

/**
 * Lo stato di un aiuto di un esercizio:
 * - `unavailable`: non c’è nulla da aprire (tutti i suggerimenti aperti, soluzione vista o assente);
 * - `locked`: la soluzione, prima dell’ultimo suggerimento; `cost` è il prezzo che avrà;
 * - `available`: si può comprare; `missing` sono i punti che mancano al saldo (zero se lo copre).
 */
export type Offer =
  | { status: 'unavailable' }
  | { status: 'locked'; cost: number }
  | { status: 'available'; cost: number; waiver: Waiver | null; missing: number };

function priced(cost: number, waiver: Waiver | null, wallet: Wallet): Offer {
  return { status: 'available', cost, waiver, missing: Math.max(0, cost - wallet.balance) };
}

export function hintOffer(exercise: PointsExercise, state: ExerciseProgress, wallet: Wallet): Offer {
  if (state.hintsRevealed >= exercise.hints.length) return { status: 'unavailable' };
  if (state.solved) return priced(0, 'solved', wallet);
  if (!wallet.freeHintUsed) return priced(0, 'first', wallet);
  return priced(HINT_COST[exercise.difficulty], null, wallet);
}

export function solutionOffer(exercise: PointsExercise, state: ExerciseProgress, wallet: Wallet): Offer {
  if (exercise.solutionAvailable === false || state.solutionSeen) return { status: 'unavailable' };
  if (state.solved) return priced(0, 'solved', wallet);
  if (state.hintsRevealed < exercise.hints.length) return { status: 'locked', cost: SOLUTION_COST[exercise.difficulty] };
  return priced(SOLUTION_COST[exercise.difficulty], null, wallet);
}

/** L’unico punto che decide se un suggerimento si può aprire adesso. */
export function canRevealHint(exercise: PointsExercise, state: ExerciseProgress, wallet: Wallet): boolean {
  const offer = hintOffer(exercise, state, wallet);
  return offer.status === 'available' && offer.missing === 0;
}

/** L’unico punto che decide se la soluzione si può aprire adesso. */
export function canRevealSolution(exercise: PointsExercise, state: ExerciseProgress, wallet: Wallet): boolean {
  const offer = solutionOffer(exercise, state, wallet);
  return offer.status === 'available' && offer.missing === 0;
}

function withExercise(progress: ThemeProgress, id: string, change: Partial<ExerciseProgress>): ThemeProgress['exercises'] {
  return { ...progress.exercises, [id]: { ...exerciseProgress(progress, id), ...change } };
}

/** Apre il prossimo suggerimento, se le regole lo permettono; altrimenti restituisce gli stessi progressi. */
export function withHint(progress: ThemeProgress, exercise: PointsExercise): ThemeProgress {
  const state = exerciseProgress(progress, exercise.id);
  const offer = hintOffer(exercise, state, walletOf(progress));
  if (offer.status !== 'available' || offer.missing > 0) return progress;
  return {
    ...progress,
    freeHintUsed: progress.freeHintUsed || offer.waiver === 'first',
    exercises: withExercise(progress, exercise.id, {
      hintsRevealed: state.hintsRevealed + 1,
      pointsSpent: state.pointsSpent + offer.cost,
    }),
  };
}

/** Apre la soluzione, se le regole lo permettono; altrimenti restituisce gli stessi progressi. */
export function withSolution(progress: ThemeProgress, exercise: PointsExercise): ThemeProgress {
  const state = exerciseProgress(progress, exercise.id);
  const offer = solutionOffer(exercise, state, walletOf(progress));
  if (offer.status !== 'available' || offer.missing > 0) return progress;
  return {
    ...progress,
    exercises: withExercise(progress, exercise.id, {
      solutionSeen: true,
      solutionBeforeSolve: state.solutionBeforeSolve || !state.solved,
      pointsSpent: state.pointsSpent + offer.cost,
    }),
  };
}

/**
 * Registra una pressione di «Verifica»; alla prima risposta corretta incassa il
 * premio e annota l’istante (`now`) da cui conta il ripasso.
 */
export function withVerification(
  progress: ThemeProgress,
  exercise: PointsExercise,
  correct: boolean,
  now = Date.now(),
): ThemeProgress {
  const state = exerciseProgress(progress, exercise.id);
  const firstSolve = correct && !state.solved;
  return {
    ...progress,
    exercises: withExercise(progress, exercise.id, {
      attempts: state.attempts + 1,
      solved: state.solved || correct,
      pointsEarned: firstSolve && !state.solutionBeforeSolve ? REWARD[exercise.difficulty] : state.pointsEarned,
      solvedAt: firstSolve ? now : state.solvedAt,
    }),
  };
}
