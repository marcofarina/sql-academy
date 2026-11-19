import { describe, expect, test } from 'vitest';
import {
  EMPTY_EXERCISE_PROGRESS,
  balanceOf,
  emptyProgress,
  exerciseProgress,
  resetProgress,
  type ThemeProgress,
} from '../progress/progress.ts';
import {
  HINT_COST,
  REWARD,
  SOLUTION_COST,
  canRevealHint,
  canRevealSolution,
  hintOffer,
  solutionOffer,
  walletOf,
  withHint,
  withSolution,
  withVerification,
  type PointsExercise,
} from './points.ts';

const easy: PointsExercise = { id: 'ex-facile', difficulty: 'facile', hints: ['uno', 'due'] };
const medium: PointsExercise = { id: 'ex-medio', difficulty: 'medio', hints: ['uno', 'due', 'tre'] };
const hard: PointsExercise = { id: 'ex-difficile', difficulty: 'difficile', hints: ['uno'] };
const other: PointsExercise = { id: 'ex-altro', difficulty: 'facile', hints: ['uno', 'due'] };

/** Progressi con un dato saldo, ottenuto da un esercizio già risolto e senza altre spese. */
function withBalance(balance: number, freeHintUsed = true): ThemeProgress {
  return {
    ...emptyProgress(),
    freeHintUsed,
    exercises: { banca: { ...EMPTY_EXERCISE_PROGRESS, solved: true, pointsEarned: balance } },
  };
}

const state = (progress: ThemeProgress, exercise: PointsExercise) => exerciseProgress(progress, exercise.id);

describe('tabelle dei prezzi', () => {
  test('premio 10/20/30, suggerimento 3/5/8, soluzione 20/40/60', () => {
    expect(REWARD).toEqual({ facile: 10, medio: 20, difficile: 30 });
    expect(HINT_COST).toEqual({ facile: 3, medio: 5, difficile: 8 });
    expect(SOLUTION_COST).toEqual({ facile: 20, medio: 40, difficile: 60 });
  });

  test('il suggerimento è un quarto del premio per eccesso, la soluzione il doppio', () => {
    for (const d of ['facile', 'medio', 'difficile'] as const) {
      expect(HINT_COST[d]).toBe(Math.ceil(REWARD[d] / 4));
      expect(SOLUTION_COST[d]).toBe(REWARD[d] * 2);
    }
  });
});

describe('regola 1: saldo per tema, da zero', () => {
  test('un tema nuovo ha saldo zero e l’aiuto gratuito intatto', () => {
    expect(walletOf(emptyProgress())).toEqual({ balance: 0, freeHintUsed: false });
  });

  test('i saldi di due temi sono indipendenti', () => {
    const a = withVerification(emptyProgress(), easy, true);
    const b = emptyProgress();
    expect(balanceOf(a)).toBe(10);
    expect(balanceOf(b)).toBe(0);
  });
});

describe('regola 2: il saldo non scende sotto zero', () => {
  test('un suggerimento che il saldo non copre non si apre, e il titolo dice quanti punti mancano', () => {
    const progress = withBalance(2);
    const offer = hintOffer(easy, state(progress, easy), walletOf(progress));
    expect(offer).toEqual({ status: 'available', cost: 3, waiver: null, missing: 1 });
    expect(canRevealHint(easy, state(progress, easy), walletOf(progress))).toBe(false);
    expect(withHint(progress, easy)).toBe(progress);
  });

  test('con il saldo giusto il suggerimento si apre e il saldo arriva a zero', () => {
    const progress = withHint(withBalance(3), easy);
    expect(state(progress, easy).hintsRevealed).toBe(1);
    expect(balanceOf(progress)).toBe(0);
  });

  test('la soluzione che il saldo non copre non si apre', () => {
    const progress = withBalance(19);
    const stuck = { ...progress, exercises: { ...progress.exercises, [easy.id]: { ...EMPTY_EXERCISE_PROGRESS, hintsRevealed: 2 } } };
    expect(solutionOffer(easy, state(stuck, easy), walletOf(stuck))).toEqual({
      status: 'available',
      cost: 20,
      waiver: null,
      missing: 1,
    });
    expect(withSolution(stuck, easy)).toBe(stuck);
  });
});

describe('regola 3: il primo aiuto del tema è gratuito, una volta sola', () => {
  test('il primo suggerimento è gratuito e consuma l’aiuto gratuito', () => {
    const progress = withHint(emptyProgress(), easy);
    expect(state(progress, easy)).toMatchObject({ hintsRevealed: 1, pointsSpent: 0 });
    expect(progress.freeHintUsed).toBe(true);
    expect(balanceOf(progress)).toBe(0);
  });

  test('su un altro esercizio dello stesso tema il primo suggerimento costa', () => {
    const progress = withHint(withBalance(10, false), easy);
    const next = withHint(progress, other);
    expect(state(next, other)).toMatchObject({ hintsRevealed: 1, pointsSpent: 3 });
    expect(balanceOf(next)).toBe(7);
  });

  test('anche con saldo zero il primo aiuto si apre; il secondo no', () => {
    const first = withHint(emptyProgress(), medium);
    expect(state(first, medium).hintsRevealed).toBe(1);
    const second = withHint(first, medium);
    expect(second).toBe(first);
    expect(hintOffer(medium, state(first, medium), walletOf(first))).toMatchObject({ status: 'available', cost: 5, missing: 5 });
  });

  test('l’aiuto gratuito è sempre un suggerimento, mai la soluzione', () => {
    const noHints: PointsExercise = { id: 'senza-suggerimenti', difficulty: 'facile', hints: [] };
    const progress = emptyProgress();
    expect(hintOffer(noHints, EMPTY_EXERCISE_PROGRESS, walletOf(progress))).toEqual({ status: 'unavailable' });
    expect(solutionOffer(noHints, EMPTY_EXERCISE_PROGRESS, walletOf(progress))).toMatchObject({ cost: 20, waiver: null });
    expect(withSolution(progress, noHints)).toBe(progress);
  });
});

describe('regola 4: i suggerimenti uno alla volta, ciascuno al suo prezzo, per sempre', () => {
  test('ogni suggerimento successivo costa il suo prezzo e resta aperto', () => {
    let progress = withBalance(20);
    progress = withHint(progress, medium);
    progress = withHint(progress, medium);
    expect(state(progress, medium)).toMatchObject({ hintsRevealed: 2, pointsSpent: 10 });
    expect(balanceOf(progress)).toBe(10);
    // Altri eventi non richiudono né rimborsano gli aiuti.
    progress = withVerification(progress, medium, false);
    expect(state(progress, medium)).toMatchObject({ hintsRevealed: 2, pointsSpent: 10 });
  });

  test('finiti i suggerimenti non ce n’è un altro da aprire', () => {
    let progress = withBalance(50);
    progress = withHint(progress, hard);
    expect(hintOffer(hard, state(progress, hard), walletOf(progress))).toEqual({ status: 'unavailable' });
    expect(withHint(progress, hard)).toBe(progress);
  });
});

describe('regola 5: la soluzione solo dopo tutti i suggerimenti', () => {
  test('prima dell’ultimo suggerimento la soluzione è bloccata, anche con il saldo', () => {
    let progress = withBalance(100);
    expect(solutionOffer(easy, state(progress, easy), walletOf(progress))).toEqual({ status: 'locked', cost: SOLUTION_COST.facile });
    progress = withHint(progress, easy);
    expect(solutionOffer(easy, state(progress, easy), walletOf(progress))).toEqual({ status: 'locked', cost: SOLUTION_COST.facile });
    expect(withSolution(progress, easy)).toBe(progress);
    expect(canRevealSolution(easy, state(progress, easy), walletOf(progress))).toBe(false);
  });

  test('dopo l’ultimo suggerimento la soluzione si compra al suo prezzo', () => {
    let progress = withBalance(100);
    progress = withHint(withHint(progress, easy), easy);
    const before = balanceOf(progress);
    progress = withSolution(progress, easy);
    expect(state(progress, easy)).toMatchObject({ solutionSeen: true, solutionBeforeSolve: true });
    expect(before - balanceOf(progress)).toBe(20);
  });

  test('la soluzione già vista non si ricompra', () => {
    let progress = withBalance(100);
    progress = withSolution(withHint(withHint(progress, easy), easy), easy);
    expect(solutionOffer(easy, state(progress, easy), walletOf(progress))).toEqual({ status: 'unavailable' });
    expect(withSolution(progress, easy)).toBe(progress);
  });
});

describe('regola 6: a esercizio risolto gli aiuti sono gratis', () => {
  const solvedProgress = withVerification(emptyProgress(), medium, true);

  test('suggerimenti gratis, anche con saldo zero dopo averli spesi', () => {
    const drained: ThemeProgress = {
      ...solvedProgress,
      freeHintUsed: true,
      exercises: { ...solvedProgress.exercises, [medium.id]: { ...state(solvedProgress, medium), pointsEarned: 0 } },
    };
    expect(hintOffer(medium, state(drained, medium), walletOf(drained))).toEqual({
      status: 'available',
      cost: 0,
      waiver: 'solved',
      missing: 0,
    });
    const next = withHint(withHint(drained, medium), medium);
    expect(state(next, medium)).toMatchObject({ hintsRevealed: 2, pointsSpent: 0 });
  });

  test('la soluzione è gratis senza aprire i suggerimenti', () => {
    const next = withSolution(solvedProgress, medium);
    expect(state(next, medium)).toMatchObject({ solutionSeen: true, solutionBeforeSolve: false, pointsSpent: 0 });
    expect(balanceOf(next)).toBe(20);
  });

  test('un aiuto gratis perché risolto non consuma l’aiuto gratuito del tema', () => {
    const next = withHint(solvedProgress, medium);
    expect(next.freeHintUsed).toBe(false);
  });
});

describe('regola 7: il premio è intero anche con suggerimenti', () => {
  test('risolvere dopo aver aperto i suggerimenti incassa tutto il premio', () => {
    let progress = withBalance(20);
    progress = withHint(withHint(progress, medium), medium);
    progress = withVerification(progress, medium, true);
    expect(state(progress, medium)).toMatchObject({ solved: true, pointsEarned: 20, pointsSpent: 10 });
    expect(balanceOf(progress)).toBe(20 + 20 - 10);
  });

  test('un tentativo sbagliato conta ma non dà punti', () => {
    const progress = withVerification(emptyProgress(), easy, false);
    expect(state(progress, easy)).toMatchObject({ solved: false, attempts: 1, pointsEarned: 0 });
  });

  test('il premio dipende dalla difficoltà', () => {
    expect(balanceOf(withVerification(emptyProgress(), easy, true))).toBe(10);
    expect(balanceOf(withVerification(emptyProgress(), medium, true))).toBe(20);
    expect(balanceOf(withVerification(emptyProgress(), hard, true))).toBe(30);
  });
});

describe('regola 8: risolto dopo aver visto la soluzione vale zero', () => {
  test('esercizio risolto ma zero punti', () => {
    let progress = withBalance(100);
    progress = withSolution(withHint(withHint(progress, easy), easy), easy);
    const spent = state(progress, easy).pointsSpent;
    progress = withVerification(progress, easy, true);
    expect(state(progress, easy)).toMatchObject({ solved: true, pointsEarned: 0, solutionBeforeSolve: true, pointsSpent: spent });
  });
});

describe('regola 9: rifare un esercizio risolto non dà punti', () => {
  test('una seconda risoluzione corretta non incassa di nuovo', () => {
    let progress = withVerification(emptyProgress(), easy, true);
    progress = withVerification(progress, easy, true);
    expect(state(progress, easy)).toMatchObject({ attempts: 2, pointsEarned: 10 });
    expect(balanceOf(progress)).toBe(10);
  });

  test('una verifica sbagliata dopo la risoluzione non toglie lo stato di risolto', () => {
    let progress = withVerification(emptyProgress(), easy, true);
    progress = withVerification(progress, easy, false);
    expect(state(progress, easy)).toMatchObject({ solved: true, pointsEarned: 10 });
  });

  test('vedere la soluzione dopo aver risolto non azzera il premio già incassato', () => {
    let progress = withVerification(emptyProgress(), easy, true);
    progress = withSolution(progress, easy);
    progress = withVerification(progress, easy, true);
    expect(state(progress, easy)).toMatchObject({ pointsEarned: 10, solutionBeforeSolve: false });
  });
});

describe('regola 10: azzerare restituisce aiuto gratuito e saldo', () => {
  test('saldo zero, aiuto gratuito di nuovo disponibile, epoca avanzata', () => {
    const used = withHint(withVerification(emptyProgress(), easy, true), other);
    expect(used.freeHintUsed).toBe(true);
    expect(balanceOf(used)).toBe(10);
    const reset = resetProgress(used);
    expect(balanceOf(reset)).toBe(0);
    expect(reset.exercises).toEqual({});
    expect(reset.freeHintUsed).toBe(false);
    expect(reset.epoch).toBe(used.epoch + 1);
    const again = withHint(reset, easy);
    expect(state(again, easy)).toMatchObject({ hintsRevealed: 1, pointsSpent: 0 });
  });
});

describe('regola 11: stesse regole per ogni tema', () => {
  test('prezzi e offerte dipendono solo dalla difficoltà, non dall’esercizio né dal tema', () => {
    const twin: PointsExercise = { ...easy, id: 'altro-tema:ex-001' };
    const progress = withBalance(5);
    expect(hintOffer(twin, EMPTY_EXERCISE_PROGRESS, walletOf(progress))).toEqual(
      hintOffer(easy, EMPTY_EXERCISE_PROGRESS, walletOf(progress)),
    );
  });
});

describe('esercizio senza soluzione acquistabile (CTF)', () => {
  const ctf: PointsExercise = { id: 'ctf-1', difficulty: 'difficile', hints: ['uno', 'due'], solutionAvailable: false };

  test('i suggerimenti si pagano, la soluzione non esiste', () => {
    let progress = withBalance(30, false);
    progress = withHint(progress, ctf);
    progress = withHint(progress, ctf);
    expect(state(progress, ctf)).toMatchObject({ hintsRevealed: 2, pointsSpent: 8 });
    expect(solutionOffer(ctf, state(progress, ctf), walletOf(progress))).toEqual({ status: 'unavailable' });
    expect(withSolution(progress, ctf)).toBe(progress);
  });

  test('anche da risolto la soluzione non c’è; il premio si incassa', () => {
    const progress = withVerification(emptyProgress(), ctf, true);
    expect(solutionOffer(ctf, state(progress, ctf), walletOf(progress))).toEqual({ status: 'unavailable' });
    expect(balanceOf(progress)).toBe(30);
  });
});

describe('forma dei dati per lo zaino e la classifica', () => {
  test('i campi usati dalle regole non diminuiscono mai', () => {
    let progress = emptyProgress();
    const steps = [
      (p: ThemeProgress) => withHint(p, easy),
      (p: ThemeProgress) => withVerification(p, easy, false),
      (p: ThemeProgress) => withVerification(p, easy, true),
      (p: ThemeProgress) => withHint(p, easy),
      (p: ThemeProgress) => withSolution(p, easy),
      (p: ThemeProgress) => withVerification(p, easy, true),
    ];
    let before = state(progress, easy);
    for (const step of steps) {
      progress = step(progress);
      const after = state(progress, easy);
      expect(after.attempts).toBeGreaterThanOrEqual(before.attempts);
      expect(after.hintsRevealed).toBeGreaterThanOrEqual(before.hintsRevealed);
      expect(after.pointsEarned).toBeGreaterThanOrEqual(before.pointsEarned);
      expect(after.pointsSpent).toBeGreaterThanOrEqual(before.pointsSpent);
      for (const flag of ['solved', 'solutionSeen', 'solutionBeforeSolve'] as const) {
        expect(Number(after[flag])).toBeGreaterThanOrEqual(Number(before[flag]));
      }
      before = after;
    }
  });
});
