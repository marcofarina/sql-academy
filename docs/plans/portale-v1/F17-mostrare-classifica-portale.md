# F17 — Mostrare la classifica nel portale

- **Modello / effort:** Opus 5.5 `medium`. Interfaccia nuova con scelte di interazione, icone da disegnare e un testo d’informativa per minorenni.
- **Dipendenze:** F14 (saldo e punti visibili), F15 (zaino nel portale), F16 (servizio della classifica).
- **Consumo stimato:** medio.
- **Incertezza:** media: il testo dell’informativa richiede l’approvazione di Marco e può richiedere più giri.
- **Punto di ripresa:** adesione alla classifica funzionante contro `wrangler dev`, prima della pagina della classifica.

## 1. Obiettivo e risultato atteso

Uno studente con lo zaino aperto può scegliere di partecipare alla classifica; da quel momento i suoi punti arrivano al servizio e lui ha un nome. Chiunque, anche senza zaino, vede la classifica generale e per tema; chi partecipa vede anche la propria posizione.

## 2. Contesto minimo

- Riga «Classifica» delle «Decisioni condivise»; passaggi di consegne di F14, F15, F16 (protocollo, limiti noti).
- Sezione «Icone» del piano e skill `icone-rb`: servono almeno classifica (podio o coppa) e partecipazione.
- Norme: `.claude/norms/scrittura-didattica.md` e `scrittura-umana.md` per i testi rivolti agli studenti.

## 3. Perimetro

Dentro:

- **Adesione:** interruttore «Partecipa alla classifica», spento di default. Proposta di Claude, da confermare con Marco all’inizio della fase: si partecipa solo con lo zaino aperto, perché il gettone della classifica vive nella sezione `sql-academy` dello zaino; senza zaino, un PC del laboratorio che si azzera darebbe a ogni lezione un nome nuovo. Disattivare l’interruttore chiama l’uscita dalla classifica e cancella la riga sul server.
- **Invio dei punti:** quando i progressi cambiano, con attesa (per esempio dopo la sincronizzazione dello zaino), mai a ogni tasto; errori e quota esaurita gestiti come lo zaino (attesa crescente, nessun blocco del lavoro).
- **Pagina della classifica** a livello di portale (per esempio `#/classifica`, non una settima sezione del tema): generale e per tema, primi 50, la propria posizione con i vicini se si partecipa, il proprio nome ben visibile. Righe con nome, punti e tema; nessun altro dato.
- **Informativa:** una pagina del portale che dice quali dati vanno dove (progressi nel browser, zaino cifrato, classifica in chiaro con nome casuale e punti), per quanto tempo, come uscire; e i limiti della classifica (§ 2 di F16). Testo approvato da Marco prima del commit.

Fuori: gradi e traguardi, CTF, moderazione dei nomi (non servono: li assegna il sistema).

## 4. Attività di implementazione

1. Icone, come da sezione «Icone» del piano.
2. Gettone nella sezione dello zaino, interruttore, invio dei punti, uscita.
3. Pagina della classifica e collegamento dall’elenco dei temi e dall’intestazione.
4. Informativa; mostrala a Marco.
5. Test dell’invio (attesa, errori) e dei casi di adesione e uscita.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm test`, `npm run build`, `npm run lint`, `npm run check:themes` | Nessun errore |

Procedura manuale con `npm run dev` e i due Worker in `wrangler dev`:

1. Senza zaino la pagina della classifica si apre e l’interruttore spiega che serve lo zaino.
2. Con lo zaino, attiva la partecipazione: compare il nome assegnato.
3. Risolvi un esercizio: entro l’attesa prevista la classifica generale e quella del tema mostrano i nuovi punti.
4. Apri lo stesso zaino su un secondo contesto del browser: stesso nome, stessa posizione.
5. Disattiva la partecipazione: il nome sparisce dalla classifica.
6. Ferma il Worker della classifica: il portale continua a funzionare e segnala la classifica non raggiungibile.

## 6. Passaggio di consegne

**Esito:** completata il 2026-11-19 19:01 su Opus 5.5, il modello richiesto. Effort non verificabile dalla sessione. Fase non divisa.

### Decisioni con Marco (2026-11-19)

- **Adesione solo con lo zaino aperto**, come proposto nel § 3. Senza zaino l’interruttore è disattivato e spiega perché, con un collegamento alla pagina dello zaino.
- **Interruttore solo nella pagina della classifica**; la pagina dello zaino lo cita con una riga.
- **Icone:** coppa per la classifica (`trophy`), cartellino col nome per la partecipazione (`id-badge`); per l’informativa `shield-check`, dal catalogo.
- **Informativa:** tolta la sezione sui limiti della classifica (soluzioni copiate o lette nel codice, più zaini per più nomi), che il § 3 chiedeva: Marco preferisce non suggerire agli studenti come ingannare la classifica. Per coerenza la stessa frase è uscita anche dalla pagina della classifica, dove resta «La classifica è un gioco, non un voto». Nei testi per gli studenti si usa *token*, definito alla prima occorrenza, non «gettone»; contatto `privacy@rainbowbits.cloud`, **casella ancora da creare** (Marco).
- **Norma:** dalle correzioni di Marco ai testi è nata la sezione 12 di `norms/scrittura-umana.md` («Parole di comodo e frasi che si appoggiano al contesto»), approvata da Marco.

### Decisioni di Claude

- **Dove vive il token:** chiave `sql-academy:classifica` nell’area dello zaino, `{ gettone, at }`, e campo facoltativo `classifica` della sezione `sql-academy` (formato sempre 1: nessun client pubblicato da migrare). Fra due copie vince la scelta più recente (`at`), così anche l’uscita fatta su un dispositivo arriva agli altri. «Esci dallo zaino» toglie il token dal browser senza cancellare la riga sul servizio.
- **Iscrizione in due passi:** `PUT` con `themes: {}` per avere il nome, poi i progressi. Chi entra con molti punti non resta fermo sul 429 della crescita: ha subito un nome e vede arrivare i punti.
- **Invio:** 5 secondi dopo un cambiamento dei progressi o dell’adesione, solo se i progressi da inviare sono diversi dall’ultimo invio riuscito. Si inviano solo `freeHintUsed` e, per gli esercizi che contano, `solved`, `hintsRevealed`, `solutionBeforeSolve`, `pointsSpent`: scrivere una query non fa partire nessuna richiesta. Guasti e rete assente: attese di 30 s, 1, 2, 5, 15 minuti, come lo zaino; 429: dopo `Retry-After`.
- **422 su un tema:** il servizio respinge l’intero invio; se il motivo comincia con l’`id` di un tema, quel tema resta fuori finché i suoi progressi non cambiano e gli altri partono subito. La pagina mostra il motivo, con un testo apposito per i due aiuti gratuiti noti da F16 (consiglia di azzerare il tema).
- **Token sostituito da un altro dispositivo** (due adesioni quasi simultanee): il vecchio esce con `DELETE`, se il servizio risponde.
- **Uscita:** prima `DELETE`, poi la scelta si spegne; senza rete l’interruttore resta acceso e la pagina lo dice.
- **Cache:** chi partecipa rilegge i primi 50 con `cache: 'no-cache'`, per vedere subito i propri punti; gli altri usano la cache di un minuto del servizio. La pagina aperta rilegge ogni minuto.
- **Indirizzi:** `#/classifica` e `#/informativa`; i nomi delle pagine del portale (`PORTAL_PAGES` in `src/routing/route.ts`) sono riservati e il registro e `check:themes` li respingono come `id` di tema. Servizio da `VITE_CLASSIFICA_URL`, altrimenti `http://localhost:8788` in sviluppo (la 8787 è dello zaino) e `https://sql-classifica.rainbowbits.cloud` nel build.

### File

| Percorso | Contenuto |
| --- | --- |
| `src/classifica/adesione.ts` | token, unione delle adesioni, archivio con avvisi locali e da zaino |
| `src/classifica/servizio.ts` | richieste al servizio ed esiti tipizzati; `progressiDaInviare` |
| `src/classifica/invio.ts` | controllore dell’invio (`creaControllore`), istanza del portale, `useStatoClassifica` |
| `src/classifica/labels.ts` | testi dello stato, dei rifiuti e delle scelte |
| `src/classifica/ClassificaPage.tsx`, `ClassificaLink.tsx`, `InformativaPage.tsx` | pagine e collegamento nelle intestazioni |
| `src/classifica/classifica.test.ts` | 16 test: adesione, sezione, campi inviati, esiti, attesa, 429, guasti, 422 per tema, uscita, token sostituito, «Esci dallo zaino» |
| `src/zaino/sezione.ts`, `src/zaino/ZainoPage.tsx` | adesione nella sezione; righe verso classifica e informativa |
| `src/routing/route.ts`, `src/App.tsx`, `src/main.tsx`, `src/themes/registry.ts`, `scripts/check-themes.ts` | rotte, avvio, nomi riservati |
| `src/pages/HomePage.tsx`, `src/pages/ThemePage.tsx`, `src/styles.css` | collegamento «Classifica» e stili (sezione «Classifica (F17)») |
| `src/assets/icons/` | `trophy`, `id-badge` (nuove), `shield-check` (catalogo) |

### Verifiche

| Verifica | Esito |
| --- | --- |
| `npm test` | superata: 208 test (191 prima) |
| `npm run build`, `npm run lint`, `npm run check:themes` | superate; resta l’avviso di Vite sul pacchetto principale, già noto |
| `node scripts/classifica-dati.ts --controlla`, `npm run typecheck` in `servizi/classifica` | superate |
| Prova di mutazione | superata: togliendo la regola che non anticipa il tentativo dopo un 429, il test relativo fallisce |
| Manuale 1 — senza zaino | superata: la pagina si apre, l’interruttore è disattivato e spiega che serve lo zaino |
| Manuale 2 — con lo zaino, attiva | superata: compare il nome assegnato («Lince Perspicace 99») |
| Manuale 3 — risolto `ex-001` | superata: dopo 7 secondi generale e Star Wars mostrano 10 punti; nella pagina la riga «(tu)» è evidenziata |
| Manuale 4 — stesso zaino su un secondo contesto | superata: stesso nome, stessa posizione |
| Manuale 5 — disattivata dal secondo contesto | superata: il nome sparisce dalla classifica; il primo contesto, sincronizzato lo zaino, risulta fuori e non rimanda punti |
| Manuale 6 — Worker della classifica fermo | superata: un suggerimento aperto e lo zaino funzionano, la pagina dice «La classifica non risponde: riprovo alle…» e mostra l’avviso; riavviato il Worker, l’invio riprende da solo |
| Pagine a 375 px | superata dopo una correzione (la tabella scorreva in orizzontale): nessuno scorrimento orizzontale in classifica, informativa e intestazioni |

Condizioni delle prove manuali: la porta 5173 era occupata dal Vite di un altro progetto di Marco, quindi il portale girava sulla 5174. Il Worker della classifica (porta 8788) e quello dello zaino (porta 8787, da un worktree temporaneo del branch `dev` di PDB, poi rimosso) ammettevano in più `http://localhost:5174` e `http://[::1]:5174` (secondo contesto, archivio separato), solo durante la prova e mai nei commit. Il browser integrato conservava uno zaino di prova di F15, ormai inesistente: chiuso con «Esci» prima di cominciare. Le conferme del browser sono state accettate dallo script.

### Icone e collaudo della skill

Due icone nuove disegnate con Opus 5.5 e approvate da Marco al primo giro: `trophy` (coppa con anse, stella primaria nel calice, gambo e base primari) e `id-badge` (cartellino orizzontale con fermaglio, sagoma e due righe del nome); commit `8db202a` del repo `icone`, branch `dev`, senza push. Esito del collaudo:

- la ricerca non trovava nulla per coppa, podio, classifica, medaglia, cartellino, utente: risultato corretto;
- il primo `id-badge`, verticale (`W` = 384), superava il 90% di copertura (R1.6): un cartellino è quasi tutto massa. Ridisegnato orizzontale a `W` = 576, copertura 83%, solo avviso. `STILE.md` potrebbe citare i contenitori pieni fra i casi da disegnare più larghi;
- nessun problema di strumenti.

### Limiti e lavoro residuo

- **F10:** creare la casella `privacy@rainbowbits.cloud` prima della pubblicazione; aggiungere al CORS della classifica l’origine di produzione (già previsto).
- Un token sostituito mentre il servizio non risponde, o dopo un ricaricamento della pagina, resta sul servizio con il vecchio nome finché il Cron Trigger non lo cancella dopo 18 mesi.
- Senza partecipare, la pagina può mostrare i primi 50 di fino a un minuto prima (cache del servizio).
- Nella pagina dello zaino resta una frase di F15, «ci mette dentro i progressi», contraria alla nuova sezione 12 della norma: non toccata, fuori perimetro.
- Il controllo della classifica con un lettore di schermo non è stato fatto.

### Consumo reale

Non noto.
