import type { Exercise } from '../../src/themes/contract.ts';

// Esercizi portati dal prototipo jedi-academy (F04) e verificati su SQLite.
// Titoli, consegne e suggerimenti sono stati riscritti in F07.
// Il capitolo di ogni esercizio è la clausola più avanzata della query attesa:
// sottoquery, poi raggruppamenti e funzioni di aggregazione, poi join, poi una tabella.

const exercises: Exercise[] = [
  // Facile (35)
  {
    id: 'ex-001',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM'],
    title: 'Tutti i pianeti della galassia',
    prompt: 'Mostra tutte le colonne di tutti i pianeti dell’archivio.',
    expectedQuery: `
      SELECT *
      FROM pianeti`,
    hints: [
      'Non serve filtrare: vuoi ogni riga della tabella pianeti.',
      'Per prendere tutte le colonne senza elencarle esiste un simbolo apposito, da scrivere dopo SELECT.',
    ],
    tables: ['pianeti'],
  },
  {
    id: 'ex-002',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM'],
    title: 'Nome e clima dei pianeti',
    prompt: 'Mostra il nome e il clima di ogni pianeta.',
    expectedQuery: `
      SELECT nome, clima
      FROM pianeti`,
    hints: [
      'Ti servono due colonne della tabella pianeti, senza filtri.',
      'Dopo SELECT le colonne si elencano separate da una virgola.',
    ],
    tables: ['pianeti'],
  },
  {
    id: 'ex-003',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Personaggi sensibili alla Forza',
    prompt: 'Mostra il nome e il ruolo dei personaggi sensibili alla Forza.',
    expectedQuery: `
      SELECT nome, ruolo
      FROM personaggi
      WHERE sensibile_alla_forza = 1`,
    hints: [
      'Per tenere solo alcune righe serve la clausola WHERE.',
      'La colonna sensibile_alla_forza vale 1 per chi è sensibile alla Forza e 0 per chi non lo è.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-004',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Pianeti dell’Orlo Esterno',
    prompt: 'Mostra il nome, il terreno e la popolazione dei pianeti del settore «Orlo Esterno».',
    expectedQuery: `
      SELECT nome, terreno, popolazione
      FROM pianeti
      WHERE settore_galattico = 'Orlo Esterno'`,
    hints: [
      'Il settore di un pianeta è nella colonna settore_galattico.',
      'Un valore di testo si scrive fra apici singoli, con le maiuscole come nel database.',
    ],
    tables: ['pianeti'],
  },
  {
    id: 'ex-005',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Astronavi lunghe più di 100 metri',
    prompt: 'Mostra il nome, il modello e la lunghezza delle astronavi lunghe più di 100 metri.',
    expectedQuery: `
      SELECT nome, modello, lunghezza_metri
      FROM astronavi
      WHERE lunghezza_metri > 100`,
    hints: [
      'La lunghezza in metri è nella colonna lunghezza_metri.',
      '«Più di» chiede un confronto stretto: una nave di 100 metri esatti non va bene.',
    ],
    tables: ['astronavi'],
  },
  {
    id: 'ex-006',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'ORDER BY'],
    title: 'Pianeti dal più popolato',
    prompt: 'Mostra il nome e la popolazione di ogni pianeta, dal più popolato al meno popolato.',
    expectedQuery: `
      SELECT nome, popolazione
      FROM pianeti
      ORDER BY popolazione DESC`,
    hints: [
      'L’ordine delle righe si sceglie con ORDER BY, in fondo alla query.',
      'L’ordine predefinito è crescente: per il contrario serve una parola chiave.',
    ],
    tables: ['pianeti'],
  },
  {
    id: 'ex-007',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'ORDER BY', 'LIMIT'],
    title: 'Le tre astronavi più veloci',
    prompt: 'Mostra il nome, il modello e la classe dell’iperguida delle tre astronavi più veloci: una classe più bassa vuol dire una nave più veloce. Ordinale dalla più veloce e, a parità di classe, per nome in ordine alfabetico.',
    expectedQuery: `
      SELECT nome, modello, velocita_iperguida
      FROM astronavi
      ORDER BY velocita_iperguida ASC, nome ASC
      LIMIT 3`,
    hints: [
      'Prima ordini le astronavi, poi tieni solo le prime righe.',
      'Ordina per velocita_iperguida crescente e, come secondo criterio, per nome.',
      'Il numero di righe si limita con LIMIT, scritto dopo ORDER BY.',
    ],
    tables: ['astronavi'],
  },
  {
    id: 'ex-008',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Personaggi nati più di 50 anni prima di Yavin',
    prompt: 'Mostra il nome e l’anno di nascita dei personaggi nati più di 50 anni prima della battaglia di Yavin.',
    expectedQuery: `
      SELECT nome, anno_nascita_bby
      FROM personaggi
      WHERE anno_nascita_bby > 50`,
    hints: [
      'Gli anni si contano a ritroso da Yavin: più il numero è grande, più la nascita è lontana.',
      'La colonna da confrontare è anno_nascita_bby.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-009',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Pianeti aridi o ghiacciati',
    prompt: 'Mostra il nome e il clima dei pianeti con clima «arido» o «ghiacciato».',
    expectedQuery: `
      SELECT nome, clima
      FROM pianeti
      WHERE clima = 'arido' OR clima = 'ghiacciato'`,
    hints: [
      'Le condizioni sono due, e basta che ne valga una.',
      'Puoi unire due confronti con OR, oppure usare IN con un elenco di valori.',
    ],
    tables: ['pianeti'],
  },
  {
    id: 'ex-010',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Spade laser verdi',
    prompt: 'Mostra l’identificativo e il tipo di cristallo delle spade laser con la lama «Verde».',
    expectedQuery: `
      SELECT id, tipo_cristallo
      FROM spade_laser
      WHERE colore_lama = 'Verde'`,
    hints: [
      'Le spade laser sono nella tabella spade_laser.',
      'Il colore è nella colonna colore_lama, scritto con l’iniziale maiuscola.',
    ],
    tables: ['spade_laser'],
  },
  {
    id: 'ex-011',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'DISTINCT', 'FROM'],
    title: 'Climi dei pianeti senza ripetizioni',
    prompt: 'Mostra i climi dei pianeti, ciascuno una volta sola.',
    expectedQuery: `
      SELECT DISTINCT clima
      FROM pianeti`,
    hints: [
      'Più pianeti hanno lo stesso clima, e una SELECT normale lo ripete.',
      'Una parola chiave, scritta subito dopo SELECT, elimina le righe duplicate.',
    ],
    tables: ['pianeti'],
  },
  {
    id: 'ex-012',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Astronavi con un solo membro d’equipaggio',
    prompt: 'Mostra il nome e il costruttore delle astronavi che hanno un equipaggio di un solo membro.',
    expectedQuery: `
      SELECT nome, costruttore
      FROM astronavi
      WHERE capacita_equipaggio = 1`,
    hints: [
      'Il numero di membri dell’equipaggio è nella colonna capacita_equipaggio.',
      'Il confronto è un’uguaglianza con un numero, che si scrive senza apici.',
    ],
    tables: ['astronavi'],
  },
  {
    id: 'ex-013',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE', 'LIKE'],
    title: 'Personaggi il cui nome comincia con «Darth»',
    prompt: 'Mostra il nome e il ruolo dei personaggi il cui nome comincia con «Darth».',
    expectedQuery: `
      SELECT nome, ruolo
      FROM personaggi
      WHERE nome LIKE 'Darth%'`,
    hints: [
      'Per confrontare solo una parte di un testo serve LIKE, non l’uguale.',
      'Nel modello di LIKE il simbolo % sta per qualunque sequenza di caratteri: qui va dopo la parola.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-014',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Pianeti fra un milione e dieci miliardi di abitanti',
    prompt: 'Mostra il nome e la popolazione dei pianeti che hanno fra un milione e dieci miliardi di abitanti, estremi compresi.',
    expectedQuery: `
      SELECT nome, popolazione
      FROM pianeti
      WHERE popolazione BETWEEN 1000000 AND 10000000000`,
    hints: [
      'Servono due confronti sulla stessa colonna, oppure BETWEEN … AND …, che comprende gli estremi.',
      'Scrivi i numeri senza punti: un milione è 1000000, dieci miliardi ha dieci zeri.',
    ],
    tables: ['pianeti'],
  },
  {
    id: 'ex-015',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Fazioni di governo',
    prompt: 'Mostra il nome e il motto delle fazioni di tipo «Governo».',
    expectedQuery: `
      SELECT nome, motto
      FROM fazioni
      WHERE tipo = 'Governo'`,
    hints: [
      'Il tipo di una fazione è nella colonna tipo della tabella fazioni.',
      'Il valore va scritto fra apici, con la maiuscola.',
    ],
    tables: ['fazioni'],
  },
  {
    id: 'ex-016',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Battaglie con più di 10.000 perdite',
    prompt: 'Mostra il nome, l’anno e le perdite stimate delle battaglie con più di 10.000 perdite.',
    expectedQuery: `
      SELECT nome, anno_bby, perdite_stimate
      FROM battaglie
      WHERE perdite_stimate > 10000`,
    hints: [
      'Le perdite sono nella colonna perdite_stimate della tabella battaglie.',
      'Nel codice SQL i numeri si scrivono senza il punto delle migliaia.',
    ],
    tables: ['battaglie'],
  },
  {
    id: 'ex-017',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Specie che vivono più di 100 anni',
    prompt: 'Mostra il nome e l’aspettativa di vita media delle specie che in media vivono più di 100 anni.',
    expectedQuery: `
      SELECT nome, aspettativa_vita_media
      FROM specie
      WHERE aspettativa_vita_media > 100`,
    hints: [
      'Ti serve la tabella specie.',
      'L’aspettativa di vita, in anni, è nella colonna aspettativa_vita_media.',
    ],
    tables: ['specie'],
  },
  {
    id: 'ex-018',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Personaggi non sensibili alla Forza',
    prompt: 'Mostra il nome e il ruolo dei personaggi che non sono sensibili alla Forza.',
    expectedQuery: `
      SELECT nome, ruolo
      FROM personaggi
      WHERE sensibile_alla_forza = 0`,
    hints: [
      'Filtra le righe con WHERE.',
      'La colonna sensibile_alla_forza vale 0 per chi non è sensibile alla Forza.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-019',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE', 'LIKE'],
    title: 'Spade laser con l’impugnatura curva',
    prompt: 'Mostra tutte le colonne delle spade laser la cui impugnatura contiene la parola «curva».',
    expectedQuery: `
      SELECT *
      FROM spade_laser
      WHERE impugnatura LIKE '%curva%'`,
    hints: [
      '«Contiene» vuol dire che la parola può stare in qualunque punto del testo: serve LIKE.',
      'Il simbolo % va da entrambe le parti della parola.',
    ],
    tables: ['spade_laser'],
  },
  {
    id: 'ex-020',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'DISTINCT', 'FROM'],
    title: 'Costruttori di astronavi senza ripetizioni',
    prompt: 'Mostra i costruttori delle astronavi, ciascuno una volta sola.',
    expectedQuery: `
      SELECT DISTINCT costruttore
      FROM astronavi`,
    hints: [
      'Lo stesso costruttore compare in più astronavi.',
      'La parola chiave che elimina i duplicati va subito dopo SELECT.',
    ],
    tables: ['astronavi'],
  },
  {
    id: 'ex-021',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Pianeti quasi disabitati',
    prompt: 'Mostra il nome, il clima e la popolazione dei pianeti con al massimo 1000 abitanti.',
    expectedQuery: `
      SELECT nome, clima, popolazione
      FROM pianeti
      WHERE popolazione <= 1000`,
    hints: [
      '«Al massimo» comprende anche i pianeti con 1000 abitanti esatti.',
      'Ti serve l’operatore minore o uguale.',
    ],
    tables: ['pianeti'],
  },
  {
    id: 'ex-022',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'ORDER BY'],
    title: 'Personaggi in ordine alfabetico',
    prompt: 'Mostra il nome e il ruolo di tutti i personaggi, in ordine alfabetico per nome.',
    expectedQuery: `
      SELECT nome, ruolo
      FROM personaggi
      ORDER BY nome ASC`,
    hints: [
      'L’ordine delle righe si sceglie con ORDER BY.',
      'L’ordine alfabetico dalla A alla Z è quello crescente, il predefinito.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-023',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'ORDER BY', 'LIMIT'],
    title: 'I cinque personaggi più anziani',
    prompt: 'Mostra il nome e l’anno di nascita dei cinque personaggi più anziani, dal più anziano.',
    expectedQuery: `
      SELECT nome, anno_nascita_bby
      FROM personaggi
      ORDER BY anno_nascita_bby DESC
      LIMIT 5`,
    hints: [
      'Gli anni si contano a ritroso da Yavin: il personaggio più anziano ha l’anno di nascita più grande.',
      'Ordina per anno_nascita_bby decrescente, poi tieni solo le prime righe con LIMIT.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-024',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Astronavi della Corellian Engineering',
    prompt: 'Mostra il nome, il modello e la lunghezza delle astronavi costruite dalla «Corellian Engineering».',
    expectedQuery: `
      SELECT nome, modello, lunghezza_metri
      FROM astronavi
      WHERE costruttore = 'Corellian Engineering'`,
    hints: [
      'Il costruttore è nella colonna costruttore della tabella astronavi.',
      'Scrivi il nome del costruttore fra apici, esattamente come nel database.',
    ],
    tables: ['astronavi'],
  },
  {
    id: 'ex-025',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE', 'LIKE'],
    title: 'Pianeti con foreste o paludi',
    prompt: 'Mostra il nome e il terreno dei pianeti il cui terreno contiene la parola «foreste» oppure la parola «paludi».',
    expectedQuery: `
      SELECT nome, terreno
      FROM pianeti
      WHERE terreno LIKE '%foreste%' OR terreno LIKE '%paludi%'`,
    hints: [
      'Servono due condizioni con LIKE, e basta che ne valga una.',
      'Ogni parola cercata va fra due simboli %, perché può stare in qualunque punto del testo.',
    ],
    tables: ['pianeti'],
  },
  {
    id: 'ex-026',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Battaglie di più di dieci anni prima di Yavin',
    prompt: 'Mostra il nome e l’anno delle battaglie combattute più di dieci anni prima della battaglia di Yavin, cioè durante le Guerre dei Cloni o prima.',
    expectedQuery: `
      SELECT nome, anno_bby
      FROM battaglie
      WHERE anno_bby > 10`,
    hints: [
      'Gli anni si contano a ritroso da Yavin: più il numero è grande, più la battaglia è antica.',
      'Confronta la colonna anno_bby con 10.',
    ],
    tables: ['battaglie'],
  },
  {
    id: 'ex-027',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Spade laser rosse',
    prompt: 'Mostra l’identificativo, il tipo di cristallo e l’impugnatura delle spade laser con la lama «Rosso».',
    expectedQuery: `
      SELECT id, tipo_cristallo, impugnatura
      FROM spade_laser
      WHERE colore_lama = 'Rosso'`,
    hints: [
      'Ti serve la tabella spade_laser.',
      'Il colore è nella colonna colore_lama, ed è scritto al maschile: «Rosso».',
    ],
    tables: ['spade_laser'],
  },
  {
    id: 'ex-028',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Fazioni religiose',
    prompt: 'Mostra il nome e il tipo delle fazioni di tipo «Ordine Religioso».',
    expectedQuery: `
      SELECT nome, tipo
      FROM fazioni
      WHERE tipo = 'Ordine Religioso'`,
    hints: [
      'Ti serve la tabella fazioni.',
      'Il tipo è nella colonna tipo: scrivi il valore fra apici, con le maiuscole come nel database.',
    ],
    tables: ['fazioni'],
  },
  {
    id: 'ex-029',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Personaggi dell’Alleanza Ribelle',
    prompt: 'Mostra il nome e il ruolo dei personaggi che militano nell’Alleanza Ribelle.',
    expectedQuery: `
      SELECT nome, ruolo
      FROM personaggi
      WHERE fazione_id = 1`,
    hints: [
      'Nella tabella personaggi la fazione è indicata dal suo identificativo, nella colonna fazione_id, non dal nome.',
      'L’identificativo dell’Alleanza Ribelle si legge nella tabella fazioni: è 1.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-030',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM'],
    title: 'Specie e lingue',
    prompt: 'Mostra il nome e la lingua di ogni specie.',
    expectedQuery: `
      SELECT nome, linguaggio
      FROM specie`,
    hints: [
      'Ti servono due colonne della tabella specie, senza filtri.',
      'La lingua è nella colonna linguaggio.',
    ],
    tables: ['specie'],
  },
  {
    id: 'ex-031',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'ORDER BY', 'LIMIT'],
    title: 'Le tre astronavi più lunghe',
    prompt: 'Mostra il nome, il modello e la lunghezza delle tre astronavi più lunghe, dalla più lunga.',
    expectedQuery: `
      SELECT nome, modello, lunghezza_metri
      FROM astronavi
      ORDER BY lunghezza_metri DESC
      LIMIT 3`,
    hints: [
      'Prima ordini, poi tieni solo le prime righe.',
      'Ordina per lunghezza_metri decrescente e limita il risultato con LIMIT.',
    ],
    tables: ['astronavi'],
  },
  {
    id: 'ex-032',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE', 'LIKE'],
    title: 'Pianeti il cui nome finisce in «ine»',
    prompt: 'Mostra il nome e il clima dei pianeti il cui nome finisce con le lettere «ine», come Tatooine.',
    expectedQuery: `
      SELECT nome, clima
      FROM pianeti
      WHERE nome LIKE '%ine'`,
    hints: [
      'Per confrontare una parte di un testo serve LIKE.',
      'Il simbolo % va da una parte sola: quella che precede «ine».',
    ],
    tables: ['pianeti'],
  },
  {
    id: 'ex-033',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Personaggi droidi',
    prompt: 'Mostra il nome e il ruolo dei personaggi che sono droidi.',
    expectedQuery: `
      SELECT nome, ruolo
      FROM personaggi
      WHERE specie_id = 3`,
    hints: [
      'Nella tabella personaggi la specie è indicata dal suo identificativo, nella colonna specie_id.',
      'L’identificativo della specie «Droide» si legge nella tabella specie: è 3.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-034',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'ORDER BY'],
    title: 'Fazioni in ordine alfabetico inverso',
    prompt: 'Mostra tutte le colonne delle fazioni, in ordine alfabetico inverso per nome, dalla Z alla A.',
    expectedQuery: `
      SELECT *
      FROM fazioni
      ORDER BY nome DESC`,
    hints: [
      'Ti servono tutte le colonne e la clausola ORDER BY.',
      'L’ordine dalla Z alla A è quello decrescente.',
    ],
    tables: ['fazioni'],
  },
  {
    id: 'ex-035',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Pianeti del Nucleo Profondo',
    prompt: 'Mostra il nome e la popolazione dei pianeti del settore «Nucleo Profondo».',
    expectedQuery: `
      SELECT nome, popolazione
      FROM pianeti
      WHERE settore_galattico = 'Nucleo Profondo'`,
    hints: [
      'Il settore è nella colonna settore_galattico.',
      'Il valore va fra apici, con le maiuscole come nel database.',
    ],
    tables: ['pianeti'],
  },
  // Medio (40)
  {
    id: 'ex-036',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'COUNT'],
    title: 'Quanti sono i personaggi',
    prompt: 'Mostra il numero totale di personaggi dell’archivio.',
    expectedQuery: `
      SELECT COUNT(*) AS totale_personaggi
      FROM personaggi`,
    hints: [
      'Il risultato è una sola riga con un solo numero.',
      'La funzione di aggregazione che conta le righe è COUNT.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-037',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'GROUP BY', 'COUNT'],
    title: 'Personaggi per fazione',
    prompt: 'Per ogni fazione mostra il suo identificativo e il numero di personaggi che vi militano.',
    expectedQuery: `
      SELECT fazione_id, COUNT(*) AS numero_personaggi
      FROM personaggi
      GROUP BY fazione_id`,
    hints: [
      'Ti basta la tabella personaggi: la fazione è indicata da fazione_id.',
      'Per contare per gruppi servono GROUP BY e COUNT.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-038',
    chapter: 'join',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'JOIN'],
    title: 'Personaggi e fazioni',
    prompt: 'Mostra il nome di ogni personaggio accanto al nome della fazione in cui milita.',
    expectedQuery: `
      SELECT personaggi.nome AS nome_personaggio, fazioni.nome AS nome_fazione
      FROM personaggi
      JOIN fazioni ON personaggi.fazione_id = fazioni.id`,
    hints: [
      'Il nome della fazione non è nella tabella personaggi: devi unirla alla tabella fazioni.',
      'La colonna fazione_id di un personaggio contiene l’identificativo della sua fazione.',
      'Entrambe le tabelle hanno una colonna nome: scrivi davanti il nome della tabella, come personaggi.nome.',
    ],
    tables: ['personaggi', 'fazioni'],
  },
  {
    id: 'ex-039',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'GROUP BY', 'SUM'],
    title: 'Popolazione per settore galattico',
    prompt: 'Per ogni settore galattico mostra il nome del settore e la popolazione complessiva dei suoi pianeti.',
    expectedQuery: `
      SELECT settore_galattico, SUM(popolazione) AS popolazione_totale
      FROM pianeti
      GROUP BY settore_galattico`,
    hints: [
      'Un gruppo per ogni settore: GROUP BY settore_galattico.',
      'La funzione che somma i valori di un gruppo è SUM.',
    ],
    tables: ['pianeti'],
  },
  {
    id: 'ex-040',
    chapter: 'join',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'JOIN'],
    title: 'Personaggi e spade laser',
    prompt: 'Mostra il nome del personaggio, il colore della lama e il tipo di cristallo di ogni spada laser.',
    expectedQuery: `
      SELECT personaggi.nome, spade_laser.colore_lama, spade_laser.tipo_cristallo
      FROM personaggi
      JOIN spade_laser ON personaggi.id = spade_laser.personaggio_id`,
    hints: [
      'Il proprietario di una spada è indicato nella tabella spade_laser: unisci le due tabelle.',
      'La colonna personaggio_id di una spada contiene l’identificativo del suo proprietario.',
    ],
    tables: ['personaggi', 'spade_laser'],
  },
  {
    id: 'ex-041',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'GROUP BY', 'HAVING', 'COUNT'],
    title: 'Fazioni con almeno tre personaggi',
    prompt: 'Mostra l’identificativo delle fazioni con almeno tre personaggi, e il numero dei loro personaggi.',
    expectedQuery: `
      SELECT fazione_id, COUNT(*) AS totale
      FROM personaggi
      GROUP BY fazione_id
      HAVING COUNT(*) >= 3`,
    hints: [
      'Prima raggruppa i personaggi per fazione e contali.',
      'La condizione riguarda il conteggio di ogni gruppo, non le singole righe: WHERE non basta.',
      'Il filtro sui gruppi si scrive con HAVING, dopo GROUP BY.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-042',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'AVG'],
    title: 'Lunghezza media delle astronavi',
    prompt: 'Mostra la lunghezza media, in metri, delle astronavi dell’archivio.',
    expectedQuery: `
      SELECT AVG(lunghezza_metri) AS lunghezza_media
      FROM astronavi`,
    hints: [
      'Il risultato è una sola riga con un solo numero.',
      'La funzione che calcola la media è AVG.',
    ],
    tables: ['astronavi'],
  },
  {
    id: 'ex-043',
    chapter: 'join',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'JOIN'],
    title: 'Personaggi e pianeti natali',
    prompt: 'Mostra il nome di ogni personaggio di cui si conosce il pianeta natale, accanto al nome di quel pianeta.',
    expectedQuery: `
      SELECT personaggi.nome AS personaggio, pianeti.nome AS pianeta
      FROM personaggi
      JOIN pianeti ON personaggi.pianeta_origine_id = pianeti.id`,
    hints: [
      'Unisci la tabella personaggi alla tabella pianeti.',
      'Il pianeta natale di un personaggio è indicato dalla colonna pianeta_origine_id.',
      'Una JOIN scarta da sola i personaggi con il pianeta sconosciuto, perché per loro non trova un pianeta corrispondente.',
    ],
    tables: ['personaggi', 'pianeti'],
  },
  {
    id: 'ex-044',
    chapter: 'join',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'JOIN'],
    title: 'Astronavi e fazioni proprietarie',
    prompt: 'Mostra il nome e il modello di ogni astronave, con il nome della fazione a cui appartiene.',
    expectedQuery: `
      SELECT astronavi.nome AS nome_nave, astronavi.modello, fazioni.nome AS nome_fazione
      FROM astronavi
      JOIN fazioni ON astronavi.fazione_id = fazioni.id`,
    hints: [
      'Unisci la tabella astronavi alla tabella fazioni.',
      'La colonna fazione_id di un’astronave contiene l’identificativo della fazione proprietaria.',
    ],
    tables: ['astronavi', 'fazioni'],
  },
  {
    id: 'ex-045',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'GROUP BY', 'ORDER BY', 'COUNT'],
    title: 'Spade laser per colore',
    prompt: 'Per ogni colore di lama mostra il colore e il numero di spade laser di quel colore, dal colore più frequente. A parità di numero, ordina i colori in ordine alfabetico.',
    expectedQuery: `
      SELECT colore_lama, COUNT(*) AS quantita
      FROM spade_laser
      GROUP BY colore_lama
      ORDER BY quantita DESC, colore_lama ASC`,
    hints: [
      'Raggruppa le spade per colore_lama e contale.',
      'In ORDER BY puoi usare il conteggio, anche attraverso il suo alias.',
      'Il secondo criterio di ordinamento, dopo una virgola, è il colore.',
    ],
    tables: ['spade_laser'],
  },
  {
    id: 'ex-046',
    chapter: 'join',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'JOIN'],
    title: 'Battaglie e pianeti',
    prompt: 'Mostra il nome e l’anno di ogni battaglia, con il nome del pianeta su cui è stata combattuta.',
    expectedQuery: `
      SELECT battaglie.nome AS battaglia, battaglie.anno_bby, pianeti.nome AS pianeta
      FROM battaglie
      JOIN pianeti ON battaglie.pianeta_id = pianeti.id`,
    hints: [
      'Unisci la tabella battaglie alla tabella pianeti.',
      'La colonna pianeta_id di una battaglia contiene l’identificativo del pianeta.',
    ],
    tables: ['battaglie', 'pianeti'],
  },
  {
    id: 'ex-047',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'MIN', 'MAX', 'AVG'],
    title: 'Perdite minime, massime e medie',
    prompt: 'Mostra, in una sola riga, le perdite stimate minime, massime e medie delle battaglie.',
    expectedQuery: `
      SELECT MIN(perdite_stimate) AS perdite_minime,
             MAX(perdite_stimate) AS perdite_massime,
             AVG(perdite_stimate) AS perdite_medie
      FROM battaglie`,
    hints: [
      'Ti servono tre funzioni di aggregazione sulla stessa colonna, perdite_stimate.',
      'Le funzioni sono MIN, MAX e AVG, separate da virgole dopo SELECT.',
    ],
    tables: ['battaglie'],
  },
  {
    id: 'ex-048',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'GROUP BY', 'HAVING', 'COUNT'],
    title: 'Pianeti natali di più di due personaggi',
    prompt: 'Mostra l’identificativo dei pianeti su cui sono nati più di due personaggi, e il numero di personaggi nati su ciascuno.',
    expectedQuery: `
      SELECT pianeta_origine_id, COUNT(*) AS totale_nativi
      FROM personaggi
      GROUP BY pianeta_origine_id
      HAVING COUNT(*) > 2`,
    hints: [
      'Raggruppa i personaggi per pianeta_origine_id e contali.',
      'Il filtro riguarda il conteggio dei gruppi: si scrive con HAVING.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-049',
    chapter: 'join',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'JOIN'],
    title: 'Personaggi e specie',
    prompt: 'Mostra il nome e il ruolo di ogni personaggio, con il nome della specie a cui appartiene.',
    expectedQuery: `
      SELECT personaggi.nome AS personaggio, personaggi.ruolo, specie.nome AS specie
      FROM personaggi
      JOIN specie ON personaggi.specie_id = specie.id`,
    hints: [
      'Unisci la tabella personaggi alla tabella specie.',
      'La colonna specie_id di un personaggio contiene l’identificativo della sua specie.',
    ],
    tables: ['personaggi', 'specie'],
  },
  {
    id: 'ex-050',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'GROUP BY', 'ORDER BY', 'COUNT'],
    title: 'Astronavi per costruttore',
    prompt: 'Per ogni costruttore mostra il nome e il numero di astronavi che ha costruito, dal costruttore con più astronavi. A parità di numero, ordina i costruttori in ordine alfabetico.',
    expectedQuery: `
      SELECT costruttore, COUNT(*) AS numero_navi
      FROM astronavi
      GROUP BY costruttore
      ORDER BY numero_navi DESC, costruttore ASC`,
    hints: [
      'Raggruppa le astronavi per costruttore e contale.',
      'Ordina per il conteggio decrescente e, come secondo criterio, per costruttore.',
    ],
    tables: ['astronavi'],
  },
  {
    id: 'ex-051',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'GROUP BY', 'COUNT'],
    title: 'Pianeti per clima',
    prompt: 'Per ogni clima mostra il clima e il numero di pianeti che lo hanno.',
    expectedQuery: `
      SELECT clima, COUNT(*) AS numero_pianeti
      FROM pianeti
      GROUP BY clima`,
    hints: [
      'Un gruppo per ogni clima.',
      'Ti servono GROUP BY e COUNT.',
    ],
    tables: ['pianeti'],
  },
  {
    id: 'ex-052',
    chapter: 'join',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'JOIN'],
    title: 'Battaglie e vincitori',
    prompt: 'Mostra il nome e l’anno di ogni battaglia, con il nome della fazione che l’ha vinta.',
    expectedQuery: `
      SELECT battaglie.nome AS battaglia,
             battaglie.anno_bby,
             fazioni.nome AS fazione_vincitrice
      FROM battaglie
      JOIN fazioni ON battaglie.fazione_vincitrice_id = fazioni.id`,
    hints: [
      'Unisci la tabella battaglie alla tabella fazioni.',
      'La fazione vincitrice è indicata dalla colonna fazione_vincitrice_id.',
    ],
    tables: ['battaglie', 'fazioni'],
  },
  {
    id: 'ex-053',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'GROUP BY', 'SUM'],
    title: 'Equipaggio complessivo per fazione',
    prompt: 'Per ogni fazione che possiede astronavi mostra l’identificativo della fazione e la somma della capacità dell’equipaggio delle sue astronavi.',
    expectedQuery: `
      SELECT fazione_id, SUM(capacita_equipaggio) AS equipaggio_totale
      FROM astronavi
      GROUP BY fazione_id`,
    hints: [
      'Ti basta la tabella astronavi: la fazione è indicata da fazione_id.',
      'Raggruppa per fazione e somma capacita_equipaggio con SUM.',
    ],
    tables: ['astronavi'],
  },
  {
    id: 'ex-054',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'GROUP BY', 'AVG'],
    title: 'Aspettativa di vita per lingua',
    prompt: 'Per ogni lingua mostra la lingua e l’aspettativa di vita media delle specie che la parlano.',
    expectedQuery: `
      SELECT linguaggio, AVG(aspettativa_vita_media) AS vita_media
      FROM specie
      GROUP BY linguaggio`,
    hints: [
      'Più specie possono parlare la stessa lingua: raggruppa per linguaggio.',
      'Calcola la media di aspettativa_vita_media con AVG.',
    ],
    tables: ['specie'],
  },
  {
    id: 'ex-055',
    chapter: 'join',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'JOIN', 'WHERE'],
    title: 'Personaggi con la spada laser blu o verde',
    prompt: 'Mostra il nome e il ruolo dei personaggi che hanno una spada laser con la lama «Blu» o «Verde», e il colore della lama.',
    expectedQuery: `
      SELECT personaggi.nome, personaggi.ruolo, spade_laser.colore_lama
      FROM personaggi
      JOIN spade_laser ON personaggi.id = spade_laser.personaggio_id
      WHERE spade_laser.colore_lama IN ('Blu', 'Verde')`,
    hints: [
      'Prima unisci personaggi e spade_laser, poi filtra le righe con WHERE.',
      'Per due colori ammessi puoi usare OR, oppure IN con un elenco di valori.',
    ],
    tables: ['personaggi', 'spade_laser'],
  },
  {
    id: 'ex-056',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'COUNT'],
    title: 'Sensibili alla Forza per fazione',
    prompt: 'Per ogni fazione mostra l’identificativo e il numero dei suoi personaggi sensibili alla Forza. Le fazioni senza personaggi sensibili alla Forza non compaiono.',
    expectedQuery: `
      SELECT fazione_id, COUNT(*) AS jedi_o_sith
      FROM personaggi
      WHERE sensibile_alla_forza = 1
      GROUP BY fazione_id`,
    hints: [
      'Prima scarti con WHERE i personaggi non sensibili alla Forza, poi raggruppi quelli rimasti.',
      'WHERE si scrive prima di GROUP BY.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-057',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'GROUP BY', 'MAX'],
    title: 'Astronave più lunga per fazione',
    prompt: 'Per ogni fazione che possiede astronavi mostra l’identificativo della fazione e la lunghezza della sua astronave più lunga.',
    expectedQuery: `
      SELECT fazione_id, MAX(lunghezza_metri) AS lunghezza_massima
      FROM astronavi
      GROUP BY fazione_id`,
    hints: [
      'Raggruppa le astronavi per fazione_id.',
      'La funzione che dà il valore più grande di un gruppo è MAX.',
    ],
    tables: ['astronavi'],
  },
  {
    id: 'ex-058',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'GROUP BY', 'SUM'],
    title: 'Perdite per pianeta',
    prompt: 'Per ogni pianeta su cui si è combattuto mostra l’identificativo del pianeta e la somma delle perdite stimate nelle sue battaglie.',
    expectedQuery: `
      SELECT pianeta_id, SUM(perdite_stimate) AS perdite_totali
      FROM battaglie
      GROUP BY pianeta_id`,
    hints: [
      'Ti basta la tabella battaglie: il pianeta è indicato da pianeta_id.',
      'Raggruppa per pianeta e somma le perdite con SUM.',
    ],
    tables: ['battaglie'],
  },
  {
    id: 'ex-059',
    chapter: 'join',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'JOIN'],
    title: 'Specie e pianeti d’origine',
    prompt: 'Mostra il nome e la lingua di ogni specie, con il nome del suo pianeta d’origine.',
    expectedQuery: `
      SELECT specie.nome AS specie, specie.linguaggio, pianeti.nome AS pianeta_madre
      FROM specie
      JOIN pianeti ON specie.pianeta_madre_id = pianeti.id`,
    hints: [
      'Unisci la tabella specie alla tabella pianeti.',
      'Il pianeta d’origine di una specie è indicato dalla colonna pianeta_madre_id.',
    ],
    tables: ['specie', 'pianeti'],
  },
  {
    id: 'ex-060',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'GROUP BY', 'HAVING', 'COUNT'],
    title: 'Settori con più di tre pianeti',
    prompt: 'Mostra i settori galattici con più di tre pianeti, e il numero di pianeti di ciascuno.',
    expectedQuery: `
      SELECT settore_galattico, COUNT(*) AS numero_pianeti
      FROM pianeti
      GROUP BY settore_galattico
      HAVING COUNT(*) > 3`,
    hints: [
      'Raggruppa i pianeti per settore e contali.',
      'Il filtro sul conteggio si scrive con HAVING.',
    ],
    tables: ['pianeti'],
  },
  {
    id: 'ex-061',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'WHERE', 'AVG'],
    title: 'Anno di nascita medio dei sensibili alla Forza',
    prompt: 'Mostra la media degli anni di nascita dei personaggi sensibili alla Forza.',
    expectedQuery: `
      SELECT AVG(anno_nascita_bby) AS media_anno_bby
      FROM personaggi
      WHERE sensibile_alla_forza = 1`,
    hints: [
      'Prima filtra i personaggi con WHERE, poi calcola la media su quelli rimasti.',
      'La media di anno_nascita_bby si calcola con AVG.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-062',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'GROUP BY', 'COUNT'],
    title: 'Fazioni per tipo',
    prompt: 'Per ogni tipo di fazione mostra il tipo e il numero di fazioni di quel tipo.',
    expectedQuery: `
      SELECT tipo, COUNT(*) AS numero_fazioni
      FROM fazioni
      GROUP BY tipo`,
    hints: [
      'Un gruppo per ogni valore della colonna tipo della tabella fazioni.',
      'Ti servono GROUP BY e COUNT.',
    ],
    tables: ['fazioni'],
  },
  {
    id: 'ex-063',
    chapter: 'join',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'JOIN', 'WHERE'],
    title: 'Astronavi dell’Alleanza Ribelle',
    prompt: 'Mostra il nome, il modello e il costruttore delle astronavi dell’Alleanza Ribelle.',
    expectedQuery: `
      SELECT astronavi.nome, astronavi.modello, astronavi.costruttore
      FROM astronavi
      JOIN fazioni ON astronavi.fazione_id = fazioni.id
      WHERE fazioni.nome = 'Alleanza Ribelle'`,
    hints: [
      'Il nome della fazione è nella tabella fazioni: unisci astronavi e fazioni.',
      'Dopo la JOIN puoi filtrare con WHERE sul nome della fazione.',
    ],
    tables: ['astronavi', 'fazioni'],
  },
  {
    id: 'ex-064',
    chapter: 'join',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'JOIN', 'WHERE'],
    title: 'Personaggi nati su Tatooine',
    prompt: 'Mostra il nome e il ruolo dei personaggi nati su Tatooine.',
    expectedQuery: `
      SELECT personaggi.nome, personaggi.ruolo
      FROM personaggi
      JOIN pianeti ON personaggi.pianeta_origine_id = pianeti.id
      WHERE pianeti.nome = 'Tatooine'`,
    hints: [
      'Il nome del pianeta è nella tabella pianeti: unisci personaggi e pianeti.',
      'Il pianeta natale è indicato dalla colonna pianeta_origine_id; dopo la JOIN filtra sul nome del pianeta.',
    ],
    tables: ['personaggi', 'pianeti'],
  },
  {
    id: 'ex-065',
    chapter: 'join',
    difficulty: 'medio',
    keywords: ['SELECT', 'DISTINCT', 'FROM', 'JOIN'],
    title: 'Pianeti che hanno visto una battaglia',
    prompt: 'Mostra il nome dei pianeti su cui è stata combattuta almeno una battaglia, ciascuno una volta sola.',
    expectedQuery: `
      SELECT DISTINCT pianeti.nome
      FROM pianeti
      JOIN battaglie ON pianeti.id = battaglie.pianeta_id`,
    hints: [
      'Unisci pianeti e battaglie: un pianeta compare una volta per ogni battaglia combattuta su di esso.',
      'Per non ripetere lo stesso pianeta serve DISTINCT.',
    ],
    tables: ['pianeti', 'battaglie'],
  },
  {
    id: 'ex-066',
    chapter: 'join',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'LEFT JOIN'],
    title: 'Personaggi con o senza spada laser',
    prompt: 'Mostra il nome di ogni personaggio e il colore della lama della sua spada laser. Devono comparire anche i personaggi senza spada, con il colore vuoto.',
    expectedQuery: `
      SELECT personaggi.nome, spade_laser.colore_lama
      FROM personaggi
      LEFT JOIN spade_laser ON personaggi.id = spade_laser.personaggio_id`,
    hints: [
      'Una JOIN normale scarta i personaggi che non hanno una spada corrispondente.',
      'Esiste una JOIN che tiene tutte le righe della tabella scritta a sinistra, anche senza corrispondenza.',
    ],
    tables: ['personaggi', 'spade_laser'],
  },
  {
    id: 'ex-067',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'GROUP BY', 'AVG'],
    title: 'Classe media dell’iperguida per fazione',
    prompt: 'Per ogni fazione che possiede astronavi mostra l’identificativo della fazione e la classe media dell’iperguida delle sue astronavi.',
    expectedQuery: `
      SELECT fazione_id, AVG(velocita_iperguida) AS velocita_media
      FROM astronavi
      GROUP BY fazione_id`,
    hints: [
      'Raggruppa le astronavi per fazione_id.',
      'Calcola la media di velocita_iperguida con AVG.',
    ],
    tables: ['astronavi'],
  },
  {
    id: 'ex-068',
    chapter: 'una-tabella',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Pianeti con più di 100 milioni di abitanti',
    prompt: 'Mostra il nome e la popolazione dei pianeti con più di 100 milioni di abitanti.',
    expectedQuery: `
      SELECT nome, popolazione
      FROM pianeti
      WHERE popolazione > 100000000`,
    hints: [
      'Il confronto è sulla colonna popolazione.',
      'Scrivi il numero per intero, senza punti: 100 milioni ha otto zeri.',
    ],
    tables: ['pianeti'],
  },
  {
    id: 'ex-069',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'GROUP BY', 'COUNT'],
    title: 'Vittorie per fazione',
    prompt: 'Per ogni fazione che ha vinto almeno una battaglia mostra l’identificativo della fazione e il numero di battaglie vinte.',
    expectedQuery: `
      SELECT fazione_vincitrice_id, COUNT(*) AS vittorie
      FROM battaglie
      GROUP BY fazione_vincitrice_id`,
    hints: [
      'Ti basta la tabella battaglie: la fazione vincitrice è indicata da fazione_vincitrice_id.',
      'Raggruppa per quella colonna e conta le righe.',
    ],
    tables: ['battaglie'],
  },
  {
    id: 'ex-070',
    chapter: 'una-tabella',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'WHERE', 'LIKE'],
    title: 'Spade laser con cristalli di Ilum o di Adegan',
    prompt: 'Mostra l’identificativo e il colore della lama delle spade laser il cui tipo di cristallo contiene «Ilum» oppure «Adegan».',
    expectedQuery: `
      SELECT id, colore_lama
      FROM spade_laser
      WHERE tipo_cristallo LIKE '%Ilum%' OR tipo_cristallo LIKE '%Adegan%'`,
    hints: [
      'Il tipo di cristallo è un testo come «Kyber di Ilum»: per cercarne una parte serve LIKE.',
      'Servono due LIKE uniti da OR.',
    ],
    tables: ['spade_laser'],
  },
  {
    id: 'ex-071',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'COUNT'],
    title: 'Umani per pianeta natale',
    prompt: 'Per ogni pianeta natale mostra l’identificativo del pianeta e il numero di personaggi umani nati lì. Gli umani con il pianeta sconosciuto formano un gruppo a parte, con l’identificativo vuoto.',
    expectedQuery: `
      SELECT pianeta_origine_id, COUNT(*) AS numero_umani
      FROM personaggi
      WHERE specie_id = 1
      GROUP BY pianeta_origine_id`,
    hints: [
      'Gli umani sono i personaggi della specie «Umano», che ha identificativo 1: filtrali con WHERE.',
      'Poi raggruppa per pianeta_origine_id. GROUP BY mette i valori vuoti, NULL, in un gruppo tutto loro.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-072',
    chapter: 'una-tabella',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Astronavi con un equipaggio da due a dieci membri',
    prompt: 'Mostra il nome e la capacità dell’equipaggio delle astronavi con un equipaggio da due a dieci membri, estremi compresi.',
    expectedQuery: `
      SELECT nome, capacita_equipaggio
      FROM astronavi
      WHERE capacita_equipaggio BETWEEN 2 AND 10`,
    hints: [
      'La capacità è nella colonna capacita_equipaggio.',
      'BETWEEN … AND … comprende entrambi gli estremi.',
    ],
    tables: ['astronavi'],
  },
  {
    id: 'ex-073',
    chapter: 'una-tabella',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Pianeti temperati con più di un miliardo di abitanti',
    prompt: 'Mostra il nome, la popolazione e il terreno dei pianeti con clima «temperato» e più di un miliardo di abitanti.',
    expectedQuery: `
      SELECT nome, popolazione, terreno
      FROM pianeti
      WHERE clima = 'temperato' AND popolazione > 1000000000`,
    hints: [
      'Le condizioni sono due, e devono valere entrambe.',
      'Un miliardo, scritto senza punti, è 1 seguito da nove zeri.',
    ],
    tables: ['pianeti'],
  },
  {
    id: 'ex-074',
    chapter: 'join',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'JOIN', 'WHERE'],
    title: 'Personaggi con la spada laser rossa',
    prompt: 'Mostra il nome dei personaggi che hanno una spada laser con la lama «Rosso», e il colore della lama.',
    expectedQuery: `
      SELECT personaggi.nome, spade_laser.colore_lama
      FROM personaggi
      JOIN spade_laser ON personaggi.id = spade_laser.personaggio_id
      WHERE spade_laser.colore_lama = 'Rosso'`,
    hints: [
      'Unisci personaggi e spade_laser.',
      'Dopo la JOIN filtra sulla colonna colore_lama.',
    ],
    tables: ['personaggi', 'spade_laser'],
  },
  {
    id: 'ex-075',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'GROUP BY', 'HAVING', 'COUNT'],
    title: 'Fazioni con più di un’astronave',
    prompt: 'Mostra l’identificativo delle fazioni che possiedono più di un’astronave, e il numero delle loro astronavi.',
    expectedQuery: `
      SELECT fazione_id, COUNT(*) AS totale_navi
      FROM astronavi
      GROUP BY fazione_id
      HAVING COUNT(*) > 1`,
    hints: [
      'Raggruppa le astronavi per fazione_id e contale.',
      'Il filtro sul conteggio si scrive con HAVING.',
    ],
    tables: ['astronavi'],
  },
  // Difficile (30)
  {
    id: 'ex-076',
    chapter: 'join',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'JOIN'],
    title: 'Specie, pianeta e fazione dei personaggi',
    prompt: 'Mostra il nome di ogni personaggio di cui si conosce il pianeta natale, con il nome della sua specie, del suo pianeta natale e della sua fazione.',
    expectedQuery: `
      SELECT personaggi.nome AS personaggio,
             specie.nome AS specie,
             pianeti.nome AS pianeta,
             fazioni.nome AS fazione
      FROM personaggi
      JOIN specie ON personaggi.specie_id = specie.id
      JOIN pianeti ON personaggi.pianeta_origine_id = pianeti.id
      JOIN fazioni ON personaggi.fazione_id = fazioni.id`,
    hints: [
      'I dati richiesti stanno in quattro tabelle: la tabella personaggi va unita alle altre tre.',
      'Ogni JOIN usa una chiave esterna di personaggi: specie_id, pianeta_origine_id e fazione_id.',
      'Quattro tabelle hanno una colonna nome: scrivi sempre davanti il nome della tabella.',
    ],
    tables: ['personaggi', 'specie', 'pianeti', 'fazioni'],
  },
  {
    id: 'ex-077',
    chapter: 'join',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'JOIN'],
    title: 'Spade laser e fazioni dei proprietari',
    prompt: 'Per ogni spada laser mostra il nome del proprietario, il colore della lama e il nome della fazione del proprietario.',
    expectedQuery: `
      SELECT personaggi.nome AS personaggio, spade_laser.colore_lama, fazioni.nome AS fazione
      FROM personaggi
      JOIN spade_laser ON personaggi.id = spade_laser.personaggio_id
      JOIN fazioni ON personaggi.fazione_id = fazioni.id`,
    hints: [
      'Servono tre tabelle: personaggi, spade_laser e fazioni.',
      'La tabella personaggi sta in mezzo: si unisce alle spade con il suo id e alle fazioni con fazione_id.',
    ],
    tables: ['personaggi', 'spade_laser', 'fazioni'],
  },
  {
    id: 'ex-078',
    chapter: 'sottoquery-viste',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'WHERE', 'NOT IN'],
    title: 'Pianeti su cui non è nato nessuno',
    prompt: 'Mostra il nome dei pianeti su cui non è nato nessun personaggio.',
    expectedQuery: `
      SELECT nome
      FROM pianeti
      WHERE id NOT IN (SELECT pianeta_origine_id FROM personaggi WHERE pianeta_origine_id IS NOT NULL)`,
    hints: [
      'Una sottoquery può darti l’elenco dei pianeti natali dei personaggi; a te servono gli altri.',
      'Per tenere i valori che non compaiono in un elenco c’è NOT IN.',
      'Se l’elenco contiene un NULL, NOT IN non restituisce nessuna riga: due personaggi hanno il pianeta sconosciuto, quindi nella sottoquery scarta i NULL.',
    ],
    tables: ['pianeti', 'personaggi'],
  },
  {
    id: 'ex-079',
    chapter: 'sottoquery-viste',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'WHERE', 'NOT IN'],
    title: 'Personaggi senza spada laser',
    prompt: 'Mostra il nome e il ruolo dei personaggi che non possiedono una spada laser.',
    expectedQuery: `
      SELECT nome, ruolo
      FROM personaggi
      WHERE id NOT IN (SELECT personaggio_id FROM spade_laser)`,
    hints: [
      'Una sottoquery sulla tabella spade_laser ti dà gli identificativi dei personaggi che una spada ce l’hanno.',
      'Tieni i personaggi il cui id non compare in quell’elenco, con NOT IN.',
    ],
    tables: ['personaggi', 'spade_laser'],
  },
  {
    id: 'ex-080',
    chapter: 'sottoquery-viste',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Astronavi più lunghe della media',
    prompt: 'Mostra il nome, il modello e la lunghezza delle astronavi più lunghe della lunghezza media di tutte le astronavi.',
    expectedQuery: `
      SELECT nome, modello, lunghezza_metri
      FROM astronavi
      WHERE lunghezza_metri > (SELECT AVG(lunghezza_metri) FROM astronavi)`,
    hints: [
      'La media non è un numero che conosci in anticipo: la calcola una sottoquery.',
      'Una sottoquery che restituisce un solo valore si può usare in un confronto, fra parentesi, al posto di un numero.',
    ],
    tables: ['astronavi'],
  },
  {
    id: 'ex-081',
    chapter: 'join',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'JOIN'],
    title: 'Battaglie con pianeta, clima e vincitore',
    prompt: 'Mostra il nome di ogni battaglia, il nome e il clima del pianeta su cui è stata combattuta e il nome della fazione che l’ha vinta.',
    expectedQuery: `
      SELECT battaglie.nome AS battaglia,
             pianeti.nome AS pianeta,
             pianeti.clima,
             fazioni.nome AS fazione_vincitrice
      FROM battaglie
      JOIN pianeti ON battaglie.pianeta_id = pianeti.id
      JOIN fazioni ON battaglie.fazione_vincitrice_id = fazioni.id`,
    hints: [
      'Servono tre tabelle: battaglie, pianeti e fazioni.',
      'La tabella battaglie sta in mezzo: ha una chiave esterna verso pianeti e una verso fazioni.',
    ],
    tables: ['battaglie', 'pianeti', 'fazioni'],
  },
  {
    id: 'ex-082',
    chapter: 'aggregazioni',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'JOIN', 'GROUP BY'],
    title: 'Flotte delle fazioni',
    prompt: 'Per ogni fazione che possiede astronavi mostra il nome della fazione, il numero delle sue astronavi e la loro lunghezza complessiva in metri.',
    expectedQuery: `
      SELECT fazioni.nome AS fazione,
             COUNT(astronavi.id) AS numero_navi,
             SUM(astronavi.lunghezza_metri) AS lunghezza_totale
      FROM fazioni
      JOIN astronavi ON fazioni.id = astronavi.fazione_id
      GROUP BY fazioni.nome`,
    hints: [
      'Il nome della fazione è nella tabella fazioni: uniscila ad astronavi prima di raggruppare.',
      'Raggruppa per il nome della fazione; nella stessa SELECT puoi usare COUNT e SUM.',
    ],
    tables: ['fazioni', 'astronavi'],
  },
  {
    id: 'ex-083',
    chapter: 'aggregazioni',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'JOIN', 'GROUP BY', 'MAX'],
    title: 'Membro più anziano di ogni fazione',
    prompt: 'Per ogni fazione mostra il nome e l’anno di nascita del suo membro più anziano.',
    expectedQuery: `
      SELECT fazioni.nome AS fazione, MAX(personaggi.anno_nascita_bby) AS massimo_anno_bby
      FROM personaggi
      JOIN fazioni ON personaggi.fazione_id = fazioni.id
      GROUP BY fazioni.nome`,
    hints: [
      'Unisci personaggi e fazioni, poi raggruppa per il nome della fazione.',
      'Gli anni si contano a ritroso da Yavin: il più anziano ha l’anno di nascita più grande.',
    ],
    tables: ['personaggi', 'fazioni'],
  },
  {
    id: 'ex-084',
    chapter: 'sottoquery-viste',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Pianeti più popolati di Tatooine',
    prompt: 'Mostra il nome e la popolazione dei pianeti più popolati di Tatooine.',
    expectedQuery: `
      SELECT nome, popolazione
      FROM pianeti
      WHERE popolazione > (SELECT popolazione FROM pianeti WHERE nome = 'Tatooine')`,
    hints: [
      'La popolazione di Tatooine la ricava una sottoquery sulla stessa tabella pianeti.',
      'Confronta la popolazione di ogni pianeta con il valore della sottoquery, scritta fra parentesi.',
    ],
    tables: ['pianeti'],
  },
  {
    id: 'ex-085',
    chapter: 'aggregazioni',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'JOIN', 'GROUP BY', 'HAVING', 'COUNT'],
    title: 'Fazioni con almeno due vittorie',
    prompt: 'Mostra il nome delle fazioni che hanno vinto almeno due battaglie, e il numero delle loro vittorie.',
    expectedQuery: `
      SELECT fazioni.nome AS fazione, COUNT(battaglie.id) AS vittorie
      FROM fazioni
      JOIN battaglie ON fazioni.id = battaglie.fazione_vincitrice_id
      GROUP BY fazioni.nome
      HAVING COUNT(battaglie.id) >= 2`,
    hints: [
      'Unisci fazioni e battaglie attraverso la fazione vincitrice.',
      'Raggruppa per il nome della fazione e filtra i gruppi con HAVING.',
    ],
    tables: ['fazioni', 'battaglie'],
  },
  {
    id: 'ex-086',
    chapter: 'join',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'JOIN', 'WHERE'],
    title: 'Personaggi con la spada laser blu',
    prompt: 'Mostra il nome, il ruolo e l’anno di nascita dei personaggi che hanno una spada laser con la lama «Blu», e il tipo di cristallo della spada.',
    expectedQuery: `
      SELECT personaggi.nome,
             personaggi.ruolo,
             personaggi.anno_nascita_bby,
             spade_laser.tipo_cristallo
      FROM personaggi
      JOIN spade_laser ON personaggi.id = spade_laser.personaggio_id
      WHERE spade_laser.colore_lama = 'Blu'`,
    hints: [
      'Unisci personaggi e spade_laser.',
      'Dopo la JOIN filtra sul colore della lama; le altre colonne vengono da tutte e due le tabelle.',
    ],
    tables: ['personaggi', 'spade_laser'],
  },
  {
    id: 'ex-087',
    chapter: 'sottoquery-viste',
    difficulty: 'difficile',
    keywords: ['SELECT', 'DISTINCT', 'FROM', 'JOIN', 'WHERE'],
    title: 'Pianeti di battaglie sanguinose',
    prompt: 'Mostra, ciascuno una volta sola, i pianeti su cui si è combattuta almeno una battaglia con perdite superiori alla media delle perdite di tutte le battaglie.',
    expectedQuery: `
      SELECT DISTINCT pianeti.nome
      FROM pianeti
      JOIN battaglie ON pianeti.id = battaglie.pianeta_id
      WHERE battaglie.perdite_stimate > (SELECT AVG(perdite_stimate) FROM battaglie)`,
    hints: [
      'Unisci pianeti e battaglie, poi filtra le battaglie.',
      'La media delle perdite la calcola una sottoquery, da usare nel confronto.',
      'Se più battaglie di un pianeta passano il filtro, il pianeta si ripete: serve DISTINCT.',
    ],
    tables: ['pianeti', 'battaglie'],
  },
  {
    id: 'ex-088',
    chapter: 'aggregazioni',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'LEFT JOIN', 'GROUP BY', 'COUNT'],
    title: 'Personaggi nati su ogni pianeta',
    prompt: 'Per ogni pianeta mostra il nome e il numero di personaggi nati lì. Devono comparire anche i pianeti su cui non è nato nessuno, con zero.',
    expectedQuery: `
      SELECT pianeti.nome AS pianeta, COUNT(personaggi.id) AS personaggi_nati
      FROM pianeti
      LEFT JOIN personaggi ON pianeti.id = personaggi.pianeta_origine_id
      GROUP BY pianeti.nome`,
    hints: [
      'Una JOIN normale scarta i pianeti senza personaggi: serve una JOIN che tenga tutti i pianeti.',
      'Con LEFT JOIN un pianeta senza personaggi resta, con le colonne di personaggi vuote.',
      'COUNT(*) conta le righe, anche quella con le colonne vuote: conta invece una colonna di personaggi, che salta i valori NULL.',
    ],
    tables: ['pianeti', 'personaggi'],
  },
  {
    id: 'ex-089',
    chapter: 'aggregazioni',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'JOIN', 'GROUP BY', 'MIN'],
    title: 'Astronave più veloce di ogni fazione',
    prompt: 'Per ogni fazione che possiede astronavi mostra il nome della fazione e la classe dell’iperguida della sua astronave più veloce: una classe più bassa vuol dire una nave più veloce.',
    expectedQuery: `
      SELECT fazioni.nome AS fazione, MIN(astronavi.velocita_iperguida) AS velocita_migliore
      FROM fazioni
      JOIN astronavi ON fazioni.id = astronavi.fazione_id
      GROUP BY fazioni.nome`,
    hints: [
      'Unisci fazioni e astronavi, poi raggruppa per il nome della fazione.',
      'La nave più veloce ha la classe più bassa: ti serve MIN, non MAX.',
    ],
    tables: ['fazioni', 'astronavi'],
  },
  {
    id: 'ex-090',
    chapter: 'sottoquery-viste',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Personaggi della stessa specie di Yoda',
    prompt: 'Mostra il nome e l’anno di nascita dei personaggi della stessa specie di Yoda, escluso Yoda.',
    expectedQuery: `
      SELECT nome, anno_nascita_bby
      FROM personaggi
      WHERE specie_id = (SELECT specie_id FROM personaggi WHERE nome = 'Yoda')
        AND nome <> 'Yoda'`,
    hints: [
      'La specie di Yoda la ricava una sottoquery sulla tabella personaggi.',
      'Le condizioni sono due: la specie uguale a quella di Yoda e il nome diverso da «Yoda».',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-091',
    chapter: 'join',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'JOIN', 'WHERE'],
    title: 'Specie di pianeti temperati',
    prompt: 'Mostra il nome e la lingua delle specie il cui pianeta d’origine ha clima «temperato», con il nome di quel pianeta.',
    expectedQuery: `
      SELECT specie.nome AS specie, specie.linguaggio, pianeti.nome AS pianeta
      FROM specie
      JOIN pianeti ON specie.pianeta_madre_id = pianeti.id
      WHERE pianeti.clima = 'temperato'`,
    hints: [
      'Unisci specie e pianeti.',
      'Il filtro riguarda una colonna della tabella pianeti: il clima.',
    ],
    tables: ['specie', 'pianeti'],
  },
  {
    id: 'ex-092',
    chapter: 'join',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'JOIN'],
    title: 'Spade laser e pianeti natali dei proprietari',
    prompt: 'Per ogni spada laser mostra il nome del proprietario, il nome del suo pianeta natale e il colore della lama.',
    expectedQuery: `
      SELECT personaggi.nome AS personaggio, pianeti.nome AS pianeta, spade_laser.colore_lama
      FROM personaggi
      JOIN pianeti ON personaggi.pianeta_origine_id = pianeti.id
      JOIN spade_laser ON personaggi.id = spade_laser.personaggio_id`,
    hints: [
      'Servono tre tabelle: personaggi, pianeti e spade_laser.',
      'La tabella personaggi sta in mezzo: si unisce ai pianeti con pianeta_origine_id e alle spade con il suo id.',
    ],
    tables: ['personaggi', 'pianeti', 'spade_laser'],
  },
  {
    id: 'ex-093',
    chapter: 'sottoquery-viste',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'WHERE', 'SUM'],
    title: 'Pianeti più popolati dell’intero Orlo Esterno',
    prompt: 'Mostra il nome e la popolazione dei pianeti che da soli hanno più abitanti di tutti i pianeti dell’Orlo Esterno messi insieme.',
    expectedQuery: `
      SELECT nome, popolazione
      FROM pianeti
      WHERE popolazione > (SELECT SUM(popolazione) FROM pianeti WHERE settore_galattico = 'Orlo Esterno')`,
    hints: [
      'La popolazione complessiva dell’Orlo Esterno la calcola una sottoquery con SUM.',
      'Confronta la popolazione di ogni pianeta con il risultato della sottoquery.',
    ],
    tables: ['pianeti'],
  },
  {
    id: 'ex-094',
    chapter: 'sottoquery-viste',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'WHERE', 'IN'],
    title: 'Fazioni con personaggi e astronavi',
    prompt: 'Mostra il nome delle fazioni che hanno almeno un personaggio e almeno un’astronave.',
    expectedQuery: `
      SELECT nome
      FROM fazioni
      WHERE id IN (SELECT fazione_id FROM personaggi)
        AND id IN (SELECT fazione_id FROM astronavi)`,
    hints: [
      'Due sottoquery ti danno le fazioni dei personaggi e le fazioni delle astronavi.',
      'L’id della fazione deve comparire in entrambi gli elenchi: due IN uniti da AND.',
    ],
    tables: ['fazioni', 'personaggi', 'astronavi'],
  },
  {
    id: 'ex-095',
    chapter: 'aggregazioni',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'JOIN', 'GROUP BY', 'ORDER BY', 'SUM'],
    title: 'Perdite nelle battaglie vinte',
    prompt: 'Per ogni fazione che ha vinto almeno una battaglia mostra il nome e la somma delle perdite stimate nelle battaglie che ha vinto, dalla fazione con la somma più alta.',
    expectedQuery: `
      SELECT fazioni.nome AS fazione, SUM(battaglie.perdite_stimate) AS perdite_totali
      FROM fazioni
      JOIN battaglie ON fazioni.id = battaglie.fazione_vincitrice_id
      GROUP BY fazioni.nome
      ORDER BY perdite_totali DESC`,
    hints: [
      'Unisci fazioni e battaglie attraverso la fazione vincitrice.',
      'Raggruppa per il nome della fazione e somma le perdite.',
      'L’ordine si applica al risultato dei gruppi: in ORDER BY puoi usare la somma.',
    ],
    tables: ['fazioni', 'battaglie'],
  },
  {
    id: 'ex-096',
    chapter: 'join',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'JOIN', 'WHERE'],
    title: 'Personaggi sensibili alla Forza e i loro leader',
    prompt: 'Mostra il nome e il ruolo dei personaggi sensibili alla Forza, con il nome del leader della fazione in cui militano.',
    expectedQuery: `
      SELECT personaggi.nome AS personaggio, personaggi.ruolo, leader.nome AS leader
      FROM personaggi
      JOIN fazioni ON personaggi.fazione_id = fazioni.id
      JOIN personaggi AS leader ON fazioni.leader_id = leader.id
      WHERE personaggi.sensibile_alla_forza = 1`,
    hints: [
      'Dal personaggio arrivi alla sua fazione, e dalla fazione al suo leader.',
      'Il leader di una fazione è anche lui un personaggio: la tabella personaggi va usata due volte.',
      'Per usare due volte la stessa tabella dai alla seconda un altro nome, per esempio JOIN personaggi AS leader.',
    ],
    tables: ['personaggi', 'fazioni'],
  },
  {
    id: 'ex-097',
    chapter: 'una-tabella',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Astronavi con più di 100 membri d’equipaggio',
    prompt: 'Mostra il nome, il modello e la capacità dell’equipaggio delle astronavi con più di 100 membri d’equipaggio.',
    expectedQuery: `
      SELECT nome, modello, capacita_equipaggio
      FROM astronavi
      WHERE capacita_equipaggio > 100`,
    hints: [
      'Ti serve la tabella astronavi.',
      'Il confronto è sulla colonna capacita_equipaggio.',
    ],
    tables: ['astronavi'],
  },
  {
    id: 'ex-098',
    chapter: 'join',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'JOIN', 'WHERE'],
    title: 'Battaglie dall’anno di Yavin in poi',
    prompt: 'Mostra il nome del pianeta, il nome della battaglia e l’anno delle battaglie combattute nell’anno di Yavin o dopo.',
    expectedQuery: `
      SELECT pianeti.nome AS pianeta, battaglie.nome AS battaglia, battaglie.anno_bby
      FROM pianeti
      JOIN battaglie ON pianeti.id = battaglie.pianeta_id
      WHERE battaglie.anno_bby <= 0`,
    hints: [
      'Unisci pianeti e battaglie.',
      'Gli anni si contano a ritroso da Yavin: l’anno di Yavin è 0 e quelli successivi sono negativi.',
    ],
    tables: ['pianeti', 'battaglie'],
  },
  {
    id: 'ex-099',
    chapter: 'aggregazioni',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'JOIN', 'GROUP BY', 'COUNT'],
    title: 'Spade laser per cristallo e fazione',
    prompt: 'Per ogni combinazione di tipo di cristallo e fazione del proprietario mostra il tipo di cristallo, il nome della fazione e il numero di spade laser.',
    expectedQuery: `
      SELECT spade_laser.tipo_cristallo, fazioni.nome AS fazione, COUNT(*) AS totale
      FROM spade_laser
      JOIN personaggi ON spade_laser.personaggio_id = personaggi.id
      JOIN fazioni ON personaggi.fazione_id = fazioni.id
      GROUP BY spade_laser.tipo_cristallo, fazioni.nome`,
    hints: [
      'Servono tre tabelle: dalla spada al proprietario, dal proprietario alla sua fazione.',
      'GROUP BY accetta più colonne separate da virgole: un gruppo per ogni coppia di valori.',
    ],
    tables: ['spade_laser', 'personaggi', 'fazioni'],
  },
  {
    id: 'ex-100',
    chapter: 'join',
    difficulty: 'difficile',
    keywords: ['SELECT', 'DISTINCT', 'FROM', 'JOIN', 'WHERE', 'LIKE'],
    title: 'Pianeti natali dei Maestri Jedi',
    prompt: 'Mostra, ciascuno una volta sola, i pianeti natali dei personaggi che hanno il ruolo «Maestro Jedi» o «Gran Maestro Jedi».',
    expectedQuery: `
      SELECT DISTINCT pianeti.nome AS pianeta
      FROM pianeti
      JOIN personaggi ON pianeti.id = personaggi.pianeta_origine_id
      WHERE personaggi.ruolo LIKE '%Maestro Jedi%'`,
    hints: [
      'Unisci pianeti e personaggi, poi filtra sul ruolo.',
      'I due ruoli hanno in comune le parole «Maestro Jedi»: puoi cercarle con LIKE.',
      'Più Maestri Jedi sono nati sullo stesso pianeta: serve DISTINCT.',
    ],
    tables: ['pianeti', 'personaggi'],
  },
  {
    id: 'ex-101',
    chapter: 'sottoquery-viste',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'JOIN', 'WHERE', 'NOT IN'],
    title: 'Fazioni senza vittorie e i loro leader',
    prompt: 'Mostra il nome delle fazioni che non hanno vinto nessuna battaglia, con il nome del loro leader.',
    expectedQuery: `
      SELECT fazioni.nome, leader.nome AS leader
      FROM fazioni
      JOIN personaggi AS leader ON fazioni.leader_id = leader.id
      WHERE fazioni.id NOT IN (SELECT fazione_vincitrice_id FROM battaglie)`,
    hints: [
      'Una sottoquery sulla tabella battaglie ti dà le fazioni che hanno vinto; tieni le altre con NOT IN.',
      'Il leader di una fazione è un personaggio, indicato dalla colonna leader_id: unisci fazioni e personaggi.',
      'Dai un nome alla tabella dei leader, per esempio JOIN personaggi AS leader, così la query si legge meglio.',
    ],
    tables: ['fazioni', 'battaglie', 'personaggi'],
  },
  {
    id: 'ex-102',
    chapter: 'sottoquery-viste',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'WHERE', 'MAX'],
    title: 'Pianeti più popolati di tutto l’Orlo Mediano',
    prompt: 'Mostra il nome e la popolazione dei pianeti più popolati di qualunque pianeta dell’Orlo Mediano.',
    expectedQuery: `
      SELECT nome, popolazione
      FROM pianeti
      WHERE popolazione > (SELECT MAX(popolazione) FROM pianeti WHERE settore_galattico = 'Orlo Mediano')`,
    hints: [
      'Basta superare il pianeta più popolato dell’Orlo Mediano: lo trova una sottoquery con MAX.',
      'Confronta la popolazione di ogni pianeta con il risultato della sottoquery.',
    ],
    tables: ['pianeti'],
  },
  {
    id: 'ex-103',
    chapter: 'join',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'JOIN'],
    title: 'Personaggi e astronavi della loro fazione',
    prompt: 'Per ogni personaggio mostra il nome, il nome della sua fazione e il nome di ciascuna astronave che appartiene a quella fazione.',
    expectedQuery: `
      SELECT personaggi.nome AS personaggio,
             fazioni.nome AS fazione,
             astronavi.nome AS astronave
      FROM personaggi
      JOIN fazioni ON personaggi.fazione_id = fazioni.id
      JOIN astronavi ON fazioni.id = astronavi.fazione_id`,
    hints: [
      'La fazione collega le due cose: personaggi e astronavi hanno entrambi una colonna fazione_id.',
      'Il risultato ha una riga per ogni coppia personaggio–astronave della stessa fazione: è normale che sia lungo.',
    ],
    tables: ['personaggi', 'fazioni', 'astronavi'],
  },
  {
    id: 'ex-104',
    chapter: 'join',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'JOIN', 'WHERE', 'LIKE'],
    title: 'Spade laser con impugnatura curva o doppia',
    prompt: 'Mostra il nome e il ruolo dei personaggi la cui spada laser ha un’impugnatura che contiene la parola «curva» o la parola «Doppia», e l’impugnatura.',
    expectedQuery: `
      SELECT personaggi.nome, personaggi.ruolo, spade_laser.impugnatura
      FROM personaggi
      JOIN spade_laser ON personaggi.id = spade_laser.personaggio_id
      WHERE spade_laser.impugnatura LIKE '%curva%' OR spade_laser.impugnatura LIKE '%Doppia%'`,
    hints: [
      'Unisci personaggi e spade_laser, poi filtra sull’impugnatura.',
      'Servono due LIKE uniti da OR, ciascuno con la parola fra due simboli %.',
    ],
    tables: ['personaggi', 'spade_laser'],
  },
  {
    id: 'ex-105',
    chapter: 'aggregazioni',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'JOIN', 'GROUP BY', 'COUNT'],
    title: 'Membri e tipo di ogni fazione',
    prompt: 'Per ogni fazione mostra il nome, il tipo e il numero dei suoi membri.',
    expectedQuery: `
      SELECT fazioni.nome AS fazione, fazioni.tipo, COUNT(personaggi.id) AS numero_membri
      FROM fazioni
      JOIN personaggi ON fazioni.id = personaggi.fazione_id
      GROUP BY fazioni.nome, fazioni.tipo`,
    hints: [
      'Unisci fazioni e personaggi, poi raggruppa.',
      'Il tipo compare nella SELECT senza funzione di aggregazione: mettilo anche in GROUP BY, accanto al nome.',
    ],
    tables: ['fazioni', 'personaggi'],
  },

  // F22 — una tabella: medio (6), difficile (4)
  {
    id: 'ex-106',
    chapter: 'una-tabella',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'WHERE', 'IN'],
    title: 'Lame blu, viola o bianche',
    prompt: 'Mostra l’id, il colore della lama e l’impugnatura delle spade laser con la lama blu, viola o bianca.',
    expectedQuery: `
      SELECT id, colore_lama, impugnatura
      FROM spade_laser
      WHERE colore_lama IN ('Blu', 'Viola', 'Bianco')`,
    hints: [
      'Potresti unire tre confronti con OR, ma c’è un operatore che controlla se un valore compare in un elenco.',
      'Scrivi WHERE colore_lama IN (…) con i tre colori fra apici, con l’iniziale maiuscola come nel database: il bianco è «Bianco».',
    ],
    tables: ['spade_laser'],
  },
  {
    id: 'ex-107',
    chapter: 'una-tabella',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'WHERE', 'IS NULL'],
    title: 'Nati chissà dove',
    prompt: 'Mostra il nome e il ruolo dei personaggi di cui l’archivio non conosce il pianeta natale.',
    expectedQuery: `
      SELECT nome, ruolo
      FROM personaggi
      WHERE pianeta_origine_id IS NULL`,
    hints: [
      'Quando un dato manca, la colonna pianeta_origine_id contiene NULL.',
      'Il confronto = NULL non trova nessuna riga: per i valori mancanti si scrive IS NULL.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-108',
    chapter: 'una-tabella',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'WHERE', 'NOT LIKE'],
    title: 'Sensibili alla Forza, né Jedi né Sith',
    prompt: 'Mostra il nome e il ruolo dei personaggi sensibili alla Forza il cui ruolo non contiene né la parola «Jedi» né la parola «Sith».',
    expectedQuery: `
      SELECT nome, ruolo
      FROM personaggi
      WHERE sensibile_alla_forza = 1
        AND ruolo NOT LIKE '%Jedi%'
        AND ruolo NOT LIKE '%Sith%'`,
    hints: [
      'Le condizioni sono tre e devono valere tutte insieme: uniscile con AND.',
      'NOT LIKE \'%Jedi%\' scarta i ruoli che contengono «Jedi» in qualunque posizione; fai lo stesso per «Sith».',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-109',
    chapter: 'una-tabella',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Astronavi misurate in chilometri',
    prompt: 'Mostra il nome delle astronavi lunghe almeno 1000 metri e la loro lunghezza espressa in chilometri.',
    expectedQuery: `
      SELECT nome, lunghezza_metri / 1000 AS lunghezza_km
      FROM astronavi
      WHERE lunghezza_metri >= 1000`,
    hints: [
      'Dopo SELECT puoi scrivere un calcolo sulle colonne, non solo il nome di una colonna.',
      'Un chilometro è fatto di 1000 metri: dividi lunghezza_metri per 1000. «Almeno» vuol dire >=.',
    ],
    tables: ['astronavi'],
  },
  {
    id: 'ex-110',
    chapter: 'una-tabella',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'ORDER BY'],
    title: 'Pianeti settore per settore',
    prompt: 'Mostra il settore galattico e il nome di ogni pianeta, ordinati per settore in ordine alfabetico e, dentro lo stesso settore, per nome.',
    expectedQuery: `
      SELECT settore_galattico, nome
      FROM pianeti
      ORDER BY settore_galattico ASC, nome ASC`,
    hints: [
      'ORDER BY accetta più colonne separate da una virgola.',
      'La seconda colonna conta solo fra le righe che hanno lo stesso valore nella prima: ORDER BY settore_galattico, nome.',
    ],
    tables: ['pianeti'],
  },
  {
    id: 'ex-111',
    chapter: 'una-tabella',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'ORDER BY', 'LIMIT', 'OFFSET'],
    title: 'Dal quarto al sesto pianeta più popolato',
    prompt: 'Mostra il nome e la popolazione dei pianeti che occupano il quarto, il quinto e il sesto posto nella classifica dei più popolati, in ordine di popolazione decrescente.',
    expectedQuery: `
      SELECT nome, popolazione
      FROM pianeti
      ORDER BY popolazione DESC
      LIMIT 3 OFFSET 3`,
    hints: [
      'Ordina i pianeti dal più popolato, poi prendi tre righe saltando le prime tre.',
      'LIMIT dice quante righe tenere, OFFSET quante saltarne prima: LIMIT 3 OFFSET 3.',
    ],
    tables: ['pianeti'],
  },
  {
    id: 'ex-112',
    chapter: 'una-tabella',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'CASE'],
    title: 'Astronavi per taglia',
    prompt: 'Mostra il nome e la lunghezza di ogni astronave, con una terza colonna che vale «piccola» sotto i 20 metri, «media» da 20 a meno di 200 metri e «grande» da 200 metri in su.',
    expectedQuery: `
      SELECT nome, lunghezza_metri,
        CASE
          WHEN lunghezza_metri < 20 THEN 'piccola'
          WHEN lunghezza_metri < 200 THEN 'media'
          ELSE 'grande'
        END AS taglia
      FROM astronavi`,
    hints: [
      'Una colonna che cambia valore secondo una condizione si costruisce con CASE WHEN … THEN … END.',
      'I rami WHEN si controllano in ordine e vince il primo vero: dopo WHEN lunghezza_metri < 20, il ramo WHEN lunghezza_metri < 200 vale solo per le navi da 20 metri in su. Le altre finiscono nell’ELSE.',
    ],
    tables: ['astronavi'],
  },
  {
    id: 'ex-113',
    chapter: 'una-tabella',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Il lato oscuro della Forza',
    prompt: 'Mostra il nome, il ruolo e la fazione dei personaggi sensibili alla Forza che militano nell’Impero Galattico oppure nell’Ordine Sith.',
    expectedQuery: `
      SELECT nome, ruolo, fazione_id
      FROM personaggi
      WHERE (fazione_id = 2 OR fazione_id = 5)
        AND sensibile_alla_forza = 1`,
    hints: [
      'Nella tabella fazioni l’Impero Galattico ha id 2 e l’Ordine Sith id 5. Se nel risultato compare Grand Moff Tarkin, che non è sensibile alla Forza, controlla come si combinano AND e OR.',
      'AND si applica prima di OR: senza parentesi la condizione sulla Forza vale solo per l’Ordine Sith. Racchiudi fra parentesi i due confronti uniti da OR.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-114',
    chapter: 'una-tabella',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Quanti anni avevano a Hoth',
    prompt: 'La battaglia di Hoth è dell’anno −3. Mostra il nome dei personaggi dell’Alleanza Ribelle sensibili alla Forza e l’età che avevano in quella battaglia.',
    expectedQuery: `
      SELECT nome, anno_nascita_bby + 3 AS eta_a_hoth
      FROM personaggi
      WHERE fazione_id = 1
        AND sensibile_alla_forza = 1`,
    hints: [
      'La «Traccia» spiega come l’archivio conta gli anni: chi è nato nell’anno 19 a Yavin aveva 19 anni, e tre anni dopo ne aveva 22. L’Alleanza Ribelle ha id 1.',
      'L’età si ottiene dalla differenza fra l’anno di nascita e l’anno della battaglia: anno_nascita_bby − (−3), cioè anno_nascita_bby + 3.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-115',
    chapter: 'una-tabella',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'WHERE', 'IS NOT NULL', 'ORDER BY', 'LIMIT'],
    title: 'I tre personaggi più giovani',
    prompt: 'Mostra il nome e l’anno di nascita dei tre personaggi più giovani di cui l’archivio conosce l’anno di nascita, dal più giovane, e a parità di anno in ordine alfabetico.',
    expectedQuery: `
      SELECT nome, anno_nascita_bby
      FROM personaggi
      WHERE anno_nascita_bby IS NOT NULL
      ORDER BY anno_nascita_bby ASC, nome ASC
      LIMIT 3`,
    hints: [
      'Il più giovane è nato più vicino a Yavin, cioè ha l’anno di nascita più piccolo. Prova la query senza filtri: chi compare in cima?',
      'In ordine crescente SQLite mette i NULL prima di tutti gli altri valori, così Greef Karga, di cui l’anno manca, finisce primo. Escludilo con WHERE anno_nascita_bby IS NOT NULL.',
    ],
    tables: ['personaggi'],
  },
];

export default exercises;
