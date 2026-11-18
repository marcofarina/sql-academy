import type { ErDiagram } from '../../src/themes/contract.ts';

// Schema ER del database del Signore degli Anelli. Le chiavi esterne sono
// associazioni uno a molti; partecipa e tappa sono molti a molti, con le loro
// tabelle (partecipazioni, tappe) e i loro attributi.
// La griglia ha celle di 240 × 170 px; `col` e `riga` partono da 0.

const diagram: ErDiagram = {
  titolo: 'Schema ER del database del Signore degli Anelli',
  cella: [240, 170],
  entita: [
    {
      id: 'popolo',
      tabella: 'popoli',
      col: 0,
      riga: 1,
      latoAttributi: 'sinistra',
      attributi: [{ nome: 'id', identificatore: true }, 'nome', { nome: 'lingua', card: '(0,1)' }, 'immortale'],
    },
    {
      id: 'personaggio',
      tabella: 'personaggi',
      col: 2,
      riga: 2,
      latoAttributi: 'sinistra',
      attributi: [
        { nome: 'id', identificatore: true },
        'nome',
        { nome: 'anno_nascita', card: '(0,1)' },
        'ruolo',
        'membro_compagnia',
      ],
    },
    {
      id: 'arma',
      tabella: 'armi',
      col: 4,
      riga: 1,
      latoAttributi: 'destra',
      attributi: [{ nome: 'id', identificatore: true }, 'nome', 'tipo'],
    },
    {
      id: 'battaglia',
      tabella: 'battaglie',
      col: 4,
      riga: 2,
      latoAttributi: 'destra',
      attributi: [{ nome: 'id', identificatore: true }, 'nome', 'anno', 'vincitore'],
    },
    {
      id: 'luogo',
      tabella: 'luoghi',
      col: 2,
      riga: 4,
      latoAttributi: 'sotto',
      attributi: [{ nome: 'id', identificatore: true }, 'nome', 'regione', 'tipo'],
    },
  ],
  associazioni: [
    {
      id: 'appartiene',
      col: 1,
      riga: 1,
      tra: [
        { entita: 'personaggio', card: '(1,1)' },
        { entita: 'popolo', card: '(0,N)' },
      ],
    },
    {
      id: 'porta',
      col: 3,
      riga: 1,
      tra: [
        { entita: 'personaggio', card: '(0,N)' },
        { entita: 'arma', card: '(1,1)' },
      ],
    },
    {
      id: 'partecipa',
      tabella: 'partecipazioni',
      col: 3,
      riga: 2,
      tra: [
        { entita: 'personaggio', card: '(0,N)' },
        { entita: 'battaglia', card: '(1,N)' },
      ],
      attributi: ['schieramento'],
      latoAttributi: 'sopra',
    },
    {
      id: 'proviene',
      col: 1,
      riga: 3,
      tra: [
        { entita: 'personaggio', card: '(0,1)' },
        { entita: 'luogo', card: '(0,N)' },
      ],
    },
    {
      id: 'tappa',
      tabella: 'tappe',
      col: 3,
      riga: 3,
      tra: [
        { entita: 'personaggio', card: '(0,N)' },
        { entita: 'luogo', card: '(0,N)' },
      ],
      attributi: ['ordine', 'anno'],
      latoAttributi: 'sotto',
    },
    {
      id: 'si_svolge',
      etichetta: 'si svolge',
      col: 4,
      riga: 4,
      tra: [
        { entita: 'luogo', card: '(0,N)' },
        { entita: 'battaglia', card: '(1,1)' },
      ],
    },
  ],
};

export default diagram;
