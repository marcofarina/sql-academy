# F02 — Definire formato degli esercizi e verifica delle risposte

- **Modello / effort:** Fable 5.2 `medium` · ripiego Opus 5.5 `high`. La verifica decide che cosa il portale chiama «risposta corretta»: un errore qui si propaga a tutti gli esercizi di tutti i temi.
- **Dipendenze:** F01 (interfaccia del motore, contratto del tema).
- **Consumo stimato:** medio. Poco codice, molti casi limite da ragionare e provare.
- **Incertezza:** media. Cresce se i casi limite richiedono regole per esercizio oltre al solo confronto dei risultati.
- **Punto di ripresa:** funzione di verifica con i test superati, prima dello script `check:themes`.

## 1. Obiettivo e risultato atteso

Il formato di un esercizio, la funzione che confronta la query dello studente con la query attesa e uno script che controlla tutti gli esercizi di tutti i temi fuori dal browser.

## 2. Contesto minimo

- Passaggio di consegne di F01.
- `~/Developer/github/python-doesnt-byte/static/sql-runner/worker.js`: funzioni `lastResultSet`, `hasOrderBy`, `compareSets`, `verifyRun` (righe 368–570 al 2026-11-16).
- `~/Developer/github/jedi-academy/src/types.ts`: `SqlExercise` e `ValidationResult` del prototipo.

## 3. Perimetro

Dentro: tipi degli esercizi, verifica, messaggi di esito, script di controllo, due o tre esercizi di esempio nel tema segnaposto.

Fuori: interfaccia dell’addestramento (F05), conversione dei 121 esercizi (F04).

## 4. Attività di implementazione

1. Definisci il tipo `Exercise` nel contratto del tema: `id` stabile, capitolo del libro (`una-tabella`, `join`, `aggregazioni`, `sottoquery-viste`), difficoltà (`facile`, `medio`, `difficile`), parole chiave SQL, titolo, consegna, query attesa, suggerimenti, tabelle coinvolte. Scegli il formato del file (`.ts` o `.json`) e registralo nel `README.md` del piano.
2. Scrivi la verifica: la query attesa gira su una copia del database iniziale, mai su quello dello studente; l’ordine delle righe conta solo se la query attesa ha un `ORDER BY` esterno; decidi e documenta nel codice le regole per nomi delle colonne, ordine delle colonne, righe duplicate, `NULL`, numeri in virgola mobile.
3. Restituisci un esito che l’interfaccia possa spiegare allo studente: numero di righe diverso, colonne mancanti o in più, prima riga diversa, ordine sbagliato.
4. Scrivi `npm run check:themes`: in Node carica ogni tema, costruisce il database, esegue ogni query attesa e fallisce se una dà errore, se restituisce zero righe, se due esercizi hanno lo stesso `id`, se una tabella dichiarata non esiste.
5. Scrivi i test della verifica, uno per regola del punto 2, più: query dello studente con errore, query che modifica i dati, alias di colonna diversi, `SELECT *` contro elenco esplicito.

Sottoponi a Marco la regola sui nomi delle colonne (un alias diverso è un errore oppure no) prima di fissarla: cambia la severità di tutti gli esercizi.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm test` | Tutti i test superati |
| `npm run check:themes` | Esce con 0 sul tema segnaposto |
| `npm run check:themes` dopo aver rotto a mano una query attesa | Esce con codice diverso da 0 e nomina l’esercizio; ripristina poi il file |
| `npm run build` e `npm run lint` | Nessun errore |

## 6. Passaggio di consegne

Da compilare alla chiusura: esito, verifiche, regole di confronto fissate (tabella), formato del file degli esercizi, modello effettivamente usato, decisioni nuove, lavoro residuo, consumo reale se noto.
