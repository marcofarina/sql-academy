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

**Esito.** Completata il 2026-11-23. La sessione «Ripasso» ripropone gli esercizi risolti con una ripetizione spaziata, senza premi; i progressi salvati prima si aprono senza errori.

**Regola scelta da Marco** (decisione «Ripasso» nell’indice): intervalli di 1, 3, 7 e 21 giorni; ripasso riuscito un gradino in su, fallito di nuovo a un giorno; superato il ripasso a 21 giorni l’esercizio è consolidato e non torna. Zero punti. Suggerimenti e soluzione gratis; aprire la soluzione o saltare l’esercizio fa fallire il ripasso. Per i dati vecchi l’intervallo conta da `queryAt`; senza nemmeno quella l’esercizio è subito da ripassare.

**Cosa è cambiato.**

- `src/progress/progress.ts`: tre campi in `ExerciseProgress`, letti come zero dai dati salvati prima. `solvedAt` (prima risoluzione) prende nell’unione il più antico fra i valori noti; `reviewStep` e `reviewAt` vengono insieme dalla copia con il ripasso più recente, a parità di ora dal gradino più alto. Nessuna migrazione: la versione dei progressi resta 2.
- `src/points/points.ts`: `withVerification` annota `solvedAt` alla prima risposta corretta. Regole dei punti invariate; il servizio della classifica ignora i campi nuovi e non cambia.
- `src/training/review.ts` (nuovo): scadenze, scelta degli esercizi da ripassare (i più in ritardo, al massimo dieci), esito, avvio del ripasso.
- Ripasso come sessione con `review: true` (`SessionView.tsx`, `sessionStorage.ts`): riprendibile come le altre e cancellata da «Azzera i progressi» e da «Esci dallo zaino» con la stessa chiave `:sessione`; ogni record ha l’esito `review`, registrato una volta sola nei progressi con `recordReview`. Riepilogo con l’esito del ripasso e senza colonne dei punti.
- `ExerciseWorkspace.tsx`: con `review` l’editor parte vuoto, le parole chiave sono nascoste, suggerimenti e soluzione già aperti si richiudono e si riaprono solo nella pagina, gratis e senza toccare i progressi. La notifica dell’esito spiega lo zero con `review` o `review-failed`.
- `PathView.tsx`: pulsante «Ripasso (N)» accanto a «Nuova sessione», oppure «Nulla da ripassare» disattivato, e una nota che spiega il ripasso e, se non c’è nulla, fra quanti giorni torna il prossimo esercizio. Icona esistente `circle-arrow-rotate-left`: nessuna icona nuova.

**Scostamenti dal dettaglio.**

- «Lo stato del ripasso» sono due campi, `reviewStep` e `reviewAt`, più `solvedAt` per la data di risoluzione: servono a calcolare la scadenza senza salvarla.
- Un ripasso interrotto con «Interrompi e vai al riepilogo» non registra esito per l’esercizio aperto e per quelli non raggiunti: restano da ripassare. Saltare un esercizio, invece, conta come ripasso fallito, come deciso con Marco.
- Mentre c’è una sessione o un ripasso in corso il percorso non offre il ripasso: se ne tiene uno alla volta, come per le sessioni.

**Verifiche superate il 2026-11-23.**

- `npm run lint && npm test && npm run check:themes && npm run build`: nessun errore, 257 test. Restano i due avvisi Star Wars documentati in F19 e l’avviso di Vite sulla dimensione del bundle.
- Test nuovi: `src/training/review.test.ts` (data di risoluzione, scadenze, dati vecchi, scelta per data e limite, esito che allunga o azzera l’intervallo, punti invariati), `src/progress/merge.test.ts` (unione dei campi del ripasso, commutativa, dati vecchi senza date), `src/training/sessionStorage.test.ts` (ripasso salvato ed esiti non validi).
- Nel browser integrato (`npm run dev`, Star Wars, 800 px) con progressi di prova nel formato precedente: «Ripasso (2)» con gli esercizi giusti (uno senza date, uno con `queryAt` di tre giorni prima; esclusi uno risolto un’ora prima e uno non risolto); ripasso riuscito con saldo invariato a 30, soluzione aperta che conta come fallito, riepilogo «Riuscito 1 su 2 ripassi», poi «Nulla da ripassare» con il prossimo esercizio fra un giorno; ripasso ripreso dopo una ricarica e saltato, con esito fallito e sessione cancellata. Nessun errore nella console.

**Verifiche non eseguite.** «Esci dallo zaino» e «Azzera i progressi» durante un ripasso non sono stati riprovati nel browser: il ripasso usa la stessa chiave della sessione, già provata in F06. Unione reale fra due dispositivi con lo zaino non provata nel browser, solo nei test.

**Lavoro residuo.** Revisione incrociata su Codex con Sol, prima di F14 e F16.

**Strumento e modello.** Claude Code, Opus 5.5.
