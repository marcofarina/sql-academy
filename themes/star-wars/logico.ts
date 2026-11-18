import type { LogicalLayout } from '../../src/themes/contract.ts';

// Modello logico del database Star Wars: le tabelle su una griglia di quattro
// colonne e due righe. Personaggi e fazioni stanno al centro, perché quasi
// tutte le chiavi esterne arrivano lì; ogni linea resta fra colonne vicine.

const layout: LogicalLayout = {
  tabelle: {
    spade_laser: { col: 0, riga: 0 },
    personaggi: { col: 1, riga: 0 },
    fazioni: { col: 2, riga: 0 },
    astronavi: { col: 3, riga: 0 },
    specie: { col: 0, riga: 1 },
    pianeti: { col: 1, riga: 1 },
    battaglie: { col: 2, riga: 1 },
  },
};

export default layout;
