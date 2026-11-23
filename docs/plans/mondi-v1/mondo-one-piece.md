# Mondo — One Piece

- **Livello:** intermedio. **Id proposto:** `one-piece` (da confermare con Marco in F14).
- **Fasi:** F14 (A), F15 (C), F16 (B1), F17 (B2), F18 (D).
- **Stato del dettaglio:** abbozzo, da rifinire in F05 con ciò che Stranger Things ha insegnato e, all’apertura della fase A, con Marco.

La procedura di ogni fase è in [`ricetta.md`](ricetta.md), tipo indicato in testa alla fase. Qui ciò che vale solo per questo mondo.

## Il mondo

Da `docs/mondi.md`: l’anime più visto su Netflix nel 2025 e fra i manga più venduti in Italia; le taglie sono numeri adatti alle aggregazioni.

### Abbozzo del dominio

La storia raccontata dal manga, non l’archivio della Marina.

| Tabella | Contenuto | Chiave esterna |
| --- | --- | --- |
| `saghe` | ordine | — |
| `archi` | capitolo iniziale e finale, anno di pubblicazione | `saga_id` → `saghe` |
| `personaggi` | affiliazione (pirati, Marina, Rivoluzionari, Governo Mondiale) | `arco_id` → `archi`: arco del debutto |
| `taglie` | importo dopo l’arco: la storia delle taglie | `personaggio_id` → `personaggi`, `arco_id` → `archi` |
| `scontri` | capitolo, luogo | `arco_id` → `archi` |
| `combattenti` | molti a molti scontri × personaggi, con schieramento ed esito | `scontro_id`, `personaggio_id` |

Sei tabelle, una molti a molti.

### Vincolo di Marco

Le opere possono sovrapporsi, i domini no. L’esercizio «All’arrembaggio!» (pagina Notion di *Master Bits*, Manuale dell’Archivista) usa ciurme con Jolly Roger e mare, membri con ruolo e taglia, frutti del diavolo legati a una sola persona, isole e approdi datati. Questo mondo lascia fuori ciurme, frutti, isole e approdi, e tratta la taglia come storico invece che come attributo del membro. A lo ricontrolla prima di proporre il dominio.

### Rischi

- Shueisha e Toei: politica sui progetti dei fan da verificare in A.
- Violenza da fumetto: gli esiti degli scontri restano «vinto», «perso», «interrotto», senza dettagli.

### Numeri attesi

140–150 esercizi, capitoli 6–9 completi.

### Idee per la veste

Non vincolanti: chiaro «carta nautica», scuro «mare di notte»; un avviso di taglia come forma generica, senza imitare quello del manga.

### Fonti

Da compilare in F14 con URL e data di consultazione di ogni pagina usata.

## F14 — One Piece: dominio, database e traccia

- **Ricetta:** tipo A.
- **Modello / effort:** Claude Code Opus · Codex Sol; `medium`. Si decide la forma del database e si scrive la traccia per gli studenti.
- **Dipendenze:** F05.
- **Consumo stimato:** medio-alto. Sei-otto tabelle, con una o due molti a molti da popolare.
- **Punto di ripresa:** dominio e schema approvati da Marco, prima di `dati.sql`.

### Passaggio di consegne

#### Decisioni ed esito

#### Scostamenti dal dettaglio

#### Verifiche

#### Limiti e lavoro residuo

#### Strumento e modello

## F15 — One Piece: studio della veste

- **Ricetta:** tipo C.
- **Modello / effort:** solo Claude Code Opus; `medium`. Usa l’Artifact «Design».
- **Dipendenze:** F14.
- **Consumo stimato:** medio. Pesano le iterazioni con Marco sulle tavole.
- **Punto di ripresa:** direzione scelta da Marco fra le due proposte, prima di rifinirla.

### Passaggio di consegne

#### Decisioni ed esito

#### Scostamenti dal dettaglio

#### Verifiche

#### Limiti e lavoro residuo

#### Strumento e modello

## F16 — One Piece: esercizi su una tabella e join

- **Ricetta:** tipo B, prima parte: capitoli `una-tabella` e `join`; qui si approva la distribuzione di tutto il mondo.
- **Modello / effort:** Claude Code Opus · Codex Sol; `medium`. Testi per gli studenti e giudizio sul risultato di ogni query.
- **Dipendenze:** F14.
- **Consumo stimato:** alto. Circa metà dei 140–150 esercizi; probabilmente più di una sessione.
- **Punto di ripresa:** distribuzione completa approvata; poi ogni capitolo completato, con il suo commit intermedio.

### Passaggio di consegne

#### Decisioni ed esito

#### Scostamenti dal dettaglio

#### Verifiche

#### Limiti e lavoro residuo

#### Strumento e modello

## F17 — One Piece: esercizi su aggregazioni e sottoquery

- **Ricetta:** tipo B, seconda parte: capitoli `aggregazioni` e `sottoquery-viste`, secondo la distribuzione approvata nella prima.
- **Modello / effort:** Claude Code Opus · Codex Sol; `medium`. Testi per gli studenti e giudizio sul risultato di ogni query.
- **Dipendenze:** F16.
- **Consumo stimato:** alto. Circa metà dei 140–150 esercizi, i più difficili; probabilmente più di una sessione.
- **Punto di ripresa:** ogni capitolo completato, con il suo commit intermedio.

### Passaggio di consegne

#### Decisioni ed esito

#### Scostamenti dal dettaglio

#### Verifiche

#### Limiti e lavoro residuo

#### Strumento e modello

## F18 — One Piece: veste, icone e uscita dalla bozza

- **Ricetta:** tipo D.
- **Modello / effort:** Claude Code Opus · Codex Sol; `medium`. Le icone nuove solo su Claude Opus.
- **Dipendenze:** F15, F17.
- **Consumo stimato:** medio. Icone tematiche nuove e confronto con le tavole.
- **Punto di ripresa:** veste applicata e confrontata con le tavole, prima delle icone.

### Passaggio di consegne

#### Decisioni ed esito

#### Scostamenti dal dettaglio

#### Verifiche

#### Limiti e lavoro residuo

#### Strumento e modello
