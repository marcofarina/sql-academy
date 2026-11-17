/**
 * Progressi dello studente, salvati in `localStorage` per tema, nella chiave
 * `sql-academy:<tema>:v1`. Nessun dato personale: solo lo stato degli esercizi.
 *
 * Forma salvata (JSON):
 *
 *   {
 *     "version": 1,
 *     "exercises": {
 *       "ex-001": { "solved": true, "attempts": 2, "hintsRevealed": 1, "solutionSeen": false, "lastQuery": "SELECT …" }
 *     }
 *   }
 *
 * Suggerimenti aperti e soluzioni viste si conservano anche se oggi non
 * costano nulla: un futuro sistema a punti potrà calcolarli sul pregresso.
 *
 * Ogni accesso all’archivio è in `try/catch`: senza `localStorage` (finestra
 * privata, archiviazione bloccata) i progressi vivono solo nella pagina.
 */

export const PROGRESS_VERSION = 1;

/** Testo massimo conservato per l’ultima query di un esercizio. */
export const MAX_QUERY_LENGTH = 20_000;

export interface ExerciseProgress {
  solved: boolean;
  /** Quante volte lo studente ha premuto «Verifica». */
  attempts: number;
  /** Quanti suggerimenti ha aperto, dal primo. */
  hintsRevealed: number;
  solutionSeen: boolean;
  /** L’ultima query scritta nell’editor dell’esercizio. */
  lastQuery: string;
}

export interface ThemeProgress {
  exercises: Record<string, ExerciseProgress>;
}

export const EMPTY_EXERCISE_PROGRESS: ExerciseProgress = {
  solved: false,
  attempts: 0,
  hintsRevealed: 0,
  solutionSeen: false,
  lastQuery: '',
};

export function emptyProgress(): ThemeProgress {
  return { exercises: {} };
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
  return { exercises };
}

export function serializeProgress(progress: ThemeProgress): string {
  return JSON.stringify({ version: PROGRESS_VERSION, exercises: progress.exercises });
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
