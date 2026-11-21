# Barra comune, stato dello zaino e notifica dell’esito

Specifica approvata da Marco il 2026-11-21, in F02 del piano `portale-v2`. F04 costruisce la barra e lo stato dello zaino, F05 la notifica, F03 le pagine Zaino e Classifica sotto la barra: nessuna di queste fasi ridecide le scelte qui sotto. Ciò che resta aperto è in «Punti aperti».

- **Tavole:** Artifact «Design» [SQL Academy — barra comune e notifica](https://claude.ai/artifact/GjaruUBdHCVavq5iYXQtvp), privato.
  - «Barra A — una riga sola», a 1280 e 375 px: **approvata**.
  - «Barra B — striscia del sito e intestazione del tema», a 1280 e 375 px: scartata, resta come confronto.
  - «Stato dello zaino nella barra»: sei stati in cinque vesti, più la riga solo icona.
  - «Notifica dell’esito» (interattiva, 1280 px), «Notifica dell’esito — 375 px» (interattiva), «Notifica dell’esito — tutte le varianti».
- **Contrasti:** `node docs/design/contrasto.mjs barra-notifica`. Verificato il 2026-11-21: 60 coppie su 60 sopra la soglia.
- **Vesti:** colori e caratteri vengono da `docs/design/neutra.md`, `star-wars.md` e `lotr.md`; questa specifica non aggiunge colori, solo usi nuovi di variabili esistenti.

## Decisioni

Prese da Marco il 2026-11-21 sulle tavole: ha scelto la direzione A e non ha chiesto modifiche alle altre proposte.

| Domanda (F02, § 3) | Scelta | Motivo |
| --- | --- | --- |
| Forma della barra | Direzione A: una riga sola in ogni pagina | Gli stessi elementi stanno nello stesso posto ovunque; il tema resta riconoscibile da emblema e carattere senza una riga in più |
| Zaino e Classifica raggiunte da un tema | Veste neutra del sito, con «Indietro» che nomina la provenienza: «Torna a Star Wars» | Sono pagine del sito, non del tema; F03 le disegna in neutra. L’alternativa scartata è la riga 6b della tavola A |
| «Indietro» senza provenienza (link diretto, scheda nuova) | Diventa «Tutti i temi» e porta a `#/` | Una destinazione sempre valida, con un nome che dice dove porta |
| Posizione della notifica | Desktop: sotto la barra, a destra, vicino a saldo e zaino. Telefono (tavola a 375 px): dal fondo, larga quanto lo schermo meno i margini | Su desktop la notifica parla di saldo e zaino e sta accanto a loro; sul telefono il fondo è vicino al pollice e non copre la consegna |
| Notifica in una sessione | Non fa avanzare la sessione: «Prossimo esercizio» resta nella pagina e funziona anche con la notifica aperta | Chi va di fretta non aspetta la notifica; chi legge non perde l’esercizio |
| Zaino non collegato | «Salvato in questo browser.» più il link «Collega lo zaino» | Dice dove sta il progresso e offre il rimedio senza insistere |
| Altri eventi | La notifica serve solo all’esercizio risolto. Lo zaino che torna in rete si vede solo nella pillola; gli aiuti comprati restano come oggi | Una notifica rara si legge; una frequente si impara a ignorare |
| Pausa del tempo | Puntatore sopra **tutta** la notifica o fuoco della tastiera dentro di essa | Estende la decisione del piano («il puntatore sopra il pulsante»): chi legge la riga dello zaino non deve vederla sparire |

## Barra comune

Una riga alta 64 px, fondo `--color-bg` della veste, filetto inferiore 1 px `--color-rule`, margine interno 0 24 px, elementi a 18 px l’uno dall’altro. In ogni pagina, da sinistra a destra:

1. **Marchio** «SQL Academy»: link a `#/`, Big Shoulders Display 800, 24 px, colore `--color-text`, bersaglio alto 44 px. Uguale in tutte le vesti: è il segno del sito.
2. **Filetto verticale** 1 px × 28 px, `--color-border`. Assente nella pagina iniziale.
3. **Identità della pagina:**
   - dentro un tema: emblema (26 px, `--color-accent-ink`, cambia con lo schema come oggi) e nome del tema nel carattere titoli della veste, alla misura della veste (`--fs` delle tavole: 28 px Star Wars chiaro, 20 px Star Wars scuro, 30 px LOTR chiaro, 24 px LOTR scuro);
   - in Zaino, Classifica, Informativa, pagina non trovata: «Indietro» con `circle-arrow-left` (19 px), 15 px 700, colore `--color-link`; il testo segue la regola di «Indietro» più sotto;
   - nella pagina iniziale: niente.
4. Spazio elastico.
5. **Saldo**, solo dentro un tema: `coin` 20 px in `--color-accent-ink`, numero 15 px 700, «punti» 400 in `--color-muted`. Dopo un esercizio risolto compare accanto per 2,4 secondi il gettone «+20» (13 px 700, `--color-success` su `--color-success-bg`, bordo 1 px `--color-success-border`, raggio pieno).
6. **Pillola dello zaino**, link a `#/zaino` (sezione successiva).
7. **Classifica**: `trophy` 19 px e «Classifica», 15 px 700, `--color-link`, link a `#/classifica`.
8. **Selettore dello schema**, solo nei temi con due schemi: gruppo con bordo 1,5 px `--color-control-border`, raggio pieno, margine interno 3 px; pulsanti alti 34 px con emblema 17 px e testo 14 px 700; premuto con fondo `--color-text` e testo `--color-bg`.

Il link della pagina corrente («Zaino» o «Classifica») porta `aria-current="page"`, colore `--color-text` e una linea inferiore interna di 3 px in `--color-accent-ink`.

Le sezioni del tema restano sotto la barra come oggi, con l’indicatore animato di F18 del piano archiviato.

### Vesti

La barra prende i colori dalla veste della pagina: le variabili sono quelle già esistenti e un tema la riveste dal suo `stile.css`, come fa oggi con `theme-header`, `back-link` e `zaino-link`.

| Pagina | Veste della barra |
| --- | --- |
| Pagina iniziale | neutra (`docs/design/neutra.md`, parete `#E4E7EC`) |
| Pagine di un tema | quella del tema, nello schema scelto |
| Zaino, Classifica, Informativa, pagina non trovata | neutra del sito (guscio neutro, fondo `#F3F5F8`), anche se raggiunte da un tema |

### «Indietro»

- Se si arriva da una pagina del portale, il link riporta a quella pagina (indirizzo completo, sezione compresa) e la nomina: «Torna a Star Wars», «Torna a Il Signore degli Anelli», «Torna alla classifica», «Torna allo zaino».
- Se non c’è provenienza — link diretto, ricarica, scheda nuova — diventa «Tutti i temi» e porta a `#/`.
- Il link non usa `history.back()`: con un link diretto porterebbe fuori dal sito.

Come ricordare la provenienza lo decide F04. Se lo salva nel browser, vale la decisione «Dati nel browser» del piano.

### 375 px

Tavola «Barra A — 375 px».

- **Prima riga, 56 px:** marchio (21 px), spazio, saldo, pillola dello zaino solo icona, coppa solo icona. Pillola e coppa sono bersagli di 44 × 44 px.
- **Seconda riga, 52 px**, con filetto inferiore: nome del tema (78 % della misura desktop, emblema 22 px) e selettore dello schema solo icone (pulsanti di 38 px), oppure «Indietro».
- **Sezioni:** scorrono in orizzontale su una riga.

Pillola e coppa ridotte a icone tengono il nome per esteso nel nome accessibile: `aria-label="Zaino: salvato"`, `aria-label="Classifica"`.

## Stato dello zaino

La pillola dice lo stato con tre segnali insieme, perché il colore da solo non basta: la **forma** (tratteggiata se lo zaino non è collegato, piena se lo è), un **distintivo** sull’icona e una **parola**.

Misure della pillola:

- alta 40 px, margine interno 0 14 px 0 11 px, raggio pieno;
- bordo 1,5 px `--color-control-border`, fondo `--color-surface`;
- `backpack` 22 px e «Zaino» 15 px 700, poi la parola dello stato 14 px 400;
- distintivo: cerchio di 15 px del colore del fondo della pillola, in basso a destra dell’icona (−6 px, −5 px), con dentro un’icona di 13 px.

| Stato | Dati in `sincronizza.ts` | Parola | Distintivo | Aspetto |
| --- | --- | --- | --- | --- |
| Collegato e sincronizzato | `fase: 'sincronizzato'`, `inSospeso: false` | «salvato» | `circle-check`, `--color-success` | parola in `--color-success` |
| Modifiche in sospeso | `fase: 'sincronizzato'`, `inSospeso: true` | «in attesa» | `cloud-arrow-up`, `--color-text` | parola in `--color-muted` |
| In sincronizzazione | `fase: 'in-corso'` | «salvataggio…» | cerchio che ruota (11 px, tratto 2 px, 0,9 s), `--color-text` | parola in `--color-muted` |
| Non collegato | `fase: 'scollegato'` | «non collegato» | nessuno | fondo trasparente, bordo tratteggiato, tutto in `--color-muted` |
| Senza rete | `fase: 'offline'` | «senza rete» | `cloud-slash` (nuvola barrata; segnaposto nelle tavole) | fondo, bordo e testo dell’avviso (`--color-warning-bg`, `-border`, `--color-warning`) |
| In errore | `fase: 'errore'` | «errore» | `circle-xmark` | fondo, bordo e testo dell’errore (`--color-error-bg`, `-border`, `--color-error`) |

- Con `prefers-reduced-motion: reduce` il cerchio non ruota: al suo posto `cloud-arrow-up`, come per «in attesa».
- La frase completa resta nel `title` e nel nome accessibile: `testoStato` di `src/zaino/labels.ts`, con una frase nuova per «Non collegato»: «Zaino non collegato: i progressi restano in questo browser.».
- L’icona `triangle-exclamation` di oggi sparisce dalla pillola: lo stato di problema si legge dal colore e dalla parola.

## Notifica dell’esito

Sostituisce il riquadro verde `VerdictView` («Esercizio risolto») quando la risposta è giusta. L’esito sbagliato resta nel riquadro di oggi.

### Contenuto

Dall’alto in basso, con 14 px fra un blocco e l’altro:

1. **Testa:** `circle-check` 26 px in `--color-success`, «Esercizio risolto» 18 px 700, sotto il titolo dell’esercizio e la difficoltà, 14 px `--color-muted` («Spade laser per colore · medio»).
2. **Punti**, in uno di due modi:
   - con premio: `coin` 30 px in `--color-accent-ink`, «+20» nel carattere titoli della veste a 40 px, «punti» 16 px 700; a destra «saldo» 14 px `--color-muted` e sotto il nuovo saldo 16 px 700;
   - senza premio: moneta in `--color-muted`, «Nessun punto» a 26 px, saldo a destra, e sotto il motivo, 14 px `--color-muted`. I motivi sono due:
     - soluzione aperta prima di risolverlo: «Nessun premio, perché avevi aperto la soluzione prima di risolverlo.»;
     - esercizio già risolto: «L’avevi già risolto: il premio di un esercizio si incassa una volta sola.».
3. **Riga dello zaino:** riquadro con fondo `--color-bg`, raggio 8 px, margine interno 10 px 12 px, testo 14 px. Icona `backpack` 20 px con distintivo di 13 px, come nella pillola. Testi e colori nella tabella sotto.
4. **«OK»:** pulsante largo quanto la notifica, alto 46 px, raggio 8 px, bordo 1,5 px `--color-control-border`, testo 16 px 700.

Misure della notifica: larga 372 px, fondo `--color-surface`, bordo 1 px `--color-border`, raggio 12 px, ombra `0 22px 44px -20px rgba(7,11,26,.55)`, margine interno 18 px 18 px 16 px.

### Riga dello zaino

La riga si aggiorna mentre la notifica è aperta, seguendo lo stato dello zaino.

| Stato | Testo | Aspetto |
| --- | --- | --- |
| Scrittura in corso | «Lo sto mettendo nello zaino…» | distintivo che ruota |
| Salvato | «Salvato nello zaino alle 10:42.» (ora dell’ultima sincronizzazione) | distintivo `circle-check` in `--color-success` |
| Scrittura rimandata | «Lo metto nello zaino fra pochi secondi.» | distintivo `cloud-arrow-up` |
| Non collegato | «Salvato in questo browser. [Collega lo zaino](#/zaino) per ritrovarlo su un altro computer.» | testo `--color-muted`, link `--color-link` 700, nessun distintivo |
| Senza rete | «Sei senza rete: resta in questo browser e parte nello zaino appena torna.» | colori dell’avviso |
| In errore | «Lo zaino non risponde: l’esercizio resta salvato in questo browser e riprovo fra poco.» | colori dell’errore |

### Riempimento e chiusura

- **Riempimento:** «OK» si riempie da sinistra a destra in **4 secondi**, poi la notifica si chiude da sola. Il riempimento è del colore `--color-text`; sotto di esso la scritta «OK» si inverte in `--color-surface`. Nelle tavole sono due etichette sovrapposte, quella riempita ritagliata con `clip-path: inset(0 X% 0 0)`.
- **Perché il colore del testo:** un colore intermedio arrivava al massimo a 1,63:1 sul fondo del pulsante, e in Il Signore degli Anelli nessun colore teneva insieme 3:1 sul fondo e 4,5:1 sotto la scritta (misurato il 2026-11-21).
- **Pausa:** il tempo si ferma finché il puntatore è sopra la notifica o il fuoco della tastiera è dentro di essa, e riparte da dove era. Il fuoco esce solo quando passa a un elemento fuori dalla notifica: un `blur` verso il link «Collega lo zaino» non conta.
- **Chiusura a mano:** «OK» o Esc.
- **Fuoco:** l’apertura della notifica non sposta il fuoco, che resta nell’editor.
- **Annuncio:** la notifica ha `role="status"` e `aria-label="Esito dell’esercizio"`.
- **Movimento ridotto:** con `prefers-reduced-motion: reduce` non c’è riempimento, non si chiude da sola e non c’è animazione d’entrata; resta aperta finché lo studente preme «OK» o Esc.
- **Entrata:** su desktop scende di 12 px in 0,32 s (`cubic-bezier(.2,.85,.25,1.04)`); dal fondo sale di 16 px.
- **Contorno del fuoco** su «OK»: 3 px `--color-accent-ink` a 3 px di distanza.

### Posizione

- **Desktop:** fissa, 24 px dal bordo destro, appena sotto la barra.
- **Telefono:** in basso, a 12 px da sinistra, destra e fondo, larghezza automatica, numero dei punti a 34 px.

In una sessione di esercizi «Prossimo esercizio» compare nella pagina appena l’esercizio è risolto, indipendente dalla notifica. Dopo la chiusura la pillola dello zaino continua a mostrare lo stato.

### Saldo nella barra

Il saldo nella barra si aggiorna appena l’esercizio è risolto, insieme alla notifica, e mostra «+20» per 2,4 secondi. Se il premio è zero, niente gettone.

## Icone

Tutte già nel progetto (`src/assets/icons/`): `backpack`, `trophy`, `coin`, `circle-arrow-left`, `circle-check`, `circle-xmark`, `cloud-arrow-up`. Gli emblemi dei temi sono quelli delle vesti.

Nuova, disegnata in F04 con la skill `icone-rb`: `cloud-slash` (**nuvola barrata**) per «senza rete», distintivo della pillola e della riga dello zaino. Nelle tavole è un cerchio tratteggiato.

## Punti aperti

Per F04:

- disegnare la nuvola barrata;
- scegliere come ricordare la pagina di provenienza di «Indietro», e se nel browser, cancellarla con «Azzera i progressi» e «Esci dallo zaino»;
- aggiungere a `src/zaino/labels.ts` la frase di «Non collegato» e le parole brevi della pillola;
- unificare le intestazioni di oggi (`theme-header`, `home-header`, i `back-link` di Zaino, Classifica, Informativa e pagina non trovata) in un componente unico, tenendo vestibile la barra dal `stile.css` di ogni tema.

Per F05:

- decidere se scrivere nello zaino subito dopo un esercizio risolto o tenere l’attesa di 5 secondi (`RITARDO_MODIFICA`). La tavola mostra entrambe le strade:
  - variante «collegato»: la scrittura parte subito e la riga passa da «Lo sto mettendo nello zaino…» a «Salvato»;
  - variante «sospeso»: la riga dice «fra pochi secondi» e la pillola completa il racconto dopo la chiusura;
- scegliere la larghezza sotto cui la notifica passa dall’alto a destra al fondo (le tavole mostrano 1280 e 375 px);
- ricavare dal registro dei punti il motivo dello zero (soluzione vista o esercizio già risolto);
- verificare che la notifica non copra l’editor a 1280 px con le sezioni più alte.

Per F03: le pagine Zaino e Classifica partono dalla barra di questa specifica, in veste neutra del sito.
