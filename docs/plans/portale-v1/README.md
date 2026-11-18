# Piano «portale-v1»

| ID | Fase | Dipendenze | Modello / effort | Consumo stimato | Stato | Completata il | Prompt | Dettaglio |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| F01 | Impostare scheletro, contratto del tema e motore SQL | — | Fable 5.2 `medium` · ripiego Opus 5.5 `high` | alto | completata | 2026-11-16 21:01 | [P-F01](#p-f01) | [F01](F01-impostare-scheletro-contratto-motore.md) |
| F02 | Definire formato degli esercizi e verifica delle risposte | F01 | Fable 5.2 `medium` · ripiego Opus 5.5 `high` | medio | completata | 2026-11-16 21:36 | [P-F02](#p-f02) | [F02](F02-definire-esercizi-verifica.md) |
| F03 | Costruire sandbox e guscio delle pagine di un tema | F01 | Opus 5.5 `medium` | medio | completata | 2026-11-17 12:40 | [P-F03](#p-f03) | [F03](F03-costruire-sandbox-guscio-tema.md) |
| F04 | Portare database ed esercizi Star Wars su SQLite | F02 | Sonnet 5.5 `high` | medio-alto | completata | 2026-11-17 13:15 | [P-F04](#p-f04) | [F04](F04-portare-star-wars-su-sqlite.md) |
| F05 | Costruire addestramento, catalogo delle query e progressi | F02, F03, F04 | Opus 5.5 `medium` | alto | completata | 2026-11-17 15:10 | [P-F05](#p-f05) | [F05](F05-costruire-addestramento-catalogo-progressi.md) |
| F06 | Generare il modello logico e disegnare l’ER dichiarativo | F03, F04 | Opus 5.5 `medium` | medio | completata | 2026-11-17 16:19 | [P-F06](#p-f06) | [F06](F06-generare-logico-disegnare-er.md) |
| F07 | Scrivere l’analisi Star Wars e rivedere consegne e suggerimenti | F04, F06 | Opus 5.5 `medium` | medio-alto | completata | 2026-11-17 19:00 | [P-F07](#p-f07) | [F07](F07-scrivere-analisi-rivedere-testi.md) |
| F08 | Costruire il sistema di stile per tema e la veste Star Wars | F03, F11 | Opus 5.5 `medium` | medio | completata | 2026-11-18 09:45 | [P-F08](#p-f08) | [F08](F08-costruire-stile-veste-star-wars.md) |
| F09 | Aggiungere il tema di prova «Il Signore degli Anelli» | F05, F06, F08, F12 | Opus 5.5 `medium` | medio-alto | completata | 2026-11-18 14:58 | [P-F09](#p-f09) | [F09](F09-aggiungere-tema-signore-anelli.md) |
| F10 | Pubblicare su GitHub Pages e collegare il libro | F07, F09, F14, F15, F17, F18, F19, F20, F21, F22 | Sonnet 5.5 `medium` | basso | da fare | | [P-F10](#p-f10) | [F10](F10-pubblicare-github-pages.md) |
| F11 | Studiare la veste grafica con lo strumento di design | F03 | Opus 5.5 `medium` | medio | completata | 2026-11-18 01:24 | [P-F11](#p-f11) | [F11](F11-studiare-veste-strumento-design.md) |
| F12 | Studiare la veste del Signore degli Anelli con lo strumento di design | F08, F11 | Opus 5.5 `medium` | medio | completata | 2026-11-18 13:18 | [P-F12](#p-f12) | [F12](F12-studiare-veste-signore-anelli.md) |
| F13 | Definire regole dei punti e progressi versione 2 | F05 | Sonnet 5.5 `high` | medio | da fare | | [P-F13](#p-f13) | [F13](F13-definire-regole-punti-progressi.md) |
| F14 | Mostrare saldo, costi e punti nell’interfaccia | F13 | Opus 5.5 `medium` | medio | da fare | | [P-F14](#p-f14) | [F14](F14-mostrare-saldo-costi-punti.md) |
| F15 | Collegare i progressi allo zaino di PDB | F13 | Opus 5.5 `high` | alto | da fare | | [P-F15](#p-f15) | [F15](F15-collegare-progressi-zaino-pdb.md) |
| F16 | Costruire il servizio della classifica | F13 | Opus 5.5 `medium` | medio | da fare | | [P-F16](#p-f16) | [F16](F16-costruire-servizio-classifica.md) |
| F17 | Mostrare la classifica nel portale | F14, F15, F16 | Opus 5.5 `medium` | medio | da fare | | [P-F17](#p-f17) | [F17](F17-mostrare-classifica-portale.md) |
| F18 | Animare l’indicatore della sezione e sostituire l’icona della sessione | F09 | Opus 5.5 `medium` | medio | completata | 2026-11-18 15:46 | [P-F18](#p-f18) | [F18](F18-animare-indicatore-sezione-icona-sessione.md) |
| F19 | Trasformare la sezione «Analisi» nella «Traccia» | F09 | Opus 5.5 `medium` | basso-medio | da fare | | [P-F19](#p-f19) | [F19](F19-trasformare-analisi-in-traccia.md) |
| F20 | Disegnare il modello logico in forma UML | F09 | Opus 5.5 `medium` | alto | da fare | | [P-F20](#p-f20) | [F20](F20-disegnare-modello-logico-uml.md) |
| F21 | Arricchire i dati del Signore degli Anelli e portarne gli esercizi a circa 150 | F09 | Opus 5.5 `medium` | alto | da fare | | [P-F21](#p-f21) | [F21](F21-ampliare-esercizi-signore-anelli.md) |
| F22 | Portare gli esercizi di Star Wars a circa 150 | F07 | Opus 5.5 `medium` | alto | da fare | | [P-F22](#p-f22) | [F22](F22-ampliare-esercizi-star-wars.md) |

Stati ammessi: `da fare`, `in corso`, `bloccata`, `completata`. Data di completamento nel formato `YYYY-MM-DD HH:mm`, fuso `Europe/Rome`.

Le stime di consumo sono qualitative: nessuna misura garantisce che una fase rientri in una finestra di cinque ore.

## Prompt di apertura

Tutti i prompt condividono la stessa chiusura. I percorsi sono relativi alla radice del repo.

### P-F01

```text
Prima di incollare: /model Fable 5.2  e  /effort medium

Modello richiesto: Fable 5.2, effort medium.
Ripiego se Fable non è disponibile: Opus 5.5, effort high.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v1/README.md
Fase: docs/plans/portale-v1/F01-impostare-scheletro-contratto-motore.md
ID e obiettivo: F01 — Impostare scheletro, contratto del tema e motore SQL.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F02

```text
Prima di incollare: /model Fable 5.2  e  /effort medium

Modello richiesto: Fable 5.2, effort medium.
Ripiego se Fable non è disponibile: Opus 5.5, effort high.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v1/README.md
Fase: docs/plans/portale-v1/F02-definire-esercizi-verifica.md
ID e obiettivo: F02 — Definire formato degli esercizi e verifica delle risposte.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F03

```text
Prima di incollare: /model Opus 5.5  e  /effort medium

Modello richiesto: Opus 5.5, effort medium.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v1/README.md
Fase: docs/plans/portale-v1/F03-costruire-sandbox-guscio-tema.md
ID e obiettivo: F03 — Costruire sandbox e guscio delle pagine di un tema.

Le icone si cercano e si creano solo con la skill `icone-rb`, secondo la sezione «Icone» del piano; mostra a Marco le icone nuove e attendi l’approvazione.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F04

```text
Prima di incollare: /model Sonnet 5.5  e  /effort high

Modello richiesto: Sonnet 5.5, effort high.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v1/README.md
Fase: docs/plans/portale-v1/F04-portare-star-wars-su-sqlite.md
ID e obiettivo: F04 — Portare database ed esercizi Star Wars su SQLite.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F05

```text
Prima di incollare: /model Opus 5.5  e  /effort medium

Modello richiesto: Opus 5.5, effort medium.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v1/README.md
Fase: docs/plans/portale-v1/F05-costruire-addestramento-catalogo-progressi.md
ID e obiettivo: F05 — Costruire addestramento, catalogo delle query e progressi.

Le icone si cercano e si creano solo con la skill `icone-rb`, secondo la sezione «Icone» del piano; mostra a Marco le icone nuove e attendi l’approvazione.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F06

```text
Prima di incollare: /model Opus 5.5  e  /effort medium

Modello richiesto: Opus 5.5, effort medium.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v1/README.md
Fase: docs/plans/portale-v1/F06-generare-logico-disegnare-er.md
ID e obiettivo: F06 — Generare il modello logico e disegnare l’ER dichiarativo.

Le icone si cercano e si creano solo con la skill `icone-rb`, secondo la sezione «Icone» del piano; mostra a Marco le icone nuove e attendi l’approvazione.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F07

```text
Prima di incollare: /model Opus 5.5  e  /effort medium

Modello richiesto: Opus 5.5, effort medium.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v1/README.md
Fase: docs/plans/portale-v1/F07-scrivere-analisi-rivedere-testi.md
ID e obiettivo: F07 — Scrivere l’analisi Star Wars e rivedere consegne e suggerimenti.

Questa fase scrive testi per gli studenti: prima di scrivere leggi .claude/norms/scrittura-didattica.md, a fine stesura applica .claude/norms/scrittura-umana.md. Se .claude/norms non è raggiungibile, fermati.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F08

```text
Prima di incollare: /model Opus 5.5  e  /effort medium

Modello richiesto: Opus 5.5, effort medium.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v1/README.md
Fase: docs/plans/portale-v1/F08-costruire-stile-veste-star-wars.md
ID e obiettivo: F08 — Costruire il sistema di stile per tema e la veste Star Wars.

Le icone si cercano e si creano solo con la skill `icone-rb`, secondo la sezione «Icone» del piano; mostra a Marco le icone nuove e attendi l’approvazione.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F09

```text
Prima di incollare: /model Opus 5.5  e  /effort medium

Modello richiesto: Opus 5.5, effort medium.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v1/README.md
Fase: docs/plans/portale-v1/F09-aggiungere-tema-signore-anelli.md
ID e obiettivo: F09 — Aggiungere il tema di prova «Il Signore degli Anelli».

Questa fase scrive testi per gli studenti: prima di scrivere leggi .claude/norms/scrittura-didattica.md, a fine stesura applica .claude/norms/scrittura-umana.md. Se .claude/norms non è raggiungibile, fermati.

Le icone si cercano e si creano solo con la skill `icone-rb`, secondo la sezione «Icone» del piano; mostra a Marco le icone nuove e attendi l’approvazione.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F10

```text
Prima di incollare: /model Sonnet 5.5  e  /effort medium

Modello richiesto: Sonnet 5.5, effort medium.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v1/README.md
Fase: docs/plans/portale-v1/F10-pubblicare-github-pages.md
ID e obiettivo: F10 — Pubblicare su GitHub Pages e collegare il libro.

Questa fase crea un remote, esegue push e pubblica: chiedi il via a Marco prima di ciascuna di queste azioni.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F11

```text
Prima di incollare: /model Opus 5.5  e  /effort medium

Modello richiesto: Opus 5.5, effort medium.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v1/README.md
Fase: docs/plans/portale-v1/F11-studiare-veste-strumento-design.md
ID e obiettivo: F11 — Studiare la veste grafica con lo strumento di design.

Le tavole si disegnano con l’Artifact di tipo «Design» (tool Artifact, quickstart con intent "design"); mostra a Marco le tavole e attendi l’approvazione prima di scrivere la specifica. Nelle tavole usa solo icone RB già nel progetto: le icone tematiche restano segnaposto per F08.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F12

```text
Prima di incollare: /model Opus 5.5  e  /effort medium

Modello richiesto: Opus 5.5, effort medium.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v1/README.md
Fase: docs/plans/portale-v1/F12-studiare-veste-signore-anelli.md
ID e obiettivo: F12 — Studiare la veste del Signore degli Anelli con lo strumento di design.

Le tavole si disegnano con l’Artifact di tipo «Design» (tool Artifact, quickstart con intent "design"); proponi due direzioni, attendi la scelta di Marco e la sua approvazione prima di scrivere la specifica. Nelle tavole usa solo icone RB già nel progetto: le icone tematiche restano segnaposto per F09.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F13

```text
Prima di incollare: /model Sonnet 5.5  e  /effort high

Modello richiesto: Sonnet 5.5, effort high.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v1/README.md
Fase: docs/plans/portale-v1/F13-definire-regole-punti-progressi.md
ID e obiettivo: F13 — Definire regole dei punti e progressi versione 2.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F14

```text
Prima di incollare: /model Opus 5.5  e  /effort medium

Modello richiesto: Opus 5.5, effort medium.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v1/README.md
Fase: docs/plans/portale-v1/F14-mostrare-saldo-costi-punti.md
ID e obiettivo: F14 — Mostrare saldo, costi e punti nell’interfaccia.

Le icone si cercano e si creano solo con la skill `icone-rb`, secondo la sezione «Icone» del piano; mostra a Marco le icone nuove e attendi l’approvazione.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F15

```text
Prima di incollare: /model Opus 5.5  e  /effort high

Modello richiesto: Opus 5.5, effort high.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v1/README.md
Fase: docs/plans/portale-v1/F15-collegare-progressi-zaino-pdb.md
ID e obiettivo: F15 — Collegare i progressi allo zaino di PDB.

Questa fase modifica anche il repo ~/Developer/github/python-doesnt-byte (solo CORS del Worker dello zaino ed eventuale privacy policy, sul suo branch dev): chiedi il via a Marco prima di ogni commit e di ogni deploy in quel repo.

Le icone si cercano e si creano solo con la skill `icone-rb`, secondo la sezione «Icone» del piano; mostra a Marco le icone nuove e attendi l’approvazione.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F16

```text
Prima di incollare: /model Opus 5.5  e  /effort medium

Modello richiesto: Opus 5.5, effort medium.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v1/README.md
Fase: docs/plans/portale-v1/F16-costruire-servizio-classifica.md
ID e obiettivo: F16 — Costruire il servizio della classifica.

Creazione del database D1, dominio e deploy del Worker richiedono il via di Marco; mostragli le liste dei nomi e attendi l’approvazione.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F17

```text
Prima di incollare: /model Opus 5.5  e  /effort medium

Modello richiesto: Opus 5.5, effort medium.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v1/README.md
Fase: docs/plans/portale-v1/F17-mostrare-classifica-portale.md
ID e obiettivo: F17 — Mostrare la classifica nel portale.

Questa fase scrive testi per gli studenti: prima di scrivere leggi .claude/norms/scrittura-didattica.md, a fine stesura applica .claude/norms/scrittura-umana.md. Se .claude/norms non è raggiungibile, fermati.

Le icone si cercano e si creano solo con la skill `icone-rb`, secondo la sezione «Icone» del piano; mostra a Marco le icone nuove e attendi l’approvazione.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F18

```text
Prima di incollare: /model Opus 5.5  e  /effort medium

Modello richiesto: Opus 5.5, effort medium.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v1/README.md
Fase: docs/plans/portale-v1/F18-animare-indicatore-sezione-icona-sessione.md
ID e obiettivo: F18 — Animare l’indicatore della sezione e sostituire l’icona della sessione.

Le icone si cercano e si creano solo con la skill `icone-rb`, secondo la sezione «Icone» del piano; mostra a Marco le icone nuove e attendi l’approvazione.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F19

```text
Prima di incollare: /model Opus 5.5  e  /effort medium

Modello richiesto: Opus 5.5, effort medium.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v1/README.md
Fase: docs/plans/portale-v1/F19-trasformare-analisi-in-traccia.md
ID e obiettivo: F19 — Trasformare la sezione «Analisi» nella «Traccia».

Questa fase scrive testi per gli studenti: prima di scrivere leggi .claude/norms/scrittura-didattica.md, a fine stesura applica .claude/norms/scrittura-umana.md. Se .claude/norms non è raggiungibile, fermati.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F20

```text
Prima di incollare: /model Opus 5.5  e  /effort medium

Modello richiesto: Opus 5.5, effort medium.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v1/README.md
Fase: docs/plans/portale-v1/F20-disegnare-modello-logico-uml.md
ID e obiettivo: F20 — Disegnare il modello logico in forma UML.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F21

```text
Prima di incollare: /model Opus 5.5  e  /effort medium

Modello richiesto: Opus 5.5, effort medium.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v1/README.md
Fase: docs/plans/portale-v1/F21-ampliare-esercizi-signore-anelli.md
ID e obiettivo: F21 — Arricchire i dati del Signore degli Anelli e portarne gli esercizi a circa 150.

Questa fase scrive testi per gli studenti: prima di scrivere leggi .claude/norms/scrittura-didattica.md, a fine stesura applica .claude/norms/scrittura-umana.md. Se .claude/norms non è raggiungibile, fermati.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

### P-F22

```text
Prima di incollare: /model Opus 5.5  e  /effort medium

Modello richiesto: Opus 5.5, effort medium.
Controllo iniziale: confronta il modello su cui giri con quello richiesto. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro. L’effort, se non lo vedi, dichiaralo non verificabile e procedi.

Piano: docs/plans/portale-v1/README.md
Fase: docs/plans/portale-v1/F22-ampliare-esercizi-star-wars.md
ID e obiettivo: F22 — Portare gli esercizi di Star Wars a circa 150.

Questa fase scrive testi per gli studenti: prima di scrivere leggi .claude/norms/scrittura-didattica.md, a fine stesura applica .claude/norms/scrittura-umana.md. Se .claude/norms non è raggiungibile, fermati.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit.
```

## Obiettivo

Pubblicare un portale statico di addestramento a SQL con la piattaforma comune, il tema Star Wars completo e un secondo tema ridotto, «Il Signore degli Anelli», che dimostra che un tema si aggiunge senza toccare il codice comune. Gli altri due temi richiesti da `AGENTS.md` appartengono a piani successivi.

Dal 2026-11-17 il piano comprende anche il sistema a punti, il salvataggio dei progressi nello zaino di PDB e una classifica pubblica (F13–F17), da completare prima della pubblicazione.

Per ogni tema lo studente trova sei sezioni: sandbox, addestramento, tutte le query, analisi, schema ER, modello logico.

## Vincoli

- Sito statico, senza account né dati personali (gli studenti sono minori). Due servizi esterni, entrambi su Cloudflare Workers Free a costo zero (Marco, 2026-11-17): lo zaino di PDB, cifrato nel browser e illeggibile dal server; la classifica, facoltativa, con un nome casuale e i soli punti. Il portale funziona anche se i due servizi non rispondono.
- Repo e sito pubblici: tutte le icone sono RB Icons, create o scelte con la skill `icone-rb` (vedi «Icone» più sotto); niente Font Awesome né Phosphor. Delle opere protette si usano nomi e ambientazioni, non immagini né font ufficiali; loghi, stemmi ed emblemi entrano solo come icone RB stilizzate, non identiche agli originali.
- Il dialetto SQL è quello del libro: SQLite.
- Aggiungere un tema non modifica file fuori da `themes/<id>/`.
- Nessun push e nessuna pubblicazione senza il via di Marco. Lavoro su `dev`.

## Autonomia concordata

**Bilanciata** (Marco, 2026-11-16): chiedi sulle decisioni strutturali, risolvi da solo i dettagli locali e reversibili. Chiedi sempre prima di cambiare requisiti o ampliare il perimetro.

## Strategia dei modelli

- Priorità all’**approfondimento**; budget dichiarato ampio nella finestra di cinque ore e nella settimana (Marco, 2026-11-16).
- **Fable 5.2 incluso a tempo:** disponibile fino al **2026-11-17 08:59** (`Europe/Rome`). Assegnato a F01 e F02, da aprire in sequenza entro la scadenza. Se una delle due cade dopo, gira su Opus 5.5 `high`: annotalo nel passaggio di consegne.
- Opus 5.5 `medium` dove si decide una forma o si scrivono testi per gli studenti (F03, F05–F09).
- Sonnet 5.5 dove si esegue una forma già decisa (F04, F10, F13). F13 parte da `high` perché ogni regola dei punti ha casi limite da coprire con i test.
- Opus 5.5 `high` per F15: sincronizzazione fra dispositivi e cifratura, dentro un servizio già in produzione che custodisce le note degli studenti del libro. F04 parte da `high` perché ogni query va giudicata sul risultato, non solo eseguita.
- F18–F22, aggiunte il 2026-11-18 dal feedback di Marco su F09: **Fable escluso** (Marco, 2026-11-18); tutte su Opus 5.5 `medium`, F21 e F22 per scelta di Marco perché scrivono testi per gli studenti. F20 sale a `high` se la disposizione delle tabelle non converge.
- Se una fase non riesce: prima rendi verificabile il lavoro (test, `npm run check:themes`), poi alza l’effort di un livello, poi passa al modello superiore.

## Decisioni condivise

Prese da Marco il 2026-11-16, salvo dove indicato.

| Decisione | Scelta | Motivo |
| --- | --- | --- |
| Motore SQL | SQLite via `sql.js` | Una query che funziona nel libro funziona nel portale |
| Architettura | Sito statico autonomo su GitHub Pages, link reciproci con il libro | Nessun server da mantenere |
| Visibilità | Pubblica | Come il libro |
| Framework | React + Vite + TypeScript, CSS con variabili per tema | Stack del prototipo, stessa famiglia del sito del libro |
| Formato del tema | Cartella `themes/<id>/` autoscoperta al build | Requisito 1 e 4 di `AGENTS.md` |
| Modello logico | Generato dallo schema SQL del tema | Non può divergere dal database |
| Schema ER | File dichiarativo del tema, disegnato da un componente comune | Lo schema SQL non contiene nomi delle associazioni né scelte concettuali |
| Primo tema | Star Wars, con i 105 esercizi del prototipo riverificati su SQLite | Contenuti già esistenti |
| Tema di prova | Il Signore degli Anelli, in versione ridotta | Prova di modularità su un dominio nuovo |
| Addestramento | Percorso per capitolo del libro (6–9) e difficoltà, più sessioni configurabili | Segue il libro e conserva il generatore del prototipo |
| Progressi | `localStorage`, per tema; dal 2026-11-17 anche nello zaino (vedi «Salvataggio dei progressi») | Nessun dato personale |
| Tutor AI | Escluso | Richiede server e chiavi |
| Sandbox | Accetta qualunque istruzione, con «Ripristina database» (proposta di Claude, approvata con il piano) | Ogni studente ha un database in memoria proprio |
| Routing | Con hash, `#/<tema>/<sezione>` (proposta di Claude, approvata con il piano) | GitHub Pages non riscrive gli URL |
| Manifest del tema | Solo `id`, `title`, `description`; gli altri file si trovano per nome fisso (Marco, 2026-11-16, in F01) | Un tema nuovo non ripete codice di caricamento |
| Formato degli esercizi | File TypeScript `themes/<id>/esercizi.ts` (Claude, in F02) | Controllato dal compilatore; le query su più righe restano leggibili, cosa che JSON non consente |
| Confronto delle risposte | Nomi e ordine delle colonne non contano; contano numero di colonne e valori (Marco, 2026-11-16, in F02) | Come nel libro; le consegne non devono prescrivere alias |
| Riuso dal libro | Copia e adattamento, senza dipendenza fra i repo (proposta di Claude, approvata con il piano) | Stesso autore, repo pubblico |
| Icone | Solo RB Icons, tutte passate dalla skill `icone-rb`; il progetto è anche collaudo della skill (Marco, 2026-11-17) | Repo pubblico: Font Awesome Pro non ammesso; Phosphor non si usa più |
| Studio della veste | Ogni tema ha una propria fase di studio della veste con l’Artifact «Design», prima della fase che lo costruisce; la specifica approvata sta in `docs/design/<id>.md`, la veste neutra in `docs/design/neutra.md` (Marco, 2026-11-17) | L’aspetto di un tema si decide sulle tavole, con Marco, prima del codice |
| Uso delle icone nel codice | File in `src/assets/icons/` (comuni) o `themes/<id>/icone/`, incorporati inline dal componente `Icon` (`src/icons/`); comuni per `name`, di un tema per `svg` (Claude, in F03) | Inline ereditano il colore del testo e le variabili `rb-*`; un’icona comune nuova non richiede codice |
| Editor SQL | CodeMirror 6 con `@codemirror/lang-sql`, dialetto SQLite (Claude, in F03) | Evidenziazione, completamento dallo schema e scorciatoie già pronti; nessuna alternativa più semplice li dà tutti |
| Formato di `er.ts` | Le props del componente `DiagrammaER` del libro, con i nomi in italiano (`entita`, `associazioni`, `col`, `riga`, `card`…), più `tabella` su entità e associazioni per il controllo di coerenza; tipo `ErDiagram` in `src/er/types.ts` (Claude, in F06) | Un diagramma passa dal libro al portale senza riscriverlo |
| Tratto e carattere dell’ER | Come il libro: rough.js (nuova dipendenza `roughjs`) ed Excalifont, licenza OFL, copiato con il testo della licenza in `src/er/` (Marco, 2026-11-17, in F06) | Lo studente ritrova i diagrammi del libro |
| Notazione dell’ER | `id` è l’identificatore di ogni entità; le colonne chiave esterna non sono attributi ma associazioni; gli attributi opzionali non sono segnati con `(0,1)`. Un diagramma più largo della pagina scorre dentro il suo riquadro, con il corpo minimo di 11 px del libro (Marco, 2026-11-17, in F06) | Leggibilità; l’opzionalità si vede nel modello logico |
| Modello logico | Letto dal database iniziale del tema (le stesse tabelle che la sandbox legge all’apertura), nella notazione del libro: nome in grassetto, chiave primaria sottolineata, chiave esterna in corsivo, elenco «`a.b` si riferisce a `c.d`»; icone `key` e `link` accanto, con titolo per i lettori di schermo. Vista del codice con i `CREATE TABLE` di `schema.sql` (Claude, in F06) | Nessun file scritto a mano; notazione già nota allo studente |
| Soluzione e aiuti | Superata dal «Sistema a punti» a partire da F13. Regola provvisoria: suggerimenti liberi, uno alla volta; soluzione dopo l’ultimo suggerimento o a esercizio risolto. Un solo punto del codice decide (`canRevealHint`, `canRevealSolution` in `src/training/exercises.ts`) e i progressi salvano suggerimenti aperti e soluzioni viste (Marco, 2026-11-17, in F05) | Marco vuole un sistema a punti (si guadagnano risolvendo, più per gli esercizi difficili; si spendono in suggerimenti e soluzione), da progettare in fasi dedicate dopo F05 |
| Filtro per parole chiave nelle sessioni | Entra un esercizio che usa almeno una delle parole chiave scelte, come nel catalogo (Marco, 2026-11-17, in F05) | Ciò che lo studente conosce lo limita già il filtro per capitolo |
| Indirizzi dell’addestramento | `#/<tema>/addestramento/<id>` per un esercizio, `#/<tema>/addestramento/sessione` per la sessione; l’`id` `sessione` è riservato e `check:themes` lo respinge (Claude, in F05) | Un esercizio si apre dal catalogo e si condivide con un link |
| Sistema a punti | Premio per difficoltà 10 / 20 / 30; suggerimento 3 / 5 / 8 (circa un quarto del premio); soluzione 20 / 40 / 60 (il doppio: estrema ratio), acquistabile solo dopo tutti i suggerimenti. Saldo per tema, parte da zero; gratuito solo il primo aiuto del tema. Premio solo alla prima risoluzione; zero se la soluzione è stata vista prima. Regole complete nel § 2 di F13 (Marco, 2026-11-17) | L’aiuto ha un prezzo: lo studente prova prima di chiedere |
| Migrazione dei progressi | Nessuna: la versione 2 sostituisce la 1 (Marco, 2026-11-17) | Il portale non è pubblicato; per questo F10 dipende dalle fasi dei punti e dello zaino |
| Formato di `analisi.md` | Markdown minimo (titoli, paragrafi, elenchi, corsivo, grassetto) reso da `src/analysis/markdown.ts`, senza dipendenze; i titoli del file scendono di un livello sotto il titolo della sezione (Claude, in F07) | Basta per un testo di dominio; nessuna libreria per un sottoinsieme così piccolo |
| Difetti dei dati di Star Wars | Aggiunto il pianeta Yavin 4, dove ora si svolge la battaglia di Yavin; gli anni restano contati a ritroso da Yavin, negativi dopo, e l’analisi lo spiega; ex-088 riscritto sui pianeti, che possono non avere personaggi (Marco, 2026-11-17, in F07) | Dati fedeli all’ambientazione senza cambiare lo schema; un esercizio di `LEFT JOIN` che la distingue davvero da `JOIN` |
| Salvataggio dei progressi | `localStorage` più lo **stesso zaino di PDB**, sezione `sql-academy`, con lo stesso codice dello studente (Marco, 2026-11-17) | Gli studenti ritrovano a casa il lavoro del laboratorio; lo zaino è nato a sezioni e conserva quelle che un sito non conosce |
| Classifica | Generale e per tema, pubblica; partecipazione facoltativa, spenta all’inizio; nome assegnato a caso dal sistema, non modificabile; mostra i primi 50 e la propria posizione; Worker e D1 propri del portale; difesa con controlli di plausibilità sul server (Marco, 2026-11-17) | Lo zaino cifrato non può alimentarla; la plausibilità costa zero sul piano gratuito, mentre la verifica di ogni risposta sul server rischia il limite di calcolo per richiesta. Restano possibili le soluzioni lette nel codice del sito e la copia fra compagni: la classifica è un gioco, non un voto |
| Seguiti, fuori da questo piano | **CTF**: query che trovano flag nascoste nei dati, con difficoltà, premi e suggerimenti a pagamento, **senza soluzione** (se non si trova, resta irrisolta); entreranno nella stessa classifica. **Gradi e traguardi** sui punti. Entrambi in un piano successivo (Marco, 2026-11-17) | Prima si pubblicano punti, zaino e classifica; F13 e F16 tengono già conto delle CTF |
| Veste della pagina iniziale | Le locandine dei temi lanciate a caso su un tavolo, da trascinare; un clic gira la locandina sul retro, la scheda del tema con dati calcolati e «Entra»; a 375 px un mazzo da sfogliare. Specifica in `docs/design/neutra.md` (Marco, 2026-11-18, in F11) | Marco ha scartato la pagina-risultato come banale e ha proposto lui il tavolo; le direzioni scartate sono nella specifica |
| Schemi chiaro e scuro di un tema | Un tema può dichiarare due schemi, con un selettore nell’intestazione del guscio; Star Wars: chiaro «X-wing», scuro «Morte Nera», con gli emblemi dell’Alleanza e dell’Impero nel selettore. Alla prima visita segue `prefers-color-scheme`, poi la scelta si conserva nel browser per tema (Marco, 2026-11-18, in F11; i dettagli sono proposta di Claude) | Marco vuole un tema chiaro e uno scuro; tocca il contratto del tema, quindi lo fissa F08 |
| Veste di un tema | Il manifest aggiunge `motto` (fronte della locandina), `icons` e `schemes` (icone per schema: `emblem`, `empty`; `solved` comune). File facoltativi del tema: `stile.css` (radice `.theme[data-theme-id="<id>"]`), `locandina.css` (radice `.poster[data-theme-id="<id>"]`), `icone/`, `fonts/`; `check:themes` controlla che ogni regola resti confinata. Le variabili ridefinibili sono in `src/styles.css`, l’unico file con colori scritti a mano (Marco e Claude, 2026-11-18, in F08) | Un tema nuovo si veste senza toccare i componenti comuni |
| Numeri della scheda di un tema | Tabelle, righe ed esercizi per difficoltà e capitolo calcolati al build dal plugin `scripts/themeStatsPlugin.ts` (modulo `virtual:theme-stats`) (Marco, 2026-11-18, in F08) | La pagina iniziale non scarica SQLite e i numeri non si scrivono a mano |
| Caratteri | Serviti dal progetto, TTF originali di `google/fonts` con il loro `OFL.txt`: comuni in `src/assets/fonts/`, di un tema in `themes/<id>/fonts/` (Marco, 2026-11-18, in F08) | Nessuna richiesta a servizi esterni; licenze accanto ai file |
| Veste Il Signore degli Anelli | Due schemi: chiaro «la mappa della Contea» (carta, inchiostro seppia, verde della Contea, percorso rosso tra le sezioni) e scuro «le porte di Moria» (pietra ardesia, *ithildin*, pulsante d’argento); emblemi `wizard-staff` e `eye-of-sauron`, sandbox con `one-ring`; locandina chiara. Specifica in `docs/design/lotr.md` (Marco, 2026-11-18, in F12) | Marco ha approvato entrambe le direzioni proposte, una per schema |
| Contrasto delle palette | `node docs/design/contrasto.mjs [palette]` misura ogni coppia delle specifiche ed esce con errore sotto 4,5:1 (testo) o 3:1 (bordi e icone) (Claude, in F11) | F08 e F12 devono misurare con uno strumento, non a occhio |

### Icone

Marco, 2026-11-17: questo progetto serve anche da collaudo della skill `icone-rb` (nominata «rb-icons» a voce; nella sessione la skill si chiama `icone-rb`). Ogni icona del portale passa dalla skill, senza eccezioni: nessuna icona scritta a mano fuori dal procedimento, nessun emoji o carattere Unicode usato come pittogramma.

Fonte: `Icone: rb-icons` è registrata in `AGENTS.md`, quindi la skill non chiede la fonte.

**Icone tematiche** (Marco, 2026-11-17): le icone create possono essere molto legate al tema e rappresentarne oggetti, luoghi e personaggi tipici (per Star Wars, per esempio, una spada laser o un caccia stellare; per Il Signore degli Anelli un anello o una spada). Sono ammessi anche loghi, stemmi ed emblemi dell’opera (Marco, 2026-11-17), purché stilizzati nello stile RB e non identici agli originali, come fa Font Awesome: se ne riprende la struttura riconoscibile, semplificata secondo `STILE.md`, senza ricalcarne i tracciati. Un’icona tematica appartiene a un solo tema e sta in `themes/<id>/icone/`.

Procedimento per ogni fase che ha interfaccia (F03, F05, F06, F08, F09), eseguito **prima** di scrivere i componenti:

1. Elenca le icone che la fase richiede (navigazione, azioni, esiti, stati, decorazioni) con il significato di ciascuna.
2. Per ognuna cerca nel catalogo con `python3 tools/search.py`, più sinonimi in italiano e in inglese, come prescrive la skill. Se esiste un’icona adatta, usala.
3. Per le mancanti segui il passo 3b della skill (clean room, `STILE.md`, validazione, galleria). Il modello per disegnare è Opus: le cinque fasi con interfaccia girano già su Opus 5.5; se una fase gira su un modello più leggero, **fermati** e dillo a Marco prima di disegnare.
4. Mostra a Marco il render a 128 px delle icone **nuove** e attendi l’approvazione. Il commit di ciascuna va nel repository `~/Developer/github/icone`, sul branch `dev`, con le sole modifiche dell’icona; nessun push senza il via di Marco. Questi commit non entrano nel commit di chiusura della fase del portale.
5. Copia nel progetto solo le icone usate: quelle comuni in `src/assets/icons/<nome>.svg`, quelle che appartengono a un solo tema in `themes/<id>/icone/<nome>.svg` (un tema porta con sé le proprie icone: F09 non tocca file comuni). Uso inline o come file, secondo il passo 4 della skill; icone decorative con `aria-hidden="true"`, le altre con `role="img"` e `<title>`.
6. Compila la tabella «Registro icone» qui sotto e riporta nel passaggio di consegne della fase i problemi trovati nella skill (ricerca che non trova, `STILE.md` ambiguo, strumenti che falliscono, icone respinte da Marco e perché): è l’esito del collaudo.

Se la libreria o la skill non sono raggiungibili, fermati e dillo a Marco: non sostituire con icone di altre librerie.

#### Registro icone

Una riga per icona, compilata dalla fase che la usa. «Origine» è `catalogo` (esisteva già) o `creata` (disegnata in questa fase, con il modello che l’ha disegnata).

| Icona | Uso nel portale | Fase | Origine | Esito |
| --- | --- | --- | --- | --- |
| `terminal-window` | sezione Sandbox | F03 | catalogo | usata |
| `bullseye` | sezione Addestramento | F03 | creata (Opus 5.5) | approvata |
| `list` | sezione Tutte le query | F03 | creata (Opus 5.5) | approvata |
| `file-lines` | sezione Analisi | F03 | creata (Opus 5.5) | approvata |
| `entity-relationship` | sezione Schema ER | F03 | creata (Opus 5.5) | approvata la seconda di due varianti; la prima versione, verticale, non convinceva Marco |
| `table` | sezione Modello logico | F03 | creata (Opus 5.5) | approvata |
| `circle-play` | pulsante Esegui | F03 | creata (Opus 5.5) | approvata |
| `circle-arrow-rotate-left` | pulsante Ripristina database, avviso di ripristino | F03 | creata (Opus 5.5) | approvata |
| `circle-xmark` | errore di SQLite, database che non si apre | F03 | creata (Opus 5.5) | approvata |
| `triangle-exclamation` | avviso di query interrotta dal watchdog | F03 | creata (Opus 5.5) | approvata |
| `circle-arrow-left` | ritorno all’elenco dei temi | F03 | creata (Opus 5.5) | approvata |
| `circle-check` | pulsante Verifica, esercizio risolto, esito corretto | F05 | creata (Opus 5.5) | approvata |
| `circle` | esercizio da fare | F05 | creata (Opus 5.5) | approvata; monotono (R3.9) |
| `circle-arrow-right` | prossimo esercizio | F05 | creata (Opus 5.5) | approvata |
| `lightbulb` | suggerimenti | F05 | creata (Opus 5.5) | approvata la quarta variante: Marco ha chiesto un filamento, la «M» e l’arco ∩ non convincevano, i pallini pieni non erano ciò che intendeva; tenuto il filamento a due riccioli del suo schizzo |
| `key` | soluzione | F05 | catalogo | usata |
| `dice` | avvio di una sessione casuale | F05 | creata (Opus 5.5) | approvata |
| `magnifying-glass` | ricerca nel catalogo | F05 | creata (Opus 5.5) | approvata |
| `flag` | riepilogo della sessione | F05 | creata (Opus 5.5) | approvata |
| `trash-can` | azzeramento dei progressi | F05 | creata (Opus 5.5) | approvata |
| `key` | chiave primaria nel modello logico | F06 | catalogo | usata (anche per «soluzione», F05) |
| `link` | chiave esterna nel modello logico | F06 | creata (Opus 5.5) | approvata |
| `code` | vista «Codice SQL» del modello logico | F06 | creata (Opus 5.5) | approvata la terza versione: le parentesi angolari con barra ricordavano i tag HTML; Marco ha chiesto una finestra di editor con righe rientrate e l’ultima riga di due parole |
| `copy` | copia del codice SQL | F06 | creata (Opus 5.5) | approvata |
| `rebel-alliance` | Star Wars, emblema dello schema chiaro | F08 | creata (Opus 5.5) | approvata alla terza versione; eccezione alla regola clean room autorizzata da Marco (dettaglio di F08) |
| `galactic-empire` | Star Wars, emblema dello schema scuro | F08 | creata (Opus 5.5) | approvata alla terza versione; tolte le tacche sulla corona (R5.8, R1.4) |
| `lightsabers-crossed` | Star Wars, esercizio risolto | F08 | creata (Opus 5.5) | approvata alla terza versione; una spada sola restava sotto la copertura minima (R1.6) |
| `x-wing` | Star Wars, stati vuoti nello schema chiaro | F08 | creata (Opus 5.5) | approvata alla terza versione |
| `battle-station` | Star Wars, stati vuoti nello schema scuro | F08 | creata (Opus 5.5) | approvata alla terza versione |
| `one-ring` | Il Signore degli Anelli, sezione Sandbox (voce e titolo, con `icons.sections`, F09) | F12 | creata (Opus 5.5) | approvata alla terza versione: Marco ha chiesto una catenella doppia a parabola invece della maglia infilata |
| `wizard-staff` | Il Signore degli Anelli, emblema dello schema chiaro (collegata in F09) | F12 | creata (Opus 5.5) | approvata la seconda versione, disegnata da una foto di riferimento di Marco: la prima sembrava una bacchetta |
| `eye-of-sauron` | Il Signore degli Anelli, emblema dello schema scuro (collegata in F09) | F12 | creata (Opus 5.5) | approvata la terza versione, con contorno a fiamme: la seconda, a raggi, sembrava un ragno |
| `hobbit-door` | Il Signore degli Anelli, stati vuoti nello schema chiaro (F09) | F12 | creata (Opus 5.5) | approvata; nata come emblema, sostituita nel selettore da `wizard-staff` |
| `durin-door` | Il Signore degli Anelli, stati vuoti nello schema scuro (F09) | F12 | creata (Opus 5.5) | approvata; nata come emblema, sostituita nel selettore da `eye-of-sauron` |
| `magic-wand` | nessuno | F12 | creata (Opus 5.5) | primo `wizard-staff`, rinominato; Marco l’ha tenuta nel catalogo senza usarla |
| `rocket` | pulsanti che avviano una sessione, icona comune al posto di `dice` | F18 | creata (Opus 5.5) | approvata; Marco ha chiesto in più un’icona di sessione per ogni tema (`icons.session`) |
| `x-wing` | Star Wars, pulsanti della sessione nello schema chiaro | F18 | catalogo | usata (anche per gli stati vuoti, F08) |
| `tie-fighter` | Star Wars, pulsanti della sessione nello schema scuro | F18 | creata (Opus 5.5) | approvata |
| `hobbit-backpack` | Il Signore degli Anelli, pulsanti della sessione | F18 | creata (Opus 5.5) | approvata la seconda versione: la prima, con le cinghie che uscivano dal rotolo sopra una scatola, sembrava «il marchingegno per far esplodere la dinamite a distanza» |

### Struttura di un tema

Nomi fissati in F01 (2026-11-16). Il contratto è in `src/themes/contract.ts`; il registro `src/themes/registry.ts` trova i file per nome, quindi il manifest non li elenca.

```text
themes/<id>/
  theme.ts       manifest esportato come default: id (uguale al nome della cartella), title, description, motto; icons e schemes facoltativi (F08)
  schema.sql     CREATE TABLE con chiavi esterne dichiarate
  dati.sql       INSERT
  esercizi.ts    elenco di Exercise esportato come default; facoltativo (F02)
  analisi.md     testo del dominio (F07)
  er.ts          schema ER (tipo ErDiagram), facoltativo (F06)
  stile.css      variabili e decorazioni del guscio del tema, facoltativo (F08)
  locandina.css  fronte della locandina sulla pagina iniziale, facoltativo (F08)
  icone/*.svg    icone RB del tema, citate per nome dal manifest (F08)
  fonts/         caratteri del tema con il loro OFL.txt, citati da stile.css (F08)
```

Il registro legge `theme.ts`, `schema.sql` e `dati.sql`, tutti obbligatori, `esercizi.ts`, facoltativo (da F02), ed `er.ts`, facoltativo (da F06). `theme.ts`, `esercizi.ts` ed `er.ts` sono caricati anche da Node senza Vite (`npm run check:themes`): dal codice comune importano solo tipi, con `import type`. Ogni fase che introduce un altro file aggiunge al registro il suo caricamento a richiesta.

### Riferimenti da adattare

Fatti verificati il 2026-11-16 con `ls` e `grep` sui percorsi indicati, relativi a `~/Developer/github/`.

| Percorso | Che cosa contiene |
| --- | --- |
| `python-doesnt-byte/static/sql-runner/worker.js` | Worker `sql.js` (728 righe): seed serializzato, `PRAGMA foreign_keys = ON`, `lastResultSet`, `hasOrderBy`, `compareSets`, `verifyRun` |
| `python-doesnt-byte/src/theme/SQLRunner/sqlBridge.ts` | Ponte fra React e worker, con watchdog che termina il worker su una query che non finisce |
| `python-doesnt-byte/src/components/DiagrammaER/` | Componente ER dichiarativo del libro (`index.tsx`, `layout.ts`, `types.ts`), cardinalità `(min,max)`; usa il carattere Excalifont, licenza OFL |
| `jedi-academy/src/data/starWarsDatabase.ts` | Schema descrittivo e seed SQL di sette tabelle (272 righe) |
| `jedi-academy/src/data/exercises.ts` | 105 esercizi (1413 righe): `id`, `title`, `description`, `difficulty`, `keywords`, `expectedQuery`, `hints`, `relevantTables`, `checkOrder` |
| `jedi-academy/src/services/sessionGenerator.ts` | Generatore di sessioni del prototipo |

Il libro dichiara `sql.js` `^1.14.1`; l’ultima versione su npm al 2026-11-16 è la 1.16.0 (`npm view sql.js version`). Node locale: v25.9.0.

### Comandi dei criteri di accettazione

I comandi `npm …` citati nelle fasi dipendono da codice non ancora scritto: alla stesura del piano (2026-11-16) **non sono stati eseguiti**. Ogni fase li esegue e ne riporta l’esito.

## Aggiornamenti di stato

| Data | Nota |
| --- | --- |
| 2026-11-16 | Piano scritto dopo l’intervista con Marco. Nessuna fase avviata. |
| 2026-11-16 | F01 completata su Fable 5.2. Scheletro, contratto del tema, registro e motore SQL con watchdog; passaggio di consegne nel dettaglio della fase. |
| 2026-11-16 | F02 completata su Fable 5.2. Tipo `Exercise`, verifica delle risposte con le regole di confronto, `npm run check:themes`; regole e interfacce nel dettaglio della fase. |
| 2026-11-17 | Piano aggiornato su richiesta di Marco: tutte le icone passano dalla skill `icone-rb` (RB Icons), il progetto è collaudo della skill. Sezione «Icone» nel piano; modificate F03, F05, F06, F08, F09 e i loro prompt; `AGENTS.md` sostituisce Phosphor con `Icone: rb-icons`. |
| 2026-11-17 | F03 completata su Opus 5.5. Routing con hash, elenco dei temi, guscio con sei sezioni, sandbox con CodeMirror; dieci icone RB create e approvate da Marco. Dettagli e collaudo della skill nel dettaglio della fase. |
| 2026-11-17 | Aggiunta F11 su richiesta di Marco: studio della veste con l’Artifact «Design» prima di F08, che ora dipende da F11. Ammesse icone tematiche e loghi o emblemi stilizzati. |
| 2026-11-17 | Aggiunta F12 su richiesta di Marco: ogni tema ha la propria fase di studio della veste. F09 ora dipende da F12; le specifiche stanno in `docs/design/<id>.md`. |
| 2026-11-17 | F04 completata su Sonnet 5.5. Database Star Wars e 105 esercizi su SQLite (il prototipo ne ha 105, non 121: corretto il piano). Ordinamenti completi in tre esercizi, difetti di schema e incongruenze fra consegna e query elencati nel dettaglio della fase per Marco e per F07. |
| 2026-11-17 | F05 completata su Opus 5.5. Percorso, spazio di lavoro, sessioni con riepilogo, catalogo «Tutte le query», progressi in `localStorage`; otto icone RB nuove approvate da Marco. Marco chiede un sistema a punti (gamification) con fasi dedicate: brainstorming e aggiornamento del piano da fare in una sessione a parte, prima di aggiungere fasi. |
| 2026-11-17 | Brainstorming con Marco sul sistema a punti: aggiunte F13–F17 (regole dei punti, interfaccia, zaino di PDB, servizio e pagina della classifica). F10 ora dipende da F14, F15, F17. Vincolo «solo client» rivisto: zaino cifrato e classifica facoltativa su Cloudflare, a costo zero. CTF, gradi e traguardi rinviati a un piano successivo. |
| 2026-11-17 | F06 completata su Opus 5.5. Modello logico letto dal database con vista del codice; componente ER copiato dal libro (rough.js, Excalifont) con le linee distribuite sullo stesso lato; `themes/star-wars/er.ts` approvato da Marco; coerenza fra ER e tabelle in `check:themes`. Tre icone RB nuove approvate (`code`, `link`, `copy`). |
| 2026-11-18 | F11 completata su Opus 5.5. Tavole nell’Artifact «Design»; specifiche `docs/design/neutra.md` e `docs/design/star-wars.md`, approvate da Marco; script `docs/design/contrasto.mjs`. Nuova decisione sul contratto: schemi chiaro e scuro per tema. Emblemi dell’Alleanza e dell’Impero da creare in F08. |
| 2026-11-18 | F08 completata su Opus 5.5, in due sessioni (la prima interrotta per limite di utilizzo). Contratto della veste, veste Star Wars con schemi chiaro e scuro, pagina iniziale a locandine; cinque icone tematiche approvate. Dettagli e scostamenti dalla tavola nel dettaglio della fase. |
| 2026-11-18 | F12 completata su Opus 5.5. Tavole nell’Artifact «Design» [SQL Academy — veste Il Signore degli Anelli](https://claude.ai/artifact/DtawNio6cxm36cFE3Euij7); Marco ha approvato entrambe le direzioni come schema chiaro (mappa della Contea) e scuro (porte di Moria). Specifica `docs/design/lotr.md`; sei icone tematiche create su richiesta di Marco (anticipate da F09); due lacune del contratto per F09. |
| 2026-11-18 | F09 completata su Opus 5.5 (commit `515d142`, correzione del contratto `eb8a74d`). Dal feedback di Marco: rifiniture subito (`f7fa065`, `6ab7855`: barra di scorrimento stabile, selettore che scorre, chiavi esterne nel pannello, parole chiave solo a esercizio risolto, decorazioni LOTR più grandi) e quattro fasi nuove, F18–F21, che diventano dipendenze di F10. |
| 2026-11-18 | Obiettivo di Marco: circa 150 esercizi distinti per tema (circa 600 nel portale con quattro temi). F21 diventa «arricchire i dati di LOTR e portarne gli esercizi a circa 150»; nuova F22 per Star Wars (da 105 a circa 150, colmando sottoquery ed esercizi facili oltre il capitolo 6). F10 dipende anche da F22. |
| 2026-11-18 | F18 completata su Opus 5.5. Indicatore unico della sezione attiva, spostato e animato dal guscio; la veste ne disegna l’aspetto con `.sections-indicator::after`. Icona comune `rocket` e nuovo campo `icons.session` del contratto: `x-wing` e `tie-fighter` per Star Wars, `hobbit-backpack` per LOTR. |
