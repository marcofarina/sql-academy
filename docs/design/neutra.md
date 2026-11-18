# Veste neutra — pagina iniziale

Specifica approvata da Marco il 2026-11-18, in F11. F08 la applica senza ridecidere le scelte; ciò che resta aperto è nella sezione «Punti aperti per F08».

- **Tavole:** Artifact «Design» [SQL Academy — veste grafica](https://claude.ai/artifact/QidRnRmM4kWYVVRWnJ63df), privato. Tavole approvate: «Neutra B3 — Le locandine sul tavolo (interattiva)», 1280 × 820, e «Neutra B3 — il mazzo, 375 px (interattiva)», 375 × 812. Si provano con **Play**.
- **Contrasti:** `node docs/design/contrasto.mjs neutra`.

## Idea

La pagina iniziale è un tavolo su cui all’apertura vengono lanciate le locandine dei temi, una per tema, come locandine. I temi possono venire da film, libri, videogiochi: i testi della pagina non nominano un mezzo in particolare (Marco, 2026-11-18, in F08). Cadono in punti e con inclinazioni casuali, anche sovrapposte. Lo studente le sposta trascinandole; un clic su una locandina la porta al centro, la ingrandisce e la gira sul retro, dove trova la scheda del tema e il pulsante «Entra». È l’unico elemento vistoso della pagina: intestazione e testi restano sobri.

## Colori

Valori esatti delle tavole. I nomi delle variabili sono una proposta: F08 li adatta alle variabili comuni di `src/styles.css`.

| Variabile proposta | Valore | Uso |
| --- | --- | --- |
| `--home-wall` | `#E4E7EC` | parete, colore medio |
| `--home-wall-light` | `#F3F5F8` | centro della luce sulla parete |
| `--home-wall-edge` | `#D3D8E0` | bordi della parete |
| `--home-text` | `#172131` | testo, titolo, pulsante primario |
| `--home-muted` | `#46536A` | testo secondario |
| `--home-link` | `#22324A` | link; contorno del fuoco |
| `--home-link-hover` | `#0F1B2D` | link al passaggio del mouse |
| `--home-card` | `#FBFBFC` | retro della locandina (scheda) |
| `--home-chip` | `#EBEEF2` | etichette delle tabelle sulla scheda |
| `--home-rule` | `#D6DBE2` | filetti sulla scheda |
| `--home-control-border` | `#6E7A8E` | bordo dei pulsanti secondari |
| `--home-primary-hover` | `#2C3B55` | pulsante primario al passaggio del mouse |
| `--home-easy` | `#3F8F67` | barra delle difficoltà: facili |
| `--home-medium` | `#2A5F8A` | barra delle difficoltà: medi |
| `--home-hard` | `#22324A` | barra delle difficoltà: difficili |
| velo | `rgba(23, 33, 49, 0.5)` | sopra il tavolo quando una scheda è aperta |
| ombre | `rgba(7, 11, 26, 0.5–0.6)` | sotto le locandine; vedi «Movimento» |

La parete è un gradiente radiale: `radial-gradient(ellipse 75% 65% at 50% 68%, #F3F5F8 0%, #E4E7EC 55%, #D3D8E0 100%)`.

Il fronte delle locandine usa i colori del suo tema (sezione «Locandine»), non questi.

## Caratteri

| Carattere | Uso | Pesi | Licenza | Fonte |
| --- | --- | --- | --- | --- |
| Big Shoulders Display | marchio «SQL Academy», titolo, titoli delle locandine e delle schede | 500, 700, 800, 900 | SIL OFL 1.1 | <https://github.com/google/fonts/blob/main/ofl/bigshouldersdisplay/OFL.txt> |
| Atkinson Hyperlegible Next | tutto il resto | 400, 700, corsivo 400 | SIL OFL 1.1 | <https://github.com/google/fonts/blob/main/ofl/atkinsonhyperlegiblenext/OFL.txt> |

Licenze verificate il 2026-11-18 sui file `OFL.txt` del repository `google/fonts`. Nelle tavole i caratteri arrivano da Google Fonts; F08 li serve dal progetto, con il loro `OFL.txt`.

Scala (desktop / 375 px):

| Elemento | Carattere | Corpo |
| --- | --- | --- |
| marchio | Big Shoulders Display 800 | 26 / 22 px |
| titolo «Scegli un mondo, interroga il database.» | Big Shoulders Display 900, interlinea 0,86 | 80 / 50 px |
| testo introduttivo | Atkinson Hyperlegible Next 400 | 17 / 16 px |
| titolo sul fronte della locandina | Big Shoulders Display 800–900 | 42–68 px, deciso dal tema |
| titolo della scheda | Big Shoulders Display 900 | 58 / 48 px |
| testo della scheda | Atkinson Hyperlegible Next | 14–17 px |
| pulsanti | Atkinson Hyperlegible Next 700 | 17 px |

## Forme

- Locandina chiusa: 230 × 345 px (rapporto 2:3), raggio 8 px.
- Scheda aperta: 420 × 630 px al centro del tavolo; a 375 px, 343 × 660 px, con 16 px di margine.
- Pulsanti: altezza minima 46 px, raggio 6 px. Primario pieno `--home-text` con testo bianco; secondario trasparente con bordo di 1,5 px `--home-control-border`.
- Etichette delle tabelle: raggio 4 px, fondo `--home-chip`.
- Barra delle difficoltà: altezza 10 px, raggio 5 px, segmenti proporzionali al numero di esercizi, separati da 2 px.
- Fuoco: contorno di 3 px `--home-link`, distanza 5 px dalla locandina, 3 px dai pulsanti.

## Composizione

### Desktop (1280 px)

- In alto a sinistra il marchio e il titolo su due righe, larghezza 760 px.
- In alto a destra, colonna di 308 px: il testo «Le locandine sono sul tavolo: spostale per scoprirle, cliccane una per aprire la sua scheda.» e il pulsante secondario «Rimescola» con l’icona `dice`.
- Il tavolo occupa la pagina sotto l’intestazione. Le locandine cadono in quattro fasce orizzontali mescolate a caso, con uno scarto casuale di ±70 px in orizzontale, fra 250 e 460 px dall’alto, inclinate fra −15° e +15°.
- In basso a sinistra: «Le query girano nel tuo browser con SQLite.» e il link a Python Doesn’t Byte.

### 375 px

Le locandine sparse non stanno in una pagina larga 375 px, che peraltro si scorre col dito: diventano un mazzo.

- Marchio, titolo su tre righe e il testo «Sfoglia le locandine, toccane una per aprire la sua scheda.».
- Il mazzo al centro, a ventaglio: la prima locandina dritta, le altre dietro, scalate del 3 % ciascuna, spostate e inclinate di pochi gradi.
- Si sfoglia trascinando la prima locandina in orizzontale per più di 80 px, oppure con i pulsanti «Locandina precedente» e «Locandina successiva» (icone `circle-arrow-left`, `circle-arrow-right`, 48 × 48 px) ai lati dell’indicazione «1 di 4».
- Un tocco apre la scheda a tutta larghezza, con lo stesso giro della versione desktop.

## Movimento

| Momento | Comportamento |
| --- | --- |
| Apertura della pagina | Le locandine partono tutte insieme da sotto il bordo inferiore, vicino al centro, ciascuna ruotata di 25–70° rispetto all’arrivo, e volano al loro posto girando su sé stesse; ognuna ha una durata propria fra 0,7 e 1,05 s, `cubic-bezier(.2, .85, .25, 1.04)`. Rivisto da Marco il 2026-11-18 in F08: nella prima versione partivano una dopo l’altra |
| Passaggio del mouse | La locandina si schiarisce appena (`brightness(1.06)`) |
| Trascinamento | Parte dopo 5 px di movimento. La locandina sale in cima al mucchio, si raddrizza al 40 % della sua inclinazione, cresce del 5 % e prende un’ombra più profonda, `0 40px 50px -20px`. Resta dentro il tavolo |
| Clic senza movimento | Apre la scheda: la locandina va al centro, passa a 420 × 630 px e ruota di 180° sull’asse verticale in 0,84 s, con un andamento simmetrico che passa i 90° a metà; il velo scurisce il tavolo in 0,45 s |
| Chiusura | «Rimetti sul tavolo», un clic sul velo o il tasto Esc: la locandina torna al suo posto con il giro inverso |
| «Rimescola» | Chiude la scheda aperta e sposta le locandine in nuove posizioni, tutte insieme, con durate diverse |
| Stelle e nebbia sulle locandine | Le stelle pulsano piano (3,5 s, avanti e indietro); la nebbia del Signore degli Anelli scorre in 9 s. Sono le sole animazioni continue |

Con `prefers-reduced-motion: reduce` le locandine compaiono già sparse, senza lancio, e nessuna transizione o animazione è attiva.

## Locandine

Il **fronte** appartiene al tema: colori, decorazioni e caratteri del titolo sono del suo mondo. Contiene sempre:

- un motto in alto, 12–13 px (Star Wars: «Una galassia lontana lontana, in sette tabelle.»);
- il titolo del tema, grande, in basso;
- un blocco di crediti da cartellone, in carattere condensato piccolo (Star Wars: «con pianeti personaggi fazioni specie astronavi spade_laser e battaglie, in 105 esercizi»).

Il fronte Star Wars delle tavole: fondo `#070B1A` con stelle (puntini `#FFFFFF`, `#C9D4FF`, `#FFE9A8`), un pianeta che sorge in basso a destra (gradiente radiale da `#FBE6A8` a `#3A1508` attraverso `#E7A247` e `#A9481C`), una luna (`#DDE4F2`, `#7C88A8`, `#2C3350`), titolo `#F2C94C`, motto e crediti `#C3CADB`, colore di base del testo `#F4F1E6`.

Il fronte del Signore degli Anelli nelle tavole è provvisorio e lo ridecide F12. Valori delle tavole: fondo da `#0D1C16` a `#2B4A37` attraverso `#1B3427`; montagne `#1E3A2D` e `#102219`; sole da `#FFF3C8` a `#B38B3A` attraverso `#E2C878`; titolo `#E9D38E`; motto e riga `#D4DCCF`; colore di base del testo `#F1EAD2`.

Il **retro** è la scheda del tema ed è uguale per tutti i temi. I numeri si ricavano dal database e dagli esercizi del tema, non si scrivono a mano:

1. una banda di 10 px nei due colori principali del tema (Star Wars: `#070B1A` e `#F2C94C`);
2. titolo e descrizione del manifest (`title`, `description`);
3. numero di tabelle e di righe, poi le etichette con i nomi delle tabelle (Star Wars: 7 tabelle, 92 righe);
4. numero di esercizi, barra e conteggi per difficoltà, conteggi per capitolo (Star Wars: 105 esercizi; 35 facili, 40 medi, 30 difficili; una tabella 40, join 25, aggregazioni 30, sottoquery e viste 10);
5. «Entra» (primario, icona `circle-arrow-right`, porta alla sandbox del tema) e «Rimetti sul tavolo» (secondario).

Un tema in preparazione ha nella scheda solo titolo, descrizione, una riga sullo stato e «Rimetti sul tavolo».

Finché i temi sono meno di quattro, il tavolo si completa con locandine «Prossimamente» («Tema 3, da scegliere», «Tema 4, da scegliere»): fondo a strisce diagonali di 14 px (`#3A4252`/`#343B4A` e `#4A4F5C`/`#444956`), titolo `#E4E7EC`, riga `#C3CADB`. Il loro retro dice «Un altro mondo da interrogare, ancora da scegliere.».

## Accessibilità

- Ogni locandina chiusa ha un pulsante che la copre per intero, con `aria-label` «Apri la scheda di <tema>»; il tasto Tab passa da una locandina all’altra e Invio apre la scheda.
- La scheda aperta è `role="dialog"` con `aria-modal="true"` e un nome. Il fronte di una locandina aperta e il retro di una chiusa hanno `visibility: hidden`, con il cambio intorno a metà del giro: la faccia che arriva diventa visibile a 0,34 s, quella che se ne va si nasconde a 0,5 s. Così il giro non ha mai un istante senza facce (con il cambio a 0,42 s e un andamento non simmetrico la scheda sembrava sparire) e la faccia nascosta esce dall’ordine di tabulazione.
- Trascinare non è mai necessario: il clic apre, «Rimescola» scopre le locandine coperte e, a 375 px, i pulsanti sostituiscono lo scorrimento col dito.
- Bersagli di almeno 44 px.

## Icone

Solo icone RB già nel progetto: `dice` («Rimescola»), `circle-arrow-right` («Entra»), `circle-arrow-left` e `circle-arrow-right` (sfoglia del mazzo). Nessuna icona nuova.

## Contrasti

Misurati il 2026-11-18 con `node docs/design/contrasto.mjs neutra`. Soglia 4,5:1 per il testo, 3:1 per bordi e segmenti.

| Coppia | Rapporto |
| --- | --- |
| testo / parete (`#172131` su `#E4E7EC`) | 13,05:1 |
| testo / parete ai bordi (`#D3D8E0`) | 11,30:1 |
| secondario / parete (`#46536A` su `#E4E7EC`) | 6,26:1 |
| secondario / parete ai bordi | 5,42:1 |
| link / parete (`#22324A`) | 10,44:1 |
| scheda: testo / secondario / etichette | 15,64:1 / 7,50:1 / 13,90:1 |
| pulsante primario, normale / al passaggio del mouse | 16,17:1 / 11,27:1 |
| bordo del pulsante secondario: parete / bordi della parete / scheda | 3,50:1 / 3,03:1 / 4,20:1 |
| barra: facili / medi / difficili su `#FBFBFC` | 3,81:1 / 6,55:1 / 12,51:1 |
| locandina Star Wars: motto e crediti / titolo | 11,93:1 / 12,35:1 |
| «Prossimamente» 3: titolo / riga | 8,14:1 / 6,15:1 |
| «Prossimamente» 4: titolo / riga | 6,61:1 / 4,99:1 |

Correzioni fatte durante lo studio: bordo dei pulsanti secondari da `#8C97A8` (2,38:1) a `#6E7A8E`; segmento «facili» da `#7FB89A` (2,20:1) a `#3F8F67`; segmento «medi» da `#3E7FA8` a `#2A5F8A`, perché i tre segmenti si distinguessero anche per luminosità.

## Direzioni scartate

| Direzione | Perché |
| --- | --- |
| 0 — la pagina come risultato di `SELECT … FROM temi` | Marco: «veramente semplice e banale» |
| A — cassettiera d’archivio | non scelta |
| B — dorsi su uno scaffale | piaciuta, ma Marco ha preferito locandine di film ai volumi |
| B2 — galleria di locandine animata | superata dall’idea di Marco del tavolo con le locandine lanciate |
| C — diagramma ER su carta da progetto | non scelta |

## Punti aperti per F08

- **Fronte della locandina nel contratto del tema.** Aggiungere un tema non deve toccare il codice comune, quindi il fronte deve stare nella cartella del tema. Proposta: motto e crediti nel manifest, decorazione in un file del tema (per esempio `themes/<id>/locandina.css`); decide F08 con Marco.
- **Numeri della scheda.** Tabelle e righe dal database del tema, esercizi dai conteggi di `esercizi.ts`: vanno calcolati al build o all’apertura, mai scritti a mano.
- **Fuoco all’apertura.** Nelle tavole il fuoco non si sposta: F08 lo porta su «Entra» quando la scheda si apre e lo riporta sulla locandina quando si chiude.
- **Nomi delle variabili** della tabella «Colori»: proposta da allineare a quelle comuni di `src/styles.css`.
