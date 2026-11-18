# F08 — Costruire il sistema di stile per tema e la veste Star Wars

- **Modello / effort:** Opus 5.5 `medium`. Si decide che cosa un tema può personalizzare: è una parte del contratto.
- **Dipendenze:** F03, F11 (tavole approvate e specifiche `docs/design/neutra.md`, `docs/design/star-wars.md`). Conviene dopo F05 e F06, per vestire componenti già esistenti; se la apri prima, rivedi le viste nuove quando arrivano.
- **Consumo stimato:** medio.
- **Incertezza:** media. Le verifiche sono visive.
- **Punto di ripresa:** variabili comuni applicate a tutti i componenti con la veste neutra, prima della veste Star Wars.

## 1. Obiettivo e risultato atteso

Ogni tema cambia colori, caratteri e decorazioni del sito attraverso il proprio `stile.css` e il manifest, senza toccare i componenti. Star Wars ha la sua veste; la pagina iniziale del portale ha una veste neutra propria.

## 2. Contesto minimo

- Passaggi di consegne di F03, F05, F06, F11.
- `docs/design/neutra.md` e `docs/design/star-wars.md`: valori e decorazioni approvati da Marco in F11; F08 li applica, non li ridecide.
- Skill `frontend-design`, da caricare prima di disegnare.
- Icone: leggi la sezione «Icone» del `README.md` del piano e segui la skill `icone-rb` per ogni icona (catalogo RB Icons, poi creazione se manca). Le icone di un tema stanno in `themes/<id>/icone/`.
- Vincolo di `AGENTS.md`: nessuna immagine o font ufficiale delle opere; loghi ed emblemi solo come icone RB stilizzate.

## 3. Perimetro

Dentro: variabili CSS comuni, punti di personalizzazione nel contratto, `themes/star-wars/stile.css`, caratteri liberi serviti dal progetto, tema dell’editor SQL, veste della pagina iniziale.

Fuori: nuove funzionalità, modifiche alla struttura delle pagine oltre a ciò che lo stile richiede.

## 4. Attività di implementazione

1. Elenca i punti di personalizzazione e fissali nel contratto: colori di superficie, testo, accento, esiti; carattere dei titoli, del testo e del codice; raggio e bordi; uno spazio per decorazioni (sfondo, intestazione) e per le icone proprie del tema, che prendono i colori dalle variabili (variante `.rb-swap` e variabili `--rb-*` dello snippet di `STILE.md`, sezione 6). Aggiorna il `README.md` del piano.
2. Sostituisci nei componenti comuni ogni colore e carattere scritto a mano con le variabili. Lo `stile.css` del tema si applica solo dentro il guscio del tema.
3. Disegna la veste Star Wars con caratteri a licenza libera, serviti dal progetto con il loro file di licenza. Evoca l’ambientazione senza riprodurre il carattere del titolo dei film. Le decorazioni a icona (per esempio pianeti, astronavi, spade, stemmi delle fazioni) sono RB Icons create con la skill e salvate in `themes/star-wars/icone/`; loghi ed emblemi solo stilizzati, non identici agli originali (sezione «Icone» del piano).
3b. Rivedi le icone comuni di F03–F06 con i colori del tema e controlla che restino leggibili sul fondo del tema.
4. Applica il tema all’editor SQL e ai diagrammi di F06.
5. Controlla il contrasto di testo e accenti (rapporto minimo 4,5:1 per il testo) con uno strumento, non a occhio, e riporta i valori.
6. Proponi a Marco la veste con schermate prima di rifinire, confrontandola con le tavole di F11.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm test`, `npm run build`, `npm run lint` | Nessun errore |
| `grep -rnE '#[0-9a-fA-F]{3,8}\b' src --include='*.css' --include='*.tsx'` | Nessun colore scritto a mano fuori dal file delle variabili comuni |

Procedura manuale con `npm run dev`: percorri le sei sezioni di Star Wars a 1280 px e a 375 px; nessun testo illeggibile, nessuno scorrimento orizzontale; la pagina iniziale non eredita la veste del tema. Schermate nel passaggio di consegne o allegate alla risposta finale.

## 6. Passaggio di consegne

**Esito: completata il 2026-11-18 09:45**, su Opus 5.5, in due sessioni. La prima, interrotta per limite di utilizzo, ha lasciato il commit intermedio `1cfc8fc`; la seconda ha scritto la pagina iniziale, verificato e chiuso la fase.

### Decisioni di Marco (2026-11-18)

- Contratto: manifest con `motto`, `icons`, `schemes` (per schema `emblem`, `empty`; `solved` comune); file del tema `stile.css` (radice `.theme[data-theme-id="<id>"]`), `locandina.css` (radice `.poster[data-theme-id="<id>"]`, scelta di Claude per dare al tema anche la banda del retro), `icone/`, `fonts/`.
- Numeri della scheda calcolati **al build**: plugin `scripts/themeStatsPlugin.ts`, modulo `virtual:theme-stats`, funzioni in `src/themes/stats.ts`.
- Icone tematiche: emblemi più spada laser, X-wing, stazione da battaglia. Emblema dell’intestazione che cambia con lo schema.
- Caratteri scaricati con il via di Marco da `github.com/google/fonts`, TTF originali non ritagliati, con `OFL.txt` accanto: comuni in `src/assets/fonts/`, del tema in `themes/star-wars/fonts/`. Totale circa 770 KB, più della stima.

### Fatto

- Icone (skill `icone-rb`): `rebel-alliance`, `galactic-empire`, `lightsabers-crossed`, `x-wing`, `battle-station`, approvate da Marco alla terza versione; commit `9216917` nel repo `icone` (branch `dev`, nessun push), nuova categoria `intrattenimento`; copiate in `themes/star-wars/icone/`.
- Contratto, registro (icone, CSS dei temi, conteggi), `check:themes` con controllo di confinamento dei CSS (`src/themes/cssScope.ts`).
- `src/styles.css` riscritto: variabili del contratto (unico file con colori esadecimali), guscio neutro, stili della pagina iniziale (tavolo, locandine, scheda, mazzo).
- `themes/star-wars/stile.css` (schemi chiaro e scuro con decorazioni) e `locandina.css`.
- Schema chiaro/scuro: `src/scheme/scheme.ts` (chiave `sql-academy:<tema>:schema`), selettore ed emblema in `ThemePage`; icone del tema via `src/themes/ThemeIconsContext.ts` (risolto, stati vuoti di sessione e catalogo).
- Editor: tema CodeMirror e colori della sintassi dalle variabili `--editor-*`, `--code-*` (importa `@codemirror/language` e `@lezer/highlight`, dipendenze transitive come `@codemirror/state`). Chiave primaria nel pannello delle tabelle con l’icona `key`.
- Contrasti: aggiunte a `docs/design/contrasto.mjs` stringhe e commenti dell’editor e la palette `guscio-neutro`; tutto sopra soglia (exit 0).

### Collaudo della skill `icone-rb`

- Ricerca: nessun soggetto presente (25 termini).
- Marco ha giudicato troppo semplici le prime due versioni e ha **autorizzato un’eccezione alla regola clean room** (R8.2) per questo solo caso: aperte come riferimento di complessità `starfighter`, `space-station-moon`, `swords-laser`, `jedi` di Font Awesome, senza copiare tracciati né composizioni. Gli emblemi di Impero e Alleanza non esistono nel duotone.
- Problemi incontrati: una sola spada laser resta sotto la copertura minima (R1.6), da cui le spade incrociate; le tacche sulla corona dell’emblema imperiale superavano R5.8 e spostavano l’ingombro (R1.4), quindi tolte; descrizioni del catalogo con «:» vanno tra virgolette nello YAML.

### Seconda sessione

- **Pagina iniziale** (`src/pages/HomePage.tsx`, disposizione in `src/pages/homeLayout.ts` con test): locandine lanciate in quattro fasce dal fondo della pagina, una dopo l’altra; trascinamento dopo 5 px, dentro il tavolo, con la locandina in cima; clic che porta la scheda al centro (420 × 630, a 375 px 343 × 660 o meno) e la gira; velo, Esc, «Rimetti sul tavolo» e «Rimescola». Fuoco su «Entra» all’apertura (o su «Rimetti sul tavolo» per un tema senza esercizi), confinato nella scheda, di ritorno sulla locandina alla chiusura. A 375 px il mazzo a ventaglio, sfogliato con un trascinamento di oltre 80 px o con i pulsanti ai lati di «1 di 4». Locandine «Prossimamente» fino a quattro. Movimento ridotto: nessun lancio, nessuna transizione.
- **Correzione del plugin** `scripts/themeStatsPlugin.ts`: `this.addWatchFile(themesDir)` passava una cartella come dipendenza del modulo virtuale e con `npm run dev` Vite tentava di importarla («Failed to resolve import …/themes»). Tolta: in sviluppo il ricalcolo lo fa già `handleHotUpdate`.
- **Allineamento alla tavola** «Neutra B3 — Le locandine sul tavolo», letta dall’Artifact «Design»: pianeta di 300 px a 110 × 190 px con alone, luna di 42 px, titolo a 68 px con interlinea 0,82, motto e crediti con larghezza massima, banda della scheda divisa al 60 % (variabile `--poster-band-split`), «Prossimamente» come titolo con «Tema N, da scegliere» sotto, capitoli della scheda con nomi brevi («una tabella 40 · join 25 …») e «105 esercizi per difficoltà».

### Scostamenti dalla specifica, confermati da Marco il 2026-11-18

1. **Alone dietro titolo e crediti della locandina Star Wars** (`text-shadow` del colore del cielo). Nella tavola, come nella resa, «Wars» e i crediti finiscono sopra la parte chiara del pianeta: senza alone si leggevano male, soprattutto a 375 px. L’alone non cambia geometria né colori; il rapporto di contrasto sopra il pianeta non è misurabile con `contrasto.mjs`, che confronta colori pieni.
2. **Ordine delle tabelle** nei crediti e nelle etichette: quello di creazione in `schema.sql` (pianeti, fazioni, specie, personaggi…), non quello della tavola, perché i numeri della scheda si leggono dal database.
3. Il retro di una locandina «Prossimamente» ha come titolo «Tema N».

### Verifiche (2026-11-18, seconda sessione)

| Verifica | Esito |
| --- | --- |
| `npm test` | superata: 15 file, 119 test |
| `npm run build` | superata; resta l’avviso di Vite sul pacchetto principale oltre 500 kB (771 kB, 248 kB compresso) |
| `npm run lint` | superata |
| `npm run check:themes` | superata: 105 esercizi, ER su sette tabelle, nessun problema |
| `node docs/design/contrasto.mjs` | superata (exit 0) |
| `grep -rnE '#[0-9a-fA-F]{3,8}\b' src --include='*.css' --include='*.tsx'` fuori da `src/styles.css` | superata: nessun risultato |
| Sei sezioni di Star Wars, schemi chiaro e scuro, 1280 e 375 px | superata: `scrollWidth` uguale alla larghezza della finestra in 20 casi su 24 misurati; nello schema scuro a 1280 px misurate solo sandbox e modello logico, le altre quattro sezioni controllate sulle schermate; schermate controllate di sandbox con risultato, addestramento, esercizio, catalogo, analisi, ER e modello logico |
| Pagina iniziale a 1280 e 375 px | superata: lancio, trascinamento senza apertura, apertura con fuoco su «Entra», Tab confinato, Esc con ritorno del fuoco, sfoglio con pulsanti e trascinamento; nessuna classe `.theme` sulla pagina iniziale |
| Movimento ridotto | non eseguita nel browser: lo garantiscono la media query in CSS e il ramo `reducedMotion` del componente |

Le verifiche nel browser sono state fatte nel pannello integrato dell’app, a tratti nascosto: lì le transizioni CSS restano ferme, per cui la scheda si apriva senza ricevere il fuoco. Da qui la funzione `focusWhenVisible`, che aspetta la fine della transizione di visibilità se al tempo previsto la faccia non è ancora visibile.

### Lavoro residuo

- Il pacchetto principale supera 500 kB: possibile divisione del codice (CodeMirror, rough.js) in una fase futura; non è nel perimetro di F08.
