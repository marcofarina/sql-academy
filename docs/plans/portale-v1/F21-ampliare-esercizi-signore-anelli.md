# F21 — Portare gli esercizi del Signore degli Anelli a circa cento

- **Modello / effort:** Opus 5.5 `medium` (scelta di Marco, 2026-11-18). Testi per gli studenti e giudizio sul risultato di ogni query.
- **Dipendenze:** F09. Se F19 è già chiusa, le consegne rimandano alla «Traccia».
- **Consumo stimato:** alto. Circa 80 esercizi nuovi, ciascuno con consegna, suggerimenti e query eseguita e controllata.
- **Incertezza:** media. Cresce se il database non basta a esercizi vari sui quattro capitoli e serve aggiungere dati.
- **Punto di ripresa:** esercizi di un capitolo completati e `npm run check:themes` verde; ogni capitolo è un blocco a sé.

Questa fase si esegue solo in locale: scrive testi per gli studenti e ha bisogno di `.claude/norms/`.

## 1. Obiettivo e risultato atteso

`themes/lotr/esercizi.ts` passa da 20 a circa 100 esercizi, come Star Wars (105), distribuiti sui quattro capitoli e sui tre livelli, senza ripetere gli esercizi esistenti.

## 2. Contesto minimo

- `themes/lotr/esercizi.ts`: i 20 esercizi di F09, con la regola sul capitolo in testa al file. Gli identificativi esistenti (`ex-001`–`ex-020`) non cambiano: i nuovi proseguono da `ex-021`.
- `themes/lotr/schema.sql`, `dati.sql`, `analisi.md` (o `traccia.md` dopo F19).
- `Exercise` in `src/themes/contract.ts`: regole del confronto delle risposte, in particolare sugli `ORDER BY`.
- `themes/star-wars/esercizi.ts`: distribuzione per capitolo, difficoltà e parole chiave da usare come riferimento, non da copiare.
- `.claude/norms/scrittura-didattica.md` e `.claude/norms/scrittura-umana.md`.

## 3. Perimetro

Dentro: esercizi nuovi; dati aggiuntivi in `dati.sql` solo se servono a un esercizio e sono coerenti con l’opera (in quel caso ricontrolla i risultati degli esercizi esistenti).

Fuori: schema del database, esercizi di Star Wars, codice comune.

## 4. Attività di implementazione

1. Proponi a Marco la distribuzione: numero di esercizi per capitolo e per difficoltà, parole chiave da coprire (per esempio `LIKE`, `DISTINCT`, `IN`, `CASE`, `EXISTS`, `UNION`, funzioni di data e di testo se i dati lo permettono). Attendi l’approvazione.
2. Scrivi gli esercizi un capitolo alla volta. Esegui ogni query attesa su SQLite e controlla che il risultato sia quello chiesto, con almeno una riga. Usa uno script nella cartella temporanea della sessione per eseguire tutte le query di un capitolo in una volta.
3. Dopo ogni capitolo esegui `npm run check:themes` e committa come commit intermedio dichiarato.
4. Applica la passata finale di `scrittura-umana.md` a consegne e suggerimenti.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm run check:themes` | Exit 0; `lotr` con circa 100 esercizi |
| `npm test`, `npm run lint`, `npm run build` | Exit 0 |
| `git diff --stat <hash di partenza> HEAD -- . ':!themes/lotr' ':!docs'` | Nessuna riga, salvo la riga di stato in `AGENTS.md` |

Procedura manuale con `npm run dev`: la locandina di LOTR riporta il nuovo numero di esercizi; nel catalogo i filtri per capitolo e difficoltà restituiscono la distribuzione approvata; tre esercizi a caso, uno per difficoltà, si risolvono con la query attesa.

## 6. Passaggio di consegne

Da compilare alla chiusura: esito, verifiche, distribuzione finale, dati aggiunti, osservazioni di Marco, lavoro residuo, consumo reale se noto.
