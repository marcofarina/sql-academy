# F20 — Generare lo scheletro di un tema nuovo

- **Modello / effort:** Sonnet 5.5 `medium`. Forma già decisa dal contratto del tema.
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

Da compilare a fine fase.
