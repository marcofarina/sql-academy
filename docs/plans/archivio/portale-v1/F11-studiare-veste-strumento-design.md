# F11 — Studiare la veste grafica con lo strumento di design

- **Modello / effort:** Opus 5.5 `medium`. Si decide la forma visiva del portale e di un tema: serve giudizio, non esecuzione.
- **Dipendenze:** F03 (componenti reali da vestire). Precede F08, che ne traduce le scelte in codice. Aggiunta il 2026-11-17 su richiesta di Marco; l’ID non indica l’ordine.
- **Consumo stimato:** medio. Pesano le iterazioni con Marco sulle tavole.
- **Incertezza:** media. Dipende da quante proposte servono prima dell’approvazione.
- **Punto di ripresa:** tavole della veste neutra approvate, prima di quelle Star Wars.

## 1. Obiettivo e risultato atteso

Prima di scrivere CSS, Marco vede e approva l’aspetto del portale su tavole disegnate con lo strumento di design di Claude. Al termine esistono:

- un Artifact di tipo «Design» con le tavole approvate;
- due specifiche, `docs/design/neutra.md` per la pagina iniziale e `docs/design/star-wars.md` per il tema, che F08 applica senza dover reinventare le scelte. Ogni tema ha la sua specifica in `docs/design/<id>.md`.

## 2. Contesto minimo

- Passaggio di consegne di F03: struttura delle pagine, componenti, variabili su `:root` in `src/styles.css`.
- Sezioni «Icone» e «Decisioni condivise» del `README.md` del piano: icone solo RB, anche tematiche; loghi ed emblemi solo stilizzati; nessuna immagine né font ufficiale delle opere.
- Skill `frontend-design`, da caricare prima di disegnare.
- Strumento: Artifact di tipo «Design» (tela con *artboard*). Lo si avvia dal tool `Artifact`, con `action: "quickstart"` e `intent: "design"`; il tipo dà le proprie istruzioni alla creazione. L’Artifact è privato: il link si riporta nel passaggio di consegne.

## 3. Perimetro

Dentro: veste neutra della pagina iniziale; veste Star Wars del guscio del tema e della sandbox; palette, caratteri, raggi, bordi, decorazioni; stati della sandbox (risultato, errore, interruzione, ripristino); larghezza desktop e 375 px; proposta delle icone tematiche Star Wars.

Fuori: codice del portale (F08), creazione delle icone tematiche (F08, con la skill `icone-rb`), veste del Signore degli Anelli (F09), sezioni non ancora costruite oltre a un’indicazione di massima.

## 4. Attività di implementazione

1. Fai uno screenshot del portale attuale con `npm run dev` (pagina iniziale, sandbox con un risultato e con un errore): è il punto di partenza delle tavole.
2. Crea l’Artifact «Design» e disegna la **veste neutra**: pagina iniziale con l’elenco dei temi. Mostrala a Marco e attendi l’approvazione.
3. Disegna la **veste Star Wars**: guscio del tema con le sei sezioni, sandbox negli stati del punto 3 del perimetro, a desktop e a 375 px. Proponi due direzioni diverse prima di rifinirne una.
4. Nelle tavole usa solo le icone RB già nel progetto (`src/assets/icons/`). Le icone tematiche che proponi (oggetti, stemmi delle fazioni) restano segnaposto descritti a parole: le disegna F08 con la skill `icone-rb`.
5. Caratteri: solo a licenza libera (per esempio OFL), con la licenza verificata alla fonte. Annota nome, licenza e URL.
6. Misura con uno script il contrasto di ogni coppia testo/fondo e accento/fondo della palette (minimo 4,5:1 per il testo normale); correggi la palette finché non passa.
7. Scrivi `docs/design/neutra.md` e `docs/design/star-wars.md`: link all’Artifact, variabili con i valori (colori, caratteri, raggi, bordi), decorazioni, elenco delle icone tematiche da creare con il loro significato, contrasti misurati. È il modello delle specifiche dei temi successivi.

## 5. Criteri di accettazione

| Verifica | Risultato atteso |
| --- | --- |
| Approvazione di Marco | Tavole della veste neutra e della veste Star Wars approvate, in chat |
| `docs/design/neutra.md`, `docs/design/star-wars.md` | Esistono; ogni colore e carattere usato nelle tavole vi compare con il suo valore |
| Script di contrasto | Ogni coppia testo/fondo almeno 4,5:1; valori riportati nella specifica |
| Caratteri | Ognuno con licenza libera verificata alla fonte e URL |
| `npm test`, `npm run lint` | Nessun errore (la fase non tocca il codice; controllo di non regressione) |

## 6. Passaggio di consegne

**Esito:** completata il 2026-11-18 01:24 su Opus 5.5, come richiesto. Effort non verificabile dalla sessione.

**Artifact:** [SQL Academy — veste grafica](https://claude.ai/artifact/QidRnRmM4kWYVVRWnJ63df), tipo «Design», privato. Nessun design system: scelta di Marco all’avvio.

### Verifiche

| Verifica | Esito |
| --- | --- |
| Approvazione di Marco | superata: veste neutra B3 approvata il 2026-11-18 («Approvata»), tavole Star Wars approvate il 2026-11-18 («Approvate») |
| `docs/design/neutra.md`, `docs/design/star-wars.md` | superata: esistono. Uno script ha estratto tutti i colori esadecimali e i caratteri dalle tavole approvate (43 colori per la neutra, 68 per Star Wars, sei caratteri) e li ha cercati nelle specifiche: nessuno manca |
| Script di contrasto | superata: `node docs/design/contrasto.mjs` esce con codice 0; ogni coppia di testo almeno 4,5:1, bordi e icone almeno 3:1. Valori nelle specifiche |
| Caratteri | superata: Big Shoulders Display, Atkinson Hyperlegible Next, Atkinson Hyperlegible Mono, Saira Condensed, Michroma, tutti SIL OFL 1.1, verificati con `curl` sui file `OFL.txt` di `github.com/google/fonts` il 2026-11-18. Saira ha il nome riservato «Saira» |
| `npm test` | superata: 110 test in 12 file |
| `npm run lint` | superata |
| Anteprima delle tavole | **non eseguita** da Claude: l’anteprima locale di un file fuori dal progetto non si può fotografare nel browser integrato. La logica interattiva delle tavole B3 (lancio, trascinamento, apertura, mazzo) è stata provata con script Node; l’aspetto lo ha giudicato Marco sulla tela |

Gli screenshot del portale attuale (pagina iniziale, sandbox) sono stati fatti all’avvio con `npm run dev`, come punto di partenza; non sono salvati nel repo.

### Percorso e direzioni scartate

1. Veste neutra «0», la pagina come risultato di `SELECT … FROM temi`: Marco la trova «semplice e banale» e chiede proposte che colpiscano.
2. Tre direzioni: A cassettiera d’archivio, B dorsi su uno scaffale, C diagramma ER su carta da progetto. Marco sceglie B ma chiede locandine di film in una galleria animata (B2).
3. Marco propone il tavolo: locandine lanciate a caso, trascinabili, che si girano sulla scheda del tema. Diventa B3, rifinita (accessibilità delle facce, Esc, movimento ridotto, mazzo a 375 px, due colori corretti per il contrasto) e approvata.
4. Star Wars: A «Archivi Jedi» (scuro, ologrammi) e B «Fascicolo ribelle» (chiaro, arancione, stencil). Marco chiede uno schema chiaro e uno scuro, lo scuro più vicino a Morte Nera e Sith: nasce «Morte Nera». Poi chiede uno schema chiaro più simile a un X-wing: B diventa «X-wing». Infine chiede gli emblemi di Alleanza e Impero nel selettore: restano segnaposto, da creare in F08 (scelta di Marco fra «adesso» e «F08»).

Dettagli e motivi nelle specifiche, sezioni «Direzioni scartate».

### Decisioni nuove

- **Schemi chiaro e scuro per tema** (Marco): tocca il contratto del tema. Proposta di Claude non contraddetta: prima visita secondo `prefers-color-scheme`, scelta conservata nel browser per tema. Registrata nel `README.md` del piano e in `AGENTS.md`.
- **Pagina iniziale a locandine** (Marco): il fronte di una locandina appartiene al tema, quindi va nella sua cartella; il retro è comune e i suoi numeri si calcolano dal database e dagli esercizi.
- **`docs/design/contrasto.mjs`** (Claude): misura le palette delle specifiche; F08 e F12 lo estendono.

### Lavoro residuo per F08

Sezioni «Punti aperti per F08» delle due specifiche, in sintesi:

- contratto: fronte della locandina nella cartella del tema; dichiarazione dei due schemi in `stile.css`; tema con un solo schema; chiave di salvataggio dello schema;
- numeri della scheda calcolati, non scritti a mano;
- fuoco su «Entra» all’apertura della scheda; contorno del fuoco su tutti i controlli;
- colori di stringhe e commenti dell’editor, da misurare;
- icone tematiche con la skill `icone-rb`: emblemi dell’Alleanza e dell’Impero (necessari), spada laser, caccia X-wing, stazione da battaglia (proposte);
- caratteri serviti dal progetto con il loro `OFL.txt`.

### Collaudo della skill `icone-rb`

Nessuna icona creata in questa fase: le tavole usano solo icone RB già nel progetto (`dice`, `circle-arrow-left`, `circle-arrow-right` e quelle delle sezioni e della sandbox). Nessun problema da registrare.

**Consumo reale:** non misurabile dalla sessione. Le iterazioni con Marco sono state otto, quattro sulla neutra e quattro su Star Wars: più di quante stimate.
