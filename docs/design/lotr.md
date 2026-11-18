# Veste Il Signore degli Anelli

Specifica approvata da Marco il 2026-11-18, in F12. F09 la applica in `themes/lotr/` senza ridecidere le scelte; ciò che resta aperto è nelle sezioni «Lacune del contratto» e «Punti aperti per F09».

- **Tavole:** Artifact «Design» [SQL Academy — veste Il Signore degli Anelli](https://claude.ai/artifact/DtawNio6cxm36cFE3Euij7), privato. Per ogni schema: sandbox con risultato (1280 px), sandbox con errore di SQLite (375 px), stati della sandbox (errore, query interrotta, database ripristinato, 1280 px). In più il fronte della locandina, chiaro (scelto) e scuro (scartato).
- **Contrasti:** `node docs/design/contrasto.mjs lotr-chiaro` e `node docs/design/contrasto.mjs lotr-scuro`.
- **Dati delle tavole:** tabelle, colonne e righe sono segnaposto; lo schema del tema lo decide F09.

## Idea

Il tema ha due schemi, scelti dallo studente con il selettore nell’intestazione, come Star Wars:

- **chiaro, la mappa della Contea:** carta da mappa con un reticolo di meridiani, inchiostro seppia, verde della Contea per le azioni e un percorso rosso tratteggiato che collega le sezioni come tappe di un viaggio;
- **scuro, le porte di Moria:** pietra blu ardesia, linee sottili e luminose di *ithildin* azzurro luna, pulsante primario d’argento come il *mithril*.

Le due direzioni sono nate come alternative; Marco le ha approvate entrambe, una come schema chiaro e l’altra come scuro. La struttura delle pagine non cambia fra i due schemi: cambiano variabili, caratteri e decorazioni.

## Schemi e selettore

Stesso contratto di Star Wars (`schemes` nel manifest, `[data-scheme="chiaro"]` e `[data-scheme="scuro"]` sulla radice del guscio).

- Gruppo «Schema di colori» accanto al nome del tema: pulsanti «Chiaro» e «Scuro» con `aria-pressed`, ciascuno con il suo emblema (`wizard-staff` per «Chiaro», `eye-of-sauron` per «Scuro»).
- Bordo del gruppo 1,5 px `--color-control-border`, raggio pieno, margine interno 3 px; pulsanti alti 38 px, 0 14 px di margine interno, testo 15 px 700, icona a 7 px dal testo.
- Pulsante premuto: fondo `--color-text`, testo `--color-bg`. Pulsante libero: trasparente, testo `--color-muted`.
- L’emblema accanto al nome del tema cambia con lo schema: `wizard-staff` in `--color-accent-ink` nel chiaro, `eye-of-sauron` in `--color-accent-ink` con alone `drop-shadow(0 0 4px rgba(169,216,255,.6))` nello scuro. Misura 30 px a desktop, 28 px a 375 px.
- A 375 px il selettore va a capo sotto il nome del tema.

## Colori

Tutte le variabili esistono già in `src/styles.css`: il tema non ne aggiunge al contratto. Le variabili proprie del tema (`--lotr-…`) servono solo alle decorazioni e restano in `themes/lotr/stile.css`.

| Variabile | Chiaro (Contea) | Scuro (Moria) | Uso |
| --- | --- | --- | --- |
| `--color-bg` | `#E8E1CD` | `#10151C` | fondo della pagina |
| `--color-surface` | `#F5F0E2` | `#18202A` | riquadri: risultati, tabelle, avvisi |
| `--color-surface-2` | `#EAE2CB` | `#202A36` | intestazione della tabella dei risultati |
| `--color-border` | `#B8A883` | `#34414F` | bordi dei riquadri |
| `--color-rule` | `#DDD3B8` | `#243040` | filetti fra le righe; nel chiaro anche il filetto interno della cornice |
| `--color-text` | `#2B231A` | `#E4E9EF` | testo |
| `--color-muted` | `#5C4F3D` | `#A2AEBC` | testo secondario, sezioni non attive |
| `--color-accent` | `#2F5233` | gradiente `#E6EDF5` → `#AFC0D2`; colore pieno `#C8D5E3` dove serve un solo valore | fondo del pulsante primario |
| `--color-accent-hover` | `#24402A` | `#D9E3EE` | pulsante primario al passaggio del mouse |
| `--color-accent-text` | `#FFFFFF` | `#10151C` | testo del pulsante primario |
| `--color-accent-ink` | `#A3301F` | `#8FC3F0` | icone d’accento, emblema, chiave primaria, triangolo della tabella aperta |
| `--color-link` | `#2C5131` | `#9CCBF5` | link |
| `--color-link-hover` | `#1B3320` | `#CFE6FB` | link al passaggio del mouse |
| `--color-control-border` | `#7A6B52` | `#6C7B8D` | bordo dei pulsanti secondari e del selettore |
| `--focus-color` | `var(--color-accent-ink)` | uguale | contorno del fuoco, 3 px a 2 px di distanza |
| `--color-null` | `#6A3D9E` | `#D3A6FF` | etichetta `NULL` |
| `--color-error`, `-bg`, `-border` | `#8E1F18`, `#F6E2DE`, `#C98A82` | `#FFA3A3`, `#2A1418`, `#7E2A2F` | errore di SQLite |
| `--color-warning`, `-bg`, `-border` | `#6E4300`, `#F7EBCF`, `#C9A04A` | `#FFD27A`, `#262010`, `#7E6420` | query interrotta |
| `--color-success`, `-bg`, `-border` | `#1D5E37`, `#E0EFE5`, `#8DBB9C` | `#A8E0BE`, `#12251B`, `#2E6B49` | database ripristinato |
| `--lotr-route` (del tema) | `#A3301F` | — | percorso tratteggiato e tappa attiva |
| `--lotr-ithildin` (del tema) | — | `#A9D8FF` | linee luminose, angoli dei riquadri, arco |
| `--lotr-ithildin-core` (del tema) | — | `#E8F4FF` | anima della linea della sezione attiva |

Nel chiaro errore, avviso e ripristino usano i valori della veste neutra; nello scuro quelli di Star Wars scuro, salvo il fondo e il bordo dell’errore, leggermente più freddi.

### Editor SQL

| Variabile | Chiaro | Scuro | Uso |
| --- | --- | --- | --- |
| `--editor-bg` | `#231D16` | `#0A0E13` | fondo; scuro in entrambi gli schemi |
| `--editor-text` | `#F1EBDD` | `#E4E9EF` | identificatori |
| `--editor-rule` | `#3A3127` | `#1E2631` | separatore fra numeri di riga e codice |
| `--code-gutter` | `#A0937D` | `#7F8B99` | numeri di riga |
| `--code-keyword` | `#F4A582` | `#8FC3F0` | parole chiave, peso 600 |
| `--code-number` | `#A9D6A0` | `#E8C98A` | numeri |
| `--code-punct` | `#CFC4AE` | `#A7B2BF` | punteggiatura e operatori |
| `--code-string` | `#E8CF8A` | `#A8DDB5` | stringhe |
| `--code-comment` | `#A39883` | `#8A96A4` | commenti |

`--editor-selection` non compare nelle tavole: F09 tiene il valore comune o ne sceglie uno che lasci leggibile il testo selezionato.

## Caratteri

| Carattere | Schema | Uso | Pesi | Licenza | Fonte |
| --- | --- | --- | --- | --- | --- |
| IM Fell English | chiaro | titolo della sezione, didascalia «Risultato: N righe» (corsivo), motto della locandina (corsivo) | 400, corsivo 400 | SIL OFL 1.1 | <https://github.com/google/fonts/blob/main/ofl/imfellenglish/OFL.txt> |
| IM Fell English SC | chiaro | nome del tema, «Tabelle», titolo della locandina | 400 | SIL OFL 1.1 | <https://github.com/google/fonts/blob/main/ofl/imfellenglishsc/OFL.txt> |
| Cinzel | scuro | nome del tema, titolo della sezione, «Tabelle», didascalia del risultato | 600 (file variabile `Cinzel[wght].ttf`) | SIL OFL 1.1 | <https://github.com/google/fonts/blob/main/ofl/cinzel/OFL.txt> |
| Atkinson Hyperlegible Next e Mono | entrambi | testo, pulsanti, editor, nomi di tabelle e colonne | quelli comuni | SIL OFL 1.1 | già in `src/assets/fonts/` |

Licenze verificate il 2026-11-18 sui file `OFL.txt` e `METADATA.pb` del repository `google/fonts`: nessun nome riservato. File da scaricare in F09, originali e non ritagliati, con il loro `OFL.txt` in `themes/lotr/fonts/`: `IMFeENrm28P.ttf`, `IMFeENit28P.ttf`, `IMFeENsc28P.ttf`, `Cinzel[wght].ttf`. Nessun carattere ufficiale dei film o dei libri.

| Variabile | Chiaro | Scuro |
| --- | --- | --- |
| `--font-display` | `'IM Fell English', serif` | `'Cinzel', serif` |
| `--display-weight` | 400 | 600 |
| `--display-tracking` | 0 | 0.05em |
| `--h1-size` | 56 px (42 px a 375 px) | 42 px (32 px a 375 px) |
| `--theme-name-size` | 26 px (23 px a 375 px), in IM Fell English SC | 20 px (18 px a 375 px), tracking 0.06em |
| `--font-body`, `--font-mono` | comuni | comuni |

Nel chiaro il nome del tema e «Tabelle» usano IM Fell English SC, il titolo della sezione IM Fell English: F09 dichiara il maiuscoletto nelle regole di quei due elementi in `stile.css`. Corpo del testo 17 px a desktop, 16 px a 375 px; editor 15 / 14 px; tabella dei risultati 15 px, intestazioni 13 px.

## Forme

| Elemento | Chiaro | Scuro |
| --- | --- | --- |
| `--radius` | 3 px | 2 px |
| Pulsanti | altezza minima 44 px, 0 20 px di margine interno, testo 16 px 700, raggio `--radius` | uguale |
| Pulsante primario | pieno `--color-accent`, ombra interna `inset 0 -3px 0 rgba(0,0,0,.2)` | gradiente `#E6EDF5` → `#AFC0D2`, filo interno `inset 0 1px 0 #FFFFFF`, alone `0 0 18px -6px rgba(169,216,255,.9)` |
| Pulsante secondario | trasparente, bordo 1,5 px `--color-control-border` | uguale |
| Riquadri | bordo 1 px `--color-border` e cornice doppia: `inset 0 0 0 3px var(--color-surface), inset 0 0 0 4px var(--color-rule)` | bordo 1 px `--color-border`, angoli luminosi (vedi «Decorazioni») |
| Tasti (`kbd`) | bordo 1 px, inferiore 2 px, raggio 4 px, fondo `--color-surface` | uguale |
| `NULL` | carattere mono 0,85 em, bordo 1 px del suo colore, raggio 3 px | uguale |

Un solo raggio per tutto il guscio, come prevede `--radius`: i pulsanti non sono a pillola. Fa eccezione il selettore, a raggio pieno come in Star Wars.

## Decorazioni

Tutte decorative (`aria-hidden="true"` o pseudo-elementi), senza immagini dell’opera.

### Chiaro, la mappa della Contea

- **Reticolo:** sul fondo, `repeating-linear-gradient` di 1 px `rgba(43,35,26,.05)` ogni 160 px, in verticale e in orizzontale.
- **Rosa dei venti:** dietro il titolo, 260 × 260 px a 300 px dal bordo destro e 96 px dall’alto, opacità 0,13, colore `--color-text`. Due cerchi (raggio 92 a tratto 1,5; raggio 84 tratteggiato `2 4`), una stella a quattro punte piena all’opacità 0,55 con le metà destre piene, una seconda stella a quattro punte ruotata di 45°, solo contorno. Disegno SVG della tavola (`Main.dc.html`), viewBox 200 × 200.
- **Percorso delle sezioni:** sotto la barra delle sezioni, sopra il filetto 1 px `--color-border`, una linea alta 2 px a trattini di 9 px ogni 16 px in `--lotr-route`, opacità 0,55.
- **Tappa attiva:** sotto la sezione attiva, centrato, un punto di 14 px `--lotr-route` con anello `0 0 0 3px var(--color-bg), 0 0 0 4.5px var(--lotr-route)`, che siede sul percorso (8 px sotto la voce); l’icona della voce in `--color-accent-ink`. A 375 px il punto è di 12 px, senza anello esterno.
- **Didascalia del risultato:** «Risultato: N righe» in IM Fell English corsivo 19 px; a destra un tratto di percorso lungo 46 px.
- **Query interrotta:** a sinistra, dentro l’avviso, una striscia di 6 px a trattini verticali `--lotr-route` (6 px pieni ogni 11), come una strada sbarrata; margine interno sinistro 22 px.

### Scuro, le porte di Moria

- **Fondo:** sfumatura `linear-gradient(180deg, rgba(169,216,255,.05), transparent 340px)` sopra linee verticali di 1 px `rgba(255,255,255,.022)` ogni 96 px.
- **Arco:** dietro il titolo, 400 × 520 px a 250 px dal bordo destro e 70 px dall’alto, opacità 0,5, alone `drop-shadow(0 0 4px rgba(169,216,255,.7))`, tratto 1,2 `--lotr-ithildin`. Un arco a tutto sesto con i piedritti fino al fondo, un secondo arco interno a puntini, due mensole all’imposta, una stella a quattro punte sotto la chiave e una piccola punta sopra, un arco ribassato a metà altezza a opacità 0,6. Evoca una porta senza riprodurre quella dell’opera. Disegno SVG della tavola (`B-sandbox.dc.html`), viewBox 400 × 520; a 375 px si riduce a 260 px, opacità 0,35, in parte fuori pagina a destra.
- **Intestazione:** sfumatura da `#141B24` verso il fondo trasparente.
- **Sezione attiva:** sotto la voce, una linea alta 1,5 px `--lotr-ithildin-core` con alone `0 0 4px 1px var(--lotr-ithildin), 0 0 12px 3px rgba(169,216,255,.45)`; l’icona in `--color-accent-ink`. Filetto della barra 1 px `--color-rule`.
- **Riquadri:** due angoli a L di 12 px, in alto a sinistra e in basso a destra, tratto 1 px `--lotr-ithildin`, opacità 0,75, alone `drop-shadow(0 0 3px rgba(169,216,255,.8))`. Bordo superiore normale, a differenza di Star Wars.
- **Query interrotta:** sul bordo superiore dell’avviso una linea di 1,5 px `#FFE9B0` con alone del colore dell’avviso, `0 0 4px 1px #FFD27A, 0 0 10px 2px rgba(255,210,122,.4)`.

## Componenti

Classi e componenti sono quelli di F03 e F05; la veste li tocca solo attraverso variabili e decorazioni.

| Parte | Indicazioni |
| --- | --- |
| Intestazione | «Tutti i temi» con `circle-arrow-left`, grassetto, colore link; a destra emblema, nome del tema, selettore. A 375 px tre righe: link, emblema e nome, selettore |
| Sezioni | sei voci con la loro icona, 15 px 700, altezza minima 46 px; la sandbox con `one-ring` (vedi «Lacune del contratto»). A 375 px scorrono in orizzontale |
| Titolo della sezione | icona della sezione 0,8 em in `--color-accent-ink`, testo in `--font-display` |
| Editor | numeri di riga a destra, separatore 1 px `--editor-rule`, margine interno 14 px; nel chiaro dentro la cornice doppia, a 6 px dal bordo |
| Barra dei comandi | «Esegui» primario con `circle-play`, «Ripristina database» secondario con `circle-arrow-rotate-left`, scorciatoia in `--color-muted` 14 px, nascosta a 375 px |
| Risultato | «Tempo: … ms.» in `--color-muted` 15 px, poi il riquadro con la didascalia, intestazioni mono 13 px su `--color-surface-2`, filetti `--color-rule`, numeri a destra in mono |
| Avvisi | icona 22 px, titolo in grassetto («Errore di SQLite», «Query interrotta»), messaggio di SQLite in mono 14 px; ripristino su una riga |
| Tabelle del tema | a destra (280 px) a desktop, sotto l’editor a 375 px; titolo «Tabelle» in carattere del tema (IM Fell English SC 26 px nel chiaro, Cinzel 20 px nello scuro). Tabella aperta: colonne e tipi mono 13 px, separate da un filetto tratteggiato (chiaro) o pieno (scuro), chiave primaria con `key` in `--color-accent-ink`; triangolo d’apertura in CSS, in `--color-accent-ink` se aperta, `--color-muted` se chiusa |

Le altre cinque sezioni non hanno tavole: usano le stesse variabili e gli stessi riquadri. F09 le rivede nei due schemi.

## Locandina

Marco ha scelto il fronte chiaro. Contratto della locandina come in F08 (`locandina.css`, radice `.poster[data-theme-id="lotr"]`).

- **Fondo:** `#E8E1CD`, raggio 8 px, doppia cornice di filetti 1 px `#B8A883` a 6 e 9 px dal bordo.
- **Disegno:** una catena di cinque monti a contorno (tratto 1,1 `#2B231A`, opacità 0,55) a destra, a metà altezza; tre puntini per il villaggio in basso a sinistra; dal villaggio ai monti un percorso tratteggiato `#A3301F` (2 px, trattini 6 e 5, estremità tonde) che parte da un punto pieno di 4,5 px e arriva a un piccolo triangolo pieno, il vulcano; in alto a destra una stella a quattro punte di 32 px, opacità 0,6. Disegno SVG della tavola (`A-locandina.dc.html`), viewBox 230 × 345.
- **Testi:** motto in alto in IM Fell English corsivo 13 px, larghezza massima 150 px, proposta «Da Hobbiville al Monte Fato, una query alla volta.» (F09 lo riscrive con le norme di scrittura se serve); titolo «Il Signore degli Anelli» in IM Fell English SC 36 px, interlinea 0,9; crediti in Atkinson Hyperlegible Next 10,5 px `#5C4F3D`, con i nomi delle tabelle del tema e il numero di esercizi calcolati.
- **Banda del retro:** proposta di Claude, non discussa: `--poster-band-1: #2F5233`, `--poster-band-2: #A3301F`, `--poster-band-split: 60%`.
- **Colore di base del testo:** `#2B231A`.

Sostituisce il fronte provvisorio del Signore degli Anelli descritto in `docs/design/neutra.md` (montagne verdi, sole e nebbia).

## Icone tematiche

Create in F12 su richiesta di Marco, con la skill `icone-rb`, e approvate da Marco il 2026-11-18; commit `1f16200` nel repository `icone` (branch `dev`, nessun push). F09 copia in `themes/lotr/icone/` quelle che usa.

| Icona | Disegno | Uso proposto |
| --- | --- | --- |
| `one-ring` | anello spesso appeso a una catenella che sale ai due lati a parabola | sezione Sandbox (voce e titolo), al posto di `terminal-window` |
| `wizard-staff` | punta a ogiva del bastone di un mago, con gabbia di nervature e apertura a rombo; stilizzata da una foto di riferimento fornita da Marco | `emblem` dello schema chiaro: pulsante «Chiaro» e intestazione |
| `eye-of-sauron` | occhio a mandorla con pupilla a fessura e contorno frastagliato a lingue di fiamma | `emblem` dello schema scuro: pulsante «Scuro» e intestazione |
| `hobbit-door` | porta tonda con pomello al centro, assi e soglia | da decidere in F09; proposta: `empty` dello schema chiaro |
| `durin-door` | arco con stella e due battenti | da decidere in F09; proposta: `empty` dello schema scuro |
| `magic-wand` | bacchetta che fa luce: primo tentativo del bastone, scartato perché sembra una bacchetta | nessuno: resta nel catalogo, non si usa |

L’icona `solved` del tema non è stata discussa: F09 la propone a Marco. Le altre icone delle tavole sono RB già nel progetto: `circle-arrow-left`, `bullseye`, `list`, `file-lines`, `entity-relationship`, `table`, `circle-play`, `circle-arrow-rotate-left`, `circle-xmark`, `triangle-exclamation`, `key`.

## Lacune del contratto

Segnalate a Marco durante lo studio; F09 le risolve come correzioni del contratto, in commit separati e dichiarati.

1. **Icona di una sezione.** `ThemeIcons` (`src/themes/contract.ts`) ha solo `emblem`, `solved`, `empty`: un tema non può sostituire l’icona di una sezione. Per `one-ring` serve un campo nuovo, per esempio `icons.sections?: Partial<Record<SectionId, string>>`, valido in ogni schema, letto dal guscio e dal titolo della sezione.
2. **Decorazioni SVG.** Rosa dei venti, arco e disegno della locandina sono SVG. Il contratto non prevede una cartella per le decorazioni: la strada senza modifiche al codice comune è un `url("data:image/svg+xml,…")` dentro `stile.css` e `locandina.css`. Se F09 preferisce file separati nella cartella del tema, è una scelta da confermare con Marco.

## Contrasti

Misurati il 2026-11-18 con `node docs/design/contrasto.mjs`. Soglia 4,5:1 per il testo, 3:1 per icone e bordi; tutte le coppie superano la soglia.

| Coppia | Chiaro | Scuro |
| --- | --- | --- |
| testo / fondo | 11,84:1 | 15,01:1 |
| testo / superficie | 13,58:1 | 13,45:1 |
| testo / superficie 2 | 11,96:1 | 11,90:1 |
| secondario / fondo | 6,09:1 | 8,13:1 |
| secondario / superficie | 6,98:1 | 7,29:1 |
| secondario / superficie 2 | 6,15:1 | 6,44:1 |
| link / fondo | 6,91:1 | 10,71:1 |
| link al passaggio del mouse / fondo | 10,44:1 | 14,28:1 |
| testo del pulsante primario | 8,84:1 | 15,53:1 in alto, 9,85:1 in basso, 12,29:1 sul colore pieno |
| pulsante primario al passaggio del mouse | 11,40:1 | 14,11:1 |
| selettore premuto | 11,84:1 | 15,01:1 |
| editor: testo | 14,04:1 | 15,85:1 |
| editor: numeri di riga | 5,53:1 | 5,58:1 |
| editor: parole chiave | 8,38:1 | 10,35:1 |
| editor: numeri | 10,18:1 | 12,12:1 |
| editor: punteggiatura | 9,66:1 | 9,00:1 |
| editor: stringhe | 10,90:1 | 12,60:1 |
| editor: commenti | 5,86:1 | 6,43:1 |
| `NULL` / superficie | 6,65:1 | 8,34:1 |
| errore | 7,14:1 | 9,09:1 |
| avviso | 7,19:1 | 11,38:1 |
| ripristino | 6,52:1 | 10,77:1 |
| locandina: titolo e motto / crediti | 11,84:1 / 6,09:1 | — |
| icone d’accento / fondo (min 3) | 5,36:1 | 9,80:1 |
| icone d’accento / superficie (min 3) | 6,15:1 | 8,78:1 |
| bordo dei controlli / fondo (min 3) | 3,97:1 | 4,24:1 |

I colori sopra le decorazioni luminose (aloni, linee d’*ithildin*) non entrano nel calcolo: sono decorazioni senza testo sopra.

## Direzioni scartate

| Direzione | Perché |
| --- | --- |
| Due direzioni alternative, una sola da scegliere | Marco le ha approvate entrambe come schema chiaro e scuro |
| Fronte scuro della locandina (arco luminoso, motto «Di’ “amico” ed entra: le tabelle ti aspettano.») | Marco ha scelto il fronte chiaro; il motto citava l’opera |
| Emblemi `hobbit-door` e `durin-door` nel selettore | Marco ha preferito il bastone di Gandalf per il chiaro e l’occhio di Sauron per lo scuro |
| `wizard-staff` a stella su un’asta (ora `magic-wand`) | sembrava una bacchetta magica; ridisegnato dalla foto di riferimento |
| Occhio con raggi scuri nella parte chiara | sembrava un ragno; sostituito dal contorno a fiamme |
| Anello con una maglia infilata | Marco ha chiesto una catenella doppia, a parabola, che sembri una catena sola |

## Punti aperti per F09

- Le due lacune del contratto qui sopra.
- Icone `solved` ed `empty` del tema, da confermare con Marco.
- Chiave della scelta dello schema: quella comune di F08, `sql-academy:lotr:schema`; nessuna scelta nuova.
- Colore di `--editor-selection` nei due schemi.
- Le altre cinque sezioni, senza tavole, da rivedere nei due schemi con le schermate.
