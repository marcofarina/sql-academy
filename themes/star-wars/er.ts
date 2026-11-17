import type { ErDiagram } from '../../src/themes/contract.ts';

// Schema ER del database Star Wars. Ogni chiave esterna è un’associazione uno
// a molti; fra personaggio e fazione ce ne sono due: l’appartenenza (milita) e
// la guida (un personaggio può guidare più fazioni, una fazione ha un leader).
// La griglia ha celle di 240 × 170 px; `col` e `riga` partono da 0.

const diagram: ErDiagram = {
  titolo: 'Schema ER del database Star Wars',
  cella: [240, 170],
  entita: [
    {
      id: 'specie',
      tabella: 'specie',
      col: 0,
      riga: 1,
      latoAttributi: 'sinistra',
      attributi: [{ nome: 'id', identificatore: true }, 'nome', 'linguaggio', 'aspettativa_vita_media'],
    },
    {
      id: 'pianeta',
      tabella: 'pianeti',
      col: 0,
      riga: 3,
      latoAttributi: 'sinistra',
      attributi: [{ nome: 'id', identificatore: true }, 'nome', 'clima', 'terreno', 'popolazione', 'settore_galattico'],
    },
    {
      id: 'personaggio',
      tabella: 'personaggi',
      col: 2,
      riga: 2,
      latoAttributi: 'sinistra',
      attributi: [{ nome: 'id', identificatore: true }, 'nome', 'anno_nascita_bby', 'sensibile_alla_forza', 'ruolo'],
    },
    {
      id: 'spada_laser',
      etichetta: 'spada laser',
      tabella: 'spade_laser',
      col: 4,
      riga: 1,
      latoAttributi: 'destra',
      attributi: [{ nome: 'id', identificatore: true }, 'colore_lama', 'tipo_cristallo', 'impugnatura'],
    },
    {
      id: 'fazione',
      tabella: 'fazioni',
      col: 4,
      riga: 2,
      latoAttributi: 'sopra',
      attributi: [{ nome: 'id', identificatore: true }, 'nome', 'tipo', 'motto'],
    },
    {
      id: 'astronave',
      tabella: 'astronavi',
      col: 5,
      riga: 3,
      latoAttributi: 'destra',
      attributi: [
        { nome: 'id', identificatore: true },
        'nome',
        'modello',
        'costruttore',
        'lunghezza_metri',
        'velocita_iperguida',
        'capacita_equipaggio',
      ],
    },
    {
      id: 'battaglia',
      tabella: 'battaglie',
      col: 2,
      riga: 4,
      latoAttributi: 'sotto',
      attributi: [{ nome: 'id', identificatore: true }, 'nome', 'anno_bby', 'perdite_stimate'],
    },
  ],
  associazioni: [
    {
      id: 'appartiene',
      col: 1,
      riga: 1,
      tra: [
        { entita: 'personaggio', card: '(1,1)' },
        { entita: 'specie', card: '(0,N)' },
      ],
    },
    {
      id: 'proviene',
      col: 0,
      riga: 2,
      tra: [
        { entita: 'specie', card: '(1,1)' },
        { entita: 'pianeta', card: '(0,N)' },
      ],
    },
    {
      id: 'nasce',
      col: 1,
      riga: 3,
      tra: [
        { entita: 'personaggio', card: '(0,1)' },
        { entita: 'pianeta', card: '(0,N)' },
      ],
    },
    {
      id: 'impugna',
      col: 3,
      riga: 1,
      tra: [
        { entita: 'personaggio', card: '(0,N)' },
        { entita: 'spada_laser', card: '(1,1)' },
      ],
    },
    {
      id: 'milita',
      col: 3,
      riga: 2,
      tra: [
        { entita: 'personaggio', card: '(1,1)' },
        { entita: 'fazione', card: '(1,N)' },
      ],
    },
    {
      id: 'guida',
      col: 3,
      riga: 3,
      tra: [
        { entita: 'personaggio', card: '(0,N)' },
        { entita: 'fazione', card: '(1,1)' },
      ],
    },
    {
      id: 'possiede',
      col: 5,
      riga: 2,
      tra: [
        { entita: 'fazione', card: '(0,N)' },
        { entita: 'astronave', card: '(1,1)' },
      ],
    },
    {
      id: 'si_svolge',
      etichetta: 'si svolge',
      col: 1,
      riga: 4,
      tra: [
        { entita: 'pianeta', card: '(0,N)' },
        { entita: 'battaglia', card: '(1,1)' },
      ],
    },
    {
      id: 'vince',
      col: 3,
      riga: 4,
      tra: [
        { entita: 'battaglia', card: '(1,1)' },
        { entita: 'fazione', card: '(0,N)' },
      ],
    },
  ],
};

export default diagram;
