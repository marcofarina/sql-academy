import type { LogicalLayout } from '../../src/themes/contract.ts';

// Modello logico del database del Signore degli Anelli: le tabelle su una
// griglia di quattro colonne e due righe. Le due tabelle molti a molti,
// partecipazioni e tappe, stanno fra le tabelle che collegano.

const layout: LogicalLayout = {
  tabelle: {
    popoli: { col: 0, riga: 0 },
    personaggi: { col: 1, riga: 0 },
    partecipazioni: { col: 2, riga: 0 },
    battaglie: { col: 3, riga: 0 },
    armi: { col: 0, riga: 1 },
    tappe: { col: 1, riga: 1 },
    luoghi: { col: 2, riga: 1 },
  },
};

export default layout;
