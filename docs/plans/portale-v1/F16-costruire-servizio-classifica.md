# F16 — Costruire il servizio della classifica

- **Modello / effort:** Opus 5.5 `medium`. Progettazione di un piccolo servizio pubblico con dati di minorenni, limiti del piano gratuito e controlli di plausibilità; se le prove sui limiti o sui controlli non convergono, alza a `high`.
- **Dipendenze:** F13 (tabelle dei premi e dei costi, forma dei progressi).
- **Consumo stimato:** medio. Un Worker di poche centinaia di righe, una tabella D1, uno script di prova; le liste dei nomi richiedono un giro con Marco.
- **Incertezza:** media. Il deploy, il dominio e la creazione del database D1 richiedono Marco; i controlli di plausibilità vanno tarati senza respingere studenti veri.
- **Punto di ripresa:** Worker che risponde in `npx wrangler dev` con lo script di prova verde, prima delle liste dei nomi e del deploy.

## 1. Obiettivo e risultato atteso

Un servizio su Cloudflare, nel repo del portale, tiene una classifica pubblica per tema e generale. Accetta i progressi di chi ha scelto di partecipare, ricalcola i punti da sé, rifiuta ciò che non è possibile, assegna a ogni partecipante un nome casuale che non si può cambiare. Costo zero sul piano Workers Free di Marco.

## 2. Contesto minimo

Decisioni di Marco (2026-11-17), riga «Classifica» delle «Decisioni condivise»:

- classifica generale e per tema, pubblica, accessibile a tutti;
- nomi assegnati a caso dal sistema, non scelti né modificabili dallo studente;
- partecipazione facoltativa, spenta all’inizio;
- la classifica mostra i primi 50 e, a chi partecipa, la propria posizione con i vicini;
- difesa contro i punteggi gonfiati: **plausibilità sul server**; nessuna verifica delle singole risposte;
- Worker proprio del portale, con un D1 suo, separato dallo zaino (che resta cifrato e illeggibile);
- costo zero: Workers Free, dove i superamenti fermano il servizio invece di costare. La quota di 100.000 richieste al giorno è **condivisa** con lo zaino di PDB.

Riferimenti: `~/Developer/github/python-doesnt-byte/servizi/zaino/` (struttura, `wrangler.toml` con log spenti, limite di frequenza, Cron Trigger, CORS) e i fatti 10, 16, 21 di `pm/piano-2026-11-quaderno.md` dello stesso repo.

### Limiti noti della difesa

Da riportare nell’informativa e nella pagina della classifica, senza enfasi: la classifica è un gioco, non un voto. La plausibilità ferma i punteggi inventati e quelli oltre il massimo, non le soluzioni lette nel codice del sito, non la copia fra compagni, non chi crea più zaini per avere più nomi.

## 3. Perimetro

Dentro: Worker `servizi/classifica/` (con `package.json`, `tsconfig.json`, `wrangler.toml` suoi, escluso dal typecheck del portale), migrazione D1, dati degli esercizi per il ricalcolo, liste dei nomi, script di prova, deploy con Marco.

Fuori: interfaccia nel portale e informativa (F17), CTF (piano successivo, ma la classifica deve poterle sommare: un tipo di attività in più nel ricalcolo, senza cambiare il protocollo).

## 4. Attività di implementazione

1. **Identità:** il client genera un gettone casuale (256 bit) e lo invia come `Authorization: Bearer`; il server conserva solo il suo SHA-256. Al primo invio il server assegna il nome. Nessun indirizzo IP, nessun `User-Agent`, nessun log (`logpush = false`, `observability` spenta, come lo zaino).
2. **Protocollo** da fissare qui, per esempio: `PUT /v1/punteggio` con i progressi per tema (esercizi risolti, suggerimenti aperti, soluzione vista prima della risoluzione, aiuto gratuito usato); `GET /v1/classifica?tema=<id>` e senza tema per la generale, primi 50; `GET /v1/posizione` con il gettone, posizione e vicini; `DELETE /v1/punteggio` per uscire dalla classifica, che cancella la riga.
3. **Ricalcolo:** uno script del portale (per esempio `npm run classifica:dati`) produce dai temi un JSON con, per ogni esercizio, tema, `id`, difficoltà e numero di suggerimenti; il Worker lo incorpora al build e usa le stesse tabelle di F13. Il server calcola il punteggio dai progressi inviati e rifiuta: `id` inesistenti, suggerimenti oltre il numero, soluzione senza tutti i suggerimenti, saldo finale negativo, più di un aiuto gratuito per tema, crescita troppo rapida fra due invii (soglia da tarare e scrivere negli esiti). La classifica generale è la somma dei temi.
4. **Nomi:** due liste italiane (per esempio aggettivo e sostantivo, neutre rispetto ai temi, perché il nome vale in tutta la classifica) più un numero; scrivile, controlla a mano che nessuna combinazione sia offensiva o ambigua, mostrale a Marco e attendi l’approvazione. Nessuna combinazione ripetuta.
5. **Protezioni:** limite di frequenza per IP tarato su una classe intera dietro lo stesso indirizzo; dimensione massima del corpo; CORS solo per l’origine di sviluppo del portale (l’origine di produzione si aggiunge in F10); `Cache-Control` breve sulla classifica pubblica per risparmiare richieste; Cron Trigger che cancella le righe ferme da 18 mesi, come lo zaino.
6. **Prova** `servizi/classifica/prova.mjs <base-url>`: iscrizione e nome, punteggio corretto, punteggio impossibile respinto, gettone sbagliato, uscita dalla classifica, CORS.
7. **Con Marco:** dominio (per esempio un sottodominio di `rainbowbits.cloud`), `npx wrangler d1 create`, migrazione remota, `npx wrangler deploy`. Nessuna di queste azioni senza il suo via.

## 5. Criteri di accettazione

| Directory | Comando | Risultato atteso |
| --- | --- | --- |
| `servizi/classifica` | `npm run typecheck` | Nessun errore |
| `servizi/classifica` | `npx wrangler dev` e, in un altro terminale, `npm run prova -- http://localhost:8787` | Tutte le prove superate |
| radice del portale | `npm test`, `npm run build`, `npm run lint`, `npm run check:themes` | Nessun errore |

Più: liste dei nomi approvate da Marco; il D1 locale non contiene gettoni in chiaro.

## 6. Passaggio di consegne

**Esito:** completata il 2026-11-19 su Opus 5.5 (effort non verificabile dalla sessione). Servizio scritto e provato in locale; liste dei nomi approvate da Marco; dominio scelto; **deploy rinviato a F10** per scelta di Marco, come lo zaino in F15. Nessuna azione remota su Cloudflare.

### Verifiche

| Directory | Comando | Esito |
| --- | --- | --- |
| `servizi/classifica` | `npm run typecheck` | superata |
| `servizi/classifica` | `npx wrangler d1 migrations apply sql-academy-classifica --local`, poi `npx wrangler dev` e `npm run prova -- http://localhost:8787` | superata: 31 casi su 31 |
| radice | `npm test` | superata: 191 test, compresi i 3 nuovi di `servizi/classifica/src/punti.test.ts` |
| radice | `npm run build`, `npm run lint`, `npm run check:themes` | superate |
| radice | `node scripts/classifica-dati.ts --controlla` | superata: il JSON è aggiornato |
| `servizi/classifica` | gettone inviato con `curl`, poi `npx wrangler d1 execute … --local` su `partecipanti` | superata: il D1 contiene l’impronta SHA-256 del gettone, non il gettone |

Non eseguite: migrazione remota, deploy e prova sul dominio (F10).

### File

| File | Contenuto |
| --- | --- |
| `servizi/classifica/src/index.ts` | Worker: protocollo, identità, controllo della crescita, CORS, Cron Trigger |
| `servizi/classifica/src/punti.ts` | ricalcolo dei punti di un tema e controlli di plausibilità |
| `servizi/classifica/src/nomi.ts` | liste dei nomi approvate e scelta casuale |
| `servizi/classifica/src/esercizi.json` | generato: tabelle di `src/points/points.ts` e, per tema, difficoltà e numero di suggerimenti di ogni esercizio |
| `servizi/classifica/src/punti.test.ts` | 4000 partite oneste simulate con le funzioni di F13: il server le accetta tutte con il saldo del portale |
| `servizi/classifica/migrations/0001_classifica.sql` | tabelle `partecipanti` e `punteggi` |
| `servizi/classifica/prova.mjs` | prova contro un servizio vivo |
| `servizi/classifica/wrangler.toml`, `package.json`, `tsconfig.json` | come lo zaino; il typecheck del Worker esclude i test |
| `scripts/classifica-dati.ts` | `npm run classifica:dati` scrive il JSON; con `--controlla` esce con 1 se è vecchio |

Fuori dal Worker cambiano solo `package.json` (script `classifica:dati`), `vite.config.ts` (Vitest legge anche `servizi/*/src/**/*.test.ts`) e `.gitignore` (`.wrangler/`).

### Protocollo definitivo

Gettone: 32 byte casuali in base64url (43 caratteri), generati dal portale, in `Authorization: Bearer <gettone>`. Il server conserva solo l’impronta SHA-256 esadecimale.

| Richiesta | Corpo o parametri | Risposte |
| --- | --- | --- |
| `PUT /v1/punteggio` | `{ "themes": { "<tema>": <ThemeProgress> } }`; i temi assenti non cambiano; dei progressi si leggono solo `freeHintUsed` e, per esercizio, `solved`, `hintsRevealed`, `solutionBeforeSolve`, `pointsSpent` (il resto, `lastQuery` compresa, si ignora: il portale farà bene a non inviarlo) | 200 `{ name, themes: { <tema>: punti }, total }` (tutti i temi del partecipante) · 400 JSON rotto o `themes` mancante · 401 gettone · 413 oltre 128 KB · 422 progresso impossibile, motivo in testo · 429 crescita troppo rapida, limite per IP o iscrizioni nuove oltre i limiti, con `Retry-After` in secondi |
| `DELETE /v1/punteggio` | — | 204, anche se il partecipante non c’è; cancella nome e punti |
| `GET /v1/classifica[?tema=<id>]` | senza gettone | 200 `{ theme, entries: [{ rank, name, points }] }`, primi 50, `Cache-Control: public, max-age=60` · 400 tema sconosciuto |
| `GET /v1/posizione[?tema=<id>]` | gettone | 200 `{ name, theme, rank, points, neighbors: [{ rank, name, points, me }] }`, due sopra e due sotto; `rank` è `null` se non ci sono punti in quella classifica · 404 se il gettone non partecipa |

Il primo `PUT` crea il partecipante e gli assegna il nome; un `PUT` con `themes: {}` iscrive senza punti. A pari punti viene prima chi li ha raggiunti prima (`raggiunto`). La generale è la somma dei temi. Gli errori sono testo semplice, le risposte riuscite JSON.

### Controlli di plausibilità

Respinti con 422: tema o esercizio sconosciuti; campi mancanti o di tipo sbagliato; suggerimenti oltre il numero; soluzione vista prima della risoluzione senza tutti i suggerimenti; spesa che non è `k × prezzo del suggerimento` (più il prezzo della soluzione, se vista prima) con `k` fra 0 e i suggerimenti aperti; esercizio non risolto (o risolto dopo la soluzione) con più di un suggerimento non pagato; più di un aiuto gratuito nel tema, o uno senza `freeHintUsed`; saldo negativo. I punti guadagnati si ricalcolano dalla difficoltà; quelli dichiarati si ignorano.

Crescita: i punti di un tema possono salire di **300 subito più 60 al minuto** dall’ultima volta che sono cambiati (per un tema nuovo, dall’iscrizione). Oltre, 429 con `Retry-After` e nulla cambia; riprovando dopo l’attesa l’invio passa. La discesa (azzeramento) è sempre ammessa. Diversamente dal piano, il rifiuto è temporaneo e non definitivo: uno studente vero che si iscrive con molti punti già fatti non resta fuori, aspetta (con 3000 punti, circa 45 minuti).

### Protezioni

300 richieste al minuto per IP (`[[ratelimits]]`, `namespace_id = "1002"`; lo zaino usa 1001); iscrizioni nuove limitate a 30 al minuto per IP (`ISCRIZIONI`, `namespace_id = "1003"`) e a 1000 al giorno UTC su tutto il servizio (tabella `iscrizioni`, migrazione `0002`), oltre i limiti 429 con `Retry-After` (aggiunto dopo la revisione pre-produzione del 2026-11-19, scelta di Marco: uno script non deve poter esaurire i nomi o la quota di D1); corpo fino a 128 KB; CORS solo per `http://localhost:5173`, altre origini 403; log spenti; Cron Trigger alle 03:47 UTC che cancella i partecipanti fermi da 18 mesi (contati dall’ultimo `PUT`) con i loro punti.

### Nomi

«Animale Aggettivo Numero»: 39 animali, 31 aggettivi in -e (nessun accordo di genere), numeri da 10 a 99 senza 14, 18, 69 e 88; 103.974 combinazioni, unicità garantita da `UNIQUE`. Approvate da Marco il 2026-11-19 senza modifiche.

### Dominio e deploy

Nomi: Worker e D1 `sql-academy-classifica`; dominio `sql-classifica.rainbowbits.cloud` (Marco, 2026-11-19), già scritto commentato in `wrangler.toml`. In F10, con il via di Marco: `npx wrangler d1 create sql-academy-classifica`, id nel `wrangler.toml` al posto del segnaposto, `npx wrangler d1 migrations apply sql-academy-classifica --remote`, `routes` attivo, origine di produzione nel CORS, `npx wrangler deploy`, `npm run prova -- https://sql-classifica.rainbowbits.cloud`. Aggiunto alle attività di F10.

### Limiti

- Oltre a quelli del § 2: la crescita rallenta chi inventa un progresso, non lo ferma (basta aspettare).
- Due dispositivi che usano l’aiuto gratuito del tema prima di sincronizzarsi producono, uniti dallo zaino, due aiuti gratuiti: il server respinge quel tema finché lo studente non lo azzera. Caso raro; F17 dovrebbe mostrarlo come errore, non riprovare all’infinito.
- I controlli usano i prezzi attuali: se F13 cambiasse i prezzi, i progressi pagati con i vecchi verrebbero respinti. Togliere un esercizio da un tema ha lo stesso effetto per chi l’aveva aperto.
- **Ogni cambio degli esercizi** (tema nuovo, esercizio aggiunto, suggerimenti cambiati) richiede `npm run classifica:dati` e un nuovo deploy del Worker; prima del deploy gli esercizi nuovi danno 422. La guida «Aggiungere un tema» del `README.md` lo dice; aggiungere il controllo `--controlla` al workflow di F10 eviterebbe dimenticanze.

### Per F17

Il gettone sta nella sezione `sql-academy` dello zaino; il portale invia i progressi senza `lastQuery`; un 422 è definitivo per quei progressi (mostrare il motivo, non riprovare), un 429 si riprova dopo `Retry-After`. `wrangler dev` del servizio usa la porta 8787 come quello dello zaino: per averli entrambi, uno dei due va avviato con `--port`.

Consumo reale: non misurato.
