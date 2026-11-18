import type { Exercise } from '../../src/themes/contract.ts';

// Esercizi del tema Il Signore degli Anelli, cinque per capitolo, verificati su SQLite.
// Il capitolo di ogni esercizio è la clausola più avanzata della query attesa:
// sottoquery, poi raggruppamenti e funzioni di aggregazione, poi join, poi una tabella.

const exercises: Exercise[] = [
  // Una tabella
  {
    id: 'ex-001',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'La Compagnia dell’Anello',
    prompt: 'Mostra il nome e il ruolo dei personaggi che hanno fatto parte della Compagnia dell’Anello.',
    expectedQuery: `
      SELECT nome, ruolo
      FROM personaggi
      WHERE membro_compagnia = 1`,
    hints: [
      'Ti servono solo le righe della tabella personaggi che rispettano una condizione: usa WHERE.',
      'La colonna membro_compagnia vale 1 per i membri della Compagnia e 0 per tutti gli altri.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-002',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE', 'ORDER BY'],
    title: 'I luoghi di Gondor',
    prompt: 'Mostra il nome e il tipo dei luoghi della regione «Gondor», in ordine alfabetico di nome.',
    expectedQuery: `
      SELECT nome, tipo
      FROM luoghi
      WHERE regione = 'Gondor'
      ORDER BY nome`,
    hints: [
      'La regione di un luogo è nella colonna regione della tabella luoghi.',
      'Il filtro va in WHERE, con il testo fra apici singoli; l’ordine alfabetico si chiede con ORDER BY nome.',
    ],
    tables: ['luoghi'],
  },
  {
    id: 'ex-003',
    chapter: 'una-tabella',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'WHERE', 'IS NULL'],
    title: 'Nati in un anno sconosciuto',
    prompt: 'Mostra il nome dei personaggi di cui non si conosce l’anno di nascita.',
    expectedQuery: `
      SELECT nome
      FROM personaggi
      WHERE anno_nascita IS NULL`,
    hints: [
      'Un anno di nascita sconosciuto è registrato come NULL nella colonna anno_nascita.',
      'Il confronto anno_nascita = NULL non è mai vero, nemmeno quando il valore manca: per cercare i NULL serve IS NULL.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-004',
    chapter: 'una-tabella',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'WHERE', 'BETWEEN', 'ORDER BY'],
    title: 'Nati fra il 2950 e il 3000',
    prompt:
      'Mostra il nome e l’anno di nascita dei personaggi nati fra il 2950 e il 3000, estremi compresi, dal più anziano al più giovane. A parità di anno, in ordine alfabetico di nome.',
    expectedQuery: `
      SELECT nome, anno_nascita
      FROM personaggi
      WHERE anno_nascita BETWEEN 2950 AND 3000
      ORDER BY anno_nascita, nome`,
    hints: [
      'Per un intervallo di valori, estremi compresi, esiste l’operatore BETWEEN … AND ….',
      'Il più anziano è nato per primo, quindi ha l’anno più piccolo: ordina per anno_nascita crescente e poi per nome.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-005',
    chapter: 'una-tabella',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'WHERE', 'IS NOT NULL', 'ORDER BY', 'LIMIT'],
    title: 'I tre più anziani',
    prompt:
      'Fra i personaggi di cui si conosce l’anno di nascita, mostra il nome e l’anno di nascita dei tre più anziani, dal più anziano. A parità di anno, in ordine alfabetico di nome.',
    expectedQuery: `
      SELECT nome, anno_nascita
      FROM personaggi
      WHERE anno_nascita IS NOT NULL
      ORDER BY anno_nascita, nome
      LIMIT 3`,
    hints: [
      'LIMIT 3, dopo ORDER BY, tiene solo le prime tre righe dell’elenco ordinato.',
      'In SQLite, in un ordinamento crescente, i NULL vengono prima di ogni numero: se non li escludi con IS NOT NULL, i primi tre posti vanno a personaggi senza anno.',
    ],
    tables: ['personaggi'],
  },

  // Join
  {
    id: 'ex-006',
    chapter: 'join',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'JOIN'],
    title: 'A quale popolo appartengono',
    prompt: 'Mostra il nome di ogni personaggio insieme al nome del suo popolo.',
    expectedQuery: `
      SELECT personaggi.nome, popoli.nome
      FROM personaggi
      JOIN popoli ON personaggi.popolo_id = popoli.id`,
    hints: [
      'Il nome del popolo è nella tabella popoli; la tabella personaggi contiene solo il suo identificativo, in popolo_id.',
      'Unisci le due tabelle con JOIN … ON personaggi.popolo_id = popoli.id. Le due colonne si chiamano entrambe nome: scrivi davanti il nome della tabella.',
    ],
    tables: ['personaggi', 'popoli'],
  },
  {
    id: 'ex-007',
    chapter: 'join',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'JOIN'],
    title: 'Le armi e chi le porta',
    prompt: 'Mostra il nome e il tipo di ogni arma, con il nome del personaggio che la porta.',
    expectedQuery: `
      SELECT armi.nome, armi.tipo, personaggi.nome
      FROM armi
      JOIN personaggi ON armi.portatore_id = personaggi.id`,
    hints: [
      'La colonna portatore_id della tabella armi contiene l’identificativo di un personaggio.',
      'Collega armi.portatore_id a personaggi.id con un JOIN.',
    ],
    tables: ['armi', 'personaggi'],
  },
  {
    id: 'ex-008',
    chapter: 'join',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'JOIN', 'ORDER BY'],
    title: 'Dove si è combattuto',
    prompt:
      'Mostra il nome di ogni battaglia con il nome e la regione del luogo in cui si è svolta, ordinate per anno. A parità di anno, in ordine alfabetico di nome della battaglia.',
    expectedQuery: `
      SELECT battaglie.nome, luoghi.nome, luoghi.regione
      FROM battaglie
      JOIN luoghi ON battaglie.luogo_id = luoghi.id
      ORDER BY battaglie.anno, battaglie.nome`,
    hints: [
      'Nome e regione del luogo sono nella tabella luoghi, collegata alle battaglie da battaglie.luogo_id.',
      'Puoi ordinare anche per una colonna che non mostri: ORDER BY battaglie.anno, battaglie.nome.',
    ],
    tables: ['battaglie', 'luoghi'],
  },
  {
    id: 'ex-009',
    chapter: 'join',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'JOIN', 'WHERE', 'ORDER BY'],
    title: 'Il viaggio di Frodo',
    prompt:
      'Mostra il numero d’ordine e il nome dei luoghi toccati dal viaggio di Frodo Baggins, dalla partenza all’ultima tappa.',
    expectedQuery: `
      SELECT tappe.ordine, luoghi.nome
      FROM tappe
      JOIN luoghi ON tappe.luogo_id = luoghi.id
      JOIN personaggi ON tappe.personaggio_id = personaggi.id
      WHERE personaggi.nome = 'Frodo Baggins'
      ORDER BY tappe.ordine`,
    hints: [
      'La tabella tappe collega un personaggio a un luogo: ti serve unirla sia a personaggi, per filtrare Frodo, sia a luoghi, per il nome del luogo.',
      'Due JOIN di seguito, poi WHERE personaggi.nome = \'Frodo Baggins\' e ORDER BY tappe.ordine.',
    ],
    tables: ['tappe', 'luoghi', 'personaggi'],
  },
  {
    id: 'ex-010',
    chapter: 'join',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'LEFT JOIN', 'WHERE', 'IS NULL'],
    title: 'Membri della Compagnia senza un’arma con nome',
    prompt: 'Mostra il nome dei membri della Compagnia dell’Anello che non portano nessuna delle armi dell’archivio.',
    expectedQuery: `
      SELECT personaggi.nome
      FROM personaggi
      LEFT JOIN armi ON armi.portatore_id = personaggi.id
      WHERE personaggi.membro_compagnia = 1
        AND armi.id IS NULL`,
    hints: [
      'Un JOIN normale scarta i personaggi senza armi, che sono proprio quelli che cerchi. Il LEFT JOIN li tiene, con NULL nelle colonne di armi.',
      'Dopo il LEFT JOIN, tieni le righe in cui armi.id IS NULL e il personaggio è un membro della Compagnia.',
    ],
    tables: ['personaggi', 'armi'],
  },

  // Aggregazioni
  {
    id: 'ex-011',
    chapter: 'aggregazioni',
    difficulty: 'facile',
    keywords: ['SELECT', 'COUNT', 'FROM', 'WHERE'],
    title: 'Le battaglie del 3019',
    prompt: 'Conta le battaglie combattute nell’anno 3019.',
    expectedQuery: `
      SELECT COUNT(*)
      FROM battaglie
      WHERE anno = 3019`,
    hints: [
      'COUNT(*) conta le righe che restano dopo il filtro di WHERE.',
      'Filtra le battaglie con anno = 3019 e chiedi COUNT(*) al posto delle colonne.',
    ],
    tables: ['battaglie'],
  },
  {
    id: 'ex-012',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'COUNT', 'FROM', 'JOIN', 'GROUP BY'],
    title: 'Battaglie per regione',
    prompt: 'Per ogni regione in cui si è combattuta almeno una battaglia, mostra la regione e il numero di battaglie.',
    expectedQuery: `
      SELECT luoghi.regione, COUNT(*)
      FROM battaglie
      JOIN luoghi ON battaglie.luogo_id = luoghi.id
      GROUP BY luoghi.regione`,
    hints: [
      'La regione non è nella tabella battaglie: prima collega ogni battaglia al suo luogo.',
      'GROUP BY luoghi.regione forma un gruppo per regione, e COUNT(*) conta le battaglie di ciascun gruppo.',
    ],
    tables: ['battaglie', 'luoghi'],
  },
  {
    id: 'ex-013',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'COUNT', 'FROM', 'JOIN', 'GROUP BY', 'ORDER BY'],
    title: 'I viaggi più lunghi',
    prompt:
      'Per ogni personaggio di cui l’archivio registra il viaggio, mostra il nome e il numero di tappe, dal viaggio con più tappe a quello con meno. A parità di tappe, in ordine alfabetico di nome.',
    expectedQuery: `
      SELECT personaggi.nome, COUNT(*)
      FROM tappe
      JOIN personaggi ON tappe.personaggio_id = personaggi.id
      GROUP BY personaggi.id, personaggi.nome
      ORDER BY COUNT(*) DESC, personaggi.nome`,
    hints: [
      'Ogni riga della tabella tappe è una tappa: contale per personaggio con GROUP BY.',
      'Puoi ordinare per il conteggio stesso: ORDER BY COUNT(*) DESC, poi per nome.',
    ],
    tables: ['tappe', 'personaggi'],
  },
  {
    id: 'ex-014',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'COUNT', 'FROM', 'JOIN', 'GROUP BY', 'HAVING'],
    title: 'Le battaglie più affollate',
    prompt:
      'Mostra il nome e il numero di partecipanti delle battaglie a cui l’archivio registra almeno cinque partecipanti.',
    expectedQuery: `
      SELECT battaglie.nome, COUNT(*)
      FROM partecipazioni
      JOIN battaglie ON partecipazioni.battaglia_id = battaglie.id
      GROUP BY battaglie.id, battaglie.nome
      HAVING COUNT(*) >= 5`,
    hints: [
      'Ogni riga della tabella partecipazioni è un personaggio in una battaglia: raggruppa per battaglia e conta.',
      'Una condizione sul conteggio di un gruppo non può stare in WHERE: va in HAVING, dopo GROUP BY.',
    ],
    tables: ['partecipazioni', 'battaglie'],
  },
  {
    id: 'ex-015',
    chapter: 'aggregazioni',
    difficulty: 'difficile',
    keywords: ['SELECT', 'COUNT', 'FROM', 'LEFT JOIN', 'GROUP BY'],
    title: 'Quanti personaggi per popolo, anche nessuno',
    prompt:
      'Per ogni popolo dell’archivio mostra il nome e il numero dei suoi personaggi, compresi i popoli che non ne hanno nessuno.',
    expectedQuery: `
      SELECT popoli.nome, COUNT(personaggi.id)
      FROM popoli
      LEFT JOIN personaggi ON personaggi.popolo_id = popoli.id
      GROUP BY popoli.id, popoli.nome`,
    hints: [
      'Un popolo senza personaggi sparisce con un JOIN normale: parti da popoli e usa un LEFT JOIN.',
      'COUNT(*) conterebbe 1 anche per un popolo senza personaggi, perché la riga con i NULL esiste. COUNT(personaggi.id) non conta i NULL.',
    ],
    tables: ['popoli', 'personaggi'],
  },

  // Sottoquery
  {
    id: 'ex-016',
    chapter: 'sottoquery-viste',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE', 'IN'],
    title: 'Chi ha combattuto al Fosso di Helm',
    prompt: 'Mostra il nome dei personaggi che hanno partecipato alla Battaglia del Fosso di Helm.',
    expectedQuery: `
      SELECT nome
      FROM personaggi
      WHERE id IN (
        SELECT personaggio_id
        FROM partecipazioni
        WHERE battaglia_id = (
          SELECT id
          FROM battaglie
          WHERE nome = 'Battaglia del Fosso di Helm'
        )
      )`,
    hints: [
      'Parti dall’interno: una sottoquery trova l’id della battaglia dal suo nome, una seconda gli id dei personaggi che vi hanno partecipato.',
      'La query esterna tiene i personaggi con WHERE id IN (…), dove fra parentesi c’è l’elenco degli id dei partecipanti.',
    ],
    tables: ['personaggi', 'partecipazioni', 'battaglie'],
  },
  {
    id: 'ex-017',
    chapter: 'sottoquery-viste',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Più anziani di Aragorn',
    prompt: 'Mostra il nome e l’anno di nascita dei personaggi nati prima di Aragorn.',
    expectedQuery: `
      SELECT nome, anno_nascita
      FROM personaggi
      WHERE anno_nascita < (
        SELECT anno_nascita
        FROM personaggi
        WHERE nome = 'Aragorn'
      )`,
    hints: [
      'Ti serve l’anno di nascita di Aragorn, ma la consegna non lo riporta: lo restituisce una sottoquery.',
      'Una sottoquery che restituisce un solo valore può stare a destra di un confronto: WHERE anno_nascita < (SELECT …).',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-018',
    chapter: 'sottoquery-viste',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'WHERE', 'NOT IN'],
    title: 'Luoghi fuori dai viaggi',
    prompt: 'Mostra il nome e la regione dei luoghi che non compaiono in nessuna tappa.',
    expectedQuery: `
      SELECT nome, regione
      FROM luoghi
      WHERE id NOT IN (
        SELECT luogo_id
        FROM tappe
      )`,
    hints: [
      'La colonna luogo_id della tabella tappe elenca i luoghi toccati da almeno un viaggio.',
      'Tieni i luoghi il cui id non è in quell’elenco: WHERE id NOT IN (SELECT luogo_id FROM tappe).',
    ],
    tables: ['luoghi', 'tappe'],
  },
  {
    id: 'ex-019',
    chapter: 'sottoquery-viste',
    difficulty: 'difficile',
    keywords: ['SELECT', 'COUNT', 'MAX', 'FROM', 'JOIN', 'GROUP BY', 'HAVING'],
    title: 'Il popolo più numeroso',
    prompt: 'Mostra il nome del popolo con più personaggi nell’archivio e il numero dei suoi personaggi.',
    expectedQuery: `
      SELECT popoli.nome, COUNT(*)
      FROM personaggi
      JOIN popoli ON personaggi.popolo_id = popoli.id
      GROUP BY popoli.id, popoli.nome
      HAVING COUNT(*) = (
        SELECT MAX(numero)
        FROM (
          SELECT COUNT(*) AS numero
          FROM personaggi
          GROUP BY popolo_id
        )
      )`,
    hints: [
      'Conta prima i personaggi di ogni popolo con GROUP BY; poi tieni solo il gruppo il cui conteggio è il massimo.',
      'Il massimo dei conteggi si calcola con una sottoquery nel FROM: SELECT MAX(numero) FROM (SELECT COUNT(*) AS numero … GROUP BY popolo_id). Il confronto con il conteggio va in HAVING.',
    ],
    tables: ['personaggi', 'popoli'],
  },
  {
    id: 'ex-020',
    chapter: 'sottoquery-viste',
    difficulty: 'difficile',
    keywords: ['SELECT', 'MAX', 'FROM', 'JOIN', 'WHERE'],
    title: 'Dove finisce ogni viaggio',
    prompt: 'Per ogni personaggio di cui l’archivio registra il viaggio, mostra il nome e il luogo della sua ultima tappa.',
    expectedQuery: `
      SELECT personaggi.nome, luoghi.nome
      FROM tappe
      JOIN personaggi ON tappe.personaggio_id = personaggi.id
      JOIN luoghi ON tappe.luogo_id = luoghi.id
      WHERE tappe.ordine = (
        SELECT MAX(t.ordine)
        FROM tappe AS t
        WHERE t.personaggio_id = tappe.personaggio_id
      )`,
    hints: [
      'L’ultima tappa di un viaggio è quella con il numero d’ordine più alto per quel personaggio, e il massimo cambia da un personaggio all’altro.',
      'Una sottoquery correlata calcola MAX(ordine) solo per le tappe dello stesso personaggio della riga esterna: dai un alias alla tabella interna (tappe AS t) e confronta t.personaggio_id con tappe.personaggio_id.',
    ],
    tables: ['tappe', 'personaggi', 'luoghi'],
  },
];

export default exercises;
