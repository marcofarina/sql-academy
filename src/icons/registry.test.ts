import { readdirSync } from 'node:fs';
import { expect, test } from 'vitest';
import { SECTIONS } from '../routing/route.ts';
import { commonIcons, iconName, prepareSvg } from './registry.ts';

test('trova ogni file di src/assets/icons', () => {
  const files = readdirSync(new URL('../assets/icons/', import.meta.url)).filter((f) => f.endsWith('.svg'));
  expect(Object.keys(commonIcons).sort()).toEqual(files.map((f) => f.replace(/\.svg$/, '')).sort());
});

test('ogni icona comune è un file RB Icons', () => {
  for (const [name, svg] of Object.entries(commonIcons)) {
    expect(svg, name).toContain(`<!-- RB Icons · ${name} -->`);
    expect(svg, name).not.toMatch(/fa-|Font Awesome/i);
  }
});

test('le icone delle sezioni esistono', () => {
  for (const section of SECTIONS) expect(commonIcons[section.icon], section.id).toBeDefined();
});

test('ricava il nome dal percorso', () => {
  expect(iconName('../assets/icons/circle-play.svg')).toBe('circle-play');
});

test('icona decorativa nascosta, icona con titolo annunciata', () => {
  const svg = commonIcons['circle-play'];
  expect(prepareSvg(svg)).toMatch(/^<svg class="icon" aria-hidden="true" focusable="false" xmlns=/);
  const titled = prepareSvg(svg, 'Esegui <query>');
  expect(titled).toContain('role="img"');
  expect(titled).toContain('<title>Esegui &lt;query&gt;</title>');
  expect(titled).not.toContain('aria-hidden');
});
