/**
 * `npm run classifica:dati`: scrive `servizi/classifica/src/esercizi.json`, i
 * dati con cui il servizio della classifica (F16) ricalcola i punti: le
 * tabelle dei premi e dei prezzi di `src/points/points.ts` e, per ogni tema,
 * difficoltà e numero di suggerimenti di ogni esercizio.
 *
 * Con `--controlla` non scrive: esce con 1 se il file è diverso da quello che
 * scriverebbe, cioè se un tema è cambiato e il servizio non lo sa ancora.
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { HINT_COST, REWARD, SOLUTION_COST } from '../src/points/points.ts';
import type { Exercise } from '../src/themes/contract.ts';

const themesUrl = new URL('../themes/', import.meta.url);
const outUrl = new URL('../servizi/classifica/src/esercizi.json', import.meta.url);

const themes: Record<string, Record<string, { difficulty: string; hints: number }>> = {};
const folders = readdirSync(themesUrl, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
for (const folder of folders) {
  const file = new URL(`${folder}/esercizi.ts`, themesUrl);
  if (!existsSync(file)) continue;
  const exercises = ((await import(file.href)) as { default: Exercise[] }).default;
  themes[folder] = Object.fromEntries(
    exercises.map((exercise) => [exercise.id, { difficulty: exercise.difficulty, hints: exercise.hints.length }]),
  );
}

const text = `${JSON.stringify({ reward: REWARD, hintCost: HINT_COST, solutionCost: SOLUTION_COST, themes }, null, 1)}\n`;

if (process.argv.includes('--controlla')) {
  const current = existsSync(outUrl) ? readFileSync(outUrl, 'utf8') : '';
  if (current !== text) {
    console.error('servizi/classifica/src/esercizi.json non è aggiornato: esegui npm run classifica:dati');
    process.exit(1);
  }
  console.log('servizi/classifica/src/esercizi.json è aggiornato.');
} else {
  writeFileSync(outUrl, text);
  const counts = Object.entries(themes).map(([id, list]) => `${id} ${Object.keys(list).length}`);
  console.log(`Scritto servizi/classifica/src/esercizi.json (${counts.join(', ')}).`);
}
