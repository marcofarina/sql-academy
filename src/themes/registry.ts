/**
 * Registro dei temi: scopre le cartelle `themes/<id>/` al build.
 *
 * I manifest entrano nel pacchetto principale (servono per l’elenco dei temi);
 * i file SQL e gli esercizi diventano moduli separati, scaricati quando lo studente apre il tema.
 */

import { THEME_ID_PATTERN, type Exercise, type Theme, type ThemeManifest } from './contract.ts';

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
): Theme[] {
  const schemas = byFolder(schemaModules);
  const data = byFolder(dataModules);
  const exercises = byFolder(exerciseModules);

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
      };
    });
}

/** I temi del portale, in ordine alfabetico di `id`. */
export const themes: Theme[] = buildRegistry(
  import.meta.glob<ThemeManifest>('../../themes/*/theme.ts', { eager: true, import: 'default' }),
  import.meta.glob<string>('../../themes/*/schema.sql', { query: '?raw', import: 'default' }),
  import.meta.glob<string>('../../themes/*/dati.sql', { query: '?raw', import: 'default' }),
  import.meta.glob<Exercise[]>('../../themes/*/esercizi.ts', { import: 'default' }),
);

export function findTheme(id: string): Theme | undefined {
  return themes.find((theme) => theme.manifest.id === id);
}
