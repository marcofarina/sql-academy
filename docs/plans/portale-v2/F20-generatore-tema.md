# F20 — Generare lo scheletro di un tema nuovo

- **Modello / effort:** Claude Code Sonnet · Codex Terra; effort consigliato `medium`. Forma già decisa dal contratto del tema.
- **Dipendenze:** F09 (livello nel contratto). Conviene dopo F04 e F10, che possono aggiungere campi alla veste.
- **Consumo stimato:** basso.
- **Incertezza:** bassa.
- **Punto di ripresa:** script che crea una cartella accettata da `check:themes`.

## 1. Obiettivo e risultato atteso

`npm run nuovo-tema -- <id>` crea `themes/<id>/` con i file obbligatori e facoltativi del contratto, già validi, più una lista di controllo delle fasi da seguire (studio della veste, dati, esercizi, traccia, ER, modello logico). Serve agli otto mondi del piano successivo.

## 2. Contesto minimo

- Contratto: `src/themes/contract.ts`; guida «Aggiungere un tema» nel `README.md`; «Struttura di un tema» nel piano archiviato.
- `check:themes` controlla manifest, esercizi, ER, modello logico e confinamento degli stili.

## 3. Perimetro

Dentro: script in `scripts/`, comando in `package.json`, lista di controllo, aggiornamento della guida nel `README.md`.

Fuori: contenuti del tema.

## 4. Attività di implementazione

1. Scrivi lo script: rifiuta id già esistenti o riservati (`zaino`, `classifica`, `informativa` e gli altri del routing), crea i file con segnaposto validi (due tabelle, un esercizio, manifest con livello).
2. Scrivi la lista di controllo come file del tema da cancellare a fine costruzione, o nel `README.md`, come preferisce Marco.
3. Prova: crea un tema di prova, esegui `check:themes` e `npm run build`, poi cancellalo.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm run nuovo-tema -- prova && npm run check:themes && npm run build` | Nessun errore; il tema `prova` compare sulla pagina iniziale |
| `npm run nuovo-tema -- star-wars` | Errore: tema già esistente |

Al termine rimuovi `themes/prova/`.

## 6. Passaggio di consegne

Completata il 2026-11-23 con Codex (predefinito `gpt-6.1-terra` in `~/.codex/config.toml`; scelta effettiva non verificabile).

- `npm run nuovo-tema -- <id>` crea manifest, schema, dati, esercizio, traccia, ER, modello logico e fogli di stile provvisori. Usa il pattern del contratto e le pagine riservate del routing; non sovrascrive una cartella esistente.
- Lista di controllo e comando nella guida del `README.md`. Sostituire i segnaposto prima della pubblicazione.
- Superati: generazione di `prova`, `npm run check:themes`, `npm run build`, locandina di `prova` nella pagina iniziale nel browser, rifiuto di `star-wars`, `docente` e `../prova`, `npm run lint`, `npm test` (295 test), `git diff --check`. La cartella `themes/prova/` è stata rimossa.
- Avvisi preesistenti: due avvisi Star Wars in `check:themes` e dimensione del bundle nella build. Nessuna verifica fallita o non eseguita tra i criteri di accettazione.
- Scostamenti dal dettaglio: nessuno. Nessuna decisione strutturale nuova; lista nel README. Nessun lavoro residuo della fase. Consumo reale non disponibile.
