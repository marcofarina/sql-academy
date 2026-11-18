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

Fase completata il 2026-11-18 su Opus 5.5, in una sessione.

### Esito

- **Identificativo:** Marco ha scelto di rinominare tutto. URL `#/<tema>/traccia`, file `themes/<id>/traccia.md`, cartella `src/trace/` con `TraceSection`, nel contratto `loadTrace` al posto di `loadAnalysis`, classe CSS `.trace`. Aggiornati `src/themes/contract.ts`, `src/themes/registry.ts` e la guida «Aggiungere un tema» del `README.md`. Il vecchio URL `#/<tema>/analisi` non esiste più.
- **Titolo della pagina:** per la sezione «Traccia» il guscio (`src/pages/ThemePage.tsx`) non scrive il proprio `h1`; `TraceSection` usa come `h1` il primo titolo `#` del testo, con l’icona della sezione accanto. Finché il testo si carica, o se manca, l’`h1` resta «Traccia». La larghezza massima delle righe vale per il testo e non per il titolo (`.trace > :not(h1)`), così il titolo resta su una riga. Il titolo del documento resta «Traccia · <tema> · SQL Academy».
- **Grassetti**, solo aggiunti, nessun’altra modifica ai testi: l’entità alla prima presentazione, i vincoli di cardinalità, i casi di dato mancante; per LOTR anche lo schieramento nelle battaglie e «solo il primo passaggio» delle tappe. Gli attributi non sono in grassetto; nessun grassetto nel paragrafo d’apertura e in quello sugli anni. Al massimo quattro per paragrafo.
- **Osservazioni di Marco sui grassetti:** approvati così.
- **Passata di `scrittura-umana.md`:** sui grassetti (§10) e sui due testi; nessun difetto nuovo. Quattro grassetti per paragrafo superano «un concetto per paragrafo», ma sono le categorie chieste da Marco.

### Verifiche

| Verifica | Esito |
| --- | --- |
| `npm run check:themes` | superata: `lotr` 20 esercizi, `star-wars` 105, 0 problemi |
| `npm test` | superata: 15 file, 119 test |
| `npm run lint` | superata |
| `npm run build` | superata (resta l’avviso già noto sulla dimensione dei *chunk*) |
| `grep -rn "Analisi" src themes README.md` | superata: nessuna occorrenza |
| Procedura manuale, quattro schemi | superata nel browser integrato: barra con «Traccia», `h1` «Le cronache di Gran Burrone» e «L’archivio della galassia», grassetti visibili in LOTR chiaro e scuro e in Star Wars chiaro e scuro |

### Lavoro residuo

- Restano «analisi» in documenti storici del piano e in `docs/design/star-wars.md` (elenco delle sezioni): fuori perimetro, non toccati.
- Controllo chiesto da Marco a fine fase sulle passate anti-slop delle fasi precedenti: registrate in F02 (messaggi di esito), F07 (analisi e tutti gli esercizi di Star Wars, per campione) e F09 (analisi ed esercizi di LOTR). I testi dell’interfaccia di F05 risultano non passati dalle norme (lo dice il suo passaggio di consegne) e F07 non li ha ripresi; di F08 e F09 non c’è traccia di una passata su motti e descrizioni dei temi.
