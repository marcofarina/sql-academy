/**
 * `npm run check:themes`: controlla esercizi, schema ER e fogli di stile di tutti i temi fuori
 * dal browser ed esce con un codice diverso da 0 se trova un problema.
 *
 * Gira in Node senza Vite, quindi non usa il registro (`import.meta.glob`):
 * legge le cartelle di `themes/` con gli stessi nomi di file del contratto.
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { checkErCoherence } from '../src/er/coherence.ts';
import { calcola } from '../src/er/layout.ts';
import { checkTheme } from '../src/exercises/check.ts';
import { unscopedSelectors } from '../src/themes/cssScope.ts';
import { readTables } from '../src/sandbox/session.ts';
import { createNodeEngine } from '../src/sql/testing/nodeEngine.ts';
import type { ErDiagram, Exercise, ThemeManifest } from '../src/themes/contract.ts';

const themesUrl = new URL('../themes/', import.meta.url);
const folders = readdirSync(themesUrl, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const engine = createNodeEngine();
const problems: string[] = [];

try {
  for (const folder of folders) {
    const file = (name: string) => new URL(`${folder}/${name}`, themesUrl);
    try {
      const manifest = ((await import(file('theme.ts').href)) as { default: ThemeManifest }).default;
      if (manifest?.id !== folder) throw new Error('l’id del manifest è diverso dal nome della cartella');

      const script = `${readFileSync(file('schema.sql'), 'utf8')}\n${readFileSync(file('dati.sql'), 'utf8')}`;
      const exercises = existsSync(file('esercizi.ts'))
        ? ((await import(file('esercizi.ts').href)) as { default: Exercise[] }).default
        : [];

      const found = await checkTheme(engine, { id: folder, script, exercises });

      // Schema ER: il disegno si calcola senza errori e corrisponde alle tabelle.
      let er = 'senza schema ER';
      if (existsSync(file('er.ts'))) {
        const diagram = ((await import(file('er.ts').href)) as { default: ErDiagram }).default;
        const database = await engine.open({ key: `${folder}/er`, script });
        const tables = (await readTables(database)).map((table) => table.name);
        await database.close();
        const erProblems = checkErCoherence(diagram, tables).map((p) => `${folder}/er.ts: ${p}`);
        try {
          calcola(diagram);
        } catch (error) {
          erProblems.push(`${folder}/er.ts: ${error instanceof Error ? error.message : String(error)}`);
        }
        found.push(...erProblems);
        er = `schema ER su ${tables.length} tabelle`;
      }

      // Fogli di stile: ogni selettore resta dentro il tema.
      const scopes = { 'stile.css': `.theme[data-theme-id="${folder}"]`, 'locandina.css': `.poster[data-theme-id="${folder}"]` };
      for (const [name, scope] of Object.entries(scopes)) {
        if (!existsSync(file(name))) continue;
        for (const selector of unscopedSelectors(readFileSync(file(name), 'utf8'), scope)) {
          found.push(`${folder}/${name}: il selettore «${selector}» non comincia con ${scope}`);
        }
      }

      problems.push(...found);
      const total = Array.isArray(exercises) ? exercises.length : 0;
      console.log(`${found.length === 0 ? '✓' : '✗'} ${folder}: ${total} esercizi, ${er}, ${found.length} problemi`);
    } catch (error) {
      problems.push(`${folder}: ${error instanceof Error ? error.message : String(error)}`);
      console.log(`✗ ${folder}: tema non caricato`);
    }
  }
} finally {
  engine.dispose();
}

for (const problem of problems) console.error(`  ${problem}`);
process.exitCode = problems.length === 0 ? 0 : 1;
