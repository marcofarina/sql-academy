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

Da compilare alla chiusura: esito, verifiche, distribuzione finale, dati aggiunti, osservazioni di Marco, lavoro residuo, consumo reale se noto.
