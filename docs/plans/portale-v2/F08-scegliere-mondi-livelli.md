# F08 — Scegliere le IP dei nuovi mondi e definirne i livelli

- **Modello / effort:** Opus 5.5 `medium`. Giudizio didattico e di dominio; ricerche sul web delegate a subagent su Sonnet 5.5.
- **Dipendenze:** nessuna. Non tocca il codice.
- **Consumo stimato:** medio: ricerca su molte opere candidate, più giri di confronto con Marco.
- **Incertezza:** media. Aumenta se Marco chiede abbozzi di schema per molte candidate prima di scegliere.
- **Punto di ripresa:** definizione dei tre livelli approvata da Marco, prima della rosa delle IP.

## 1. Obiettivo e risultato atteso

Un documento, `docs/mondi.md`, approvato da Marco, con:

1. la definizione dei tre livelli dei mondi (facile, intermedio, complesso): numero di tabelle, tipi di associazione, capitoli del libro coperti, numero indicativo di esercizi, posto nel percorso;
2. le otto IP nuove che portano il portale a dieci mondi, ciascuna con livello, motivo della scelta, abbozzo del dominio (tabelle principali e associazioni) e rischi;
3. i mondi complessi candidati alle CTF;
4. un ordine consigliato di costruzione per il piano successivo.

## 2. Contesto minimo

- Decisioni: «Mondi in totale», «Perimetro sui mondi futuri», «CTF» nelle «Decisioni condivise» del piano; «Temi tratti da opere protette» in `AGENTS.md` (nomi e ambientazioni sì; immagini e font ufficiali no; emblemi solo come icone RB stilizzate).
- Riferimenti di livello intermedio: `themes/star-wars/` (sette tabelle, 150 esercizi) e `themes/lotr/` (sette tabelle con due molti a molti, 140 esercizi). Numeri per capitolo: `npm run check:themes`.
- Capitoli 6–9 del *Manuale dell’Archivista*: `SELECT` su una tabella, join, aggregazioni, sottoquery e viste (`~/Developer/github/python-doesnt-byte/volumes/archivista/intro.mdx`).
- Studenti di scuola superiore, anche minorenni: le opere devono essere adatte all’età e note a ragazzi italiani di oggi.

## 3. Perimetro

Dentro: ricerca, proposta, documento.

Fuori: schemi SQL completi, esercizi, vesti, contratto del livello (F09), costruzione dei mondi e CTF (piano successivo).

## 4. Attività di implementazione

1. Proponi a Marco la definizione dei tre livelli, ricavata dai due mondi esistenti; attendi l’approvazione.
2. Con subagent su Sonnet 5.5, raccogli candidate da film, serie, libri, videogiochi e fumetti: per ciascuna, quanto è nota ai ragazzi, quanto è ricca di dati tabellari (personaggi, luoghi, oggetti, eventi con date e numeri), quanto si presta a un livello.
3. Proponi una rosa di 12–16 candidate divise per livello, con un abbozzo di dominio di due righe ciascuna; Marco sceglie le otto.
4. Per le otto scelte, abbozza tabelle principali e associazioni, e controlla che il livello sia coerente con la definizione.
5. Scrivi `docs/mondi.md` e aggiungi a `AGENTS.md` i mondi scelti (la decisione «Primo tema» dice oggi che gli altri due temi sono da scegliere).

## 5. Criteri di accettazione

Procedura manuale: Marco approva la definizione dei livelli e la scelta delle otto IP; `docs/mondi.md` contiene i quattro elementi del § 1; ogni mondo ha un livello coerente con la definizione.

## 6. Passaggio di consegne

Da compilare a fine fase.
