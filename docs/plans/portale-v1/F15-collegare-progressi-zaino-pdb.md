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

## 6. Passaggio di consegne

Da compilare a fine fase: esito, verifiche, commit nel portale e in PDB (con branch), deploy eseguito o no, decisioni con Marco sull’interfaccia, limiti, consumo reale se noto.
