/**
 * Regole del ripasso (F12 del piano `portale-v2`), decise con Marco il
 * 2026-11-23. Funzioni pure, senza React né browser.
 *
 *  1. Si ripassano solo esercizi risolti. Il primo ripasso arriva un giorno
 *     dopo la prima risoluzione; ogni ripasso riuscito sale di un gradino
 *     (`REVIEW_INTERVALS`: 1, 3, 7, 21 giorni), ogni ripasso fallito torna al
 *     primo. Riuscito il ripasso a 21 giorni, l’esercizio è consolidato e non
 *     torna più.
 *  2. Per gli esercizi risolti prima che esistesse `solvedAt` l’intervallo
 *     conta da `queryAt`; senza nemmeno quella, l’esercizio è subito da
 *     ripassare.
 *  3. Il ripasso vale zero punti. Suggerimenti e soluzione sono gratis, come
 *     per ogni esercizio risolto; aprire la soluzione fa fallire il ripasso,
 *     e lo stesso vale per saltare l’esercizio senza risolverlo.
 */

import { exerciseProgress, type ExerciseProgress, type ThemeProgress } from '../progress/progress.ts';
import type { ActiveSession } from './SessionView.tsx';

const DAY = 24 * 60 * 60 * 1000;

/** Giorni di attesa prima del ripasso, per gradino: dopo l’ultimo l’esercizio è consolidato. */
export const REVIEW_INTERVALS = [1, 3, 7, 21] as const;

/** Esercizi al massimo in un ripasso. */
export const REVIEW_LENGTH = 10;

/**
 * Quando l’esercizio sarà da ripassare, in millisecondi; 0 se lo è subito.
 * `undefined` se non è risolto o se è consolidato.
 */
export function reviewDueAt(state: ExerciseProgress): number | undefined {
  if (!state.solved || state.reviewStep >= REVIEW_INTERVALS.length) return undefined;
  const from = state.reviewAt || state.solvedAt || state.queryAt;
  if (from === 0) return 0;
  return from + REVIEW_INTERVALS[state.reviewStep] * DAY;
}

/**
 * Gli `id` degli esercizi da ripassare all’istante `now`, dal più in ritardo,
 * al massimo `REVIEW_LENGTH`. A parità di scadenza decide l’`id`.
 */
export function dueExercises(ids: readonly string[], progress: ThemeProgress, now = Date.now()): string[] {
  return ids
    .map((id) => ({ id, due: reviewDueAt(exerciseProgress(progress, id)) }))
    .filter((e): e is { id: string; due: number } => e.due !== undefined && e.due <= now)
    .sort((a, b) => a.due - b.due || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
    .slice(0, REVIEW_LENGTH)
    .map((e) => e.id);
}

/** Il prossimo ripasso fra gli `ids`, se nessuno è da ripassare adesso; `undefined` se non ce n’è. */
export function nextReviewAt(ids: readonly string[], progress: ThemeProgress): number | undefined {
  const dates = ids
    .map((id) => reviewDueAt(exerciseProgress(progress, id)))
    .filter((due): due is number => due !== undefined);
  return dates.length > 0 ? Math.min(...dates) : undefined;
}

/** Registra l’esito di un ripasso: riuscito sale di un gradino, fallito torna al primo. */
export function withReview(progress: ThemeProgress, id: string, success: boolean, now = Date.now()): ThemeProgress {
  const state = exerciseProgress(progress, id);
  if (!state.solved) return progress;
  return {
    ...progress,
    exercises: {
      ...progress.exercises,
      [id]: { ...state, reviewStep: success ? state.reviewStep + 1 : 0, reviewAt: now },
    },
  };
}

/** Un ripasso degli esercizi `ids`, che devono essere già risolti: una sessione con `review`. */
export function startReview(progress: ThemeProgress, ids: string[]): ActiveSession {
  const baseline = ids.map((id) => {
    const { pointsEarned, pointsSpent } = exerciseProgress(progress, id);
    return [id, { earned: pointsEarned, spent: pointsSpent }];
  });
  return { exerciseIds: ids, index: 0, records: {}, baseline: Object.fromEntries(baseline), finished: false, review: true };
}

/** I giorni interi che mancano a `dueAt`, per eccesso: almeno uno. */
export function daysUntil(dueAt: number, now = Date.now()): number {
  return Math.max(1, Math.ceil((dueAt - now) / DAY));
}
