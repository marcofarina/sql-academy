# F05 — Costruire addestramento, catalogo delle query e progressi

- **Modello / effort:** Opus 5.5 `medium`. Più viste collegate da uno stato condiviso, con scelte di interazione.
- **Dipendenze:** F02 (verifica), F03 (editor, tabella dei risultati, guscio), F04 (esercizi veri su cui provare).
- **Consumo stimato:** alto. È la fase con più interfaccia.
- **Incertezza:** media. Se supera il previsto, dividi: percorso e progressi in questa fase, sessioni configurabili in una fase nuova (F11), senza rinumerare.
- **Punto di ripresa:** un esercizio singolo risolvibile dal percorso, con esito e suggerimenti, prima di sessioni e catalogo.

## 1. Obiettivo e risultato atteso

Le sezioni «Addestramento» e «Tutte le query» funzionano per qualunque tema; i progressi sopravvivono alla chiusura del browser.

## 2. Contesto minimo

- Passaggi di consegne di F02, F03, F04.
- Icone: leggi la sezione «Icone» del `README.md` del piano e segui la skill `icone-rb` per ogni icona (catalogo RB Icons, poi creazione se manca). Riusa quelle di F03; servono in più, per esempio: risolto, da fare, suggerimento, soluzione, sessione, filtro, riepilogo.
- `~/Developer/github/jedi-academy/src/services/sessionGenerator.ts` e i componenti `ExerciseWorkspace.tsx`, `SessionConfigModal.tsx`, `SessionSummaryModal.tsx`, `BankCatalogView.tsx`, `HintsModal.tsx`: come riferimento di comportamento.

## 3. Perimetro

Dentro: percorso, spazio di lavoro dell’esercizio, sessioni, riepilogo, catalogo, progressi.

Fuori: stile del tema (F08), revisione dei testi (F07), esportazione dei progressi e qualunque sincronizzazione.

## 4. Attività di implementazione

1. **Percorso:** esercizi raggruppati per capitolo del libro e ordinati per difficoltà, con stato risolto o da fare e avanzamento per capitolo.
2. **Spazio di lavoro:** consegna, tabelle coinvolte, editor, «Esegui» (mostra il risultato) distinto da «Verifica» (confronta con l’atteso), esito spiegato con i dati di F02, suggerimenti rivelati uno alla volta. Decidi con Marco se e quando mostrare la soluzione.
3. **Sessioni:** lunghezza 5, 10 o 20; difficoltà singola o bilanciata; filtro per capitolo e parole chiave; estrazione senza ripetizioni; riepilogo finale con tentativi e suggerimenti usati.
4. **Tutte le query:** elenco completo degli esercizi del tema con ricerca e filtri per capitolo, difficoltà, parola chiave e tabella; da ogni voce si apre l’esercizio.
5. **Progressi:** `localStorage`, chiave `sql-academy:<tema>:v1`; esercizi risolti, ultima query scritta per esercizio; pulsante di azzeramento per tema. Ogni lettura e scrittura in `try/catch`: senza `localStorage` il portale funziona lo stesso. Nessun identificativo dello studente, nessuna data di nascita, nessun nome.
6. **Icone:** prima dei componenti, come nella sezione «Icone» del piano; copia le nuove in `src/assets/icons/`.
7. Test: generatore di sessioni (lunghezza, assenza di ripetizioni, filtri che non trovano abbastanza esercizi), lettura di progressi corrotti o di una versione precedente.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm test`, `npm run build`, `npm run lint` | Nessun errore |
| `npm run check:themes` | Esce con 0 |

Procedura manuale con `npm run dev`, tema Star Wars:

1. Dal percorso apri il primo esercizio, incolla la query attesa, «Verifica»: esito corretto, l’esercizio risulta risolto.
2. Scrivi una query con una colonna in meno: l’esito nomina la colonna mancante.
3. Ricarica la pagina: l’esercizio è ancora risolto e l’ultima query è nell’editor.
4. Avvia una sessione da cinque esercizi facili, completala: compare il riepilogo.
5. In «Tutte le query» filtra per `JOIN`: restano solo esercizi con quella parola chiave.
6. Azzera i progressi: il percorso torna a zero.
7. In una finestra privata con l’archiviazione bloccata, ripeti il passo 1: nessun errore in console.

## 6. Passaggio di consegne

Da compilare alla chiusura: esito, verifiche, forma dei dati salvati in `localStorage`, scelta sulla soluzione mostrata, decisioni nuove, lavoro residuo, consumo reale se noto.
