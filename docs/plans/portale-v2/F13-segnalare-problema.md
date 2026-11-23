# F13 — Segnalare un problema su un esercizio

- **Modello / effort:** Claude Code Opus · Codex Sol; effort consigliato `medium`. Poco codice, ma una decisione sul canale che riguarda studenti minorenni e testi per gli studenti.
- **Dipendenze:** nessuna. Conviene dopo F05, che cambia lo spazio di lavoro dell’esercizio.
- **Consumo stimato:** basso.
- **Incertezza:** bassa, una volta scelto il canale.
- **Punto di ripresa:** canale scelto da Marco.

## 1. Obiettivo e risultato atteso

Da ogni esercizio lo studente può segnalare un problema (consegna ambigua, soluzione sbagliata, suggerimento fuorviante). La segnalazione parte precompilata con tema, id dell’esercizio, query dello studente e versione del sito, senza dati personali. Con circa 1500 esercizi a regime, gli errori arriveranno: questo è il modo di saperlo.

## 2. Contesto minimo

- Niente server nuovi e niente dati personali (vincoli del piano archiviato). Un’issue su GitHub chiede un account, che molti studenti non hanno.
- La query dello studente è nei progressi (`lastQuery`).

## 3. Perimetro

Dentro: scelta del canale, pulsante nello spazio di lavoro, testo precompilato, eventuale riga nell’informativa.

Fuori: raccolta delle segnalazioni su un servizio proprio.

## 4. Attività di implementazione

1. Usa i due canali scelti da Marco il 2026-11-23: e-mail a `info@rainbowbits.cloud` e bozza di issue nel repository pubblico `marcofarina/sql-academy`.
2. Riusa l’icona RB `flag` per «Segnala un problema».
3. Precompila le bozze nello spazio di lavoro condiviso da percorso e sessione. Leggi la revisione Git all’avvio di Vite o durante la build. Riferimenti: [RFC 6068](https://www.rfc-editor.org/rfc/rfc6068.html#section-5) e [parametri del link GitHub](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-an-issue#creating-an-issue-from-a-url-query).
4. Spiega nell’informativa quali dati riceve ciascun canale.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm run lint && npm test && npm run check:themes && npm run build` | Nessun errore |

Procedura nel browser (`npm run dev`):

1. Apri `#/star-wars/addestramento/ex-001` e `#/lotr/addestramento/ex-001`. Scrivi una query con un accento e vai a capo nell’editor.
2. Apri «Segnala un problema». Controlla per entrambi i canali il destinatario, il tema, l’identificativo, la query corrente e la revisione restituita da `git rev-parse --short HEAD`.
3. Togli la spunta da «Includi la mia query» e verifica che i riferimenti all’esercizio restino nella bozza. Con una query che supera la lunghezza del link, verifica che il pannello mostri il testo da copiare senza tagli.
4. Avvia una sessione e verifica che l’identificativo nella bozza cambi passando all’esercizio successivo.

## 6. Passaggio di consegne

**Esito.** «Segnala un problema» apre le due alternative da ogni esercizio del percorso e della sessione. L’informativa descrive la condivisione con il destinatario dell’e-mail e con GitHub. Il pannello riusa l’icona RB `flag` e conserva la spunta solo finché l’esercizio è montato.

**Scostamenti dal dettaglio.** Le bozze leggono il testo corrente dell’editor, inizializzato da `lastQuery`. Lo studente può escludere la query prima di aprire la bozza. Se un link supererebbe 1800 caratteri, le bozze contengono i riferimenti all’esercizio e il pannello offre la query intera da copiare. Una build da un archivio senza Git mostra «non disponibile» come versione.

**Verifiche superate il 2026-11-23.**

- `npm run lint`, `npm test` (247 test), `npm run check:themes` e `npm run build`. Restano i due avvisi Star Wars documentati in F19 e l’avviso di Vite sulla dimensione del bundle.
- In Chrome a 1280 px su Star Wars e a 375 px sul Signore degli Anelli, intercettati entrambi i link e verificati destinazioni, identificativi, revisione e query, anche con righe multiple, accenti e caratteri riservati degli URL. Provati editor vuoto, esclusione della query, copia della query lunga, passaggio al prossimo esercizio di una sessione e pagina informativa.
- `gh api repos/marcofarina/sql-academy --jq .has_issues` conferma che il repository ha le issue abilitate.

**Verifiche non eseguite.** Invio di un’e-mail e pubblicazione di un’issue. Il controllo locale intercetta i link in uscita e verifica i dati delle bozze senza trasmetterli.

**Strumento e modello.** Codex Sol (`gpt-6.2-sol` in `~/.codex/config.toml`).
