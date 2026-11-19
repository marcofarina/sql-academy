/**
 * Il ricalcolo del servizio accetta ogni progresso che le regole del portale
 * (F13) possono produrre e dà lo stesso saldo. Gira con `npm test` dalla
 * radice del portale; il typecheck del Worker lo esclude.
 */
import { describe, expect, it } from 'vitest';
import { withHint, withSolution, withVerification, type PointsExercise } from '../../../src/points/points.ts';
import { balanceOf, emptyProgress, type ThemeProgress } from '../../../src/progress/progress.ts';
import dati from './esercizi.json';
import { ricalcola } from './punti.ts';

/** Generatore pseudocasuale con seme, per partite ripetibili. */
function casuale(seme: number) {
  return () => {
    seme = (seme * 1103515245 + 12345) % 2 ** 31;
    return seme / 2 ** 31;
  };
}

function partita(tema: keyof typeof dati.themes, seme: number, mosse: number): ThemeProgress {
  const esercizi: PointsExercise[] = Object.entries(dati.themes[tema]).map(([id, es]) => ({
    id,
    difficulty: es.difficulty as PointsExercise['difficulty'],
    hints: Array.from({ length: es.hints }, () => ''),
  }));
  const r = casuale(seme);
  // Pochi esercizi per partita, così suggerimenti e soluzioni si accumulano sugli stessi.
  const scelti = Array.from({ length: 8 }, () => esercizi[Math.floor(r() * esercizi.length)]);
  let p = emptyProgress();
  for (let i = 0; i < mosse; i++) {
    const es = scelti[Math.floor(r() * scelti.length)];
    const x = r();
    if (x < 0.35) p = withHint(p, es);
    else if (x < 0.45) p = withSolution(p, es);
    else p = withVerification(p, es, r() < 0.5);
  }
  return p;
}

describe('ricalcolo della classifica', () => {
  for (const tema of Object.keys(dati.themes) as (keyof typeof dati.themes)[])
    it(`accetta 2000 partite oneste di ${tema} con il saldo del portale`, () => {
      for (let seme = 1; seme <= 2000; seme++) {
        const p = partita(tema, seme, 5 + (seme % 40));
        expect(ricalcola(tema, p), `seme ${seme}`).toEqual({ ok: true, punti: balanceOf(p) });
      }
    });

  it('respinge un esercizio risolto con meno spesa del dovuto', () => {
    let seme = 1;
    let p = partita('star-wars', seme, 40);
    while (!Object.values(p.exercises).some((e) => e.solutionBeforeSolve)) p = partita('star-wars', ++seme, 40);
    const id = Object.keys(p.exercises).find((k) => p.exercises[k].solutionBeforeSolve)!;
    const truccato = { ...p, exercises: { ...p.exercises, [id]: { ...p.exercises[id], pointsSpent: 0 } } };
    expect(ricalcola('star-wars', truccato).ok).toBe(false);
  });
});
