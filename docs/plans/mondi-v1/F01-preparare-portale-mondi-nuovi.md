# F01 — Preparare il portale ai mondi nuovi

- **Modello / effort:** Claude Code Sonnet · Codex Terra; effort consigliato `medium`. La forma è decisa qui sotto: un campo del manifest e l’ordine del mucchio sul tavolo. Ripiego: Opus o Sol se il filtro dei mondi in bozza nei plugin del build si rivela intricato.
- **Revisione incrociata:** sì, con l’altro strumento allo stesso livello, prima di F02. La fase decide che cosa arriva nel sito pubblicato: un difetto pubblica un mondo a metà o nasconde un mondo già pubblicato.
- **Dipendenze:** nessuna.
- **Consumo stimato:** basso-medio. Poche righe in registro, plugin del build, generatore e pagina iniziale; la prova con dieci locandine pesa più del codice.
- **Incertezza:** media sul filtro nel build: `import.meta.glob` raccoglie tutte le cartelle di `themes/`, e i plugin `themeStatsPlugin`, `offlinePlugin` e lo script `classifica-dati.ts` leggono il disco per conto loro.
- **Punto di ripresa:** campo `draft` nel contratto con il mondo in bozza assente dal build di produzione, prima del lavoro sulla pagina iniziale.

## 1. Obiettivo e risultato atteso

Due cambiamenti decisi con Marco il 2026-11-23, prima di costruire i mondi:

1. **Mondi in bozza.** Un manifest con `draft: true` mostra il mondo con `npm run dev`, ma non nel sito costruito con `npm run build`: niente locandina, nessuna pagina `#/<id>/…`, nessun file nel *service worker*, niente esercizi nei dati della classifica. Marco può così pubblicare `dev` in ogni momento, anche con un mondo a metà.
2. **Mucchio per livello.** Sul tavolo della pagina iniziale posizioni e inclinazioni restano casuali a ogni lancio e con «Rimescola», ma l’ordine di sovrapposizione segue il livello: i complessi cadono per primi e restano sotto, i facili cadono per ultimi e restano sopra. A 375 px il mazzo comincia dai facili. Dentro un livello l’ordine è casuale. Con dieci locandine il tavolo è molto coperto: è voluto, si scoprono le altre spostandole.

## 2. Contesto minimo

- `src/themes/contract.ts` (`ThemeManifest`), `src/themes/registry.ts` (scoperta dei temi con `import.meta.glob`).
- `scripts/themeStatsPlugin.ts`, `scripts/offlinePlugin.ts`, `scripts/classifica-dati.ts`, `scripts/check-themes.ts`, `scripts/nuovo-tema.ts`.
- `src/pages/HomePage.tsx`: `posters`, `stack`, `scatter`, `deckTop`, locandine «Prossimamente» (`MIN_POSTERS`).
- `docs/design/neutra.md`: tavolo, mazzo, movimento, locandine «Prossimamente».
- `README.md` del repo, «Aggiungere un tema».
- Test: `src/themes/registry.test.ts`, `e2e/portale.spec.ts`.

## 3. Perimetro

Dentro: campo `draft` nel contratto e nel suo commento in testa; esclusione dei mondi in bozza dal build di produzione, dai dati della classifica e dalla cache del *service worker*; `draft: true` nello scheletro generato da `npm run nuovo-tema`; ordine del mucchio e del mazzo per livello; aggiornamento di `docs/design/neutra.md` e della guida «Aggiungere un tema»; test.

Fuori: mondi nuovi; ridisegno del tavolo o delle locandine; pagina Classifica (con dieci mondi la si prova, non la si cambia: un difetto si annota per Marco).

## 4. Attività di implementazione

1. Aggiungi `draft?: boolean` a `ThemeManifest`, con un commento in italiano: «mondo in costruzione: visibile solo con `npm run dev`».
2. Escludi i mondi con `draft: true` quando `import.meta.env.DEV` è falso: dal registro dei temi (pagina iniziale, instradamento, Zaino, Classifica, consegne), da `virtual:theme-stats` e dall’elenco dei file del *service worker*. Scegli il punto più semplice che copre tutti i consumatori e dichiaralo nel passaggio di consegne. Il nome del mondo può restare nel JavaScript costruito, purché nessuna pagina lo mostri e nessun suo file si scarichi: se il filtro alla fonte (per esempio un modulo virtuale con l’elenco delle cartelle pubblicabili) costa poco, preferiscilo.
3. `scripts/classifica-dati.ts`: salta i mondi in bozza, così il servizio della classifica non conosce esercizi che nessuno può risolvere e va ripubblicato solo quando un mondo esce dalla bozza.
4. `scripts/check-themes.ts`: controlla anche i mondi in bozza, come oggi; stampa una riga che li elenca, così una bozza dimenticata si vede.
5. `scripts/nuovo-tema.ts`: lo scheletro nasce con `draft: true` e un commento che dice di toglierlo in D.
6. Pagina iniziale: l’ordine iniziale di `stack` e l’ordine del mazzo seguono `WORLD_LEVELS` al contrario per il mucchio (facili in cima) e diritto per il mazzo (facili per primi), con un mescolamento casuale dentro ogni livello, rifatto da «Rimescola». Le locandine «Prossimamente» stanno sotto tutte. L’ordine di tabulazione e quello letto dagli screen reader seguono l’ordine del mazzo: prima i facili. Trascinare una locandina la porta in cima come oggi.
7. Aggiorna `docs/design/neutra.md` (sezioni del tavolo e del mazzo) e la guida «Aggiungere un tema»: il campo `draft`, quando toglierlo, che cosa esclude.
8. Test: unità per il filtro della bozza e per l’ordine per livello (con il mescolamento reso deterministico nel test); in `e2e/portale.spec.ts`, se l’ordine delle locandine vi è dato per scontato, adegua le attese.

## 5. Criteri di accettazione

Dalla radice del repo:

| Comando | Risultato atteso |
| --- | --- |
| `npm test` | Nessun errore, con i test nuovi |
| `npm run lint`, `npm run check:themes` | Uscita 0 |
| `node scripts/classifica-dati.ts --controlla` | Uscita 0: con i due temi pubblicati i dati della classifica non cambiano |
| `npm run build`, `npm run test:e2e` | Nessun errore |

Procedura manuale con un mondo di prova:

1. `npm run nuovo-tema -- prova-bozza`: il manifest ha `draft: true`. Con `npm run dev` la locandina compare e `#/prova-bozza/sandbox` funziona; `npm run check:themes` elenca il mondo fra le bozze.
2. `npm run build && npm run preview`: la locandina non c’è; `#/prova-bozza/sandbox` porta dove porta un tema inesistente; il *service worker* non elenca file del mondo (cerca `prova-bozza` nella lista dei file in cache del build); `node scripts/classifica-dati.ts --controlla` esce con 0.
3. Genera altri mondi di prova fino a dieci, con livelli misti, e togli `draft` da tutti. Con `npm run build && npm run preview`, a 1280 px: i facili stanno sopra il mucchio a ogni ricarica e dopo «Rimescola», le posizioni cambiano, ogni locandina si può spostare e aprire. A 375 px: il mazzo comincia dai facili, l’indicazione dice «1 di 10». Con il tasto Tab il fuoco percorre prima i facili. Apri la pagina Classifica con i servizi simulati dei test end-to-end e annota se il selettore dei mondi regge dieci mondi; non correggerla in questa fase.
4. Rimuovi tutti i mondi di prova e controlla con `git status` che non resti nulla.

## 6. Passaggio di consegne

### Decisioni ed esito

### Scostamenti dal dettaglio

### Verifiche

### Limiti e lavoro residuo

### Strumento e modello
