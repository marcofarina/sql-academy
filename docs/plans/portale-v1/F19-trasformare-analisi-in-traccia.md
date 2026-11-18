# F19 — Trasformare la sezione «Analisi» nella «Traccia»

- **Modello / effort:** Opus 5.5 `medium`. Testi per gli studenti nei due temi e una piccola modifica al contratto.
- **Dipendenze:** F09.
- **Consumo stimato:** basso-medio.
- **Incertezza:** bassa. Cresce se Marco vuole rivedere i testi oltre ai grassetti.
- **Punto di ripresa:** sezione rinominata e titolo del testo al posto di quello della sezione, prima dei grassetti.

Questa fase si esegue solo in locale: scrive testi per gli studenti e ha bisogno di `.claude/norms/`.

## 1. Obiettivo e risultato atteso

Feedback di Marco del 2026-11-18, dopo la prova di F09:

1. Il testo da cui nasce il database non è un’analisi: è il testo del problema, come nella seconda prova dell’Esame di Stato. La sezione si chiama **«Traccia»** (scelta di Marco, 2026-11-18).
2. La pagina della sezione non mostra il titolo «Analisi» o «Traccia»: il titolo della pagina è quello del testo (per LOTR «Le cronache di Gran Burrone»).
3. Nel testo, il grassetto evidenzia le parti più importanti per chi progetta il database: le entità e le informazioni da registrare, i vincoli di cardinalità, i casi in cui un dato può mancare.

## 2. Contesto minimo

- `src/routing/route.ts` (`SECTIONS`: id `analisi`, etichetta «Analisi», icona `file-lines`), `src/pages/ThemePage.tsx` (titolo della sezione), `src/analysis/` (componente e Markdown minimo, che deve accettare il grassetto: verificalo in `src/analysis/markdown.ts`).
- Contratto: `analisi.md` in `src/themes/contract.ts`, `scripts/check-themes.ts`, `README.md` (guida «Aggiungere un tema»).
- Testi: `themes/star-wars/analisi.md`, `themes/lotr/analisi.md`.
- `.claude/norms/scrittura-didattica.md` e `.claude/norms/scrittura-umana.md`; per i grassetti la regola di `contenuto.md`: solo concetti chiave, con moderazione.

## 3. Perimetro

Dentro: nome della sezione, titolo della pagina, grassetti nei due testi, nomi nel contratto e nella guida.

Fuori: riscrittura dei testi oltre ai grassetti; le altre sezioni.

## 4. Attività di implementazione

1. All’avvio chiedi a Marco se rinominare anche l’identificativo: URL `#/<tema>/traccia` al posto di `#/<tema>/analisi` e file `traccia.md` al posto di `analisi.md`. Il portale non è pubblicato, quindi nessun link esterno si rompe; proponi di rinominare tutto per coerenza.
2. Applica il nome «Traccia» nella barra, nel titolo del documento e ovunque l’interfaccia nomini la sezione.
3. Nella pagina della sezione togli il titolo della sezione e usa come titolo principale (`h1`) quello del testo; l’icona della sezione resta accanto al titolo, se la veste del tema la prevede.
4. Metti in grassetto le parti importanti dei due testi, poche per paragrafo. Mostra a Marco i due testi prima del commit.
5. Applica la passata finale di `scrittura-umana.md`.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm run check:themes` | Exit 0 su entrambi i temi |
| `npm test`, `npm run lint`, `npm run build` | Exit 0 |
| `grep -rn "Analisi" src themes README.md` | Nessuna occorrenza riferita alla sezione |

Procedura manuale con `npm run dev`: in entrambi i temi la barra mostra «Traccia»; la pagina si apre con il titolo del testo; i grassetti sono visibili nei quattro schemi.

## 6. Passaggio di consegne

Da compilare alla chiusura: esito, verifiche, decisione sull’identificativo, osservazioni di Marco sui grassetti, lavoro residuo, consumo reale se noto.
