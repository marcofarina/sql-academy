# Mondo — Sherlock Holmes

- **Livello:** facile. **Id proposto:** `sherlock-holmes` (da confermare con Marco in F10).
- **Fasi:** F10 (A), F11 (C), F12 (B), F13 (D).
- **Stato del dettaglio:** abbozzo, da rifinire in F05 con ciò che Stranger Things ha insegnato e, all’apertura della fase A, con Marco.

La procedura di ogni fase è in [`ricetta.md`](ricetta.md), tipo indicato in testa alla fase. Qui ciò che vale solo per questo mondo.

## Il mondo

Da `docs/mondi.md`: pubblico dominio, testi aperti su Wikisource; personaggi e casi chiusi in ogni racconto.

### Abbozzo del dominio

| Tabella | Contenuto | Chiave esterna |
| --- | --- | --- |
| `raccolte` | titolo, anno | — |
| `racconti` | titolo, anno di pubblicazione, anno dell’ambientazione, luogo, narratore | `raccolta_id` → `raccolte` |
| `personaggi` | nome, ruolo (cliente, colpevole, vittima, testimone), esito | `racconto_id` → `racconti` |

Tre tabelle, due chiavi esterne. Holmes e Watson, presenti ovunque, stanno nella traccia e non nella tabella.

### Rischi

- Poco noto ai ragazzi: la traccia presenta il mondo senza dare per scontata la lettura dei racconti.
- I testi sono di pubblico dominio, le traduzioni italiane non sempre: titoli italiani d’uso comune, con il titolo originale accanto; nessuna frase copiata da una traduzione.
- Anni dell’ambientazione: molti sono deduzioni dei commentatori. Dichiarali come tali nella traccia, con la fonte.
- Delitti: ruolo ed esito in una parola, senza descrivere i crimini.

### Numeri attesi

60–80 esercizi; capitoli 6–8 completi, 9 solo con sottoquery semplici.

### Idee per la veste

Non vincolanti: chiaro «la pagina di giornale vittoriana», scuro «Baker Street di notte, con i lampioni a gas».

### Fonti

Da compilare in F10 con URL e data di consultazione di ogni pagina usata.

## F10 — Sherlock Holmes: dominio, database e traccia

- **Ricetta:** tipo A.
- **Modello / effort:** Claude Code Opus · Codex Sol; `medium`. Si decide la forma del database e si scrive la traccia per gli studenti.
- **Dipendenze:** F05.
- **Consumo stimato:** medio. Ricerca dei dati delegata ai subagent; tre o quattro tabelle.
- **Punto di ripresa:** dominio e schema approvati da Marco, prima di `dati.sql`.

### Passaggio di consegne

#### Decisioni ed esito

#### Scostamenti dal dettaglio

#### Verifiche

#### Limiti e lavoro residuo

#### Strumento e modello

## F11 — Sherlock Holmes: studio della veste

- **Ricetta:** tipo C.
- **Modello / effort:** solo Claude Code Opus; `medium`. Usa l’Artifact «Design».
- **Dipendenze:** F10.
- **Consumo stimato:** medio. Pesano le iterazioni con Marco sulle tavole.
- **Punto di ripresa:** direzione scelta da Marco fra le due proposte, prima di rifinirla.

### Passaggio di consegne

#### Decisioni ed esito

#### Scostamenti dal dettaglio

#### Verifiche

#### Limiti e lavoro residuo

#### Strumento e modello

## F12 — Sherlock Holmes: esercizi

- **Ricetta:** tipo B, in una sola fase (mondo facile).
- **Modello / effort:** Claude Code Opus · Codex Sol; `medium`. Testi per gli studenti e giudizio sul risultato di ogni query.
- **Dipendenze:** F10.
- **Consumo stimato:** alto. 60–80 esercizi; probabilmente più di una sessione.
- **Punto di ripresa:** distribuzione approvata; poi ogni capitolo completato, con il suo commit intermedio.

### Passaggio di consegne

#### Decisioni ed esito

#### Scostamenti dal dettaglio

#### Verifiche

#### Limiti e lavoro residuo

#### Strumento e modello

## F13 — Sherlock Holmes: veste, icone e uscita dalla bozza

- **Ricetta:** tipo D.
- **Modello / effort:** Claude Code Opus · Codex Sol; `medium`. Le icone nuove solo su Claude Opus.
- **Dipendenze:** F11, F12.
- **Consumo stimato:** medio. Icone tematiche nuove e confronto con le tavole.
- **Punto di ripresa:** veste applicata e confrontata con le tavole, prima delle icone.

### Passaggio di consegne

#### Decisioni ed esito

#### Scostamenti dal dettaglio

#### Verifiche

#### Limiti e lavoro residuo

#### Strumento e modello
