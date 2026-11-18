import { describe, expect, it } from 'vitest';
import type { ThemeStats } from '../themes/contract.ts';
import { credits, deckPlacement, POSTER_WIDTH, scatter } from './homeLayout.ts';

const stats = (names: string[], exercises: number): ThemeStats => ({
  tables: names.map((name) => ({ name, rows: 1 })),
  exercises,
  byDifficulty: { facile: 0, medio: 0, difficile: 0 },
  byChapter: { 'una-tabella': 0, join: 0, aggregazioni: 0, 'sottoquery-viste': 0 },
});

describe('scatter', () => {
  it('mette una locandina per fascia, dentro il tavolo, nei limiti della specifica', () => {
    for (const seed of [0, 0.25, 0.5, 0.99]) {
      let n = seed;
      const random = () => (n = (n * 9301 + 0.49297) % 1);
      const placements = scatter(4, 1280, random);
      expect(placements).toHaveLength(4);
      const bands = placements.map((p) => Math.floor((p.x + POSTER_WIDTH / 2 + 70) / 320)).sort();
      expect(new Set(bands).size).toBeGreaterThanOrEqual(3);
      for (const p of placements) {
        expect(p.x).toBeGreaterThanOrEqual(0);
        expect(p.x).toBeLessThanOrEqual(1280 - POSTER_WIDTH);
        expect(p.y).toBeGreaterThanOrEqual(250);
        expect(p.y).toBeLessThanOrEqual(460);
        expect(Math.abs(p.rotate)).toBeLessThanOrEqual(15);
      }
    }
  });
});

describe('deckPlacement', () => {
  it('lascia dritta e centrata la locandina in cima e scala del 3 % le altre', () => {
    expect(deckPlacement(0, 375)).toEqual({ x: (375 - POSTER_WIDTH) / 2, y: 12, rotate: -0, scale: 1 });
    expect(deckPlacement(2, 375).scale).toBeCloseTo(0.94);
  });
});

describe('credits', () => {
  it('elenca le tabelle con «e» prima dell’ultima e conta gli esercizi', () => {
    expect(credits(stats(['pianeti', 'specie', 'battaglie'], 105))).toBe('con pianeti specie e battaglie, in 105 esercizi');
    expect(credits(stats(['libri'], 1))).toBe('con libri, in 1 esercizio');
  });
});
