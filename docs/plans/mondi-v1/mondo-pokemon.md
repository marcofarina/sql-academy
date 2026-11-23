# Mondo — Pokémon

- **Livello:** intermedio. **Id proposto:** `pokemon` (da confermare con Marco in F24).
- **Fasi:** F24 (A), F25 (C), F26 (B1), F27 (B2), F28 (D).
- **Stato del dettaglio:** abbozzo, da rifinire in F05 con ciò che Stranger Things ha insegnato e, all’apertura della fase A, con Marco.

La procedura di ogni fase è in [`ricetta.md`](ricetta.md), tipo indicato in testa alla fase. Qui ciò che vale solo per questo mondo.

## Il mondo

Da `docs/mondi.md`: il dominio più tabellare della rosa, notissimo a tutte le età. Nato complesso in F08 di `portale-v2`, passato a intermedio da Marco il 2026-11-24: il dominio si riduce a sei-otto tabelle.

### Abbozzo del dominio

| Tabella | Contenuto | Chiave esterna |
| --- | --- | --- |
| `generazioni` | numero, anno, regione | — |
| `tipi` | nome | — |
| `specie` | numero del Pokédex, nome, statistiche base | `generazione_id` → `generazioni`, `evolve_da_id` → `specie` (autoassociazione) |
| `specie_tipi` | molti a molti, con posizione (primo o secondo tipo) | `specie_id`, `tipo_id` |
| `mosse` | potenza, precisione, PP, categoria | `tipo_id` → `tipi` |
| `apprendimento` | molti a molti specie × mosse, con livello | `specie_id`, `mossa_id` |

Sei tabelle, due molti a molti, un’autoassociazione. Rispetto all’abbozzo complesso escono efficacia fra tipi, palestre, allenatori, squadre e il metodo di evoluzione.

### Rischi

- Nintendo e The Pokémon Company sono le più aggressive della rosa sui progetti dei fan. Solo nomi, nessuna immagine, icone RB stilizzate e lontane dagli originali (niente Poké Ball identica). Prima di A, rileggi con Marco se l’opera resta questa.
- I dati di PokeAPI hanno licenza d’origine incerta: costruisci un sottoinsieme a mano, citando le fonti. Proponi a Marco quante specie (per esempio la prima generazione, o le prime due).

### Numeri attesi

140–150 esercizi, capitoli 6–9 completi.

### Idee per la veste

Non vincolanti: chiaro «il Pokédex», scuro «la grotta»; nessun elemento grafico dei giochi.

### Fonti

Da compilare in F24 con URL e data di consultazione di ogni pagina usata.

## F24 — Pokémon: dominio, database e traccia

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

## F25 — Pokémon: studio della veste

- **Ricetta:** tipo C.
- **Modello / effort:** solo Claude Code Opus; `medium`. Usa l’Artifact «Design».
- **Dipendenze:** F24.
- **Consumo stimato:** medio. Pesano le iterazioni con Marco sulle tavole.
- **Punto di ripresa:** direzione scelta da Marco fra le due proposte, prima di rifinirla.

### Passaggio di consegne

#### Decisioni ed esito

#### Scostamenti dal dettaglio

#### Verifiche

#### Limiti e lavoro residuo

#### Strumento e modello

## F26 — Pokémon: esercizi su una tabella e join

- **Ricetta:** tipo B, prima parte: capitoli `una-tabella` e `join`; qui si approva la distribuzione di tutto il mondo.
- **Modello / effort:** Claude Code Opus · Codex Sol; `medium`. Testi per gli studenti e giudizio sul risultato di ogni query.
- **Dipendenze:** F24.
- **Consumo stimato:** alto. Circa metà dei 140–150 esercizi; probabilmente più di una sessione.
- **Punto di ripresa:** distribuzione completa approvata; poi ogni capitolo completato, con il suo commit intermedio.

### Passaggio di consegne

#### Decisioni ed esito

#### Scostamenti dal dettaglio

#### Verifiche

#### Limiti e lavoro residuo

#### Strumento e modello

## F27 — Pokémon: esercizi su aggregazioni e sottoquery

- **Ricetta:** tipo B, seconda parte: capitoli `aggregazioni` e `sottoquery-viste`, secondo la distribuzione approvata nella prima.
- **Modello / effort:** Claude Code Opus · Codex Sol; `medium`. Testi per gli studenti e giudizio sul risultato di ogni query.
- **Dipendenze:** F26.
- **Consumo stimato:** alto. Circa metà dei 140–150 esercizi, i più difficili; probabilmente più di una sessione.
- **Punto di ripresa:** ogni capitolo completato, con il suo commit intermedio.

### Passaggio di consegne

#### Decisioni ed esito

#### Scostamenti dal dettaglio

#### Verifiche

#### Limiti e lavoro residuo

#### Strumento e modello

## F28 — Pokémon: veste, icone e uscita dalla bozza

- **Ricetta:** tipo D.
- **Modello / effort:** Claude Code Opus · Codex Sol; `medium`. Le icone nuove solo su Claude Opus.
- **Dipendenze:** F25, F27.
- **Consumo stimato:** medio. Icone tematiche nuove e confronto con le tavole.
- **Punto di ripresa:** veste applicata e confrontata con le tavole, prima delle icone.

### Passaggio di consegne

#### Decisioni ed esito

#### Scostamenti dal dettaglio

#### Verifiche

#### Limiti e lavoro residuo

#### Strumento e modello
