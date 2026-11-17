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

Da compilare alla chiusura: esito, verifiche, componenti comuni creati e loro percorsi, scelta dell’editor, icone usate e problemi incontrati con la skill, decisioni nuove, lavoro residuo, consumo reale se noto.
