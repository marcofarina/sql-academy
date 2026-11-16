import { readdirSync } from 'node:fs';
import { expect, test } from 'vitest';
import { buildRegistry, findTheme, themes } from './registry.ts';

const manifest = { id: 'prova', title: 'Prova', description: '' };
const sql = { '../../themes/prova/x.sql': async () => 'SELECT 1;' };

test('scopre un tema per ogni cartella di themes/', () => {
  const folders = readdirSync(new URL('../../themes', import.meta.url), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  expect(folders).toContain('star-wars');
  expect(themes.map((theme) => theme.manifest.id)).toEqual(folders);
});

test('trova un tema per id', () => {
  expect(findTheme('star-wars')?.manifest.title).toBe('Star Wars');
  expect(findTheme('inesistente')).toBeUndefined();
});

test('lo script del database è lo schema seguito dai dati', async () => {
  const script = await findTheme('star-wars')!.loadDatabaseScript();
  expect(script.indexOf('CREATE TABLE pianeti')).toBeGreaterThanOrEqual(0);
  expect(script.indexOf('INSERT INTO pianeti')).toBeGreaterThan(script.indexOf('CREATE TABLE personaggi'));
});

test('rifiuta un manifest con id diverso dalla cartella', () => {
  expect(() =>
    buildRegistry({ '../../themes/altro/theme.ts': manifest }, sql, sql),
  ).toThrow(/diverso dal nome della cartella/);
});

test('rifiuta un id non valido', () => {
  expect(() =>
    buildRegistry({ '../../themes/Prova/theme.ts': { ...manifest, id: 'Prova' } }, sql, sql),
  ).toThrow(/non valido/);
});

test('rifiuta un tema senza schema.sql o dati.sql', () => {
  const manifests = { '../../themes/prova/theme.ts': manifest };
  expect(() => buildRegistry(manifests, {}, sql)).toThrow(/manca schema\.sql/);
  expect(() => buildRegistry(manifests, sql, {})).toThrow(/manca dati\.sql/);
});
