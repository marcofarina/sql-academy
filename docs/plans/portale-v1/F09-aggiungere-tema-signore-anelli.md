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
