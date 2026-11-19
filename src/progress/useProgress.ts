import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { withHint, withSolution, withVerification, type PointsExercise } from '../points/points.ts';
import { balanceOf, resetProgress, withQuery, type ThemeProgress } from './progress.ts';
import { readProgress, subscribeProgress, updateProgress } from './store.ts';

/** Le operazioni sui progressi di un tema; ognuna applica le regole dei punti in un solo aggiornamento. */
export interface ProgressActions {
  /** Salva l’ultima query scritta per un esercizio. */
  saveQuery(id: string, query: string): void;
  /** Registra una pressione di «Verifica»; alla prima risposta corretta incassa il premio. */
  recordVerification(exercise: PointsExercise, correct: boolean): void;
  /** Apre il prossimo suggerimento, se il saldo e le regole lo permettono. */
  openHint(exercise: PointsExercise): void;
  /** Apre la soluzione, se il saldo e le regole lo permettono. */
  openSolution(exercise: PointsExercise): void;
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
      recordVerification: (exercise, correct) => update((current) => withVerification(current, exercise, correct)),
      openHint: (exercise) => update((current) => withHint(current, exercise)),
      openSolution: (exercise) => update((current) => withSolution(current, exercise)),
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
