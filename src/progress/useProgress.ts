import { useEffect, useMemo, useRef, useState } from 'react';
import { withHint, withSolution, withVerification, type PointsExercise } from '../points/points.ts';
import {
  balanceOf,
  browserStorage,
  loadProgress,
  resetProgress,
  saveProgress,
  withQuery,
  type ThemeProgress,
} from './progress.ts';

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

/** I progressi di un tema: letti all’apertura, salvati a ogni cambiamento. */
export function useProgress(themeId: string): ProgressController {
  const [progress, setProgress] = useState(() => loadProgress(browserStorage(), themeId));
  const loaded = useRef(true);

  useEffect(() => {
    // Il primo giro rilegge ciò che è appena stato caricato: non serve riscriverlo.
    if (loaded.current) {
      loaded.current = false;
      return;
    }
    saveProgress(browserStorage(), themeId, progress);
  }, [progress, themeId]);

  const actions = useMemo<ProgressActions>(
    () => ({
      saveQuery: (id, query) => setProgress((current) => withQuery(current, id, query)),
      recordVerification: (exercise, correct) => setProgress((current) => withVerification(current, exercise, correct)),
      openHint: (exercise) => setProgress((current) => withHint(current, exercise)),
      openSolution: (exercise) => setProgress((current) => withSolution(current, exercise)),
      reset: () => setProgress(resetProgress),
    }),
    [],
  );

  return { progress, balance: balanceOf(progress), ...actions };
}
