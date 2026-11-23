# Mondo — Dragon Ball

- **Livello:** facile. **Id proposto:** `dragon-ball` (da confermare con Marco in F06).
- **Fasi:** F06 (A), F07 (C), F08 (B), F09 (D).
- **Stato del dettaglio:** abbozzo, da rifinire in F05 con ciò che Stranger Things ha insegnato e, all’apertura della fase A, con Marco.

La procedura di ogni fase è in [`ricetta.md`](ricetta.md), tipo indicato in testa alla fase. Qui ciò che vale solo per questo mondo.

## Il mondo

Da `docs/mondi.md`: molto noto in Italia, con Dragon Ball Super fra i fumetti più venduti nel 2025. Nato intermedio in F08 di `portale-v2`, passato a facile da Marco il 2026-11-24: il dominio si riduce a tre o quattro tabelle.

### Abbozzo del dominio

| Tabella | Contenuto | Chiave esterna |
| --- | --- | --- |
| `saghe` | serie (Dragon Ball, Z, Super…), ordine, episodi | — |
| `combattenti` | nome, razza, pianeta d’origine (colonne di testo) | `saga_id` → `saghe`: saga del debutto |
| `trasformazioni` | nome, ordine | `combattente_id` → `combattenti` |

Tre tabelle, due chiavi esterne, solo uno a molti. Rispetto all’abbozzo intermedio escono tornei e partecipazioni (molti a molti), razze e pianeti come tabelle, il maestro come autoassociazione: restano idee per un eventuale mondo intermedio, non per questo.

### Rischi

- I livelli di potenza sono incoerenti fra le fonti: non usarli come dato.
- Toei e Shueisha: politica sui progetti dei fan da verificare in A.
- Quale serie: Dragon Ball, Z, Super, o tutte? Da decidere in A con Marco, perché cambia saghe e combattenti.
- Violenza da fumetto: nessun dato sugli esiti dei combattimenti.

### Numeri attesi

60–80 esercizi; capitoli 6–8 completi, 9 solo con sottoquery semplici.

### Idee per la veste

Non vincolanti: chiaro «il cielo sopra l’isola del Genio», scuro «lo spazio»; nessuna sfera del drago identica all’originale.

### Fonti

Da compilare in F06 con URL e data di consultazione di ogni pagina usata.

## F06 — Dragon Ball: dominio, database e traccia

- **Ricetta:** tipo A.
- **Modello / effort:** Claude Code Opus · Codex Sol; `medium`. Si decide la forma del database e si scrive la traccia per gli studenti.
- **Dipendenze:** F05.
- **Consumo stimato:** medio. Ricerca dei dati delegata ai subagent; tre o quattro tabelle.
- **Punto di ripresa:** dominio e schema approvati da Marco, prima di `dati.sql`.

Specifico di questa fase:

- Proponi a Marco una colonna numerica che regga le aggregazioni al posto dei livelli di potenza (per esempio episodi della saga, ordine delle trasformazioni, anno di debutto).

### Passaggio di consegne

#### Decisioni ed esito

#### Scostamenti dal dettaglio

#### Verifiche

#### Limiti e lavoro residuo

#### Strumento e modello

## F07 — Dragon Ball: studio della veste

- **Ricetta:** tipo C.
- **Modello / effort:** solo Claude Code Opus; `medium`. Usa l’Artifact «Design».
- **Dipendenze:** F06.
- **Consumo stimato:** medio. Pesano le iterazioni con Marco sulle tavole.
- **Punto di ripresa:** direzione scelta da Marco fra le due proposte, prima di rifinirla.

### Passaggio di consegne

#### Decisioni ed esito

#### Scostamenti dal dettaglio

#### Verifiche

#### Limiti e lavoro residuo

#### Strumento e modello

## F08 — Dragon Ball: esercizi

- **Ricetta:** tipo B, in una sola fase (mondo facile).
- **Modello / effort:** Claude Code Opus · Codex Sol; `medium`. Testi per gli studenti e giudizio sul risultato di ogni query.
- **Dipendenze:** F06.
- **Consumo stimato:** alto. 60–80 esercizi; probabilmente più di una sessione.
- **Punto di ripresa:** distribuzione approvata; poi ogni capitolo completato, con il suo commit intermedio.

### Passaggio di consegne

#### Decisioni ed esito

#### Scostamenti dal dettaglio

#### Verifiche

#### Limiti e lavoro residuo

#### Strumento e modello

## F09 — Dragon Ball: veste, icone e uscita dalla bozza

- **Ricetta:** tipo D.
- **Modello / effort:** Claude Code Opus · Codex Sol; `medium`. Le icone nuove solo su Claude Opus.
- **Dipendenze:** F07, F08.
- **Consumo stimato:** medio. Icone tematiche nuove e confronto con le tavole.
- **Punto di ripresa:** veste applicata e confrontata con le tavole, prima delle icone.

### Passaggio di consegne

#### Decisioni ed esito

#### Scostamenti dal dettaglio

#### Verifiche

#### Limiti e lavoro residuo

#### Strumento e modello
