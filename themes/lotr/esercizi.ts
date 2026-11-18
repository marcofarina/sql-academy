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

  {
    id: 'ex-021',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'I popoli immortali',
    prompt: 'Mostra il nome dei popoli i cui membri sono immortali.',
    expectedQuery: `
      SELECT nome
      FROM popoli
      WHERE immortale = 1`,
    hints: [
      'Il dato è nella colonna immortale della tabella popoli.',
      'La colonna immortale vale 1 per i popoli immortali e 0 per gli altri: WHERE immortale = 1.',
    ],
    tables: ['popoli'],
  },
  {
    id: 'ex-022',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Le fortezze',
    prompt: 'Mostra il nome e la regione dei luoghi di tipo «fortezza».',
    expectedQuery: `
      SELECT nome, regione
      FROM luoghi
      WHERE tipo = 'fortezza'`,
    hints: [
      'Il tipo di un luogo è nella colonna tipo della tabella luoghi.',
      'Filtra con WHERE tipo = \'fortezza\', con il testo fra apici singoli.',
    ],
    tables: ['luoghi'],
  },
  {
    id: 'ex-023',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Le spade',
    prompt: 'Mostra il nome e il portatore (il suo id) delle armi di tipo «spada».',
    expectedQuery: `
      SELECT nome, portatore_id
      FROM armi
      WHERE tipo = 'spada'`,
    hints: [
      'Tutto ciò che serve è nella tabella armi: il tipo è nella colonna tipo, il portatore in portatore_id.',
      'Pungolo è di tipo «spada corta», un testo diverso da «spada»: con WHERE tipo = \'spada\' resta fuori.',
    ],
    tables: ['armi'],
  },
  {
    id: 'ex-024',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Le vittorie dell’Ombra',
    prompt: 'Mostra il nome e l’anno delle battaglie vinte dall’Ombra.',
    expectedQuery: `
      SELECT nome, anno
      FROM battaglie
      WHERE vincitore = 'Ombra'`,
    hints: [
      'Chi ha vinto una battaglia è scritto nella colonna vincitore della tabella battaglie.',
      'I valori possibili sono «Popoli liberi» e «Ombra»: WHERE vincitore = \'Ombra\'.',
    ],
    tables: ['battaglie'],
  },
  {
    id: 'ex-025',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Gli stregoni',
    prompt: 'Mostra il nome dei personaggi il cui ruolo è «stregone».',
    expectedQuery: `
      SELECT nome
      FROM personaggi
      WHERE ruolo = 'stregone'`,
    hints: [
      'Il ruolo di un personaggio è nella colonna ruolo della tabella personaggi.',
      'WHERE ruolo = \'stregone\' confronta il testo per intero.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-026',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'DISTINCT'],
    title: 'Le regioni dell’archivio',
    prompt: 'Mostra l’elenco delle regioni in cui si trovano i luoghi dell’archivio, ciascuna una volta sola.',
    expectedQuery: `
      SELECT DISTINCT regione
      FROM luoghi`,
    hints: [
      'SELECT regione FROM luoghi restituisce una riga per luogo, con le regioni ripetute.',
      'DISTINCT, subito dopo SELECT, toglie le righe doppie dal risultato.',
    ],
    tables: ['luoghi'],
  },
  {
    id: 'ex-027',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'DISTINCT'],
    title: 'I tipi di arma',
    prompt: 'Mostra i tipi di arma presenti nell’archivio, ciascuno una volta sola.',
    expectedQuery: `
      SELECT DISTINCT tipo
      FROM armi`,
    hints: [
      'Nella tabella armi lo stesso tipo compare su più righe: le spade sono molte.',
      'SELECT DISTINCT tipo FROM armi tiene una riga per ogni valore diverso.',
    ],
    tables: ['armi'],
  },
  {
    id: 'ex-028',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'ORDER BY'],
    title: 'I popoli in ordine alfabetico',
    prompt: 'Mostra il nome e la lingua di tutti i popoli, in ordine alfabetico di nome.',
    expectedQuery: `
      SELECT nome, lingua
      FROM popoli
      ORDER BY nome`,
    hints: [
      'Non serve nessun filtro: vuoi tutte le righe della tabella popoli.',
      'L’ordine alfabetico si chiede con ORDER BY nome, in fondo alla query.',
    ],
    tables: ['popoli'],
  },
  {
    id: 'ex-029',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'ORDER BY', 'DESC'],
    title: 'Dalla battaglia più recente',
    prompt:
      'Mostra il nome e l’anno di tutte le battaglie, dalla più recente alla più antica. A parità di anno, in ordine alfabetico di nome.',
    expectedQuery: `
      SELECT nome, anno
      FROM battaglie
      ORDER BY anno DESC, nome`,
    hints: [
      'La più recente ha l’anno più grande: serve un ordinamento decrescente, con DESC.',
      'ORDER BY anno DESC, nome: DESC vale solo per anno, il nome resta in ordine crescente.',
    ],
    tables: ['battaglie'],
  },
  {
    id: 'ex-030',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE', 'LIKE'],
    title: 'Nomi che cominciano per E',
    prompt: 'Mostra il nome dei personaggi il cui nome comincia con la lettera E, senza accento.',
    expectedQuery: `
      SELECT nome
      FROM personaggi
      WHERE nome LIKE 'E%'`,
    hints: [
      'LIKE confronta un testo con un modello: il simbolo % sta per qualsiasi sequenza di caratteri, anche vuota.',
      'WHERE nome LIKE \'E%\'. Éomer ed Éowyn restano fuori: É è una lettera diversa da E.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-031',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE', 'ORDER BY'],
    title: 'Il viaggio di Boromir',
    prompt:
      'Il personaggio con id 9 è Boromir. Mostra l’id del luogo e la data di ciascuna delle sue tappe, nell’ordine del viaggio.',
    expectedQuery: `
      SELECT luogo_id, data
      FROM tappe
      WHERE personaggio_id = 9
      ORDER BY ordine`,
    hints: [
      'Ogni riga della tabella tappe è una tappa: tieni quelle con personaggio_id = 9.',
      'L’ordine del viaggio è nella colonna ordine: ORDER BY ordine, anche se non la mostri.',
    ],
    tables: ['tappe'],
  },
  {
    id: 'ex-032',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE'],
    title: 'Gli eserciti più grandi dell’Ombra',
    prompt: 'Mostra il nome delle battaglie in cui l’Ombra ha schierato più di diecimila combattenti.',
    expectedQuery: `
      SELECT nome
      FROM battaglie
      WHERE forze_ombra > 10000`,
    hints: [
      'I combattenti schierati dall’Ombra sono nella colonna forze_ombra della tabella battaglie.',
      '«Più di» esclude il valore stesso: WHERE forze_ombra > 10000, e al Fosso di Helm, con 10000 esatti, resta fuori.',
    ],
    tables: ['battaglie'],
  },
  {
    id: 'ex-033',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE', 'IN'],
    title: 'I luoghi di Rohan e di Gondor',
    prompt: 'Mostra il nome, la regione e il tipo dei luoghi che si trovano a Rohan oppure a Gondor.',
    expectedQuery: `
      SELECT nome, regione, tipo
      FROM luoghi
      WHERE regione IN ('Rohan', 'Gondor')`,
    hints: [
      'Puoi scrivere due condizioni unite da OR, oppure una sola con IN.',
      'WHERE regione IN (\'Rohan\', \'Gondor\') è vero quando la regione è uno dei valori dell’elenco.',
    ],
    tables: ['luoghi'],
  },
  {
    id: 'ex-034',
    chapter: 'una-tabella',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'WHERE', 'LIKE'],
    title: 'I re',
    prompt: 'Mostra il nome e il ruolo dei personaggi il cui ruolo comincia con la parola «re».',
    expectedQuery: `
      SELECT nome, ruolo
      FROM personaggi
      WHERE ruolo LIKE 're %'`,
    hints: [
      'Con LIKE il simbolo % sta per qualsiasi sequenza di caratteri.',
      'Il modello \'re %\' vuole uno spazio dopo «re»: così un ruolo che comincia con una parola come «reggente» resterebbe fuori.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-035',
    chapter: 'una-tabella',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'WHERE', 'IS NULL'],
    title: 'Forze sconosciute',
    prompt: 'Mostra il nome delle battaglie di cui non si conoscono le forze schierate dall’Ombra.',
    expectedQuery: `
      SELECT nome
      FROM battaglie
      WHERE forze_ombra IS NULL`,
    hints: [
      'Un dato che manca è registrato come NULL nella colonna forze_ombra.',
      'forze_ombra = NULL non è mai vero: per cercare i valori mancanti serve IS NULL.',
    ],
    tables: ['battaglie'],
  },
  {
    id: 'ex-036',
    chapter: 'una-tabella',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'WHERE', 'IS NOT NULL'],
    title: 'Tutti i combattenti di una battaglia',
    prompt:
      'Per ogni battaglia di cui si conoscono le forze di entrambe le parti, mostra il nome e il numero totale di combattenti schierati.',
    expectedQuery: `
      SELECT nome, forze_popoli_liberi + forze_ombra
      FROM battaglie
      WHERE forze_popoli_liberi IS NOT NULL
        AND forze_ombra IS NOT NULL`,
    hints: [
      'In SELECT puoi scrivere un’espressione al posto di una colonna: forze_popoli_liberi + forze_ombra.',
      'Una somma con un NULL dà NULL: escludi con IS NOT NULL le battaglie in cui manca una delle due forze.',
    ],
    tables: ['battaglie'],
  },
  {
    id: 'ex-037',
    chapter: 'una-tabella',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'WHERE', 'LENGTH', 'ORDER BY'],
    title: 'I nomi più lunghi',
    prompt:
      'Mostra il nome e il numero di caratteri del nome dei personaggi il cui nome supera i 15 caratteri, dal più lungo al più corto. A parità di lunghezza, in ordine alfabetico.',
    expectedQuery: `
      SELECT nome, LENGTH(nome)
      FROM personaggi
      WHERE LENGTH(nome) > 15
      ORDER BY LENGTH(nome) DESC, nome`,
    hints: [
      'La funzione LENGTH restituisce il numero di caratteri di un testo, spazi compresi.',
      'Usa LENGTH(nome) tre volte: nella SELECT, nel filtro di WHERE e in ORDER BY … DESC.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-038',
    chapter: 'una-tabella',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'WHERE', 'BETWEEN', 'AND'],
    title: 'Fuori dalla Compagnia, nati fra il 2900 e il 2999',
    prompt:
      'Mostra il nome e l’anno di nascita dei personaggi nati fra il 2900 e il 2999, estremi compresi, che non hanno fatto parte della Compagnia dell’Anello.',
    expectedQuery: `
      SELECT nome, anno_nascita
      FROM personaggi
      WHERE anno_nascita BETWEEN 2900 AND 2999
        AND membro_compagnia = 0`,
    hints: [
      'Le condizioni sono due, e devono valere insieme: uniscile con AND.',
      'anno_nascita BETWEEN 2900 AND 2999 per l’intervallo, membro_compagnia = 0 per chi è fuori dalla Compagnia.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-039',
    chapter: 'una-tabella',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'WHERE', 'NOT LIKE'],
    title: 'Luoghi dal nome di una parola',
    prompt: 'Mostra il nome dei luoghi il cui nome è formato da una sola parola, cioè non contiene spazi.',
    expectedQuery: `
      SELECT nome
      FROM luoghi
      WHERE nome NOT LIKE '% %'`,
    hints: [
      'Il modello \'% %\' descrive un testo che contiene almeno uno spazio, in qualunque posizione.',
      'Ti servono i nomi che non rispettano il modello: NOT LIKE \'% %\'.',
    ],
    tables: ['luoghi'],
  },
  {
    id: 'ex-040',
    chapter: 'una-tabella',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'WHERE', 'STRFTIME', 'ORDER BY'],
    title: 'Aragorn a marzo',
    prompt:
      'Il personaggio con id 6 è Aragorn. Mostra l’id del luogo e la data delle sue tappe raggiunte nel mese di marzo, nell’ordine del viaggio.',
    expectedQuery: `
      SELECT luogo_id, data
      FROM tappe
      WHERE personaggio_id = 6
        AND strftime('%m', data) = '03'
      ORDER BY ordine`,
    hints: [
      'Le date sono testi nel formato AAAA-MM-GG. La funzione strftime(\'%m\', data) ne estrae il mese, come testo di due cifre.',
      'WHERE personaggio_id = 6 AND strftime(\'%m\', data) = \'03\', poi ORDER BY ordine.',
    ],
    tables: ['tappe'],
  },
  {
    id: 'ex-041',
    chapter: 'una-tabella',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'WHERE', 'UPPER'],
    title: 'La Compagnia in maiuscolo',
    prompt: 'Mostra il nome dei membri della Compagnia dell’Anello scritto tutto in lettere maiuscole.',
    expectedQuery: `
      SELECT UPPER(nome)
      FROM personaggi
      WHERE membro_compagnia = 1`,
    hints: [
      'La funzione UPPER restituisce il testo che riceve con le lettere in maiuscolo.',
      'Scrivi UPPER(nome) in SELECT e filtra con WHERE membro_compagnia = 1.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-042',
    chapter: 'una-tabella',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'WHERE', 'IS NOT NULL', 'ORDER BY'],
    title: 'Anziani che non sono hobbit',
    prompt:
      'Nella tabella popoli gli hobbit hanno id 1. Mostra il nome e l’anno di nascita dei personaggi che non sono hobbit e di cui si conosce l’anno di nascita, dal più anziano. A parità di anno, in ordine alfabetico.',
    expectedQuery: `
      SELECT nome, anno_nascita
      FROM personaggi
      WHERE popolo_id <> 1
        AND anno_nascita IS NOT NULL
      ORDER BY anno_nascita, nome`,
    hints: [
      '«Diverso da» si scrive <> oppure !=.',
      'WHERE popolo_id <> 1 AND anno_nascita IS NOT NULL, poi ORDER BY anno_nascita, nome.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-043',
    chapter: 'una-tabella',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'COALESCE'],
    title: 'La lingua, anche quando manca',
    prompt: 'Mostra il nome e la lingua di ogni popolo. Al posto della lingua che non si conosce scrivi «sconosciuta».',
    expectedQuery: `
      SELECT nome, COALESCE(lingua, 'sconosciuta')
      FROM popoli`,
    hints: [
      'La lingua dei Maiar è NULL: è quella la riga da sistemare.',
      'COALESCE(lingua, \'sconosciuta\') restituisce lingua quando c’è, e il testo \'sconosciuta\' quando è NULL.',
    ],
    tables: ['popoli'],
  },
  {
    id: 'ex-044',
    chapter: 'una-tabella',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'WHERE', 'IS NOT NULL', 'ORDER BY'],
    title: 'Quanti anni nel 3019',
    prompt:
      'Per ogni personaggio di cui si conosce l’anno di nascita, mostra il nome e quanti anni compie nel 3019, dal più vecchio al più giovane. A parità di età, in ordine alfabetico.',
    expectedQuery: `
      SELECT nome, 3019 - anno_nascita
      FROM personaggi
      WHERE anno_nascita IS NOT NULL
      ORDER BY 3019 - anno_nascita DESC, nome`,
    hints: [
      'L’età è una sottrazione: 3019 - anno_nascita, scritta direttamente in SELECT.',
      'Per ordinare dal più vecchio, ordina per la stessa espressione con DESC, poi per nome.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-045',
    chapter: 'una-tabella',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'WHERE', 'NOT LIKE'],
    title: 'Tutto tranne le spade',
    prompt: 'Mostra il nome e il tipo delle armi che non sono spade, nemmeno corte.',
    expectedQuery: `
      SELECT nome, tipo
      FROM armi
      WHERE tipo NOT LIKE 'spada%'`,
    hints: [
      'Con tipo <> \'spada\' resterebbe Pungolo, che è una «spada corta».',
      'Escludi ogni tipo che comincia con «spada»: WHERE tipo NOT LIKE \'spada%\'.',
    ],
    tables: ['armi'],
  },
  {
    id: 'ex-046',
    chapter: 'una-tabella',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'WHERE', 'AND', 'ORDER BY'],
    title: 'Vittorie in inferiorità',
    prompt:
      'Mostra il nome delle battaglie vinte dai Popoli liberi pur avendo schierato meno combattenti dell’Ombra, in ordine alfabetico.',
    expectedQuery: `
      SELECT nome
      FROM battaglie
      WHERE vincitore = 'Popoli liberi'
        AND forze_popoli_liberi < forze_ombra
      ORDER BY nome`,
    hints: [
      'Puoi confrontare fra loro due colonne della stessa riga: forze_popoli_liberi < forze_ombra.',
      'Aggiungi con AND la condizione sul vincitore: vincitore = \'Popoli liberi\'.',
    ],
    tables: ['battaglie'],
  },
  {
    id: 'ex-047',
    chapter: 'una-tabella',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'WHERE', '||'],
    title: 'Nome e ruolo in una colonna',
    prompt:
      'Mostra, in una sola colonna, il nome di ogni membro della Compagnia seguito da una virgola, uno spazio e il suo ruolo, come in «Gimli, guerriero».',
    expectedQuery: `
      SELECT nome || ', ' || ruolo
      FROM personaggi
      WHERE membro_compagnia = 1`,
    hints: [
      'In SQLite l’operatore || unisce due testi in uno solo.',
      'nome || \', \' || ruolo: il testo in mezzo, fra apici, contiene la virgola e lo spazio.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-048',
    chapter: 'una-tabella',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'WHERE', 'ROUND', 'ORDER BY'],
    title: 'Quante volte più numerosi',
    prompt:
      'Per ogni battaglia di cui si conoscono entrambe le forze, mostra il nome e quante volte i combattenti dell’Ombra erano più numerosi di quelli dei Popoli liberi, con una cifra decimale. Ordina dal rapporto più alto; a parità di rapporto, in ordine alfabetico di nome.',
    expectedQuery: `
      SELECT nome, ROUND(forze_ombra * 1.0 / forze_popoli_liberi, 1)
      FROM battaglie
      WHERE forze_ombra IS NOT NULL
      ORDER BY ROUND(forze_ombra * 1.0 / forze_popoli_liberi, 1) DESC, nome`,
    hints: [
      'Il rapporto è forze_ombra diviso forze_popoli_liberi; ROUND(…, 1) lo arrotonda a una cifra decimale.',
      'Fra due numeri interi SQLite fa la divisione intera: 8000 / 1800 dà 4. Moltiplica prima per 1.0 per avere i decimali.',
    ],
    tables: ['battaglie'],
  },
  {
    id: 'ex-049',
    chapter: 'una-tabella',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'WHERE', 'JULIANDAY', 'ORDER BY'],
    title: 'I giorni di Frodo',
    prompt:
      'Frodo (id 1) parte da Hobbiville il 3018-09-23. Per ognuna delle sue tappe mostra l’id del luogo e quanti giorni sono passati dalla partenza, come numero intero, nell’ordine del viaggio.',
    expectedQuery: `
      SELECT luogo_id, CAST(julianday(data) - julianday('3018-09-23') AS INTEGER)
      FROM tappe
      WHERE personaggio_id = 1
      ORDER BY ordine`,
    hints: [
      'julianday(data) trasforma una data in un numero di giorni: la differenza fra due di questi numeri è la distanza in giorni.',
      'julianday(data) - julianday(\'3018-09-23\') dà un numero decimale come 6.0; CAST(… AS INTEGER) lo rende intero.',
    ],
    tables: ['tappe'],
  },
  {
    id: 'ex-050',
    chapter: 'una-tabella',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'CASE', 'IS NULL'],
    title: 'In vantaggio o in svantaggio',
    prompt:
      'Per ogni battaglia mostra il nome e la situazione dei Popoli liberi: «in vantaggio» se hanno schierato più combattenti dell’Ombra, «in svantaggio» se ne hanno schierati di meno o lo stesso numero, «sconosciuta» se le forze dell’Ombra non si conoscono.',
    expectedQuery: `
      SELECT nome,
             CASE
               WHEN forze_ombra IS NULL THEN 'sconosciuta'
               WHEN forze_popoli_liberi > forze_ombra THEN 'in vantaggio'
               ELSE 'in svantaggio'
             END
      FROM battaglie`,
    hints: [
      'CASE WHEN condizione THEN valore … ELSE valore END sceglie un valore diverso per ogni riga.',
      'Il confronto con un NULL non è né vero né falso, quindi finirebbe nell’ELSE: controlla forze_ombra IS NULL nel primo WHEN.',
    ],
    tables: ['battaglie'],
  },
  {
    id: 'ex-051',
    chapter: 'una-tabella',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'WHERE', 'IS NOT NULL', 'ORDER BY', 'LIMIT', 'OFFSET'],
    title: 'Dal quarto al sesto più anziano',
    prompt:
      'Fra i personaggi di cui si conosce l’anno di nascita, mostra il nome e l’anno di nascita di quelli dal quarto al sesto posto in ordine di età, dal più anziano. A parità di anno, in ordine alfabetico.',
    expectedQuery: `
      SELECT nome, anno_nascita
      FROM personaggi
      WHERE anno_nascita IS NOT NULL
      ORDER BY anno_nascita, nome
      LIMIT 3 OFFSET 3`,
    hints: [
      'OFFSET salta un certo numero di righe dell’elenco ordinato prima di applicare LIMIT.',
      'LIMIT 3 OFFSET 3 salta le prime tre righe e tiene le tre successive. Escludi i NULL, che nell’ordinamento crescente vengono per primi.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-052',
    chapter: 'una-tabella',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'WHERE', 'AND', 'OR'],
    title: 'Hobbit e uomini della Compagnia',
    prompt:
      'Nella tabella popoli gli hobbit hanno id 1 e gli uomini id 2. Mostra il nome dei membri della Compagnia dell’Anello che sono hobbit oppure uomini.',
    expectedQuery: `
      SELECT nome
      FROM personaggi
      WHERE membro_compagnia = 1
        AND (popolo_id = 1 OR popolo_id = 2)`,
    hints: [
      'AND viene valutato prima di OR: senza parentesi, la condizione sulla Compagnia vale solo per una delle due alternative.',
      'Racchiudi fra parentesi le due alternative sul popolo: membro_compagnia = 1 AND (popolo_id = 1 OR popolo_id = 2). Va bene anche popolo_id IN (1, 2).',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-053',
    chapter: 'una-tabella',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'WHERE', 'ABS', 'ORDER BY', 'LIMIT'],
    title: 'Gli scontri più equilibrati',
    prompt:
      'Fra le battaglie di cui si conoscono entrambe le forze, mostra il nome e la differenza fra i combattenti delle due parti, presa senza segno, delle tre battaglie più equilibrate: dalla differenza più piccola. A parità di differenza, in ordine alfabetico.',
    expectedQuery: `
      SELECT nome, ABS(forze_popoli_liberi - forze_ombra)
      FROM battaglie
      WHERE forze_ombra IS NOT NULL
      ORDER BY ABS(forze_popoli_liberi - forze_ombra), nome
      LIMIT 3`,
    hints: [
      'La funzione ABS toglie il segno a un numero: ABS(-200) vale 200.',
      'Escludi la battaglia con forze_ombra NULL, ordina per ABS(forze_popoli_liberi - forze_ombra) e tieni le prime tre righe con LIMIT 3.',
    ],
    tables: ['battaglie'],
  },
  {
    id: 'ex-054',
    chapter: 'una-tabella',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'CASE', 'INSTR', 'SUBSTR'],
    title: 'Solo il primo nome',
    prompt:
      'Mostra, per ogni personaggio, solo la prima parola del suo nome: «Frodo» per Frodo Baggins, «Gandalf» per Gandalf.',
    expectedQuery: `
      SELECT CASE
               WHEN INSTR(nome, ' ') > 0 THEN SUBSTR(nome, 1, INSTR(nome, ' ') - 1)
               ELSE nome
             END
      FROM personaggi`,
    hints: [
      'INSTR(nome, \' \') restituisce la posizione del primo spazio nel nome, oppure 0 se non c’è; SUBSTR(nome, 1, n) restituisce i primi n caratteri.',
      'La prima parola finisce un carattere prima dello spazio: SUBSTR(nome, 1, INSTR(nome, \' \') - 1). Quando il nome non ha spazi, con CASE restituisci il nome intero.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-055',
    chapter: 'una-tabella',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'ORDER BY', 'IS NULL'],
    title: 'Gli anni sconosciuti in fondo',
    prompt:
      'Mostra il nome e l’anno di nascita di tutti i personaggi, dal più anziano al più giovane, con quelli di cui non si conosce l’anno in fondo all’elenco. A parità di anno, e fra quelli senza anno, in ordine alfabetico.',
    expectedQuery: `
      SELECT nome, anno_nascita
      FROM personaggi
      ORDER BY anno_nascita IS NULL, anno_nascita, nome`,
    hints: [
      'In un ordinamento crescente SQLite mette i NULL per primi. Ti serve una prima chiave che li sposti in fondo.',
      'anno_nascita IS NULL vale 0 per chi ha l’anno e 1 per chi non ce l’ha: ORDER BY anno_nascita IS NULL, anno_nascita, nome.',
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

  {
    id: 'ex-056',
    chapter: 'join',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'JOIN'],
    title: 'Da dove vengono',
    prompt:
      'Mostra il nome di ogni personaggio insieme al nome del luogo da cui proviene. I personaggi senza un luogo di provenienza non compaiono.',
    expectedQuery: `
      SELECT personaggi.nome, luoghi.nome
      FROM personaggi
      JOIN luoghi ON personaggi.provenienza_id = luoghi.id`,
    hints: [
      'Il nome del luogo è nella tabella luoghi; la tabella personaggi ne contiene solo l’id, in provenienza_id.',
      'JOIN luoghi ON personaggi.provenienza_id = luoghi.id. Un JOIN scarta da solo i personaggi con provenienza_id NULL.',
    ],
    tables: ['personaggi', 'luoghi'],
  },
  {
    id: 'ex-057',
    chapter: 'join',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'JOIN', 'WHERE'],
    title: 'Gli hobbit dell’archivio',
    prompt: 'Mostra il nome e il ruolo dei personaggi che appartengono al popolo degli Hobbit.',
    expectedQuery: `
      SELECT personaggi.nome, personaggi.ruolo
      FROM personaggi
      JOIN popoli ON personaggi.popolo_id = popoli.id
      WHERE popoli.nome = 'Hobbit'`,
    hints: [
      'Il nome del popolo è nella tabella popoli: collegala a personaggi con un JOIN.',
      'Dopo il JOIN filtra con WHERE popoli.nome = \'Hobbit\'.',
    ],
    tables: ['personaggi', 'popoli'],
  },
  {
    id: 'ex-058',
    chapter: 'join',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'JOIN', 'WHERE'],
    title: 'Le armi della Compagnia',
    prompt: 'Mostra il nome di ogni arma portata da un membro della Compagnia dell’Anello, con il nome del portatore.',
    expectedQuery: `
      SELECT armi.nome, personaggi.nome
      FROM armi
      JOIN personaggi ON armi.portatore_id = personaggi.id
      WHERE personaggi.membro_compagnia = 1`,
    hints: [
      'Il portatore di un’arma è in armi.portatore_id; se sia un membro della Compagnia lo dice personaggi.membro_compagnia.',
      'JOIN personaggi ON armi.portatore_id = personaggi.id, poi WHERE personaggi.membro_compagnia = 1.',
    ],
    tables: ['armi', 'personaggi'],
  },
  {
    id: 'ex-059',
    chapter: 'join',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'JOIN', 'WHERE'],
    title: 'Le battaglie di Rohan',
    prompt: 'Mostra il nome delle battaglie combattute in un luogo della regione «Rohan», con il nome del luogo.',
    expectedQuery: `
      SELECT battaglie.nome, luoghi.nome
      FROM battaglie
      JOIN luoghi ON battaglie.luogo_id = luoghi.id
      WHERE luoghi.regione = 'Rohan'`,
    hints: [
      'La regione è una colonna della tabella luoghi, non di battaglie.',
      'JOIN luoghi ON battaglie.luogo_id = luoghi.id, poi WHERE luoghi.regione = \'Rohan\'.',
    ],
    tables: ['battaglie', 'luoghi'],
  },
  {
    id: 'ex-060',
    chapter: 'join',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'JOIN', 'WHERE'],
    title: 'Le battaglie di Gimli',
    prompt: 'Il personaggio con id 8 è Gimli. Mostra il nome delle battaglie a cui ha partecipato.',
    expectedQuery: `
      SELECT battaglie.nome
      FROM partecipazioni
      JOIN battaglie ON partecipazioni.battaglia_id = battaglie.id
      WHERE partecipazioni.personaggio_id = 8`,
    hints: [
      'La tabella partecipazioni ha una riga per ogni personaggio in ogni battaglia: lì trovi le battaglie di Gimli, come id.',
      'Unisci partecipazioni a battaglie su partecipazioni.battaglia_id = battaglie.id e tieni le righe con personaggio_id = 8.',
    ],
    tables: ['partecipazioni', 'battaglie'],
  },
  {
    id: 'ex-061',
    chapter: 'join',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'JOIN', 'WHERE'],
    title: 'Nati nella Contea',
    prompt: 'Mostra il nome dei personaggi che provengono da un luogo della Contea, con il nome di quel luogo.',
    expectedQuery: `
      SELECT personaggi.nome, luoghi.nome
      FROM personaggi
      JOIN luoghi ON personaggi.provenienza_id = luoghi.id
      WHERE luoghi.regione = 'Contea'`,
    hints: [
      'Della Contea non sono i personaggi ma i luoghi: la regione è in luoghi.regione.',
      'JOIN luoghi ON personaggi.provenienza_id = luoghi.id, poi WHERE luoghi.regione = \'Contea\'.',
    ],
    tables: ['personaggi', 'luoghi'],
  },
  {
    id: 'ex-062',
    chapter: 'join',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'JOIN', 'WHERE'],
    title: 'Personaggi immortali',
    prompt: 'Mostra il nome dei personaggi che appartengono a un popolo immortale, con il nome del popolo.',
    expectedQuery: `
      SELECT personaggi.nome, popoli.nome
      FROM personaggi
      JOIN popoli ON personaggi.popolo_id = popoli.id
      WHERE popoli.immortale = 1`,
    hints: [
      'Immortale è una proprietà del popolo: la colonna immortale è nella tabella popoli.',
      'Collega le tabelle con personaggi.popolo_id = popoli.id e filtra con popoli.immortale = 1.',
    ],
    tables: ['personaggi', 'popoli'],
  },
  {
    id: 'ex-063',
    chapter: 'join',
    difficulty: 'facile',
    keywords: ['SELECT', 'DISTINCT', 'FROM', 'JOIN', 'WHERE'],
    title: 'Dalla parte dell’Ombra',
    prompt: 'Mostra il nome dei personaggi che hanno combattuto almeno una volta per l’Ombra, ciascuno una volta sola.',
    expectedQuery: `
      SELECT DISTINCT personaggi.nome
      FROM partecipazioni
      JOIN personaggi ON partecipazioni.personaggio_id = personaggi.id
      WHERE partecipazioni.schieramento = 'Ombra'`,
    hints: [
      'Lo schieramento non è una proprietà del personaggio: è registrato per ogni partecipazione, nella tabella partecipazioni.',
      'Dopo il JOIN e il filtro WHERE partecipazioni.schieramento = \'Ombra\', chi ha combattuto per l’Ombra in due battaglie compare due volte: DISTINCT toglie le ripetizioni.',
    ],
    tables: ['partecipazioni', 'personaggi'],
  },
  {
    id: 'ex-064',
    chapter: 'join',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'JOIN', 'WHERE'],
    title: 'Le lingue della Compagnia',
    prompt: 'Mostra il nome di ogni membro della Compagnia dell’Anello con la lingua del suo popolo.',
    expectedQuery: `
      SELECT personaggi.nome, popoli.lingua
      FROM personaggi
      JOIN popoli ON personaggi.popolo_id = popoli.id
      WHERE personaggi.membro_compagnia = 1`,
    hints: [
      'La lingua è registrata per popolo, nella tabella popoli.',
      'JOIN popoli ON personaggi.popolo_id = popoli.id, poi WHERE personaggi.membro_compagnia = 1. Gandalf è un Maia: la sua lingua è NULL.',
    ],
    tables: ['personaggi', 'popoli'],
  },
  {
    id: 'ex-065',
    chapter: 'join',
    difficulty: 'facile',
    keywords: ['SELECT', 'FROM', 'JOIN', 'WHERE'],
    title: 'Chi porta un pugnale',
    prompt: 'Mostra il nome dei pugnali dell’archivio con il nome di chi li porta.',
    expectedQuery: `
      SELECT armi.nome, personaggi.nome
      FROM armi
      JOIN personaggi ON armi.portatore_id = personaggi.id
      WHERE armi.tipo = 'pugnale'`,
    hints: [
      'Il tipo è in armi.tipo, il nome del portatore in personaggi.nome.',
      'JOIN personaggi ON armi.portatore_id = personaggi.id, poi WHERE armi.tipo = \'pugnale\'.',
    ],
    tables: ['armi', 'personaggi'],
  },
  {
    id: 'ex-066',
    chapter: 'join',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'JOIN', 'WHERE'],
    title: 'I popoli del Pelennor',
    prompt: 'Mostra il nome di chi ha partecipato alla Battaglia dei Campi del Pelennor, con il nome del suo popolo.',
    expectedQuery: `
      SELECT personaggi.nome, popoli.nome
      FROM partecipazioni
      JOIN battaglie ON partecipazioni.battaglia_id = battaglie.id
      JOIN personaggi ON partecipazioni.personaggio_id = personaggi.id
      JOIN popoli ON personaggi.popolo_id = popoli.id
      WHERE battaglie.nome = 'Battaglia dei Campi del Pelennor'`,
    hints: [
      'Parti da partecipazioni: ti servono tre JOIN, verso battaglie, personaggi e popoli.',
      'Il popolo si collega al personaggio, non alla partecipazione: personaggi.popolo_id = popoli.id. Poi WHERE battaglie.nome = \'Battaglia dei Campi del Pelennor\'.',
    ],
    tables: ['partecipazioni', 'battaglie', 'personaggi', 'popoli'],
  },
  {
    id: 'ex-067',
    chapter: 'join',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'JOIN', 'WHERE'],
    title: 'Le armi degli Uomini',
    prompt:
      'Mostra il nome e il tipo delle armi portate da personaggi del popolo degli Uomini, con il nome del portatore.',
    expectedQuery: `
      SELECT armi.nome, armi.tipo, personaggi.nome
      FROM armi
      JOIN personaggi ON armi.portatore_id = personaggi.id
      JOIN popoli ON personaggi.popolo_id = popoli.id
      WHERE popoli.nome = 'Uomini'`,
    hints: [
      'Dalle armi arrivi ai popoli passando per i personaggi: servono due JOIN.',
      'armi → personaggi su portatore_id, personaggi → popoli su popolo_id, poi WHERE popoli.nome = \'Uomini\'.',
    ],
    tables: ['armi', 'personaggi', 'popoli'],
  },
  {
    id: 'ex-068',
    chapter: 'join',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'JOIN', 'WHERE', 'ORDER BY'],
    title: 'Passaggi per Mordor',
    prompt:
      'Mostra il nome del personaggio, il nome del luogo e la data di ogni tappa che si trova nella regione «Mordor», in ordine di data. A parità di data, in ordine alfabetico di personaggio.',
    expectedQuery: `
      SELECT personaggi.nome, luoghi.nome, tappe.data
      FROM tappe
      JOIN personaggi ON tappe.personaggio_id = personaggi.id
      JOIN luoghi ON tappe.luogo_id = luoghi.id
      WHERE luoghi.regione = 'Mordor'
      ORDER BY tappe.data, personaggi.nome`,
    hints: [
      'La tabella tappe collega personaggi e luoghi: uniscila a entrambe.',
      'Filtra con WHERE luoghi.regione = \'Mordor\' e ordina con ORDER BY tappe.data, personaggi.nome. Le date nel formato AAAA-MM-GG si ordinano bene anche come testi.',
    ],
    tables: ['tappe', 'personaggi', 'luoghi'],
  },
  {
    id: 'ex-069',
    chapter: 'join',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'JOIN', 'WHERE', 'ORDER BY'],
    title: 'Arrivi a Gran Burrone',
    prompt:
      'Mostra il nome di ogni personaggio arrivato a Gran Burrone durante il suo viaggio e la data di arrivo, dal primo arrivato. A parità di data, in ordine alfabetico.',
    expectedQuery: `
      SELECT personaggi.nome, tappe.data
      FROM tappe
      JOIN personaggi ON tappe.personaggio_id = personaggi.id
      JOIN luoghi ON tappe.luogo_id = luoghi.id
      WHERE luoghi.nome = 'Gran Burrone'
      ORDER BY tappe.data, personaggi.nome`,
    hints: [
      'Il luogo si cerca per nome nella tabella luoghi, la data è nella tabella tappe.',
      'Due JOIN a partire da tappe, WHERE luoghi.nome = \'Gran Burrone\', ORDER BY tappe.data, personaggi.nome.',
    ],
    tables: ['tappe', 'personaggi', 'luoghi'],
  },
  {
    id: 'ex-070',
    chapter: 'join',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'JOIN', 'WHERE', 'IS NULL'],
    title: 'Senza una casa, con il loro popolo',
    prompt: 'Mostra il nome dei personaggi che non hanno un luogo di provenienza, con il nome del loro popolo.',
    expectedQuery: `
      SELECT personaggi.nome, popoli.nome
      FROM personaggi
      JOIN popoli ON personaggi.popolo_id = popoli.id
      WHERE personaggi.provenienza_id IS NULL`,
    hints: [
      'Ti serve la tabella popoli per il nome del popolo; la tabella luoghi non serve.',
      'JOIN popoli ON personaggi.popolo_id = popoli.id, poi WHERE personaggi.provenienza_id IS NULL.',
    ],
    tables: ['personaggi', 'popoli'],
  },
  {
    id: 'ex-071',
    chapter: 'join',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'LEFT JOIN'],
    title: 'Provenienza, anche quando manca',
    prompt:
      'Mostra il nome di tutti i personaggi con il nome del luogo da cui provengono. Chi non ha un luogo di provenienza compare comunque, con il luogo vuoto.',
    expectedQuery: `
      SELECT personaggi.nome, luoghi.nome
      FROM personaggi
      LEFT JOIN luoghi ON personaggi.provenienza_id = luoghi.id`,
    hints: [
      'Un JOIN normale scarta i personaggi con provenienza_id NULL.',
      'LEFT JOIN luoghi tiene tutte le righe di personaggi e mette NULL nelle colonne di luoghi quando non trova corrispondenza.',
    ],
    tables: ['personaggi', 'luoghi'],
  },
  {
    id: 'ex-072',
    chapter: 'join',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'LEFT JOIN', 'WHERE', 'IS NULL'],
    title: 'Luoghi senza battaglie',
    prompt: 'Mostra il nome e la regione dei luoghi in cui non si è combattuta nessuna battaglia.',
    expectedQuery: `
      SELECT luoghi.nome, luoghi.regione
      FROM luoghi
      LEFT JOIN battaglie ON battaglie.luogo_id = luoghi.id
      WHERE battaglie.id IS NULL`,
    hints: [
      'Parti da luoghi e usa un LEFT JOIN verso battaglie: i luoghi senza battaglie restano, con NULL nelle colonne di battaglie.',
      'Tieni solo quelle righe con WHERE battaglie.id IS NULL.',
    ],
    tables: ['luoghi', 'battaglie'],
  },
  {
    id: 'ex-073',
    chapter: 'join',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'JOIN', 'WHERE', 'AND'],
    title: 'Sconfitte dei Popoli liberi',
    prompt:
      'Mostra il nome dei personaggi che hanno combattuto per i Popoli liberi in una battaglia vinta dall’Ombra, con il nome della battaglia.',
    expectedQuery: `
      SELECT personaggi.nome, battaglie.nome
      FROM partecipazioni
      JOIN personaggi ON partecipazioni.personaggio_id = personaggi.id
      JOIN battaglie ON partecipazioni.battaglia_id = battaglie.id
      WHERE battaglie.vincitore = 'Ombra'
        AND partecipazioni.schieramento = 'Popoli liberi'`,
    hints: [
      'Il vincitore è registrato per battaglia, lo schieramento per partecipazione: servono entrambe le tabelle.',
      'WHERE battaglie.vincitore = \'Ombra\' AND partecipazioni.schieramento = \'Popoli liberi\'.',
    ],
    tables: ['partecipazioni', 'personaggi', 'battaglie'],
  },
  {
    id: 'ex-074',
    chapter: 'join',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'JOIN', 'WHERE'],
    title: 'Gli elfi in battaglia',
    prompt: 'Mostra il nome di ogni elfo che ha partecipato a una battaglia, con il nome della battaglia.',
    expectedQuery: `
      SELECT personaggi.nome, battaglie.nome
      FROM partecipazioni
      JOIN personaggi ON partecipazioni.personaggio_id = personaggi.id
      JOIN popoli ON personaggi.popolo_id = popoli.id
      JOIN battaglie ON partecipazioni.battaglia_id = battaglie.id
      WHERE popoli.nome = 'Elfi'`,
    hints: [
      'Quattro tabelle: partecipazioni, personaggi, popoli e battaglie.',
      'Il popolo si raggiunge dal personaggio. Filtra con WHERE popoli.nome = \'Elfi\'.',
    ],
    tables: ['partecipazioni', 'personaggi', 'popoli', 'battaglie'],
  },
  {
    id: 'ex-075',
    chapter: 'join',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'JOIN', 'WHERE'],
    title: 'Le armi del Pelennor',
    prompt: 'Mostra il nome delle armi portate da chi ha partecipato alla Battaglia dei Campi del Pelennor.',
    expectedQuery: `
      SELECT armi.nome
      FROM armi
      JOIN partecipazioni ON armi.portatore_id = partecipazioni.personaggio_id
      JOIN battaglie ON partecipazioni.battaglia_id = battaglie.id
      WHERE battaglie.nome = 'Battaglia dei Campi del Pelennor'`,
    hints: [
      'Il portatore di un’arma e il partecipante a una battaglia sono entrambi id di personaggi: puoi unire armi e partecipazioni direttamente.',
      'JOIN partecipazioni ON armi.portatore_id = partecipazioni.personaggio_id, poi JOIN battaglie e WHERE battaglie.nome = \'Battaglia dei Campi del Pelennor\'. La tabella personaggi non serve.',
    ],
    tables: ['armi', 'partecipazioni', 'battaglie'],
  },
  {
    id: 'ex-076',
    chapter: 'join',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'JOIN', 'WHERE'],
    title: 'Le armi di Rohan',
    prompt:
      'Mostra il nome delle armi portate da personaggi che provengono da un luogo della regione «Rohan», con il nome del portatore.',
    expectedQuery: `
      SELECT armi.nome, personaggi.nome
      FROM armi
      JOIN personaggi ON armi.portatore_id = personaggi.id
      JOIN luoghi ON personaggi.provenienza_id = luoghi.id
      WHERE luoghi.regione = 'Rohan'`,
    hints: [
      'Da un’arma arrivi alla regione in due passi: il portatore, poi il suo luogo di provenienza.',
      'armi → personaggi su portatore_id, personaggi → luoghi su provenienza_id, poi WHERE luoghi.regione = \'Rohan\'.',
    ],
    tables: ['armi', 'personaggi', 'luoghi'],
  },
  {
    id: 'ex-077',
    chapter: 'join',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'JOIN', 'WHERE'],
    title: 'Il viaggio passa da casa',
    prompt:
      'Mostra il nome dei personaggi che hanno fra le tappe del viaggio il luogo da cui provengono, con il numero d’ordine di quella tappa.',
    expectedQuery: `
      SELECT personaggi.nome, tappe.ordine
      FROM tappe
      JOIN personaggi ON tappe.personaggio_id = personaggi.id
      WHERE tappe.luogo_id = personaggi.provenienza_id`,
    hints: [
      'Ti bastano tappe e personaggi: confronta il luogo della tappa con il luogo di provenienza del personaggio.',
      'Dopo il JOIN su tappe.personaggio_id = personaggi.id, tieni le righe con tappe.luogo_id = personaggi.provenienza_id.',
    ],
    tables: ['tappe', 'personaggi'],
  },
  {
    id: 'ex-078',
    chapter: 'join',
    difficulty: 'medio',
    keywords: ['SELECT', 'FROM', 'JOIN', 'WHERE'],
    title: 'Battaglie sulla strada di Frodo',
    prompt:
      'Frodo ha id 1. Mostra il nome delle battaglie combattute in un luogo per cui è passato Frodo durante il suo viaggio.',
    expectedQuery: `
      SELECT battaglie.nome
      FROM tappe
      JOIN battaglie ON tappe.luogo_id = battaglie.luogo_id
      WHERE tappe.personaggio_id = 1`,
    hints: [
      'Una tappa e una battaglia si incontrano quando hanno lo stesso luogo_id.',
      'JOIN battaglie ON tappe.luogo_id = battaglie.luogo_id, poi WHERE tappe.personaggio_id = 1. Conta il luogo, non la data: la battaglia può essere di un altro anno.',
    ],
    tables: ['tappe', 'battaglie'],
  },
  {
    id: 'ex-079',
    chapter: 'join',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'JOIN', 'AS', 'WHERE'],
    title: 'Combattere nella propria regione',
    prompt:
      'Mostra il nome dei personaggi che hanno combattuto in una battaglia svolta nella stessa regione del luogo da cui provengono, con il nome della battaglia e la regione.',
    expectedQuery: `
      SELECT personaggi.nome, battaglie.nome, campo.regione
      FROM partecipazioni
      JOIN personaggi ON partecipazioni.personaggio_id = personaggi.id
      JOIN luoghi AS origine ON personaggi.provenienza_id = origine.id
      JOIN battaglie ON partecipazioni.battaglia_id = battaglie.id
      JOIN luoghi AS campo ON battaglie.luogo_id = campo.id
      WHERE origine.regione = campo.regione`,
    hints: [
      'La tabella luoghi ti serve due volte: una per il luogo di provenienza, una per il luogo della battaglia. Dai a ciascuna un alias con AS.',
      'JOIN luoghi AS origine ON personaggi.provenienza_id = origine.id e JOIN luoghi AS campo ON battaglie.luogo_id = campo.id, poi WHERE origine.regione = campo.regione.',
    ],
    tables: ['partecipazioni', 'personaggi', 'luoghi', 'battaglie'],
  },
  {
    id: 'ex-080',
    chapter: 'join',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'JOIN', 'AS', 'WHERE'],
    title: 'Lo stesso popolo di Gimli',
    prompt: 'Mostra il nome dei personaggi che appartengono allo stesso popolo di Gimli, escluso Gimli.',
    expectedQuery: `
      SELECT altri.nome
      FROM personaggi AS gimli
      JOIN personaggi AS altri ON altri.popolo_id = gimli.popolo_id
      WHERE gimli.nome = 'Gimli'
        AND altri.id <> gimli.id`,
    hints: [
      'Puoi unire la tabella personaggi con sé stessa: una copia per Gimli, una per gli altri, ciascuna con un alias.',
      'JOIN personaggi AS altri ON altri.popolo_id = gimli.popolo_id, poi WHERE gimli.nome = \'Gimli\' AND altri.id <> gimli.id.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-081',
    chapter: 'join',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'JOIN', 'AS', 'WHERE'],
    title: 'Nati nello stesso anno',
    prompt:
      'Mostra le coppie di personaggi nati nello stesso anno: il nome dei due personaggi e l’anno. Ogni coppia compare una volta sola.',
    expectedQuery: `
      SELECT a.nome, b.nome, a.anno_nascita
      FROM personaggi AS a
      JOIN personaggi AS b ON a.anno_nascita = b.anno_nascita
      WHERE a.id < b.id`,
    hints: [
      'Unisci personaggi con sé stessa sulla condizione a.anno_nascita = b.anno_nascita.',
      'Con a.id <> b.id ogni coppia comparirebbe due volte, in un ordine e nell’altro: a.id < b.id ne tiene una sola. I NULL non sono uguali a niente, quindi gli anni sconosciuti restano fuori.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-082',
    chapter: 'join',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'JOIN', 'AS', 'WHERE', 'JULIANDAY', 'ORDER BY'],
    title: 'Da una tappa alla successiva',
    prompt:
      'Boromir ha id 9. Per ogni tratto del suo viaggio mostra il luogo di partenza, il luogo di arrivo e quanti giorni ha impiegato, come numero intero, nell’ordine del viaggio.',
    expectedQuery: `
      SELECT da.nome, a.nome, CAST(julianday(arrivo.data) - julianday(partenza.data) AS INTEGER)
      FROM tappe AS partenza
      JOIN tappe AS arrivo ON arrivo.personaggio_id = partenza.personaggio_id
                          AND arrivo.ordine = partenza.ordine + 1
      JOIN luoghi AS da ON partenza.luogo_id = da.id
      JOIN luoghi AS a ON arrivo.luogo_id = a.id
      WHERE partenza.personaggio_id = 9
      ORDER BY partenza.ordine`,
    hints: [
      'Un tratto collega due tappe dello stesso personaggio con numeri d’ordine consecutivi: unisci tappe con sé stessa su arrivo.ordine = partenza.ordine + 1.',
      'Anche luoghi serve due volte, una per la partenza e una per l’arrivo. I giorni sono julianday(arrivo.data) - julianday(partenza.data), resi interi con CAST(… AS INTEGER).',
    ],
    tables: ['tappe', 'luoghi'],
  },
  {
    id: 'ex-083',
    chapter: 'join',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'LEFT JOIN', 'AS', 'WHERE', 'IS NULL'],
    title: 'Dove Merry è stato e Pipino no',
    prompt: 'Merry ha id 3 e Pipino id 4. Mostra il nome dei luoghi del viaggio di Merry per cui Pipino non è passato.',
    expectedQuery: `
      SELECT luoghi.nome
      FROM tappe AS merry
      LEFT JOIN tappe AS pipino ON pipino.luogo_id = merry.luogo_id
                               AND pipino.personaggio_id = 4
      JOIN luoghi ON merry.luogo_id = luoghi.id
      WHERE merry.personaggio_id = 3
        AND pipino.luogo_id IS NULL`,
    hints: [
      'Per ogni tappa di Merry cerca con un LEFT JOIN la tappa di Pipino nello stesso luogo; dove non c’è, le colonne di Pipino sono NULL.',
      'La condizione pipino.personaggio_id = 4 va nell’ON del LEFT JOIN: in WHERE scarterebbe proprio le righe con NULL che cerchi.',
    ],
    tables: ['tappe', 'luoghi'],
  },
  {
    id: 'ex-084',
    chapter: 'join',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'JOIN', 'AS', 'WHERE'],
    title: 'Avversari sullo stesso campo',
    prompt:
      'Per ogni battaglia mostra il nome della battaglia, il nome di chi ha combattuto per i Popoli liberi e il nome di chi, nella stessa battaglia, ha combattuto per l’Ombra.',
    expectedQuery: `
      SELECT battaglie.nome, liberi.nome, ombra.nome
      FROM partecipazioni AS pl
      JOIN partecipazioni AS po ON po.battaglia_id = pl.battaglia_id
      JOIN battaglie ON pl.battaglia_id = battaglie.id
      JOIN personaggi AS liberi ON pl.personaggio_id = liberi.id
      JOIN personaggi AS ombra ON po.personaggio_id = ombra.id
      WHERE pl.schieramento = 'Popoli liberi'
        AND po.schieramento = 'Ombra'`,
    hints: [
      'Ti servono due copie di partecipazioni, una per ogni schieramento, unite sulla stessa battaglia; e due copie di personaggi per i due nomi.',
      'Filtra con pl.schieramento = \'Popoli liberi\' AND po.schieramento = \'Ombra\'. Le battaglie senza nessuno dalla parte dell’Ombra spariscono da sole.',
    ],
    tables: ['partecipazioni', 'battaglie', 'personaggi'],
  },
  {
    id: 'ex-085',
    chapter: 'join',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'JOIN', 'LEFT JOIN', 'WHERE'],
    title: 'Gli hobbit e le loro armi',
    prompt:
      'Mostra il nome di ogni hobbit con il nome delle armi che porta, una riga per arma. Gli hobbit senza armi compaiono comunque, con l’arma vuota.',
    expectedQuery: `
      SELECT personaggi.nome, armi.nome
      FROM personaggi
      JOIN popoli ON personaggi.popolo_id = popoli.id
      LEFT JOIN armi ON armi.portatore_id = personaggi.id
      WHERE popoli.nome = 'Hobbit'`,
    hints: [
      'Con popoli serve un JOIN normale, con armi un LEFT JOIN: un hobbit ha sempre un popolo, ma può non avere armi.',
      'Il filtro WHERE popoli.nome = \'Hobbit\' non tocca le colonne di armi, quindi non cancella le righe con NULL.',
    ],
    tables: ['personaggi', 'popoli', 'armi'],
  },
  {
    id: 'ex-086',
    chapter: 'join',
    difficulty: 'difficile',
    keywords: ['SELECT', 'FROM', 'JOIN', 'AS', 'WHERE'],
    title: 'A Brea prima di Gandalf',
    prompt: 'Gandalf ha id 5. Mostra il nome dei personaggi arrivati a Brea prima di lui, con la data di arrivo.',
    expectedQuery: `
      SELECT personaggi.nome, altri.data
      FROM tappe AS altri
      JOIN tappe AS gandalf ON gandalf.luogo_id = altri.luogo_id
                           AND gandalf.personaggio_id = 5
      JOIN luoghi ON altri.luogo_id = luoghi.id
      JOIN personaggi ON altri.personaggio_id = personaggi.id
      WHERE luoghi.nome = 'Brea'
        AND altri.data < gandalf.data`,
    hints: [
      'Unisci tappe con sé stessa: una copia per la tappa di Gandalf a Brea, una per le tappe degli altri nello stesso luogo.',
      'Le date nel formato AAAA-MM-GG si confrontano anche come testi: altri.data < gandalf.data. Aggiungi WHERE luoghi.nome = \'Brea\'.',
    ],
    tables: ['tappe', 'luoghi', 'personaggi'],
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

  {
    id: 'ex-087',
    chapter: 'aggregazioni',
    difficulty: 'facile',
    keywords: ['SELECT', 'COUNT', 'FROM'],
    title: 'Quanti personaggi',
    prompt: 'Conta i personaggi registrati nell’archivio.',
    expectedQuery: `
      SELECT COUNT(*)
      FROM personaggi`,
    hints: [
      'Una funzione di aggregazione riassume tutte le righe in un solo valore.',
      'COUNT(*) conta le righe della tabella personaggi.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-088',
    chapter: 'aggregazioni',
    difficulty: 'facile',
    keywords: ['SELECT', 'COUNT', 'FROM', 'WHERE'],
    title: 'Quanti nella Compagnia',
    prompt: 'Conta i membri della Compagnia dell’Anello.',
    expectedQuery: `
      SELECT COUNT(*)
      FROM personaggi
      WHERE membro_compagnia = 1`,
    hints: [
      'WHERE filtra le righe prima che COUNT le conti.',
      'SELECT COUNT(*) FROM personaggi WHERE membro_compagnia = 1.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-089',
    chapter: 'aggregazioni',
    difficulty: 'facile',
    keywords: ['SELECT', 'MIN', 'FROM'],
    title: 'L’anno di nascita più antico',
    prompt: 'Mostra l’anno di nascita più antico registrato nell’archivio.',
    expectedQuery: `
      SELECT MIN(anno_nascita)
      FROM personaggi`,
    hints: [
      'L’anno più antico è il più piccolo.',
      'MIN(anno_nascita) restituisce il valore più piccolo della colonna e ignora i NULL.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-090',
    chapter: 'aggregazioni',
    difficulty: 'facile',
    keywords: ['SELECT', 'SUM', 'FROM'],
    title: 'Tutti gli eserciti dell’Ombra',
    prompt:
      'Calcola il numero totale di combattenti schierati dall’Ombra in tutte le battaglie di cui si conoscono le forze.',
    expectedQuery: `
      SELECT SUM(forze_ombra)
      FROM battaglie`,
    hints: [
      'SUM somma i valori di una colonna su tutte le righe.',
      'SUM(forze_ombra) salta da sola la battaglia in cui il valore è NULL.',
    ],
    tables: ['battaglie'],
  },
  {
    id: 'ex-091',
    chapter: 'aggregazioni',
    difficulty: 'facile',
    keywords: ['SELECT', 'AVG', 'FROM'],
    title: 'La media dei Popoli liberi',
    prompt: 'Calcola il numero medio di combattenti schierati dai Popoli liberi in una battaglia.',
    expectedQuery: `
      SELECT AVG(forze_popoli_liberi)
      FROM battaglie`,
    hints: [
      'La media di una colonna si calcola con AVG.',
      'SELECT AVG(forze_popoli_liberi) FROM battaglie.',
    ],
    tables: ['battaglie'],
  },
  {
    id: 'ex-092',
    chapter: 'aggregazioni',
    difficulty: 'facile',
    keywords: ['SELECT', 'MAX', 'FROM'],
    title: 'L’esercito più grande',
    prompt: 'Mostra il numero più alto di combattenti che l’Ombra ha schierato in una sola battaglia.',
    expectedQuery: `
      SELECT MAX(forze_ombra)
      FROM battaglie`,
    hints: [
      'Il valore più alto di una colonna si trova con MAX.',
      'SELECT MAX(forze_ombra) FROM battaglie.',
    ],
    tables: ['battaglie'],
  },
  {
    id: 'ex-093',
    chapter: 'aggregazioni',
    difficulty: 'facile',
    keywords: ['SELECT', 'COUNT', 'FROM', 'GROUP BY'],
    title: 'Luoghi per regione',
    prompt: 'Per ogni regione mostra il nome della regione e il numero di luoghi dell’archivio che vi si trovano.',
    expectedQuery: `
      SELECT regione, COUNT(*)
      FROM luoghi
      GROUP BY regione`,
    hints: [
      'GROUP BY regione forma un gruppo di righe per ogni regione.',
      'Con GROUP BY, COUNT(*) conta le righe di ciascun gruppo invece che della tabella intera.',
    ],
    tables: ['luoghi'],
  },
  {
    id: 'ex-094',
    chapter: 'aggregazioni',
    difficulty: 'facile',
    keywords: ['SELECT', 'COUNT', 'FROM', 'GROUP BY'],
    title: 'Armi per tipo',
    prompt: 'Per ogni tipo di arma mostra il tipo e quante armi di quel tipo sono registrate.',
    expectedQuery: `
      SELECT tipo, COUNT(*)
      FROM armi
      GROUP BY tipo`,
    hints: [
      'Raggruppa le armi per tipo.',
      'SELECT tipo, COUNT(*) FROM armi GROUP BY tipo.',
    ],
    tables: ['armi'],
  },
  {
    id: 'ex-095',
    chapter: 'aggregazioni',
    difficulty: 'facile',
    keywords: ['SELECT', 'COUNT', 'FROM', 'GROUP BY'],
    title: 'Vittorie per parte',
    prompt: 'Mostra quante battaglie ha vinto ciascuna delle due parti: il vincitore e il numero di battaglie.',
    expectedQuery: `
      SELECT vincitore, COUNT(*)
      FROM battaglie
      GROUP BY vincitore`,
    hints: [
      'Il vincitore è nella colonna vincitore: ti serve un gruppo per ogni valore.',
      'GROUP BY vincitore e COUNT(*).',
    ],
    tables: ['battaglie'],
  },
  {
    id: 'ex-096',
    chapter: 'aggregazioni',
    difficulty: 'facile',
    keywords: ['SELECT', 'MIN', 'MAX', 'FROM', 'WHERE'],
    title: 'L’inizio e la fine del viaggio di Frodo',
    prompt: 'Frodo ha id 1. Mostra la data della prima e quella dell’ultima tappa del suo viaggio.',
    expectedQuery: `
      SELECT MIN(data), MAX(data)
      FROM tappe
      WHERE personaggio_id = 1`,
    hints: [
      'Nel formato AAAA-MM-GG la data più antica è anche la più piccola come testo: MIN e MAX funzionano anche sulle date.',
      'SELECT MIN(data), MAX(data) FROM tappe WHERE personaggio_id = 1.',
    ],
    tables: ['tappe'],
  },
  {
    id: 'ex-097',
    chapter: 'aggregazioni',
    difficulty: 'facile',
    keywords: ['SELECT', 'COUNT', 'FROM', 'WHERE', 'LIKE'],
    title: 'Le tappe del 3018',
    prompt: 'Conta le tappe raggiunte nell’anno 3018, da qualunque personaggio.',
    expectedQuery: `
      SELECT COUNT(*)
      FROM tappe
      WHERE data LIKE '3018-%'`,
    hints: [
      'L’anno è la prima parte della data: tutte le date del 3018 cominciano con «3018-».',
      'WHERE data LIKE \'3018-%\', poi COUNT(*).',
    ],
    tables: ['tappe'],
  },
  {
    id: 'ex-098',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'COUNT', 'FROM'],
    title: 'Anni conosciuti e sconosciuti',
    prompt:
      'Mostra in una sola riga il numero totale di personaggi e il numero di personaggi di cui si conosce l’anno di nascita.',
    expectedQuery: `
      SELECT COUNT(*), COUNT(anno_nascita)
      FROM personaggi`,
    hints: [
      'COUNT(*) conta le righe; COUNT(colonna) conta solo le righe in cui quella colonna non è NULL.',
      'SELECT COUNT(*), COUNT(anno_nascita) FROM personaggi.',
    ],
    tables: ['personaggi'],
  },
  {
    id: 'ex-099',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'COUNT', 'DISTINCT', 'FROM'],
    title: 'Quante regioni',
    prompt: 'Conta le regioni diverse in cui si trovano i luoghi dell’archivio.',
    expectedQuery: `
      SELECT COUNT(DISTINCT regione)
      FROM luoghi`,
    hints: [
      'COUNT(regione) conterebbe una volta per luogo, anche le regioni ripetute.',
      'COUNT(DISTINCT regione) conta i valori diversi.',
    ],
    tables: ['luoghi'],
  },
  {
    id: 'ex-100',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'COUNT', 'FROM', 'JOIN', 'GROUP BY', 'ORDER BY'],
    title: 'I veterani',
    prompt:
      'Per ogni personaggio che ha partecipato ad almeno una battaglia, mostra il nome e il numero di battaglie, dal più alto. A parità di numero, in ordine alfabetico.',
    expectedQuery: `
      SELECT personaggi.nome, COUNT(*)
      FROM partecipazioni
      JOIN personaggi ON partecipazioni.personaggio_id = personaggi.id
      GROUP BY personaggi.id, personaggi.nome
      ORDER BY COUNT(*) DESC, personaggi.nome`,
    hints: [
      'Ogni riga di partecipazioni è una battaglia di un personaggio: raggruppale per personaggio.',
      'Raggruppa per personaggi.id e personaggi.nome, poi ORDER BY COUNT(*) DESC, personaggi.nome.',
    ],
    tables: ['partecipazioni', 'personaggi'],
  },
  {
    id: 'ex-101',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'COUNT', 'FROM', 'JOIN', 'GROUP BY', 'HAVING'],
    title: 'Più di un’arma',
    prompt: 'Mostra il nome dei personaggi che portano più di un’arma, con il numero delle loro armi.',
    expectedQuery: `
      SELECT personaggi.nome, COUNT(*)
      FROM armi
      JOIN personaggi ON armi.portatore_id = personaggi.id
      GROUP BY personaggi.id, personaggi.nome
      HAVING COUNT(*) > 1`,
    hints: [
      'Conta le armi per portatore con GROUP BY.',
      'La condizione sul conteggio va in HAVING, dopo GROUP BY: HAVING COUNT(*) > 1.',
    ],
    tables: ['armi', 'personaggi'],
  },
  {
    id: 'ex-102',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'SUM', 'FROM', 'GROUP BY'],
    title: 'Le forze di chi vince',
    prompt:
      'Per ciascuna delle due parti vincitrici, mostra il vincitore, il totale dei combattenti dei Popoli liberi e il totale dei combattenti dell’Ombra nelle battaglie che ha vinto.',
    expectedQuery: `
      SELECT vincitore, SUM(forze_popoli_liberi), SUM(forze_ombra)
      FROM battaglie
      GROUP BY vincitore`,
    hints: [
      'Un gruppo per ogni valore di vincitore, e due somme per gruppo.',
      'SELECT vincitore, SUM(forze_popoli_liberi), SUM(forze_ombra) FROM battaglie GROUP BY vincitore.',
    ],
    tables: ['battaglie'],
  },
  {
    id: 'ex-103',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'AVG', 'ROUND', 'FROM', 'JOIN', 'WHERE', 'GROUP BY'],
    title: 'L’anno medio di nascita per popolo',
    prompt:
      'Per ogni popolo con almeno un personaggio di cui si conosce l’anno di nascita, mostra il nome del popolo e l’anno medio di nascita, arrotondato all’intero.',
    expectedQuery: `
      SELECT popoli.nome, ROUND(AVG(personaggi.anno_nascita))
      FROM personaggi
      JOIN popoli ON personaggi.popolo_id = popoli.id
      WHERE personaggi.anno_nascita IS NOT NULL
      GROUP BY popoli.id, popoli.nome`,
    hints: [
      'Escludi con WHERE i personaggi senza anno: altrimenti i popoli in cui l’anno manca a tutti compaiono con una media NULL.',
      'ROUND(AVG(personaggi.anno_nascita)) arrotonda la media all’intero; raggruppa per popoli.id e popoli.nome.',
    ],
    tables: ['personaggi', 'popoli'],
  },
  {
    id: 'ex-104',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'COUNT', 'FROM', 'JOIN', 'GROUP BY', 'ORDER BY'],
    title: 'Le regioni più attraversate',
    prompt:
      'Per ogni regione toccata da almeno una tappa, mostra la regione e il numero di tappe che vi si trovano, dalla più attraversata. A parità di numero, in ordine alfabetico di regione.',
    expectedQuery: `
      SELECT luoghi.regione, COUNT(*)
      FROM tappe
      JOIN luoghi ON tappe.luogo_id = luoghi.id
      GROUP BY luoghi.regione
      ORDER BY COUNT(*) DESC, luoghi.regione`,
    hints: [
      'La regione di una tappa è quella del suo luogo: unisci tappe e luoghi.',
      'GROUP BY luoghi.regione, poi ORDER BY COUNT(*) DESC, luoghi.regione.',
    ],
    tables: ['tappe', 'luoghi'],
  },
  {
    id: 'ex-105',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'COUNT', 'FROM', 'JOIN', 'GROUP BY', 'HAVING'],
    title: 'Luoghi d’origine affollati',
    prompt: 'Mostra il nome dei luoghi da cui provengono almeno due personaggi, con il numero di quei personaggi.',
    expectedQuery: `
      SELECT luoghi.nome, COUNT(*)
      FROM personaggi
      JOIN luoghi ON personaggi.provenienza_id = luoghi.id
      GROUP BY luoghi.id, luoghi.nome
      HAVING COUNT(*) >= 2`,
    hints: [
      'Unisci personaggi e luoghi sul luogo di provenienza e conta i personaggi di ogni luogo.',
      'GROUP BY luoghi.id, luoghi.nome e HAVING COUNT(*) >= 2.',
    ],
    tables: ['personaggi', 'luoghi'],
  },
  {
    id: 'ex-106',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'COUNT', 'DISTINCT', 'FROM', 'GROUP BY'],
    title: 'Combattenti per schieramento',
    prompt:
      'Per ciascuno dei due schieramenti mostra lo schieramento e quanti personaggi diversi hanno combattuto in quello schieramento.',
    expectedQuery: `
      SELECT schieramento, COUNT(DISTINCT personaggio_id)
      FROM partecipazioni
      GROUP BY schieramento`,
    hints: [
      'Lo stesso personaggio compare in più battaglie: COUNT(*) conterebbe le partecipazioni, non i personaggi.',
      'GROUP BY schieramento e COUNT(DISTINCT personaggio_id).',
    ],
    tables: ['partecipazioni'],
  },
  {
    id: 'ex-107',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'MIN', 'MAX', 'FROM', 'JOIN', 'GROUP BY'],
    title: 'Partenze e arrivi',
    prompt:
      'Per ogni personaggio di cui l’archivio registra il viaggio, mostra il nome, la data della prima tappa e la data dell’ultima.',
    expectedQuery: `
      SELECT personaggi.nome, MIN(tappe.data), MAX(tappe.data)
      FROM tappe
      JOIN personaggi ON tappe.personaggio_id = personaggi.id
      GROUP BY personaggi.id, personaggi.nome`,
    hints: [
      'Un gruppo per personaggio, con due aggregazioni sulla stessa colonna.',
      'MIN(tappe.data) e MAX(tappe.data), con GROUP BY personaggi.id, personaggi.nome.',
    ],
    tables: ['tappe', 'personaggi'],
  },
  {
    id: 'ex-108',
    chapter: 'aggregazioni',
    difficulty: 'medio',
    keywords: ['SELECT', 'COUNT', 'FROM', 'JOIN', 'WHERE', 'GROUP BY'],
    title: 'I popoli della Compagnia',
    prompt:
      'Per ogni popolo rappresentato nella Compagnia dell’Anello, mostra il nome del popolo e quanti suoi membri ne fanno parte.',
    expectedQuery: `
      SELECT popoli.nome, COUNT(*)
      FROM personaggi
      JOIN popoli ON personaggi.popolo_id = popoli.id
      WHERE personaggi.membro_compagnia = 1
      GROUP BY popoli.id, popoli.nome`,
    hints: [
      'Prima filtra i membri della Compagnia con WHERE, poi raggruppa per popolo.',
      'WHERE personaggi.membro_compagnia = 1, GROUP BY popoli.id, popoli.nome, COUNT(*).',
    ],
    tables: ['personaggi', 'popoli'],
  },
  {
    id: 'ex-109',
    chapter: 'aggregazioni',
    difficulty: 'difficile',
    keywords: ['SELECT', 'MIN', 'MAX', 'JULIANDAY', 'FROM', 'JOIN', 'GROUP BY', 'ORDER BY'],
    title: 'I viaggi più lunghi in giorni',
    prompt:
      'Per ogni personaggio di cui l’archivio registra il viaggio, mostra il nome e quanti giorni separano la prima tappa dall’ultima, come numero intero, dal viaggio più lungo. A parità di giorni, in ordine alfabetico.',
    expectedQuery: `
      SELECT personaggi.nome, CAST(julianday(MAX(tappe.data)) - julianday(MIN(tappe.data)) AS INTEGER)
      FROM tappe
      JOIN personaggi ON tappe.personaggio_id = personaggi.id
      GROUP BY personaggi.id, personaggi.nome
      ORDER BY 2 DESC, personaggi.nome`,
    hints: [
      'Una funzione può lavorare sul risultato di un’aggregazione: julianday(MAX(tappe.data)) - julianday(MIN(tappe.data)).',
      'CAST(… AS INTEGER) rende intero il risultato. In ORDER BY puoi ripetere l’espressione, oppure indicare la colonna con il suo numero: ORDER BY 2 DESC.',
    ],
    tables: ['tappe', 'personaggi'],
  },
  {
    id: 'ex-110',
    chapter: 'aggregazioni',
    difficulty: 'difficile',
    keywords: ['SELECT', 'COUNT', 'SUM', 'CASE', 'FROM', 'JOIN', 'GROUP BY', 'ORDER BY'],
    title: 'Battaglie combattute e vinte',
    prompt:
      'Per ogni personaggio che ha partecipato ad almeno una battaglia, mostra il nome, il numero di battaglie combattute e il numero di quelle vinte dalla sua parte, in ordine alfabetico di nome.',
    expectedQuery: `
      SELECT personaggi.nome,
             COUNT(*),
             SUM(CASE WHEN partecipazioni.schieramento = battaglie.vincitore THEN 1 ELSE 0 END)
      FROM partecipazioni
      JOIN personaggi ON partecipazioni.personaggio_id = personaggi.id
      JOIN battaglie ON partecipazioni.battaglia_id = battaglie.id
      GROUP BY personaggi.id, personaggi.nome
      ORDER BY personaggi.nome`,
    hints: [
      'Una battaglia è vinta dalla parte del personaggio quando lo schieramento della partecipazione è uguale al vincitore della battaglia.',
      'Per contare solo alcune righe del gruppo, somma un CASE che vale 1 o 0: SUM(CASE WHEN partecipazioni.schieramento = battaglie.vincitore THEN 1 ELSE 0 END).',
    ],
    tables: ['partecipazioni', 'personaggi', 'battaglie'],
  },
  {
    id: 'ex-111',
    chapter: 'aggregazioni',
    difficulty: 'difficile',
    keywords: ['SELECT', 'COUNT', 'DISTINCT', 'FROM', 'JOIN', 'GROUP BY', 'HAVING'],
    title: 'Battaglie di molti popoli',
    prompt:
      'Mostra il nome delle battaglie a cui hanno partecipato personaggi di almeno tre popoli diversi, con il numero di popoli.',
    expectedQuery: `
      SELECT battaglie.nome, COUNT(DISTINCT personaggi.popolo_id)
      FROM partecipazioni
      JOIN personaggi ON partecipazioni.personaggio_id = personaggi.id
      JOIN battaglie ON partecipazioni.battaglia_id = battaglie.id
      GROUP BY battaglie.id, battaglie.nome
      HAVING COUNT(DISTINCT personaggi.popolo_id) >= 3`,
    hints: [
      'Il popolo di un partecipante è in personaggi.popolo_id: unisci partecipazioni, personaggi e battaglie.',
      'Raggruppa per battaglia e conta i popoli diversi con COUNT(DISTINCT personaggi.popolo_id), anche nella condizione di HAVING.',
    ],
    tables: ['partecipazioni', 'personaggi', 'battaglie'],
  },
  {
    id: 'ex-112',
    chapter: 'aggregazioni',
    difficulty: 'difficile',
    keywords: ['SELECT', 'COUNT', 'FROM', 'JOIN', 'GROUP BY', 'HAVING'],
    title: 'Popoli senza date',
    prompt:
      'Mostra il nome dei popoli che hanno almeno un personaggio nell’archivio, ma di nessuno dei quali si conosce l’anno di nascita.',
    expectedQuery: `
      SELECT popoli.nome
      FROM personaggi
      JOIN popoli ON personaggi.popolo_id = popoli.id
      GROUP BY popoli.id, popoli.nome
      HAVING COUNT(personaggi.anno_nascita) = 0`,
    hints: [
      'Se filtri con WHERE anno_nascita IS NULL perdi l’informazione che ti serve: un popolo può avere personaggi con l’anno e personaggi senza.',
      'Raggruppa per popolo e controlla in HAVING che COUNT(personaggi.anno_nascita), che non conta i NULL, valga 0.',
    ],
    tables: ['personaggi', 'popoli'],
  },
  {
    id: 'ex-113',
    chapter: 'aggregazioni',
    difficulty: 'difficile',
    keywords: ['SELECT', 'AVG', 'ROUND', 'FROM', 'JOIN'],
    title: 'Quanti sono immortali',
    prompt:
      'Calcola la percentuale di personaggi dell’archivio che appartengono a un popolo immortale, arrotondata a una cifra decimale.',
    expectedQuery: `
      SELECT ROUND(AVG(popoli.immortale) * 100, 1)
      FROM personaggi
      JOIN popoli ON personaggi.popolo_id = popoli.id`,
    hints: [
      'La colonna immortale vale 1 o 0: la sua media su tutti i personaggi è la frazione di immortali.',
      'ROUND(AVG(popoli.immortale) * 100, 1). AVG restituisce un numero decimale anche se la colonna è intera.',
    ],
    tables: ['personaggi', 'popoli'],
  },
  {
    id: 'ex-114',
    chapter: 'aggregazioni',
    difficulty: 'difficile',
    keywords: ['SELECT', 'MAX', 'JULIANDAY', 'FROM', 'JOIN', 'AS', 'GROUP BY', 'ORDER BY'],
    title: 'Il tratto più lungo',
    prompt:
      'Per ogni personaggio di cui l’archivio registra il viaggio, mostra il nome e il numero massimo di giorni passati fra due tappe consecutive, come numero intero, dal più alto. A parità, in ordine alfabetico.',
    expectedQuery: `
      SELECT personaggi.nome,
             MAX(CAST(julianday(arrivo.data) - julianday(partenza.data) AS INTEGER))
      FROM tappe AS partenza
      JOIN tappe AS arrivo ON arrivo.personaggio_id = partenza.personaggio_id
                          AND arrivo.ordine = partenza.ordine + 1
      JOIN personaggi ON partenza.personaggio_id = personaggi.id
      GROUP BY personaggi.id, personaggi.nome
      ORDER BY 2 DESC, personaggi.nome`,
    hints: [
      'Prima costruisci i tratti: unisci tappe con sé stessa sulle tappe consecutive dello stesso personaggio, arrivo.ordine = partenza.ordine + 1.',
      'Per ogni tratto i giorni sono julianday(arrivo.data) - julianday(partenza.data); MAX di questa espressione, raggruppando per personaggio.',
    ],
    tables: ['tappe', 'personaggi'],
  },
  {
    id: 'ex-115',
    chapter: 'aggregazioni',
    difficulty: 'difficile',
    keywords: ['SELECT', 'SUM', 'FROM', 'JOIN', 'GROUP BY'],
    title: 'Combattenti per regione',
    prompt:
      'Per ogni regione in cui si è combattuto, mostra la regione e il totale dei combattenti schierati dalle due parti, contando tutte le forze conosciute.',
    expectedQuery: `
      SELECT luoghi.regione, SUM(battaglie.forze_popoli_liberi) + SUM(battaglie.forze_ombra)
      FROM battaglie
      JOIN luoghi ON battaglie.luogo_id = luoghi.id
      GROUP BY luoghi.regione`,
    hints: [
      'Nell’Assalto a Isengard le forze dell’Ombra sono NULL, ma quelle dei Popoli liberi si conoscono e vanno contate.',
      'SUM(forze_popoli_liberi + forze_ombra) scarta l’intera battaglia, perché la somma con un NULL è NULL. Somma le due colonne separatamente: SUM(…) + SUM(…).',
    ],
    tables: ['battaglie', 'luoghi'],
  },
  {
    id: 'ex-116',
    chapter: 'aggregazioni',
    difficulty: 'difficile',
    keywords: ['SELECT', 'COUNT', 'STRFTIME', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY'],
    title: 'Le tappe mese per mese',
    prompt:
      'Per ogni mese del 3019 in cui è stata raggiunta almeno una tappa, mostra il mese, come numero di due cifre, e il numero di tappe, in ordine di mese.',
    expectedQuery: `
      SELECT strftime('%m', data), COUNT(*)
      FROM tappe
      WHERE data LIKE '3019-%'
      GROUP BY strftime('%m', data)
      ORDER BY strftime('%m', data)`,
    hints: [
      'strftime(\'%m\', data) estrae il mese come testo di due cifre, da \'01\' a \'12\'.',
      'Filtra il 3019 con WHERE, poi raggruppa e ordina per strftime(\'%m\', data).',
    ],
    tables: ['tappe'],
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
