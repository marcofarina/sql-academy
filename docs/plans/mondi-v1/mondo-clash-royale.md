# Mondo — Clash Royale

- **Livello:** complesso. **Id proposto:** `clash-royale` (da confermare con Marco in F34).
- **Fasi:** F34 (A), F35 (C), F36 (B1), F37 (B2), F38 (D).
- **Stato del dettaglio:** abbozzo, da rifinire in F05 con ciò che Stranger Things ha insegnato e, all’apertura della fase A, con Marco.

La procedura di ogni fase è in [`ricetta.md`](ricetta.md), tipo indicato in testa alla fase. Qui ciò che vale solo per questo mondo.

## Il mondo

Scelto da Marco il 2026-11-24 come mondo complesso, al posto di Pokémon: molto giocato dai ragazzi, PEGI 7, con dati numerici fitti (costi, statistiche per livello, soglie di trofei) e aggiornamenti di bilanciamento datati. Candidato alle CTF.

### Abbozzo del dominio

| Tabella | Contenuto | Chiave esterna |
| --- | --- | --- |
| `rarita` | comune, rara, epica, leggendaria, campione | — |
| `arene` | ordine, nome, soglia di trofei | — |
| `carte` | nome, costo in elisir, tipo (truppa, incantesimo, edificio), bersagli, velocità | `rarita_id` → `rarita`, `arena_id` → `arene`: arena di sblocco |
| `statistiche` | carte × livello: punti vita, danno, danno al secondo | `carta_id` |
| `evoluzioni` | ciclo, effetto in breve | `carta_id` → `carte` |
| `aggiornamenti` | data, nome della stagione | — |
| `modifiche` | carte × aggiornamenti, con statistica toccata e variazione | `carta_id`, `aggiornamento_id` |
| `mazzi` | nome, archetipo | — |
| `mazzi_carte` | molti a molti mazzi × carte (otto per mazzo) | `mazzo_id`, `carta_id` |
| `torri` | torre del re, torri delle principesse, per livello | — |

Dieci tabelle; molti a molti con attributi, modifiche datate, una tabella di statistiche per livello che regge aggregazioni e confronti.

### Rischi

- Supercell pubblica una politica sui contenuti dei fan (*Fan Content Policy*): da leggere alla fonte in A. Nessuna immagine né icona delle carte, nessun carattere del gioco.
- I valori cambiano a ogni aggiornamento di bilanciamento: fissa una data e citala nella traccia; la tabella degli aggiornamenti lo rende un dato.
- Fonti: wiki dei fan (Fandom, CC BY-SA) e dati pubblici; l’API ufficiale chiede una chiave e ha termini propri, da verificare prima di usarla.
- Mazzi: solo archetipi noti, senza nomi di giocatori.

### CTF

Candidato alle CTF del piano successivo. Qui non si progettano flag; A annota solo i dati che una CTF potrebbe sfruttare.

### Numeri attesi

150–200 esercizi, capitoli 6–9 con join su quattro o più tabelle, sottoquery annidate, `WITH`.

### Idee per la veste

Non vincolanti: chiaro «l’arena di giorno», scuro «l’arena di notte»; corone e torri stilizzate, lontane dalle icone del gioco.

### Fonti

Da compilare in F34 con URL e data di consultazione di ogni pagina usata.

## F34 — Clash Royale: dominio, database e traccia

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

## F35 — Clash Royale: studio della veste

- **Ricetta:** tipo C.
- **Modello / effort:** solo Claude Code Opus; `medium`. Usa l’Artifact «Design».
- **Dipendenze:** F34.
- **Consumo stimato:** medio. Pesano le iterazioni con Marco sulle tavole.
- **Punto di ripresa:** direzione scelta da Marco fra le due proposte, prima di rifinirla.

### Passaggio di consegne

#### Decisioni ed esito

#### Scostamenti dal dettaglio

#### Verifiche

#### Limiti e lavoro residuo

#### Strumento e modello

## F36 — Clash Royale: esercizi su una tabella e join

- **Ricetta:** tipo B, prima parte: capitoli `una-tabella` e `join`; qui si approva la distribuzione di tutto il mondo.
- **Modello / effort:** Claude Code Opus · Codex Sol; `medium`. Testi per gli studenti e giudizio sul risultato di ogni query.
- **Dipendenze:** F34.
- **Consumo stimato:** alto. Circa metà dei 150–200 esercizi; più di una sessione.
- **Punto di ripresa:** distribuzione completa approvata; poi ogni capitolo completato, con il suo commit intermedio.

### Passaggio di consegne

#### Decisioni ed esito

#### Scostamenti dal dettaglio

#### Verifiche

#### Limiti e lavoro residuo

#### Strumento e modello

## F37 — Clash Royale: esercizi su aggregazioni e sottoquery

- **Ricetta:** tipo B, seconda parte: capitoli `aggregazioni` e `sottoquery-viste`, secondo la distribuzione approvata nella prima.
- **Modello / effort:** Claude Code Opus · Codex Sol; `medium`. Testi per gli studenti e giudizio sul risultato di ogni query.
- **Dipendenze:** F36.
- **Consumo stimato:** alto. Circa metà dei 150–200 esercizi, con join lunghi, sottoquery annidate e `WITH`; più di una sessione.
- **Punto di ripresa:** ogni capitolo completato, con il suo commit intermedio.

### Passaggio di consegne

#### Decisioni ed esito

#### Scostamenti dal dettaglio

#### Verifiche

#### Limiti e lavoro residuo

#### Strumento e modello

## F38 — Clash Royale: veste, icone e uscita dalla bozza

- **Ricetta:** tipo D.
- **Modello / effort:** Claude Code Opus · Codex Sol; `medium`. Le icone nuove solo su Claude Opus.
- **Dipendenze:** F35, F37.
- **Consumo stimato:** medio. Icone tematiche nuove e confronto con le tavole.
- **Punto di ripresa:** veste applicata e confrontata con le tavole, prima delle icone.

### Passaggio di consegne

#### Decisioni ed esito

#### Scostamenti dal dettaglio

#### Verifiche

#### Limiti e lavoro residuo

#### Strumento e modello
