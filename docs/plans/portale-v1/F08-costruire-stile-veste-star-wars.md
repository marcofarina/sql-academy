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

**Stato al 2026-11-18: fase in corso, interrotta per limite di utilizzo.** Commit intermedio; la fase non è completata.

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

### Lavoro residuo

1. Riscrivere `src/pages/HomePage.tsx` secondo `docs/design/neutra.md` (gli stili ci sono già): locandine lanciate in quattro fasce, trascinamento dopo 5 px, clic che gira la scheda (`role="dialog"`, fuoco su «Entra» e ritorno), velo, Esc, «Rimescola», mazzo a 375 px con «1 di 4», movimento ridotto, locandine «Prossimamente» fino a quattro. Crediti: «con <tabelle> e <ultima>, in N esercizi» da `theme.stats`; retro con `chapterLabel`, `DIFFICULTY_LABEL`; link al libro `https://python.rainbowbits.cloud`.
2. Verifica visiva con `npm run dev` (sei sezioni nei due schemi, 1280 e 375 px, nessuno scorrimento orizzontale) e schermate a Marco prima di rifinire.
3. `npm run build`, `npm run lint`, grep dei colori; aggiornare `README.md` del piano (struttura del tema, registro icone, decisioni) e `AGENTS.md`; commit di chiusura.

Verifiche al commit intermedio: `tsc` superato, `npm test` 116 test superati, `check:themes` superato; build, lint e verifica visiva **non eseguiti**.
