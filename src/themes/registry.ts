/**
 * Registro dei temi: scopre le cartelle `themes/<id>/` al build.
 *
 * I manifest entrano nel pacchetto principale (servono per l’elenco dei temi);
 * i file SQL, gli esercizi, la traccia, lo schema ER e le posizioni del modello logico diventano moduli separati, scaricati quando lo studente apre il tema.
 */

import themeStats from 'virtual:theme-stats';
import { THEME_ID_PATTERN, type ErDiagram, type Exercise, type LogicalLayout, type Theme, type ThemeManifest, type ThemeStats } from './contract.ts';
import { iconName } from '../icons/registry.ts';
import { PORTAL_PAGES } from '../routing/route.ts';

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

/** Dalle icone trovate nelle cartelle `icone/` dei temi alle icone di ogni tema, per nome. */
function iconsByFolder(modules: Record<string, string>): Map<string, Record<string, string>> {
  const result = new Map<string, Record<string, string>>();
  for (const [path, svg] of Object.entries(modules)) {
    const match = /\/themes\/([^/]+)\/icone\/[^/]+\.svg$/.exec(path);
    if (!match) throw new Error(`Percorso di icona di tema non riconosciuto: ${path}`);
    const icons = result.get(match[1]) ?? {};
    icons[iconName(path)] = svg;
    result.set(match[1], icons);
  }
  return result;
}

/** Le icone che il manifest cita devono esistere in `icone/`. */
function checkIcons(where: string, manifest: ThemeManifest, icons: Record<string, string>): void {
  const sets = [manifest.icons, ...Object.values(manifest.schemes ?? {})];
  for (const set of sets) {
    const { sections, ...single } = set ?? {};
    for (const name of [...Object.values(single), ...Object.values(sections ?? {})]) {
      if (!icons[name]) throw new Error(`${where}/theme.ts: l’icona «${name}» non è in icone/`);
    }
  }
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
  traceModules: Record<string, Loader<string>> = {},
  iconModules: Record<string, string> = {},
  stats: Record<string, ThemeStats> = {},
  logicalModules: Record<string, Loader<LogicalLayout>> = {},
): Theme[] {
  const icons = iconsByFolder(iconModules);
  const schemas = byFolder(schemaModules);
  const data = byFolder(dataModules);
  const exercises = byFolder(exerciseModules);
  const ers = byFolder(erModules);
  const traces = byFolder(traceModules);
  const logicals = byFolder(logicalModules);

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
      if ((PORTAL_PAGES as readonly string[]).includes(manifest.id)) {
        throw new Error(`${where}/theme.ts: l’id «${manifest.id}» è riservato a una pagina del portale`);
      }
      if (manifest.id !== folder) {
        throw new Error(`${where}/theme.ts: l’id «${manifest.id}» è diverso dal nome della cartella`);
      }
      const loadSchema = schemas.get(folder);
      const loadData = data.get(folder);
      if (!loadSchema) throw new Error(`${where}: manca schema.sql`);
      if (!loadData) throw new Error(`${where}: manca dati.sql`);
      const themeIcons = icons.get(folder) ?? {};
      checkIcons(where, manifest, themeIcons);

      return {
        manifest,
        icons: themeIcons,
        stats: stats[folder],
        loadDatabaseScript: async () => `${await loadSchema()}\n${await loadData()}`,
        loadExercises: exercises.get(folder) ?? (async () => []),
        loadEr: ers.get(folder) ?? (async () => undefined),
        loadTrace: traces.get(folder) ?? (async () => undefined),
        loadLogical: logicals.get(folder) ?? (async () => undefined),
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
  import.meta.glob<string>('../../themes/*/traccia.md', { query: '?raw', import: 'default' }),
  import.meta.glob<string>('../../themes/*/icone/*.svg', { query: '?raw', import: 'default', eager: true }),
  themeStats,
  import.meta.glob<LogicalLayout>('../../themes/*/logico.ts', { import: 'default' }),
);

// I fogli di stile dei temi entrano tutti nella pagina: ogni regola è confinata al proprio tema (vedi contract.ts).
import.meta.glob('../../themes/*/stile.css', { eager: true });
import.meta.glob('../../themes/*/locandina.css', { eager: true });

export function findTheme(id: string): Theme | undefined {
  return themes.find((theme) => theme.manifest.id === id);
}
