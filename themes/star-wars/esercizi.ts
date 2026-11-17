import type { Exercise } from '../../src/themes/contract.ts';

// Esercizi portati dal prototipo jedi-academy (F04) e verificati su SQLite.
// Titoli, consegne e suggerimenti sono quelli del prototipo: li rivede F07.
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
    title: 'Conteggio Totale dei Personaggi',
    prompt: "Calcola il numero totale di personaggi registrati negli archivi, rinominando la colonna di conteggio come 'totale_personaggi'.",
    expectedQuery: `
      SELECT COUNT(*) AS totale_personaggi
      FROM personaggi`,
    hints: [
      'Usa la funzione di aggregazione COUNT(*).',
      "Assegna l'alias con AS totale_personaggi.",
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-037',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'GROUP BY', 'COUNT'],
    title: 'Numero di Personaggi per Fazione',
    prompt: 'Raggruppa i personaggi in base alla loro fazione (fazione_id) e calcola quanti personaggi appartengono a ciascuna fazione. Mostra fazione_id e il conteggio.',
    expectedQuery: `
      SELECT fazione_id, COUNT(*) AS numero_personaggi
      FROM personaggi
      GROUP BY fazione_id`,
    hints: [
      'Usa la clausola GROUP BY su fazione_id.',
      'Includi COUNT(*) nella lista delle colonne da selezionare.',
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
    title: 'Popolazione Totale per Settore Galattico',
    prompt: 'Calcola la somma complessiva della popolazione dei pianeti per ciascun settore galattico. Mostra settore_galattico e la somma della popolazione.',
    expectedQuery: `
      SELECT settore_galattico, SUM(popolazione) AS popolazione_totale
      FROM pianeti
      GROUP BY settore_galattico`,
    hints: [
      'Usa la funzione aggregata SUM(popolazione).',
      'Raggruppa le righe tramite GROUP BY settore_galattico.',
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
    title: 'Fazioni con Almeno 3 Personaggi',
    prompt: 'Trova gli ID delle fazioni (fazione_id) che contano almeno 3 personaggi registrati, insieme al numero di personaggi.',
    expectedQuery: `
      SELECT fazione_id, COUNT(*) AS totale
      FROM personaggi
      GROUP BY fazione_id
      HAVING COUNT(*) >= 3`,
    hints: [
      'Per filtrare i risultati aggregati non puoi usare WHERE, devi usare la clausola HAVING.',
      'La condizione dopo GROUP BY è: HAVING COUNT(*) >= 3.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-042',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'AVG'],
    title: 'Lunghezza Media delle Astronavi',
    prompt: 'Calcola la lunghezza media in metri delle astronavi registrate, arrotondata o mostrata come valore medio.',
    expectedQuery: `
      SELECT AVG(lunghezza_metri) AS lunghezza_media
      FROM astronavi`,
    hints: [
      'Usa la funzione aggregata AVG(lunghezza_metri).',
      'Assegna un alias alla colonna risultante.',
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
    title: 'Numero di Spade Laser per Colore',
    prompt: 'Calcola quante spade laser esistono per ciascun colore di lama. Mostra il colore della lama e il conteggio, ordinati per conteggio decrescente. A parità di conteggio, ordina per colore in ordine alfabetico.',
    expectedQuery: `
      SELECT colore_lama, COUNT(*) AS quantita
      FROM spade_laser
      GROUP BY colore_lama
      ORDER BY quantita DESC, colore_lama ASC`,
    hints: [
      'Raggruppa con GROUP BY colore_lama.',
      'Ordina il risultato per quantita DESC.',
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
    title: 'Perdite Medie per Battaglia',
    prompt: 'Calcola le perdite stimate minime, massime e medie tra tutte le battaglie registrate.',
    expectedQuery: `
      SELECT MIN(perdite_stimate) AS perdite_minime,
             MAX(perdite_stimate) AS perdite_massime,
             AVG(perdite_stimate) AS perdite_medie
      FROM battaglie`,
    hints: [
      'Usa le tre funzioni MIN, MAX e AVG sulla colonna perdite_stimate.',
      'Assegna alias leggibili.',
    ],
    tables: ['battaglie'],
  },
  {
    id: 'ex-048',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'GROUP BY', 'HAVING', 'COUNT'],
    title: 'Pianeti con più di 2 Personaggi Nativi',
    prompt: 'Trova gli ID dei pianeti di origine (pianeta_origine_id) da cui provengono più di 2 personaggi registrati, insieme al numero di personaggi nativi.',
    expectedQuery: `
      SELECT pianeta_origine_id, COUNT(*) AS totale_nativi
      FROM personaggi
      GROUP BY pianeta_origine_id
      HAVING COUNT(*) > 2`,
    hints: [
      'Raggruppa per pianeta_origine_id.',
      "Usa HAVING COUNT(*) > 2 per filtrare dopo l'aggregazione.",
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
    title: 'Numero di Astronavi per Costruttore',
    prompt: 'Mostra il nome di ciascun costruttore e il numero totale di modelli di astronave costruiti, ordinando dal costruttore con più astronavi a quello con meno. A parità di numero, ordina per costruttore in ordine alfabetico.',
    expectedQuery: `
      SELECT costruttore, COUNT(*) AS numero_navi
      FROM astronavi
      GROUP BY costruttore
      ORDER BY numero_navi DESC, costruttore ASC`,
    hints: [
      'Raggruppa per costruttore.',
      'Ordina in ordine decrescente usando il conteggio.',
    ],
    tables: ['astronavi'],
  },
  {
    id: 'ex-051',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'GROUP BY', 'COUNT'],
    title: 'Numero di Pianeti per Tipologia di Clima',
    prompt: 'Conta quanti pianeti sono associati a ciascun clima. Mostra il clima e il numero di pianeti.',
    expectedQuery: `
      SELECT clima, COUNT(*) AS numero_pianeti
      FROM pianeti
      GROUP BY clima`,
    hints: [
      'Usa GROUP BY clima.',
      'Includi COUNT(*) con alias numero_pianeti.',
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
    title: 'Capacità Equipaggio Totale per Fazione',
    prompt: "Calcola la somma complessiva della capacità dell'equipaggio di tutte le navi appartenenti a ciascuna fazione (fazione_id). Mostra fazione_id e il totale equipaggio.",
    expectedQuery: `
      SELECT fazione_id, SUM(capacita_equipaggio) AS equipaggio_totale
      FROM astronavi
      GROUP BY fazione_id`,
    hints: [
      'Raggruppa le astronavi per fazione_id.',
      'Usa la funzione SUM(capacita_equipaggio).',
    ],
    tables: ['astronavi'],
  },
  {
    id: 'ex-054',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'GROUP BY', 'AVG'],
    title: 'Aspettativa di Vita Media per Linguaggio',
    prompt: "Calcola l'aspettativa di vita media per ciascun linguaggio delle specie registrate.",
    expectedQuery: `
      SELECT linguaggio, AVG(aspettativa_vita_media) AS vita_media
      FROM specie
      GROUP BY linguaggio`,
    hints: [
      'Raggruppa per la colonna linguaggio.',
      'Usa AVG(aspettativa_vita_media).',
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
    title: 'Numero di Personaggi Sensibili alla Forza per Fazione',
    prompt: 'Conta quanti personaggi sensibili alla Forza (sensibile_alla_forza = 1) appartengono a ciascuna fazione (fazione_id).',
    expectedQuery: `
      SELECT fazione_id, COUNT(*) AS jedi_o_sith
      FROM personaggi
      WHERE sensibile_alla_forza = 1
      GROUP BY fazione_id`,
    hints: [
      'Filtra prima con WHERE sensibile_alla_forza = 1.',
      'Poi raggruppa con GROUP BY fazione_id.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-057',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'GROUP BY', 'MAX'],
    title: 'Lunghezza Massima delle Navi per Fazione',
    prompt: 'Trova la lunghezza massima in metri delle astronavi per ciascuna fazione (fazione_id).',
    expectedQuery: `
      SELECT fazione_id, MAX(lunghezza_metri) AS lunghezza_massima
      FROM astronavi
      GROUP BY fazione_id`,
    hints: [
      'Usa la funzione MAX(lunghezza_metri).',
      'Raggruppa per fazione_id.',
    ],
    tables: ['astronavi'],
  },
  {
    id: 'ex-058',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'GROUP BY', 'SUM'],
    title: 'Perdite Totali delle Battaglie per Pianeta',
    prompt: 'Calcola le perdite stimate totali subite su ciascun pianeta (pianeta_id) nelle battaglie registrate.',
    expectedQuery: `
      SELECT pianeta_id, SUM(perdite_stimate) AS perdite_totali
      FROM battaglie
      GROUP BY pianeta_id`,
    hints: [
      'Raggruppa per pianeta_id nella tabella battaglie.',
      'Usa SUM(perdite_stimate).',
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
    title: 'Settori Galattici con più di 3 Pianeti',
    prompt: 'Trova i settori galattici che contengono più di 3 pianeti, visualizzando il settore e il conteggio dei pianeti.',
    expectedQuery: `
      SELECT settore_galattico, COUNT(*) AS numero_pianeti
      FROM pianeti
      GROUP BY settore_galattico
      HAVING COUNT(*) > 3`,
    hints: [
      'Raggruppa per settore_galattico.',
      'Usa HAVING COUNT(*) > 3 per filtrare sui gruppi.',
    ],
    tables: ['pianeti'],
  },
  {
    id: 'ex-061',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'WHERE', 'AVG'],
    title: 'Età Media dei Personaggi Sensibili alla Forza',
    prompt: "Calcola il valore medio dell'anno di nascita (anno_nascita_bby) per tutti i personaggi che sono sensibili alla Forza.",
    expectedQuery: `
      SELECT AVG(anno_nascita_bby) AS media_anno_bby
      FROM personaggi
      WHERE sensibile_alla_forza = 1`,
    hints: [
      'Filtra con WHERE sensibile_alla_forza = 1.',
      'Calcola AVG(anno_nascita_bby).',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-062',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'GROUP BY', 'COUNT'],
    title: 'Tipi di Fazione e Numero di Fazioni Registrate',
    prompt: 'Mostra ogni tipo di fazione presente e quante fazioni appartengono a quel tipo.',
    expectedQuery: `
      SELECT tipo, COUNT(*) AS numero_fazioni
      FROM fazioni
      GROUP BY tipo`,
    hints: [
      "Raggruppa per la colonna 'tipo' nella tabella fazioni.",
      'Conta i record con COUNT(*).',
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
    title: 'Velocità Media Iperguida per Fazione',
    prompt: "Calcola la velocità media nell'iperguida delle navi per ciascuna fazione (fazione_id).",
    expectedQuery: `
      SELECT fazione_id, AVG(velocita_iperguida) AS velocita_media
      FROM astronavi
      GROUP BY fazione_id`,
    hints: [
      'Raggruppa per fazione_id.',
      'Usa AVG(velocita_iperguida).',
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
    title: 'Numero di Battaglie Vinte per Fazione',
    prompt: "Calcola quante battaglie ha vinto ciascuna fazione vincitrice (fazione_vincitrice_id). Mostra l'ID e il totale di vittorie.",
    expectedQuery: `
      SELECT fazione_vincitrice_id, COUNT(*) AS vittorie
      FROM battaglie
      GROUP BY fazione_vincitrice_id`,
    hints: [
      'Raggruppa per fazione_vincitrice_id nella tabella battaglie.',
      'Conta con COUNT(*).',
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
    title: 'Numero di Personaggi Umani per Pianeta Natale',
    prompt: 'Conta quanti personaggi umani (specie_id = 1) provengono da ciascun pianeta di origine (pianeta_origine_id).',
    expectedQuery: `
      SELECT pianeta_origine_id, COUNT(*) AS numero_umani
      FROM personaggi
      WHERE specie_id = 1
      GROUP BY pianeta_origine_id`,
    hints: [
      'Filtra prima con WHERE specie_id = 1.',
      'Poi raggruppa con GROUP BY pianeta_origine_id.',
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
    title: 'Fazioni con più di 1 Astronave Operativa',
    prompt: 'Trova gli ID delle fazioni (fazione_id) che possiedono più di 1 astronave registrata, insieme al conteggio.',
    expectedQuery: `
      SELECT fazione_id, COUNT(*) AS totale_navi
      FROM astronavi
      GROUP BY fazione_id
      HAVING COUNT(*) > 1`,
    hints: [
      'Raggruppa le astronavi per fazione_id.',
      'Filtra con la clausola HAVING COUNT(*) > 1.',
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
      'Le informazioni sono sparse in quattro tabelle: la tabella personaggi va unita alle altre tre.',
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
    title: 'Pianeti Senza Alcun Personaggio Registrato (Sottoquery NOT IN)',
    prompt: "Trova il nome di tutti i pianeti dai quali NON proviene alcun personaggio registrato nella tabella 'personaggi'.",
    expectedQuery: `
      SELECT nome
      FROM pianeti
      WHERE id NOT IN (SELECT pianeta_origine_id FROM personaggi WHERE pianeta_origine_id IS NOT NULL)`,
    hints: [
      'Usa una sottoquery con NOT IN: WHERE id NOT IN (SELECT pianeta_origine_id FROM personaggi ...).',
      'In alternativa puoi usare una LEFT JOIN filtrando dove la chiave del personaggio è NULL.',
    ],
    tables: ['pianeti', 'personaggi'],
  },
  {
    id: 'ex-079',
    chapter: 'sottoquery-viste',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'WHERE', 'NOT IN'],
    title: 'Personaggi che NON Possiedono una Spada Laser',
    prompt: "Trova il nome e il ruolo di tutti i personaggi che NON hanno una spada laser registrata nell'archivio.",
    expectedQuery: `
      SELECT nome, ruolo
      FROM personaggi
      WHERE id NOT IN (SELECT personaggio_id FROM spade_laser)`,
    hints: [
      'Usa una sottoquery per selezionare tutti i personaggio_id presenti in spade_laser.',
      'Filtra la tabella personaggi con WHERE id NOT IN (...).',
    ],
    tables: ['personaggi', 'spade_laser'],
  },
  {
    id: 'ex-080',
    chapter: 'sottoquery-viste',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Astronavi Più Lunghe della Lunghezza Media di Tutte le Navi',
    prompt: 'Seleziona il nome, il modello e la lunghezza delle astronavi la cui lunghezza supera la lunghezza media di tutte le astronavi della flotta.',
    expectedQuery: `
      SELECT nome, modello, lunghezza_metri
      FROM astronavi
      WHERE lunghezza_metri > (SELECT AVG(lunghezza_metri) FROM astronavi)`,
    hints: [
      'Crea una sottoquery scalare (SELECT AVG(lunghezza_metri) FROM astronavi).',
      "Usa l'operatore maggiore (>) nella clausola WHERE della query principale.",
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
    title: 'Fazioni con Flotta: Conteggio Navi e Lunghezza Totale',
    prompt: "Per ogni fazione che possiede almeno un'astronave, mostra il nome della fazione, il numero di astronavi e la somma della loro lunghezza in metri.",
    expectedQuery: `
      SELECT fazioni.nome AS fazione,
             COUNT(astronavi.id) AS numero_navi,
             SUM(astronavi.lunghezza_metri) AS lunghezza_totale
      FROM fazioni
      JOIN astronavi ON fazioni.id = astronavi.fazione_id
      GROUP BY fazioni.nome`,
    hints: [
      'Unisci fazioni e astronavi.',
      'Raggruppa per fazioni.nome e calcola COUNT e SUM.',
    ],
    tables: ['fazioni', 'astronavi'],
  },
  {
    id: 'ex-083',
    chapter: 'aggregazioni',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'JOIN', 'GROUP BY', 'MAX'],
    title: 'Personaggio Più Anziano per Ciascuna Fazione (Sottoquery Correlata o Raggruppamento)',
    prompt: "Trova il valore massimo di anno_nascita_bby (il più anziano) per ciascuna fazione, mostrando il nome della fazione e l'età massima in BBY.",
    expectedQuery: `
      SELECT fazioni.nome AS fazione, MAX(personaggi.anno_nascita_bby) AS massimo_anno_bby
      FROM personaggi
      JOIN fazioni ON personaggi.fazione_id = fazioni.id
      GROUP BY fazioni.nome`,
    hints: [
      'Unisci personaggi con fazioni.',
      'Raggruppa per fazioni.nome e usa MAX(personaggi.anno_nascita_bby).',
    ],
    tables: ['personaggi', 'fazioni'],
  },
  {
    id: 'ex-084',
    chapter: 'sottoquery-viste',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Pianeti la cui Popolazione Supera quella di Tatooine',
    prompt: "Seleziona il nome e la popolazione dei pianeti che hanno una popolazione superiore a quella di 'Tatooine', usando una sottoquery.",
    expectedQuery: `
      SELECT nome, popolazione
      FROM pianeti
      WHERE popolazione > (SELECT popolazione FROM pianeti WHERE nome = 'Tatooine')`,
    hints: [
      "Usa una sottoquery per ricavare la popolazione di Tatooine: (SELECT popolazione FROM pianeti WHERE nome = 'Tatooine').",
      "Confronta la popolazione con l'operatore >.",
    ],
    tables: ['pianeti'],
  },
  {
    id: 'ex-085',
    chapter: 'aggregazioni',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'JOIN', 'GROUP BY', 'HAVING', 'COUNT'],
    title: 'Fazioni che Hanno Vinto Almeno 2 Battaglie',
    prompt: 'Trova il nome delle fazioni che hanno vinto 2 o più battaglie, unendo battaglie e fazioni e applicando un filtro sui gruppi.',
    expectedQuery: `
      SELECT fazioni.nome AS fazione, COUNT(battaglie.id) AS vittorie
      FROM fazioni
      JOIN battaglie ON fazioni.id = battaglie.fazione_vincitrice_id
      GROUP BY fazioni.nome
      HAVING COUNT(battaglie.id) >= 2`,
    hints: [
      'Unisci fazioni e battaglie.',
      'Raggruppa per fazioni.nome e filtra con HAVING COUNT(battaglie.id) >= 2.',
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
    title: 'Pianeti che sono Teatri di Battaglie con Perdite Superiori alla Media',
    prompt: 'Trova i nomi dei pianeti dove si sono svolte battaglie con perdite stimate superiori alla media delle perdite di tutte le battaglie.',
    expectedQuery: `
      SELECT DISTINCT pianeti.nome
      FROM pianeti
      JOIN battaglie ON pianeti.id = battaglie.pianeta_id
      WHERE battaglie.perdite_stimate > (SELECT AVG(perdite_stimate) FROM battaglie)`,
    hints: [
      'Usa una sottoquery (SELECT AVG(perdite_stimate) FROM battaglie) nel filtro WHERE.',
      'Unisci pianeti con battaglie e usa DISTINCT.',
    ],
    tables: ['pianeti', 'battaglie'],
  },
  {
    id: 'ex-088',
    chapter: 'aggregazioni',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'LEFT JOIN', 'GROUP BY', 'COUNT'],
    title: 'Numero di Personaggi per Nome della Fazione (anche fazioni con 0 personaggi)',
    prompt: 'Mostra il nome di TUTTE le fazioni e il numero di personaggi appartenenti a ciascuna, includendo anche le fazioni senza personaggi (LEFT JOIN).',
    expectedQuery: `
      SELECT fazioni.nome AS fazione, COUNT(personaggi.id) AS totale_personaggi
      FROM fazioni
      LEFT JOIN personaggi ON fazioni.id = personaggi.fazione_id
      GROUP BY fazioni.nome`,
    hints: [
      'Usa una LEFT JOIN partendo da fazioni verso personaggi.',
      'Conta personaggi.id (e NON *) per contare 0 quando non ci sono corrispondenze.',
    ],
    tables: ['fazioni', 'personaggi'],
  },
  {
    id: 'ex-089',
    chapter: 'aggregazioni',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'JOIN', 'GROUP BY', 'MIN'],
    title: 'Le Astronavi Più Veloci di Ciascuna Fazione',
    prompt: "Trova la velocità minima nell'iperguida (massima rapidità) registrata per ciascuna fazione che possiede navi, mostrando il nome della fazione e la velocità minima.",
    expectedQuery: `
      SELECT fazioni.nome AS fazione, MIN(astronavi.velocita_iperguida) AS velocita_migliore
      FROM fazioni
      JOIN astronavi ON fazioni.id = astronavi.fazione_id
      GROUP BY fazioni.nome`,
    hints: [
      'Unisci fazioni con astronavi.',
      'Raggruppa per fazioni.nome e usa MIN(astronavi.velocita_iperguida).',
    ],
    tables: ['fazioni', 'astronavi'],
  },
  {
    id: 'ex-090',
    chapter: 'sottoquery-viste',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Personaggi della Stessa Specie di Yoda (Sottoquery)',
    prompt: "Trova il nome e l'anno di nascita di tutti i personaggi appartenenti alla stessa specie di 'Yoda' (escluso Yoda stesso).",
    expectedQuery: `
      SELECT nome, anno_nascita_bby
      FROM personaggi
      WHERE specie_id = (SELECT specie_id FROM personaggi WHERE nome = 'Yoda')
        AND nome <> 'Yoda'`,
    hints: [
      "Usa una sottoquery per trovare specie_id di Yoda: (SELECT specie_id FROM personaggi WHERE nome = 'Yoda').",
      "Escludi Yoda con AND nome <> 'Yoda'.",
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
    title: "Pianeti con Popolazione Superiore alla Somma di Tutti i Pianeti dell'Orlo Esterno",
    prompt: "Trova il nome e la popolazione dei pianeti la cui popolazione da sola è maggiore della popolazione totale di tutti i pianeti dell'Orlo Esterno.",
    expectedQuery: `
      SELECT nome, popolazione
      FROM pianeti
      WHERE popolazione > (SELECT SUM(popolazione) FROM pianeti WHERE settore_galattico = 'Orlo Esterno')`,
    hints: [
      "Calcola la somma dell'Orlo Esterno in una sottoquery: (SELECT SUM(popolazione) FROM pianeti WHERE settore_galattico = 'Orlo Esterno').",
      'Confronta con la popolazione del singolo pianeta.',
    ],
    tables: ['pianeti'],
  },
  {
    id: 'ex-094',
    chapter: 'sottoquery-viste',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'WHERE', 'IN'],
    title: 'Fazioni che Hanno Sia Personaggi che Astronavi',
    prompt: "Estrai i nomi delle fazioni che hanno sia almeno un personaggio registrato sia almeno un'astronave registrata.",
    expectedQuery: `
      SELECT nome
      FROM fazioni
      WHERE id IN (SELECT fazione_id FROM personaggi)
        AND id IN (SELECT fazione_id FROM astronavi)`,
    hints: [
      'Usa due condizioni con IN: id IN (SELECT fazione_id FROM personaggi) AND id IN (SELECT fazione_id FROM astronavi).',
      'Seleziona il nome della fazione.',
    ],
    tables: ['fazioni', 'personaggi', 'astronavi'],
  },
  {
    id: 'ex-095',
    chapter: 'aggregazioni',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'JOIN', 'GROUP BY', 'ORDER BY', 'SUM'],
    title: 'Perdite Complessive nelle Battaglie per Fazione Vincitrice (con Nome Fazione)',
    prompt: 'Mostra il nome della fazione vincitrice e il totale delle perdite stimate causate nei conflitti vinti, ordinando dalla fazione con più perdite a quella con meno.',
    expectedQuery: `
      SELECT fazioni.nome AS fazione, SUM(battaglie.perdite_stimate) AS perdite_totali
      FROM fazioni
      JOIN battaglie ON fazioni.id = battaglie.fazione_vincitrice_id
      GROUP BY fazioni.nome
      ORDER BY perdite_totali DESC`,
    hints: [
      'Unisci fazioni e battaglie.',
      'Raggruppa per fazioni.nome e somma perdite_stimate con SUM().',
      'Ordina con ORDER BY perdite_totali DESC.',
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
    title: 'Distribuzione Spade Laser per Tipo Cristallo e Fazione del Personaggio',
    prompt: 'Mostra il tipo di cristallo, il nome della fazione e il conteggio delle spade laser, unendo spade_laser, personaggi e fazioni.',
    expectedQuery: `
      SELECT spade_laser.tipo_cristallo, fazioni.nome AS fazione, COUNT(*) AS totale
      FROM spade_laser
      JOIN personaggi ON spade_laser.personaggio_id = personaggi.id
      JOIN fazioni ON personaggi.fazione_id = fazioni.id
      GROUP BY spade_laser.tipo_cristallo, fazioni.nome`,
    hints: [
      'Unisci 3 tabelle: spade_laser, personaggi, fazioni.',
      'Raggruppa sia per spade_laser.tipo_cristallo sia per fazioni.nome.',
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
    title: 'Fazioni Senza Battaglie Vinte (LEFT JOIN o NOT IN)',
    prompt: 'Mostra il nome e il leader di tutte le fazioni che NON hanno vinto alcuna battaglia registrata.',
    expectedQuery: `
      SELECT fazioni.nome, leader.nome AS leader
      FROM fazioni
      JOIN personaggi AS leader ON fazioni.leader_id = leader.id
      WHERE fazioni.id NOT IN (SELECT fazione_vincitrice_id FROM battaglie)`,
    hints: [
      'Usa una sottoquery per ricavare gli ID delle fazioni vincitrici.',
      'Filtra la tabella fazioni con id NOT IN (...).',
      'Il leader di una fazione è un personaggio: unisci la tabella personaggi, dandole un alias (per esempio AS leader).',
    ],
    tables: ['fazioni', 'battaglie', 'personaggi'],
  },
  {
    id: 'ex-102',
    chapter: 'sottoquery-viste',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'WHERE', 'MAX'],
    title: 'Pianeti con Popolazione Maggiore di Qualsiasi Pianeta del Settore Mediano',
    prompt: "Seleziona il nome e la popolazione dei pianeti la cui popolazione supera il massimo di popolazione presente nell'Orlo Mediano.",
    expectedQuery: `
      SELECT nome, popolazione
      FROM pianeti
      WHERE popolazione > (SELECT MAX(popolazione) FROM pianeti WHERE settore_galattico = 'Orlo Mediano')`,
    hints: [
      "Trova il massimo con (SELECT MAX(popolazione) FROM pianeti WHERE settore_galattico = 'Orlo Mediano').",
      'Confronta con popolazione > (...).',
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
    title: 'Riepilogo Generale Galattico: Fazioni con Conteggio Personaggi e Conteggio Navi',
    prompt: 'Mostra il nome della fazione, il numero di personaggi appartenenti a quella fazione (conteggio calcolato) e il suo tipo.',
    expectedQuery: `
      SELECT fazioni.nome AS fazione, fazioni.tipo, COUNT(personaggi.id) AS numero_membri
      FROM fazioni
      JOIN personaggi ON fazioni.id = personaggi.fazione_id
      GROUP BY fazioni.nome, fazioni.tipo`,
    hints: [
      'Unisci fazioni e personaggi.',
      'Raggruppa per fazioni.nome e fazioni.tipo, calcolando COUNT(personaggi.id).',
    ],
    tables: ['fazioni', 'personaggi'],
  },
];

export default exercises;
