# F04 — Costruire la barra comune e il ritorno alla pagina precedente

- **Modello / effort:** Opus 5.5 `medium`. Tocca tutte le pagine e il contratto della veste; possibili icone nuove.
- **Dipendenze:** F02 (specifica `docs/design/barra-notifica.md`).
- **Consumo stimato:** medio.
- **Incertezza:** media. Aumenta se le vesti dei due temi vanno riscritte per la barra nuova invece di adattate.
- **Punto di ripresa:** barra comune montata su tutte le pagine con la veste neutra, prima delle vesti dei temi.

## 1. Obiettivo e risultato atteso

Una sola barra in testa a ogni pagina del sito (punto 4A), con lo stato dello zaino leggibile a colpo d’occhio (punto 1) e, nelle pagine Zaino e Classifica, «Indietro» verso la pagina di provenienza (punto 4B), come approvato in F02.

## 2. Contesto minimo

- Specifica: `docs/design/barra-notifica.md`.
- Intestazioni di oggi: § 2 di F02.
- Routing con hash: `src/routing/route.ts`, `src/routing/useHashRoute.ts`. La pagina di provenienza si ricava dalla navigazione dentro il sito, non dal `referrer`.
- Contratto della veste: «Veste di un tema» nelle «Decisioni condivise» del piano archiviato; `check:themes` controlla che le regole di `stile.css` restino confinate sotto `.theme[data-theme-id="<id>"]`.

## 3. Perimetro

Dentro: un componente comune della barra, il suo uso in `App.tsx` o nelle pagine, lo stato dello zaino nella barra (al posto di `ZainoLink` così com’è), «Indietro», le regole delle vesti di Star Wars e LOTR per la barra, i test.

Fuori: la notifica dell’esito (F05), il contenuto delle pagine Zaino e Classifica (F07).

## 4. Attività di implementazione

1. Elenca le icone che servono (per esempio per «Indietro» e per gli stati dello zaino), cercale nel catalogo e disegna le mancanti secondo la sezione «Icone» del piano.
2. Scrivi la barra comune e montala su tutte le pagine; togli le intestazioni duplicate.
3. Registra la pagina di provenienza a ogni cambio di indirizzo; «Indietro» torna lì, o dove dice la specifica se non c’è.
4. Porta nella barra lo stato dello zaino con i testi di `testoStato`, e mantieni l’annuncio ai lettori di schermo.
5. Adatta `stile.css` dei due temi; se la barra ha bisogno di un campo nuovo nel contratto della veste, aggiornalo in `src/themes/contract.ts`, nel `README.md` («Aggiungere un tema») e in `check:themes`.
6. Prova con il browser integrato: home, tema in entrambi gli schemi, Zaino e Classifica raggiunte da un tema, link diretto a `#/classifica`, 1280 e 375 px.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm run lint && npm test && npm run check:themes && npm run build` | Nessun errore |

Procedura manuale (`npm run dev`): da `#/lotr/addestramento` apri Zaino, poi «Indietro» riporta a `#/lotr/addestramento`; lo stesso per Classifica; da un link diretto «Indietro» segue la specifica; lo stato dello zaino cambia aspetto fra collegato, non collegato e senza rete (scollega la rete dagli strumenti del browser); la barra compare in tutte le pagine elencate in F02.

## 6. Passaggio di consegne

Da compilare a fine fase.
