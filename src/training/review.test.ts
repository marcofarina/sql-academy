import { expect, test } from 'vitest';
import { EMPTY_EXERCISE_PROGRESS, emptyProgress, type ExerciseProgress, type ThemeProgress } from '../progress/progress.ts';
import { withVerification } from '../points/points.ts';
import { daysUntil, dueExercises, nextReviewAt, REVIEW_LENGTH, reviewDueAt, startReview, withReview } from './review.ts';

const DAY = 24 * 60 * 60 * 1000;
const exercise = (change: Partial<ExerciseProgress>): ExerciseProgress => ({ ...EMPTY_EXERCISE_PROGRESS, ...change });
const progressOf = (exercises: Record<string, ExerciseProgress>): ThemeProgress => ({ ...emptyProgress(), exercises });

test('la prima risoluzione annota l’istante; le verifiche successive non lo spostano', () => {
  const easy = { id: 'ex-001', difficulty: 'facile' as const, hints: [] };
  let progress = withVerification(emptyProgress(), easy, false, 100);
  expect(progress.exercises['ex-001'].solvedAt).toBe(0);
  progress = withVerification(progress, easy, true, 200);
  progress = withVerification(progress, easy, true, 300);
  expect(progress.exercises['ex-001'].solvedAt).toBe(200);
  expect(progress.exercises['ex-001'].pointsEarned).toBe(10);
});

test('scadenze: 1, 3, 7, 21 giorni dall’ultimo ripasso o dalla risoluzione; poi consolidato', () => {
  expect(reviewDueAt(exercise({ solvedAt: 1000 }))).toBeUndefined();
  expect(reviewDueAt(exercise({ solved: true, solvedAt: 1000 }))).toBe(1000 + DAY);
  expect(reviewDueAt(exercise({ solved: true, solvedAt: 1000, reviewStep: 1, reviewAt: 5000 }))).toBe(5000 + 3 * DAY);
  expect(reviewDueAt(exercise({ solved: true, reviewStep: 2, reviewAt: 5000 }))).toBe(5000 + 7 * DAY);
  expect(reviewDueAt(exercise({ solved: true, reviewStep: 3, reviewAt: 5000 }))).toBe(5000 + 21 * DAY);
  expect(reviewDueAt(exercise({ solved: true, reviewStep: 4, reviewAt: 5000 }))).toBeUndefined();
});

test('dati vecchi senza data di risoluzione: conta queryAt, altrimenti subito', () => {
  expect(reviewDueAt(exercise({ solved: true, queryAt: 2000 }))).toBe(2000 + DAY);
  expect(reviewDueAt(exercise({ solved: true }))).toBe(0);
});

test('scelta per data: solo i risolti scaduti, dal più in ritardo, al massimo dieci', () => {
  const now = 100 * DAY;
  const progress = progressOf({
    a: exercise({ solved: true, solvedAt: now - 2 * DAY }), // scaduto da un giorno
    b: exercise({ solved: true }), // dati vecchi: subito
    c: exercise({ solved: true, solvedAt: now - DAY / 2 }), // non ancora
    d: exercise({ solved: false, queryAt: 1 }), // non risolto
    e: exercise({ solved: true, reviewStep: 1, reviewAt: now - 3 * DAY }), // scaduto adesso
    f: exercise({ solved: true, reviewStep: 4, reviewAt: 1 }), // consolidato
  });
  const ids = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  expect(dueExercises(ids, progress, now)).toEqual(['b', 'a', 'e']);
  expect(nextReviewAt(['c', 'd', 'f'], progress)).toBe(now + DAY / 2);
  expect(nextReviewAt(['d', 'f', 'g'], progress)).toBeUndefined();

  const many = progressOf(Object.fromEntries(Array.from({ length: 15 }, (_, i) => [`x${i}`, exercise({ solved: true, solvedAt: i + 1 })])));
  const chosen = dueExercises(Object.keys(many.exercises), many, now);
  expect(chosen).toHaveLength(REVIEW_LENGTH);
  expect(chosen[0]).toBe('x0');
});

test('esito: riuscito allunga l’intervallo, fallito lo riporta a un giorno', () => {
  const t0 = 10 * DAY;
  let progress = progressOf({ a: exercise({ solved: true, solvedAt: t0, pointsEarned: 20 }) });
  progress = withReview(progress, 'a', true, t0 + DAY);
  expect(progress.exercises.a).toMatchObject({ reviewStep: 1, reviewAt: t0 + DAY });
  expect(reviewDueAt(progress.exercises.a)).toBe(t0 + 4 * DAY);
  progress = withReview(progress, 'a', true, t0 + 4 * DAY);
  expect(reviewDueAt(progress.exercises.a)).toBe(t0 + 11 * DAY);
  progress = withReview(progress, 'a', false, t0 + 12 * DAY);
  expect(progress.exercises.a).toMatchObject({ reviewStep: 0, reviewAt: t0 + 12 * DAY });
  expect(reviewDueAt(progress.exercises.a)).toBe(t0 + 13 * DAY);
  // Il ripasso non tocca i punti.
  expect(progress.exercises.a.pointsEarned).toBe(20);
  expect(progress.exercises.a.pointsSpent).toBe(0);
  // Un esercizio non risolto non si ripassa.
  expect(withReview(progress, 'z', true, t0)).toBe(progress);
});

test('il ripasso è una sessione con i punti di partenza', () => {
  const progress = progressOf({ a: exercise({ solved: true, pointsEarned: 10, pointsSpent: 3 }) });
  expect(startReview(progress, ['a'])).toEqual({
    exerciseIds: ['a'], index: 0, records: {}, baseline: { a: { earned: 10, spent: 3 } }, finished: false, review: true,
  });
});

test('giorni che mancano, per eccesso', () => {
  expect(daysUntil(DAY / 2, 0)).toBe(1);
  expect(daysUntil(3 * DAY + 1, 0)).toBe(4);
  expect(daysUntil(0, DAY)).toBe(1);
});
