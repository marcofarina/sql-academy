/**
 * Registro dei temi: scopre le cartelle `themes/<id>/` al build.
 *
 * I manifest entrano nel pacchetto principale (servono per l’elenco dei temi);
 * i file SQL, gli esercizi, l’analisi e lo schema ER diventano moduli separati, scaricati quando lo studente apre il tema.
 */

import { THEME_ID_PATTERN, type ErDiagram, type Exercise, type Theme, type ThemeManifest } from './contract.ts';

type Loader<T> = () => Promise<T>;

/** Dal percorso di un file di un tema al nome della sua cartella. */
function folderOf(path: string): string {
  const match = /\/themes\/([^/]+)\/[^/]+$/.exec(path);
  if (!match) throw new Error(`Percorso di tema non riconosciuto: ${path}`);
  return match[1];
}

function byFolder<T>(modules: Record<string, T>): Map<string, T> {
  return new Map(Object.entries(modules).map(([path, value]) => [folderOf(path), value]));
}

/**
 * Costruisce l’elenco dei temi dai moduli trovati e controlla il contratto.
 * Separata da `import.meta.glob` per poterla provare con moduli finti.
 */
export function buildRegistry(
  manifestModules: Record<string, ThemeManifest>,
  schemaModules: Record<string, Loader<string>>,
  dataModules: Record<string, Loader<string>>,
  exerciseModules: Record<string, Loader<Exercise[]>> = {},
  erModules: Record<string, Loader<ErDiagram>> = {},
  analysisModules: Record<string, Loader<string>> = {},
): Theme[] {
  const schemas = byFolder(schemaModules);
  const data = byFolder(dataModules);
  const exercises = byFolder(exerciseModules);
  const ers = byFolder(erModules);
  const analyses = byFolder(analysisModules);

  return [...byFolder(manifestModules)]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([folder, manifest]) => {
      const where = `themes/${folder}`;
      if (!manifest || typeof manifest.id !== 'string') {
        throw new Error(`${where}/theme.ts non esporta un manifest come default`);
      }
      if (!THEME_ID_PATTERN.test(manifest.id)) {
        throw new Error(`${where}/theme.ts: id «${manifest.id}» non valido (minuscole, cifre, trattini)`);
      }
      if (manifest.id !== folder) {
        throw new Error(`${where}/theme.ts: l’id «${manifest.id}» è diverso dal nome della cartella`);
      }
      const loadSchema = schemas.get(folder);
      const loadData = data.get(folder);
      if (!loadSchema) throw new Error(`${where}: manca schema.sql`);
      if (!loadData) throw new Error(`${where}: manca dati.sql`);

      return {
        manifest,
        loadDatabaseScript: async () => `${await loadSchema()}\n${await loadData()}`,
        loadExercises: exercises.get(folder) ?? (async () => []),
        loadEr: ers.get(folder) ?? (async () => undefined),
        loadAnalysis: analyses.get(folder) ?? (async () => undefined),
      };
    });
}

/** I temi del portale, in ordine alfabetico di `id`. */
export const themes: Theme[] = buildRegistry(
  import.meta.glob<ThemeManifest>('../../themes/*/theme.ts', { eager: true, import: 'default' }),
  import.meta.glob<string>('../../themes/*/schema.sql', { query: '?raw', import: 'default' }),
  import.meta.glob<string>('../../themes/*/dati.sql', { query: '?raw', import: 'default' }),
  import.meta.glob<Exercise[]>('../../themes/*/esercizi.ts', { import: 'default' }),
  import.meta.glob<ErDiagram>('../../themes/*/er.ts', { import: 'default' }),
  import.meta.glob<string>('../../themes/*/analisi.md', { query: '?raw', import: 'default' }),
);

export function findTheme(id: string): Theme | undefined {
  return themes.find((theme) => theme.manifest.id === id);
}
