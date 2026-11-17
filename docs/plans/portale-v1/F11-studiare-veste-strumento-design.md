# F11 — Studiare la veste grafica con lo strumento di design

- **Modello / effort:** Opus 5.5 `medium`. Si decide la forma visiva del portale e di un tema: serve giudizio, non esecuzione.
- **Dipendenze:** F03 (componenti reali da vestire). Precede F08, che ne traduce le scelte in codice. Aggiunta il 2026-11-17 su richiesta di Marco; l’ID non indica l’ordine.
- **Consumo stimato:** medio. Pesano le iterazioni con Marco sulle tavole.
- **Incertezza:** media. Dipende da quante proposte servono prima dell’approvazione.
- **Punto di ripresa:** tavole della veste neutra approvate, prima di quelle Star Wars.

## 1. Obiettivo e risultato atteso

Prima di scrivere CSS, Marco vede e approva l’aspetto del portale su tavole disegnate con lo strumento di design di Claude. Al termine esistono:

- un Artifact di tipo «Design» con le tavole approvate;
- una specifica in `docs/design/veste.md` che F08 applica senza dover reinventare le scelte.

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
7. Scrivi `docs/design/veste.md`: link all’Artifact, variabili con i valori (colori, caratteri, raggi, bordi) per la veste neutra e per Star Wars, decorazioni, elenco delle icone tematiche da creare con il loro significato, contrasti misurati.

## 5. Criteri di accettazione

| Verifica | Risultato atteso |
| --- | --- |
| Approvazione di Marco | Tavole della veste neutra e della veste Star Wars approvate, in chat |
| `docs/design/veste.md` | Esiste; ogni colore e carattere usato nelle tavole vi compare con il suo valore |
| Script di contrasto | Ogni coppia testo/fondo almeno 4,5:1; valori riportati nella specifica |
| Caratteri | Ognuno con licenza libera verificata alla fonte e URL |
| `npm test`, `npm run lint` | Nessun errore (la fase non tocca il codice; controllo di non regressione) |

## 6. Passaggio di consegne

Da compilare alla chiusura: esito, link all’Artifact, direzioni scartate e perché, verifiche, decisioni nuove (anche sul contratto del tema, se le tavole lo richiedono), lavoro residuo per F08, consumo reale se noto.
