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

**Prossimo passo:** apri la prima fase `da fare` dell’indice in `docs/plans/portale-v1/README.md`, con il suo prompt di apertura.

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

Il lavoro segue il piano `docs/plans/portale-v1/README.md`: indice delle fasi, prompt di apertura, vincoli, autonomia e strategia dei modelli. Ogni fase si esegue in una sessione propria, con la skill `piani-multisessione`.

Decisioni prese da Marco il 2026-11-16; motivi e dettagli nella sezione «Decisioni condivise» del piano.

| Decisione | Scelta |
| --- | --- |
| Motore SQL nel browser | SQLite via `sql.js`, come il libro |
| Framework, struttura e pubblicazione | React + Vite + TypeScript; sito statico autonomo su GitHub Pages, con link reciproci al libro |
| Formato di un tema | Cartella `themes/<id>/` scoperta al build, senza registro scritto a mano |
| Schema ER e modello logico | Modello logico generato dallo schema SQL; ER dichiarato in un file del tema |
| Primo tema | Star Wars, con gli esercizi del prototipo riverificati su SQLite. Tema di prova: Il Signore degli Anelli. Gli altri due temi sono da scegliere in un piano successivo |
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

## Norme condivise (workspace)

Le norme di contenuto di Marco sono importate dal workspace tramite il symlink interno `.claude/norms -> ../../norms`:

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
- Icone: rb-icons. Solo RB Icons, sempre tramite la skill `icone-rb` (repo pubblico: niente Font Awesome Pro). Il progetto collauda la skill; procedimento e registro nel piano, sezione «Icone». Comuni in `src/assets/icons/`, di un tema in `themes/<id>/icone/`.
- Nessun push e nessuna pubblicazione senza il via di Marco.
