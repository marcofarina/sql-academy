# F22 — Portare gli esercizi di Star Wars a circa 150

- **Modello / effort:** Opus 5.5 `medium`. Testi per gli studenti e giudizio sul risultato di ogni query, come F21.
- **Dipendenze:** F07. Se F19 è già chiusa, le consegne rimandano alla «Traccia».
- **Consumo stimato:** alto. Circa 45 esercizi nuovi, ciascuno con consegna, suggerimenti e query eseguita e controllata.
- **Incertezza:** media. Cresce se per le sottoquery facili servono dati nuovi.
- **Punto di ripresa:** esercizi di un capitolo completati e `npm run check:themes` verde; ogni capitolo è un blocco a sé.

Questa fase si esegue solo in locale: scrive testi per gli studenti e ha bisogno di `.claude/norms/`.

## 1. Obiettivo e risultato atteso

`themes/star-wars/esercizi.ts` passa da 105 a **circa 150 esercizi** (obiettivo di Marco, 2026-11-18: circa 150 esercizi distinti per tema) e diventa più equilibrato.

Distribuzione attuale, contata il 2026-11-18:

| Capitolo | Facile | Medio | Difficile | Totale |
| --- | --- | --- | --- | --- |
| Una tabella | 35 | 4 | 1 | 40 |
| Join | 0 | 14 | 11 | 25 |
| Aggregazioni | 0 | 22 | 8 | 30 |
| Sottoquery | 0 | 0 | 10 | 10 |

Lacune da colmare: le sottoquery (solo 10, tutte difficili); gli esercizi facili di join, aggregazioni e sottoquery, che oggi non esistono; gli esercizi medi e difficili su una tabella; il `LEFT JOIN`, usato in 2 esercizi.

## 2. Contesto minimo

- `themes/star-wars/esercizi.ts`: la regola sul capitolo in testa al file. Gli identificativi esistenti (`ex-001`–`ex-105`) non cambiano: i nuovi proseguono da `ex-106`.
- `themes/star-wars/schema.sql`, `dati.sql`, `analisi.md` (o `traccia.md` dopo F19).
- `Exercise` in `src/themes/contract.ts`: regole del confronto delle risposte, in particolare sugli `ORDER BY`.
- `themes/lotr/esercizi.ts`: esempio recente di consegne e suggerimenti scritti con le norme.
- `.claude/norms/scrittura-didattica.md` e `.claude/norms/scrittura-umana.md`.

## 3. Perimetro

Dentro: esercizi nuovi; righe nuove in `dati.sql` solo se servono a un esercizio e sono coerenti con l’opera (in quel caso ricontrolla i risultati degli esercizi esistenti).

Fuori: schema del database, esercizi esistenti (salvo un’incongruenza da segnalare a Marco), esercizi di LOTR, codice comune.

## 4. Attività di implementazione

1. Proponi a Marco la distribuzione dei circa 45 esercizi nuovi per capitolo e difficoltà, partendo dalle lacune elencate sopra, e le parole chiave da coprire (per esempio `LEFT JOIN`, `IN`, `NOT IN`, `EXISTS`, `CASE`, sottoquery nel `FROM`). Attendi l’approvazione.
2. Scrivi gli esercizi un capitolo alla volta, senza ripetere un esercizio esistente con un’altra colonna. Esegui ogni query attesa su SQLite e controlla che il risultato sia quello chiesto, con almeno una riga; usa uno script nella cartella temporanea della sessione.
3. Dopo ogni capitolo esegui `npm run check:themes` e committa come commit intermedio dichiarato.
4. Applica la passata finale di `scrittura-umana.md` a consegne e suggerimenti.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm run check:themes` | Exit 0; `star-wars` con circa 150 esercizi |
| `npm test`, `npm run lint`, `npm run build` | Exit 0 |
| `git diff --stat <hash di partenza> HEAD -- . ':!themes/star-wars' ':!docs'` | Nessuna riga, salvo la riga di stato in `AGENTS.md` |

Procedura manuale con `npm run dev`: la locandina di Star Wars riporta il nuovo numero di esercizi; nel percorso dell’addestramento ogni capitolo ha esercizi dei tre livelli; tre esercizi nuovi a caso, uno per difficoltà, si risolvono con la query attesa.

## 6. Passaggio di consegne

**Esito:** completata il 2026-11-18 su Opus 5.5 (effort non verificabile dalla sessione), in una sessione. Commit intermedi: `7ef5d84` (una tabella), `bb05687` (join), `0941b69` (aggregazioni), `b199619` (sottoquery, con la passata finale sui testi); documenti nel commit di chiusura.

**Decisione di Marco (2026-11-18):** approvata la distribuzione proposta, 45 esercizi nuovi (`ex-106`–`ex-150`) e nessun dato nuovo.

**Distribuzione finale:**

| Capitolo | Facili | Medi | Difficili | Totale |
| --- | --- | --- | --- | --- |
| Una tabella | 35 | 10 | 5 | 50 |
| Join | 6 | 16 | 13 | 35 |
| Aggregazioni | 6 | 22 | 11 | 39 |
| Sottoquery | 6 | 8 | 12 | 26 |
| Totale | 53 | 56 | 41 | 150 |

Parole chiave nuove nel tema: `IN` e `NOT LIKE` su una tabella, `IS NULL`/`IS NOT NULL` (anche il `NULL` che `ORDER BY … ASC` mette in cima), calcoli nella `SELECT`, `ORDER BY` su due chiavi, `LIMIT … OFFSET`, `CASE` (anche dentro `SUM`), parentesi fra `AND` e `OR`, join sul leader, `LEFT JOIN` e `LEFT JOIN … IS NULL`, la stessa tabella con due alias, `COUNT(DISTINCT …)` e `COUNT(colonna)`, due `LEFT JOIN` in catena con `COUNT`, `HAVING` con join e con una sottoquery, `EXISTS`/`NOT EXISTS`, sottoquery annidate, correlate e nel `FROM`, `WITH`, `UNION`. Come in LOTR, `WITH` e `UNION` stanno nel capitolo delle sottoquery, e il commento in testa a `esercizi.ts` lo dice.

**Dati aggiunti:** nessuno. Bastavano i `NULL` già presenti (Mon Mothma e Greef Karga senza pianeta, Greef Karga senza anno di nascita), le specie e le fazioni senza personaggi o senza navi, e Palpatine leader dell’Ordine Sith ma membro dell’Impero.

**Come sono stati scritti:** uno script con `sql.js` nella cartella temporanea della sessione eseguiva le query attese di un capitolo su `schema.sql` + `dati.sql` e ne stampava i risultati; ogni risultato è stato letto contro la consegna, e tutti hanno almeno una riga. Due affermazioni dei suggerimenti sono state controllate con `sqlite3`: `AVG(COUNT(*))` dà errore (ex-143); una colonna senza aggregazione accanto a `MAX` è accettata da SQLite e restituisce la riga del massimo, quindi il primo suggerimento di ex-150 è stato corretto per dirlo. Passata finale di `scrittura-umana.md`: una domanda retorica tolta (ex-115), un «cita il pianeti» riscritto (ex-141), una consegna con due «con» di fila (ex-144) e un suggerimento impreciso sul conteggio (ex-134).

**Verifiche:**

| Verifica | Esito |
| --- | --- |
| `npm run check:themes` | superata: exit 0, `star-wars` 150 esercizi, 0 problemi; `lotr` invariato |
| `npm test`, `npm run lint`, `npm run build` | superate: exit 0, 127 test (resta l’avviso già noto sui blocchi oltre 500 kB) |
| `git diff --stat d22b468 HEAD -- . ':!themes/star-wars' ':!docs'` | superata: solo `AGENTS.md`, con la riga di stato |
| Procedura manuale, `npm run dev` | superata nel pannello del browser: la locandina dice «in 150 esercizi»; nel percorso i quattro capitoli hanno esercizi facili, medi e difficili (50 / 35 / 39 / 26); risolti `ex-117` (facile, con alias e colonne in altro ordine), `ex-142` (medio, con `NOT IN` al posto di `NOT EXISTS`) e `ex-150` (difficile, con la query attesa) |

**Osservazioni di Marco:** l’approvazione della distribuzione; i testi non li ha ancora letti.

**Lavoro residuo:** nessuno nella fase. Marco può rileggere consegne e suggerimenti di `ex-106`–`ex-150`.
