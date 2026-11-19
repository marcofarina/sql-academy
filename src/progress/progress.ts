/**
 * Progressi dello studente, salvati in `localStorage` per tema, nella chiave
 * `sql-academy:<tema>:v2`. Nessun dato personale: solo lo stato degli esercizi.
 *
 * Forma salvata (JSON):
 *
 *   {
 *     "version": 2,
 *     "epoch": 0,
 *     "freeHintUsed": true,
 *     "exercises": {
 *       "ex-001": {
 *         "solved": true, "attempts": 2, "hintsRevealed": 1,
 *         "solutionSeen": false, "solutionBeforeSolve": false,
 *         "pointsEarned": 10, "pointsSpent": 0,
 *         "lastQuery": "SELECT …"
 *       }
 *     }
 *   }
 *
 * Tutto ciò che conta per i punti può solo crescere (contatori, valori che
 * passano da `false` a `true`): così due copie dei progressi si uniscono con il
 * massimo campo per campo. L’azzeramento non cresce, perciò lo registra
 * `epoch`, che sale di uno a ogni azzeramento del tema.
 *
 * Il saldo non si salva: è la somma dei punti guadagnati meno quella dei punti
 * spesi (`balanceOf`). Si salvano gli importi effettivi, non si ricalcolano
 * dalle tabelle dei prezzi: un cambio di prezzi non riscrive il saldo.
 * Le regole dei punti sono in `src/points/points.ts`.
 *
 * Ogni accesso all’archivio è in `try/catch`: senza `localStorage` (finestra
 * privata, archiviazione bloccata) i progressi vivono solo nella pagina.
 */

export const PROGRESS_VERSION = 2;

/** Testo massimo conservato per l’ultima query di un esercizio. */
export const MAX_QUERY_LENGTH = 20_000;

export interface ExerciseProgress {
  solved: boolean;
  /** Quante volte lo studente ha premuto «Verifica». */
  attempts: number;
  /** Quanti suggerimenti ha aperto, dal primo. */
  hintsRevealed: number;
  solutionSeen: boolean;
  /** La soluzione è stata vista quando l’esercizio non era ancora risolto: vale zero punti. */
  solutionBeforeSolve: boolean;
  /** Punti incassati alla prima risoluzione (zero se non risolto). */
  pointsEarned: number;
  /** Punti spesi in suggerimenti e soluzione. */
  pointsSpent: number;
  /** L’ultima query scritta nell’editor dell’esercizio. */
  lastQuery: string;
}

export interface ThemeProgress {
  exercises: Record<string, ExerciseProgress>;
  /** L’aiuto gratuito del tema è già stato usato. */
  freeHintUsed: boolean;
  /** Quante volte lo studente ha azzerato i progressi del tema. */
  epoch: number;
}

export const EMPTY_EXERCISE_PROGRESS: ExerciseProgress = {
  solved: false,
  attempts: 0,
  hintsRevealed: 0,
  solutionSeen: false,
  solutionBeforeSolve: false,
  pointsEarned: 0,
  pointsSpent: 0,
  lastQuery: '',
};

export function emptyProgress(): ThemeProgress {
  return { exercises: {}, freeHintUsed: false, epoch: 0 };
}

/** I progressi dopo «Azzera i progressi»: vuoti, con l’epoca avanzata di uno. */
export function resetProgress(progress: ThemeProgress): ThemeProgress {
  return { ...emptyProgress(), epoch: progress.epoch + 1 };
}

/** Il saldo del tema: punti guadagnati meno punti spesi, mai sotto zero. */
export function balanceOf(progress: ThemeProgress): number {
  let balance = 0;
  for (const exercise of Object.values(progress.exercises)) balance += exercise.pointsEarned - exercise.pointsSpent;
  return Math.max(0, balance);
}

/** Salva l’ultima query di un esercizio, lasciando il resto com’è. */
export function withQuery(progress: ThemeProgress, id: string, query: string): ThemeProgress {
  return {
    ...progress,
    exercises: { ...progress.exercises, [id]: { ...exerciseProgress(progress, id), lastQuery: query } },
  };
}

export function progressKey(themeId: string): string {
  return `sql-academy:${themeId}:v${PROGRESS_VERSION}`;
}

export function exerciseProgress(progress: ThemeProgress, id: string): ExerciseProgress {
  return progress.exercises[id] ?? EMPTY_EXERCISE_PROGRESS;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const count = (value: unknown) => (Number.isInteger(value) && (value as number) >= 0 ? (value as number) : 0);

function parseExercise(value: unknown): ExerciseProgress | undefined {
  if (!isRecord(value)) return undefined;
  return {
    solved: value.solved === true,
    attempts: count(value.attempts),
    hintsRevealed: count(value.hintsRevealed),
    solutionSeen: value.solutionSeen === true,
    solutionBeforeSolve: value.solutionBeforeSolve === true,
    pointsEarned: count(value.pointsEarned),
    pointsSpent: count(value.pointsSpent),
    lastQuery: typeof value.lastQuery === 'string' ? value.lastQuery.slice(0, MAX_QUERY_LENGTH) : '',
  };
}

/**
 * Interpreta il testo salvato. Testo assente, JSON rotto o versione diversa
 * danno progressi vuoti; le voci malformate si scartano una per una.
 */
export function parseProgress(text: string | null): ThemeProgress {
  if (text === null) return emptyProgress();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return emptyProgress();
  }
  if (!isRecord(data) || data.version !== PROGRESS_VERSION || !isRecord(data.exercises)) return emptyProgress();

  const exercises: Record<string, ExerciseProgress> = {};
  for (const [id, value] of Object.entries(data.exercises)) {
    const parsed = parseExercise(value);
    if (parsed) exercises[id] = parsed;
  }
  return { exercises, freeHintUsed: data.freeHintUsed === true, epoch: count(data.epoch) };
}

export function serializeProgress(progress: ThemeProgress): string {
  return JSON.stringify({
    version: PROGRESS_VERSION,
    epoch: progress.epoch,
    freeHintUsed: progress.freeHintUsed,
    exercises: progress.exercises,
  });
}

/** L’archivio del browser, se raggiungibile: in alcune finestre private anche leggerlo solleva un’eccezione. */
export function browserStorage(): Storage | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

export function loadProgress(storage: Storage | undefined, themeId: string): ThemeProgress {
  try {
    return parseProgress(storage?.getItem(progressKey(themeId)) ?? null);
  } catch {
    return emptyProgress();
  }
}

/** Salva i progressi; `false` se l’archivio non c’è o rifiuta la scrittura. */
export function saveProgress(storage: Storage | undefined, themeId: string, progress: ThemeProgress): boolean {
  try {
    if (!storage) return false;
    storage.setItem(progressKey(themeId), serializeProgress(progress));
    return true;
  } catch {
    return false;
  }
}

export function clearProgress(storage: Storage | undefined, themeId: string): void {
  try {
    storage?.removeItem(progressKey(themeId));
  } catch {
    // Archivio non raggiungibile: non c’è nulla da cancellare.
  }
}
