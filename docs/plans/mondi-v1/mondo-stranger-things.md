# Mondo — Stranger Things

- **Livello:** facile. **Id proposto:** `stranger-things` (confermato da Marco in F02).
- **Fasi:** F02 (A), F03 (C), F04 (B), F05 (D).
- **Stato del dettaglio:** completo. È il primo mondo del piano: porta nel portale il livello facile, che oggi manca, e collauda la ricetta, che F05 corregge alla fine.

La procedura di ogni fase è in [`ricetta.md`](ricetta.md), tipo indicato in testa alla fase. Qui ciò che vale solo per Stranger Things.

## Il mondo

Da `docs/mondi.md`: notorietà altissima fra i ragazzi, con la quinta e ultima stagione uscita a fine 2025; episodi con date e durate.

### Abbozzo del dominio

| Tabella | Contenuto | Chiave esterna |
| --- | --- | --- |
| `stagioni` | numero, anno di uscita, anno dell’ambientazione | — |
| `episodi` | numero nella stagione, titolo italiano e originale, durata in minuti, data di uscita, data nella storia, regia | `stagione_id` → `stagioni` |
| `personaggi` | nome, età al debutto, ruolo (ragazzo, adulto di Hawkins, laboratorio, creatura…), potere sì o no | `episodio_id` → `episodi`: l’episodio del debutto |

Tre tabelle, due chiavi esterne, solo uno a molti: il livello facile di `docs/mondi.md`. Le creature restano personaggi con un ruolo proprio, per non superare le chiavi esterne del livello.

### Decisioni da sottoporre a Marco in F02

1. **Date.** Le date di uscita sono poche: una per le prime tre stagioni, due per la quarta (due volumi), tre per la quinta (tre parti). Proposta: aggiungere la data nella storia di ogni episodio (il giorno in cui si svolge, dalle cronologie dei wiki dei fan), che dà decine di date diverse per gli esercizi con `strftime` e gli intervalli. Dove la data nella storia non è certa, `NULL`.
2. **Titoli.** Titolo italiano di Netflix («Capitolo uno: …») e titolo originale in due colonne: reggono gli esercizi su `LIKE` e sulla lunghezza dei testi.
3. **Personaggi.** Quanti e quali: proposta 40–60, i ricorrenti più le creature. Età al debutto nella storia, non quella degli attori. Nessuna colonna sulla morte dei personaggi: evita dati e consegne su scene violente.
4. **Una quarta tabella.** Il livello ammette tre o quattro tabelle con una o due chiavi esterne, già usate. Una quarta tabella senza chiave esterna (per esempio i luoghi di Hawkins, collegati da una colonna di testo) non serve agli esercizi di join: proposta di restare a tre, salvo che Marco la voglia.
5. **Persone reali.** Registi e sceneggiatori sono persone reali, pubbliche: solo il nome nei titoli di coda, come colonna di testo. Niente attori.

### Fonti

- Pagine degli episodi e dei personaggi su un wiki dei fan (Stranger Things Wiki su Fandom, testi con licenza CC BY-SA): numeri, date e nomi, non frasi.
- Titoli italiani, durate e date di uscita: catalogo Netflix Italia o una seconda fonte che li riporti; segnala a Marco le durate che le fonti danno diverse.
- Da compilare in F02 con URL e data di consultazione di ogni pagina usata.

### Rischi

- Classificata TV-14 negli Stati Uniti per horror e violenza; la classificazione italiana è da verificare in F02. Dati, traccia ed esercizi non descrivono scene violente né morti.
- Titolare Netflix: nomi e ambientazioni sì; niente immagini, logo, né il carattere dei titoli di testa (ITC Benguiat) o sue imitazioni.
- Marchi citati nella serie (merendine, bibite, negozi): non entrano nei dati né nelle icone.

### Numeri attesi

- Esercizi: 60–80 (livello facile). Indicazione per la proposta di F04: circa 25 `una-tabella`, 18–20 `join`, 20 `aggregazioni`, 6–8 `sottoquery-viste` semplici (`IN` con sottoquery, confronto con una media); in prevalenza facili e medi, pochi difficili.
- Capitoli del libro: 6–8 completi, 9 solo nelle sottoquery semplici; niente viste né `WITH`.
- Con tre tabelle i join sono pochi: la proposta di F04 compensa con date, durate e testi.

### Idee per la veste

Non vincolanti, per la prima proposta di F03:

- schema chiaro «anni Ottanta» (carta da quaderno, luci colorate) e scuro «il Sottosopra» (spore, rami, rosso cupo);
- caratteri con licenza libera da verificare, lontani da ITC Benguiat: per esempio VT323 o Press Start 2P (dichiarati SIL OFL su Google Fonts) per i titoli, affiancati a un carattere leggibile per i testi lunghi;
- icone tematiche candidate: bicicletta, walkie-talkie, lampadine colorate, dado a venti facce, bussola.

## F02 — Stranger Things: dominio, database e traccia

- **Ricetta:** tipo A.
- **Modello / effort:** Claude Code Opus · Codex Sol; `medium`. Si decide la forma del database e si scrive la traccia per gli studenti.
- **Dipendenze:** F01 (campo `draft`, scheletro in bozza).
- **Consumo stimato:** medio. Ricerca dei dati delegata ai subagent; tre tabelle con circa 100 righe in tutto.
- **Incertezza:** media sulle date nella storia: le cronologie dei fan non coprono ogni episodio.
- **Punto di ripresa:** dominio e schema approvati da Marco, prima di `dati.sql`.

Specifico di questa fase:

- Sottoponi a Marco le cinque decisioni di «Decisioni da sottoporre», insieme al dominio.
- Raccogli i dati con uno o più subagent per tabella; ogni riga porta l’URL della pagina da cui viene, in un file di lavoro nella cartella temporanea della sessione. Nel file del mondo vanno solo le pagine e la data.
- La traccia presenta la serie a chi non l’ha vista in tre o quattro frasi, prima del dominio, senza anticipare i finali.

### Passaggio di consegne

#### Decisioni ed esito

#### Scostamenti dal dettaglio

#### Verifiche

#### Limiti e lavoro residuo

#### Strumento e modello

## F03 — Stranger Things: studio della veste

- **Ricetta:** tipo C.
- **Modello / effort:** solo Claude Code Opus; `medium`. Usa l’Artifact «Design».
- **Dipendenze:** F02 (tabelle vere da mostrare nella sandbox delle tavole).
- **Consumo stimato:** medio. Pesano le iterazioni con Marco sulle tavole.
- **Incertezza:** media. Cresce se lo schema scuro chiede decorazioni animate che il contratto non prevede.
- **Punto di ripresa:** direzione scelta da Marco fra le due proposte, prima di rifinirla.

Specifico di questa fase:

- È la prima veste di un mondo facile: la locandina deve far capire a colpo d’occhio che è un mondo da cui cominciare, senza testi oltre a quelli di F09 di `portale-v2`.
- Lo schema scuro resta leggibile e non spaventa: atmosfera, non horror.

### Passaggio di consegne

#### Decisioni ed esito

#### Scostamenti dal dettaglio

#### Verifiche

#### Limiti e lavoro residuo

#### Strumento e modello

## F04 — Stranger Things: esercizi

- **Ricetta:** tipo B, in una sola fase (mondo facile).
- **Modello / effort:** Claude Code Opus · Codex Sol; `medium`. Testi per gli studenti e giudizio sul risultato di ogni query, come F21 e F22 del piano archiviato.
- **Dipendenze:** F02.
- **Consumo stimato:** alto. 60–80 esercizi con consegna, due suggerimenti e query eseguita e controllata; probabilmente più di una sessione, ripresa dal capitolo in corso.
- **Incertezza:** media. Cresce se tre tabelle con due chiavi esterne non bastano a 18 join distinti: in quel caso proponi a Marco di fermarti più in basso nella forbice.
- **Punto di ripresa:** distribuzione approvata; poi ogni capitolo completato, con il suo commit intermedio.

Specifico di questa fase:

- Primo mondo facile: le consegne si leggono senza aver visto la serie; quando serve un fatto della serie, la consegna rimanda alla «Traccia».
- Riporta nel passaggio di consegne quante sessioni sono servite e, se noto, il consumo osservato: F05 lo usa per tarare le fasi B degli altri mondi.

### Passaggio di consegne

#### Decisioni ed esito

#### Scostamenti dal dettaglio

#### Verifiche

#### Limiti e lavoro residuo

#### Strumento e modello

## F05 — Stranger Things: veste, icone e uscita dalla bozza

- **Ricetta:** tipo D.
- **Modello / effort:** Claude Code Opus · Codex Sol; `medium`. Le icone nuove solo su Claude Opus.
- **Dipendenze:** F03, F04.
- **Consumo stimato:** medio. Icone tematiche nuove e confronto con le tavole; in più la revisione della ricetta.
- **Incertezza:** media. Cresce con il numero di icone da disegnare.
- **Punto di ripresa:** veste applicata e confrontata con le tavole, prima delle icone.

Specifico di questa fase, dopo la ricetta:

- È il primo mondo facile pubblicato: controlla sul tavolo e nel mazzo che Stranger Things stia sopra Star Wars e Il Signore degli Anelli (F01).
- **Revisione della ricetta.** Rileggi i passaggi di consegne di F02–F05, con gli scostamenti, e correggi `ricetta.md`: passi mancanti o inutili, stime di consumo, criteri che non hanno colto un difetto. Poi aggiorna i file dei mondi successivi dove la lezione li tocca (per esempio le stime di consumo delle fasi B). Elenca le modifiche nel passaggio di consegne, con il motivo.

### Passaggio di consegne

#### Decisioni ed esito

#### Scostamenti dal dettaglio

#### Verifiche

#### Limiti e lavoro residuo

#### Strumento e modello
