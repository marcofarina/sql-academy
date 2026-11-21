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

**Esito:** completata il 2026-11-17 15:10 su Opus 5.5, il modello richiesto. Effort non verificabile dalla sessione. Fase non divisa: sessioni e catalogo sono entrati qui.

### Verifiche

| Verifica | Esito |
| --- | --- |
| `npm test` | superata: 98 test in dieci file (17 nuovi: routing, progressi, generatore di sessioni, percorso, catalogo, aiuti) |
| `npm run build` | superata; resta l’avviso di Vite sul pacchetto principale (702 kB, 224 kB compressi), quasi tutto CodeMirror, già noto da F03 |
| `npm run lint` | superata |
| `npm run check:themes` | superata: esce con 0, «star-wars: 105 esercizi, 0 problemi» |
| Manuale 1 — `ex-001`, query attesa, «Verifica» | superata: «Esercizio risolto», marcato «Risolto» |
| Manuale 2 — una colonna in meno | superata: «Il risultato ha 5 colonne: ne servono 6. Manca: settore_galattico.» |
| Manuale 3 — ricarica | superata: esercizio ancora risolto, ultima query nell’editor |
| Manuale 4 — sessione di cinque facili fino al riepilogo | superata: il riepilogo compare con esito, verifiche, suggerimenti e soluzione per esercizio. Tre esercizi risolti su cinque: in due ho sbagliato io la digitazione (testo accodato, apice non chiuso), e il riepilogo li riporta come non risolti, che è il comportamento giusto |
| Manuale 5 — «Tutte le query», filtro `JOIN` | superata: 33 esercizi su 105, tutti con `JOIN`; 33 anche contando con Node sul file del tema. Una voce apre l’esercizio |
| Manuale 6 — azzeramento | superata: conferma, poi «Risolti 0 su 105 esercizi»; nell’archivio resta `{"version":1,"exercises":{}}` |
| Manuale 7 — archiviazione bloccata | superata **in emulazione**: il pannello del browser non apre finestre private. Ho reso `localStorage` inaccessibile (lettura che solleva `SecurityError`), rimontato il tema e ripetuto il passo 1: esercizio risolto, nessun errore in console. Da ripetere in una vera finestra privata, se Marco vuole |
| Extra — suggerimenti e soluzione | superata: un suggerimento alla volta; su un esercizio non risolto «Mostra la soluzione» compare solo dopo l’ultimo |
| Extra — 375 px | superata: `scrollWidth` 375 su percorso, esercizio, sessione e catalogo; le tabelle scorrono nel loro riquadro |
| Extra — simboli Unicode come icone nei sorgenti nuovi | superata: nessuno |

Le verifiche manuali sono state fatte nel browser integrato dell’app, con `npm run dev`.

### Dati salvati in `localStorage`

Chiave `sql-academy:<tema>:v1`, un valore per tema. Forma documentata in testa a `src/progress/progress.ts`:

```json
{
  "version": 1,
  "exercises": {
    "ex-001": { "solved": true, "attempts": 2, "hintsRevealed": 1, "solutionSeen": false, "lastQuery": "SELECT * FROM pianeti" }
  }
}
```

Nessun dato personale. `attempts` conta le pressioni di «Verifica». `lastQuery` è troncata a 20 000 caratteri. JSON rotto, versione diversa o valori estranei danno progressi vuoti; le voci malformate si scartano una per una. Ogni accesso è in `try/catch`: senza archivio i progressi vivono solo nella pagina.

### Soluzione mostrata

Marco ha indicato una direzione diversa: un **sistema a punti**. Si guadagnano risolvendo, di più per gli esercizi difficili, e si spendono per suggerimenti e soluzione. Va progettato con un brainstorming e fasi dedicate del piano. Per non bloccare F05 ha approvato una regola provvisoria: suggerimenti liberi, uno alla volta; soluzione dopo l’ultimo suggerimento o a esercizio risolto. La regola sta tutta in `canRevealHint` e `canRevealSolution` (`src/training/exercises.ts`). I progressi salvano già suggerimenti aperti e soluzioni viste, così i punti si potranno calcolare anche sul pregresso.

### Componenti

| Percorso | Ruolo |
| --- | --- |
| `src/progress/progress.ts`, `useProgress.ts` | Modello, lettura e scrittura difensive, hook per tema |
| `src/training/exercises.ts` | Capitoli del libro (6–9, titoli dall’`intro.mdx` del volume), percorso, filtri del catalogo, regola degli aiuti, formattazione della soluzione |
| `src/training/session.ts` | Generatore di sessioni: 5, 10 o 20; difficoltà singola o bilanciata (a turno per difficoltà); capitoli; parole chiave «da allenare»; nessuna ripetizione; con pochi esercizi la sessione è più corta e non pesca fuori dai filtri |
| `src/training/useTraining.ts` | Esercizi, sorgente del database e un database dell’addestramento separato dalla sandbox |
| `src/training/ExerciseWorkspace.tsx` | Consegna, tabelle coinvolte, editor, «Esegui», «Verifica» con esito e risultato dello studente (prime 200 righe), suggerimenti, soluzione |
| `src/training/PathView.tsx`, `SessionView.tsx`, `TrainingSection.tsx` | Percorso, sessione (configurazione, esercizi, riepilogo), scelta della vista secondo l’indirizzo |
| `src/training/CatalogSection.tsx` | «Tutte le query»: ricerca senza accenti in id, titolo e consegna; filtri per capitolo, difficoltà, parola chiave, tabella |

### Decisioni nuove

- **Parole chiave nelle sessioni** (Marco): entra un esercizio che ne usa almeno una delle scelte.
- **Indirizzi** (Claude): `#/<tema>/addestramento/<id>` e `#/<tema>/addestramento/sessione`; `check:themes` respinge un esercizio con `id` `sessione`. Le altre sezioni non accettano elementi in più.
- **«Esegui» nell’addestramento** (Claude) gira su un database proprio, ripristinato prima di ogni esecuzione: il risultato è quello che vedrà la verifica, e le prove della sandbox non lo alterano.
- **Sessione in memoria** (Claude): vive con il tema, passa da una sezione all’altra, si perde ricaricando la pagina; i progressi restano. Una sessione si può interrompere e chiudere con il riepilogo; «Salta» porta al prossimo esercizio.
- **Ordine del percorso**: capitolo del libro, poi difficoltà, poi ordine del file del tema. Un esercizio aperto dal percorso o dal catalogo offre «Prossimo nel percorso».

### Icone e collaudo della skill `icone-rb`

Usate nove icone: `key` dal catalogo e otto create con Opus 5.5 e approvate da Marco (registro nel `README.md` del piano). Commit nella libreria: `fac6d77` su `dev` di `~/Developer/github/icone`, non pubblicato. Script di appoggio in `icone/tmp/f05/`.

Problemi trovati nel collaudo:

- **Catalogo ancora povero per le interfacce**: venti icone, nessuna fra spunta, lampadina, lente, cestino, bandiera; trovata solo `key`.
- **Ambiente Python**: con il `venv` di `icone/tmp/venv` attivo, `validate.py` e `build_gallery.py` falliscono perché manca `pyyaml`; funzionano con il Python di sistema. La skill non dice quale interprete usare.
- **Verso dei contorni con gli archi**: lo script di F03 calcola il verso di un contorno solo dai punti estremi, e per un cerchio (due archi) l’area risulta zero; nella prima lente il manico bucava la montatura. Il validatore non l’aveva segnalato come errore: l’ho visto nel render. Conferma che serve un modulo comune in `tools/` per contorni, tratti spessi e unioni.
- **Unione di forme che si incrociano**: il filamento a riccioli (un tratto che si incrocia) richiede il contorno dell’unione, perché i livelli non possono sovrapporsi e con la regola *nonzero* due fori sovrapposti si riempiono. Senza una libreria geometrica l’ho calcolato a mano con anelli tangenti. È il punto più costoso del disegno.
- **YAML del catalogo**: una nota con «: » rompe il file senza virgolette; il validatore segnala anche le parole chiave duplicate (corretto).
- **Lampadina, quattro varianti**: Marco ha approvato la versione senza filamento, poi ha chiesto di provarne uno. «M» (si leggeva come una lettera), arco ∩, pallini pieni: nessuna era ciò che intendeva. Ha mandato uno schizzo, due reofori con un ricciolo ciascuno verso l’esterno, e quella versione è stata approvata.

### Limiti e lavoro residuo

- **Sistema a punti**: brainstorming e nuove fasi del piano, in una sessione a parte. Toccherà `canRevealHint`, `canRevealSolution`, la forma dei progressi (versione 2 con lettura della versione 1) e il riepilogo.
- **Testi dell’interfaccia** di F05 (consegne escluse): scritti da me, non ancora passati dalle norme di scrittura; F07 li può rivedere insieme ai messaggi di esito.
- **Finestra privata vera** per il passo 7: non eseguita, solo emulata.
- Il passo 4 non ha risolto tutti e cinque gli esercizi per errori di digitazione miei, non del portale.

### Consumo reale

Non noto.
