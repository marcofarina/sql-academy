# F14 — Assegnare una consegna con un link

- **Modello / effort:** Claude Code Opus · Codex Sol; effort consigliato `medium`. Nuova pagina, nuovo indirizzo, interazione con sessioni salvate e punti.
- **Revisione incrociata:** sì, sull’altro strumento prima delle fasi che ne dipendono: interagisce con le sessioni salvate e con i punti.
- **Dipendenze:** F06 (sessione salvata e riprendibile).
- **Consumo stimato:** medio.
- **Incertezza:** media. Aumenta se Marco vuole che lo studente possa mostrare l’esito della consegna in modo verificabile.
- **Punto di ripresa:** formato del link e sua lettura, con i test, prima della pagina del docente.

## 1. Obiettivo e risultato atteso

Il docente sceglie in una pagina del portale un tema e alcuni esercizi (o i filtri di una sessione) e ottiene un link; chi lo apre trova una sessione con quegli esercizi, nello stesso ordine, uguale per tutta la classe. Nessun server: il link porta con sé la consegna.

## 2. Contesto minimo

- Routing con hash: `src/routing/route.ts`; indirizzo della sessione `#/<tema>/addestramento/sessione`.
- Configurazione delle sessioni: `SessionConfig` in `src/training/session.ts`; sessione salvata per tema (F06).
- Il link si condivide in Classroom, nel registro elettronico, alla lavagna: deve restare corto.

## 3. Perimetro

Dentro: formato del link (esercizi per id, titolo facoltativo della consegna), lettura del link con esercizi inesistenti scartati e un avviso, pagina del docente, riepilogo finale della consegna, test.

Fuori: raccolta dei risultati della classe (chiederebbe un server o dati personali); account docente.

## 4. Attività di implementazione

1. Proponi a Marco: dove sta la pagina del docente (indirizzo proprio, non collegato dal menu degli studenti o collegato), se la consegna dà i punti normali, che cosa succede se lo studente ha già una sessione aperta, se il riepilogo finale si può mostrare al docente (per esempio a schermo, con data e ora). Attendi le scelte.
2. Definisci il formato del link, con versione, e scrivi lettura e scrittura come funzioni pure con i test.
3. Scrivi la pagina del docente: scelta del tema, degli esercizi (dal catalogo, con filtri) o dei filtri, titolo, copia del link.
4. Apri la consegna come sessione, riusando la sessione salvata di F06.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm run lint && npm test && npm run check:themes && npm run build` | Nessun errore |

Procedura manuale (`npm run dev`): crea una consegna di quattro esercizi di LOTR, apri il link in un altro browser: la sessione ha gli stessi esercizi nello stesso ordine; un link con un id inesistente apre gli altri e avvisa; un link manomesso non rompe la pagina.

## 6. Passaggio di consegne

**Esito:** completata il 2026-11-23 alle 16:48, su Claude Code con Opus. Consumo reale non misurato.

### Scelte di Marco (attività 1)

Tutte come proposte, il 2026-11-23:

- pagina del docente a un indirizzo proprio, `#/docente`, collegata solo dal piè di pagina con «Per i docenti»;
- la consegna dà i punti normali: un esercizio già risolto non ne dà altri, nessuna regola nuova e nessuna modifica al servizio della classifica;
- se lo studente ha già una sessione, un ripasso o un’altra consegna in corso nel tema, la consegna lo avvisa («Se cominci la consegna, la abbandoni») e offre «Comincia la consegna» oppure «Torna alla sessione»;
- il riepilogo finale si può mostrare al docente: titolo, data e ora di fine, codice della consegna. Non è verificabile, e il testo per il docente lo dice («Il sito non raccoglie i risultati»).

### Che cosa c’è

- `src/consegna/consegna.ts`: formato del link, versione 1, funzioni pure con i test in `consegna.test.ts`. Indirizzo `#/<tema>/addestramento/consegna/<codice>[/<titolo>]`; il codice è `1.` seguito dagli esercizi nell’ordine del docente, separati da punti, con `ex-NNN` scritto come numero (`1.6.21.14.34`). Al massimo 30 esercizi; titolo facoltativo di 80 caratteri al massimo. La lettura toglie le ripetizioni, scarta gli id che il tema non ha e li conta, tollera un punto finale (link incollato a fine frase); versione sconosciuta, elementi vuoti o caratteri estranei rendono il codice illeggibile.
- `src/routing/route.ts`: `CONSEGNA_ITEM`, campo `consegna` di `ThemeRoute`, pagina `docente` fra quelle del portale; `src/exercises/check.ts` riserva l’id `consegna`.
- `src/consegna/ConsegnaIntro.tsx`: la schermata che apre il link, con l’elenco degli esercizi, l’avviso per quelli tolti, la sessione già in corso e i messaggi per il link illeggibile o senza esercizi del tema.
- La consegna è una sessione (`ActiveSession`) con il campo `consegna: { code, title? }`, salvata nella stessa chiave di F06: si riprende dopo una ricarica, e «Azzera i progressi» e «Esci dallo zaino» la cancellano senza codice nuovo. `parseSession` accetta il campo e scarta codici illeggibili, titoli non validi e una sessione che sia insieme ripasso e consegna. `finishedAt`, nuovo, vive solo in memoria (una sessione finita non si salva).
- Riepilogo della consegna in `SessionView.tsx` con titolo, «Conclusa il 23 novembre 2026 alle 16:45» e codice; niente «Nuova sessione». Percorso e schermata della sessione salvata dicono «Riprendi la consegna».
- `src/consegna/DocentePage.tsx`: scelta del tema, titolo, catalogo con ricerca e filtri (capitolo, difficoltà, parola chiave) e caselle, «Estrai a caso fra questi» (3, 5 o 10 fra gli esercizi filtrati), «Ordina per capitolo e difficoltà», «Togli tutti», link con «Copia il link» e «Provalo in una scheda nuova». La pagina non salva nulla.
- Funzioni pure spostate in `src/training/session.ts` (`sessionKind`, `baselineOf`, `formatFinishedAt`), perché ESLint non vuole funzioni esportate accanto ai componenti.

### Verifiche

- `npm run lint && npm test && npm run check:themes && npm run build`: superati (284 test; `check:themes` con i due avvisi già giustificati in F19).
- Procedura manuale nel browser del pannello, `npm run dev`, superata: consegna di quattro esercizi di LOTR creata in `#/docente`, aperta dal link con gli stessi esercizi nello stesso ordine; ripresa dopo una ricarica; riepilogo con titolo, data, ora e codice; un esercizio risolto nella consegna dà +10 punti; un link con un id inesistente e uno ripetuto apre gli altri tre e avvisa; sei link manomessi (versione sconosciuta, caratteri estranei, codice mancante, nessun esercizio del tema, codifica rotta, punto doppio) mostrano un avviso o «Pagina non trovata» senza errori in console; una sessione già in corso produce l’avviso e «Comincia la consegna» la sostituisce; «Azzera i progressi» e `clearAllSessions` (la funzione chiamata da «Esci dallo zaino», richiamata dal modulo dell’app perché nel pannello non c’era uno zaino collegato) cancellano la consegna salvata; pagina del docente a 375 px senza scorrimento orizzontale.
- **Non eseguite:** apertura del link in un altro browser (ho usato lo stesso browser senza sessione salvata, equivalente per il link, che non legge altri dati); la copia riuscita negli appunti, perché il browser del pannello la nega: verificato il ripiego, che seleziona il link e lo dice; «Esci dallo zaino» dal pulsante vero, con uno zaino collegato.

### Scostamenti dal dettaglio

- «I filtri di una sessione» non entrano nel link: il docente usa i filtri per estrarre a caso esercizi precisi, che finiscono nel link. Motivo: con i filtri nel link ogni studente pescherebbe esercizi diversi, contro «uguale per tutta la classe».
- Corretto un difetto che la consegna rendeva visibile: dopo una consegna conclusa, «Nuova sessione» riapriva il riepilogo della consegna, senza modo di configurarne una nuova. Ora sull’indirizzo della sessione una consegna conclusa lascia il posto alla configurazione (`TrainingSection.tsx`).

### Limiti e lavoro residuo

- **Difetto di F12, non corretto qui:** dopo un ripasso concluso, «Nuova sessione» dal percorso riapre il riepilogo del ripasso, che non offre «Nuova sessione»; si esce solo ricaricando la pagina. Il riepilogo del ripasso sta sullo stesso indirizzo della sessione, quindi la correzione chiede una scelta (per esempio il pulsante «Nuova sessione» anche nel riepilogo del ripasso): da affidare alla revisione di F12.
- Il riepilogo della consegna vive in memoria: ricaricando la pagina dopo la fine, il link riapre la consegna da capo.
- Un id di sole cifre non entra in una consegna (si leggerebbe come `ex-NNN`); oggi tutti gli id sono `ex-NNN`.
- Revisione incrociata su Codex (Sol) prima delle fasi che ne dipendono.
