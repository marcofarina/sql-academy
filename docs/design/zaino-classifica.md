# Pagine Zaino e Classifica

Specifica approvata da Marco il 2026-11-21, in F03 del piano `portale-v2`. F07 la costruisce senza ridecidere le scelte; ciò che resta aperto è in «Punti aperti per F07».

- **Tavole:** Artifact «Design» [SQL Academy — Zaino e Classifica](https://claude.ai/artifact/H5sQetR5VrudYRSy9CtV6Q), privato.
  - «Classifica A2 — dieci mondi», a 1280 e 375 px, e «Classifica A2 — scelta della classifica», 375 px: **approvate**.
  - «Classifica A2 — stati»: **approvata**.
  - «Zaino — non collegato» a 1280 e 375 px, «Zaino — creazione in tre passi», «Zaino — collegato»: **approvate**.
  - «Classifica A — podio e lista» e «Classifica B — la tua scalata»: le prime due direzioni, rimaste come confronto.
- **Contrasti:** `node docs/design/contrasto.mjs zaino-classifica`. Verificato il 2026-11-21: 37 coppie su 37 sopra la soglia.
- **Veste:** neutra del sito (`docs/design/neutra.md`, guscio neutro di `src/styles.css`), sotto la barra comune di `docs/design/barra-notifica.md`. Nessun colore nuovo nelle variabili del sito: i colori nuovi sono solo quelli delle iniziali e del podio, in tabella «Colori».
- **Servizio della classifica:** nessuna modifica. Tutti i dati delle tavole vengono da `leggiClassifica` e `leggiPosizione` di oggi.

## Decisioni

Prese da Marco il 2026-11-21 sulle tavole.

| Domanda | Scelta | Motivo |
| --- | --- | --- |
| Direzione della classifica | A: podio dei primi tre e lista dal quarto | Marco ha scelto A fra A e B («la tua scalata», con tre tabelloni affiancati) |
| Scelta fra le classifiche | Colonna «Quale classifica» a sinistra, divisa per livello dei mondi; sul telefono un pulsante che apre un pannello dal basso (variante A2) | Le schede in fila della prima A non reggono dieci mondi: Marco, «ora con 2 mondi ok, ma con 10?» |
| Posizione nei singoli mondi | Accanto a ogni mondo nella colonna, «—» se non hai punti | Approvata da Marco sapendo che costa una lettura di `leggiPosizione` per mondo a ogni apertura della pagina |
| Codice dello zaino | Quattro caselle numerate da 1 a 4, con autocompletamento dall’elenco delle 2048 parole | Requisito di Marco: l’ordine delle parole deve vedersi |
| Creazione dello zaino | Tre passi come nei wallet: avvertenza, parole, verifica; lo zaino nasce solo dopo la verifica | Requisito di Marco |
| «Mostra il codice» nello zaino collegato | Resta | Chi perde la copia ma ha lo zaino aperto su un dispositivo può ancora ritrovare il codice (Marco, 2026-11-21) |

## Classifica

### Desktop (1280 px)

Contenitore largo al massimo 1200 px, margine interno 40 px, due colonne: 260 px e il resto, a 40 px di distanza.

**Colonna «Quale classifica»** (`nav` con `aria-label="Quale classifica"`), ferma mentre la pagina scorre (`position: sticky`, 24 px dall’alto):

1. Titolo «Quale classifica», 15 px 700.
2. Voce «Generale» con `trophy` 20 px e la tua posizione.
3. Un gruppo per livello dei mondi, nell’ordine del contratto di F09: «Per cominciare», «Intermedi», «Complessi». Etichetta del gruppo 13 px 700 maiuscolo, `--color-muted`. Un gruppo senza mondi non compare.
4. Ogni voce è un link alto almeno 44 px, raggio 8 px: pallino di 20 px nei due colori della locandina del mondo (fondo e anello interno di 1,5 px), nome del mondo 15 px, posizione in Big Shoulders Display 800 20 px allineata a destra (`17º`, oppure «—»).
5. Voce scelta: fondo `--color-text`, testo bianco, 700, `aria-current="page"`. Al passaggio del mouse le altre prendono fondo `#E4E7EC`.

Sotto la colonna: la scheda della partecipazione («Partecipi come <nome>.», «Classifica aggiornata alle 19:42.» in `--color-success`, «Esci dalla classifica» secondario) e la riga «La classifica è un gioco, non un voto…» con il link all’informativa.

**Colonna principale**, dall’alto:

1. Titolo «Classifica generale» o «Classifica di <mondo>», Big Shoulders Display 900 72 px; sotto una riga 17 px `--color-muted` (per la generale: «Somma i punti di tutti i mondi…»).
2. **Fascia della posizione**, fondo `--color-text`, raggio 10 px, margine 16 × 22 px: posizione in Big Shoulders Display 900 64 px, nome e «· tu» 17 px 700, punti in `#C3CADB`; a destra «Ti mancano <strong>N punti</strong> per superare <nome>.». N è la differenza con il vicino sopra, da `Posizione.neighbors`; al primo posto la frase diventa «Sei in testa.» (testo da scrivere in F07).
3. **Podio**: tre colonne, ordine visivo 2º, 1º, 3º (ordine nel codice 1º, 2º, 3º). Per ciascuno: iniziali in un cerchio di 56 px, nome 16 px 700, punti in Big Shoulders Display 800 28 px, blocco con il numero in Big Shoulders Display 900 64 px bianco. Altezze 176, 132, 104 px; fondi `#172131`, `#2C3B55`, `#46536A`; raggio 8 px in alto.
4. **Lista dal 4º**: scheda `--color-surface`, bordo 1 px `--color-rule`, raggio 10 px. Righe alte 54 px con colonne 48 px (posizione, Big Shoulders Display 800 24 px, a destra), 40 px (iniziali, cerchio 36 px), nome 16 px 700, barra dei punti 200 px, punti 84 px a destra in cifre tabulari. Barra: binario 8 px `#E4E7EC`, riempimento `#6E7A8E` lungo in proporzione ai punti del primo. Mostra fino al 20º, poi «Mostra fino al 50º».
5. **La tua riga**, se è fra le mostrate: fondo `#E4E9F0`, segno a sinistra di 4 px `--color-text` (`box-shadow: inset 4px 0 0`), barra `--color-text`, etichetta «tu» (13 px 700, bianco su `--color-text`, raggio pieno), `aria-current="true"`. Se sei oltre il 20º ma entro il 50º, la lista continua fino alla tua riga; oltre il 50º compare sotto la lista la sezione «Intorno a te» con `Posizione.neighbors`.

### Iniziali

Un cerchio con le iniziali delle prime due parole del nome («Lontra Tenace 42» → «LT»), bianche 700. Il colore si sceglie in modo stabile dal nome (per esempio una somma dei codici dei caratteri modulo 6), così lo stesso nome ha sempre lo stesso colore. Il nome intero sta accanto, quindi il cerchio è `aria-hidden="true"`.

### Telefono (375 px)

Barra comune come in `barra-notifica.md`. Poi titolo 52 px, testo 16 px e:

1. **Pulsante della classifica** al posto della colonna: alto 56 px, bordo 1,5 px `--color-control-border`, raggio 10 px; dentro «Classifica» 13 px `--color-muted`, sotto «Generale · sei 17º» 17 px 700, a destra `list` 20 px e «Cambia». `aria-haspopup="dialog"`.
2. Il pulsante apre il **pannello di scelta**: dal fondo, raggio 16 px in alto, velo `rgba(23, 33, 49, 0.5)`, maniglia di 40 × 4 px, titolo «Quale classifica» e «Chiudi»; dentro lo stesso elenco della colonna desktop, voci alte 48 px, che scorre se non ci sta. `role="dialog"`, `aria-modal="true"`; si chiude con «Chiudi», un tocco sul velo, Esc o la scelta di una voce, e il fuoco torna sul pulsante.
3. Podio più piccolo: cerchi 44 px, punti 22 px, numeri 44 px, altezze 112, 84, 64 px.
4. Lista dal 4º al 10º senza barra, «Mostra fino al 50º», poi «Intorno a te» con le posizioni vicine e la tua riga.
5. **Barra fissa della posizione** in fondo allo schermo, 8 px dai lati e 12 px dal fondo, alta 64 px, fondo `--color-text`, raggio 12 px: «17º» in Big Shoulders Display 900 36 px, «Tu · 980 punti» 15 px 700, «40 punti per salire al 16º» 13 px `#C3CADB`. La pagina ha 96 px di spazio in fondo perché la barra non copra l’ultima riga.
6. Scheda della partecipazione e riga dell’informativa in fondo alla pagina.

### Stati

| Stato | Che cosa cambia |
| --- | --- |
| Zaino collegato, non partecipi | Al posto della fascia della posizione: riquadro con bordo 1,5 px `--color-control-border`, `id-badge` 40 px, «Vuoi entrare in classifica?», una riga di spiegazione e «Partecipa» (primario). Posizioni nella colonna a «—»; podio e lista visibili, senza la tua riga |
| Zaino non collegato | Lo stesso riquadro con bordo tratteggiato, `backpack`, «Per partecipare serve lo zaino» e «Apri lo zaino» (secondario, link a `#/zaino`) |
| Servizio irraggiungibile | Avviso in `--color-warning` su `--color-warning-bg` con `triangle-exclamation`: «La classifica non risponde», ora del nuovo tentativo e «Esercizi, punti e zaino funzionano lo stesso». Senza dati: podio a sagome tratteggiate, niente lista, posizioni a «—». Con dati già letti: restano, con l’avviso sopra |
| Classifica vuota | Podio a sagome tratteggiate con i numeri, «Il primo posto è libero» sopra il 1º, «Nessuno ha ancora punti in questo mondo. Risolvi un esercizio e sei sul podio.» e «Vai agli esercizi» (primario, al percorso del mondo; nella generale, alla pagina iniziale) |
| Partecipi ma senza punti in questa classifica | Fascia della posizione con «Non hai ancora punti in questa classifica» e «Vai agli esercizi» |
| Caricamento | «Carico la classifica…» con `role="status"`, come oggi |
| Iscrizione respinta, in attesa o rifiutata | I testi di oggi (`src/classifica/labels.ts`) nella scheda della partecipazione |

Uscire dalla classifica chiede conferma come oggi.

## Zaino

### Non collegato

Desktop: titolo «Zaino» 72 px e una riga su che cosa fa lo zaino; poi due schede affiancate (1,45 : 1) e sotto il riquadro «Che cosa succede ai tuoi progressi». Telefono: le stesse cose in colonna; il riquadro diventa un `details` chiuso.

**Apri il tuo zaino** (`form`):

- Testo: una parola per casella, «nell’ordine giusto» in grassetto: le stesse parole in un altro ordine aprono un altro zaino, o nessuno.
- **Quattro caselle** in un `fieldset` con legenda nascosta «Codice dello zaino, quattro parole in ordine». Ogni casella ha sopra (desktop) o accanto (telefono) un numero in un cerchio di 26–30 px, bianco su `--color-text`, e un nome accessibile: «Prima parola»… «Quarta parola». Casella alta 50 px, bordo 1,5 px `--color-control-border`, raggio 8 px, fondo bianco, testo 18 px 700. Desktop: in fila, separate da «›» (`aria-hidden`); telefono: in colonna.
- **Autocompletamento**: da due lettere in su, sotto la casella un `listbox` con le parole dell’elenco che cominciano così, al massimo sei, con le lettere scritte in grassetto. Frecce per scegliere, Invio o Tab per accettare; la casella è un `combobox` (modello ARIA 1.2).
- **Passaggio di casella**: Spazio, Tab o la scelta di un suggerimento portano alla casella dopo. Incollare il codice intero (con spazi o trattini) in una casella lo divide fra le quattro.
- Bastano le prime quattro lettere di ogni parola, come oggi.
- «Hai un codice di prima, di 20 caratteri? Scrivilo in una casella sola»: il link sostituisce le quattro caselle con il campo unico di oggi.
- «Non è il mio computer»: casella di spunta con la spiegazione di oggi, in un riquadro bianco con bordo 1 px `--color-rule`.
- «Apri lo zaino», primario.
- Errori: riquadro `--color-error` su `--color-error-bg` con `role="alert"`, testi di `TESTI_APRI`. Per `inesistente` e `illeggibile` il testo nomina l’ordine: «Non trovo uno zaino con queste parole. Controlla che siano scritte giuste e che l’ordine sia quello del codice.»

**Non hai ancora uno zaino?** Testo breve e «Crea uno zaino» (secondario), che apre la creazione.

**Che cosa succede ai tuoi progressi**, una riga per azione:

| Azione | Testo |
| --- | --- |
| Apri | I progressi di questo browser si uniscono a quelli dello zaino: non si perde niente da nessuna delle due parti |
| Crea | I progressi di questo browser entrano nello zaino nuovo |
| Non è il mio computer | Lavori sui progressi dello zaino solo in questa scheda; quando la chiudi spariscono da qui e restano nello zaino |
| Esci | Codice e progressi spariscono da questo browser; nello zaino restano |

Sotto: che cosa contiene lo zaino e il link all’informativa.

### Creazione

Tre passi più la conferma, nella stessa pagina (non una finestra sopra), con una barra di tre segmenti da 6 px (`#C5CCD6`, quelli fatti `--color-text`) e «Passo N di 3». A ogni cambio di passo il fuoco va sul titolo del passo.

1. **Prima di cominciare.** Le parole sono l’unica chiave; copiale nell’ordine in cui le vedi; dopo questa procedura le rivedi solo nella pagina Zaino di un dispositivo dove lo zaino è aperto; se le perdi dappertutto lo zaino è perso. Casella «Ho capito: le salvo prima di andare avanti»; «Mostra le parole» (primario) si attiva solo con la casella spuntata; «Annulla».
2. **Le tue quattro parole.** Quattro riquadri numerati, alti 58 px, bordo 1,5 px `--color-text`, parola 22 px 700, `translate="no"`. «Copia il codice» (secondario, `copy`) copia `parola-parola-parola-parola`. «Le ho salvate» (primario), «Indietro», «Annulla».
3. **Riscrivile qui.** Le stesse quattro caselle dell’apertura, vuote, con autocompletamento. Il confronto usa le prime quattro lettere, come l’apertura. Una casella sbagliata prende bordo 2 px e numero in `--color-error`, fondo `--color-error-bg`, `aria-invalid="true"`, e il messaggio «La parola N non è quella giusta. Controlla la tua copia.» (`role="alert"`). «Crea lo zaino» (primario), «Rivedi le parole» (torna al passo 2 senza cambiare parole), «Annulla».
4. **Il tuo zaino è pronto.** `circle-check` 72 px in `--color-success`, «Dentro ci sono i progressi che avevi in questo browser…» e «Vai allo zaino», che mostra lo zaino collegato.

Lo zaino nasce sul servizio solo con «Crea lo zaino» al passo 3. Fino ad allora le parole vivono solo nello stato del componente: **non si salvano nel browser**, e «Annulla», una ricarica o l’uscita dalla pagina le buttano via. Se il servizio non risponde, «Non sono riuscito a creare lo zaino. Riprova fra un po’.» e si resta al passo 3 con le parole scritte.

### Collegato

Titolo «Zaino» con accanto lo stato, `role="status"`, nei testi di `testoStato` (per esempio «Collegato · salvato alle 19:42» in `--color-success` con `circle-check`; gli altri stati con le icone della pillola). Due colonne (1,5 : 1):

- **Che cosa c’è nello zaino:** una riga per ogni mondo con progressi, alta 56 px: pallino del mondo, nome 700, «38 esercizi su 150» con una barra (binario `#E4E7EC`, riempimento `--color-link`), punti a destra. Sotto: «Negli altri mondi non hai ancora progressi.» e una riga su suggerimenti, query, note del libro e nome in classifica.
- **Il codice:** testo di oggi, «Mostra il codice» (`key`); aperto, le quattro parole in riquadri numerati su due colonne, «Nascondi il codice» e «Copia».
- **Esci dallo zaino:** testo e conferma di oggi, `right-from-bracket`, link alla pagina dello zaino nel libro.

**«Non è il mio computer»:** al posto dello stato, una fascia in `--color-warning` su `--color-warning-bg`: «Aperto solo in questa scheda. Il codice non è salvato su questo computer e i progressi spariscono quando chiudi la scheda. Prima di andare via, esci dallo zaino.» con «Esci dallo zaino» (bianco su `#6E4300`). La scheda «Il codice» non c’è, come oggi.

## Colori

Tutti i valori vengono dalla veste neutra, tranne questi:

| Valore | Uso |
| --- | --- |
| `#2C3B55`, `#46536A` | blocchi del 2º e del 3º sul podio (il 1º è `--color-text`) |
| `#22324A`, `#2A5F8A`, `#2E6B4C`, `#6A3D9E`, `#8E1F18`, `#6E4300` | fondi delle iniziali |
| `#E4E9F0` | fondo della tua riga |
| `#E4E7EC` | binario delle barre |
| `#C3CADB` | testo secondario sulla fascia scura e sulla barra fissa |
| colori delle locandine | pallini dei mondi: Star Wars `#070B1A` e `#F2C94C`, Il Signore degli Anelli `#0D1C16` e `#E9D38E`; un mondo nuovo li prende dalla sua locandina |

## Icone

Solo icone RB già nel progetto: `trophy`, `backpack`, `id-badge`, `list`, `triangle-exclamation`, `circle-check`, `circle-arrow-left`, `copy`, `key`, `right-from-bracket`. Nessuna icona nuova.

## Accessibilità

- La colonna dei mondi è una `nav` di link con `aria-current="page"` sulla classifica scelta; ogni voce dice nome e posizione («Star Wars, sei 9º»; «Mondo, nessun punto»).
- Il podio è una lista ordinata nell’ordine 1º, 2º, 3º; l’ordine 2-1-3 è solo visivo (`order` in CSS).
- La lista è una tabella, come oggi, con didascalia nascosta.
- Bersagli di almeno 44 px; fuoco con contorno di 3 px `--color-link`.
- Movimento ridotto: il pannello del telefono compare senza scorrere.

## Punti aperti per F07

- **`crea()` con le parole scelte prima.** Oggi `crea()` in `src/zaino/sincronizza.ts` estrae il codice da sé. La creazione in tre passi chiede di estrarre le parole al passo 2 (`nuovoCodice()`) e di passarle a `crea(codice)` al passo 3. Il caso del 412 su un codice già usato (oggi `crea` ne estrae un altro) va riportato all’utente come «riprova», con parole nuove dal passo 2. Nessuna modifica al servizio.
- **Livello dei mondi nella colonna.** Dipende dal campo del contratto di F09. Se F07 viene prima di F09, la colonna mostra un gruppo solo, senza etichette.
- **Letture della posizione.** Una `leggiPosizione` per mondo più la generale a ogni apertura e a ogni rilettura del minuto. Valutare in F07 di rileggere le posizioni degli altri mondi solo all’apertura, non ogni minuto.
- **Testi** da rivedere in F07 con `scrittura-didattica.md` e `scrittura-umana.md`: nelle tavole sono una prima stesura.
- **Pagina dell’informativa**: non è in questa fase; prende la barra comune e la veste neutra come le altre.
