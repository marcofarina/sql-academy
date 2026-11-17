# F03 — Costruire sandbox e guscio delle pagine di un tema

- **Modello / effort:** Opus 5.5 `medium`. Fase su più file con scelte di forma dell’interfaccia (navigazione, composizione dei componenti).
- **Dipendenze:** F01. Indipendente da F02: può procedere in parallelo, su file diversi.
- **Consumo stimato:** medio.
- **Incertezza:** media. Cresce con l’integrazione dell’editor SQL.
- **Punto di ripresa:** navigazione completa con sezioni vuote, prima dell’editor.

## 1. Obiettivo e risultato atteso

Lo studente apre il portale, sceglie un tema, vede le sei sezioni e usa la sandbox: scrive una query, la esegue, legge risultati o errore, ripristina il database.

## 2. Contesto minimo

- Passaggio di consegne di F01 (interfaccia del motore, registro dei temi).
- Icone: leggi la sezione «Icone» del `README.md` del piano e segui la skill `icone-rb` per ogni icona (catalogo RB Icons, poi creazione se manca). Servono almeno: le sei sezioni, esegui, ripristina, errore, avviso di query interrotta.
- `~/Developer/github/jedi-academy/src/components/SandboxView.tsx`, `SqlEditor.tsx`, `ResultsViewer.tsx`: come idea di interazione, non come codice da copiare.

## 3. Perimetro

Dentro: icone comuni di navigazione e azioni (in `src/assets/icons/`, con il meccanismo di caricamento che le altre fasi riusano), routing con hash `#/<tema>/<sezione>`, pagina iniziale con l’elenco dei temi, guscio del tema con le sei sezioni (sandbox funzionante, le altre cinque con un segnaposto), componenti comuni di editor e tabella dei risultati.

Fuori: addestramento e catalogo (F05), ER e modello logico (F06), analisi (F07), veste grafica (F08: qui basta uno stile neutro e leggibile).

## 4. Attività di implementazione

1. Routing con hash e caricamento a richiesta del tema scelto. Un `id` di tema inesistente porta a una pagina di errore con il link all’elenco.
2. Editor SQL: CodeMirror 6 con evidenziazione SQL, esecuzione con la tastiera, completamento dei nomi di tabelle e colonne del tema. Se emerge un’alternativa più semplice che soddisfa gli stessi punti, sceglila e registra il motivo.
3. Tabella dei risultati: più insiemi di risultati per script, `NULL` distinguibile dalla stringa vuota, avviso quando le righe sono troncate, messaggio d’errore di SQLite riportato per intero.
4. Pannello delle tabelle del tema (nomi, colonne, tipi), letto dal database e non scritto a mano.
5. Pulsante «Ripristina database» e avviso quando il watchdog ha interrotto una query.
6. **Icone:** prima dei componenti, elenco, ricerca e creazione secondo la sezione «Icone» del piano; fissa dove stanno i file e come i componenti le caricano (inline o come file), così F05–F09 le riusano.
7. Test dei componenti dove la logica non è banale (routing, stato della sandbox).

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm test`, `npm run build`, `npm run lint` | Nessun errore |

Procedura manuale con `npm run dev`:

1. Apri la pagina iniziale: compare il tema Star Wars.
2. Entra nel tema: compaiono sei sezioni; l’URL è `#/star-wars/sandbox`.
3. Esegui `SELECT * FROM pianeti;`: compare la tabella.
4. Esegui `SELEC * FROM pianeti;`: compare l’errore di SQLite.
5. Esegui `DROP TABLE pianeti;`, poi «Ripristina database», poi di nuovo la `SELECT`: la tabella ricompare.
6. Ricarica la pagina su `#/star-wars/sandbox`: la sandbox si riapre.
7. Ripeti i passi 2–3 a 375 px di larghezza: nessuno scorrimento orizzontale della pagina.
8. Ogni sezione e ogni pulsante con icona la mostra; nessuna icona è un emoji o un carattere Unicode; ogni file in `src/assets/icons/` ha una riga nel «Registro icone» del piano.

## 6. Passaggio di consegne

**Esito:** completata il 2026-11-17 12:40 su Opus 5.5, come richiesto. Effort non verificabile dalla sessione.

### Verifiche

| Verifica | Esito |
| --- | --- |
| `npm test` | superata: 81 test in sette file (19 nuovi su routing, icone e sandbox) |
| `npm run build` | superata, con un avviso di Vite: il pacchetto principale pesa 671 kB (216 kB compressi), quasi tutto CodeMirror |
| `npm run lint` | superata |
| Manuale 1 — pagina iniziale | superata: compare Star Wars |
| Manuale 2 — sei sezioni, URL `#/star-wars/sandbox` | superata |
| Manuale 3 — `SELECT * FROM pianeti;` | superata, sia con il pulsante sia con Cmd+Invio |
| Manuale 4 — `SELEC * FROM pianeti;` | superata: «near "SELEC": syntax error» |
| Manuale 5 — `DROP TABLE pianeti;`, ripristino, `SELECT` | **non eseguibile alla lettera**: con `PRAGMA foreign_keys = ON` SQLite respinge il `DROP` («FOREIGN KEY constraint failed»), perché `personaggi` rimanda a `pianeti`. È il comportamento corretto. Eseguita con `DROP TABLE personaggi; DROP TABLE pianeti;`: la `SELECT` dà «no such table: pianeti», dopo «Ripristina database» ridà le cinque righe. Superata in questa forma |
| Manuale 6 — ricarica su `#/star-wars/sandbox` | superata |
| Manuale 7 — passi 2–3 a 375 px | superata: `scrollWidth` del documento 375, la tabella dei risultati scorre dentro il suo riquadro |
| Manuale 8 — icone | superata: ogni sezione, i due pulsanti e il link di ritorno hanno la loro icona RB; nessun emoji o simbolo nei sorgenti (controllo con script sui caratteri Unicode di categoria `So`/`Sm`: solo due frecce `→` in commenti); ogni file di `src/assets/icons/` ha la sua riga nel «Registro icone» |
| Extra — `#/narnia/sandbox`, `#/star-wars`, `#/star-wars/er` | superata: pagina d’errore con link all’elenco; l’hash incompleto diventa `#/star-wars/sandbox`; segnaposto «Questa sezione è in preparazione.» |
| Extra — query ricorsiva senza fine nel browser | superata: dopo 5 s compare l’avviso «Query interrotta» |
| Console del browser | nessun errore |

Le verifiche manuali sono state fatte nel browser integrato dell’app, con `npm run dev`.

### Componenti comuni

| Percorso | Ruolo |
| --- | --- |
| `src/routing/route.ts`, `useHashRoute.ts` | Elenco `SECTIONS` (id, etichetta, icona), `parseRoute`, `formatRoute`, `canonicalHash`; hook che segue l’hash e rende canonici quelli incompleti |
| `src/pages/HomePage.tsx`, `ThemePage.tsx`, `NotFoundPage.tsx` | Elenco dei temi, guscio del tema (intestazione, navigazione, sezione corrente), pagina d’errore |
| `src/sandbox/session.ts` | `openSandbox(engine, source)`: database dello studente, `tables` letto dal database (`sqlite_schema` e `pragma_table_info`), `run` e `reset` con esito `result`, `sql-error`, `timeout`, `reset`. Senza React, provato in Node |
| `src/sandbox/useSandbox.ts` | Hook che apre e chiude la sandbox con il tema |
| `src/sandbox/SqlEditor.tsx` | Editor CodeMirror riusabile: `initialValue`, `tables` per il completamento, `onChange`, `onRun` (Ctrl/Cmd+Invio) |
| `src/sandbox/ResultsView.tsx` | Esiti: più insiemi di risultati, `NULL` come etichetta distinta dalla cella vuota, avviso di troncamento, errore di SQLite per intero, interruzione, ripristino |
| `src/sandbox/SchemaPanel.tsx` | Tabelle, colonne, tipi e chiavi primarie |
| `src/icons/registry.ts`, `Icon.tsx` | Icone comuni scoperte in `src/assets/icons/`; `<Icon name="…">` per le comuni, `<Icon svg={…}>` per quelle di un tema; senza `title` decorativa (`aria-hidden`), con `title` `role="img"` |
| `src/styles.css` | Stile neutro; colori, caratteri e raggio sono variabili su `:root`, punto d’aggancio per F08 |

La sandbox vive nel guscio del tema, non nella sezione: cambiando sezione la query e il database dello studente restano. `ThemePage` è montata con `key` uguale all’`id` del tema, così nulla passa da un tema all’altro.

### Scelta dell’editor

CodeMirror 6 (`codemirror` 6.0.2 e `@codemirror/lang-sql` 6.10.0, dialetto `SQLite`): evidenziazione, completamento di tabelle e colonne dallo schema letto dal database, Ctrl/Cmd+Invio, a capo automatico. Un `textarea` sarebbe stato più semplice ma senza evidenziazione né completamento.

### Icone e collaudo della skill `icone-rb`

Usate undici icone: `terminal-window` dal catalogo, dieci create con Opus 5.5 e approvate da Marco (registro nel `README.md` del piano). Commit nella libreria: `a210105` su `dev` di `~/Developer/github/icone`, non pubblicato. Le icone sono incorporate inline (vedi la decisione «Uso delle icone nel codice» nel piano).

Problemi trovati nel collaudo:

- **Catalogo quasi vuoto.** Dieci icone, nessuna di interfaccia (frecce, play, croce, avvisi, elenchi): dieci icone su undici sono state disegnate da zero. Aggiunta al catalogo la categoria `interfaccia`.
- **Ricerca per sottostringa.** `search.py er` restituisce `bug` (per «errore»): con termini brevi la ricerca dà rumore.
- **Copertura minima e icone a linea.** R1.6 chiede almeno il 30% di copertura: una freccia o una freccia circolare a linee da 64 sta sotto (23–25% misurati). Per «indietro» e «ripristina» ho chiuso le frecce in un cerchio (`circle-arrow-left`, `circle-arrow-rotate-left`). `STILE.md` non dice come trattare i soggetti a linea: va chiarito se la soglia vale anche per loro.
- **Nessuno strumento per i contorni.** La skill consiglia uno script di appoggio, ma non ce n’è uno condiviso: ho scritto in `icone/tmp/f03/` funzioni per poligoni arrotondati, capsule, fori in verso inverso. I primi errori del validatore (sovrapposizione dei livelli, aree) venivano da versi dei fori sbagliati. Un modulo comune in `tools/` eviterebbe di riscriverle a ogni fase.
- **Commit per icona.** Il piano dice «il commit di ciascuna»: ho fatto un solo commit per le dieci, perché catalogo e galleria cambiano insieme.
- **Icona respinta:** la prima versione di `entity-relationship` (entità sopra e sotto, rombo al centro) non convinceva Marco. Delle due varianti proposte ha scelto quella con le entità in alto, il rombo in basso e i connettori a gomito.

### Decisioni nuove

- Sezioni negli URL: `sandbox`, `addestramento`, `query`, `analisi`, `er`, `logico`. `#/<tema>` diventa `#/<tema>/sandbox`; una sezione sconosciuta dà la pagina d’errore.
- Pannello delle tabelle letto una volta, all’apertura, dal database iniziale: non segue le tabelle create o eliminate dallo studente.
- Le sezioni non ancora costruite mostrano «Questa sezione è in preparazione.».

### Lavoro residuo e segnalazioni

- **Passo 5 dei criteri di accettazione:** come scritto, fallisce per la chiave esterna. Con lo schema completo di F04 varrà lo stesso; nelle procedure delle prossime fasi conviene usare una tabella non referenziata o eliminare prima le tabelle che la richiamano.
- **Dimensione del pacchetto:** 671 kB per CodeMirror. Se pesa, F10 può caricare l’editor solo all’apertura di un tema (`import()` dinamico).
- Consumo reale: non misurato.
