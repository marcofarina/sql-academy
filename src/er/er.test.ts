import { expect, test } from 'vitest';
import { findTheme } from '../themes/registry.ts';
import { checkErCoherence } from './coherence.ts';
import { describeDiagram } from './describe.ts';
import { calcola } from './layout.ts';
import type { DiagrammaERProps } from './types.ts';

const diagram: DiagrammaERProps = {
  titolo: 'Studenti e case',
  entita: [
    { id: 'studente', tabella: 'studenti', col: 0, riga: 0, attributi: [{ nome: 'matricola', identificatore: true }, 'nome'] },
    { id: 'casa', tabella: 'case', col: 2, riga: 0, latoAttributi: 'sotto', attributi: ['nome'] },
    { id: 'corso', tabella: 'corsi', col: 0, riga: 2 },
  ],
  associazioni: [
    { id: 'appartiene', col: 1, riga: 0, tra: [{ entita: 'studente', card: '(1,1)' }, { entita: 'casa', card: '(0,N)' }] },
    { id: 'segue', tabella: 'iscrizioni', col: 0, riga: 1, tra: [{ entita: 'studente', card: '(0,N)' }, { entita: 'corso', card: '(0,N)' }] },
  ],
};

test('ER coerente con le tabelle: nessun problema', () => {
  expect(checkErCoherence(diagram, ['studenti', 'case', 'corsi', 'iscrizioni'])).toEqual([]);
});

test('una tabella senza entità né associazione è segnalata per nome', () => {
  expect(checkErCoherence(diagram, ['studenti', 'case', 'corsi', 'iscrizioni', 'professori'])).toEqual([
    'la tabella «professori» non compare nell’ER: dichiarala come tabella di un’entità o di un’associazione',
  ]);
});

test('un’entità che rimanda a una tabella inesistente è segnalata', () => {
  expect(checkErCoherence(diagram, ['studenti', 'case', 'iscrizioni'])).toEqual([
    'l’entità «corso» rimanda alla tabella «corsi», che non esiste',
  ]);
});

test('un’entità senza tabella e la tabella predefinita uguale all’id', () => {
  const d: DiagrammaERProps = {
    titolo: 'prova',
    entita: [
      { id: 'casa', col: 0, riga: 0 },
      { id: 'astratta', tabella: null, col: 1, riga: 0 },
    ],
  };
  expect(checkErCoherence(d, ['casa'])).toEqual([]);
});

test('due elementi sulla stessa tabella sono segnalati', () => {
  const d: DiagrammaERProps = {
    titolo: 'prova',
    entita: [
      { id: 'a', tabella: 't', col: 0, riga: 0 },
      { id: 'b', tabella: 't', col: 1, riga: 0 },
    ],
  };
  expect(checkErCoherence(d, ['t'])).toEqual(['l’entità «b» e l’entità «a» rimandano entrambe alla tabella «t»']);
});

test('la descrizione testuale nomina entità, attributi e cardinalità', () => {
  expect(describeDiagram(diagram)).toEqual([
    'Entità studente, con gli attributi matricola (identificatore) e nome.',
    'Entità casa, con gli attributi nome.',
    'Entità corso.',
    'Associazione appartiene fra studente (1,1) e casa (0,N).',
    'Associazione segue fra studente (0,N) e corso (0,N).',
  ]);
});

test('due linee dallo stesso lato di un’entità partono da punti diversi', () => {
  // Due associazioni in diagonale sotto «a»: entrambe escono dal lato inferiore.
  const d: DiagrammaERProps = {
    titolo: 'prova',
    entita: [
      { id: 'a', col: 1, riga: 0 },
      { id: 'b', col: 0, riga: 1 },
      { id: 'c', col: 2, riga: 1 },
    ],
    associazioni: [
      { id: 'r', col: 0, riga: 0.5, tra: [{ entita: 'a' }, { entita: 'b' }] },
      { id: 's', col: 2, riga: 0.5, tra: [{ entita: 'a' }, { entita: 'c' }] },
    ],
  };
  // Lato inferiore di «a»: cella 210 × 170 (predefinita), centro a y = 85, rettangolo alto 56.
  const bottom = 85 + 28;
  const starts = calcola(d)
    .forme.filter((f) => f.tipo === 'linea')
    .map((f) => /^M\s*(-?[\d.]+)[ ,]+(-?[\d.]+)/.exec(f.d)!.slice(1).map(Number))
    .filter(([, y]) => Math.abs(y - bottom) < 4);
  expect(starts).toHaveLength(2);
  expect(Math.abs(starts[0][0] - starts[1][0])).toBeGreaterThan(30);
});

test('lo schema ER di Star Wars si carica dal registro e si disegna', async () => {
  const theme = findTheme('star-wars');
  const er = await theme!.loadEr();
  expect(er?.entita).toHaveLength(7);
  expect(() => calcola(er!)).not.toThrow();
});
