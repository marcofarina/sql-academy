# F07 — Ricostruire le pagine Zaino e Classifica

- **Modello / effort:** Claude Code Opus · Codex Sol; effort consigliato `medium`. Interfaccia da una specifica approvata, testi per gli studenti, possibili icone nuove.
- **Dipendenze:** F03 (specifica `docs/design/zaino-classifica.md`), F04 (barra comune).
- **Consumo stimato:** medio-alto; alto se la direzione scelta in F03 richiede modifiche al servizio della classifica.
- **Incertezza:** media. Aumenta con le modifiche al servizio, che ne chiedono il deploy e forse una migrazione D1.
- **Punto di ripresa:** pagina Zaino completata e verificata, prima della classifica.

## 1. Obiettivo e risultato atteso

Le pagine `#/zaino` e `#/classifica` seguono le tavole approvate in F03 (punto 5), con tutti gli stati disegnati e le stesse funzioni di oggi.

## 2. Contesto minimo

- Specifica: `docs/design/zaino-classifica.md`; barra: `docs/design/barra-notifica.md`.
- Codice di oggi: `src/zaino/ZainoPage.tsx`, `src/classifica/ClassificaPage.tsx`, `src/classifica/servizio.ts`, `servizi/classifica/`.

## 3. Perimetro

Dentro: le due pagine, i loro testi e stili, i test; le modifiche al servizio della classifica solo se la specifica le ha previste e Marco le ha approvate in F03.

Fuori: l’informativa `#/informativa`, salvo i testi che la nuova classifica rende inesatti.

## 4. Attività di implementazione

1. Elenca le icone, cercale nel catalogo, disegna le mancanti secondo la sezione «Icone» del piano (su Codex fermati prima di disegnarle e lascia un segnaposto).
2. Ricostruisci la pagina dello zaino; verifica apri, crea, «Non è il mio computer», mostra e copia il codice, esci. Requisiti di Marco (2026-11-21), dettagli in F03: apertura con quattro caselle numerate e autocompletamento dall’elenco di `src/zaino/parole.ts`; creazione in tre passi (avviso di salvare e fare un backup, parole mostrate una sola volta, reinserimento obbligatorio prima di confermare). I codici di 20 caratteri già in uso devono continuare ad aprire il loro zaino. Il codice dello zaino è condiviso con il libro: se questa pagina diverge da quella di PDB, annotalo per Marco.
3. Ricostruisci la classifica con tutti gli stati della specifica.
4. Se previste, modifica il servizio in `servizi/classifica/` con le sue prove (`npm run prova` contro `wrangler dev`); deploy e migrazioni in produzione solo con il via di Marco.
5. Rileggi l’informativa e correggi solo ciò che la nuova classifica rende inesatto.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm run lint && npm test && npm run check:themes && npm run build` | Nessun errore |
| in `servizi/classifica`, se il servizio cambia: `npm run prova -- http://localhost:8787` con `wrangler dev` attivo | Tutte le prove superate |

Procedura manuale (`npm run dev`, a 1280 e a 375 px): confronta ogni stato delle due pagine con le tavole; partecipa alla classifica, esci, rientra; apri e chiudi lo zaino in modalità «Non è il mio computer».

## 6. Passaggio di consegne

Da compilare a fine fase.
