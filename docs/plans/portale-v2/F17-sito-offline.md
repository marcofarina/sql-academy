# F17 — Far funzionare il sito senza rete

- **Modello / effort:** Claude Code Opus · Codex Sol; effort consigliato `medium`. Un *service worker* sbagliato serve versioni vecchie del sito a lungo e si rimuove con fatica: serve giudizio su cache e aggiornamenti. Passa a `high` se gli aggiornamenti non si comportano come previsto.
- **Revisione incrociata:** sì, sull’altro strumento prima delle fasi che ne dipendono: un *service worker* sbagliato resta in produzione a lungo e si rimuove con fatica.
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

Completata il 2026-11-23 21:50, ora di Roma, con Codex (Sol, predefinito letto da `~/.codex/config.toml`).

### Decisioni ed esito

- Marco ha confermato un service worker scritto a mano, il salvataggio dei file della build per l’uso senza rete, zaino e classifica via rete e l’aggiornamento con avviso e «Ricarica».
- `scripts/offlinePlugin.ts` genera `dist/service-worker.js` a fine build. Il worker verifica le impronte di tutti i file prima di attivarsi. La cache contiene solo file pubblici e usa una chiave per versione e indirizzo del portale. Quando si attiva una versione nuova, il worker cancella le cache precedenti del portale per quell’indirizzo.
- `src/offline/updates.ts` controlla gli aggiornamenti all’apertura, quando la scheda riprende il fuoco, al ritorno della rete e ogni quindici minuti finché la scheda è visibile. Il browser attiva una versione già scaricata anche quando chiudi tutte le schede del portale.
- Il manifest riusa il favicon RB del portale. Il README descrive il ripristino dal browser e la pubblicazione di un worker che rimuove la registrazione e le cache.

### Scostamenti dal dettaglio

- «Ricarica» chiede di chiudere le altre schede del portale prima di attivare la versione nuova. Così una scheda lasciata aperta per lavorare conserva la propria pagina e i file che le servono.

### Verifiche

- `npm run lint && npm test && npm run check:themes && npm run build` superato. Passati 295 test. Restano i due avvisi Star Wars documentati in F19 e l’avviso Vite sulla dimensione del bundle.
- `npm run test:e2e` superato, 7 test su Chromium. A rete disattivata dopo la prima visita, ricaricata la home, eseguita una query in ciascun mondo e risolto un esercizio. I punti restano dopo la ricarica. Al ritorno della rete, lo zaino simulato riceve i progressi.
- Collaudo in Chromium a 375 px con due build servite da `npx vite preview` sotto `/prova/`. La seconda build compare nell’avviso e si attiva con «Ricarica» anche se la rete cade dopo il download. La prova ha coperto una risorsa con impronta errata, il tentativo di aggiornamento con due schede aperte e l’attivazione quando vengono chiuse tutte le schede.
- Provato il worker di ripristino del README allo stesso indirizzo del worker attivo. Ha rimosso la registrazione e la cache del portale. Il valore di prova in `localStorage` e la cache di un’altra app erano ancora presenti.

Il collaudo ha usato Chromium in anteprima locale. Restano la revisione incrociata su Claude Code con Opus e la verifica su GitHub Pages dopo la pubblicazione.

**Revisione incrociata del 2026-11-23 con Claude Code Opus.** Esito: nessun difetto, nessuna correzione.

- Letti il diff di `d1c1922` e il passaggio di consegne, confrontati con il dettaglio, scostamento compreso.
- Rieseguiti `npm run lint`, `npm test` (295 test), `npm run check:themes`, `npm run build` e `npm run test:e2e` (7 test): superati, con i due avvisi noti di Star Wars e l’avviso sulla dimensione del bundle.
- Build controllata: `dist` pesa 3,6 MB, tutti i file compaiono nel worker con la loro impronta; favicon e manifest diventano relativi (`./favicon.svg`, `./app.webmanifest`), quindi il sito resta pubblicabile sotto una sottocartella.
- Percorsi controllati nel codice: il worker risponde solo agli indirizzi della build e lascia passare zaino, classifica e richieste diverse da `GET`; alla prima visita `clients.claim()` prende il controllo senza ricaricare la pagina; «Ricarica» attiva la versione nuova solo se non ci sono altre schede del portale, così una scheda vecchia non chiede pezzi di codice che la cache nuova non ha più; le cache vecchie si cancellano solo con il prefisso del portale e del suo indirizzo. La cache contiene solo file pubblici: la decisione «Dati nel browser» non chiede altro.
- Scelte lasciate: subito dopo una pubblicazione la CDN di GitHub Pages può servire per qualche minuto copie vecchie dei file senza impronta nel nome (`index.html`, manifest, immagini); l’installazione fallisce e riprova al controllo successivo, senza danni. L’uso senza rete su Safari per iPhone, dove il worker di SQLite scarica il `wasm`, non è verificato: si prova solo sul sito pubblicato, perché il *service worker* richiede HTTPS.
