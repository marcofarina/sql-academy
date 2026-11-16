import type { Exercise } from '../../src/themes/contract.ts';

// Segnaposto della fase F02: tre esercizi di esempio sul database ridotto.
// Gli esercizi completi arrivano con F04, i testi definitivi con F07.

const exercises: Exercise[] = [
  {
    id: 'pianeti-temperati',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['WHERE', 'ORDER BY'],
    title: 'Pianeti temperati',
    prompt: 'Elenca il nome dei pianeti con clima temperato, in ordine alfabetico.',
    expectedQuery: `
      SELECT nome
      FROM pianeti
      WHERE clima = 'temperato'
      ORDER BY nome`,
    hints: [
      'Il clima di un pianeta è nella colonna clima della tabella pianeti.',
      'Filtra le righe con WHERE e ordinale con ORDER BY.',
    ],
    tables: ['pianeti'],
  },
  {
    id: 'personaggi-e-pianeti',
    chapter: 'join',
    difficulty: 'medio',
    keywords: ['JOIN'],
    title: 'Da dove vengono',
    prompt: 'Per ogni personaggio di cui si conosce il pianeta, mostra il nome del personaggio e il nome del pianeta.',
    expectedQuery: `
      SELECT personaggi.nome, pianeti.nome AS pianeta
      FROM personaggi
      JOIN pianeti ON pianeti.id = personaggi.pianeta_id`,
    hints: [
      'I nomi dei pianeti sono nella tabella pianeti: la tabella personaggi ne contiene solo l’id.',
      'Collega le due tabelle con JOIN, confrontando personaggi.pianeta_id con pianeti.id.',
    ],
    tables: ['personaggi', 'pianeti'],
  },
  {
    id: 'personaggi-per-pianeta',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['LEFT JOIN', 'GROUP BY', 'COUNT'],
    title: 'Quanti per pianeta',
    prompt: 'Per ogni pianeta mostra il nome e il numero di personaggi che ne provengono, compresi i pianeti senza personaggi.',
    expectedQuery: `
      SELECT pianeti.nome, COUNT(personaggi.id) AS personaggi
      FROM pianeti
      LEFT JOIN personaggi ON personaggi.pianeta_id = pianeti.id
      GROUP BY pianeti.id`,
    hints: [
      'Un JOIN semplice scarta i pianeti senza personaggi: serve un LEFT JOIN che parte da pianeti.',
      'Raggruppa per pianeta e conta una colonna di personaggi, non le righe: COUNT(*) darebbe 1 anche ai pianeti vuoti.',
    ],
    tables: ['pianeti', 'personaggi'],
  },
];

export default exercises;
