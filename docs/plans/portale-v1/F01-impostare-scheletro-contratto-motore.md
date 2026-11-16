# F01 — Impostare scheletro, contratto del tema e motore SQL

- **Modello / effort:** Fable 5.2 `medium` · ripiego Opus 5.5 `high`. Qui si decide la forma dell’intero progetto: contratto del tema, confine fra codice comune e temi, interfaccia del motore.
- **Dipendenze:** nessuna. Da aprire entro il 2026-11-17 08:59 per usare Fable.
- **Consumo stimato:** alto. Progetto da creare da zero, tre decisioni di forma, lettura del worker del libro (728 righe).
- **Incertezza:** media. Può crescere se il worker di `sql.js` richiede adattamenti al caricamento del file WASM sotto Vite o se i test del worker in Vitest richiedono un ambiente diverso da quello predefinito.
- **Punto di ripresa:** `npm run build` riuscito con lo scheletro vuoto, prima del motore SQL.

## 1. Obiettivo e risultato atteso

Un progetto Vite che compila, con il contratto del tema scritto in TypeScript, l’autoscoperta dei temi, un motore SQLite in un Web Worker e una pagina minima che esegue una query sul tema segnaposto.

## 2. Contesto minimo

- `AGENTS.md` e `docs/plans/portale-v1/README.md`, sezioni «Vincoli», «Decisioni condivise», «Struttura attesa di un tema», «Riferimenti da adattare».
- `~/Developer/github/python-doesnt-byte/static/sql-runner/worker.js` e `src/theme/SQLRunner/sqlBridge.ts`: da leggere con un subagent `Explore`, chiedendo un riassunto di protocollo dei messaggi, gestione del seed e watchdog.

## 3. Perimetro

Dentro: configurazione del progetto, `src/` comune, `themes/star-wars/` come segnaposto di due tabelle (`pianeti`, `personaggi`) con poche righe.

Fuori: verifica delle risposte (F02), interfaccia della sandbox e navigazione completa (F03), dati completi di Star Wars (F04), stile (F08).

## 4. Attività di implementazione

1. Crea il progetto con Vite (React, TypeScript), Vitest ed ESLint. Aggiungi gli script `dev`, `build`, `test`, `lint` in `package.json`.
2. Scrivi il contratto del tema in `src/themes/contract.ts`: tipo `ThemeManifest` e tipi dei file del tema. Fissa i nomi dei file di `themes/<id>/` e aggiorna la sezione «Struttura attesa di un tema» del `README.md` del piano.
3. Scrivi il registro in `src/themes/registry.ts` con `import.meta.glob`: i temi si scoprono dalle cartelle, senza elenco scritto a mano. I file SQL e i contenuti pesanti di un tema si caricano solo quando lo studente lo apre.
4. Porta il motore: worker `sql.js` con seed serializzato, `PRAGMA foreign_keys = ON`, database nuovo a richiesta («ripristina»), limite di righe restituite; ponte con watchdog che termina il worker dopo un tempo massimo. Servi il file WASM dal progetto, non da una CDN.
5. Definisci l’interfaccia del motore (`src/sql/engine.ts`): aprire il database di un tema, eseguire uno script, ripristinare, chiudere. F02 e F03 dipendono solo da questa interfaccia.
6. Crea il tema segnaposto e una pagina che elenca i temi scoperti ed esegue `SELECT * FROM pianeti`.
7. Scrivi i test: scoperta dei temi; query valida; errore di sintassi restituito come messaggio; query che non termina interrotta dal watchdog; ripristino dopo un `DROP TABLE`.

Decisioni strutturali da sottoporre a Marco se emergono: forma del manifest diversa dalla bozza, dipendenze oltre a React, `sql.js`, Vite, Vitest ed ESLint.

## 5. Criteri di accettazione

Dalla radice del repo:

| Comando | Risultato atteso |
| --- | --- |
| `npm run build` | Termina senza errori; `dist/` contiene il file `.wasm` di `sql.js` |
| `npm test` | Tutti i test superati, compresi watchdog e ripristino |
| `npm run lint` | Nessun errore |
| `mkdir themes/prova && cp -R themes/star-wars/ themes/prova/` poi modifica dell’`id` nel manifest, `npm test`, infine `rm -rf themes/prova` | Il test di scoperta vede due temi senza altre modifiche |

Verifica manuale: `npm run dev`, apri la pagina, la tabella mostra le righe di `pianeti`.

## 6. Passaggio di consegne

Da compilare alla chiusura: esito, verifiche superate, fallite e non eseguite, nomi definitivi dei file del tema, interfaccia del motore, modello effettivamente usato (Fable o ripiego), decisioni nuove, lavoro residuo, consumo reale se noto.
