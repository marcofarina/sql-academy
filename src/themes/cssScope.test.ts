import { expect, test } from 'vitest';
import { unscopedSelectors } from './cssScope.ts';

const scope = '.theme[data-theme-id="prova"]';

test('accetta selettori confinati, anche dentro @media, e regole senza selettori', () => {
  const css = `
    @font-face { font-family: 'X'; src: url(x.ttf); }
    /* commento { } */
    ${scope} { --color-bg: red; }
    ${scope}[data-scheme='scuro'] .page, ${scope} h1 { color: blue; }
    @media (max-width: 40rem) { ${scope} .sections { display: none; } }
    @keyframes pulsa { from { opacity: 0; } to { opacity: 1; } }
  `;
  expect(unscopedSelectors(css, scope)).toEqual([]);
});

test('segnala i selettori che escono dal tema', () => {
  const css = `body { margin: 0; } ${scope} p, .page { color: red; } @media print { h1 { color: black; } }`;
  expect(unscopedSelectors(css, scope)).toEqual(['body', '.page', 'h1']);
});
