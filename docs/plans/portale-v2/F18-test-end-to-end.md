# F18 — Scrivere i test end-to-end

- **Modello / effort:** Sonnet 5.5 `high`. Test di percorsi già definiti; `high` perché i test end-to-end tendono a essere fragili e vanno resi stabili.
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

Da compilare a fine fase.
