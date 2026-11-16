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

**Esito:** completata il 2026-11-16 21:01 su Fable 5.2 (nessun ripiego). Effort non verificabile dalla sessione.

### Verifiche

| Verifica | Esito |
| --- | --- |
| `npm run build` | superata; `dist/assets/sql-wasm-browser-<hash>.wasm` presente |
| `npm test` | superata: 18 test in due file, compresi watchdog e ripristino |
| `npm run lint` | superata |
| Tema `prova` copiato da `star-wars` con `id` cambiato, poi `npm test` | superata: il test di scoperta confronta i temi con le cartelle di `themes/` e ne vede due; cartella rimossa |
| Manuale, `npm run dev` | superata nel browser integrato: la tabella mostra le cinque righe di `pianeti`, console senza errori |
| Manuale, build servita con `vite preview` (non richiesta dal piano) | superata: worker e WASM si caricano anche dalla build |

Nessuna verifica fallita o non eseguita.

### Nomi dei file del tema

Quelli della sezione «Struttura di un tema» del `README.md` del piano. Decisione di Marco in questa fase: il manifest contiene solo `id`, `title`, `description`; gli altri file si trovano per nome fisso. L’`id` deve coincidere con il nome della cartella e rispettare `THEME_ID_PATTERN` (minuscole, cifre, trattini): altrimenti il registro lancia un errore al caricamento.

### Registro dei temi

`src/themes/registry.ts` esporta `themes` (ordinati per `id`), `findTheme(id)` e `buildRegistry(…)`, la parte senza `import.meta.glob`, provabile con moduli finti. Un `Theme` ha `manifest` e `loadDatabaseScript()`, che restituisce `schema.sql` seguito da `dati.sql`; nella build i due file sono moduli separati, scaricati alla prima chiamata.

### Interfaccia del motore

Tutta in `src/sql/engine.ts`; F02 e F03 importano solo da lì, più l’istanza.

```ts
interface SqlEngine {
  open(source: { key: string; script: string }): Promise<SqlDatabase>;
  dispose(): void;
}
interface SqlDatabase {
  run(sql: string, options?: { maxRows?: number; timeoutMs?: number }): Promise<RunResult>;
  reset(): Promise<void>;
  close(): Promise<void>;
}
interface RunResult { resultSets: ResultSet[]; rowsModified: number; durationMs: number }
interface ResultSet { columns: string[]; rows: SqlValue[][]; totalRows: number; truncated: boolean }
```

- Istanza per il browser: `engine` in `src/sql/browser.ts`. Fuori dal browser (test, script): `createNodeEngine()` in `src/sql/testing/nodeEngine.ts`, stesso ponte e stesso nucleo su un `worker_threads`.
- Errori: `SqlError` (messaggio di SQLite per intero; le istruzioni precedenti dello script restano eseguite), `SqlTimeoutError` (watchdog), `EngineError` (caricamento fallito, script della sorgente sbagliato, database chiuso).
- Ogni `open` dà un database indipendente, anche dalla stessa sorgente: F02 può aprire una copia dello stato iniziale per la query attesa.
- Valori predefiniti: 5 s di tempo massimo, 1000 righe per insieme di risultati (`totalRows` conta comunque tutte le righe), al massimo 20 insiemi di risultati per script. Per la verifica F02 passi un `maxRows` adeguato.
- Dopo un’interruzione del watchdog il worker viene terminato: **tutti** i database aperti, non solo quello della query, ripartono dallo stato iniziale alla richiesta successiva.
- `PRAGMA foreign_keys = ON` e `hard_heap_limit` di 64 MiB a ogni apertura.

### Struttura del codice

| File | Ruolo |
| --- | --- |
| `src/sql/core.ts` | Nucleo: `sql.js` dietro il protocollo, senza sapere di girare in un worker |
| `src/sql/protocol.ts` | Messaggi fra ponte e worker |
| `src/sql/bridge.ts` | `createEngine(spawn, options)`: ciclo di vita del worker e watchdog |
| `src/sql/worker.ts`, `src/sql/browser.ts` | Web Worker e istanza del browser |
| `src/sql/testing/` | Worker e motore per Node |
| `src/App.tsx` | Pagina minima, da sostituire in F03 |

### Decisioni nuove

- **Test del motore su un worker vero di Node**, non su un ambiente simulato: il watchdog è provato con una ricorsione senza fine davvero interrotta. Node carica `src/sql/testing/nodeWorker.ts` e `src/sql/core.ts` senza Vite, quindi in questi due file gli import di valori indicano l’estensione `.ts` e servono solo sintassi cancellabili (`erasableSyntaxOnly`). Richiede Node ≥ 22.18 (`engines` in `package.json`): F10 ne tenga conto nel flusso di pubblicazione.
- **Versioni installate:** `npm install` ha risolto TypeScript 6.0 e Vitest 4.1, non le ultime pubblicate (7.0 e 5.1), per i vincoli fra i pacchetti. Vite 8.3, React 19.3, `sql.js` 1.16.0 (build `sql-wasm-browser` nel browser).
- **Dipendenze oltre l’elenco della fase**, tutte di sviluppo e di corredo allo stack deciso: `@vitejs/plugin-react`, `typescript-eslint`, `@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals`, `@types/*`.
- `base: './'` in `vite.config.ts`: il sito funziona sotto qualunque sottocartella di GitHub Pages.
- Aggiunto `.claude/launch.json` per avviare il server di sviluppo nell’anteprima dell’app.
- Il worker e il ponte del libro sono stati letti direttamente, senza subagent `Explore`: il contesto bastava. Dal libro non sono stati portati le «foto» del database e la verifica (`verifyRun`, che è perimetro di F02).

### Lavoro residuo

Nessuno per questa fase. Il tema `star-wars` è un segnaposto di due tabelle e cinque righe ciascuna (F04).

### Consumo reale

Non noto.
