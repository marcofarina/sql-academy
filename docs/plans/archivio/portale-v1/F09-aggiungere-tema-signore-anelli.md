# F09 — Aggiungere il tema di prova «Il Signore degli Anelli»

- **Modello / effort:** Opus 5.5 `medium`. Progettazione di uno schema, testi per gli studenti e una veste.
- **Dipendenze:** F05, F06, F08, F12 (tavole approvate e specifica `docs/design/lotr.md`). Tutto il codice comune deve essere chiuso: questa fase lo mette alla prova.
- **Consumo stimato:** medio-alto.
- **Incertezza:** media. Cresce se la prova di modularità fallisce e il contratto va corretto.
- **Punto di ripresa:** schema, dati ed ER approvati da Marco e `npm run check:themes` verde, prima di esercizi e veste.

Questa fase si esegue solo in locale: scrive testi per gli studenti e ha bisogno di `.claude/norms/`.

## 1. Obiettivo e risultato atteso

Un secondo tema ridotto ma completo in tutte e sei le sezioni, aggiunto creando soltanto `themes/lotr/`. La guida «Aggiungere un tema» documenta il procedimento appena seguito.

## 2. Contesto minimo

- Contratto del tema e passaggi di consegne di F01, F02, F06, F08, F12.
- `docs/design/lotr.md`: veste approvata da Marco in F12; F09 la applica, non la ridecide. Le icone tematiche principali esistono già nella libreria (F12): si copiano, non si ridisegnano. La sezione «Lacune del contratto» elenca due correzioni del contratto attese (icona di una sezione, decorazioni SVG).
- `themes/star-wars/` come esempio di tema completo.
- Icone: leggi la sezione «Icone» del `README.md` del piano e segui la skill `icone-rb` per ogni icona (catalogo RB Icons, poi creazione se manca). Le icone del tema stanno in `themes/lotr/icone/`: non si tocca `src/assets/icons/`; se manca un’icona comune, è un difetto da descrivere a Marco, non da aggirare.
- `.claude/norms/scrittura-didattica.md` e `.claude/norms/scrittura-umana.md`.

## 3. Perimetro

Dentro: `themes/lotr/` (cinque o sei tabelle, almeno un’associazione molti a molti, analisi, ER, circa 20 esercizi distribuiti sui quattro capitoli, veste), `README.md` del repo con la guida.

Fuori: qualunque file comune. Se serve modificarne uno, **fermati**: è un difetto del contratto. Descrivilo a Marco, correggilo in un commit separato e dichiarato, e registralo nel passaggio di consegne.

## 4. Attività di implementazione

1. Annota l’hash del commit di partenza: serve al criterio di modularità.
2. Proponi a Marco il dominio (per esempio popoli, regni, personaggi, compagnie, battaglie, luoghi) e lo schema ER; attendi l’approvazione.
3. Scrivi `schema.sql`, `dati.sql` (dati coerenti con l’opera, verificati eseguendo il caricamento con le chiavi esterne attive), `er.ts`, `analisi.md`.
4. Scrivi circa 20 esercizi: almeno quattro per capitolo, tre livelli di difficoltà. Esegui ogni query attesa e controlla che il risultato corrisponda alla consegna.
5. Applica in `themes/lotr/stile.css` la veste di `docs/design/lotr.md`, con i caratteri liberi lì indicati serviti dal progetto; nessuna immagine né carattere ufficiale, loghi ed emblemi solo stilizzati. Confronta le schermate con le tavole di F12. Le icone tematiche elencate nella specifica (per esempio anelli, mappe, spade, luoghi) passano dalla skill `icone-rb` e vanno in `themes/lotr/icone/`; riusa quelle di Star Wars e quelle comuni dove il significato coincide.
6. Scrivi nel `README.md` del repo la guida «Aggiungere un tema»: studio della veste con l’Artifact «Design» e specifica in `docs/design/<id>.md`, file richiesti, comandi di controllo, vincoli sulle opere protette. Ogni comando della guida va eseguito prima di scriverlo.
7. Applica la passata finale di `scrittura-umana.md` ad analisi ed esercizi.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm run check:themes` | Esce con 0 su entrambi i temi |
| `npm test`, `npm run build`, `npm run lint` | Nessun errore |
| `git diff --stat <hash di partenza> HEAD -- . ':!themes/lotr' ':!docs' ':!README.md'` | Nessuna riga: nessun file comune modificato. Se ci sono righe, ciascuna corrisponde a una correzione del contratto dichiarata |

Procedura manuale con `npm run dev`: la pagina iniziale mostra due temi; le sei sezioni di `#/lotr/…` funzionano; la veste è diversa da quella di Star Wars; i progressi dei due temi sono indipendenti (risolvi un esercizio in uno, l’altro resta a zero).

## 6. Passaggio di consegne

Da compilare alla chiusura: esito, verifiche, esito della prova di modularità con l’uscita del comando `git diff --stat`, correzioni al contratto, osservazioni di Marco, lavoro residuo, consumo reale se noto.

**Esito: completata il 2026-11-18 14:58**, su Opus 5.5, in una sessione. Commit di partenza `5017f3f`.

### Decisioni di Marco (2026-11-18)

- Dominio approvato con un’aggiunta: oltre alle battaglie, le **tappe** dei viaggi. Sette tabelle: `popoli`, `luoghi`, `personaggi`, `armi`, `battaglie`, `partecipazioni` (molti a molti personaggi–battaglie, con `schieramento`), `tappe` (molti a molti personaggi–luoghi, con `ordine` e `anno`). Di ogni coppia personaggio–luogo si registra solo il primo passaggio, così `tappe` resta un’associazione con chiave `(personaggio_id, luogo_id)`.
- Al punto di ripresa Marco ha chiesto più record: popoli 7, luoghi 32, personaggi 39, armi 10, battaglie 11, partecipazioni 56, tappe 117 (viaggi di Frodo, Sam, Merry, Pipino, Gandalf, Aragorn, Legolas, Gimli e Boromir). Poi ha approvato schema, dati, ER e analisi.
- Lacuna 1 del contratto: approvato il campo `icons.sections`. Lacuna 2: decorazioni SVG come `data:` URI nei fogli di stile.
- Icone degli stati: `empty` con `hobbit-door` (chiaro) e `durin-door` (scuro); `solved` resta l’icona comune.
- Download dei caratteri da `github.com/google/fonts` approvato.

### Correzione del contratto

Una sola, nel commit separato `eb8a74d` («feat(temi): consenti a un tema di sostituire l’icona di una sezione»): campo facoltativo `icons.sections` in `ThemeIcons` (`src/themes/contract.ts`), controllato da `checkIcons` (`src/themes/registry.ts`, con un test in `registry.test.ts`) e letto dal guscio (`src/pages/ThemePage.tsx`) nella barra delle sezioni e nel titolo. La lacuna 2 non ha richiesto modifiche al codice comune.

### Lavoro svolto

- `themes/lotr/`: `theme.ts`, `schema.sql`, `dati.sql`, `er.ts`, `analisi.md`, `esercizi.ts` (20 esercizi, cinque per capitolo; facili 5, medi 9, difficili 6), `stile.css`, `locandina.css`, `icone/` (cinque icone copiate dalla libreria, nessuna nuova), `fonts/` (IM Fell English normale e corsivo, IM Fell English SC, `Cinzel[wght].ttf`, ciascuno con la sua licenza).
- `dati.sql` è stato generato da uno script che risolve i nomi in identificativi (fuori dal repo, nella cartella temporanea della sessione); `stile.css` e `locandina.css` da modelli con i tracciati SVG delle tavole (`Main.dc.html`, `B-sandbox.dc.html`, `A-locandina.dc.html`), codificati come `data:` URI.
- `--editor-selection`: `rgba(244, 165, 130, 0.28)` nel chiaro, `rgba(143, 195, 240, 0.28)` nello scuro, i colori delle parole chiave a bassa opacità.
- `README.md` del repo, nuovo: comandi e guida «Aggiungere un tema».
- Passata di `scrittura-umana.md` su analisi ed esercizi: tolti i verbi non letterali riferiti all’archivio («conosce», «conserva») e corretto il titolo dell’esercizio 4.

### Verifiche (2026-11-18)

| Verifica | Esito |
| --- | --- |
| Caricamento di `schema.sql` e `dati.sql` con `PRAGMA foreign_keys=ON` | superata: `PRAGMA foreign_key_check` vuoto |
| Le 20 query attese eseguite su SQLite | superata: ogni risultato corrisponde alla consegna, con almeno una riga |
| `npm run check:themes` | superata: exit 0, `lotr` 20 esercizi, ER su 7 tabelle, 0 problemi; `star-wars` invariato |
| `npm test` | superata: exit 0, 15 file, 119 test (uno nuovo per `icons.sections`) |
| `npm run lint` | superata: exit 0 |
| `npm run build` | superata: exit 0; l’avviso sui blocchi oltre 500 kB c’era già al commit `5017f3f` |
| `node docs/design/contrasto.mjs lotr-chiaro` e `lotr-scuro` | superata: exit 0 |
| Prova di modularità | superata con una correzione dichiarata, vedi sotto |
| Procedura manuale con `npm run dev` | superata: pagina iniziale con le due locandine; sei sezioni di `#/lotr/…` nei due schemi; sandbox a 1280 e 375 px confrontata con le tavole; esercizio `ex-011` risolto in `lotr` con `sql-academy:star-wars:v1` rimasto vuoto |

Uscita di `git diff --stat 5017f3f HEAD -- . ':!themes/lotr' ':!docs' ':!README.md'`:

```text
 src/pages/ThemePage.tsx     | 9 +++++++--
 src/themes/contract.ts      | 3 +++
 src/themes/registry.test.ts | 2 ++
 src/themes/registry.ts      | 3 ++-
 4 files changed, 14 insertions(+), 3 deletions(-)
```

Tutte e quattro le righe appartengono alla correzione del contratto `eb8a74d`. Dopo il commit di chiusura la stessa diff mostra anche `AGENTS.md | 1 +`: la riga di stato della fase, che si aggiorna a ogni chiusura come nelle fasi precedenti.

### Osservazioni e lavoro residuo

- Nello schema scuro l’arco sta dietro il titolo di ogni sezione, non solo della sandbox: nell’analisi passa dietro il testo, che resta leggibile. Da rivedere con Marco se disturba.
- Angoli luminosi dello scuro: nell’editor sono pseudo-elementi con alone, come nella tavola; su tabella dei risultati, figura ER e tabelle del pannello sono sfondi in gradiente, senza alone, perché quei riquadri scorrono e un pseudo-elemento scorrerebbe con il contenuto.
- A 375 px, nel chiaro, il percorso sale di 6 px sopra il filetto: la lista delle sezioni scorre in orizzontale e taglierebbe il punto della tappa attiva.
- Fuori perimetro, non toccato: la console di `npm run dev` mostra un avviso di React su `transition` e `transitionDuration` nella pagina iniziale (codice comune di F08).
- Consumo reale: non noto.

