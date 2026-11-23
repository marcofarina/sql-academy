/**
 * Sessioni configurabili: un’estrazione casuale di esercizi, senza ripetizioni.
 */

import { DIFFICULTIES, type Chapter, type Difficulty, type Exercise } from '../themes/contract.ts';
import { exerciseProgress, type ThemeProgress } from '../progress/progress.ts';
import { sortExercises } from './exercises.ts';
import type { ActiveSession } from './SessionView.tsx';

export const SESSION_LENGTHS = [5, 10, 20] as const;
export type SessionLength = (typeof SESSION_LENGTHS)[number];

export interface SessionConfig {
  length: SessionLength;
  /** Una difficoltà sola, oppure `bilanciata`: le tre difficoltà in parti il più possibile uguali. */
  difficulty: Difficulty | 'bilanciata';
  /** Capitoli ammessi; almeno uno. */
  chapters: Chapter[];
  /** Parole chiave da allenare: entra un esercizio che ne usa almeno una. Vuoto: tutte. */
  keywords: string[];
}

/** Gli esercizi che la configurazione ammette, senza limite di numero. */
export function eligibleExercises(exercises: Exercise[], config: SessionConfig): Exercise[] {
  return exercises.filter(
    (e) =>
      config.chapters.includes(e.chapter) &&
      (config.difficulty === 'bilanciata' || e.difficulty === config.difficulty) &&
      (config.keywords.length === 0 || e.keywords.some((k) => config.keywords.includes(k))),
  );
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Estrae gli esercizi di una sessione, ordinati per capitolo e difficoltà.
 * Se gli esercizi ammessi sono meno della lunghezza chiesta, la sessione è più
 * corta: non si pescano esercizi fuori dai filtri.
 */
export function generateSession(
  exercises: Exercise[],
  config: SessionConfig,
  random: () => number = Math.random,
): Exercise[] {
  const pool = eligibleExercises(exercises, config);
  if (config.difficulty !== 'bilanciata') return sortExercises(shuffle(pool, random).slice(0, config.length));

  // A turno una per difficoltà, finché si arriva alla lunghezza o si esauriscono.
  const queues = DIFFICULTIES.map((d) => shuffle(pool.filter((e) => e.difficulty === d), random));
  const picked: Exercise[] = [];
  while (picked.length < config.length && queues.some((q) => q.length > 0)) {
    for (const queue of queues) {
      const next = queue.shift();
      if (next && picked.length < config.length) picked.push(next);
    }
  }
  return sortExercises(picked);
}

/** Che cosa è la sessione: configurata dallo studente, ripasso o consegna del docente. */
export type SessionKind = 'sessione' | 'ripasso' | 'consegna';

/** Il tipo della sessione, per i testi che la nominano. */
export function sessionKind(session: ActiveSession): SessionKind {
  return session.review ? 'ripasso' : session.consegna ? 'consegna' : 'sessione';
}

/** I punti di ogni esercizio all’avvio della sessione, da cui il riepilogo conta la differenza. */
export function baselineOf(progress: ThemeProgress, ids: string[]): ActiveSession['baseline'] {
  return Object.fromEntries(
    ids.map((id) => {
      const { pointsEarned, pointsSpent } = exerciseProgress(progress, id);
      return [id, { earned: pointsEarned, spent: pointsSpent }];
    }),
  );
}

/** «23 novembre 2026 alle 16:42», nell’ora del dispositivo. */
export function formatFinishedAt(at: number): string {
  const date = new Date(at);
  const day = date.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
  const time = date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  return `${day} alle ${time}`;
}
