# F17 — Far funzionare il sito senza rete

- **Modello / effort:** Opus 5.5 `medium`. Un *service worker* sbagliato serve versioni vecchie del sito a lungo e si rimuove con fatica: serve giudizio su cache e aggiornamenti. Passa a `high` se gli aggiornamenti non si comportano come previsto.
- **Dipendenze:** nessuna dipendenza reale; conviene dopo F18, così i test end-to-end proteggono il cambiamento.
- **Consumo stimato:** medio.
- **Incertezza:** media-alta: comportamento dei browser con GitHub Pages, aggiornamento della versione, file `wasm` di `sql.js`.
- **Punto di ripresa:** *service worker* che mette in cache la versione corrente e la serve senza rete, prima della gestione degli aggiornamenti.

## 1. Obiettivo e risultato atteso

Dopo la prima visita, il sito si apre e funziona anche se la rete del laboratorio cade: temi, sandbox, esercizi, progressi in `localStorage`. Zaino e classifica tornano a sincronizzarsi con la rete, come già fanno. A ogni pubblicazione lo studente riceve la versione nuova senza svuotare la cache a mano.

## 2. Contesto minimo

- Il build è statico (Vite, `base: './'`), pubblicato da `main` con `.github/workflows/pubblica.yml`.
- Il `wasm` di `sql.js` è importato con `?url` in `src/sql/worker.ts`; i file dei temi sono moduli del build.
- Lo zaino gestisce già lo stato `offline` (`src/zaino/sincronizza.ts`).

## 3. Perimetro

Dentro: *service worker* e manifest dell’app, strategia di cache, avviso «È disponibile una versione nuova», procedura di rimozione in caso di problemi, nota nell’informativa se necessaria.

Fuori: installazione come app sul telefono come obiettivo (arriva gratis col manifest, ma non si promuove).

## 4. Attività di implementazione

1. Proponi a Marco: scritto a mano o con un plugin di Vite (dipendenza nuova da motivare), strategia (precache del build, rete prima per gli indirizzi dei servizi), comportamento all’aggiornamento. Attendi le scelte.
2. Implementa e prova con `npm run build && npx vite preview`, rete disattivata dagli strumenti del browser.
3. Prova un aggiornamento: due build in sequenza, la seconda deve arrivare.
4. Documenta nel `README.md` come disattivare il *service worker* se una versione difettosa resta in cache.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm run lint && npm test && npm run check:themes && npm run build` | Nessun errore |

Procedura manuale (`npx vite preview`): visita il sito, disattiva la rete, ricarica: si apre; esegui una query e risolvi un esercizio; riattiva la rete: lo zaino sincronizza. Pubblica una build diversa in anteprima: compare l’avviso e la versione nuova si carica.

## 6. Passaggio di consegne

Da compilare a fine fase.
