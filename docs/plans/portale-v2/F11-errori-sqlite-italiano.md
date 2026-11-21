# F11 — Spiegare in italiano gli errori di SQLite

- **Modello / effort:** Claude Code Opus · Codex Sol; effort consigliato `medium`. Testi per gli studenti e giudizio su quale indizio aiuta senza svelare la soluzione.
- **Dipendenze:** nessuna.
- **Consumo stimato:** medio.
- **Incertezza:** media: dipende da quanti messaggi di SQLite si decide di coprire.
- **Punto di ripresa:** elenco degli errori da coprire, con i testi approvati da Marco, prima del codice.

## 1. Obiettivo e risultato atteso

Quando una query fallisce, nella sandbox e negli esercizi, lo studente legge l’errore in italiano con un indizio concreto: per esempio, per `no such column: nme`, che la colonna non esiste, quali colonne simili ci sono e in quale tabella. Il messaggio originale di SQLite resta visibile, più piccolo, perché è quello che lo studente ritroverà fuori dal portale.

## 2. Contesto minimo

- Verificato il 2026-11-21: `describeVerdict` in `src/exercises/verify.ts` scrive «SQLite ha segnalato un errore: » seguito dal messaggio originale in inglese; la sandbox lo mostra nel caso `sql-error` di `src/sandbox/ResultsView.tsx`.
- Lo schema del tema è noto al client: `src/sandbox/SchemaPanel.tsx` e il completamento dell’editor lo leggono già.
- Proposta di Marco del 2026-11-21, dal brainstorming sul piano.

## 3. Perimetro

Dentro: riconoscimento dei messaggi più comuni (`no such column`, `no such table`, `ambiguous column name`, `near "…": syntax error`, `misuse of aggregate`, numero di valori sbagliato in `INSERT`, vincoli `FOREIGN KEY`, `NOT NULL`, `UNIQUE`), testo italiano con indizio, test.

Fuori: correzione automatica della query; analisi sintattica completa dell’SQL.

## 4. Attività di implementazione

1. Raccogli gli errori reali: esegui su SQLite (`sql.js`, come nel portale) le query sbagliate tipiche e annota i messaggi esatti.
2. Proponi a Marco l’elenco e i testi; attendi l’approvazione.
3. Scrivi una funzione pura che riceve messaggio e schema e restituisce testo e indizio; i nomi simili con una distanza di modifica semplice, senza dipendenze nuove.
4. Usala nella sandbox e nei verdetti degli esercizi.
5. Scrivi i test con i messaggi raccolti al punto 1.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm run lint && npm test && npm run check:themes && npm run build` | Nessun errore |

Procedura manuale (`npm run dev`): nella sandbox di Star Wars esegui `SELECT nme FROM personaggi`, `SELECT * FROM personaggio`, una join con colonna ambigua e una query con errore di sintassi; ogni errore ha testo italiano, indizio e messaggio originale.

## 6. Passaggio di consegne

Da compilare a fine fase.
