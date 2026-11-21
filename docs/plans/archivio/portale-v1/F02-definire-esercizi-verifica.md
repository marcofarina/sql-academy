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

**Esito:** completata il 2026-11-16 21:36 su Fable 5.2 (nessun ripiego). Effort non verificabile dalla sessione.

### Verifiche

| Verifica | Esito |
| --- | --- |
| `npm test` | superata: 62 test in quattro file (18 di F01, 28 sul confronto, 16 su verifica e controllo) |
| `npm run check:themes` | superata: esce con 0, «star-wars: 3 esercizi, 0 problemi» |
| `npm run check:themes` con `FROM pianeti` cambiato in `FORM pianeti` in `themes/star-wars/esercizi.ts` | superata: esce con 1 e nomina `star-wars/pianeti-temperati` e `star-wars/personaggi-per-pianeta`; file ripristinato e controllo di nuovo a 0 |
| `npm run build` | superata; gli esercizi sono un modulo separato (`dist/assets/esercizi-<hash>.js`) |
| `npm run lint` | superata |

Nessuna verifica fallita o non eseguita.

### Regole di confronto

Documentate in testa a `src/exercises/compare.ts`, con un test per regola in `compare.test.ts`. Le prime due le ha decise Marco in questa fase.

| Aspetto | Regola |
| --- | --- |
| Nomi delle colonne | Non contano: `COUNT(*)` e `COUNT(*) AS totale` sono la stessa colonna |
| Ordine delle colonne | Non conta: si cerca una corrispondenza fra le colonne che renda uguali le righe; `SELECT *` vale quanto l’elenco delle stesse colonne |
| Numero di colonne | Conta |
| Ordine delle righe | Conta solo se l’ultima istruzione della query attesa ha un `ORDER BY` fuori da ogni parentesi (`hasOuterOrderBy`); quelli di sottoquery, CTE e funzioni finestra non contano |
| Righe duplicate | Contano: ogni riga deve comparire lo stesso numero di volte |
| `NULL` | Uguale solo a `NULL`; diverso da `0` e da `''` |
| Numeri | Confronto a 12 cifre significative; `3` e `3.0` coincidono, `3` e `'3'` no |
| Testo | Confronto esatto, maiuscole e spazi compresi |
| Script di più istruzioni | Conta l’ultimo risultato, per lo studente e per la query attesa |

### Formato degli esercizi

`themes/<id>/esercizi.ts`, facoltativo, esporta come `default` un `Exercise[]` (tipo in `src/themes/contract.ts`): `id`, `chapter`, `difficulty`, `keywords`, `title`, `prompt` (la consegna), `expectedQuery`, `hints`, `tables`. Il campo `checkOrder` del prototipo non esiste: l’ordine si ricava dall’`ORDER BY` della query attesa. L’`id` segue la stessa forma dell’`id` di un tema (minuscole, cifre, trattini): gli `ex-001` del prototipo sono validi.

Il registro espone `theme.loadExercises()`, che carica il file a richiesta e dà un elenco vuoto se manca.

### Interfaccia della verifica

```ts
// src/exercises/verify.ts
verifyAnswer(engine, source, expectedQuery, studentSql): Promise<{ verdict: Verdict; student: ResultSet | null }>
describeVerdict(verdict): string   // il messaggio per lo studente
```

- `Verdict` ha un `kind`: `correct`, `error` (messaggio di SQLite), `timeout`, `no-result`, `columns` (numeri, più `missing` ed `extra` per nome), `rows` (numeri), `values` (prima riga dello studente assente dal risultato atteso), `order` (prima riga fuori posto).
- Le due query girano su una copia del database iniziale aperta e chiusa da `verifyAnswer`: il database su cui lo studente fa le prove non viene toccato né letto. Una risposta che modifica i dati viene giudicata sul suo ultimo risultato e non lascia tracce.
- Un esercizio sbagliato (query attesa che dà errore, non restituisce un risultato o supera le 10 000 righe) fa rifiutare `verifyAnswer` con `ExerciseError`: `check:themes` serve a non arrivarci.
- `student` contiene fino a 10 000 righe: F05 mostri solo le prime.

### Controllo dei temi

`npm run check:themes` (`scripts/check-themes.ts`, logica in `src/exercises/check.ts`) gira in Node senza Vite e legge le cartelle di `themes/`. Segnala, nominando `tema/esercizio`: query attesa con errore, senza risultato, con zero righe o che modifica i dati; `id` duplicato o non valido; tabella dichiarata inesistente; capitolo o difficoltà non previsti; titolo, consegna, parole chiave, suggerimenti o tabelle mancanti.

### Decisioni nuove

- **Formato `.ts`** per gli esercizi (registrato nelle «Decisioni condivise»).
- **Corrispondenza fra colonne per ricerca con potatura**, non per permutazioni come nel libro: funziona con qualunque numero di colonne (provata con 12).
- **Messaggio sulle colonne:** i nomi delle colonne in più o mancanti si citano solo quando tutti gli altri nomi coincidono; altrimenti il messaggio dà solo i numeri, perché un alias diverso non è un errore.
- I messaggi di esito sono stati scritti secondo `.claude/norms/scrittura-didattica.md` e ripassati con le domande finali di `scrittura-umana.md`.

### Limiti e lavoro residuo

- **Parità nell’ordinamento.** Se l’`ORDER BY` atteso lascia righe a pari merito, una risposta giusta può risultare «in ordine diverso». `check:themes` non lo rileva: F04, nel portare i 121 esercizi, deve dare a ogni query ordinata un ordinamento completo (un secondo criterio) e chiedere l’ordinamento nella consegna.
- **Esercizi che creano oggetti** (`CREATE VIEW`): la verifica confronta solo l’ultimo risultato, non lo stato del database. Se F04 ne trova nel capitolo `sottoquery-viste`, la query attesa deve finire con una `SELECT` e la consegna deve dirlo; una regola dedicata sarebbe un ampliamento da concordare con Marco.
- I tre esercizi di `themes/star-wars/esercizi.ts` sono segnaposto: F04 li sostituisce, F07 ne rivede i testi insieme ai messaggi di esito.

### Consumo reale

Non noto.
