# F16 — Riprendere da dove eri e guidare il primo ingresso

- **Modello / effort:** Claude Code Opus · Codex Sol; effort consigliato `medium`. Piccole decisioni d’interfaccia, testi per gli studenti, possibili icone.
- **Revisione incrociata:** sì, sull’altro strumento prima delle fasi che ne dipendono: salva nel browser dove era lo studente, accanto alla sessione salvata.
- **Dipendenze:** F04 (barra comune), F06 (sessione riprendibile, che offre già «Riprendi la sessione»).
- **Consumo stimato:** basso-medio.
- **Incertezza:** bassa. Aumenta se Marco vuole studiare la guida con l’Artifact «Design».
- **Punto di ripresa:** «Riprendi da dove eri» funzionante, prima della guida.

## 1. Obiettivo e risultato atteso

1. Sulla locandina del tema o all’ingresso nel tema, lo studente trova l’ultimo esercizio aperto e ci torna con un clic. Se c’è una sessione salvata, vale quella (F06).
2. Al primo ingresso in un tema compare una guida breve: che cosa sono le sezioni, dove si eseguono le query, Ctrl+Invio (Cmd+Invio su Mac) per eseguire. Si chiude e non torna, ma si può riaprire.

## 2. Contesto minimo

- Ultimo esercizio: si ricava dai progressi (`queryAt`) senza un campo nuovo, se basta; altrimenti chiedi a Marco prima di estendere il formato in produzione.
- Scorciatoia di esecuzione: `Mod-Enter` in `src/sandbox/SqlEditor.tsx`.
- Locandine: `src/pages/HomePage.tsx`, specifica `docs/design/neutra.md`.

## 3. Perimetro

Dentro: «Riprendi da dove eri», guida al primo ingresso, memoria «guida già vista» per tema o per sito nel browser, testi, test.

Fuori: guide interattive passo per passo sopra l’interfaccia.

## 4. Attività di implementazione

1. Proponi a Marco dove mostrare «Riprendi da dove eri» (retro della locandina, ingresso nel tema, entrambi) e la forma della guida (riquadro chiudibile, finestra), con una bozza dei testi; attendi le scelte.
2. Elenca le icone, cercale nel catalogo e disegna le mancanti secondo la sezione «Icone» del piano (su Codex fermati prima di disegnarle e lascia un segnaposto).
3. Implementa le due funzioni; la guida si riapre da un collegamento (per esempio nella barra o nel piè di pagina di F10).
4. Scrivi i test della scelta dell’ultimo esercizio.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm run lint && npm test && npm run check:themes && npm run build` | Nessun errore |

Procedura manuale (`npm run dev`, browser con dati puliti): il primo ingresso in Star Wars mostra la guida, il secondo no; dopo aver scritto in un esercizio e tornato alla home, «Riprendi da dove eri» riporta a quell’esercizio con la query.

## 6. Passaggio di consegne

**Esito:** completata il 2026-11-23 alle 17:15, su Claude Code con Opus. Consumo reale non misurato.

### Scelte di Marco (attività 1)

Il 2026-11-23:

- «Riprendi da dove eri» sul retro della locandina e nella barra del percorso dell’addestramento (proposta);
- guida come riquadro chiudibile in cima alla pagina del tema, con «Ho capito» (proposta);
- memoria «guida già vista» **per sito**, non per tema (Marco ha scelto l’alternativa): la guida compare al primo ingresso nel primo tema visitato e non negli altri;
- la guida si riapre da un pulsante «Guida» nella barra del tema (proposta);
- testi della guida approvati nella bozza, poi rifiniti (vedi sotto).

### Che cosa c’è

- `src/training/resume.ts`: `lastExercise`, l’esercizio con il `queryAt` più alto fra quelli del tema (a parità, il primo nell’ordine del percorso), risolto o no; nessun campo nuovo nei progressi. Test in `resume.test.ts`. Ci sta anche `RESUME_LABEL`, spostato da `PathView.tsx` perché ESLint non vuole costanti esportate accanto ai componenti.
- Retro della locandina (`src/pages/HomePage.tsx`, `useResume`): gli esercizi del tema si caricano alla prima apertura della scheda. Con una sessione, un ripasso o una consegna salvata compare «Sessione in corso: esercizio 3 di 5» e «Riprendi la sessione» (o «il ripasso», «la consegna»), che porta a `#/<tema>/addestramento/sessione`; altrimenti «Ultimo esercizio: «titolo»» e «Riprendi da dove eri», che apre l’esercizio con la query salvata. Il pulsante di ripresa diventa il primario, «Entra» il secondario. Stile `.card-resume` in `src/styles.css`.
- Percorso (`src/training/PathView.tsx`): «Riprendi da dove eri» accanto a «Nuova sessione», solo senza sessione in corso.
- Guida: `src/guide/guide.ts` (segno `sql-academy:guida` = `1` nell’area corrente dello zaino, test in `guide.test.ts`) e `src/guide/ThemeGuide.tsx`, montata da `ThemePage.tsx` sopra il titolo della sezione. Pulsante «Guida» in `SiteLayout.tsx` con `aria-controls` e `aria-expanded`; riaprendo, il fuoco va al riquadro, e chiudendolo torna al pulsante. Barra del tema con una colonna in più (`src/styles.css`).
- Il segno della guida lo cancellano «Azzera i progressi» (`TrainingSection.tsx`) ed «Esci dallo zaino» (`svuota` in `src/zaino/sezione.ts`), come vuole la decisione «Dati nel browser». Non va nello zaino.
- Icona RB nuova `circle-question`, approvata da Marco (commit `f2f64b2` del repo `icone`); `bullseye` per «Riprendi da dove eri».

Testo finale della guida, dopo la passata di `scrittura-umana.md`: «In alto trovi sei sezioni. Nella «Sandbox» esegui qualunque query sul database del mondo; nell’«Addestramento» risolvi esercizi che il sito verifica e che danno punti; «Tutte le query» elenca gli esercizi in un’unica pagina. «Traccia», «Schema ER» e «Modello logico» descrivono il database: la traccia è il testo da cui nasce, gli altri due ne mostrano entità e tabelle.» e «Le query si scrivono nell’editor e si eseguono con «Esegui» oppure con Ctrl+Invio (Cmd+Invio su Mac). Questa guida si riapre dal pulsante «Guida» nella barra in alto.»

### Verifiche

- `npm run lint && npm test && npm run check:themes && npm run build`: superati (291 test, 7 nuovi; `check:themes` con i due avvisi già giustificati in F19).
- Procedura manuale nel browser del pannello, `npm run dev`, dati puliti, superata: il primo ingresso in Star Wars mostra la guida, dopo «Ho capito» e una ricarica no; «Guida» la riapre con il fuoco sul riquadro, e chiudendola il fuoco torna al pulsante; dopo aver scritto in `ex-012` e tornato alla home, la scheda di Star Wars mostra «Ultimo esercizio: «Astronavi con un solo membro d’equipaggio»» e «Riprendi da dove eri» riapre l’esercizio con la query; il percorso offre lo stesso collegamento; con una sessione avviata la scheda mostra «Sessione in corso: esercizio 1 di 5» e «Riprendi la sessione»; «Azzera i progressi» cancella il segno della guida, che ricompare, e toglie «Riprendi da dove eri»; `svuota` della sezione dello zaino (la funzione di «Esci dallo zaino», richiamata dal modulo perché nel pannello non c’era uno zaino collegato) cancella il segno; a 375 px barra e guida senza scorrimento orizzontale, nessun errore in console.
- **Non eseguite:** «Esci dallo zaino» dal pulsante vero, con uno zaino collegato; la modalità «Non è il mio computer» (il segno usa la stessa area di progressi e sessioni, `storageDi`).

### Scostamenti dal dettaglio

- Con una sessione salvata, «Riprendi la sessione» della locandina porta alla schermata della sessione salvata di F06, che chiede ancora «Riprendi la sessione» o «Abbandonala»: due clic invece di uno. Motivo: riprendere senza conferma da un’altra pagina chiedeva un passaggio di stato fra pagine, e la schermata di F06 esiste già per questo indirizzo.
- Sotto i 72rem il pulsante «Guida» mostra solo l’icona (con `aria-label`), non solo su telefono: a 1024 px la scritta toglieva spazio al nome del tema. Anche così a 1024 px «Star Wars» perde circa 28 px e finisce nell’ellissi già prevista per i nomi lunghi; a 1280 px entra intero.

### Limiti e lavoro residuo

- La scheda della locandina legge la sessione salvata quando si apre; se gli esercizi si caricano dopo i 450 ms del giro della scheda, il fuoco va su «Entra» e il pulsante di ripresa compare subito prima.

## Revisione

Revisione incrociata del 2026-11-23 con Codex Sol. Il commit `99659da` restituisce il fuoco al pulsante «Guida» anche alla prima chiusura. Il pulsante porta il fuoco al riquadro anche quando è già aperto.

- Confrontati il diff di `965c704`, le scelte approvate e gli scostamenti del passaggio di consegne.
- In Chrome con `npm run dev`, a 375 px, verificati il primo ingresso, il segno comune ai temi dopo la ricarica, il fuoco, la ripresa con la query dalla locandina, la precedenza della sessione salvata e l’azzeramento. Barra e guida entrano nella larghezza della finestra.
- Con il servizio dello zaino simulato, «Esci dallo zaino» cancella il segno in modalità temporanea e conserva quello dell’area normale.
- Superati `npm run lint`, `npm test` (294 test), `npm run check:themes`, `npm run build` e `git diff --check`. Restano i due avvisi Star Wars di F19 e l’avviso di Vite sulle dimensioni del bundle.
