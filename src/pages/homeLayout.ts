/**
 * Disposizione delle locandine sulla pagina iniziale (docs/design/neutra.md,
 * sezioni «Composizione» e «Movimento»), senza React.
 */

import type { ThemeStats } from '../themes/contract.ts';

/** Locandina chiusa, in px. */
export const POSTER_WIDTH = 230;
export const POSTER_HEIGHT = 345;

/** Posizione di una locandina sul tavolo: angolo in alto a sinistra, inclinazione in gradi, scala. */
export interface Placement {
  x: number;
  y: number;
  rotate: number;
  scale: number;
}

/** Numero di locandine sul tavolo: i temi, completati con «Prossimamente» fino a quattro. */
export const MIN_POSTERS = 4;

const between = (random: () => number, min: number, max: number) => min + random() * (max - min);

/** Mescola una copia dell’elenco (Fisher–Yates). */
function shuffle<T>(items: T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Lancia `count` locandine su un tavolo largo `width`: fasce orizzontali uguali
 * assegnate a caso, scarto di ±70 px, fra 250 e 460 px dall’alto, inclinazione
 * fra −15° e +15°. Le locandine restano dentro il tavolo.
 */
export function scatter(count: number, width: number, random: () => number = Math.random): Placement[] {
  const bands = shuffle(
    Array.from({ length: count }, (_, i) => i),
    random,
  );
  const bandWidth = width / count;
  return bands.map((band) => {
    const centre = bandWidth * (band + 0.5) + between(random, -70, 70);
    return {
      x: clamp(centre - POSTER_WIDTH / 2, 0, Math.max(0, width - POSTER_WIDTH)),
      y: between(random, 250, 460),
      rotate: between(random, -15, 15),
      scale: 1,
    };
  });
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Il mazzo a 375 px: la locandina in cima dritta e centrata, le altre dietro,
 * scalate del 3 % ciascuna, spostate e inclinate di pochi gradi.
 * `depth` è la distanza dalla cima (0 = in cima).
 */
export function deckPlacement(depth: number, width: number): Placement {
  const side = depth % 2 === 1 ? 1 : -1;
  return {
    x: (width - POSTER_WIDTH) / 2 + side * depth * 9,
    y: 12 + depth * 5,
    rotate: side * depth * 2.5,
    scale: 1 - 0.03 * depth,
  };
}

export function transformOf({ x, y, rotate, scale }: Placement): string {
  return `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${scale})`;
}

/** Crediti da cartellone: «con pianeti personaggi … e battaglie, in 105 esercizi». */
export function credits(stats: ThemeStats): string {
  const names = stats.tables.map((t) => t.name);
  const list = names.length > 1 ? `${names.slice(0, -1).join(' ')} e ${names[names.length - 1]}` : (names[0] ?? '');
  const exercises = `${stats.exercises} ${stats.exercises === 1 ? 'esercizio' : 'esercizi'}`;
  return list ? `con ${list}, in ${exercises}` : `in ${exercises}`;
}
