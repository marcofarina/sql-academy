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

**Completata il 2026-11-21 con Codex Sol** (modello predefinito `gpt-6.2-sol` in `~/.codex/config.toml`). `ExerciseWorkspace` usa la stessa notifica per esercizi singoli e sessioni. Il premio viene dalla verifica registrata nei progressi. La riga dello zaino segue la sincronizzazione e l’ora compare dopo la conferma del servizio.

**Decisione di Marco.** Una risposta corretta anticipa il salvataggio nello zaino. Se c’è già una scrittura in corso, la nuova richiesta si accoda. Senza rete o durante l’attesa dopo un errore vale la procedura di ripresa dello zaino. Le altre modifiche mantengono l’attesa ordinaria di cinque secondi.

**Verifiche.**

- Superati `npm run lint`, `npm test` (227 test), `npm run check:themes`, `npm run build` e `git diff --check`. Restano i due avvisi già documentati in F19 e l’avviso di Vite sulla dimensione del bundle.
- Superato `node docs/design/contrasto.mjs barra-notifica` (60 coppie).
- In Chrome con `npm run dev` e il Worker dello zaino in locale su D1 di prova: esercizio singolo e sessione in entrambi i temi, premio e saldo, entrambi i motivi del premio a zero, esito errato e tabella, chiusura automatica, oltre cinque secondi di pausa con puntatore e tastiera, ripresa, OK, Esc, 1280 e 375 px, movimento ridotto e avanzamento di sessione con la notifica aperta.
- Nel browser: scrittura immediata confermata dal Worker locale, simulazione offline con `navigator.onLine` a `false` e successivo salvataggio, risposta 503 simulata e conferma dopo un nuovo tentativo, collegamento da un secondo profilo, uscita dallo zaino temporaneo e azzeramento dei progressi. Verificati il ruolo e il nome accessibile della regione di stato. Lettore di schermo e servizio di produzione fuori dalla prova.

**Scostamenti dal dettaglio.** La versione mobile usa il breakpoint della barra (56 rem). Su desktop il pannello delle tabelle occupa più spazio solo quando serve a tenere la notifica fuori dall’editor. L’annuncio usa una regione di stato sempre montata e i comandi della notifica sono fuori dalla regione. Una verifica che termina dopo lo smontaggio dell’esercizio non registra l’esito, così una risposta tardiva non ripristina progressi dopo un azzeramento o l’uscita dallo zaino. Nei testi il motivo del premio a zero evita di ripetere «Nessun punto» e gli errori che richiedono un intervento indicano l’azione prevista dallo zaino.

**Residuo.** Nessuno: revisione incrociata fatta (sezione «Revisione»).

## Revisione

**Revisione incrociata del 2026-11-21 con Claude Code Opus.** Esito: nessun difetto, nessuna correzione.

- Letti il diff di `23aab26` e il passaggio di consegne, confrontati con il dettaglio e con `docs/design/barra-notifica.md`, scostamenti compresi.
- Rieseguiti `npm run lint`, `npm test` (227 test), `npm run check:themes`, `npm run build` e `node docs/design/contrasto.mjs barra-notifica`: superati, con gli stessi avvisi noti.
- Nel browser (`npm run dev`, senza zaino): esercizio `lotr/ex-001` risolto, notifica con «+10 punti», saldo, riga «Salvato in questo browser» con il collegamento allo zaino, annuncio della regione di stato e chiusura da sola dopo quattro secondi. Pausa, rete e sessione non riprovate: le ha già coperte la fase.
- Percorsi controllati nel codice: l’anticipo non parte senza modifiche in sospeso, dopo un errore, durante l’attesa crescente o senza rete; accodato a una scrittura in corso resta anticipato solo se lo era anche la richiesta già in coda, e il ciclo successivo annulla il timer dei cinque secondi; una verifica che termina dopo lo smontaggio non registra nulla; «Verifica» durante un’esecuzione resta protetta da `perform`; con movimento ridotto non esiste timer, come vuole la specifica.
- Scelta lasciata: una nuova risposta corretta a un esercizio già risolto anticipa comunque la scrittura, perché la verifica cambia i progressi; il costo è una scrittura in più, nessun dato perso.
