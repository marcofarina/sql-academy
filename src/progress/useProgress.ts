import { useCallback, useEffect, useRef, useState } from 'react';
import {
  EMPTY_EXERCISE_PROGRESS,
  browserStorage,
  clearProgress,
  emptyProgress,
  loadProgress,
  saveProgress,
  type ExerciseProgress,
  type ThemeProgress,
} from './progress.ts';

export interface ProgressController {
  progress: ThemeProgress;
  /** Aggiorna lo stato di un esercizio a partire da quello attuale. */
  update(id: string, change: (current: ExerciseProgress) => ExerciseProgress): void;
  /** Azzera i progressi del tema, anche nell’archivio. */
  reset(): void;
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

  const update = useCallback((id: string, change: (current: ExerciseProgress) => ExerciseProgress) => {
    setProgress((current) => ({
      exercises: { ...current.exercises, [id]: change(current.exercises[id] ?? EMPTY_EXERCISE_PROGRESS) },
    }));
  }, []);

  const reset = useCallback(() => {
    clearProgress(browserStorage(), themeId);
    setProgress(emptyProgress());
  }, [themeId]);

  return { progress, update, reset };
}
