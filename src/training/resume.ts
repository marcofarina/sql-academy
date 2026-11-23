/**
 * «Riprendi da dove eri» (F16 del piano `portale-v2`): l’ultimo esercizio su
 * cui lo studente ha scritto, ricavato dai progressi (`queryAt`) senza campi
 * nuovi. Se c’è una sessione salvata vale quella: lo decide chi mostra il
 * pulsante, con `loadSession` di `sessionStorage.ts`.
 */
import { exerciseProgress, type ThemeProgress } from '../progress/progress.ts';
import type { Exercise } from '../themes/contract.ts';
import type { SessionKind } from './session.ts';

/** «Riprendi la sessione», «Riprendi il ripasso», «Riprendi la consegna». */
export const RESUME_LABEL: Record<SessionKind, string> = {
  sessione: 'Riprendi la sessione',
  ripasso: 'Riprendi il ripasso',
  consegna: 'Riprendi la consegna',
};

/**
 * L’esercizio con la query scritta più di recente; `undefined` se lo studente
 * non ha ancora scritto in nessun esercizio del tema. A parità di ora vince il
 * primo nell’ordine di `exercises`, così la scelta non dipende dall’archivio.
 */
export function lastExercise(exercises: Exercise[], progress: ThemeProgress): Exercise | undefined {
  let last: Exercise | undefined;
  let lastAt = 0;
  for (const exercise of exercises) {
    const at = exerciseProgress(progress, exercise.id).queryAt;
    if (at > lastAt) {
      last = exercise;
      lastAt = at;
    }
  }
  return last;
}
