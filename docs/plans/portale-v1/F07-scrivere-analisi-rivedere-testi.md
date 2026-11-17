# F07 — Scrivere l’analisi Star Wars e rivedere consegne e suggerimenti

- **Modello / effort:** Opus 5.5 `medium`. Testi per gli studenti: priorità all’approfondimento concordata con Marco.
- **Dipendenze:** F04 (esercizi convertiti, elenco delle incongruenze), F06 (ER approvato, da cui l’analisi non deve divergere).
- **Consumo stimato:** medio-alto. Circa 120 consegne e fino a tre suggerimenti ciascuna.
- **Incertezza:** media. Se la revisione supera il previsto, chiudi la fase per capitolo con commit intermedi.
- **Punto di ripresa:** analisi scritta e approvata, prima della revisione degli esercizi; poi un capitolo alla volta.

Questa fase si esegue solo in locale: le norme in `.claude/norms/` non sono raggiungibili da una sessione nel cloud.

## 1. Obiettivo e risultato atteso

`themes/star-wars/analisi.md` contiene il testo del dominio da cui nasce il database, e ogni esercizio ha titolo, consegna e suggerimenti rivisti secondo le norme di Marco.

## 2. Contesto minimo

- `.claude/norms/scrittura-didattica.md` prima di scrivere; `.claude/norms/scrittura-umana.md` a fine stesura; `.claude/norms/contenuto.md` è già importata da `AGENTS.md`.
- Passaggi di consegne di F04 (incongruenze fra consegna e query) e F06 (ER).
- Decisioni rinviate a F07 da Marco (2026-11-17), elencate nel passaggio di consegne di F04: i difetti di schema e di dati rimasti («Battaglia di Yavin» su Endor, `anno_bby` negativo, ex-088 che non distingue `JOIN` e `LEFT JOIN`). `fazioni.leader` è già stato risolto in F04 (ora `leader_id`). Prima di scrivere l’analisi chiedi a Marco che cosa correggere: l’analisi e gli esercizi devono descrivere lo stesso database.
- Una traccia di seconda prova di Informatica come modello di registro per l’analisi: chiedila a Marco se non è nel repo.
- `~/Developer/github/python-doesnt-byte/volumes/archivista/leggere-un-dominio.mdx`: come il libro presenta un testo di dominio.

## 3. Perimetro

Dentro: `analisi.md`, testi del file degli esercizi di Star Wars, sezione «Analisi» del guscio.

Fuori: query attese (si toccano solo per sanare un’incongruenza segnalata da F04, rieseguendo poi `npm run check:themes`), nuovi esercizi.

## 4. Attività di implementazione

1. Scrivi l’analisi: un testo in italiano che descrive il dominio come lo descriverebbe un committente, da cui uno studente possa ricavare entità, associazioni e cardinalità dell’ER di F06. Niente nomi di tabelle né di colonne.
2. Sottoponi l’analisi a Marco prima di passare agli esercizi.
3. Rendi la sezione «Analisi» nel guscio (Markdown del tema).
4. Rivedi gli esercizi un capitolo alla volta. Per ogni consegna: dice che cosa ottenere senza dettare la query; nomina le colonne richieste nel risultato quando la verifica le controlla; dichiara l’ordinamento quando conta. Per i suggerimenti: dal più generale al più specifico, l’ultimo non è la soluzione.
5. Titoli con maiuscola solo alla prima parola e ai nomi propri; virgolette e apostrofi tipografici.
6. Applica la passata finale di `scrittura-umana.md` all’analisi e a un campione di almeno 20 esercizi; correggi poi gli stessi difetti su tutti.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm run check:themes` | Esce con 0 |
| `npm test`, `npm run build` | Nessun errore |
| `grep -c "'" themes/star-wars/analisi.md` | 0: nessun apostrofo dritto nel testo |

Verifiche manuali: Marco approva l’analisi; ogni entità e ogni associazione di `er.ts` è ricavabile da una frase dell’analisi (elenco di corrispondenze nel passaggio di consegne); `#/star-wars/analisi` mostra il testo.

## 6. Passaggio di consegne

Compilato il 2026-11-17, sessione su Opus 5.5 (modello richiesto; effort non verificabile dalla sessione).

**Esito:** completata. `themes/star-wars/analisi.md` contiene il testo del dominio, approvato da Marco; la sezione «Analisi» (`#/<tema>/analisi`) lo mostra per qualunque tema che abbia il file. I 105 esercizi hanno titolo, consegna e suggerimenti riscritti.

**Decisioni di Marco prese all’inizio della fase** (dettagli nel piano, «Decisioni condivise»):

- «Battaglia di Yavin» era su Endor: aggiunto il pianeta 16, Yavin 4 (tropicale, «giungla e templi antichi», 1000 abitanti, Orlo Esterno), e la battaglia si sposta lì. Cambiano i risultati di ex-046, ex-081, ex-087, ex-098 e di quelli che contano i pianeti; il test di `src/sql/engine.test.ts` ora attende 16 pianeti. **La popolazione di Yavin 4 è mia e approssimativa.**
- `anno_bby` negativo: schema invariato; l’analisi spiega che gli anni si contano a ritroso da Yavin, negativi dopo, e i testi degli esercizi lo ricordano dove serve.
- ex-088: riscritto sui pianeti (vedi sotto).
- Traccia di seconda prova: nessuna nel repo; Marco ha approvato il formato ministeriale noto (testo del committente, solo dominio, senza le consegne al candidato).

### Verifiche

| Verifica | Esito |
| --- | --- |
| `npm run check:themes` | superata: exit 0, «star-wars: 105 esercizi, schema ER su 7 tabelle, 0 problemi» |
| `npm test` | superata: 12 file, 110 test (nuovo `src/analysis/markdown.test.ts`) |
| `npm run build` | superata (l’avviso sul *chunk* oltre 500 kB c’era già) |
| `npm run lint` | superata |
| `grep -c "'" themes/star-wars/analisi.md` | superata: 0 |
| `PRAGMA foreign_key_check` dopo l’aggiunta di Yavin 4 | superata: nessuna riga |
| Controllo automatico dei testi dei 105 esercizi (script usa e getta, fuori dal repo): apostrofi e virgolette dritte, maiuscole nei titoli, intensificatori, identificatori nelle consegne, ultimo suggerimento che contiene il `WHERE` completo, più di tre suggerimenti, titoli doppi | superata: nessun difetto |
| ex-088: la nuova query con `LEFT JOIN` dà 16 righe, la stessa con `JOIN` 9; con `COUNT(*)` sette pianeti risultano 1 invece di 0 | superata: l’esercizio distingue le due join e i due conteggi |
| ex-078: `NOT IN` su una sottoquery che contiene `NULL` restituisce 0 righe | verificato con `sqlite3`: il terzo suggerimento lo dice |
| Browser integrato: `#/star-wars/analisi` mostra titolo e nove paragrafi; `#/star-wars/addestramento/ex-088` mostra i testi nuovi; nessun errore in console | superata |
| Approvazione dell’analisi da parte di Marco | superata |

Nessuna verifica fallita. Non eseguita: la risoluzione nel browser di ciascun esercizio con una query dello studente diversa dalla attesa (la coerenza delle query attese la controlla `check:themes`).

### Corrispondenze fra analisi ed ER

| Elemento di `er.ts` | Frase dell’analisi |
| --- | --- |
| entità `pianeta` e attributi | «Di ogni pianeta si registrano il nome, il clima, il tipo di terreno, la popolazione e il settore galattico…» |
| entità `specie` e attributi | «Di ogni specie interessano il nome, la lingua e l’aspettativa di vita media, in anni.» |
| entità `personaggio` e attributi | «Di ogni personaggio l’archivio conserva il nome, l’anno di nascita, il ruolo … e se è sensibile alla Forza oppure no.» |
| entità `fazione` e attributi | «Di una fazione si registrano il nome, il tipo … e il motto.» |
| entità `spada_laser` e attributi | «Di ognuna interessano il colore della lama, il tipo di cristallo che la alimenta e la forma dell’impugnatura.» |
| entità `astronave` e attributi | «Di ogni astronave si registrano il nome, il modello, il costruttore, la lunghezza in metri, il numero massimo di membri dell’equipaggio e la velocità nell’iperspazio…» |
| entità `battaglia` e attributi | «Di ognuna interessano il nome, l’anno in cui è stata combattuta, … e una stima delle perdite.» |
| `proviene` specie (1,1) – pianeta (0,N) | «Ogni specie ha un solo pianeta d’origine; su un pianeta possono essere nate più specie, oppure nessuna.» |
| `appartiene` personaggio (1,1) – specie (0,N) | «Ogni personaggio appartiene a una specie, mentre una specie può essere registrata anche se nessun personaggio dell’archivio le appartiene.» |
| `nasce` personaggio (0,1) – pianeta (0,N) | «Del personaggio si registra anche il pianeta natale, quando lo si conosce … Su un pianeta possono essere nati più personaggi, oppure nessuno.» |
| `milita` personaggio (1,1) – fazione (1,N) | «Ogni personaggio milita in una sola fazione.» e «Ogni fazione ha almeno un membro…» |
| `guida` personaggio (0,N) – fazione (1,1) | «…e un solo leader, scelto fra i personaggi dell’archivio. Lo stesso personaggio può guidare più fazioni … la maggior parte dei personaggi non ne guida nessuna.» |
| `impugna` personaggio (0,N) – spada (1,1) | «Ogni spada appartiene a un personaggio; un personaggio può possederne più di una, oppure nessuna.» |
| `possiede` fazione (0,N) – astronave (1,1) | «Ogni astronave appartiene a una fazione, che può possederne molte oppure nessuna.» |
| `si_svolge` pianeta (0,N) – battaglia (1,1) | «il pianeta su cui si è svolta» e «Su un pianeta possono essersi combattute più battaglie, oppure nessuna» |
| `vince` battaglia (1,1) – fazione (0,N) | «la fazione che l’ha vinta» e «una fazione può averne vinte più di una, oppure nessuna» |

### Esercizi la cui query è stata modificata

Uno solo, **ex-088**: ora conta i personaggi nati su ogni pianeta, compresi i pianeti senza personaggi (`pianeti LEFT JOIN personaggi … GROUP BY pianeti.nome`); tabelle `pianeti` e `personaggi`. Capitolo, difficoltà e parole chiave invariati. Le altre query sono quelle di F04.

### Come sono stati rivisti gli esercizi

- Consegne: dicono che cosa ottenere e nominano a parole tutte le colonne del risultato (la verifica conta le colonne); nessun alias, nessuna condizione SQL, nessun nome di colonna con il trattino basso. I valori da confrontare stanno fra virgolette basse, scritti come nel database («Verde», «Orlo Esterno»). L’ordinamento è dichiarato in tutte le consegne con `ORDER BY` esterno.
- Suggerimenti: da uno a tre, dal più generale al più specifico; l’ultimo indica la colonna, la clausola o il tranello (per esempio i `NULL` in ex-071 ed ex-078, `COUNT(*)` in ex-088), ma non la condizione completa. I nomi di tabelle e colonne compaiono nei suggerimenti, non nelle consegne.
- Incongruenze di F04 sanate nei testi: ex-029 ed ex-033 (l’identificativo della fazione e della specie è nel suggerimento, e si legge nella tabella), ex-042, ex-059, ex-068, ex-074, ex-083, ex-086, ex-097, ex-098, ex-105.
- Passata di `scrittura-umana.md`: sull’analisi e su un campione di 21 esercizi (uno ogni cinque). Un difetto trovato (ex-076, «le informazioni sono sparse», verbo non letterale) e corretto; lo stesso controllo su tutti non ne ha trovati altri.

### Osservazioni e lavoro residuo

- **Formula ripetuta:** «gli anni si contano a ritroso da Yavin» torna in cinque esercizi (ex-008, 023, 026, 083, 098). L’ho tenuta perché ogni esercizio si legge da solo, spesso in una sessione casuale; Marco decida se va variata.
- **Difficoltà non coerenti** (fuori perimetro, invariate): ex-097 è «difficile» con una sola condizione su una tabella; ex-068, 070, 072, 073 sono «medi» su una tabella. Da rivedere insieme a F13, che lega i punti alla difficoltà.
- **ex-094:** tutte le fazioni hanno personaggi, quindi la prima delle due condizioni non scarta nulla; il risultato resta corretto ma l’esercizio non mostra a che cosa serve la prima `IN`.
- **Viste:** il capitolo `sottoquery-viste` resta senza esercizi sulle viste (come segnalato in F04).
- I tre personaggi aggiunti in F04 hanno anni e ruoli approssimativi, ancora da controllare.
- Commit intermedi: `ad7fde3` (analisi, sezione, Yavin 4), `87dd1cb` (una tabella), `ac9031d` (join), `f154748` (aggregazioni ed ex-088), poi il commit di chiusura.

**Consumo reale:** non misurato.
