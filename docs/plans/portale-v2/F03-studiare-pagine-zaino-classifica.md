# F03 — Studiare le pagine Zaino e Classifica

- **Modello / effort:** solo Claude Code, Opus; effort consigliato `medium`. Fase di disegno con l’Artifact «Design», con giudizio su esperienza d’uso e dati da mostrare.
- **Dipendenze:** F02 (le pagine ospitano la barra comune approvata).
- **Consumo stimato:** medio-alto: due pagine, almeno due direzioni per la classifica, due larghezze.
- **Incertezza:** media. Aumenta se la direzione scelta chiede al servizio della classifica dati che oggi non dà.
- **Punto di ripresa:** direzione della classifica scelta da Marco, prima delle tavole di dettaglio.

## 1. Obiettivo e risultato atteso

Tavole approvate da Marco e una specifica, `docs/design/zaino-classifica.md`, per le pagine `#/zaino` e `#/classifica` (punto 5 del feedback). La classifica oggi «sembra il risultato di una query di un esercizio php di uno studente delle superiori» (Marco, 2026-11-21): deve diventare una pagina che lo studente ha voglia di aprire.

## 2. Contesto minimo

- Specifica della barra comune: `docs/design/barra-notifica.md` (F02).
- Pagine di oggi: `src/zaino/ZainoPage.tsx`, `src/classifica/ClassificaPage.tsx`; testi in `src/zaino/labels.ts` e `src/classifica/labels.ts`.
- Decisioni del piano archiviato, «Decisioni condivise»: «Interfaccia dello zaino» (che cosa sta nel portale e che cosa resta nel libro), «Classifica», «Servizio della classifica», «Adesione alla classifica».
- Dati che il servizio dà oggi: `src/classifica/servizio.ts` (`leggiClassifica`, `leggiPosizione`, tipi `Voce` e `Posizione`): primi 50, generale e per tema, e la propria posizione. Il servizio è in produzione con D1 (`servizi/classifica/`).

## 3. Perimetro

Dentro: tavole, specifica, contrasti.

Fuori: codice (F07). Una direzione che chieda dati nuovi al servizio (per esempio l’andamento nel tempo o il numero di esercizi risolti per difficoltà) è una decisione strutturale: elencala con il costo per il servizio e chiedi a Marco prima di disegnarla nel dettaglio.

## 4. Attività di implementazione

1. Disegna la classifica in almeno due direzioni con i dati di oggi, a 1280 e a 375 px: per esempio podio e lista, schede per tema, la propria riga sempre in vista. Mostra anche gli stati: non partecipi, zaino non collegato, servizio irraggiungibile, classifica vuota.
2. Attendi la scelta di Marco, poi disegna i dettagli.
3. Disegna la pagina dello zaino: apri, crea, «Non è il mio computer», stato, contenuto, mostra e copia il codice, esci. Rendi chiaro che cosa contiene lo zaino e che cosa succede ai progressi in ogni azione.
4. Mostra le tavole a Marco e itera fino all’approvazione.
5. Scrivi `docs/design/zaino-classifica.md`, con i punti aperti per F07 e il link all’Artifact; aggiorna `docs/design/contrasto.mjs` se servono palette nuove.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `node docs/design/contrasto.mjs` | Nessuna coppia sotto le soglie |

Procedura manuale: Marco approva le tavole; la specifica dichiara se la direzione scelta richiede modifiche al servizio.

## 6. Passaggio di consegne

Da compilare a fine fase.
