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
    title: 'Tutti i Pianeti della Galassia',
    prompt: "Recupera tutti i dati e tutte le colonne della tabella 'pianeti'.",
    expectedQuery: `
      SELECT *
      FROM pianeti`,
    hints: [
      "Per selezionare tutte le colonne senza elencarle una ad una, usa l'asterisco *.",
      'Specifica la tabella corretta con la clausola FROM.',
    ],
    tables: ['pianeti'],
  },
  {
    id: 'ex-002',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM'],
    title: 'Nomi e Clima dei Pianeti',
    prompt: 'Seleziona solamente il nome e il clima di tutti i pianeti presenti negli archivi.',
    expectedQuery: `
      SELECT nome, clima
      FROM pianeti`,
    hints: [
      'Elenca le colonne richieste separate da una virgola dopo la parola chiave SELECT.',
      "Le colonne da proiettare sono 'nome' e 'clima'.",
    ],
    tables: ['pianeti'],
  },
  {
    id: 'ex-003',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Personaggi Sensibili alla Forza',
    prompt: 'Mostra il nome e il ruolo di tutti i personaggi che sono sensibili alla Forza (sensibile_alla_forza = 1).',
    expectedQuery: `
      SELECT nome, ruolo
      FROM personaggi
      WHERE sensibile_alla_forza = 1`,
    hints: [
      'Usa la clausola WHERE per filtrare i record.',
      'Imposta la condizione: sensibile_alla_forza = 1.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-004',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Pianeti del Settore Orlo Esterno',
    prompt: "Estrai il nome, il terreno e la popolazione di tutti i pianeti che appartengono al settore 'Orlo Esterno'.",
    expectedQuery: `
      SELECT nome, terreno, popolazione
      FROM pianeti
      WHERE settore_galattico = 'Orlo Esterno'`,
    hints: [
      "I valori di tipo testo devono essere racchiusi tra apici singoli, es: 'Orlo Esterno'.",
      'La colonna su cui filtrare è settore_galattico.',
    ],
    tables: ['pianeti'],
  },
  {
    id: 'ex-005',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Astronavi di Grandi Dimensioni',
    prompt: 'Trova il nome, il modello e la lunghezza delle astronavi con una lunghezza superiore a 100 metri.',
    expectedQuery: `
      SELECT nome, modello, lunghezza_metri
      FROM astronavi
      WHERE lunghezza_metri > 100`,
    hints: [
      "Usa l'operatore di confronto maggiore (>).",
      'Il campo da verificare è lunghezza_metri.',
    ],
    tables: ['astronavi'],
  },
  {
    id: 'ex-006',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'ORDER BY'],
    title: 'Pianeti Ordinati per Popolazione',
    prompt: 'Mostra il nome e la popolazione di tutti i pianeti, ordinandoli in ordine decrescente di popolazione (dai più popolati ai meno popolati).',
    expectedQuery: `
      SELECT nome, popolazione
      FROM pianeti
      ORDER BY popolazione DESC`,
    hints: [
      'Aggiungi la clausola ORDER BY alla fine della query.',
      "Per l'ordine decrescente usa la parola chiave DESC.",
    ],
    tables: ['pianeti'],
  },
  {
    id: 'ex-007',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'ORDER BY', 'LIMIT'],
    title: "Le 3 Astronavi più Veloci nell'Iperguida",
    prompt: "Seleziona il nome, il modello e la velocità nell'iperguida delle prime 3 astronavi con il valore di velocita_iperguida più basso (in Star Wars, valore più basso indica astronave più rapida). A parità di velocità, ordina per nome in ordine alfabetico.",
    expectedQuery: `
      SELECT nome, modello, velocita_iperguida
      FROM astronavi
      ORDER BY velocita_iperguida ASC, nome ASC
      LIMIT 3`,
    hints: [
      'Ordina per velocita_iperguida in ordine crescente (ASC).',
      'Limita il numero di righe restituite a 3 usando la clausola LIMIT 3.',
    ],
    tables: ['astronavi'],
  },
  {
    id: 'ex-008',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Personaggi Nati Prima di 50 BBY',
    prompt: "Recupera il nome e l'anno di nascita (anno_nascita_bby) dei personaggi nati prima di 50 BBY (ovvero con anno_nascita_bby > 50).",
    expectedQuery: `
      SELECT nome, anno_nascita_bby
      FROM personaggi
      WHERE anno_nascita_bby > 50`,
    hints: [
      'Filtra usando la colonna anno_nascita_bby.',
      'La condizione è: anno_nascita_bby > 50.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-009',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Pianeti dal Clima Arido o Ghiacciato',
    prompt: "Mostra il nome e il clima dei pianeti il cui clima è 'arido' oppure 'ghiacciato'.",
    expectedQuery: `
      SELECT nome, clima
      FROM pianeti
      WHERE clima = 'arido' OR clima = 'ghiacciato'`,
    hints: [
      "Puoi usare l'operatore logico OR, oppure la clausola IN ('arido', 'ghiacciato').",
      'Verifica la sintassi del confronto di stringhe.',
    ],
    tables: ['pianeti'],
  },
  {
    id: 'ex-010',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Spade Laser Verdi',
    prompt: "Estrai l'identificativo e il tipo di cristallo di tutte le spade laser che hanno una lama di colore 'Verde'.",
    expectedQuery: `
      SELECT id, tipo_cristallo
      FROM spade_laser
      WHERE colore_lama = 'Verde'`,
    hints: [
      'La tabella da interrogare è spade_laser.',
      "La condizione sul colore è: colore_lama = 'Verde'.",
    ],
    tables: ['spade_laser'],
  },
  {
    id: 'ex-011',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'DISTINCT', 'FROM'],
    title: 'Tipi Distinti di Clima',
    prompt: 'Elenca tutti i tipi distinti di clima presenti nella tabella dei pianeti, senza ripetizioni.',
    expectedQuery: `
      SELECT DISTINCT clima
      FROM pianeti`,
    hints: [
      'Usa la parola chiave DISTINCT subito dopo SELECT per eliminare i duplicati.',
      'La colonna da selezionare è clima.',
    ],
    tables: ['pianeti'],
  },
  {
    id: 'ex-012',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Caccia e Navi Monoposto',
    prompt: 'Trova il nome e il costruttore delle astronavi che hanno una capacità di equipaggio esattamente pari a 1.',
    expectedQuery: `
      SELECT nome, costruttore
      FROM astronavi
      WHERE capacita_equipaggio = 1`,
    hints: [
      'La colonna da verificare è capacita_equipaggio.',
      'La condizione è capacita_equipaggio = 1.',
    ],
    tables: ['astronavi'],
  },
  {
    id: 'ex-013',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE', 'LIKE'],
    title: "Personaggi con Nome che Inizia per 'Darth'",
    prompt: "Seleziona il nome e il ruolo di tutti i personaggi il cui nome inizia con il titolo 'Darth'.",
    expectedQuery: `
      SELECT nome, ruolo
      FROM personaggi
      WHERE nome LIKE 'Darth%'`,
    hints: [
      "Usa l'operatore LIKE con il carattere jolly percentuale %.",
      "Il pattern di ricerca è 'Darth%'.",
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-014',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Pianeti con Popolazione Compresa tra 1 Milione e 10 Miliardi',
    prompt: 'Estrai il nome e la popolazione dei pianeti la cui popolazione è compresa tra 1.000.000 e 10.000.000.000 (estremi inclusi).',
    expectedQuery: `
      SELECT nome, popolazione
      FROM pianeti
      WHERE popolazione BETWEEN 1000000 AND 10000000000`,
    hints: [
      "Puoi usare l'operatore BETWEEN ... AND ... oppure due confronti uniti da AND.",
      'Fai attenzione al numero di zeri: 1000000 e 10000000000.',
    ],
    tables: ['pianeti'],
  },
  {
    id: 'ex-015',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Fazioni Governative',
    prompt: "Mostra il nome, il leader e il motto di tutte le fazioni che sono classificate come 'Governo'.",
    expectedQuery: `
      SELECT nome, leader, motto
      FROM fazioni
      WHERE tipo = 'Governo'`,
    hints: [
      'La tabella di riferimento è fazioni.',
      "Filtra con tipo = 'Governo'.",
    ],
    tables: ['fazioni'],
  },
  {
    id: 'ex-016',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Battaglie con Perdite Elevate',
    prompt: "Seleziona il nome della battaglia, l'anno e le perdite stimate per tutti gli scontri che hanno causato più di 10.000 perdite.",
    expectedQuery: `
      SELECT nome, anno_bby, perdite_stimate
      FROM battaglie
      WHERE perdite_stimate > 10000`,
    hints: [
      'Interroga la tabella battaglie.',
      'Filtra dove perdite_stimate > 10000.',
    ],
    tables: ['battaglie'],
  },
  {
    id: 'ex-017',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Specie con Aspettativa di Vita Alta',
    prompt: "Trova il nome e l'aspettativa di vita media delle specie con una vita media superiore a 100 anni.",
    expectedQuery: `
      SELECT nome, aspettativa_vita_media
      FROM specie
      WHERE aspettativa_vita_media > 100`,
    hints: [
      'Tabella da utilizzare: specie.',
      'Condizione: aspettativa_vita_media > 100.',
    ],
    tables: ['specie'],
  },
  {
    id: 'ex-018',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Personaggi Senza sensibilità alla Forza',
    prompt: 'Mostra il nome e il ruolo di tutti i personaggi non sensibili alla Forza (sensibile_alla_forza = 0).',
    expectedQuery: `
      SELECT nome, ruolo
      FROM personaggi
      WHERE sensibile_alla_forza = 0`,
    hints: [
      'Imposta il filtro sensibile_alla_forza = 0.',
      'Le colonne richieste sono nome e ruolo.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-019',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE', 'LIKE'],
    title: 'Spade Laser con Impugnatura Curva',
    prompt: "Recupera tutte le colonne delle spade laser che possiedono una impugnatura curva ('Impugnatura curva da duello' o contenente 'curva').",
    expectedQuery: `
      SELECT *
      FROM spade_laser
      WHERE impugnatura LIKE '%curva%'`,
    hints: [
      "Usa l'operatore LIKE con '%curva%'.",
      'Seleziona tutte le colonne con *.',
    ],
    tables: ['spade_laser'],
  },
  {
    id: 'ex-020',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'DISTINCT', 'FROM'],
    title: 'Costruttori di Astronavi Distinti',
    prompt: 'Seleziona i nomi univoci (senza duplicati) di tutti i costruttori navali registrati nella tabella delle astronavi.',
    expectedQuery: `
      SELECT DISTINCT costruttore
      FROM astronavi`,
    hints: [
      'Usa la parola chiave DISTINCT per scartare i duplicati.',
      'La colonna è costruttore.',
    ],
    tables: ['astronavi'],
  },
  {
    id: 'ex-021',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Pianeti Disabitati o Quasi Disabitati',
    prompt: 'Trova il nome, il clima e la popolazione dei pianeti con una popolazione inferiore o uguale a 1.000 abitanti.',
    expectedQuery: `
      SELECT nome, clima, popolazione
      FROM pianeti
      WHERE popolazione <= 1000`,
    hints: [
      "Usa l'operatore minore o uguale (<=).",
      'Il valore numerico di riferimento è 1000.',
    ],
    tables: ['pianeti'],
  },
  {
    id: 'ex-022',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'ORDER BY'],
    title: 'Personaggi in Ordine Alfabetico',
    prompt: 'Estrai il nome e il ruolo di tutti i personaggi, ordinandoli alfabeticamente per nome in ordine crescente.',
    expectedQuery: `
      SELECT nome, ruolo
      FROM personaggi
      ORDER BY nome ASC`,
    hints: [
      'Usa ORDER BY nome ASC.',
      "ASC indica l'ordine alfabetico dalla A alla Z.",
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-023',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'ORDER BY', 'LIMIT'],
    title: 'I 5 Personaggi Più Anziani',
    prompt: "Seleziona il nome e l'anno di nascita dei 5 personaggi con il valore di anno_nascita_bby più alto (i più anziani).",
    expectedQuery: `
      SELECT nome, anno_nascita_bby
      FROM personaggi
      ORDER BY anno_nascita_bby DESC
      LIMIT 5`,
    hints: [
      'Ordina in ordine decrescente (DESC) per anno_nascita_bby.',
      'Limita a 5 righe con LIMIT 5.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-024',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Astronavi Costruite da Corellian Engineering',
    prompt: "Mostra il nome, il modello e la lunghezza delle astronavi fabbricate da 'Corellian Engineering'.",
    expectedQuery: `
      SELECT nome, modello, lunghezza_metri
      FROM astronavi
      WHERE costruttore = 'Corellian Engineering'`,
    hints: [
      'Filtra la colonna costruttore.',
      "Usa costruttore = 'Corellian Engineering'.",
    ],
    tables: ['astronavi'],
  },
  {
    id: 'ex-025',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE', 'LIKE'],
    title: 'Pianeti con Terreno Forestale o Paludoso',
    prompt: "Recupera il nome e il terreno dei pianeti il cui terreno contiene la parola 'foreste' oppure 'paludi'.",
    expectedQuery: `
      SELECT nome, terreno
      FROM pianeti
      WHERE terreno LIKE '%foreste%' OR terreno LIKE '%paludi%'`,
    hints: [
      "Combina due condizioni LIKE con l'operatore logico OR.",
      "Usa i caratteri jolly '%foreste%' e '%paludi%'.",
    ],
    tables: ['pianeti'],
  },
  {
    id: 'ex-026',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Battaglie Avvenute nel Periodo Ante-Impero',
    prompt: "Trova il nome e l'anno delle battaglie svoltesi con anno_bby maggiore di 10 (durante le Guerre dei Cloni o prima).",
    expectedQuery: `
      SELECT nome, anno_bby
      FROM battaglie
      WHERE anno_bby > 10`,
    hints: [
      'Tabella di destinazione: battaglie.',
      'Condizione: anno_bby > 10.',
    ],
    tables: ['battaglie'],
  },
  {
    id: 'ex-027',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Spade Laser Rosse dei Guerrieri Oscuri',
    prompt: "Mostra l'identificativo, il tipo di cristallo e l'impugnatura di tutte le spade laser con lama 'Rosso'.",
    expectedQuery: `
      SELECT id, tipo_cristallo, impugnatura
      FROM spade_laser
      WHERE colore_lama = 'Rosso'`,
    hints: [
      "Filtra con colore_lama = 'Rosso'.",
      'Le colonne da proiettare sono id, tipo_cristallo, impugnatura.',
    ],
    tables: ['spade_laser'],
  },
  {
    id: 'ex-028',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Leader delle Fazioni Religiose',
    prompt: "Seleziona il nome della fazione e il leader per tutte le fazioni di tipo 'Ordine Religioso'.",
    expectedQuery: `
      SELECT nome, leader
      FROM fazioni
      WHERE tipo = 'Ordine Religioso'`,
    hints: [
      'Verifica la tabella fazioni.',
      "Condizione: tipo = 'Ordine Religioso'.",
    ],
    tables: ['fazioni'],
  },
  {
    id: 'ex-029',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Personaggi con Fazione Non Assegnata o Specifica',
    prompt: 'Trova il nome e il ruolo dei personaggi che appartengono alla fazione con ID pari a 1 (Alleanza Ribelle).',
    expectedQuery: `
      SELECT nome, ruolo
      FROM personaggi
      WHERE fazione_id = 1`,
    hints: [
      'Filtra su fazione_id = 1.',
      'Proietta le colonne nome e ruolo.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-030',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM'],
    title: 'Specie e Lingue Parlate',
    prompt: 'Estrai il nome della specie e il rispettivo linguaggio per tutte le specie registrate.',
    expectedQuery: `
      SELECT nome, linguaggio
      FROM specie`,
    hints: [
      'La query richiede semplicemente una proiezione su due colonne dalla tabella specie.',
      'Nessun filtro WHERE è richiesto.',
    ],
    tables: ['specie'],
  },
  {
    id: 'ex-031',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'ORDER BY', 'LIMIT'],
    title: 'Le 3 Astronavi Più Lunghe',
    prompt: "Mostra il nome, il modello e la lunghezza delle 3 astronavi più lunghe dell'archivio in ordine decrescente.",
    expectedQuery: `
      SELECT nome, modello, lunghezza_metri
      FROM astronavi
      ORDER BY lunghezza_metri DESC
      LIMIT 3`,
    hints: [
      'Ordina per lunghezza_metri DESC.',
      'Usa la clausola LIMIT 3.',
    ],
    tables: ['astronavi'],
  },
  {
    id: 'ex-032',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE', 'LIKE'],
    title: "Pianeti il cui Nome Termina con 'ine'",
    prompt: "Trova il nome e il clima di tutti i pianeti il cui nome termina con le lettere 'ine' (come Tatooine).",
    expectedQuery: `
      SELECT nome, clima
      FROM pianeti
      WHERE nome LIKE '%ine'`,
    hints: [
      "Usa la clausola LIKE '%ine'.",
      "Il carattere % posto all'inizio cattura qualsiasi sequenza di caratteri che precede 'ine'.",
    ],
    tables: ['pianeti'],
  },
  {
    id: 'ex-033',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Personaggi Senza Ruolo di Droide',
    prompt: 'Mostra il nome e il ruolo dei personaggi appartenenti alla specie droide (specie_id = 3).',
    expectedQuery: `
      SELECT nome, ruolo
      FROM personaggi
      WHERE specie_id = 3`,
    hints: [
      'Filtra i record dove specie_id è uguale a 3.',
      'Le colonne da visualizzare sono nome e ruolo.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-034',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'ORDER BY'],
    title: 'Fazioni con Nomi in Ordine Decrescente',
    prompt: 'Seleziona tutti i campi della tabella fazioni ordinando i record in ordine alfabetico decrescente (da Z ad A) per nome.',
    expectedQuery: `
      SELECT *
      FROM fazioni
      ORDER BY nome DESC`,
    hints: [
      'Usa ORDER BY nome DESC.',
      'Seleziona tutte le colonne con *.',
    ],
    tables: ['fazioni'],
  },
  {
    id: 'ex-035',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Pianeti nel Nucleo Profondo',
    prompt: "Estrai il nome e la popolazione dei pianeti situati nel settore galattico 'Nucleo Profondo'.",
    expectedQuery: `
      SELECT nome, popolazione
      FROM pianeti
      WHERE settore_galattico = 'Nucleo Profondo'`,
    hints: [
      "Filtra con settore_galattico = 'Nucleo Profondo'.",
      'Proietta nome e popolazione.',
    ],
    tables: ['pianeti'],
  },
];

export default exercises;
