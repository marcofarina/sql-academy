# Piano «portale-v2»

| ID | Fase | Dipendenze | Modello / effort | Consumo stimato | Stato | Completata il | Prompt | Dettaglio |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| F01 | Chiudere la pubblicazione del portale | — | Sonnet 5.5 `medium` | basso | da fare | | [P-F01](#p-f01) | [F01](F01-chiudere-pubblicazione.md) |
| F02 | Studiare barra comune, stato dello zaino e notifica dell’esito | — | Opus 5.5 `medium` | medio-alto | da fare | | [P-F02](#p-f02) | [F02](F02-studiare-barra-notifica.md) |
| F03 | Studiare le pagine Zaino e Classifica | F02 | Opus 5.5 `medium` | medio-alto | da fare | | [P-F03](#p-f03) | [F03](F03-studiare-pagine-zaino-classifica.md) |
| F04 | Costruire la barra comune e il ritorno alla pagina precedente | F02 | Opus 5.5 `medium` | medio | da fare | | [P-F04](#p-f04) | [F04](F04-costruire-barra-comune.md) |
| F05 | Notificare l’esito con i punti e il salvataggio nello zaino | F02, F04 | Opus 5.5 `medium` | medio | da fare | | [P-F05](#p-f05) | [F05](F05-notificare-esito.md) |
| F06 | Rendere riprendibile la sessione di esercizi | — | Sonnet 5.5 `high` | basso-medio | da fare | | [P-F06](#p-f06) | [F06](F06-sessione-riprendibile.md) |
| F07 | Ricostruire le pagine Zaino e Classifica | F03, F04 | Opus 5.5 `medium` | medio-alto | da fare | | [P-F07](#p-f07) | [F07](F07-ricostruire-pagine-zaino-classifica.md) |
| F08 | Scegliere le IP dei nuovi mondi e definirne i livelli | — | Opus 5.5 `medium` | medio | da fare | | [P-F08](#p-f08) | [F08](F08-scegliere-mondi-livelli.md) |
| F09 | Mostrare il livello dei mondi nel contratto e sulla pagina iniziale | F08 | Opus 5.5 `medium` | basso-medio | da fare | | [P-F09](#p-f09) | [F09](F09-livello-dei-mondi.md) |

Stati ammessi: `da fare`, `in corso`, `bloccata`, `completata`. Data di completamento nel formato `YYYY-MM-DD HH:mm`, fuso `Europe/Rome`.

Le stime di consumo sono qualitative: nessuna misura garantisce che una fase rientri in una finestra di cinque ore.

Ordine consigliato: F01, F06, F02, F04, F05, F03, F07, F08, F09. F01, F06 e F08 non dipendono da nulla e si possono anticipare; F08 non tocca il codice.

## Prompt di apertura

Tutti i prompt condividono la stessa chiusura. I percorsi sono relativi alla radice del repo.

### P-F01

```text
Prima di incollare: /model Sonnet 5.5  e  /effort medium

Modello richiesto: Sonnet 5.5, effort medium.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v2/README.md
Fase: docs/plans/portale-v2/F01-chiudere-pubblicazione.md
ID e obiettivo: F01 — Chiudere la pubblicazione del portale.

La fase usa il sito pubblicato e cambia un’impostazione del repo su GitHub: chiedi il via a Marco prima di ogni azione sul sito, sullo zaino o sulla classifica di produzione, e prima di cambiare il branch predefinito.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F02

```text
Prima di incollare: /model Opus 5.5  e  /effort medium

Modello richiesto: Opus 5.5, effort medium.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v2/README.md
Fase: docs/plans/portale-v2/F02-studiare-barra-notifica.md
ID e obiettivo: F02 — Studiare barra comune, stato dello zaino e notifica dell’esito.

Le tavole si disegnano con l’Artifact di tipo «Design» (tool Artifact, quickstart con intent "design"); mostra a Marco le tavole e attendi l’approvazione prima di scrivere la specifica. Nelle tavole usa solo icone RB già nel progetto: le icone nuove restano segnaposto per F04 e F05.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F03

```text
Prima di incollare: /model Opus 5.5  e  /effort medium

Modello richiesto: Opus 5.5, effort medium.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v2/README.md
Fase: docs/plans/portale-v2/F03-studiare-pagine-zaino-classifica.md
ID e obiettivo: F03 — Studiare le pagine Zaino e Classifica.

Le tavole si disegnano con l’Artifact di tipo «Design» (tool Artifact, quickstart con intent "design"); proponi almeno due direzioni per la classifica, attendi la scelta di Marco e la sua approvazione prima di scrivere la specifica. Nelle tavole usa solo icone RB già nel progetto: le icone nuove restano segnaposto per F07.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F04

```text
Prima di incollare: /model Opus 5.5  e  /effort medium

Modello richiesto: Opus 5.5, effort medium.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v2/README.md
Fase: docs/plans/portale-v2/F04-costruire-barra-comune.md
ID e obiettivo: F04 — Costruire la barra comune e il ritorno alla pagina precedente.

Questa fase scrive testi per gli studenti: prima di scrivere leggi .claude/norms/scrittura-didattica.md, a fine stesura applica .claude/norms/scrittura-umana.md. Se .claude/norms non è raggiungibile, fermati.

Le icone si cercano e si creano solo con la skill `icone-rb`, secondo la sezione «Icone» del piano; mostra a Marco le icone nuove e attendi l’approvazione.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F05

```text
Prima di incollare: /model Opus 5.5  e  /effort medium

Modello richiesto: Opus 5.5, effort medium.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v2/README.md
Fase: docs/plans/portale-v2/F05-notificare-esito.md
ID e obiettivo: F05 — Notificare l’esito con i punti e il salvataggio nello zaino.

Questa fase scrive testi per gli studenti: prima di scrivere leggi .claude/norms/scrittura-didattica.md, a fine stesura applica .claude/norms/scrittura-umana.md. Se .claude/norms non è raggiungibile, fermati.

Le icone si cercano e si creano solo con la skill `icone-rb`, secondo la sezione «Icone» del piano; mostra a Marco le icone nuove e attendi l’approvazione.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F06

```text
Prima di incollare: /model Sonnet 5.5  e  /effort high

Modello richiesto: Sonnet 5.5, effort high.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v2/README.md
Fase: docs/plans/portale-v2/F06-sessione-riprendibile.md
ID e obiettivo: F06 — Rendere riprendibile la sessione di esercizi.

Questa fase scrive pochi testi per gli studenti: prima di scriverli leggi .claude/norms/scrittura-didattica.md, a fine stesura applica .claude/norms/scrittura-umana.md. Se .claude/norms non è raggiungibile, fermati. Se servono icone nuove, fermati e dillo a Marco: questa fase gira su Sonnet e le icone si disegnano con Opus.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F07

```text
Prima di incollare: /model Opus 5.5  e  /effort medium

Modello richiesto: Opus 5.5, effort medium.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v2/README.md
Fase: docs/plans/portale-v2/F07-ricostruire-pagine-zaino-classifica.md
ID e obiettivo: F07 — Ricostruire le pagine Zaino e Classifica.

Questa fase scrive testi per gli studenti: prima di scrivere leggi .claude/norms/scrittura-didattica.md, a fine stesura applica .claude/norms/scrittura-umana.md. Se .claude/norms non è raggiungibile, fermati.

Le icone si cercano e si creano solo con la skill `icone-rb`, secondo la sezione «Icone» del piano; mostra a Marco le icone nuove e attendi l’approvazione.

Ogni modifica al servizio della classifica in produzione (deploy, migrazioni D1) richiede il via di Marco.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F08

```text
Prima di incollare: /model Opus 5.5  e  /effort medium

Modello richiesto: Opus 5.5, effort medium.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v2/README.md
Fase: docs/plans/portale-v2/F08-scegliere-mondi-livelli.md
ID e obiettivo: F08 — Scegliere le IP dei nuovi mondi e definirne i livelli.

La scelta delle IP è di Marco: proponi una rosa motivata e attendi la sua scelta prima di scrivere il documento finale. Le ricerche sul web vanno a subagent su Sonnet.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F09

```text
Prima di incollare: /model Opus 5.5  e  /effort medium

Modello richiesto: Opus 5.5, effort medium.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v2/README.md
Fase: docs/plans/portale-v2/F09-livello-dei-mondi.md
ID e obiettivo: F09 — Mostrare il livello dei mondi nel contratto e sulla pagina iniziale.

Questa fase scrive testi per gli studenti: prima di scrivere leggi .claude/norms/scrittura-didattica.md, a fine stesura applica .claude/norms/scrittura-umana.md. Se .claude/norms non è raggiungibile, fermati.

Le icone si cercano e si creano solo con la skill `icone-rb`, secondo la sezione «Icone» del piano; mostra a Marco le icone nuove e attendi l’approvazione.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

## Obiettivo

Il piano nasce dal feedback di Marco del 2026-11-21, dopo alcuni minuti di prova sul sito pubblicato. Porta a termine la pubblicazione rimasta aperta nel piano archiviato e corregge ciò che la prova ha mostrato:

| Punto di Marco | Fasi |
| --- | --- |
| Residuo di F10 del piano archiviato: procedura manuale sul sito, branch predefinito, link dal libro | F01 |
| 1. Vedere a colpo d’occhio se si è collegati allo zaino | F02, F04 |
| 2. Sapere se un esercizio risolto è stato salvato nello zaino | F02, F05 |
| 3. Notifica curata dei punti guadagnati al posto del riquadro verde, con «OK» che si riempie e si chiude da solo in 3–4 secondi, in pausa sotto il puntatore | F02, F05 |
| 4A. Una barra in testa a tutte le pagine del sito | F02, F04 |
| 4B. «Indietro» nelle pagine Zaino e Classifica, verso la pagina di provenienza | F02, F04 |
| 4C. Una sessione di esercizi non si perde lasciando il tema | F06 |
| 5. Pagine Zaino e Classifica ridisegnate con l’Artifact «Design», soprattutto la classifica | F03, F07 |
| 6. Le IP dei prossimi mondi, fino a dieci in tutto, con livelli di difficoltà | F08, F09 |

Fuori dal piano: la costruzione dei nuovi mondi, le CTF, gradi e traguardi (Marco, 2026-11-21).

## Vincoli

Restano quelli del piano archiviato, sezione «Vincoli» di [`archivio/portale-v1/README.md`](../archivio/portale-v1/README.md): sito statico senza dati personali (studenti minorenni), zaino e classifica su Cloudflare Workers Free, solo RB Icons, dialetto SQLite, un tema nuovo non tocca file fuori da `themes/<id>/`, nessun push e nessuna pubblicazione senza il via di Marco, lavoro su `dev`.

In più:

- Il sito è in produzione dal 2026-11-20 su `https://sql.rainbowbits.cloud/`. Una modifica al formato dei progressi in `localStorage` o nello zaino deve leggere i dati già salvati dagli studenti: nessuna migrazione distruttiva.
- Ogni pubblicazione passa dal merge in `main`, che chiede Marco.

## Autonomia concordata

**Bilanciata**, confermata dal piano archiviato (Marco, 2026-11-16): chiedi sulle decisioni strutturali, risolvi da solo i dettagli locali e reversibili. Chiedi sempre prima di cambiare requisiti o ampliare il perimetro.

## Strategia dei modelli

- **Fable escluso**; budget ampio nella finestra di cinque ore e nella settimana, priorità all’approfondimento (Marco, 2026-11-21).
- Opus 5.5 `medium` dove si decide una forma, si disegna con l’Artifact «Design», si scrivono testi per gli studenti o si disegnano icone (F02–F05, F07–F09).
- Sonnet 5.5 dove si esegue una forma già decisa: F01 (`medium`, procedura nota) e F06 (`high`, perché la sessione salvata deve restare coerente con l’azzeramento dei progressi e con lo zaino, e i casi limite vanno coperti con i test).
- In F08 le ricerche sul web vanno a subagent su Sonnet 5.5; il giudizio e la rosa da proporre restano sul modello principale.
- Se una fase non riesce: prima rendi verificabile il lavoro (test, `npm run check:themes`), poi alza l’effort di un livello, poi passa al modello superiore.

## Decisioni condivise

Le decisioni del piano archiviato restano valide: sezione «Decisioni condivise» di [`archivio/portale-v1/README.md`](../archivio/portale-v1/README.md). Qui solo le nuove.

| Decisione | Scelta | Motivo |
| --- | --- | --- |
| Sessione di esercizi | Riprendibile: salvata nel browser per tema, sopravvive a cambi di pagina e ricariche; il tema offre «Riprendi la sessione» o «Abbandonala» (Marco, 2026-11-21) | Oggi la sessione vive nello stato di `ThemePage` e si perde uscendo dal tema (verificato il 2026-11-21) |
| Perimetro sui mondi futuri | Questo piano sceglie le IP e il livello di ogni mondo e porta il livello nel contratto; la costruzione dei mondi va in un piano successivo (Marco, 2026-11-21) | Ogni mondo chiede uno studio della veste e una fase di costruzione: otto mondi sono un piano a sé |
| Mondi in totale | Dieci, cioè otto nuovi oltre a Star Wars e Il Signore degli Anelli: alcuni facili (meno tabelle, query più semplici, consigliati per cominciare), molti intermedi come i due esistenti, uno o due complessi (molte tabelle e moltissime query), candidati alle CTF (Marco, 2026-11-21) | Un percorso che accompagna lo studente dal primo mondo all’ultimo |
| CTF | Ancora rinviate a un piano successivo; F08 annota solo quali mondi le ospiteranno (Marco, 2026-11-21) | Restano legate ai mondi complessi, che questo piano non costruisce |
| Notifica dell’esito | Sostituisce il riquadro verde «Esercizio risolto»; pulsante «OK» che si riempie e chiude la notifica da solo in 3–4 secondi; il puntatore sopra il pulsante ferma riempimento e tempo (Marco, 2026-11-21). L’esito sbagliato resta nel riquadro di oggi | Marco ha chiesto di cambiare solo il riquadro verde |

## Icone

Procedimento e regole sono quelli della sezione «Icone» del piano archiviato ([`archivio/portale-v1/README.md`](../archivio/portale-v1/README.md#icone)): ogni icona passa dalla skill `icone-rb`, le nuove si disegnano su Opus e Marco le approva sul render a 128 px, i commit delle icone vanno nel repo `~/Developer/github/icone` su `dev`. Prima di cercare un’icona controlla il registro del piano archiviato: molte esistono già nel progetto.

### Registro icone

Una riga per icona nuova o con un uso nuovo, compilata dalla fase che la usa.

| Icona | Uso nel portale | Fase | Origine | Esito |
| --- | --- | --- | --- | --- |

## Aggiornamenti di stato

| Data | Nota |
| --- | --- |
| 2026-11-21 | Piano scritto dopo il feedback di Marco sul sito pubblicato; piano `portale-v1` archiviato in `docs/plans/archivio/`. Verificato oggi: HTTPS attivo sul sito (certificato `approved`, `https_enforced: true`), branch predefinito del repo ancora `dev`. Nessuna fase avviata. |
