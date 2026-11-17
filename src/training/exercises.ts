/**
 * Logica dell’addestramento senza React: capitoli del libro, percorso,
 * filtri del catalogo, regola che decide quando un aiuto si può aprire.
 */

import type { ExerciseProgress } from '../progress/progress.ts';
import { CHAPTERS, DIFFICULTIES, type Chapter, type Difficulty, type Exercise } from '../themes/contract.ts';

/** I capitoli del *Manuale dell’Archivista* allenati dal portale, con numero e titolo del libro. */
export const CHAPTER_INFO: Record<Chapter, { number: number; title: string }> = {
  'una-tabella': { number: 6, title: 'Interrogare una tabella' },
  join: { number: 7, title: 'Interrogare più tabelle' },
  aggregazioni: { number: 8, title: 'Aggregare' },
  'sottoquery-viste': { number: 9, title: 'Query dentro query' },
};

/** «1 esercizio», «3 esercizi». */
export function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

export function chapterLabel(chapter: Chapter): string {
  const { number, title } = CHAPTER_INFO[chapter];
  return `Capitolo ${number} · ${title}`;
}

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  facile: 'Facile',
  medio: 'Medio',
  difficile: 'Difficile',
};

const difficultyRank = (difficulty: Difficulty) => DIFFICULTIES.indexOf(difficulty);
const chapterRank = (chapter: Chapter) => CHAPTERS.indexOf(chapter);

/** Ordina per capitolo e difficoltà; a parità resta l’ordine del file del tema. */
export function sortExercises(exercises: Exercise[]): Exercise[] {
  return exercises
    .map((exercise, index) => ({ exercise, index }))
    .sort(
      (a, b) =>
        chapterRank(a.exercise.chapter) - chapterRank(b.exercise.chapter) ||
        difficultyRank(a.exercise.difficulty) - difficultyRank(b.exercise.difficulty) ||
        a.index - b.index,
    )
    .map(({ exercise }) => exercise);
}

/** Il percorso: un gruppo per capitolo che ha esercizi, nell’ordine del libro, esercizi ordinati per difficoltà. */
export function buildPath(exercises: Exercise[]): { chapter: Chapter; exercises: Exercise[] }[] {
  const sorted = sortExercises(exercises);
  return CHAPTERS.map((chapter) => ({ chapter, exercises: sorted.filter((e) => e.chapter === chapter) })).filter(
    (group) => group.exercises.length > 0,
  );
}

/** Le parole chiave usate dagli esercizi, in ordine alfabetico. */
export function keywordsOf(exercises: Exercise[]): string[] {
  return [...new Set(exercises.flatMap((e) => e.keywords))].sort((a, b) => a.localeCompare(b));
}

/** Le tabelle coinvolte negli esercizi, in ordine alfabetico. */
export function tablesOf(exercises: Exercise[]): string[] {
  return [...new Set(exercises.flatMap((e) => e.tables))].sort((a, b) => a.localeCompare(b));
}

export interface CatalogFilters {
  text: string;
  chapter?: Chapter;
  difficulty?: Difficulty;
  keyword?: string;
  table?: string;
}

/** Minuscolo e senza accenti, per una ricerca che non bada a maiuscole e diacritici. */
function fold(text: string): string {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

/** Gli esercizi che passano i filtri del catalogo; il testo si cerca in id, titolo e consegna. */
export function filterCatalog(exercises: Exercise[], filters: CatalogFilters): Exercise[] {
  const words = fold(filters.text).split(/\s+/).filter(Boolean);
  return sortExercises(exercises).filter((e) => {
    if (filters.chapter && e.chapter !== filters.chapter) return false;
    if (filters.difficulty && e.difficulty !== filters.difficulty) return false;
    if (filters.keyword && !e.keywords.includes(filters.keyword)) return false;
    if (filters.table && !e.tables.includes(filters.table)) return false;
    const haystack = fold(`${e.id} ${e.title} ${e.prompt}`);
    return words.every((word) => haystack.includes(word));
  });
}

/**
 * Quando un aiuto si può aprire. È l’unico punto che lo decide: un futuro
 * sistema a punti cambierà queste due funzioni, non i componenti.
 *
 * Regola provvisoria (Marco, 2026-11-17, in F05): i suggerimenti sono liberi,
 * uno alla volta; la soluzione si apre dopo l’ultimo suggerimento oppure a
 * esercizio risolto.
 */
export function canRevealHint(exercise: Exercise, progress: ExerciseProgress): boolean {
  return progress.hintsRevealed < exercise.hints.length;
}

export function canRevealSolution(exercise: Exercise, progress: ExerciseProgress): boolean {
  return progress.solved || progress.hintsRevealed >= exercise.hints.length;
}

/** La query attesa come si mostra allo studente: senza il rientro comune e senza righe vuote ai bordi. */
export function formatQuery(query: string): string {
  const lines = query.replace(/^\s*\n/, '').trimEnd().split('\n');
  const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => /^\s*/.exec(l)![0].length));
  return lines.map((l) => l.slice(indent)).join('\n');
}
