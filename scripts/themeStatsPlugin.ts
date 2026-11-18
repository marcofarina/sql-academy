/**
 * Plugin di Vite: il modulo virtuale `virtual:theme-stats` esporta, per ogni
 * tema, i conteggi della scheda della locandina (`ThemeStats`), calcolati al
 * build eseguendo `schema.sql` e `dati.sql` con sql.js in Node.
 *
 * Con `npm run dev` il modulo si ricalcola quando cambia un file di un tema.
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import initSqlJs from 'sql.js';
import type { Plugin } from 'vite';
import type { Exercise, ThemeStats } from '../src/themes/contract.ts';
import { countExercises, countTables } from '../src/themes/stats.ts';

const VIRTUAL_ID = 'virtual:theme-stats';
const RESOLVED_ID = `\0${VIRTUAL_ID}`;

export async function computeThemeStats(themesDir: string): Promise<Record<string, ThemeStats>> {
  const require = createRequire(import.meta.url);
  const SQL = await initSqlJs({ locateFile: (file: string) => require.resolve(`sql.js/dist/${file}`) });
  const result: Record<string, ThemeStats> = {};
  const folders = readdirSync(themesDir, { withFileTypes: true }).filter((e) => e.isDirectory());
  for (const { name } of folders) {
    const dir = join(themesDir, name);
    if (!existsSync(join(dir, 'schema.sql')) || !existsSync(join(dir, 'dati.sql'))) continue;
    const db = new SQL.Database();
    try {
      db.exec(`${readFileSync(join(dir, 'schema.sql'), 'utf8')}\n${readFileSync(join(dir, 'dati.sql'), 'utf8')}`);
      const exercisesFile = join(dir, 'esercizi.ts');
      // Il parametro evita la cache dei moduli di Node quando il file cambia durante `npm run dev`.
      const exercises = existsSync(exercisesFile)
        ? ((await import(`${pathToFileURL(exercisesFile).href}?t=${Date.now()}`)) as { default: Exercise[] }).default
        : [];
      result[name] = { tables: countTables(db), ...countExercises(exercises) };
    } finally {
      db.close();
    }
  }
  return result;
}

export function themeStatsPlugin(themesDir: string): Plugin {
  return {
    name: 'theme-stats',
    resolveId: (id) => (id === VIRTUAL_ID ? RESOLVED_ID : undefined),
    async load(id) {
      if (id !== RESOLVED_ID) return;
      this.addWatchFile(themesDir);
      return `export default ${JSON.stringify(await computeThemeStats(themesDir))};`;
    },
    handleHotUpdate({ file, server }) {
      if (!file.startsWith(themesDir) || !/\.(sql|ts)$/.test(file)) return;
      const module = server.moduleGraph.getModuleById(RESOLVED_ID);
      if (module) server.moduleGraph.invalidateModule(module);
    },
  };
}
