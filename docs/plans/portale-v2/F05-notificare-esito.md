# F05 — Notificare l’esito con i punti e il salvataggio nello zaino

- **Modello / effort:** Claude Code Opus · Codex Sol; effort consigliato `medium`. Componente con tempo, pausa e accessibilità, più un cambio nei tempi della sincronizzazione dello zaino.
- **Revisione incrociata:** sì, sull’altro strumento prima delle fasi che ne dipendono: anticipa la scrittura nello zaino, cioè la sincronizzazione dei progressi degli studenti.
- **Dipendenze:** F02 (specifica della notifica), F04 (stato dello zaino nella barra, a cui la notifica rimanda).
- **Consumo stimato:** medio.
- **Incertezza:** media. Aumenta se anticipare la scrittura dello zaino alla risoluzione richiede di rivedere la coda delle modifiche in `sincronizza.ts`.
- **Punto di ripresa:** notifica funzionante con punti e saldo, prima del collegamento con lo stato dello zaino.

## 1. Obiettivo e risultato atteso

Quando lo studente risolve un esercizio, al posto del riquadro verde compare la notifica approvata in F02 (punto 3): che cosa è successo, punti guadagnati, saldo e se l’esercizio è salvato nello zaino (punto 2). Il pulsante «OK» si riempie e chiude la notifica da solo in 3–4 secondi; il puntatore sopra il pulsante, o il fuoco della tastiera, ferma riempimento e tempo.

## 2. Contesto minimo

- Specifica: `docs/design/barra-notifica.md`.
- Riquadro di oggi: `VerdictView` in `src/training/ExerciseWorkspace.tsx`. L’esito sbagliato resta com’è («Decisioni condivise» del piano).
- Punti: `src/points/points.ts`, testi in `src/points/labels.ts`, saldo in `src/points/Balance.tsx`.
- Zaino: scrive 5 secondi dopo l’ultima modifica (`RITARDO_MODIFICA` in `src/zaino/sincronizza.ts`), quindi dopo la chiusura della notifica. Proposta da confermare con Marco: alla risoluzione di un esercizio la scrittura parte subito, senza attendere il ritardo, così la notifica può dire «salvato nello zaino». L’alternativa è una notifica che dice «sta partendo per lo zaino» e lascia la conferma alla barra.

## 3. Perimetro

Dentro: componente della notifica, suo uso nello spazio di lavoro e nella sessione, eventuale scrittura immediata dello zaino, testi, test.

Fuori: altri eventi notificati, se F02 non li ha approvati; la barra (F04).

## 4. Attività di implementazione

1. Elenca le icone della notifica, cercale nel catalogo e disegna le mancanti secondo la sezione «Icone» del piano (su Codex fermati prima di disegnarle e lascia un segnaposto).
2. Scrivi il componente: annuncio con `role="status"` (o come prescrive la specifica), tempo di 3–4 secondi come approvato, pausa con puntatore e fuoco, chiusura con «OK» ed Esc, `prefers-reduced-motion` come da specifica.
3. Collega la notifica a ogni prima risoluzione e alle risoluzioni successive come da specifica; togli `notice-success` dal percorso corretto di `VerdictView`, lasciando la tabella del risultato.
4. Decidi con Marco la scrittura immediata dello zaino; se sì, implementala in `sincronizza.ts` con i test in `src/zaino/zaino.test.ts`.
5. Collega la riga dello zaino nella notifica allo stato reale: salvato, in sospeso, senza rete, in errore, non collegato.
6. Scrivi i test della logica del tempo (pausa, ripresa, chiusura) con timer finti.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm run lint && npm test && npm run check:themes && npm run build` | Nessun errore |

Procedura manuale (`npm run dev`, con uno zaino collegato al servizio locale o di produzione secondo quanto concordato con Marco): risolvi un esercizio e controlla punti e saldo nella notifica; lasciala chiudersi da sola; risolvine un altro e tieni il puntatore sul pulsante per più di 5 secondi: resta aperta e il riempimento è fermo; ripeti con il tasto Tab; scollega la rete e risolvi: la notifica dice che il salvataggio è in sospeso; ripeti in una sessione e su entrambi i temi.

## 6. Passaggio di consegne

Da compilare a fine fase.
