# F21 — Arricchire i dati del Signore degli Anelli e portarne gli esercizi a circa 150

- **Modello / effort:** Opus 5.5 `medium` (scelta di Marco, 2026-11-18). Testi per gli studenti e giudizio sul risultato di ogni query.
- **Dipendenze:** F09. Se F19 è già chiusa, le consegne rimandano alla «Traccia».
- **Consumo stimato:** alto. Colonne nuove nel database e 100–130 esercizi nuovi, ciascuno con consegna, suggerimenti e query eseguita e controllata. Probabilmente più di una sessione: si riprende dal capitolo in corso.
- **Incertezza:** media. Cresce se le colonne numeriche nuove non si possono ricavare dall’opera e vanno stimate.
- **Punto di ripresa:** dati arricchiti e approvati da Marco, con i 20 esercizi esistenti ancora verdi; poi ogni capitolo completato è un blocco a sé.

Questa fase si esegue solo in locale: scrive testi per gli studenti e ha bisogno di `.claude/norms/`.

## 1. Obiettivo e risultato atteso

`themes/lotr/esercizi.ts` passa da 20 a **120–150 esercizi**, distribuiti sui quattro capitoli e sui tre livelli, senza ripetere gli esercizi esistenti.

Obiettivo fissato da Marco il 2026-11-18: circa 150 esercizi distinti per tema, cioè circa 600 nel portale con quattro temi. Oltre questa soglia, con sette tabelle, gli esercizi diventano varianti l’uno dell’altro. Il database di LOTR ha poche colonne numeriche (anni, ordine delle tappe, `immortale`) e non regge aggregazioni varie: prima degli esercizi si arricchiscono i dati. Se le colonne nuove non bastano a esercizi distinti, la fase si ferma intorno a 120 e lo dichiara.

## 2. Contesto minimo

- `themes/lotr/esercizi.ts`: i 20 esercizi di F09, con la regola sul capitolo in testa al file. Gli identificativi esistenti (`ex-001`–`ex-020`) non cambiano: i nuovi proseguono da `ex-021`.
- `themes/lotr/schema.sql`, `dati.sql`, `analisi.md` (o `traccia.md` dopo F19).
- `Exercise` in `src/themes/contract.ts`: regole del confronto delle risposte, in particolare sugli `ORDER BY`.
- `themes/star-wars/esercizi.ts`: distribuzione per capitolo, difficoltà e parole chiave da usare come riferimento, non da copiare.
- `.claude/norms/scrittura-didattica.md` e `.claude/norms/scrittura-umana.md`.

## 3. Perimetro

Dentro: colonne numeriche nuove in `schema.sql` e `dati.sql`, con l’aggiornamento di `er.ts` e della traccia del dominio (`analisi.md`, o `traccia.md` dopo F19); righe nuove dove servono; esercizi nuovi.

Fuori: tabelle nuove, salvo approvazione di Marco; esercizi di Star Wars (F22); codice comune.

## 4. Attività di implementazione

1. Proponi a Marco le colonne numeriche da aggiungere, con la fonte di ogni valore: ricavato dall’opera (per esempio l’altezza dei personaggi o la durata in giorni di una battaglia, dove Tolkien la dà) oppure stimato in modo plausibile, dichiarandolo nella traccia del dominio. Candidati: forze schierate e perdite di ogni battaglia, distanze in miglia fra le tappe, altezza dei personaggi, età alla morte. Attendi l’approvazione, poi aggiorna schema, dati, ER e traccia; ricarica con `PRAGMA foreign_keys=ON` e controlla che i 20 esercizi esistenti diano ancora il risultato chiesto.
2. Proponi a Marco la distribuzione: numero di esercizi per capitolo e per difficoltà, parole chiave da coprire (per esempio `LIKE`, `DISTINCT`, `IN`, `CASE`, `EXISTS`, `UNION`, funzioni di data e di testo se i dati lo permettono). Attendi l’approvazione.
3. Scrivi gli esercizi un capitolo alla volta. Esegui ogni query attesa su SQLite e controlla che il risultato sia quello chiesto, con almeno una riga. Usa uno script nella cartella temporanea della sessione per eseguire tutte le query di un capitolo in una volta.
4. Dopo ogni capitolo esegui `npm run check:themes` e committa come commit intermedio dichiarato.
5. Applica la passata finale di `scrittura-umana.md` a consegne e suggerimenti.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm run check:themes` | Exit 0; `lotr` con 120–150 esercizi |
| `npm test`, `npm run lint`, `npm run build` | Exit 0 |
| `git diff --stat <hash di partenza> HEAD -- . ':!themes/lotr' ':!docs'` | Nessuna riga, salvo la riga di stato in `AGENTS.md` |

Procedura manuale con `npm run dev`: la locandina di LOTR riporta il nuovo numero di esercizi; nel catalogo i filtri per capitolo e difficoltà restituiscono la distribuzione approvata; tre esercizi a caso, uno per difficoltà, si risolvono con la query attesa.

## 6. Passaggio di consegne

Da compilare alla chiusura: esito, verifiche, colonne e dati aggiunti con la loro fonte, distribuzione finale, osservazioni di Marco, lavoro residuo, consumo reale se noto.
