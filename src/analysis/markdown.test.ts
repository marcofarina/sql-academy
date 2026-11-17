import { expect, test } from 'vitest';
import { findTheme } from '../themes/registry.ts';
import { parseInline, parseMarkdown } from './markdown.ts';

test('titoli, paragrafi su più righe ed elenchi diventano blocchi', () => {
  const blocks = parseMarkdown('# Titolo\n\nPrima riga\nseconda riga.\n\n- uno\n- due\n');
  expect(blocks).toEqual([
    { kind: 'heading', level: 1, content: [{ kind: 'text', text: 'Titolo' }] },
    { kind: 'paragraph', content: [{ kind: 'text', text: 'Prima riga seconda riga.' }] },
    {
      kind: 'list',
      items: [[{ kind: 'text', text: 'uno' }], [{ kind: 'text', text: 'due' }]],
    },
  ]);
});

test('corsivo e grassetto dentro una riga', () => {
  expect(parseInline('un *termine* e un **concetto** qui')).toEqual([
    { kind: 'text', text: 'un ' },
    { kind: 'em', text: 'termine' },
    { kind: 'text', text: ' e un ' },
    { kind: 'strong', text: 'concetto' },
    { kind: 'text', text: ' qui' },
  ]);
});

test('l’analisi di Star Wars si carica dal registro', async () => {
  const text = await findTheme('star-wars')!.loadAnalysis();
  expect(text).toMatch(/^# /);
  expect(parseMarkdown(text!).length).toBeGreaterThan(5);
});
