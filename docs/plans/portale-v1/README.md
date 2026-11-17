# Piano «portale-v1»

| ID | Fase | Dipendenze | Modello / effort | Consumo stimato | Stato | Completata il | Prompt | Dettaglio |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| F01 | Impostare scheletro, contratto del tema e motore SQL | — | Fable 5.2 `medium` · ripiego Opus 5.5 `high` | alto | completata | 2026-11-16 21:01 | [P-F01](#p-f01) | [F01](F01-impostare-scheletro-contratto-motore.md) |
| F02 | Definire formato degli esercizi e verifica delle risposte | F01 | Fable 5.2 `medium` · ripiego Opus 5.5 `high` | medio | completata | 2026-11-16 21:36 | [P-F02](#p-f02) | [F02](F02-definire-esercizi-verifica.md) |
| F03 | Costruire sandbox e guscio delle pagine di un tema | F01 | Opus 5.5 `medium` | medio | completata | 2026-11-17 12:40 | [P-F03](#p-f03) | [F03](F03-costruire-sandbox-guscio-tema.md) |
| F04 | Portare database ed esercizi Star Wars su SQLite | F02 | Sonnet 5.5 `high` | medio-alto | da fare | | [P-F04](#p-f04) | [F04](F04-portare-star-wars-su-sqlite.md) |
| F05 | Costruire addestramento, catalogo delle query e progressi | F02, F03, F04 | Opus 5.5 `medium` | alto | da fare | | [P-F05](#p-f05) | [F05](F05-costruire-addestramento-catalogo-progressi.md) |
| F06 | Generare il modello logico e disegnare l’ER dichiarativo | F03, F04 | Opus 5.5 `medium` | medio | da fare | | [P-F06](#p-f06) | [F06](F06-generare-logico-disegnare-er.md) |
| F07 | Scrivere l’analisi Star Wars e rivedere consegne e suggerimenti | F04, F06 | Opus 5.5 `medium` | medio-alto | da fare | | [P-F07](#p-f07) | [F07](F07-scrivere-analisi-rivedere-testi.md) |
| F08 | Costruire il sistema di stile per tema e la veste Star Wars | F03 | Opus 5.5 `medium` | medio | da fare | | [P-F08](#p-f08) | [F08](F08-costruire-stile-veste-star-wars.md) |
| F09 | Aggiungere il tema di prova «Il Signore degli Anelli» | F05, F06, F08 | Opus 5.5 `medium` | medio-alto | da fare | | [P-F09](#p-f09) | [F09](F09-aggiungere-tema-signore-anelli.md) |
| F10 | Pubblicare su GitHub Pages e collegare il libro | F07, F09 | Sonnet 5.5 `medium` | basso | da fare | | [P-F10](#p-f10) | [F10](F10-pubblicare-github-pages.md) |

Stati ammessi: `da fare`, `in corso`, `bloccata`, `completata`. Data di completamento nel formato `YYYY-MM-DD HH:mm`, fuso `Europe/Rome`.

Le stime di consumo sono qualitative: nessuna misura garantisce che una fase rientri in una finestra di cinque ore.

## Prompt di apertura

Tutti i prompt condividono la stessa chiusura. I percorsi sono relativi alla radice del repo.

### P-F01

```text
Prima di incollare: /model Fable 5.2  e  /effort medium

Modello richiesto: Fable 5.2, effort medium.
Ripiego se Fable non è disponibile: Opus 5.5, effort high.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v1/README.md
Fase: docs/plans/portale-v1/F01-impostare-scheletro-contratto-motore.md
ID e obiettivo: F01 — Impostare scheletro, contratto del tema e motore SQL.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F02

```text
Prima di incollare: /model Fable 5.2  e  /effort medium

Modello richiesto: Fable 5.2, effort medium.
Ripiego se Fable non è disponibile: Opus 5.5, effort high.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v1/README.md
Fase: docs/plans/portale-v1/F02-definire-esercizi-verifica.md
ID e obiettivo: F02 — Definire formato degli esercizi e verifica delle risposte.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F03

```text
Prima di incollare: /model Opus 5.5  e  /effort medium

Modello richiesto: Opus 5.5, effort medium.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v1/README.md
Fase: docs/plans/portale-v1/F03-costruire-sandbox-guscio-tema.md
ID e obiettivo: F03 — Costruire sandbox e guscio delle pagine di un tema.

Le icone si cercano e si creano solo con la skill `icone-rb`, secondo la sezione «Icone» del piano; mostra a Marco le icone nuove e attendi l’approvazione.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F04

```text
Prima di incollare: /model Sonnet 5.5  e  /effort high

Modello richiesto: Sonnet 5.5, effort high.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v1/README.md
Fase: docs/plans/portale-v1/F04-portare-star-wars-su-sqlite.md
ID e obiettivo: F04 — Portare database ed esercizi Star Wars su SQLite.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F05

```text
Prima di incollare: /model Opus 5.5  e  /effort medium

Modello richiesto: Opus 5.5, effort medium.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v1/README.md
Fase: docs/plans/portale-v1/F05-costruire-addestramento-catalogo-progressi.md
ID e obiettivo: F05 — Costruire addestramento, catalogo delle query e progressi.

Le icone si cercano e si creano solo con la skill `icone-rb`, secondo la sezione «Icone» del piano; mostra a Marco le icone nuove e attendi l’approvazione.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F06

```text
Prima di incollare: /model Opus 5.5  e  /effort medium

Modello richiesto: Opus 5.5, effort medium.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v1/README.md
Fase: docs/plans/portale-v1/F06-generare-logico-disegnare-er.md
ID e obiettivo: F06 — Generare il modello logico e disegnare l’ER dichiarativo.

Le icone si cercano e si creano solo con la skill `icone-rb`, secondo la sezione «Icone» del piano; mostra a Marco le icone nuove e attendi l’approvazione.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F07

```text
Prima di incollare: /model Opus 5.5  e  /effort medium

Modello richiesto: Opus 5.5, effort medium.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v1/README.md
Fase: docs/plans/portale-v1/F07-scrivere-analisi-rivedere-testi.md
ID e obiettivo: F07 — Scrivere l’analisi Star Wars e rivedere consegne e suggerimenti.

Questa fase scrive testi per gli studenti: prima di scrivere leggi .claude/norms/scrittura-didattica.md, a fine stesura applica .claude/norms/scrittura-umana.md. Se .claude/norms non è raggiungibile, fermati.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F08

```text
Prima di incollare: /model Opus 5.5  e  /effort medium

Modello richiesto: Opus 5.5, effort medium.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v1/README.md
Fase: docs/plans/portale-v1/F08-costruire-stile-veste-star-wars.md
ID e obiettivo: F08 — Costruire il sistema di stile per tema e la veste Star Wars.

Le icone si cercano e si creano solo con la skill `icone-rb`, secondo la sezione «Icone» del piano; mostra a Marco le icone nuove e attendi l’approvazione.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F09

```text
Prima di incollare: /model Opus 5.5  e  /effort medium

Modello richiesto: Opus 5.5, effort medium.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v1/README.md
Fase: docs/plans/portale-v1/F09-aggiungere-tema-signore-anelli.md
ID e obiettivo: F09 — Aggiungere il tema di prova «Il Signore degli Anelli».

Questa fase scrive testi per gli studenti: prima di scrivere leggi .claude/norms/scrittura-didattica.md, a fine stesura applica .claude/norms/scrittura-umana.md. Se .claude/norms non è raggiungibile, fermati.

Le icone si cercano e si creano solo con la skill `icone-rb`, secondo la sezione «Icone» del piano; mostra a Marco le icone nuove e attendi l’approvazione.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F10

```text
Prima di incollare: /model Sonnet 5.5  e  /effort medium

Modello richiesto: Sonnet 5.5, effort medium.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v1/README.md
Fase: docs/plans/portale-v1/F10-pubblicare-github-pages.md
ID e obiettivo: F10 — Pubblicare su GitHub Pages e collegare il libro.

Questa fase crea un remote, esegue push e pubblica: chiedi il via a Marco prima di ciascuna di queste azioni.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

## Obiettivo

Pubblicare un portale statico di addestramento a SQL con la piattaforma comune, il tema Star Wars completo e un secondo tema ridotto, «Il Signore degli Anelli», che dimostra che un tema si aggiunge senza toccare il codice comune. Gli altri due temi richiesti da `AGENTS.md` appartengono a piani successivi.

Per ogni tema lo studente trova sei sezioni: sandbox, addestramento, tutte le query, analisi, schema ER, modello logico.

## Vincoli

- Sito solo client: nessun server, nessuna chiave, nessun account, nessun dato personale (gli studenti sono minori).
- Repo e sito pubblici: tutte le icone sono RB Icons, create o scelte con la skill `icone-rb` (vedi «Icone» più sotto); niente Font Awesome né Phosphor. Delle opere protette si usano nomi e ambientazioni, non immagini, loghi o font ufficiali.
- Il dialetto SQL è quello del libro: SQLite.
- Aggiungere un tema non modifica file fuori da `themes/<id>/`.
- Nessun push e nessuna pubblicazione senza il via di Marco. Lavoro su `dev`.

## Autonomia concordata

**Bilanciata** (Marco, 2026-11-16): chiedi sulle decisioni strutturali, risolvi da solo i dettagli locali e reversibili. Chiedi sempre prima di cambiare requisiti o ampliare il perimetro.

## Strategia dei modelli

- Priorità all’**approfondimento**; budget dichiarato ampio nella finestra di cinque ore e nella settimana (Marco, 2026-11-16).
- **Fable 5.2 incluso a tempo:** disponibile fino al **2026-11-17 08:59** (`Europe/Rome`). Assegnato a F01 e F02, da aprire in sequenza entro la scadenza. Se una delle due cade dopo, gira su Opus 5.5 `high`: annotalo nel passaggio di consegne.
- Opus 5.5 `medium` dove si decide una forma o si scrivono testi per gli studenti (F03, F05–F09).
- Sonnet 5.5 dove si esegue una forma già decisa (F04, F10). F04 parte da `high` perché ogni query va giudicata sul risultato, non solo eseguita.
- Se una fase non riesce: prima rendi verificabile il lavoro (test, `npm run check:themes`), poi alza l’effort di un livello, poi passa al modello superiore.

## Decisioni condivise

Prese da Marco il 2026-11-16, salvo dove indicato.

| Decisione | Scelta | Motivo |
| --- | --- | --- |
| Motore SQL | SQLite via `sql.js` | Una query che funziona nel libro funziona nel portale |
| Architettura | Sito statico autonomo su GitHub Pages, link reciproci con il libro | Nessun server da mantenere |
| Visibilità | Pubblica | Come il libro |
| Framework | React + Vite + TypeScript, CSS con variabili per tema | Stack del prototipo, stessa famiglia del sito del libro |
| Formato del tema | Cartella `themes/<id>/` autoscoperta al build | Requisito 1 e 4 di `AGENTS.md` |
| Modello logico | Generato dallo schema SQL del tema | Non può divergere dal database |
| Schema ER | File dichiarativo del tema, disegnato da un componente comune | Lo schema SQL non contiene nomi delle associazioni né scelte concettuali |
| Primo tema | Star Wars, con i 121 esercizi del prototipo riverificati su SQLite | Contenuti già esistenti |
| Tema di prova | Il Signore degli Anelli, in versione ridotta | Prova di modularità su un dominio nuovo |
| Addestramento | Percorso per capitolo del libro (6–9) e difficoltà, più sessioni configurabili | Segue il libro e conserva il generatore del prototipo |
| Progressi | `localStorage`, per tema | Nessun dato personale |
| Tutor AI | Escluso | Richiede server e chiavi |
| Sandbox | Accetta qualunque istruzione, con «Ripristina database» (proposta di Claude, approvata con il piano) | Ogni studente ha un database in memoria proprio |
| Routing | Con hash, `#/<tema>/<sezione>` (proposta di Claude, approvata con il piano) | GitHub Pages non riscrive gli URL |
| Manifest del tema | Solo `id`, `title`, `description`; gli altri file si trovano per nome fisso (Marco, 2026-11-16, in F01) | Un tema nuovo non ripete codice di caricamento |
| Formato degli esercizi | File TypeScript `themes/<id>/esercizi.ts` (Claude, in F02) | Controllato dal compilatore; le query su più righe restano leggibili, cosa che JSON non consente |
| Confronto delle risposte | Nomi e ordine delle colonne non contano; contano numero di colonne e valori (Marco, 2026-11-16, in F02) | Come nel libro; le consegne non devono prescrivere alias |
| Riuso dal libro | Copia e adattamento, senza dipendenza fra i repo (proposta di Claude, approvata con il piano) | Stesso autore, repo pubblico |
| Icone | Solo RB Icons, tutte passate dalla skill `icone-rb`; il progetto è anche collaudo della skill (Marco, 2026-11-17) | Repo pubblico: Font Awesome Pro non ammesso; Phosphor non si usa più |
| Uso delle icone nel codice | File in `src/assets/icons/` (comuni) o `themes/<id>/icone/`, incorporati inline dal componente `Icon` (`src/icons/`); comuni per `name`, di un tema per `svg` (Claude, in F03) | Inline ereditano il colore del testo e le variabili `rb-*`; un’icona comune nuova non richiede codice |
| Editor SQL | CodeMirror 6 con `@codemirror/lang-sql`, dialetto SQLite (Claude, in F03) | Evidenziazione, completamento dallo schema e scorciatoie già pronti; nessuna alternativa più semplice li dà tutti |

### Icone

Marco, 2026-11-17: questo progetto serve anche da collaudo della skill `icone-rb` (nominata «rb-icons» a voce; nella sessione la skill si chiama `icone-rb`). Ogni icona del portale passa dalla skill, senza eccezioni: nessuna icona scritta a mano fuori dal procedimento, nessun emoji o carattere Unicode usato come pittogramma.

Fonte: `Icone: rb-icons` è registrata in `AGENTS.md`, quindi la skill non chiede la fonte.

Procedimento per ogni fase che ha interfaccia (F03, F05, F06, F08, F09), eseguito **prima** di scrivere i componenti:

1. Elenca le icone che la fase richiede (navigazione, azioni, esiti, stati, decorazioni) con il significato di ciascuna.
2. Per ognuna cerca nel catalogo con `python3 tools/search.py`, più sinonimi in italiano e in inglese, come prescrive la skill. Se esiste un’icona adatta, usala.
3. Per le mancanti segui il passo 3b della skill (clean room, `STILE.md`, validazione, galleria). Il modello per disegnare è Opus: le cinque fasi con interfaccia girano già su Opus 5.5; se una fase gira su un modello più leggero, **fermati** e dillo a Marco prima di disegnare.
4. Mostra a Marco il render a 128 px delle icone **nuove** e attendi l’approvazione. Il commit di ciascuna va nel repository `~/Developer/github/icone`, sul branch `dev`, con le sole modifiche dell’icona; nessun push senza il via di Marco. Questi commit non entrano nel commit di chiusura della fase del portale.
5. Copia nel progetto solo le icone usate: quelle comuni in `src/assets/icons/<nome>.svg`, quelle che appartengono a un solo tema in `themes/<id>/icone/<nome>.svg` (un tema porta con sé le proprie icone: F09 non tocca file comuni). Uso inline o come file, secondo il passo 4 della skill; icone decorative con `aria-hidden="true"`, le altre con `role="img"` e `<title>`.
6. Compila la tabella «Registro icone» qui sotto e riporta nel passaggio di consegne della fase i problemi trovati nella skill (ricerca che non trova, `STILE.md` ambiguo, strumenti che falliscono, icone respinte da Marco e perché): è l’esito del collaudo.

Se la libreria o la skill non sono raggiungibili, fermati e dillo a Marco: non sostituire con icone di altre librerie.

#### Registro icone

Una riga per icona, compilata dalla fase che la usa. «Origine» è `catalogo` (esisteva già) o `creata` (disegnata in questa fase, con il modello che l’ha disegnata).

| Icona | Uso nel portale | Fase | Origine | Esito |
| --- | --- | --- | --- | --- |
| `terminal-window` | sezione Sandbox | F03 | catalogo | usata |
| `bullseye` | sezione Addestramento | F03 | creata (Opus 5.5) | approvata |
| `list` | sezione Tutte le query | F03 | creata (Opus 5.5) | approvata |
| `file-lines` | sezione Analisi | F03 | creata (Opus 5.5) | approvata |
| `entity-relationship` | sezione Schema ER | F03 | creata (Opus 5.5) | approvata la seconda di due varianti; la prima versione, verticale, non convinceva Marco |
| `table` | sezione Modello logico | F03 | creata (Opus 5.5) | approvata |
| `circle-play` | pulsante Esegui | F03 | creata (Opus 5.5) | approvata |
| `circle-arrow-rotate-left` | pulsante Ripristina database, avviso di ripristino | F03 | creata (Opus 5.5) | approvata |
| `circle-xmark` | errore di SQLite, database che non si apre | F03 | creata (Opus 5.5) | approvata |
| `triangle-exclamation` | avviso di query interrotta dal watchdog | F03 | creata (Opus 5.5) | approvata |
| `circle-arrow-left` | ritorno all’elenco dei temi | F03 | creata (Opus 5.5) | approvata |

### Struttura di un tema

Nomi fissati in F01 (2026-11-16). Il contratto è in `src/themes/contract.ts`; il registro `src/themes/registry.ts` trova i file per nome, quindi il manifest non li elenca.

```text
themes/<id>/
  theme.ts       manifest esportato come default: id (uguale al nome della cartella), title, description
  schema.sql     CREATE TABLE con chiavi esterne dichiarate
  dati.sql       INSERT
  esercizi.ts    elenco di Exercise esportato come default; facoltativo (F02)
  analisi.md     testo del dominio (F07)
  er.ts          entità, associazioni, cardinalità (F06)
  stile.css      variabili e decorazioni del tema (F08)
```

Il registro legge `theme.ts`, `schema.sql` e `dati.sql`, tutti obbligatori, ed `esercizi.ts`, facoltativo (da F02). `theme.ts` ed `esercizi.ts` sono caricati anche da Node senza Vite (`npm run check:themes`): dal codice comune importano solo tipi, con `import type`. Ogni fase che introduce un altro file aggiunge al registro il suo caricamento a richiesta.

### Riferimenti da adattare

Fatti verificati il 2026-11-16 con `ls` e `grep` sui percorsi indicati, relativi a `~/Developer/github/`.

| Percorso | Che cosa contiene |
| --- | --- |
| `python-doesnt-byte/static/sql-runner/worker.js` | Worker `sql.js` (728 righe): seed serializzato, `PRAGMA foreign_keys = ON`, `lastResultSet`, `hasOrderBy`, `compareSets`, `verifyRun` |
| `python-doesnt-byte/src/theme/SQLRunner/sqlBridge.ts` | Ponte fra React e worker, con watchdog che termina il worker su una query che non finisce |
| `python-doesnt-byte/src/components/DiagrammaER/` | Componente ER dichiarativo del libro (`index.tsx`, `layout.ts`, `types.ts`), cardinalità `(min,max)`; usa il carattere Excalifont, licenza OFL |
| `jedi-academy/src/data/starWarsDatabase.ts` | Schema descrittivo e seed SQL di sette tabelle (272 righe) |
| `jedi-academy/src/data/exercises.ts` | 121 esercizi (1413 righe): `id`, `title`, `description`, `difficulty`, `keywords`, `expectedQuery`, `hints`, `relevantTables`, `checkOrder` |
| `jedi-academy/src/services/sessionGenerator.ts` | Generatore di sessioni del prototipo |

Il libro dichiara `sql.js` `^1.14.1`; l’ultima versione su npm al 2026-11-16 è la 1.16.0 (`npm view sql.js version`). Node locale: v25.9.0.

### Comandi dei criteri di accettazione

I comandi `npm …` citati nelle fasi dipendono da codice non ancora scritto: alla stesura del piano (2026-11-16) **non sono stati eseguiti**. Ogni fase li esegue e ne riporta l’esito.

## Aggiornamenti di stato

| Data | Nota |
| --- | --- |
| 2026-11-16 | Piano scritto dopo l’intervista con Marco. Nessuna fase avviata. |
| 2026-11-16 | F01 completata su Fable 5.2. Scheletro, contratto del tema, registro e motore SQL con watchdog; passaggio di consegne nel dettaglio della fase. |
| 2026-11-16 | F02 completata su Fable 5.2. Tipo `Exercise`, verifica delle risposte con le regole di confronto, `npm run check:themes`; regole e interfacce nel dettaglio della fase. |
| 2026-11-17 | Piano aggiornato su richiesta di Marco: tutte le icone passano dalla skill `icone-rb` (RB Icons), il progetto è collaudo della skill. Sezione «Icone» nel piano; modificate F03, F05, F06, F08, F09 e i loro prompt; `AGENTS.md` sostituisce Phosphor con `Icone: rb-icons`. |
| 2026-11-17 | F03 completata su Opus 5.5. Routing con hash, elenco dei temi, guscio con sei sezioni, sandbox con CodeMirror; dieci icone RB create e approvate da Marco. Dettagli e collaudo della skill nel dettaglio della fase. |
