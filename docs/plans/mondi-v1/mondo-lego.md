# Mondo — Lego

- **Livello:** intermedio. **Id proposto:** `lego` (da confermare con Marco in F19).
- **Fasi:** F19 (A), F20 (C), F21 (B1), F22 (B2), F23 (D).
- **Stato del dettaglio:** abbozzo, da rifinire in F05 con ciò che Stranger Things ha insegnato e, all’apertura della fase A, con Marco.

La procedura di ogni fase è in [`ricetta.md`](ricetta.md), tipo indicato in testa alla fase. Qui ciò che vale solo per questo mondo.

## Il mondo

Scelto da Marco il 2026-11-24 al posto di Minecraft, come intermedio. Notissimo a tutte le età; esiste un database vero e pubblico di temi, set, pezzi e minifigure (Rebrickable), da cui si prende una fetta.

### Abbozzo del dominio

| Tabella | Contenuto | Chiave esterna |
| --- | --- | --- |
| `temi` | nome | `tema_padre_id` → `temi`: autoassociazione (City → Police) |
| `set` | numero, nome, anno, numero di pezzi, età consigliata, prezzo di lancio | `tema_id` → `temi` |
| `minifigure` | nome | — |
| `set_minifigure` | molti a molti set × minifigure, con quantità | `set_id`, `minifigura_id` |
| `categorie` | nome (mattoncini, piastre, elementi tecnici…) | — |
| `pezzi` | codice, nome | `categoria_id` → `categorie` |
| `set_pezzi` | molti a molti set × pezzi, con colore e quantità | `set_id`, `pezzo_id` |

Sette tabelle, due molti a molti con attributi, una autoassociazione: il massimo del livello intermedio.

### Rischi

- Il Gruppo LEGO ha regole precise sull’uso del marchio da parte dei fan (*Fair Play*): da leggere alla fonte in A. Probabile richiesta di una dichiarazione di non affiliazione e di scrivere «LEGO» come marchio, non come nome comune; il titolo del mondo si decide dopo.
- Licenza dei dati di Rebrickable e dei prezzi (Brickset o altra fonte): da verificare in A. Il database vero ha centinaia di migliaia di righe: la fetta si sceglie per temi (per esempio cinque o sei temi noti ai ragazzi) e si tiene sotto qualche migliaio di righe, che la sandbox regge.
- Nessuna immagine di set né di minifigure; i nomi dei set su licenza (Star Wars, Harry Potter) restano nomi.

### Numeri attesi

140–150 esercizi, capitoli 6–9 completi. Pezzi e prezzi reggono aggregazioni varie (pezzi per euro, set per anno, colori più usati).

### Idee per la veste

Non vincolanti: chiaro «la scatola aperta sul tavolo», scuro «la stanza dei mattoncini di notte»; borchie dei mattoncini come motivo, senza riprodurre il logo.

### Fonti

Da compilare in F19 con URL e data di consultazione di ogni pagina usata.

## F19 — Lego: dominio, database e traccia

- **Ricetta:** tipo A.
- **Modello / effort:** Claude Code Opus · Codex Sol; `medium`. Si decide la forma del database e si scrive la traccia per gli studenti.
- **Dipendenze:** F05.
- **Consumo stimato:** medio-alto. Sei-otto tabelle, con una o due molti a molti da popolare.
- **Punto di ripresa:** dominio e schema approvati da Marco, prima di `dati.sql`.

Specifico di questa fase:

- Proponi a Marco i temi da includere e il criterio di taglio dei pezzi (per esempio solo i pezzi presenti in almeno due set scelti), con il numero di righe che ne risulta.

### Passaggio di consegne

#### Decisioni ed esito

#### Scostamenti dal dettaglio

#### Verifiche

#### Limiti e lavoro residuo

#### Strumento e modello

## F20 — Lego: studio della veste

- **Ricetta:** tipo C.
- **Modello / effort:** solo Claude Code Opus; `medium`. Usa l’Artifact «Design».
- **Dipendenze:** F19.
- **Consumo stimato:** medio. Pesano le iterazioni con Marco sulle tavole.
- **Punto di ripresa:** direzione scelta da Marco fra le due proposte, prima di rifinirla.

### Passaggio di consegne

#### Decisioni ed esito

#### Scostamenti dal dettaglio

#### Verifiche

#### Limiti e lavoro residuo

#### Strumento e modello

## F21 — Lego: esercizi su una tabella e join

- **Ricetta:** tipo B, prima parte: capitoli `una-tabella` e `join`; qui si approva la distribuzione di tutto il mondo.
- **Modello / effort:** Claude Code Opus · Codex Sol; `medium`. Testi per gli studenti e giudizio sul risultato di ogni query.
- **Dipendenze:** F19.
- **Consumo stimato:** alto. Circa metà dei 140–150 esercizi; probabilmente più di una sessione.
- **Punto di ripresa:** distribuzione completa approvata; poi ogni capitolo completato, con il suo commit intermedio.

### Passaggio di consegne

#### Decisioni ed esito

#### Scostamenti dal dettaglio

#### Verifiche

#### Limiti e lavoro residuo

#### Strumento e modello

## F22 — Lego: esercizi su aggregazioni e sottoquery

- **Ricetta:** tipo B, seconda parte: capitoli `aggregazioni` e `sottoquery-viste`, secondo la distribuzione approvata nella prima.
- **Modello / effort:** Claude Code Opus · Codex Sol; `medium`. Testi per gli studenti e giudizio sul risultato di ogni query.
- **Dipendenze:** F21.
- **Consumo stimato:** alto. Circa metà dei 140–150 esercizi, i più difficili; probabilmente più di una sessione.
- **Punto di ripresa:** ogni capitolo completato, con il suo commit intermedio.

### Passaggio di consegne

#### Decisioni ed esito

#### Scostamenti dal dettaglio

#### Verifiche

#### Limiti e lavoro residuo

#### Strumento e modello

## F23 — Lego: veste, icone e uscita dalla bozza

- **Ricetta:** tipo D.
- **Modello / effort:** Claude Code Opus · Codex Sol; `medium`. Le icone nuove solo su Claude Opus.
- **Dipendenze:** F20, F22.
- **Consumo stimato:** medio. Icone tematiche nuove e confronto con le tavole.
- **Punto di ripresa:** veste applicata e confrontata con le tavole, prima delle icone.

### Passaggio di consegne

#### Decisioni ed esito

#### Scostamenti dal dettaglio

#### Verifiche

#### Limiti e lavoro residuo

#### Strumento e modello
