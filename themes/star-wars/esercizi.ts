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
    title: 'Personaggi e Nome della loro Fazione',
    prompt: "Esegui una JOIN tra la tabella 'personaggi' e la tabella 'fazioni' per mostrare il nome del personaggio e il nome della sua fazione.",
    expectedQuery: `
      SELECT personaggi.nome AS nome_personaggio, fazioni.nome AS nome_fazione
      FROM personaggi
      JOIN fazioni ON personaggi.fazione_id = fazioni.id`,
    hints: [
      'Collega le tabelle tramite la condizione di uguaglianza tra chiavi: personaggi.fazione_id = fazioni.id.',
      "Usa prefissi di tabella o alias per evitare ambiguità sul campo 'nome'.",
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
    title: 'Personaggi con la Rispettiva Spada Laser',
    prompt: 'Mostra il nome del personaggio, il colore della lama e il tipo di cristallo per tutti i personaggi che possiedono una spada laser.',
    expectedQuery: `
      SELECT personaggi.nome, spade_laser.colore_lama, spade_laser.tipo_cristallo
      FROM personaggi
      JOIN spade_laser ON personaggi.id = spade_laser.personaggio_id`,
    hints: [
      'Unisci la tabella personaggi e la tabella spade_laser sulla chiave personaggio_id.',
      'Seleziona nome, colore_lama e tipo_cristallo.',
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
    title: 'Personaggi e Nome del Pianeta di Origine',
    prompt: 'Mostra il nome del personaggio e il nome del pianeta natale, unendo la tabella personaggi con la tabella pianeti.',
    expectedQuery: `
      SELECT personaggi.nome AS personaggio, pianeti.nome AS pianeta
      FROM personaggi
      JOIN pianeti ON personaggi.pianeta_origine_id = pianeti.id`,
    hints: [
      'Collega personaggi.pianeta_origine_id con pianeti.id.',
      'Proietta i due nomi con alias chiarificatori.',
    ],
    tables: ['personaggi', 'pianeti'],
  },
  {
    id: 'ex-044',
    chapter: 'join',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'JOIN'],
    title: 'Astronavi per Fazione Proprietaria',
    prompt: "Mostra il nome dell'astronave, il modello e il nome della fazione a cui appartiene, unendo astronavi e fazioni.",
    expectedQuery: `
      SELECT astronavi.nome AS nome_nave, astronavi.modello, fazioni.nome AS nome_fazione
      FROM astronavi
      JOIN fazioni ON astronavi.fazione_id = fazioni.id`,
    hints: [
      'Unisci la tabella astronavi con fazioni tramite astronavi.fazione_id = fazioni.id.',
      'Seleziona i campi richiesti.',
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
    title: 'Battaglie e Pianeta Teatro dello Scontro',
    prompt: "Estrai il nome della battaglia, l'anno_bby e il nome del pianeta su cui si è svolta la battaglia.",
    expectedQuery: `
      SELECT battaglie.nome AS battaglia, battaglie.anno_bby, pianeti.nome AS pianeta
      FROM battaglie
      JOIN pianeti ON battaglie.pianeta_id = pianeti.id`,
    hints: [
      'Unisci battaglie con pianeti collegando battaglie.pianeta_id = pianeti.id.',
      'Seleziona il nome della battaglia, anno e nome del pianeta.',
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
    title: 'Personaggi e Nome della Loro Specie',
    prompt: 'Mostra il nome del personaggio, il suo ruolo e il nome della specie a cui appartiene, unendo personaggi e specie.',
    expectedQuery: `
      SELECT personaggi.nome AS personaggio, personaggi.ruolo, specie.nome AS specie
      FROM personaggi
      JOIN specie ON personaggi.specie_id = specie.id`,
    hints: [
      'Collega la tabella personaggi a specie tramite personaggi.specie_id = specie.id.',
      'Proietta le colonne richieste.',
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
    title: 'Tutte le Battaglie Vinte con Fazione Vincitrice',
    prompt: "Mostra il nome della battaglia, l'anno_bby e il nome della fazione che ha vinto il conflitto.",
    expectedQuery: `
      SELECT battaglie.nome AS battaglia,
             battaglie.anno_bby,
             fazioni.nome AS fazione_vincitrice
      FROM battaglie
      JOIN fazioni ON battaglie.fazione_vincitrice_id = fazioni.id`,
    hints: [
      'Unisci battaglie e fazioni sulla chiave battaglie.fazione_vincitrice_id = fazioni.id.',
      'Seleziona il nome della battaglia e il nome della fazione vincitrice.',
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
    title: 'Personaggi con Spada Laser Blu o Verde',
    prompt: "Mostra il nome del personaggio, il suo ruolo e il colore della lama per i personaggi dotati di spada laser con lama 'Blu' o 'Verde'.",
    expectedQuery: `
      SELECT personaggi.nome, personaggi.ruolo, spade_laser.colore_lama
      FROM personaggi
      JOIN spade_laser ON personaggi.id = spade_laser.personaggio_id
      WHERE spade_laser.colore_lama IN ('Blu', 'Verde')`,
    hints: [
      'Esegui una JOIN tra personaggi e spade_laser.',
      "Aggiungi un filtro WHERE con IN ('Blu', 'Verde') o con operatore OR.",
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
    title: 'Specie Nascoste nel Pianeta Madre',
    prompt: 'Mostra il nome della specie, il linguaggio e il nome del suo pianeta natale unendo specie e pianeti.',
    expectedQuery: `
      SELECT specie.nome AS specie, specie.linguaggio, pianeti.nome AS pianeta_madre
      FROM specie
      JOIN pianeti ON specie.pianeta_madre_id = pianeti.id`,
    hints: [
      'Unisci specie con pianeti tramite specie.pianeta_madre_id = pianeti.id.',
      'Seleziona specie.nome, specie.linguaggio e pianeti.nome.',
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
    title: 'Tutte le Astronavi della Fazione Ribelle',
    prompt: "Mostra il nome dell'astronave, il modello e il costruttore delle navi appartenenti all'Alleanza Ribelle unendo astronavi e fazioni.",
    expectedQuery: `
      SELECT astronavi.nome, astronavi.modello, astronavi.costruttore
      FROM astronavi
      JOIN fazioni ON astronavi.fazione_id = fazioni.id
      WHERE fazioni.nome = 'Alleanza Ribelle'`,
    hints: [
      'Collega astronavi con fazioni.',
      "Filtra con fazioni.nome = 'Alleanza Ribelle'.",
    ],
    tables: ['astronavi', 'fazioni'],
  },
  {
    id: 'ex-064',
    chapter: 'join',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'JOIN', 'WHERE'],
    title: 'Personaggi Nati a Tatooine',
    prompt: "Estrai il nome e il ruolo di tutti i personaggi il cui pianeta di origine è 'Tatooine'.",
    expectedQuery: `
      SELECT personaggi.nome, personaggi.ruolo
      FROM personaggi
      JOIN pianeti ON personaggi.pianeta_origine_id = pianeti.id
      WHERE pianeti.nome = 'Tatooine'`,
    hints: [
      'Unisci personaggi con pianeti sulla chiave esterna pianeta_origine_id.',
      "Imposta la condizione: pianeti.nome = 'Tatooine'.",
    ],
    tables: ['personaggi', 'pianeti'],
  },
  {
    id: 'ex-065',
    chapter: 'join',
    difficulty: 'medio',
    keywords: ['SELECT', 'DISTINCT', 'FROM', 'JOIN'],
    title: 'Pianeti che Hanno Ospitato Almeno una Battaglia',
    prompt: 'Mostra i nomi univoci dei pianeti su cui si è svolta almeno una battaglia, unendo pianeti e battaglie.',
    expectedQuery: `
      SELECT DISTINCT pianeti.nome
      FROM pianeti
      JOIN battaglie ON pianeti.id = battaglie.pianeta_id`,
    hints: [
      'Unisci le due tabelle con JOIN ... ON pianeti.id = battaglie.pianeta_id.',
      'Usa DISTINCT per non mostrare lo stesso pianeta più volte.',
    ],
    tables: ['pianeti', 'battaglie'],
  },
  {
    id: 'ex-066',
    chapter: 'join',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'LEFT JOIN'],
    title: 'Tutti i Personaggi con o senza Spada Laser (LEFT JOIN)',
    prompt: 'Estrai il nome del personaggio e il colore della lama della sua spada laser. Mostra anche i personaggi che NON possiedono una spada laser (il colore sarà NULL).',
    expectedQuery: `
      SELECT personaggi.nome, spade_laser.colore_lama
      FROM personaggi
      LEFT JOIN spade_laser ON personaggi.id = spade_laser.personaggio_id`,
    hints: [
      'Usa LEFT JOIN (o LEFT OUTER JOIN) per mantenere tutti i personaggi anche senza corrispondenza.',
      'Collega personaggi.id con spade_laser.personaggio_id.',
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
    title: 'Pianeti con Popolazione Superiore alla Media',
    prompt: 'Trova il nome e la popolazione di tutti i pianeti che hanno una popolazione superiore a 100.000.000 di abitanti.',
    expectedQuery: `
      SELECT nome, popolazione
      FROM pianeti
      WHERE popolazione > 100000000`,
    hints: [
      'Filtra la tabella pianeti con popolazione > 100000000.',
      'Proietta nome e popolazione.',
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
    title: 'Spade Laser con Cristalli di Ilum o Adegan',
    prompt: "Mostra l'identificativo e il colore della lama delle spade laser che utilizzano cristalli con origine 'Ilum' o 'Adegan'.",
    expectedQuery: `
      SELECT id, colore_lama
      FROM spade_laser
      WHERE tipo_cristallo LIKE '%Ilum%' OR tipo_cristallo LIKE '%Adegan%'`,
    hints: [
      "Usa l'operatore LIKE con '%Ilum%' e '%Adegan%'.",
      "Combina con l'operatore OR.",
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
    title: 'Astronavi Senza Equipaggio Numeroso',
    prompt: "Seleziona il nome e la capacità dell'equipaggio per le navi con equipaggio compreso tra 2 e 10 membri.",
    expectedQuery: `
      SELECT nome, capacita_equipaggio
      FROM astronavi
      WHERE capacita_equipaggio BETWEEN 2 AND 10`,
    hints: [
      'Usa BETWEEN 2 AND 10 sulla colonna capacita_equipaggio.',
      'Proietta nome e capacita_equipaggio.',
    ],
    tables: ['astronavi'],
  },
  {
    id: 'ex-073',
    chapter: 'una-tabella',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Pianeti il cui Clima è Temperato con più di 1 Miliardo di Abitanti',
    prompt: "Trova il nome, la popolazione e il terreno dei pianeti che hanno clima 'temperato' e popolazione superiore a 1.000.000.000.",
    expectedQuery: `
      SELECT nome, popolazione, terreno
      FROM pianeti
      WHERE clima = 'temperato' AND popolazione > 1000000000`,
    hints: [
      "Usa l'operatore logico AND per unire i due criteri.",
      'Verifica sia il clima sia la popolazione.',
    ],
    tables: ['pianeti'],
  },
  {
    id: 'ex-074',
    chapter: 'join',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'JOIN', 'WHERE'],
    title: 'Personaggi con Spada Laser Rossa e Nome Fazione',
    prompt: "Mostra il nome del personaggio e il colore della lama unendo personaggi e spade_laser, filtrando solo per coloro che hanno lama 'Rosso'.",
    expectedQuery: `
      SELECT personaggi.nome, spade_laser.colore_lama
      FROM personaggi
      JOIN spade_laser ON personaggi.id = spade_laser.personaggio_id
      WHERE spade_laser.colore_lama = 'Rosso'`,
    hints: [
      'Esegui una JOIN su personaggi.id = spade_laser.personaggio_id.',
      "Aggiungi WHERE spade_laser.colore_lama = 'Rosso'.",
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
];

export default exercises;
