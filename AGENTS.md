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

**Prossimo passo:** apri la prima fase `da fare` dell’indice in `docs/plans/portale-v1/README.md`, con il suo prompt di apertura.

## Requisiti di Marco

Fissati il 2026-11-16. Valgono finché il piano non li rivede insieme a Marco.

1. Il portale ospita *n* temi. Si parte da uno e lo si porta a termine; l’obiettivo è arrivare almeno a quattro. Aggiungere un tema non deve richiedere modifiche al codice comune oltre alla sua registrazione.
2. Ogni tema ha un database interrogabile. Scelto un tema, lo studente trova:
   - la **sandbox** libera, dove esegue qualunque query sul database del tema;
   - l’**addestramento**, cioè esercizi con verifica della risposta;
   - l’elenco di **tutte le query** del tema;
   - l’**analisi**: il testo del dominio da cui nasce il database, come nella seconda prova dell’Esame di Stato;
   - lo **schema ER**;
   - il **modello logico** (schema relazionale).
3. Ogni tema personalizza anche il template del sito: colori, caratteri, decorazioni.
4. Il codice è modulare: un tema è un’unità aggiungibile, non un ramo del codice.

## Riferimenti

### Il prototipo: `jedi-academy`

`~/Developer/github/jedi-academy` (GitHub privato `marcofarina/jedi-academy`) è un prototipo scritto con un assistente, utile come idea e non come base di codice: questo repo riparte da zero. Contenuto, verificato il 2026-11-16:

- React 19, TypeScript, Vite, Tailwind; motore SQL **AlaSQL** nel browser; pubblicazione statica su GitHub Pages;
- un database Star Wars di sette tabelle (`pianeti`, `fazioni`, `specie`, `personaggi`, `astronavi`, `spade_laser`, `battaglie`) in `src/data/starWarsDatabase.ts`;
- 121 esercizi in `src/data/exercises.ts`, ciascuno con difficoltà (`facile`, `medio`, `difficile`), parole chiave SQL, query attesa, suggerimenti e tabelle coinvolte;
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
| Progressi dello studente | `localStorage`, per tema; nessun dato personale |
| Tutor AI | Escluso |
| Visibilità del repo | Pubblica |
| Temi tratti da opere protette | Nomi e ambientazioni sì; immagini, loghi e font ufficiali no |

## Norme condivise (workspace)

Le norme di contenuto di Marco sono importate dal workspace tramite il symlink interno `.claude/norms -> ../../norms`:

@.claude/norms/contenuto.md

Le altre norme non si importano, perché pesano sul contesto di ogni sessione. Leggile quando servono, da `.claude/norms/`:

| Quando | Norma |
| --- | --- |
| prima di scrivere un piano, una procedura, un README | `scrittura-tecnica.md` |
| prima di scrivere testi per gli studenti: consegne, analisi, suggerimenti | `scrittura-didattica.md` |
| a fine stesura di ogni testo per gli studenti | `scrittura-umana.md` (norma anti-slop) |

Il symlink esiste solo in locale (è in `.gitignore`): una sessione nel cloud non raggiunge le norme e non scrive prosa.

## Convenzioni

- Interfaccia, documentazione e commenti in italiano; identificatori e nomi di file seguono le convenzioni del linguaggio.
- Lavora sul branch `dev`; il merge in `main` lo chiede Marco. Messaggi di commit secondo i *Conventional Commits*, descrizione in italiano: `feat(temi): aggiungi il registro dei temi`.
- Icone: rb-icons. Solo RB Icons, sempre tramite la skill `icone-rb` (repo pubblico: niente Font Awesome Pro). Il progetto collauda la skill; procedimento e registro nel piano, sezione «Icone». Comuni in `src/assets/icons/`, di un tema in `themes/<id>/icone/`.
- Nessun push e nessuna pubblicazione senza il via di Marco.
