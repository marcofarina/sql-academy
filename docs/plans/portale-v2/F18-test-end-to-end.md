# F18 — Scrivere i test end-to-end

- **Modello / effort:** Claude Code Sonnet · Codex Terra; effort consigliato `high`. Test di percorsi già definiti; `high` perché i test end-to-end tendono a essere fragili e vanno resi stabili.
- **Dipendenze:** F05, F07 (l’interfaccia di esito, barra, zaino e classifica è quella definitiva; prima i test andrebbero riscritti).
- **Consumo stimato:** medio.
- **Incertezza:** media: tempi del worker SQLite, servizi esterni da simulare.
- **Punto di ripresa:** Playwright installato con un primo test verde in locale, prima del workflow.

## 1. Obiettivo e risultato atteso

Una suite end-to-end, da eseguire in locale e nel workflow di pubblicazione, che copre i percorsi principali su entrambi i temi prima che arrivino otto mondi nuovi.

## 2. Contesto minimo

- Test unitari oggi: Vitest (`npm test`), 212 al 2026-11-20.
- Workflow: `.github/workflows/pubblica.yml` (lint, test, `check:themes`, `classifica-dati.ts --controlla`, build, Pages).
- Zaino e classifica sono servizi esterni: nei test vanno simulati intercettando le richieste, non chiamati in produzione.

## 3. Perimetro

Dentro: dipendenza di sviluppo `@playwright/test` (da approvare con Marco), configurazione, test, script `npm run test:e2e`, passo nel workflow.

Fuori: test visivi a confronto di immagini, salvo richiesta di Marco.

## 4. Attività di implementazione

1. Chiedi a Marco il via sulla dipendenza e su quali browser (Chromium soltanto, o anche WebKit e Firefox: allungano il workflow).
2. Configura Playwright sul build di produzione servito da `vite preview`.
3. Scrivi i test: home e ingresso in ogni tema; query nella sandbox; esercizio risolto con notifica e saldo; esercizio sbagliato; suggerimento comprato; sessione interrotta e ripresa; barra e «Indietro» da Zaino e Classifica; zaino e classifica simulati.
4. Aggiungi il passo al workflow, prima della pubblicazione.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm run build && npm run test:e2e` | Tutti i test superati, tre esecuzioni di fila |
| `gh run list --limit 1` dopo il push concordato con Marco | Esecuzione riuscita |

## 6. Passaggio di consegne

Completata il 2026-11-23 (Codex; predefinito Terra in `~/.codex/config.toml`, scelta effettiva non verificabile). Marco ha approvato `@playwright/test` e Chromium soltanto.

- Suite in `e2e/`, su build di produzione e servizi esterni intercettati; copre i due mondi, sandbox, risposta errata e corretta, saldo e suggerimento pagato, ripresa sessione, barra e ritorno, creazione zaino e classifica simulati.
- Superati: build, tre esecuzioni consecutive di `npm run test:e2e` (sei test ciascuna), lint, 295 test unitari, `check:themes`, controllo dati classifica e `git diff --check`. Due avvisi Star Wars e avviso dimensione bundle preesistenti. Durante lo sviluppo sono state corrette due aspettative della suite.
- Scostamento: il workflow esegue i controlli anche su `dev`, ma il job di pubblicazione resta riservato a `main`, per permettere una verifica remota senza pubblicare.
- Push di `dev` autorizzato da Marco; workflow remoto [45258677332](https://github.com/marcofarina/sql-academy/actions/runs/45258677332) riuscito, test end-to-end superati e pubblicazione saltata. GitHub segnala la deprecazione di Node 20 nelle action esistenti. Nessun criterio residuo. Consumo reale non disponibile.
