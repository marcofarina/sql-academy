# F15 — Collegare i progressi allo zaino di PDB

- **Modello / effort:** Opus 5.5 `high`. Sincronizzazione fra dispositivi, cifratura e una modifica in un altro repo già in produzione: concorrenza e dati di altri, dove un errore cancella le note degli studenti.
- **Dipendenze:** F13 (forma dei progressi versione 2, con campi che crescono soltanto ed epoca di azzeramento).
- **Consumo stimato:** alto. Molta lettura del codice di PDB (circa 1250 righe in `src/lib/zaino/`, più la pagina `/zaino`), adattamento, prove con due contesti del browser contro `wrangler dev`.
- **Incertezza:** media-alta. La pagina `/zaino` di PDB ha modalità temporanea, QR e cambio di codice: quanto riprenderne è da decidere con Marco all’inizio della fase. Il deploy del Worker di PDB richiede Marco.
- **Punto di ripresa:** client dello zaino copiato e funzionante in locale contro `npx wrangler dev`, con la sezione `sql-academy` che sopravvive a una sincronizzazione fatta dal sito del libro, prima dell’interfaccia.

## 1. Obiettivo e risultato atteso

Lo studente apre nel portale lo **stesso zaino** che usa nel libro, con lo stesso codice, e ritrova a casa i progressi e i punti del laboratorio. Lo zaino di PDB contiene una sezione nuova, `sql-academy`, accanto a `quaderno`; nessuno dei due siti rovina la sezione dell’altro.

## 2. Contesto minimo

- Decisione di Marco (2026-11-17): stesso zaino di PDB, riga «Salvataggio dei progressi» delle «Decisioni condivise».
- `~/Developer/github/python-doesnt-byte/pm/piano-2026-11-quaderno.md`: «Decisioni di Marco», «Alternative scartate» (non riproporle), «Scelte di default» (codice, cifratura, codice perso, modalità temporanea, errori del servizio), «Protocollo dello zaino», esiti di Q4. Fatti 10, 16, 20, 21: piano gratuito, richieste, contesto sicuro, account Cloudflare di Marco su Workers Free.
- `~/Developer/github/python-doesnt-byte/servizi/zaino/` (Worker, `wrangler.toml`, CORS in `src/index.ts`) e `src/lib/zaino/` (`tipi.ts`, `sezioni.ts`, `cifra.ts`, `sincronizza.ts`, `area.ts`), `src/pages/zaino.tsx`, `src/components/ZainoStato/`. Leggi con un subagent `Explore` e chiedi contratti e regole, non il codice intero.
- Passaggio di consegne di F13.

## 3. Perimetro

Dentro:

- **Nel repo di PDB:** aggiungere al CORS del Worker l’origine di sviluppo del portale (`http://localhost:5173`). L’origine di produzione si aggiunge in F10, quando il dominio è deciso. Commit sul branch `dev` di PDB con la sola modifica; deploy solo con il via di Marco. Verifica che la privacy policy del libro (`src/pages/legale/privacy-policy.mdx`) copra anche la sezione del portale; se no, prepara la modifica e mostrala a Marco.
- **Nel portale:** copia e adatta il client dello zaino (decisione «Riuso dal libro»: niente dipendenza fra i repo), con la stessa cifratura e lo stesso protocollo, byte per byte compatibili. Registra la sezione `sql-academy`, con dentro i progressi di tutti i temi, e la sua regola di unione: massimo campo per campo dentro la stessa epoca di un tema; fra epoche diverse vince la più alta. Le sezioni sconosciute (`quaderno`) si conservano intatte, come fa già PDB.
- **Interfaccia:** creare uno zaino, aprirne uno con il codice, vedere lo stato della sincronizzazione, uscire. Quanto riprendere della pagina `/zaino` di PDB (QR, link con `#codice=`, modalità temporanea, «Cambia codice») decidilo con Marco all’inizio della fase, con una raccomandazione.

Fuori: classifica (F16, F17); il gettone della classifica entra nella sezione in F17. Nessuna modifica al quaderno o alle altre parti di PDB oltre CORS ed eventuale privacy policy.

## 4. Attività di implementazione

1. Leggi il piano del quaderno e il client dello zaino con un subagent; riassumi in questo file i contratti da rispettare (forma della busta, regole delle sezioni sconosciute, stati del client).
2. Modifica CORS in PDB, prova con `servizi/zaino/prova.mjs` e `npx wrangler dev`: preflight da `http://localhost:5173` sì, da `https://example.com` no.
3. Copia e adatta il client nel portale, per esempio in `src/zaino/`; URL del servizio in una variabile di Vite, con `http://localhost:8787` in sviluppo.
4. Sezione `sql-academy` e sua regola di unione, con test: commutativa, idempotente, epoca che vince, campi che crescono.
5. Interfaccia secondo la decisione con Marco; icone con la skill `icone-rb` (la libreria potrebbe già avere quelle create per lo zaino di PDB: cercale prima).
6. Prova a due siti: con il sito del libro (`npm start` in PDB) e il portale (`npm run dev`) contro lo stesso `wrangler dev`, una nota scritta nel libro e un esercizio risolto nel portale sopravvivono entrambi alle sincronizzazioni dell’altro.

## 5. Criteri di accettazione

| Directory | Comando | Risultato atteso |
| --- | --- | --- |
| radice del portale | `npm test`, `npm run build`, `npm run lint`, `npm run check:themes` | Nessun errore |
| `python-doesnt-byte/servizi/zaino` | `npm run typecheck`; `npm run prova -- http://localhost:8787` | Nessun errore; preflight del portale accettato |

Procedura manuale, con due contesti del browser (due «dispositivi») e `wrangler dev`:

1. Su A crea uno zaino nel portale, risolvi `ex-001`. Su B apri lo zaino con il codice: `ex-001` risolto, saldo 10.
2. Nel libro (stesso codice) evidenzia una frase; nel portale risolvi un altro esercizio; ricarica il libro: l’evidenziazione c’è ancora. Ricarica il portale: anche l’esercizio.
3. A e B offline risolvono esercizi diversi; tornati online, entrambi li vedono tutti.
4. Azzera i progressi su A; B, sincronizzato, mostra il tema azzerato e non lo ripopola.
5. Il blob nel D1 locale non contiene il testo di una query dello studente in chiaro.

### Contratti dello zaino da rispettare

Riassunti dal codice del libro (`src/lib/zaino/`, `servizi/zaino/`) il 2026-11-19. Il portale li copia in `src/zaino/`: una modifica a uno di questi punti va fatta nei due repo insieme.

- **Codice e chiavi.** 20 caratteri base32 Crockford (100 bit); da qui HKDF-SHA-256 con sale `python-doesnt-byte/zaino/1` dà l’`id` del server (etichetta `id`, 32 byte in base64url, 43 caratteri) e la chiave AES-GCM-256 (etichetta `chiave`). Il codice non lascia mai il browser.
- **Blob.** IV casuale di 12 byte ‖ AES-GCM(gzip(JSON del contenuto)); al massimo 256 KB.
- **Busta.** `{ formato: 1, sezioni: { <nome>: { formato, modificata (ISO 8601), dati } } }`. Un contenuto con `formato` più alto ferma il client con «aggiorna».
- **Sezioni sconosciute** (per il portale `quaderno`, per il libro `sql-academy`) o con `formato` più alto di quello che il client sa leggere: si conservano intatte; fra due versioni vince il formato più alto, poi la `modificata` più recente. Il client le porta dall’ultimo contenuto visto sul server (`ultimo`) a ogni PUT.
- **Sezioni registrate.** `TipoSezione`: `vuota`, `leggi`, `scrivi`, `unisci` (pura, commutativa, idempotente), `iscriviti`, `valida`, `svuota`, `pota` facoltativa.
- **Protocollo.** GET → decifra → unisci con il locale → applica in locale → se diverso dal remoto, PUT con `If-Match: "<versione>"` (`If-None-Match: *` alla creazione); su 412 si rilegge, al massimo tre volte. Un 404 su uno zaino già visto vuol dire «cancellato» e non si ricrea.
- **Stati del client.** Fasi `scollegato`, `in-corso`, `sincronizzato`, `offline`, `errore`; motivi d’errore `servizio`, `pieno`, `cancellato`, `aggiorna`, `illeggibile`. Sincronizza al caricamento, 5 s dopo l’ultima modifica, quando la scheda si nasconde o torna visibile (non prima di 30 s dall’ultima lettura) e quando torna la rete; sugli errori attese di 30 s, 1, 2, 5 e 15 minuti.
- **Modalità temporanea.** Un segno in `sessionStorage` sposta codice e sezioni in `sessionStorage` per quella scheda; «Esci» svuota le sezioni registrate e torna all’area normale.

## 6. Passaggio di consegne

**Esito:** completata il 2026-11-19 su Opus 5.5, il modello richiesto. Effort non verificabile dalla sessione. Fase non divisa.

### Decisioni con Marco (2026-11-19)

- **Interfaccia:** pagina `#/zaino` con «Apri il tuo zaino» (codice e «Non è il mio computer»), «Crea uno zaino», stato, contenuto per tema, «Mostra il codice» con «Copia il codice», «Esci dallo zaino». QR, link `#codice=` (in conflitto con il routing a hash), «Cambia codice» e «Cancella lo zaino» restano sulla pagina `/zaino` del libro, a cui la pagina rimanda. Un collegamento «Zaino» sta nell’intestazione di ogni tema e nella pagina iniziale, con un segnale quando lo zaino è senza rete o in errore.
- **Ultima query nello zaino:** sì, con il campo nuovo `queryAt` (millisecondi) in ogni esercizio; fra due copie vince la query più recente, a parità di ora il testo maggiore. Cambio compatibile della forma v2: un dato senza `queryAt` vale 0.
- **Repo di PDB:** lavoro in un worktree temporaneo del branch `dev`, poi rimosso; il checkout di Marco è rimasto su `feat/pyquest-reverse-engineering`. Due commit approvati da Marco; **deploy non eseguito**, rinviato a F10 con l’origine pubblicata del portale.

### Che cosa è stato fatto

| Percorso | Contenuto |
| --- | --- |
| `src/zaino/tipi.ts`, `cifra.ts`, `sezioni.ts`, `area.ts`, `sincronizza.ts` | Client del libro copiato; cambiano solo le chiavi locali (`sql-academy:zaino`, `sql-academy:zaino-temporaneo`), i commenti, le classi d’errore (niente proprietà nei parametri, per `erasableSyntaxOnly`) e i tipi `Uint8Array<ArrayBuffer>`. Tolti «Cancella lo zaino» e «Cambia codice». |
| `src/zaino/sezione.ts` | Sezione `sql-academy`, formato 1: `{ themes: { <tema>: { epoch, freeHintUsed, exercises } } }`; unione tema per tema con `mergeProgress`; temi sconosciuti conservati. |
| `src/progress/progress.ts` | `queryAt`; `withQuery` non cambia nulla se la query è la stessa; `readThemeData` (lettura senza versione); `mergeProgress`: epoca più alta vince per intero, poi massimo campo per campo, «o» sui booleani, query più recente. |
| `src/progress/store.ts` | Archivio comune dei progressi, letto dall’area dello zaino (`localStorage` o `sessionStorage`), con memoria di riserva; avvisa l’interfaccia di ogni cambiamento e lo zaino solo delle modifiche locali; segue l’evento `storage` delle altre schede. |
| `src/progress/useProgress.ts` | `useProgress` sopra lo store (`useSyncExternalStore`), più `useThemeProgress` per locandine e pagina dello zaino. |
| `src/zaino/ZainoPage.tsx`, `ZainoLink.tsx`, `labels.ts` | Pagina e collegamento; testi ripresi dalla pagina `/zaino` del libro. |
| `src/main.tsx`, `src/vite-env.d.ts` | Avvio dello zaino; servizio da `VITE_ZAINO_URL`, altrimenti `http://localhost:8787` in sviluppo e `https://zaino.rainbowbits.cloud` nel build. |
| `src/routing/route.ts`, `src/themes/registry.ts`, `scripts/check-themes.ts` | Rotta `#/zaino`; l’id di tema `zaino` è riservato e respinto. |
| `src/assets/icons/` | `backpack` e `right-from-bracket` (nuove, approvate da Marco, commit `ae7cbf5` del repo `icone`), `cloud-arrow-up` (dal catalogo). |
| PDB, branch `dev` | `21193ad` CORS per `http://localhost:5173` più un caso in `prova.mjs`; `41f84b7` privacy policy (§ 2.4, «Non è il mio computer», finalità «Zaino»). |

### Verifiche

| Verifica | Esito |
| --- | --- |
| `npm test` | superata: 188 test (161 prima): unione dei progressi (commutativa, idempotente, associativa, epoca che vince, campi che crescono, query più recente), sezione, cifratura, vettore di compatibilità, rotta, testi |
| `npm run build`, `npm run lint`, `npm run check:themes` | superate, uscita 0; resta l’avviso di Vite sul pacchetto principale, già noto |
| Compatibilità byte per byte | superata: in `src/zaino/zaino.test.ts` un `id` e un blob calcolati con `cifra.ts` del libro; il portale ricava lo stesso `id` e decifra il blob |
| PDB `npm run typecheck`; `npm run prova -- http://localhost:8787` | superate: 16 casi su 16, compreso «preflight e GET da SQL Academy in sviluppo → ammessi» e il rifiuto di `https://example.com` |
| Manuale 1 — A crea e risolve `ex-001`, B apre con il codice | superata: B vede `ex-001` risolto e saldo 10 |
| Manuale 2 — libro e portale sullo stesso zaino | superata: un’evidenziazione nel libro e `ex-002` risolto nel portale sopravvivono ai ricaricamenti e alle sincronizzazioni dell’altro sito |
| Manuale 3 — A e B senza rete, esercizi diversi | superata: tornata la rete, entrambi vedono `ex-001`–`ex-004`, saldo 40 |
| Manuale 4 — azzeramento su A | superata: B mostra il tema azzerato (epoca 1, saldo 0) e, risincronizzando, non lo ripopola |
| Manuale 5 — testo in chiaro nel D1 locale | superata: nessuna traccia di una query scritta apposta, né di `SELECT`, nomi di sezione o di tema |
| «Esci» e «Non è il mio computer» | superata: dopo «Esci» nessuna chiave dei progressi resta nel browser; in modalità temporanea i progressi stanno solo in `sessionStorage` e spariscono con «Esci» |
| Pagina a 375 px | superata: nessuno scorrimento orizzontale; campo e codice rimpiccioliti sotto i 40rem |

Condizioni delle prove manuali: la porta 5173 era occupata dal Vite di un altro progetto di Marco, quindi il portale girava su 5174; per le prove nel browser il Worker in `wrangler dev` ammetteva in più, solo nel worktree e mai nei commit, `http://localhost:5174` (dispositivo A) e `http://[::1]:5174` (dispositivo B, archivio separato). La rete assente è stata simulata fermando il Worker e poi con l’evento `online`. Il libro girava con `npm start` sul suo checkout. L’evidenziazione nel libro è stata creata con la sonda `window.__quaderno`, l’azzeramento con il pulsante del percorso e la conferma accettata nello script. Durante la prova Marco ha aperto da A suggerimenti e soluzione di `ex-001` già risolto: sono arrivati a B come previsto.

### Limiti e lavoro residuo

- **F10:** aggiungere al CORS del Worker l’origine pubblicata del portale e fare il deploy del Worker (Marco); impostare `VITE_ZAINO_URL` se il servizio cambia indirizzo.
- **F10:** il portale è un sito diverso dal libro e non ha ancora un’informativa propria: la privacy policy del libro descrive ora la sezione dello zaino, ma il portale deve linkarla o averne una (uso di `localStorage`, zaino).
- **F16:** l’unione può produrre un esercizio con `pointsEarned` pari al premio e `solutionBeforeSolve` vero (risolto su un dispositivo, soluzione vista prima su un altro): la plausibilità del server deve tollerarlo, come i due aiuti gratuiti già noti da F13.
- I testi della pagina sono ripresi dal libro e adattati, senza un passaggio dedicato delle norme di scrittura.
- Lo zaino ha 256 KB in tutto, condivisi con il quaderno; ogni `lastQuery` arriva fino a 20 000 caratteri. Nelle prove tre esercizi con le loro query e un’annotazione stavano in 620 byte cifrati.

### Consumo reale

Non noto.
