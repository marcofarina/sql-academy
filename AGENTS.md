# SQL Academy

Portale di addestramento a SQL per studenti, diviso in **temi**: ogni tema è un universo narrativo (per esempio Star Wars) con un proprio database interrogabile, i propri esercizi e una propria veste grafica. Il portale accompagna il *Manuale dell’Archivista*, il terzo volume di *Python Doesn’t Byte*, ma nasce prima delle lezioni sul linguaggio SQL: le lezioni di interrogazione del volume non sono ancora scritte.

Repo git indipendente dentro il workspace `~/Developer/github/`, ignorato dal repo del workspace. Creato il 2026-11-16, senza remote.

## Stato

| Data | Fatto |
| --- | --- |
| 2026-11-16 | Repo inizializzato con questo file, `CLAUDE.md`, `.gitignore` e il symlink alle norme. Nessuno stack scelto, nessun piano. |
| 2026-11-16 | Decisioni strutturali prese con Marco e piano `portale-v1` scritto in `docs/plans/portale-v1/` (dieci fasi). Branch `dev` creato. Nessun codice. |
| 2026-11-16 | F01 completata: scheletro Vite, contratto del tema (`src/themes/`), motore SQLite in un worker con watchdog (`src/sql/`), tema segnaposto `themes/star-wars/`. Comandi: `npm run dev`, `build`, `test`, `lint`. |
| 2026-11-16 | F02 completata: tipo `Exercise` e file `themes/<id>/esercizi.ts`, verifica delle risposte (`src/exercises/`), `npm run check:themes`. Tre esercizi segnaposto nel tema `star-wars`. |
| 2026-11-17 | F03 completata: routing `#/<tema>/<sezione>`, elenco dei temi, guscio con sei sezioni, sandbox con editor CodeMirror (`src/sandbox/`), icone RB comuni in `src/assets/icons/` con il componente `src/icons/Icon.tsx`. |
| 2026-11-17 | F04 completata: database Star Wars completo (`schema.sql`, `dati.sql`, con `fazioni.leader_id` verso `personaggi`) e 105 esercizi del prototipo (non 121: errore di conteggio nel piano) in `themes/star-wars/esercizi.ts`, tutti verificati su SQLite. Difetti di schema e incongruenze nel dettaglio della fase. |
| 2026-11-17 | F05 completata: addestramento (percorso, esercizio, sessioni), catalogo «Tutte le query», progressi in `localStorage` (`src/training/`, `src/progress/`). Marco vuole un sistema a punti: brainstorming e nuove fasi del piano ancora da fare. |
| 2026-11-17 | Brainstorming sul sistema a punti con Marco: aggiunte al piano F13–F17 (regole dei punti, interfaccia, progressi nello zaino di PDB, servizio e pagina della classifica). Nessun codice. CTF, gradi e traguardi rinviati a un piano successivo. |
| 2026-11-17 | F06 completata: sezione «Modello logico» generata dal database (`src/logical/`), sezione «Schema ER» con il componente del libro (`src/er/`, dipendenza `roughjs`, carattere Excalifont) e `themes/star-wars/er.ts`; `check:themes` controlla la coerenza fra ER e tabelle. |
| 2026-11-17 | F07 completata: analisi del dominio in `themes/star-wars/analisi.md`, approvata da Marco, e sezione «Analisi» (`src/analysis/`); titoli, consegne e suggerimenti dei 105 esercizi riscritti; pianeta Yavin 4 aggiunto ai dati; ex-088 riscritto sui pianeti. |
| 2026-11-18 | F11 completata: tavole della veste nell’Artifact «Design», approvate da Marco; specifiche `docs/design/neutra.md` (locandine sul tavolo) e `docs/design/star-wars.md` (schema chiaro X-wing e scuro Morte Nera); contrasti con `node docs/design/contrasto.mjs`. |
| 2026-11-18 | F08 completata: contratto della veste (manifest con `motto`, `icons`, `schemes`; `stile.css`, `locandina.css`, `icone/`, `fonts/`), veste Star Wars con schemi chiaro e scuro, pagina iniziale a locandine (`src/pages/HomePage.tsx`), numeri della scheda calcolati al build (`virtual:theme-stats`). Tre scostamenti dalla tavola, confermati da Marco, nel dettaglio della fase. |
| 2026-11-18 | F12 completata: specifica `docs/design/lotr.md` con schema chiaro «la mappa della Contea» e scuro «le porte di Moria», approvati da Marco; sei icone tematiche nella libreria (commit `1f16200` del repo `icone`); due lacune del contratto da risolvere in F09. |
| 2026-11-18 | F09 completata: tema `themes/lotr/` con sette tabelle (`partecipazioni` e `tappe` molti a molti), 20 esercizi, veste chiara e scura; correzione del contratto `icons.sections` (commit `eb8a74d`); guida «Aggiungere un tema» nel `README.md`. |
| 2026-11-18 | Feedback di Marco su F09: rifiniture fatte subito (barra di scorrimento stabile, selettore che scorre, chiavi esterne nel pannello delle tabelle, parole chiave solo a esercizio risolto, decorazioni LOTR più grandi); aggiunte al piano F18–F21 (indicatore animato e icona della sessione, sezione «Traccia», modello logico UML, esercizi LOTR a circa cento), che precedono F10. |
| 2026-11-18 | Obiettivo di Marco: circa 150 esercizi distinti per tema. F21 arricchisce i dati di LOTR prima degli esercizi; nuova F22 porta Star Wars da 105 a circa 150. Entrambe precedono F10. |
| 2026-11-18 | F18 completata: indicatore della sezione unico e animato (`src/pages/SectionIndicator.tsx`, aspetto nelle vesti con `.sections-indicator::after`); icona comune `rocket` per la sessione e campo `icons.session` del contratto (`x-wing`, `tie-fighter`, `hobbit-backpack`); poi `icons.reset` per «Azzera i progressi» (`volcano`, `battle-station-damaged`). |
| 2026-11-18 | F19 completata: la sezione «Analisi» diventa «Traccia» (`#/<tema>/traccia`, `themes/<id>/traccia.md`, `src/trace/`, `loadTrace`); la pagina si apre con il titolo del testo; grassetti su entità, cardinalità e dati mancanti nei due testi, approvati da Marco. |
| 2026-11-18 | F20 completata: sezione «Modello logico» come diagramma UML generato dal database (`src/logical/`), posizioni delle tabelle dichiarate in `themes/<id>/logico.ts` (nuovo file facoltativo del contratto, `Theme.loadLogical`), linee e sovrapposizioni controllate da `check:themes`. |
| 2026-11-18 | F21 completata: LOTR con forze schierate nelle battaglie (`forze_popoli_liberi`, `forze_ombra`, quasi tutte stime), date delle tappe (`tappe.data` al posto di `anno`, dalla cronologia delle Appendici) e tre pugnali dei Tumuli; 140 esercizi su SQLite, con date, testo, `CASE`, `WITH`, `EXISTS` e `UNION`. |
| 2026-11-18 | F22 completata: Star Wars da 105 a 150 esercizi su SQLite (`ex-106`–`ex-150`), con facili in ogni capitolo e sottoquery da 10 a 26 (`EXISTS`, correlate, nel `FROM`, `WITH`, `UNION`); nessun dato nuovo. |
| 2026-11-19 | F13 completata: regole dei punti (`src/points/`), progressi versione 2 (`sql-academy:<tema>:v2`, con epoca di azzeramento), saldo ricavato dai record; aiuti pagati con il saldo, primo aiuto del tema gratuito. Saldo e costi ancora non visibili: F14. |
| 2026-11-19 | F14 completata: saldo nell’intestazione del tema (`src/points/Balance.tsx`, evidenza e annuncio cortese), costi e motivi sui pulsanti d’aiuto, premi in percorso e catalogo, punti nel riepilogo della sessione, saldo sulle locandine; testi in `src/points/labels.ts`. Icone `coin`, `circle-plus`, `circle-minus`, `lock`. |
| 2026-11-19 | F15 completata: progressi nello zaino di PDB, sezione `sql-academy` (`src/zaino/`, client copiato dal libro, stesso codice e stessa cifratura), archivio comune `src/progress/store.ts`, pagina `#/zaino` e collegamento «Zaino»; campo `queryAt` negli esercizi. In PDB, branch `dev`: CORS per `localhost:5173` e privacy policy; deploy del Worker in F10. Icone `backpack`, `right-from-bracket`, `cloud-arrow-up`. |
| 2026-11-19 | F16 completata: servizio della classifica in `servizi/classifica/` (Worker, D1, ricalcolo dei punti, nomi casuali approvati da Marco), `npm run classifica:dati`; provato con `wrangler dev`. Deploy, D1 remoto e dominio `sql-classifica.rainbowbits.cloud` in F10. |
| 2026-11-19 | F17 completata: classifica nel portale (`src/classifica/`): adesione solo con lo zaino, token nella sezione `sql-academy`, invio dei punti con attesa, pagine `#/classifica` e `#/informativa`. Icone `trophy`, `id-badge`, `shield-check`. Casella `privacy@rainbowbits.cloud` da creare prima di F10. |
| 2026-11-19 | Revisione pre-produzione: limite sulle iscrizioni alla classifica, 30 al minuto per IP e 1000 al giorno su tutto il servizio (migrazione `0002_iscrizioni.sql`), contro chi vuole esaurire i nomi o la quota di D1. |
| 2026-11-19 | Codice dello zaino a quattro parole (44 bit, elenco di 2048 approvato da Marco), deciso con Marco e fatto prima in PDB (commit `6fe2e49`, branch `claude/zaino-parole-191479`, non ancora in `dev`); qui ricopiati `src/zaino/parole.ts`, `cifra.ts`, la nuova estrazione su 412 in `sincronizza.ts` e i testi. I codici di 20 caratteri aprono ancora il loro zaino. |
| 2026-11-20 | F10 in corso: repo pubblico `marcofarina/sql-academy`, sito su `http://sql.rainbowbits.cloud/` da `main` (workflow `pubblica.yml`), licenze MIT e CC BY-NC-SA 4.0; zaino di PDB e classifica distribuiti con il CORS di produzione, D1 della classifica creato. Restano certificato HTTPS, procedura manuale e link dal libro. |
| 2026-11-21 | Feedback di Marco sul sito pubblicato: piano `portale-v1` archiviato in `docs/plans/archivio/portale-v1/` con F10 `in corso` (HTTPS già attivo); nuovo piano `portale-v2` in `docs/plans/portale-v2/` (venti fasi): chiusura della pubblicazione, barra comune con stato dello zaino e «Indietro», notifica dell’esito, sessione riprendibile, pagine Zaino e Classifica ridisegnate, scelta di otto mondi nuovi e dei livelli, piè di pagina da predisporre (contenuto da una sessione in `~/Developer/github/`), più dieci idee scelte da Marco (F11–F20: errori in italiano, ripasso, segnalazioni, consegne con un link, database da scaricare, sito senza rete, test end-to-end, controllo degli esercizi, generatore di temi e altre). Nessun codice. |
| 2026-11-21 | Piano `portale-v2` eseguibile anche con Codex: colonne «Claude» e «Codex» nell’indice (Opus ↔ Sol, Sonnet ↔ Terra), modelli senza versione, effort solo indicativo per Marco; F02 e F03 solo Claude. Skill `piani-multisessione` spostata in `~/Developer/github/norms/skills/`, collegata per Claude Code e Codex. |
| 2026-11-21 | F01 di `portale-v2` completata: procedura manuale sul sito pubblicato superata (temi, sandbox, esercizio, zaino su due browser, classifica); branch predefinito del repo ora `main`. F10 del piano archiviato chiusa; resta a Marco il link dal libro. |
| 2026-11-21 | F19 di `portale-v2` completata: `check:themes` segnala come errori ordine ambiguo (`ORDER BY` o `LIMIT` con pareggi), parole chiave assenti dalla query attesa e `WHERE` che non filtra; come avvisi risultati identici, una riga per una consegna al plurale e parole chiave non dichiarate (`src/exercises/quality.ts`). Parole chiave completate in 14 esercizi; riscritti `lotr/ex-140`, `star-wars/ex-060` ed `ex-068`, con gli stessi id. |
| 2026-11-21 | F06 di `portale-v2` completata: sessione riprendibile per tema e area dei progressi (`src/training/sessionStorage.ts`); ripresa, abbandono, azzeramento e isolamento fra temi verificati nel browser. |
| 2026-11-21 | Revisione di F06 fatta da Claude: la sessione salvata ora sparisce anche con «Esci dallo zaino»; schermata della sessione salvata rifinita. Aggiunte al piano e alla skill `piani-multisessione` la revisione incrociata delle fasi a rischio, gli scostamenti nel passaggio di consegne e la riga che identifica strumento e modello nei commit. |
| 2026-11-21 | F02 di `portale-v2` completata: barra comune in una riga sola, stato dello zaino in sei stati (forma, distintivo, parola), notifica dell’esito con «OK» che si riempie in 4 secondi; specifica `docs/design/barra-notifica.md`, tavole nell’Artifact «Design» approvate da Marco, palette `barra-notifica` in `contrasto.mjs`. |
| 2026-11-21 | F04 di `portale-v2` completata: barra comune (`src/pages/SiteLayout.tsx`), ritorno alla pagina precedente, sei stati dello zaino; distintivo «senza rete» con la nuova icona RB `cloud-slash` (commit `014f84a` del repo `icone`). |
| 2026-11-21 | F10 di `portale-v2` completata: piè di pagina comune (`src/footer/`), contenuti provvisori in `src/footer/contenuti.tsx` da sostituire con quelli della sessione trasversale in `~/Developer/github/`. |
| 2026-11-21 | F05 di `portale-v2` completata. La notifica dell’esito mostra premio, saldo e conferma dello zaino (`src/training/ExerciseNotice.tsx`). Dopo una risposta corretta il salvataggio parte subito. |
| 2026-11-21 | Revisione di F05 fatta da Claude: nessun difetto. F03 di `portale-v2` completata: specifica `docs/design/zaino-classifica.md`, tavole approvate da Marco nell’Artifact «Design»; classifica a podio e lista con la colonna dei mondi per livello, zaino con quattro caselle numerate e creazione in tre passi. Nessuna modifica al servizio. |
| 2026-11-21 | F07 di `portale-v2` completata: Zaino con apertura a quattro caselle, codici precedenti e creazione in tre passi. Classifica con podio, lista, posizione personale e selettore dei mondi su desktop e telefono. Flussi verificati in Chrome a 1280 e 375 px con servizi simulati. |
| 2026-11-22 | F11 di `portale-v2` completata: spiegazioni degli errori di SQLite con indizi dallo schema e messaggio originale, nella sandbox e negli esercizi (`src/sandbox/SqlErrorNotice.tsx`). Testi approvati da Marco e verificati nel browser. |
| 2026-11-23 | Revisione di F07 fatta da Claude: nessun difetto; creazione, apertura e uscita dello zaino e uscita dalla classifica ricontrollate nel codice. |
| 2026-11-23 | F08 di `portale-v2` completata: livelli dei mondi (facile, intermedio, complesso) e otto opere nuove scelte da Marco, con abbozzi dei domini, CTF e ordine di costruzione in `docs/mondi.md`. Nessun codice. |
| 2026-11-23 | F13 di `portale-v2` completata: segnalazioni dagli esercizi del percorso e della sessione, via e-mail o GitHub, con query escludibile e revisione del sito. Informativa aggiornata e prove superate in Chrome nei due temi. |
| 2026-11-23 | F12 di `portale-v2` completata: ripasso a intervalli di 1, 3, 7 e 21 giorni, zero punti, scelto da Marco (`src/training/review.ts`); campi `solvedAt`, `reviewStep`, `reviewAt` nei progressi, senza migrazione, uniti nello zaino. Da rivedere su Codex. |
| 2026-11-23 | F14 di `portale-v2` completata: consegna con un link (`#/<tema>/addestramento/consegna/1.<numeri>/<titolo>`, `src/consegna/`), pagina `#/docente` collegata dal piè di pagina, punti normali, avviso prima di sostituire una sessione, riepilogo con data e ora. Scelte di Marco tutte come proposte. Da rivedere su Codex. |
| 2026-11-23 | F16 di `portale-v2` completata: «Riprendi da dove eri» sulla locandina e nel percorso (`src/training/resume.ts`, dall’ultimo `queryAt`), guida al primo ingresso in un riquadro chiudibile (`src/guide/`), segno `sql-academy:guida` per sito cancellato da «Azzera i progressi» e da «Esci dallo zaino», pulsante «Guida» con la nuova icona RB `circle-question` (commit `f2f64b2` del repo `icone`). Da rivedere su Codex. |
| 2026-11-23 | Revisioni di F16, F12 e F14 completate su Codex Sol. Corretto il fuoco della guida, conservata la bozza del ripasso nella sessione e ripristinato l’avvio di una nuova sessione dopo il ripasso. Le consegne con gli stessi esercizi e titoli diversi chiedono conferma prima di sostituirsi. Verifiche automatiche e collaudo locale in Chrome superati. |
| 2026-11-23 | F15 di `portale-v2` completata: download del database iniziale e degli script nella sandbox; immagine di anteprima approvata da Marco e meta Open Graph. File scaricati e verifiche automatiche controllati; verifica dell’anteprima nei servizi di condivisione da fare dopo la pubblicazione. |
| 2026-11-23 | F09 di `portale-v2` completata. Il manifest richiede `level` (`facile`, `intermedio`, `complesso`). Il livello è visibile sulla locandina e nella scheda, con un consiglio per chi comincia sui mondi facili. Star Wars e Il Signore degli Anelli sono intermedi. Verifiche automatiche e prove in Chrome a 1280 e 375 px superate. |

| 2026-11-23 | F20 di `portale-v2` completata: generatore `npm run nuovo-tema -- <id>`, scheletro provvisorio e lista di controllo nel README; tema di prova verificato e rimosso. |

**Prossimo passo** — F18 di `portale-v2`.

## Requisiti di Marco

Fissati il 2026-11-16. Valgono finché il piano non li rivede insieme a Marco.

1. Il portale ospita *n* temi. Si parte da uno e lo si porta a termine; l’obiettivo è arrivare almeno a quattro. Aggiungere un tema non deve richiedere modifiche al codice comune oltre alla sua registrazione.
2. Ogni tema ha un database interrogabile. Scelto un tema, lo studente trova:
   - la **sandbox** libera, dove esegue qualunque query sul database del tema;
   - l’**addestramento**, cioè esercizi con verifica della risposta;
   - l’elenco di **tutte le query** del tema;
   - la **traccia**: il testo del problema da cui nasce il database, come nella seconda prova dell’Esame di Stato (prima «analisi»; nome scelto da Marco il 2026-11-18);
   - lo **schema ER**;
   - il **modello logico** (schema relazionale).
3. Ogni tema personalizza anche il template del sito: colori, caratteri, decorazioni.
4. Il codice è modulare: un tema è un’unità aggiungibile, non un ramo del codice.

## Riferimenti

### Il prototipo: `jedi-academy`

`~/Developer/github/jedi-academy` (GitHub privato `marcofarina/jedi-academy`) è un prototipo scritto con un assistente, utile come idea e non come base di codice: questo repo riparte da zero. Contenuto, verificato il 2026-11-16:

- React 19, TypeScript, Vite, Tailwind; motore SQL **AlaSQL** nel browser; pubblicazione statica su GitHub Pages;
- un database Star Wars di sette tabelle (`pianeti`, `fazioni`, `specie`, `personaggi`, `astronavi`, `spade_laser`, `battaglie`) in `src/data/starWarsDatabase.ts`;
- 105 esercizi in `src/data/exercises.ts`, ciascuno con difficoltà (`facile`, `medio`, `difficile`), parole chiave SQL, query attesa, suggerimenti e tabelle coinvolte;
- verifica della risposta confrontando il risultato della query dello studente con quello della query attesa (colonne, numero di righe, ordine solo se richiesto);
- sessioni di addestramento configurabili (5, 10 o 20 esercizi, difficoltà, parole chiave abilitate) con riepilogo finale;
- un visualizzatore dello schema e un tutor opzionale basato su Gemini, che richiede un server.

### Il libro: *Manuale dell’Archivista*

`~/Developer/github/python-doesnt-byte/volumes/archivista/` (repo pubblico). Fatti verificati il 2026-11-16:

- gli esempi del volume sono ambientati a Hogwarts;
- i blocchi SQL del libro girano nel browser con **SQLite** tramite `sql.js` (`src/theme/SQLRunner/`);
- l’indice del volume è in `intro.mdx`: i capitoli 6–9 coprono le interrogazioni (`SELECT` su una tabella, join, aggregazioni, sottoquery e viste), e sono quelli che il portale allena;
- le lezioni scritte finora arrivano al capitolo 3 (modello, schema, chiavi esterne, `NULL`).

## Piano e decisioni

Il lavoro segue il piano `docs/plans/portale-v2/README.md`: indice delle fasi, prompt di apertura, vincoli, autonomia e strategia dei modelli. Ogni fase si esegue in una sessione propria, con la skill `piani-multisessione`. Le fasi girano su Claude Code o su Codex: l’indice del piano dà il modello per ciascuno, e il prompt dice se una fase è solo per Claude (Artifact «Design», icone nuove). Gli ID delle fasi (F01…) sono propri di ciascun piano: le fasi citate nella tabella «Stato» fino al 2026-11-20 sono del piano archiviato `docs/plans/archivio/portale-v1/README.md`, le cui decisioni condivise restano valide.

Decisioni prese da Marco il 2026-11-16; motivi e dettagli nella sezione «Decisioni condivise» del piano.

| Decisione | Scelta |
| --- | --- |
| Motore SQL nel browser | SQLite via `sql.js`, come il libro |
| Framework, struttura e pubblicazione | React + Vite + TypeScript; sito statico autonomo su GitHub Pages, con link reciproci al libro |
| Formato di un tema | Cartella `themes/<id>/` scoperta al build, senza registro scritto a mano |
| Schema ER e modello logico | Modello logico generato dallo schema SQL; ER dichiarato in un file del tema |
| Primo tema | Star Wars, con gli esercizi del prototipo riverificati su SQLite. Tema di prova: Il Signore degli Anelli. Gli altri otto mondi sono scelti in `docs/mondi.md` (2026-11-23) |
| Addestramento | Percorso per capitolo del libro e difficoltà, più sessioni configurabili |
| Progressi dello studente | `localStorage`, per tema, più lo zaino cifrato di PDB (sezione `sql-academy`, stesso codice del libro); nessun dato personale (2026-11-17) |
| Sistema a punti | Premi 10 / 20 / 30 per difficoltà; suggerimenti e soluzione a pagamento, soluzione solo dopo tutti i suggerimenti; saldo per tema da zero. Dettagli in F13 (2026-11-17) |
| Classifica | Pubblica, generale e per tema; facoltativa; nome casuale non modificabile; controlli di plausibilità sul server; Worker e D1 propri, Cloudflare Workers Free a costo zero (2026-11-17) |
| CTF | Flag da trovare con query, suggerimenti a pagamento, nessuna soluzione: in un piano successivo (2026-11-17) |
| Tutor AI | Escluso |
| Visibilità del repo | Pubblica |
| Studio della veste | Ogni tema ha una propria fase di studio con l’Artifact «Design» prima di essere costruito; specifica in `docs/design/<id>.md` (2026-11-17) |
| Temi tratti da opere protette | Nomi e ambientazioni sì; immagini e font ufficiali no; loghi ed emblemi solo come icone RB stilizzate, non identiche agli originali (2026-11-17) |
| Schemi di un tema | Un tema può avere uno schema chiaro e uno scuro, con un selettore; Star Wars: X-wing e Morte Nera. Pagina iniziale: locandine dei temi su un tavolo. Specifiche in `docs/design/` (2026-11-18) |
| Sessione di esercizi | Riprendibile: salvata nel browser per tema, sopravvive a cambi di pagina e ricariche (2026-11-21) |
| Ripasso | Ripetizione spaziata a 1, 3, 7 e 21 giorni, zero punti, aiuti gratis; soluzione aperta o esercizio saltato fanno fallire il ripasso (2026-11-23) |
| Consegna del docente | Link che porta gli esercizi scelti, nell’ordine scelto; pagina `#/docente` dal piè di pagina; punti normali; riepilogo con data e ora da mostrare, non verificabile; nessun server (2026-11-23) |
| Mondi | Dieci in tutto, divisi in facili (consigliati per cominciare), intermedi e uno o due complessi, candidati alle CTF; la costruzione va in un piano successivo (2026-11-21). Scelti in F08 (2026-11-23), con livelli e abbozzi in `docs/mondi.md`: facili Minecraft, Sherlock Holmes, Stranger Things; intermedi One Piece, Dragon Ball, Divina Commedia; complessi Pokémon e Mitologia greca. Marco può cambiare opera durante la costruzione |

## Norme condivise (workspace)

Le norme di contenuto di Marco sono importate dal workspace tramite il symlink interno `.claude/norms -> ../../norms`. Claude Code espande l’import qui sotto; Codex no: se sei Codex, leggi `.claude/norms/contenuto.md` all’inizio di ogni sessione.

@.claude/norms/contenuto.md

Le altre norme non si importano, perché pesano sul contesto di ogni sessione. Leggile quando servono, da `.claude/norms/`:

| Quando | Norma |
| --- | --- |
| prima di scrivere un piano, una procedura, un README | `scrittura-tecnica.md` |
| prima di scrivere testi per gli studenti: consegne, tracce, suggerimenti | `scrittura-didattica.md` |
| a fine stesura di ogni testo per gli studenti | `scrittura-umana.md` (norma anti-slop) |

Il symlink esiste solo in locale (è in `.gitignore`): una sessione nel cloud non raggiunge le norme e non scrive prosa.

## Convenzioni

- Interfaccia, documentazione e commenti in italiano; identificatori e nomi di file seguono le convenzioni del linguaggio.
- Lavora sul branch `dev`; il merge in `main` lo chiede Marco. Messaggi di commit secondo i *Conventional Commits*, descrizione in italiano: `feat(temi): aggiungi il registro dei temi`.
- Icone: rb-icons. Solo RB Icons, sempre tramite la skill `icone-rb` (repo pubblico: niente Font Awesome Pro). Le icone nuove si disegnano solo su Claude Code: Codex usa quelle già nel progetto e, se ne serve una nuova, si ferma e lascia un segnaposto. Il progetto collauda la skill; procedimento e registro nel piano, sezione «Icone». Comuni in `src/assets/icons/`, di un tema in `themes/<id>/icone/`.
- Nessun push e nessuna pubblicazione senza il via di Marco.
- Codice: commento in italiano in testa a ogni modulo e su ogni funzione esportata, come nel codice esistente; segui lo stile dei file vicini, senza comprimere più istruzioni su una riga.
- Commit: chiudi il messaggio con la riga che identifica strumento e modello, `Co-Authored-By: Claude <modello> <noreply@anthropic.com>` o `Co-Authored-By: Codex <modello> <noreply@openai.com>`: l’autore Git è sempre Marco.
- Dati nel browser: ogni dato nuovo va cancellato sia da «Azzera i progressi» sia da «Esci dallo zaino» (decisione «Dati nel browser» del piano `portale-v2`).
