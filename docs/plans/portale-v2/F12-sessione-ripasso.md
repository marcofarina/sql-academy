# F12 — Aggiungere la sessione di ripasso

- **Modello / effort:** Claude Code Opus · Codex Sol; effort consigliato `medium`. Cambia il formato dei progressi in produzione e tocca le regole dei punti.
- **Revisione incrociata:** sì, sull’altro strumento prima delle fasi che ne dipendono: aggiunge un campo ai progressi, letto dai dati già salvati e unito nello zaino.
- **Dipendenze:** F06 (sessione salvata e riprendibile).
- **Consumo stimato:** medio.
- **Incertezza:** media. Aumenta se la data di risoluzione nello zaino richiede di rivedere l’unione dei progressi fra dispositivi.
- **Punto di ripresa:** campo della data di risoluzione nei progressi, letto dai dati vecchi e unito nello zaino, con i test.

## 1. Obiettivo e risultato atteso

Una sessione «Ripasso» ripropone esercizi già risolti da qualche giorno, scelti con una ripetizione spaziata semplice, senza ridare i premi.

## 2. Contesto minimo

- Verificato il 2026-11-21: `ExerciseProgress` in `src/progress/progress.ts` ha `solved` ma nessuna data di risoluzione; ha `queryAt`, la data dell’ultima query scritta.
- Unione dei progressi fra copie: funzioni `merge…` in `src/progress/progress.ts`, test in `src/progress/merge.test.ts` e «Ultima query nello zaino» nelle decisioni del piano archiviato.
- Regole dei punti: `src/points/points.ts`; premio solo alla prima risoluzione (F13 del piano archiviato).
- Sessioni: `src/training/session.ts`.
- Vincolo del piano: il formato dei progressi in produzione si estende senza migrazioni distruttive.

## 3. Perimetro

Dentro: data di risoluzione nei progressi, scelta degli esercizi da ripassare, tipo di sessione «Ripasso», esito del ripasso salvato, test.

Fuori: gradi e traguardi; premi per il ripasso, se Marco non li decide.

## 4. Attività di implementazione

1. Proponi a Marco la regola: per esempio, intervalli di 1, 3, 7, 21 giorni che si allungano a ogni ripasso riuscito e si azzerano a ogni ripasso fallito; il ripasso vale zero punti, oppure un premio piccolo; gli aiuti nel ripasso costano come sempre. Attendi la scelta.
2. Aggiungi la data di risoluzione e lo stato del ripasso a `ExerciseProgress`; per gli esercizi già risolti senza data usa `queryAt` o la data dell’apertura dello zaino, come deciso con Marco. Aggiorna l’unione delle copie e i test.
3. Aggiungi la sessione «Ripasso» con la regola scelta; se non c’è nulla da ripassare, il pulsante lo dice.
4. Scrivi i test: scelta degli esercizi per data, esito che allunga o azzera l’intervallo, dati vecchi senza data, unione di due copie.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm run lint && npm test && npm run check:themes && npm run build` | Nessun errore |

Procedura manuale (`npm run dev`): con progressi di prova che hanno date passate, «Ripasso» propone gli esercizi giusti; il saldo segue la regola scelta; progressi salvati prima di questa fase si aprono senza errori.

## 6. Passaggio di consegne

Da compilare a fine fase.
