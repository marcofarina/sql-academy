/** Lettura dei progressi e operazioni di un tema per l’interfaccia. */
import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { withHint, withSolution, withVerification, type PointsExercise } from '../points/points.ts';
import { withReview } from '../training/review.ts';
import { anticipaSalvataggioZaino } from '../zaino/sincronizza.ts';
import { balanceOf, exerciseProgress, resetProgress, withQuery, type ThemeProgress } from './progress.ts';
import { readProgress, subscribeProgress, updateProgress } from './store.ts';

/**
 * Punti assegnati per la risposta corretta o motivo per cui il premio è zero.
 * `review` e `review-failed` li sceglie lo spazio di lavoro nel ripasso.
 */
export type VerificationReward = number | 'already-solved' | 'solution-seen' | 'review' | 'review-failed';

/** Le operazioni sui progressi di un tema; ognuna applica le regole dei punti in un solo aggiornamento. */
export interface ProgressActions {
  /** Salva l’ultima query scritta per un esercizio. */
  saveQuery(id: string, query: string): void;
  /** Registra una verifica e restituisce il premio se la risposta è corretta. */
  recordVerification(exercise: PointsExercise, correct: boolean): VerificationReward | undefined;
  /** Apre il prossimo suggerimento, se il saldo e le regole lo permettono. */
  openHint(exercise: PointsExercise): void;
  /** Apre la soluzione, se il saldo e le regole lo permettono. */
  openSolution(exercise: PointsExercise): void;
  /** Registra l’esito del ripasso di un esercizio risolto (`src/training/review.ts`). */
  recordReview(id: string, success: boolean): void;
  /** Azzera i progressi del tema, saldo e aiuto gratuito compresi; l’epoca sale di uno. */
  reset(): void;
}

export interface ProgressController extends ProgressActions {
  progress: ThemeProgress;
  /** Il saldo del tema: punti guadagnati meno punti spesi. */
  balance: number;
}

/**
 * I progressi di un tema, dall’archivio comune (`store.ts`): si aggiornano
 * anche quando arrivano dallo zaino o da un’altra scheda.
 */
export function useProgress(themeId: string): ProgressController {
  const progress = useThemeProgress(themeId);

  const actions = useMemo<ProgressActions>(() => {
    const update = (change: (current: ThemeProgress) => ThemeProgress) => updateProgress(themeId, change);
    return {
      saveQuery: (id, query) => update((current) => withQuery(current, id, query)),
      recordVerification: (exercise, correct) => {
        let reward: VerificationReward | undefined;
        update((current) => {
          const next = withVerification(current, exercise, correct);
          if (correct) {
            const before = exerciseProgress(current, exercise.id);
            reward = before.solved ? 'already-solved'
              : before.solutionBeforeSolve ? 'solution-seen'
              : exerciseProgress(next, exercise.id).pointsEarned;
          }
          return next;
        });
        if (correct) anticipaSalvataggioZaino();
        return reward;
      },
      openHint: (exercise) => update((current) => withHint(current, exercise)),
      openSolution: (exercise) => update((current) => withSolution(current, exercise)),
      recordReview: (id, success) => update((current) => withReview(current, id, success)),
      reset: () => update(resetProgress),
    };
  }, [themeId]);

  return { progress, balance: balanceOf(progress), ...actions };
}

/** I soli progressi di un tema, che si aggiornano con l’archivio (locandine, pagina dello zaino). */
export function useThemeProgress(themeId: string): ThemeProgress {
  return useSyncExternalStore(
    subscribeProgress,
    useCallback(() => readProgress(themeId), [themeId]),
  );
}
