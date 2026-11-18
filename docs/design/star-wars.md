# Veste Star Wars

Specifica approvata da Marco il 2026-11-18, in F11. F08 la applica senza ridecidere le scelte; ciò che resta aperto è nella sezione «Punti aperti per F08». È il modello delle specifiche dei temi successivi (`docs/design/<id>.md`).

- **Tavole:** Artifact «Design» [SQL Academy — veste grafica](https://claude.ai/artifact/QidRnRmM4kWYVVRWnJ63df), privato, riga «Star Wars — chiaro X-wing e scuro Morte Nera». Per ogni schema: sandbox con risultato, errore di SQLite, query interrotta, database ripristinato (1280 px), risultato ed errore a 375 px.
- **Contrasti:** `node docs/design/contrasto.mjs star-wars-chiaro` e `node docs/design/contrasto.mjs star-wars-scuro`.

## Idea

Il tema ha due schemi, scelti dallo studente con un selettore nell’intestazione:

- **chiaro, X-wing:** lo scafo grigio chiaro di un caccia ribelle, con le linee dei pannelli e le strisce rosse della livrea;
- **scuro, Morte Nera:** l’acciaio scuro di una stazione imperiale, con il rosso delle spade dei Sith.

La struttura delle pagine non cambia fra i due schemi: cambiano variabili, caratteri e decorazioni.

## Schemi e selettore

Decisione presa il 2026-11-18, nuova rispetto al contratto di F01: un tema può dichiarare due schemi, chiaro e scuro. Le scelte di dettaglio che seguono sono una proposta di Claude, scritta nella risposta a Marco e non contraddetta nell’approvazione.

- Il selettore «Chiaro / Scuro» sta nell’intestazione del guscio, accanto al nome del tema: due pulsanti con `aria-pressed`, in un gruppo con `aria-label` «Schema di colori».
- Ogni pulsante porta l’emblema della sua parte: l’Alleanza ribelle per «Chiaro», l’Impero per «Scuro». Gli emblemi sono icone tematiche da creare in F08 (sezione «Icone tematiche»); le tavole hanno al loro posto un cerchio tratteggiato.
- Alla prima visita lo schema segue `prefers-color-scheme`; la scelta dello studente si conserva nel browser, per tema.
- Il pulsante premuto ha fondo `--color-text` e testo `--color-bg`; quello libero, testo `--color-muted`. Gruppo con bordo di 1,5 px `--color-control-border`, raggio pieno, altezza dei pulsanti 38 px dentro un margine di 3 px.

## Colori

La colonna «Variabile» usa i nomi di `src/styles.css` dove esistono già; quelli marcati con «nuova» F08 li aggiunge al contratto.

| Variabile | Chiaro (X-wing) | Scuro (Morte Nera) | Uso |
| --- | --- | --- | --- |
| `--color-bg` | `#E4E7EA` | `#0E1013` | fondo della pagina |
| `--color-surface` | `#F7F8F9` | `#171A1E` | riquadri: risultati, tabelle, avvisi |
| `--color-surface-2` (nuova) | `#EDEFF1` | `#1F2328` | intestazione della tabella dei risultati |
| `--color-border` | `#B4BAC1` | `#3A4048` | bordi dei riquadri |
| `--color-rule` (nuova) | `#D6DADF` | `#262B31` | filetti fra le righe |
| `--color-text` | `#1B1E22` | `#E7E9EC` | testo |
| `--color-muted` | `#4C535B` | `#A4ABB4` | testo secondario, sezioni non attive |
| `--color-accent` | `#B3242B` | gradiente `#C81B24` → `#9E1219`; colore pieno `#B3161E` dove serve un solo valore | fondo del pulsante primario |
| `--color-accent-text` | `#FFFFFF` | `#FFFFFF` | testo del pulsante primario |
| `--color-accent-ink` (nuova) | `#B3242B` | `#FF4F57` | icone d’accento: titolo della sezione, chiave primaria, sezione attiva |
| `--color-link` (nuova) | `#A1232A` | `#FF8A8F` | link |
| `--color-link-hover` (nuova) | `#6F1519` | `#FFB3B6` | link al passaggio del mouse |
| `--color-control-border` (nuova) | `#6E757D` | `#6B737D` | bordo dei pulsanti secondari e del selettore |
| `--color-null` | `#6A3D9E` | `#D3A6FF` | etichetta `NULL` |
| `--color-error`, `--color-error-bg`, bordo | `#8E1F18`, `#F6E2DE`, `#C98A82` | `#FFA3A3`, `#2B1214`, `#7E2A2F` | errore di SQLite |
| `--color-warning`, `--color-warning-bg`, bordo | `#6E4300`, `#F7EBCF`, `#C9A04A` | `#FFD27A`, `#262010`, `#7E6420` | query interrotta |
| `--color-success`, `--color-success-bg`, bordo | `#1D5E37`, `#E0EFE5`, `#8DBB9C` | `#A8E0BE`, `#12251B`, `#2E6B49` | database ripristinato |
| `--saber` (nuova, solo scuro) | — | `#FF2A35` | alone della lama e delle spie |

I bordi degli avvisi sono distinti dal colore del testo: in `src/styles.css` oggi coincidono, quindi F08 aggiunge `--color-error-border`, `--color-warning-border` e `--color-success-border`.

### Editor SQL

| Variabile (nuova) | Chiaro | Scuro | Uso |
| --- | --- | --- | --- |
| `--editor-bg` | `#1D2126` | `#08090B` | fondo; in entrambi gli schemi l’editor è scuro, come la strumentazione di una cabina |
| `--editor-text` | `#ECEEF0` | `#E7E9EC` | identificatori |
| `--editor-rule` | `#31363D` | `#24282D` | separatore fra numeri di riga e codice |
| `--code-gutter` | `#8E969F` | `#868E98` | numeri di riga |
| `--code-keyword` | `#FF8F87` | `#FF6B71` | parole chiave, peso 600 |
| `--code-number` | `#9FD3FF` | `#F4C27A` | numeri |
| `--code-punct` | `#B5BCC3` | `#A9B0B9` | punteggiatura e operatori |

Le stringhe e i commenti non compaiono nelle tavole: F08 sceglie i loro colori in modo che superino 4,5:1 sul fondo dell’editor e li aggiunge a `docs/design/contrasto.mjs`.

## Caratteri

| Carattere | Schema | Uso | Pesi | Licenza | Fonte |
| --- | --- | --- | --- | --- | --- |
| Saira Condensed | chiaro | nome del tema, titoli delle sezioni, «Tabelle» | 700, 800 | SIL OFL 1.1, nome riservato «Saira» | <https://github.com/google/fonts/blob/main/ofl/sairacondensed/OFL.txt> |
| Michroma | scuro | come sopra | 400 | SIL OFL 1.1 | <https://github.com/google/fonts/blob/main/ofl/michroma/OFL.txt> |
| Atkinson Hyperlegible Next | entrambi | testo, pulsanti, sezioni | 400, 700, corsivo 400 | SIL OFL 1.1 | <https://github.com/google/fonts/blob/main/ofl/atkinsonhyperlegiblenext/OFL.txt> |
| Atkinson Hyperlegible Mono | entrambi | editor, nomi di tabelle e colonne, intestazioni dei risultati, `NULL`, tasti | 400, 600 | SIL OFL 1.1 | <https://github.com/google/fonts/blob/main/ofl/atkinsonhyperlegiblemono/OFL.txt> |

Licenze verificate il 2026-11-18 sui file `OFL.txt` del repository `google/fonts`. Per il nome riservato, F08 usa i file di Saira come sono, senza ritagliarli né modificarli. Nessun carattere ufficiale dei film.

| Variabile | Chiaro | Scuro |
| --- | --- | --- |
| `--font-display` (nuova) | `'Saira Condensed', sans-serif` | `'Michroma', sans-serif` |
| `--display-weight` (nuova) | 800 | 400 |
| `--display-tracking` (nuova) | 0.01em | 0.06em |
| `--h1-size` (nuova) | 52 px | 34 px |
| nome del tema nell’intestazione | 22 px | 17 px |
| `--font-body` | `'Atkinson Hyperlegible Next', system-ui, sans-serif` | uguale |
| `--font-mono` | `'Atkinson Hyperlegible Mono', ui-monospace, monospace` | uguale |

Michroma è molto larga: per questo il titolo della sezione è più piccolo nello schema scuro.

Corpo del testo 17 px a desktop, 16 px a 375 px; editor 15 / 14 px; tabella dei risultati 15 px, intestazioni 13 px.

## Forme

| Elemento | Chiaro | Scuro |
| --- | --- | --- |
| `--radius` | 3 px | 3 px |
| Pulsanti | altezza minima 44 px, 0 18 px di margine interno, testo 16 px 700 | uguale |
| Pulsante primario | pieno `#B3242B`, ombra interna in basso `inset 0 -3px 0 rgba(0,0,0,.22)` | gradiente `#C81B24` → `#9E1219`, filo interno `#FF4F57`, alone `0 0 20px -6px rgba(255,42,53,.9)` |
| Pulsante secondario | trasparente, bordo 1,5 px `--color-control-border` | uguale |
| Riquadri (editor, risultato) | bordo 1 px | bordo 1 px, bordo superiore 2 px |
| Tasti (`kbd`) | bordo 1 px, bordo inferiore 2 px, raggio 4 px, fondo `--color-surface` | uguale |
| `NULL` | carattere mono 0,85 em, bordo 1 px del suo colore, raggio 3 px | uguale |

## Decorazioni

Tutte decorative (`aria-hidden="true"`), senza immagini: gradienti CSS.

### Chiaro, X-wing

- **Linee dei pannelli:** sul fondo della pagina, `repeating-linear-gradient` di 1 px `rgba(27,30,34,.055)` ogni 168 px in verticale e ogni 112 px in orizzontale.
- **Livrea:** in cima all’intestazione due strisce `--color-accent`, 7 px e 3 px, separate da 4 px.
- **Sezione attiva:** sotto la voce, le stesse due strisce in piccolo (4 px e 2 px, separate da 1 px); l’icona della voce in `--color-accent-ink`.
- **Riquadri:** sul bordo superiore, a destra, due tratti rossi di 26 e 14 px alti 5 px.
- **Ali a X:** dietro il titolo, in alto a destra, due bande di 560 × 22 px inclinate di ±16°, in `rgba(27,30,34,.07)`, con due strisce `rgba(179,36,43,.35)` verso le punte; opacità complessiva 0,5.
- **Query interrotta:** bordo sinistro di 8 px a strisce diagonali `#1B1E22` e `#E0A526`.

### Scuro, Morte Nera

- **Piastre:** sul fondo, `repeating-linear-gradient` di 1 px `rgba(255,255,255,.028)` ogni 180 px in verticale e ogni 72 px in orizzontale.
- **Stazione:** in alto a destra, in parte fuori pagina, una sfera di 640 px a opacità 0,55: gradiente radiale da `#2E3339` a `#101215` attraverso `#1A1D21`, una parabola scura con anello `#2B3036` e un riflesso rosso, una fessura equatoriale `#0B0D10`. Evoca la stazione senza riprodurne un’immagine.
- **Intestazione:** sfumatura da `#14171B` verso il fondo.
- **Sezione attiva:** una lama sotto la voce, alta 3 px, con anima `#FFE9EA` e alone `0 0 4px 1px #FF2A35, 0 0 14px 4px rgba(255,42,53,.55)`; l’icona in `--color-accent-ink`.
- **Riquadri:** una spia di 6 px `--saber` con alone, nell’angolo in alto a destra.

## Componenti

Classi e componenti sono quelli di F03 e F05; la veste li tocca solo attraverso variabili e decorazioni.

| Parte | Indicazioni |
| --- | --- |
| Intestazione | «Tutti i temi» con `circle-arrow-left`, in grassetto, colore link; a destra emblema del tema (28–30 px), nome del tema in `--font-display`, selettore. A 375 px va a capo |
| Sezioni | sei voci con la loro icona, 15 px 700, altezza minima 44 px; filetto inferiore 1 px `--color-border` (chiaro) o `--color-rule` (scuro). A 375 px scorrono in orizzontale, senza barra visibile |
| Titolo della sezione | icona della sezione 0,9 em in `--color-accent-ink`, testo in `--font-display` |
| Editor | numeri di riga a destra, separatore 1 px, margine interno 14 px |
| Barra dei comandi | «Esegui» primario con `circle-play`; «Ripristina database» secondario con `circle-arrow-rotate-left`; scorciatoia in `--color-muted` 14 px, nascosta a 375 px |
| Risultato | riga «Tempo: … ms.» in `--color-muted`, poi il riquadro con didascalia «Risultato: N righe», intestazioni in mono 13 px su `--color-surface-2`, filetti `--color-rule`, numeri a destra in mono. A 375 px la tabella scorre dentro il riquadro |
| Avvisi | icona 22 px, titolo in grassetto, messaggio di SQLite in mono 14 px; colori della tabella «Colori» |
| Tabelle del tema | a destra (280 px) a desktop, sotto l’editor a 375 px. Ogni tabella è un riquadro; quella aperta elenca colonne e tipi in mono 13 px, con l’icona `key` sulla chiave primaria. Il triangolo d’apertura è disegnato in CSS, non con un carattere |

Le altre cinque sezioni (addestramento, tutte le query, analisi, schema ER, modello logico) non hanno tavole: usano le stesse variabili e gli stessi riquadri. F08 le rivede nei due schemi.

## Icone tematiche

Da creare in F08 con la skill `icone-rb`, in `themes/star-wars/icone/`, stilizzate e non identiche agli emblemi dei film (sezione «Icone» del piano). Le prime due servono; le altre sono una proposta da confermare con Marco in F08.

| Icona proposta | Significato | Uso |
| --- | --- | --- |
| emblema dell’Alleanza ribelle | la parte del caccia X-wing | pulsante «Chiaro»; emblema del tema nell’intestazione, schema chiaro |
| emblema dell’Impero | la parte della Morte Nera | pulsante «Scuro»; emblema del tema nell’intestazione, schema scuro |
| spada laser | l’arma dei Jedi e dei Sith | decorazione dell’esito «risolto» nell’addestramento |
| caccia X-wing | il caccia ribelle | stato vuoto del catalogo o della sessione, schema chiaro |
| stazione da battaglia | la Morte Nera | stato vuoto, schema scuro |

Le altre icone delle tavole sono RB già nel progetto: `circle-arrow-left`, `terminal-window`, `bullseye`, `list`, `file-lines`, `entity-relationship`, `table`, `circle-play`, `circle-arrow-rotate-left`, `circle-xmark`, `triangle-exclamation`, `key`.

## Contrasti

Misurati il 2026-11-18 con `node docs/design/contrasto.mjs`. Soglia 4,5:1 per il testo, 3:1 per icone e bordi.

| Coppia | Chiaro | Scuro |
| --- | --- | --- |
| testo / fondo | 13,48:1 | 15,66:1 |
| testo / superficie | 15,73:1 | 14,35:1 |
| testo / superficie 2 | 14,51:1 | 12,99:1 |
| secondario / fondo | 6,28:1 | 8,22:1 |
| secondario / superficie | 7,33:1 | 7,53:1 |
| secondario / superficie 2 | 6,76:1 | 6,82:1 |
| link / fondo | 6,07:1 | 8,42:1 |
| link al passaggio del mouse / fondo | 9,41:1 | 11,23:1 |
| testo del pulsante primario | 6,55:1 | 5,77:1 nella parte alta, 8,22:1 in quella bassa, 6,88:1 sul colore pieno |
| selettore premuto | 13,48:1 | 15,66:1 |
| editor: testo | 13,91:1 | 16,38:1 |
| editor: numeri di riga | 5,40:1 | 6,01:1 |
| editor: parole chiave | 7,34:1 | 7,20:1 |
| editor: numeri | 10,20:1 | 12,18:1 |
| editor: punteggiatura | 8,43:1 | 9,10:1 |
| `NULL` / superficie | 7,12:1 | 8,87:1 |
| errore | 7,14:1 | 9,19:1 |
| avviso | 7,19:1 | 11,38:1 |
| ripristino | 6,52:1 | 10,77:1 |
| icone d’accento / fondo (min 3) | 5,28:1 | 5,90:1 |
| bordo dei controlli / fondo (min 3) | 3,76:1 | 3,97:1 |

## Direzioni scartate

| Direzione | Perché |
| --- | --- |
| A — Archivi Jedi: blu notte e azzurro da ologramma | Marco ha chiesto uno schema chiaro e uno scuro, lo scuro più vicino alla Morte Nera e ai Sith |
| B — Fascicolo ribelle: grigio-verde, arancione, titolo stencil | Marco ha chiesto che lo schema chiaro ricordasse di più un X-wing; da qui livrea rossa e scafo grigio, senza stencil |

## Punti aperti per F08

- **Schemi nel contratto del tema:** come `stile.css` dichiara i due schemi (per esempio `[data-scheme="chiaro"]` e `[data-scheme="scuro"]` sulla radice del guscio) e come un tema con un solo schema nasconde il selettore.
- **Chiave di salvataggio della scelta** nel browser, per tema, coerente con le chiavi dei progressi di F05.
- **Colori di stringhe e commenti** nell’editor, da misurare.
- **Emblema nell’intestazione:** le tavole mostrano un solo segnaposto che cambia con lo schema; F08 conferma con Marco se resta così.
- **Contorno del fuoco:** nelle tavole è definito solo sul selettore (3 px `--color-accent-ink`, distanza 2 px); F08 lo estende a tutti i controlli del tema.
