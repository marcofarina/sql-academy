# F07 — Ricostruire le pagine Zaino e Classifica

- **Modello / effort:** Claude Code Opus · Codex Sol; effort consigliato `medium`. Interfaccia da una specifica approvata, testi per gli studenti, possibili icone nuove.
- **Revisione incrociata:** sì, sull’altro strumento prima delle fasi che ne dipendono: le pagine creano, aprono e chiudono lo zaino e gestiscono l’adesione alla classifica.
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

**Eseguita il 2026-11-21 su Codex con Sol**, modello predefinito letto in `~/.codex/config.toml`.

- **Zaino.** Apertura con quattro caselle numerate, suggerimenti da tastiera e incolla del codice intero. Il modulo a campo unico apre i codici di 20 caratteri. Il flusso in tre passi prepara le parole in memoria, verifica l’ordine e collega il browser solo dopo la risposta del servizio. Un conflitto HTTP 412 torna alle quattro parole con un codice nuovo da confermare. Dopo un errore di rete si possono riusare le parole già inserite. Il riepilogo mostra i mondi in cui ci sono progressi. «Non è il mio computer» usa la sola scheda e nasconde il comando per mostrare il codice.
- **Classifica.** Podio, lista fino al 20º (10º sul telefono), espansione fino al 50º, fascia personale e righe vicine se la propria non compare. I link `#/classifica/<tema>` conservano il ritorno alla pagina di provenienza. Il selettore mobile si chiude con «Chiudi», Esc, il velo o la scelta di un mondo e restituisce il fuoco al pulsante. Il messaggio di disponibilità conserva le righe già lette; l’informativa descrive i nuovi pulsanti di adesione e uscita.
- **Uscita.** Lo zaino attende la sincronizzazione già avviata prima di pulire l’area. La classifica attende l’invio in corso prima della cancellazione e conserva l’adesione se il servizio risponde con HTTP 429.

### Scostamenti dal dettaglio

- Il selettore ha un solo gruppo di mondi, come previsto dalla specifica fino a F09. Le posizioni di tutti i mondi si leggono all’ingresso e dopo un invio riuscito. La rilettura al minuto aggiorna solo la classifica aperta e la sua posizione.
- La distanza dal posto precedente include il punto necessario per superarlo. A pari punti il servizio mette prima chi li aveva raggiunti prima.
- Sul telefono i suggerimenti dell’ultima parola si aprono sopra la casella. Un menu sotto copriva il pulsante di conferma.
- In *Python Doesn’t Byte* la pagina conserva il campo unico, la creazione in un clic e la condivisione con link e QR. In SQL Academy la creazione richiede la conferma delle quattro parole e il pulsante copia il codice. La prova con un codice e un blob del libro ha confermato la compatibilità.

### Verifiche

- Superati `npm run lint`, `npm test` (231 test), `npm run check:themes`, `npm run build`, `git diff --check` e `node docs/design/contrasto.mjs zaino-classifica` (37 coppie).
- Confrontate le tavole di F03 con Chrome a 1280 e 375 px. Provati apertura e creazione, autocompletamento, copia, annullamento, ricarica prima della conferma, errori HTTP 412 e 503, uscita e riapertura, codice storico, modalità temporanea e isolamento dei progressi. Provati caricamento, adesione respinta, invii in attesa e respinti, uscita e nuova adesione, classifica vuota, posizione personale, lista estesa, selettore e recupero dopo un disservizio con e senza dati già letti. Il collaudo ha usato Vite e risposte simulate in Chrome.
- Restano i due avvisi di Star Wars documentati in F19 e l’avviso di Vite sulla dimensione del bundle. La prova in `servizi/classifica` era condizionata a modifiche del Worker e delle API, che la fase usa così come sono. Le verifiche sono locali.

Segue la revisione incrociata su Claude Code con Opus, prima delle fasi che dipendono da F07.
