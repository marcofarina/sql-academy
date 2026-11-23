# Mondo — Magic: The Gathering

- **Livello:** complesso. **Id proposto:** `magic` (da confermare con Marco in F29).
- **Fasi:** F29 (A), F30 (C), F31 (B1), F32 (B2), F33 (D).
- **Stato del dettaglio:** abbozzo, da rifinire in F05 con ciò che Stranger Things ha insegnato e, all’apertura della fase A, con Marco.

La procedura di ogni fase è in [`ricetta.md`](ricetta.md), tipo indicato in testa alla fase. Qui ciò che vale solo per questo mondo.

## Il mondo

Scelto da Marco il 2026-11-24 come mondo complesso, al posto di Mitologia greca: il database reale delle carte è vastissimo e molto strutturato. Candidato alle CTF.

### Abbozzo del dominio

| Tabella | Contenuto | Chiave esterna |
| --- | --- | --- |
| `espansioni` | codice, nome, data di uscita, tipo (base, espansione, supplemento) | — |
| `carte` | nome, costo di mana, valore di mana, forza, costituzione | — |
| `colori` | bianco, blu, nero, rosso, verde | — |
| `carte_colori` | molti a molti carte × colori | `carta_id`, `colore_id` |
| `tipi` | creatura, istantaneo, stregoneria, artefatto, incantesimo, terra… | — |
| `carte_tipi` | molti a molti carte × tipi, con sottotipo | `carta_id`, `tipo_id` |
| `artisti` | nome | — |
| `stampe` | carte × espansioni, con rarità e numero da collezione; associazione fra tre entità | `carta_id`, `espansione_id`, `artista_id` |
| `formati` | Standard, Modern, Commander… | — |
| `legalita` | carte × formati, con stato (legale, bandita, limitata) e data | `carta_id`, `formato_id` |

Dieci tabelle; molti a molti con attributi, un’associazione fra tre entità, legalità con data: il livello complesso.

### Rischi

- Wizards of the Coast pubblica una politica sui contenuti dei fan (*Fan Content Policy*): da leggere alla fonte in A. Nessuna immagine né illustrazione delle carte, nessun simbolo di mana identico all’originale, nessun testo delle regole delle carte copiato.
- Fonti dei dati: Scryfall e MTGJSON, con termini d’uso e licenze da verificare in A. La fetta si sceglie per espansioni (per esempio poche espansioni recenti più le carte base) e si tiene sotto qualche migliaio di righe.
- Classificazione 13+ del gioco: nomi di carte cupi (demoni, morte) ammessi come nomi, esclusi quelli espliciti.
- Nomi italiani: molte carte hanno una stampa italiana; da decidere in A se usare i nomi italiani, inglesi o entrambi.

### CTF

Candidato alle CTF del piano successivo (Marco, 2026-11-23). Qui non si progettano flag; A annota solo i dati che una CTF potrebbe sfruttare.

### Numeri attesi

150–200 esercizi, capitoli 6–9 con join su quattro o più tabelle, sottoquery annidate, `WITH`.

### Idee per la veste

Non vincolanti: chiaro «il tavolo da gioco», scuro «la biblioteca del mago»; i cinque colori come palette d’accento, senza riprodurre i simboli ufficiali.

### Fonti

Da compilare in F29 con URL e data di consultazione di ogni pagina usata.

## F29 — Magic: The Gathering: dominio, database e traccia

- **Ricetta:** tipo A.
- **Modello / effort:** Claude Code Opus · Codex Sol; `medium`. Si decide la forma del database e si scrive la traccia per gli studenti.
- **Dipendenze:** F05.
- **Consumo stimato:** alto. Dieci-14 tabelle, una fetta di un database reale da scegliere e popolare con la fonte di ogni dato.
- **Punto di ripresa:** dominio e schema approvati da Marco, prima di `dati.sql`.

### Passaggio di consegne

#### Decisioni ed esito

#### Scostamenti dal dettaglio

#### Verifiche

#### Limiti e lavoro residuo

#### Strumento e modello

## F30 — Magic: The Gathering: studio della veste

- **Ricetta:** tipo C.
- **Modello / effort:** solo Claude Code Opus; `medium`. Usa l’Artifact «Design».
- **Dipendenze:** F29.
- **Consumo stimato:** medio. Pesano le iterazioni con Marco sulle tavole.
- **Punto di ripresa:** direzione scelta da Marco fra le due proposte, prima di rifinirla.

### Passaggio di consegne

#### Decisioni ed esito

#### Scostamenti dal dettaglio

#### Verifiche

#### Limiti e lavoro residuo

#### Strumento e modello

## F31 — Magic: The Gathering: esercizi su una tabella e join

- **Ricetta:** tipo B, prima parte: capitoli `una-tabella` e `join`; qui si approva la distribuzione di tutto il mondo.
- **Modello / effort:** Claude Code Opus · Codex Sol; `medium`. Testi per gli studenti e giudizio sul risultato di ogni query.
- **Dipendenze:** F29.
- **Consumo stimato:** alto. Circa metà dei 150–200 esercizi; più di una sessione.
- **Punto di ripresa:** distribuzione completa approvata; poi ogni capitolo completato, con il suo commit intermedio.

### Passaggio di consegne

#### Decisioni ed esito

#### Scostamenti dal dettaglio

#### Verifiche

#### Limiti e lavoro residuo

#### Strumento e modello

## F32 — Magic: The Gathering: esercizi su aggregazioni e sottoquery

- **Ricetta:** tipo B, seconda parte: capitoli `aggregazioni` e `sottoquery-viste`, secondo la distribuzione approvata nella prima.
- **Modello / effort:** Claude Code Opus · Codex Sol; `medium`. Testi per gli studenti e giudizio sul risultato di ogni query.
- **Dipendenze:** F31.
- **Consumo stimato:** alto. Circa metà dei 150–200 esercizi, con join lunghi, sottoquery annidate e `WITH`; più di una sessione.
- **Punto di ripresa:** ogni capitolo completato, con il suo commit intermedio.

### Passaggio di consegne

#### Decisioni ed esito

#### Scostamenti dal dettaglio

#### Verifiche

#### Limiti e lavoro residuo

#### Strumento e modello

## F33 — Magic: The Gathering: veste, icone e uscita dalla bozza

- **Ricetta:** tipo D.
- **Modello / effort:** Claude Code Opus · Codex Sol; `medium`. Le icone nuove solo su Claude Opus.
- **Dipendenze:** F30, F32.
- **Consumo stimato:** medio. Icone tematiche nuove e confronto con le tavole.
- **Punto di ripresa:** veste applicata e confrontata con le tavole, prima delle icone.

### Passaggio di consegne

#### Decisioni ed esito

#### Scostamenti dal dettaglio

#### Verifiche

#### Limiti e lavoro residuo

#### Strumento e modello
