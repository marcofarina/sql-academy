import { describe, expect, test } from 'vitest';
import { EMPTY_EXERCISE_PROGRESS } from '../progress/progress.ts';
import { costLabel, disabledReason, pointsLabel, rewardDescription, rewardStatus } from './labels.ts';
import type { PointsExercise } from './points.ts';

const medium: PointsExercise = { id: 'ex-medio', difficulty: 'medio', hints: ['uno'] };

describe('pointsLabel', () => {
  test('singolare e plurale', () => {
    expect(pointsLabel(1)).toBe('1 punto');
    expect(pointsLabel(0)).toBe('0 punti');
    expect(pointsLabel(5)).toBe('5 punti');
  });
});

describe('costLabel', () => {
  test('aiuto gratuito, primo del tema o a esercizio risolto', () => {
    expect(costLabel({ status: 'available', cost: 0, waiver: 'first', missing: 0 })).toBe('gratis');
    expect(costLabel({ status: 'available', cost: 0, waiver: 'solved', missing: 0 })).toBe('gratis');
  });

  test('aiuto a pagamento e soluzione bloccata mostrano il prezzo', () => {
    expect(costLabel({ status: 'available', cost: 5, waiver: null, missing: 0 })).toBe('5 punti');
    expect(costLabel({ status: 'locked', cost: 40 })).toBe('40 punti');
  });

  test('nulla da comprare, nessun prezzo', () => {
    expect(costLabel({ status: 'unavailable' })).toBe('');
  });
});

describe('disabledReason', () => {
  test('saldo insufficiente: quanto si ha e quanto manca', () => {
    expect(disabledReason({ status: 'available', cost: 3, waiver: null, missing: 3 }, 0)).toBe('Hai 0 punti: te ne mancano 3.');
    expect(disabledReason({ status: 'available', cost: 5, waiver: null, missing: 1 }, 4)).toBe('Hai 4 punti: te ne manca 1.');
    expect(disabledReason({ status: 'available', cost: 3, waiver: null, missing: 2 }, 1)).toBe('Hai 1 punto: te ne mancano 2.');
  });

  test('soluzione prima dell’ultimo suggerimento', () => {
    expect(disabledReason({ status: 'locked', cost: 20 }, 100)).toBe('La soluzione si apre dopo l’ultimo suggerimento.');
  });

  test('pulsante utilizzabile: nessun motivo', () => {
    expect(disabledReason({ status: 'available', cost: 3, waiver: null, missing: 0 }, 10)).toBeUndefined();
    expect(disabledReason({ status: 'unavailable' }, 0)).toBeUndefined();
  });
});

describe('premio di un esercizio', () => {
  test('da incassare', () => {
    expect(rewardStatus(EMPTY_EXERCISE_PROGRESS)).toBe('pending');
    expect(rewardDescription(medium, EMPTY_EXERCISE_PROGRESS)).toBe('Premio: 20 punti, da incassare');
  });

  test('incassato', () => {
    const state = { ...EMPTY_EXERCISE_PROGRESS, solved: true, pointsEarned: 20 };
    expect(rewardStatus(state)).toBe('earned');
    expect(rewardDescription(medium, state)).toBe('Premio: 20 punti, incassato');
  });

  test('perso: soluzione vista prima di risolvere, risolto o no', () => {
    const seen = { ...EMPTY_EXERCISE_PROGRESS, solutionSeen: true, solutionBeforeSolve: true };
    expect(rewardStatus(seen)).toBe('lost');
    expect(rewardStatus({ ...seen, solved: true })).toBe('lost');
    expect(rewardDescription(medium, seen)).toBe('Nessun premio: soluzione vista prima di risolvere');
  });
});
