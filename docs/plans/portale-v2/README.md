# Piano «portale-v2»

| ID | Fase | Dipendenze | Claude | Codex | Effort | Consumo stimato | Stato | Completata il | Prompt | Dettaglio |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| F01 | Chiudere la pubblicazione del portale | — | Sonnet | Terra | `medium` | basso | completata | 2026-11-21 11:49 | [P-F01](#p-f01) | [F01](F01-chiudere-pubblicazione.md) |
| F02 | Studiare barra comune, stato dello zaino e notifica dell’esito | — | Opus | — | `medium` | medio-alto | completata | 2026-11-21 17:55 | [P-F02](#p-f02) | [F02](F02-studiare-barra-notifica.md) |
| F03 | Studiare le pagine Zaino e Classifica | F02 | Opus | — | `medium` | medio-alto | completata | 2026-11-21 20:11 | [P-F03](#p-f03) | [F03](F03-studiare-pagine-zaino-classifica.md) |
| F04 | Costruire la barra comune e il ritorno alla pagina precedente | F02 | Opus | Sol | `medium` | medio | completata | 2026-11-21 18:56 | [P-F04](#p-f04) | [F04](F04-costruire-barra-comune.md) |
| F05 | Notificare l’esito con i punti e il salvataggio nello zaino | F02, F04 | Opus | Sol | `medium` | medio | completata | 2026-11-21 19:17 | [P-F05](#p-f05) | [F05](F05-notificare-esito.md) |
| F06 | Rendere riprendibile la sessione di esercizi | — | Sonnet | Terra | `high` | basso-medio | completata | 2026-11-21 13:01 | [P-F06](#p-f06) | [F06](F06-sessione-riprendibile.md) |
| F07 | Ricostruire le pagine Zaino e Classifica | F03, F04 | Opus | Sol | `medium` | medio-alto | completata | 2026-11-21 22:03 | [P-F07](#p-f07) | [F07](F07-ricostruire-pagine-zaino-classifica.md) |
| F08 | Scegliere le IP dei nuovi mondi e definirne i livelli | — | Opus | Sol | `medium` | medio | completata | 2026-11-23 13:36 | [P-F08](#p-f08) | [F08](F08-scegliere-mondi-livelli.md) |
| F09 | Mostrare il livello dei mondi nel contratto e sulla pagina iniziale | F08 | Opus | Sol | `medium` | basso-medio | da fare |  | [P-F09](#p-f09) | [F09](F09-livello-dei-mondi.md) |
| F10 | Predisporre il piè di pagina comune | F04 | Sonnet | Terra | `medium` | basso | completata | 2026-11-21 19:30 | [P-F10](#p-f10) | [F10](F10-predisporre-pie-di-pagina.md) |
| F11 | Spiegare in italiano gli errori di SQLite | — | Opus | Sol | `medium` | medio | completata | 2026-11-22 22:08 | [P-F11](#p-f11) | [F11](F11-errori-sqlite-italiano.md) |
| F12 | Aggiungere la sessione di ripasso | F06 | Opus | Sol | `medium` | medio | da fare |  | [P-F12](#p-f12) | [F12](F12-sessione-ripasso.md) |
| F13 | Segnalare un problema su un esercizio | — | Opus | Sol | `medium` | basso | da fare |  | [P-F13](#p-f13) | [F13](F13-segnalare-problema.md) |
| F14 | Assegnare una consegna con un link | F06 | Opus | Sol | `medium` | medio | da fare |  | [P-F14](#p-f14) | [F14](F14-consegna-con-link.md) |
| F15 | Scaricare il database e mostrare l’anteprima dei link | — | Sonnet | Terra | `medium` | basso | da fare |  | [P-F15](#p-f15) | [F15](F15-scaricare-database-anteprima-link.md) |
| F16 | Riprendere da dove eri e guidare il primo ingresso | F04, F06 | Opus | Sol | `medium` | basso-medio | da fare |  | [P-F16](#p-f16) | [F16](F16-riprendere-guida-ingresso.md) |
| F17 | Far funzionare il sito senza rete | — | Opus | Sol | `medium` | medio | da fare |  | [P-F17](#p-f17) | [F17](F17-sito-offline.md) |
| F18 | Scrivere i test end-to-end | F05, F07 | Sonnet | Terra | `high` | medio | da fare |  | [P-F18](#p-f18) | [F18](F18-test-end-to-end.md) |
| F19 | Controllare la qualità degli esercizi | — | Opus | Sol | `medium` | medio | completata | 2026-11-21 12:15 | [P-F19](#p-f19) | [F19](F19-controllare-esercizi.md) |
| F20 | Generare lo scheletro di un tema nuovo | F09 | Sonnet | Terra | `medium` | basso | da fare |  | [P-F20](#p-f20) | [F20](F20-generatore-tema.md) |

Le colonne «Claude» e «Codex» danno la famiglia del modello per ciascuno strumento, senza versione; `—` vuol dire che la fase gira solo sull’altro. L’effort è un’indicazione per Marco, che lo imposta all’apertura: nessuno dei due modelli lo legge.

Stati ammessi: `da fare`, `in corso`, `bloccata`, `completata`. Data di completamento nel formato `YYYY-MM-DD HH:mm`, fuso `Europe/Rome`.

Le stime di consumo sono qualitative: nessuna misura garantisce che una fase rientri in una finestra di cinque ore.

Ordine consigliato: F01, F19, F06, F02, F04, F10, F05, F03, F07, F11, F13, F12, F14, F16, F15, F08, F09, F20, F18, F17. F19 viene presto perché gli esercizi sono già in produzione; F18 dopo che l’interfaccia è definitiva; F17 per ultima, protetta dai test end-to-end. F08 non tocca il codice e si può anticipare in ogni momento.

## Prompt di apertura

Tutti i prompt condividono la stessa chiusura. I percorsi sono relativi alla radice del repo. Ogni prompt vale sia per Claude Code sia per Codex, salvo le fasi «solo Claude».

### Messaggio di chiusura

Chiesto da Marco il 2026-11-21, per non dover rileggere l’indice a ogni fase. L’ultimo messaggio di una sessione di fase contiene, in quest’ordine:

1. una frase che dice chiaramente che la fase è terminata (o perché non lo è) e che indice, dettaglio e `AGENTS.md` sono aggiornati, con l’hash del commit di chiusura;
2. la prossima fase consigliata, con lo strumento e il modello per ciascuno dei due (o «solo Claude»), scelta così: se la fase appena chiusa è segnata per la revisione incrociata, la sua revisione; altrimenti la prima fase dell’«Ordine consigliato» non ancora `completata` le cui dipendenze sono tutte `completata`;
3. il prompt di apertura di quella fase in un blocco di codice `text`, copiato da questa sezione così com’è; per una revisione, il prompt della fase con la riga «ID e obiettivo» sostituita come indica la skill `piani-multisessione`.

Se la fase è rimasta `in corso` o `bloccata`, il prompt suggerito è quello della stessa fase, per riprenderla.

### P-F01

```text
Modello: Claude Code → Sonnet · Codex → Terra
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Sonnet; se sei Codex, su Terra (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/portale-v2/README.md
Fase: docs/plans/portale-v2/F01-chiudere-pubblicazione.md
ID e obiettivo: F01 — Chiudere la pubblicazione del portale.

La fase usa il sito pubblicato e cambia un’impostazione del repo su GitHub: chiedi il via a Marco prima di ogni azione sul sito, sullo zaino o sulla classifica di produzione, e prima di cambiare il branch predefinito.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F02

```text
Modello: solo Claude Code → Opus (la fase usa l’Artifact «Design»). Se sei Codex, fermati e dimmelo prima di qualsiasi lavoro.
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: verifica di girare su Opus, ignorando il numero di versione. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/portale-v2/README.md
Fase: docs/plans/portale-v2/F02-studiare-barra-notifica.md
ID e obiettivo: F02 — Studiare barra comune, stato dello zaino e notifica dell’esito.

Le tavole si disegnano con l’Artifact di tipo «Design» (tool Artifact, quickstart con intent "design"); mostra a Marco le tavole e attendi l’approvazione prima di scrivere la specifica. Nelle tavole usa solo icone RB già nel progetto: le icone nuove restano segnaposto per F04 e F05.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F03

```text
Modello: solo Claude Code → Opus (la fase usa l’Artifact «Design»). Se sei Codex, fermati e dimmelo prima di qualsiasi lavoro.
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: verifica di girare su Opus, ignorando il numero di versione. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/portale-v2/README.md
Fase: docs/plans/portale-v2/F03-studiare-pagine-zaino-classifica.md
ID e obiettivo: F03 — Studiare le pagine Zaino e Classifica.

Le tavole si disegnano con l’Artifact di tipo «Design» (tool Artifact, quickstart con intent "design"); proponi almeno due direzioni per la classifica, attendi la scelta di Marco e la sua approvazione prima di scrivere la specifica. Nelle tavole usa solo icone RB già nel progetto: le icone nuove restano segnaposto per F07.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F04

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/portale-v2/README.md
Fase: docs/plans/portale-v2/F04-costruire-barra-comune.md
ID e obiettivo: F04 — Costruire la barra comune e il ritorno alla pagina precedente.

Questa fase scrive testi per gli studenti: prima di scrivere leggi .claude/norms/scrittura-didattica.md, a fine stesura applica .claude/norms/scrittura-umana.md. Se .claude/norms non è raggiungibile, fermati.

Icone: usa quelle già nel progetto (`src/assets/icons/`, `themes/<id>/icone/`). Se ne servono di nuove: su Claude Code cercale e disegnale con la skill `icone-rb`, secondo la sezione «Icone» del piano, e attendi l’approvazione di Marco; su Codex fermati prima di disegnarle e lascia un segnaposto: le icone nuove si fanno in una sessione Claude su Opus.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F05

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/portale-v2/README.md
Fase: docs/plans/portale-v2/F05-notificare-esito.md
ID e obiettivo: F05 — Notificare l’esito con i punti e il salvataggio nello zaino.

Questa fase scrive testi per gli studenti: prima di scrivere leggi .claude/norms/scrittura-didattica.md, a fine stesura applica .claude/norms/scrittura-umana.md. Se .claude/norms non è raggiungibile, fermati.

Icone: usa quelle già nel progetto (`src/assets/icons/`, `themes/<id>/icone/`). Se ne servono di nuove: su Claude Code cercale e disegnale con la skill `icone-rb`, secondo la sezione «Icone» del piano, e attendi l’approvazione di Marco; su Codex fermati prima di disegnarle e lascia un segnaposto: le icone nuove si fanno in una sessione Claude su Opus.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F06

```text
Modello: Claude Code → Sonnet · Codex → Terra
Effort consigliato: high (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Sonnet; se sei Codex, su Terra (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/portale-v2/README.md
Fase: docs/plans/portale-v2/F06-sessione-riprendibile.md
ID e obiettivo: F06 — Rendere riprendibile la sessione di esercizi.

Questa fase scrive pochi testi per gli studenti: prima di scriverli leggi .claude/norms/scrittura-didattica.md, a fine stesura applica .claude/norms/scrittura-umana.md. Se .claude/norms non è raggiungibile, fermati. Se servono icone nuove, fermati e dillo a Marco: si disegnano in una sessione Claude su Opus.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F07

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/portale-v2/README.md
Fase: docs/plans/portale-v2/F07-ricostruire-pagine-zaino-classifica.md
ID e obiettivo: F07 — Ricostruire le pagine Zaino e Classifica.

Questa fase scrive testi per gli studenti: prima di scrivere leggi .claude/norms/scrittura-didattica.md, a fine stesura applica .claude/norms/scrittura-umana.md. Se .claude/norms non è raggiungibile, fermati.

Icone: usa quelle già nel progetto (`src/assets/icons/`, `themes/<id>/icone/`). Se ne servono di nuove: su Claude Code cercale e disegnale con la skill `icone-rb`, secondo la sezione «Icone» del piano, e attendi l’approvazione di Marco; su Codex fermati prima di disegnarle e lascia un segnaposto: le icone nuove si fanno in una sessione Claude su Opus.

Ogni modifica al servizio della classifica in produzione (deploy, migrazioni D1) richiede il via di Marco.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F08

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/portale-v2/README.md
Fase: docs/plans/portale-v2/F08-scegliere-mondi-livelli.md
ID e obiettivo: F08 — Scegliere le IP dei nuovi mondi e definirne i livelli.

La scelta delle IP è di Marco: proponi una rosa motivata e attendi la sua scelta prima di scrivere il documento finale. Le ricerche sul web vanno a subagent del livello più economico che lo strumento offre (Sonnet o Haiku su Claude, Terra o Luna su Codex).

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F09

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/portale-v2/README.md
Fase: docs/plans/portale-v2/F09-livello-dei-mondi.md
ID e obiettivo: F09 — Mostrare il livello dei mondi nel contratto e sulla pagina iniziale.

Questa fase scrive testi per gli studenti: prima di scrivere leggi .claude/norms/scrittura-didattica.md, a fine stesura applica .claude/norms/scrittura-umana.md. Se .claude/norms non è raggiungibile, fermati.

Icone: usa quelle già nel progetto (`src/assets/icons/`, `themes/<id>/icone/`). Se ne servono di nuove: su Claude Code cercale e disegnale con la skill `icone-rb`, secondo la sezione «Icone» del piano, e attendi l’approvazione di Marco; su Codex fermati prima di disegnarle e lascia un segnaposto: le icone nuove si fanno in una sessione Claude su Opus.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F10

```text
Modello: Claude Code → Sonnet · Codex → Terra
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Sonnet; se sei Codex, su Terra (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/portale-v2/README.md
Fase: docs/plans/portale-v2/F10-predisporre-pie-di-pagina.md
ID e obiettivo: F10 — Predisporre il piè di pagina comune.

Non scrivere contenuti nuovi per il piè di pagina: li porterà una sessione aperta in ~/Developer/github/. Se servono icone nuove, fermati e dillo a Marco: si disegnano in una sessione Claude su Opus.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F11

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/portale-v2/README.md
Fase: docs/plans/portale-v2/F11-errori-sqlite-italiano.md
ID e obiettivo: F11 — Spiegare in italiano gli errori di SQLite.

Questa fase scrive testi per gli studenti: prima di scrivere leggi .claude/norms/scrittura-didattica.md, a fine stesura applica .claude/norms/scrittura-umana.md. Se .claude/norms non è raggiungibile, fermati.

Icone: usa quelle già nel progetto (`src/assets/icons/`, `themes/<id>/icone/`). Se ne servono di nuove: su Claude Code cercale e disegnale con la skill `icone-rb`, secondo la sezione «Icone» del piano, e attendi l’approvazione di Marco; su Codex fermati prima di disegnarle e lascia un segnaposto: le icone nuove si fanno in una sessione Claude su Opus.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F12

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/portale-v2/README.md
Fase: docs/plans/portale-v2/F12-sessione-ripasso.md
ID e obiettivo: F12 — Aggiungere la sessione di ripasso.

Questa fase scrive testi per gli studenti: prima di scrivere leggi .claude/norms/scrittura-didattica.md, a fine stesura applica .claude/norms/scrittura-umana.md. Se .claude/norms non è raggiungibile, fermati.

Icone: usa quelle già nel progetto (`src/assets/icons/`, `themes/<id>/icone/`). Se ne servono di nuove: su Claude Code cercale e disegnale con la skill `icone-rb`, secondo la sezione «Icone» del piano, e attendi l’approvazione di Marco; su Codex fermati prima di disegnarle e lascia un segnaposto: le icone nuove si fanno in una sessione Claude su Opus.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F13

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/portale-v2/README.md
Fase: docs/plans/portale-v2/F13-segnalare-problema.md
ID e obiettivo: F13 — Segnalare un problema su un esercizio.

Questa fase scrive testi per gli studenti: prima di scrivere leggi .claude/norms/scrittura-didattica.md, a fine stesura applica .claude/norms/scrittura-umana.md. Se .claude/norms non è raggiungibile, fermati.

Icone: usa quelle già nel progetto (`src/assets/icons/`, `themes/<id>/icone/`). Se ne servono di nuove: su Claude Code cercale e disegnale con la skill `icone-rb`, secondo la sezione «Icone» del piano, e attendi l’approvazione di Marco; su Codex fermati prima di disegnarle e lascia un segnaposto: le icone nuove si fanno in una sessione Claude su Opus.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F14

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/portale-v2/README.md
Fase: docs/plans/portale-v2/F14-consegna-con-link.md
ID e obiettivo: F14 — Assegnare una consegna con un link.

Questa fase scrive testi per gli studenti: prima di scrivere leggi .claude/norms/scrittura-didattica.md, a fine stesura applica .claude/norms/scrittura-umana.md. Se .claude/norms non è raggiungibile, fermati.

Icone: usa quelle già nel progetto (`src/assets/icons/`, `themes/<id>/icone/`). Se ne servono di nuove: su Claude Code cercale e disegnale con la skill `icone-rb`, secondo la sezione «Icone» del piano, e attendi l’approvazione di Marco; su Codex fermati prima di disegnarle e lascia un segnaposto: le icone nuove si fanno in una sessione Claude su Opus.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F15

```text
Modello: Claude Code → Sonnet · Codex → Terra
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Sonnet; se sei Codex, su Terra (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/portale-v2/README.md
Fase: docs/plans/portale-v2/F15-scaricare-database-anteprima-link.md
ID e obiettivo: F15 — Scaricare il database e mostrare l’anteprima dei link.

Se servono icone nuove, fermati e dillo a Marco: si disegnano in una sessione Claude su Opus.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F16

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/portale-v2/README.md
Fase: docs/plans/portale-v2/F16-riprendere-guida-ingresso.md
ID e obiettivo: F16 — Riprendere da dove eri e guidare il primo ingresso.

Questa fase scrive testi per gli studenti: prima di scrivere leggi .claude/norms/scrittura-didattica.md, a fine stesura applica .claude/norms/scrittura-umana.md. Se .claude/norms non è raggiungibile, fermati.

Icone: usa quelle già nel progetto (`src/assets/icons/`, `themes/<id>/icone/`). Se ne servono di nuove: su Claude Code cercale e disegnale con la skill `icone-rb`, secondo la sezione «Icone» del piano, e attendi l’approvazione di Marco; su Codex fermati prima di disegnarle e lascia un segnaposto: le icone nuove si fanno in una sessione Claude su Opus.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F17

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/portale-v2/README.md
Fase: docs/plans/portale-v2/F17-sito-offline.md
ID e obiettivo: F17 — Far funzionare il sito senza rete.

Questa fase scrive testi per gli studenti: prima di scrivere leggi .claude/norms/scrittura-didattica.md, a fine stesura applica .claude/norms/scrittura-umana.md. Se .claude/norms non è raggiungibile, fermati.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F18

```text
Modello: Claude Code → Sonnet · Codex → Terra
Effort consigliato: high (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Sonnet; se sei Codex, su Terra (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/portale-v2/README.md
Fase: docs/plans/portale-v2/F18-test-end-to-end.md
ID e obiettivo: F18 — Scrivere i test end-to-end.

Il passo nel workflow si prova solo con un push: chiedi il via a Marco prima di farlo.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F19

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/portale-v2/README.md
Fase: docs/plans/portale-v2/F19-controllare-esercizi.md
ID e obiettivo: F19 — Controllare la qualità degli esercizi.

Questa fase scrive testi per gli studenti: prima di scrivere leggi .claude/norms/scrittura-didattica.md, a fine stesura applica .claude/norms/scrittura-umana.md. Se .claude/norms non è raggiungibile, fermati.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F20

```text
Modello: Claude Code → Sonnet · Codex → Terra
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Sonnet; se sei Codex, su Terra (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/portale-v2/README.md
Fase: docs/plans/portale-v2/F20-generatore-tema.md
ID e obiettivo: F20 — Generare lo scheletro di un tema nuovo.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
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
| Un piè di pagina comune, solo predisposto: il contenuto arriva da una sessione nella cartella `~/Developer/github/`, comune a tutti i mini-siti (Marco, 2026-11-21) | F10 |
| Idee proposte da Claude e scelte da Marco il 2026-11-21: errori di SQLite in italiano | F11 |
| Sessione di ripasso con ripetizione spaziata | F12 |
| Segnalazione di un problema su un esercizio | F13 |
| Consegna per la classe con un link | F14 |
| Database del tema da scaricare; anteprima dei link condivisi | F15 |
| «Riprendi da dove eri»; guida al primo ingresso in un tema | F16 |
| Sito utilizzabile senza rete | F17 |
| Test end-to-end | F18 |
| Controllo automatico della qualità degli esercizi | F19 |
| Generatore dello scheletro di un tema | F20 |

Fuori dal piano: la costruzione dei nuovi mondi, le CTF, gradi e traguardi (Marco, 2026-11-21).

## Vincoli

Restano quelli del piano archiviato, sezione «Vincoli» di [`archivio/portale-v1/README.md`](../archivio/portale-v1/README.md): sito statico senza dati personali (studenti minorenni), zaino e classifica su Cloudflare Workers Free, solo RB Icons, dialetto SQLite, un tema nuovo non tocca file fuori da `themes/<id>/`, nessun push e nessuna pubblicazione senza il via di Marco, lavoro su `dev`.

In più:

- Il sito è in produzione dal 2026-11-20 su `https://sql.rainbowbits.cloud/`. Una modifica al formato dei progressi in `localStorage` o nello zaino deve leggere i dati già salvati dagli studenti: nessuna migrazione distruttiva.
- Ogni pubblicazione passa dal merge in `main`, che chiede Marco.

## Autonomia concordata

**Bilanciata**, confermata dal piano archiviato (Marco, 2026-11-16): chiedi sulle decisioni strutturali, risolvi da solo i dettagli locali e reversibili. Chiedi sempre prima di cambiare requisiti o ampliare il perimetro.

## Strategia dei modelli

Ogni fase gira su Claude Code o su Codex, a scelta di Marco (2026-11-21). Le regole generali, con la corrispondenza fra i modelli, sono nella skill `piani-multisessione` (sorgente in `~/Developer/github/norms/skills/piani-multisessione/`): Fable ↔ Astra, Opus ↔ Sol, Sonnet ↔ Terra, Haiku ↔ Luna. I modelli si indicano senza versione, perché Marco usa sempre l’ultima; l’effort è solo un’indicazione per lui.

- **Fable escluso** su Claude; budget ampio nella finestra di cinque ore e nella settimana, priorità all’approfondimento (Marco, 2026-11-21). Nessuna fase richiede il livello più alto, quindi Astra non compare.
- Opus o Sol, `medium`, dove si decide una forma, si scrivono testi per gli studenti o si disegnano icone (F04, F05, F07–F09, F11–F14, F16, F19). F17 (sito senza rete) è a questo livello perché un *service worker* sbagliato serve a lungo versioni vecchie: sale a `high` se gli aggiornamenti non si comportano come previsto.
- **Solo Claude**, Opus `medium`: F02 e F03, che disegnano con l’Artifact «Design».
- **Icone nuove solo su Claude**, su Opus, come richiede il collaudo della skill `icone-rb`: una fase su Codex che ne ha bisogno si ferma e lascia un segnaposto (Marco, 2026-11-21).
- Sonnet o Terra dove si esegue una forma già decisa: F01, F10, F15, F20 (`medium`); F06 (`high`, perché la sessione salvata deve restare coerente con l’azzeramento dei progressi e con lo zaino, e i casi limite vanno coperti con i test); F18 (`high`, perché i test end-to-end vanno resi stabili).
- In F08 le ricerche sul web vanno a subagent del livello più economico; il giudizio e la rosa da proporre restano sul modello principale.
- Claude e ChatGPT hanno budget separati: se uno dei due è quasi esaurito, la fase successiva può girare sull’altro. Il commit di chiusura è l’unico passaggio di consegne, qualunque sia lo strumento.
- **Revisione incrociata** (skill `piani-multisessione`, Marco, 2026-11-21): F05, F07, F12, F14, F16 e F17, che toccano i dati degli studenti o la produzione, le rivede l’altro strumento, con lo stesso livello di modello, prima delle fasi che ne dipendono; il dettaglio di ciascuna lo dice in testa. Il prompt è quello della fase, con la riga «ID e obiettivo» sostituita come indica la skill. F06 è stata rivista da Claude il 2026-11-21.
- Se una fase non riesce: prima rendi verificabile il lavoro (test, `npm run check:themes`), poi alza l’effort di un livello, poi passa al livello superiore.

## Decisioni condivise

Le decisioni del piano archiviato restano valide: sezione «Decisioni condivise» di [`archivio/portale-v1/README.md`](../archivio/portale-v1/README.md). Qui solo le nuove.

| Decisione | Scelta | Motivo |
| --- | --- | --- |
| Sessione di esercizi | Riprendibile: salvata nel browser per tema, sopravvive a cambi di pagina e ricariche; il tema offre «Riprendi la sessione» o «Abbandonala» (Marco, 2026-11-21) | Oggi la sessione vive nello stato di `ThemePage` e si perde uscendo dal tema (verificato il 2026-11-21) |
| Perimetro sui mondi futuri | Questo piano sceglie le IP e il livello di ogni mondo e porta il livello nel contratto; la costruzione dei mondi va in un piano successivo (Marco, 2026-11-21) | Ogni mondo chiede uno studio della veste e una fase di costruzione: otto mondi sono un piano a sé |
| Mondi in totale | Dieci, cioè otto nuovi oltre a Star Wars e Il Signore degli Anelli: alcuni facili (meno tabelle, query più semplici, consigliati per cominciare), molti intermedi come i due esistenti, uno o due complessi (molte tabelle e moltissime query), candidati alle CTF (Marco, 2026-11-21) | Un percorso che accompagna lo studente dal primo mondo all’ultimo |
| CTF | Ancora rinviate a un piano successivo; F08 annota solo quali mondi le ospiteranno (Marco, 2026-11-21) | Restano legate ai mondi complessi, che questo piano non costruisce |
| Barra comune e notifica | Barra in una riga sola, Zaino e Classifica in veste neutra con «Torna a <tema>», pausa della notifica su tutta la notifica, notifica solo per l’esercizio risolto: specifica `docs/design/barra-notifica.md` (Marco, 2026-11-21, in F02) | Tavole approvate nell’Artifact «Design» |
| Notifica dell’esito | Sostituisce il riquadro verde «Esercizio risolto»; pulsante «OK» che si riempie e chiude la notifica da solo in 3–4 secondi; il puntatore sopra il pulsante ferma riempimento e tempo (Marco, 2026-11-21). L’esito sbagliato resta nel riquadro di oggi | Marco ha chiesto di cambiare solo il riquadro verde |
| Piè di pagina | F10 lo predispone soltanto; contenuto e disegno arrivano da una sessione aperta in `~/Developer/github/`, che rende coerenti i piè di pagina di tutti i mini-siti (Marco, 2026-11-21) | Coerenza fra i siti di Marco |
| Idee aggiunte al piano | Fra quelle proposte da Claude, Marco ha scelto F11–F20; scartate cronologia della sandbox, riepilogo stampabile, classe nella classifica, esportazione in CSV (2026-11-21) | Restano annotate qui, se tornassero utili |
| Dati nel browser | Ogni dato nuovo salvato nel browser va cancellato sia da «Azzera i progressi» sia da «Esci dallo zaino», anche in modalità «Non è il mio computer»; la procedura manuale della fase prova entrambi (Marco, 2026-11-21) | In F06 la sessione salvata sopravviveva all’uscita dallo zaino: chi usava il computer dopo poteva riprenderla |
| Strumenti | Ogni fase gira su Claude Code o su Codex; solo Claude per l’Artifact «Design» e per le icone nuove (Marco, 2026-11-21) | Budget separati e due strumenti a disposizione; il design e il collaudo delle icone esistono solo su Claude |

## Icone

Procedimento e regole sono quelli della sezione «Icone» del piano archiviato ([`archivio/portale-v1/README.md`](../archivio/portale-v1/README.md#icone)): ogni icona passa dalla skill `icone-rb`, le nuove si disegnano su Claude Opus (mai su Codex) e Marco le approva sul render a 128 px, i commit delle icone vanno nel repo `~/Developer/github/icone` su `dev`. Prima di cercare un’icona controlla il registro del piano archiviato: molte esistono già nel progetto.

### Registro icone

Una riga per icona nuova o con un uso nuovo, compilata dalla fase che la usa.

| Icona | Uso nel portale | Fase | Origine | Esito |
| --- | --- | --- | --- | --- |
| `circle-arrow-left` | ritorno alla pagina di provenienza | F04 | già nel progetto | usata |
| `circle-check` | distintivo dello zaino sincronizzato | F04 | già nel progetto | usata |
| `cloud-arrow-up` | distintivo delle modifiche in attesa e del salvataggio con movimento ridotto | F04 | già nel progetto | usata |
| `circle-xmark` | distintivo dell’errore dello zaino | F04 | già nel progetto | usata |
| `cloud-slash` | distintivo «senza rete» della pillola dello zaino e della riga dello zaino nella notifica | F02 → F04, F05 | disegnata da Claude Opus, approvata da Marco (commit `014f84a` del repo `icone`) | usata |
| `circle-check` | esito corretto e distintivo dello zaino salvato nella notifica | F05 | già nel progetto | usata |
| `coin` | premio nella notifica | F05 | già nel progetto | usata |
| `backpack` | riga dello zaino nella notifica | F05 | già nel progetto | usata |
| `cloud-arrow-up` | distintivo del salvataggio in attesa e del salvataggio con movimento ridotto nella notifica | F05 | già nel progetto | usata |
| `circle-xmark` | distintivo dell’errore dello zaino nella notifica | F05 | già nel progetto | usata |
| `trophy` | classifica generale nel selettore | F07 | già nel progetto | usata |
| `list` | apertura del selettore della classifica su telefono | F07 | già nel progetto | usata |
| `id-badge` | invito a partecipare con lo zaino collegato | F07 | già nel progetto | usata |
| `backpack` | invito ad aprire lo zaino per partecipare | F07 | già nel progetto | usata |
| `circle-check` | conferma dello zaino appena creato | F07 | già nel progetto | usata |

## Aggiornamenti di stato

| Data | Nota |
| --- | --- |
| 2026-11-21 | Piano scritto dopo il feedback di Marco sul sito pubblicato; piano `portale-v1` archiviato in `docs/plans/archivio/`. Verificato oggi: HTTPS attivo sul sito (certificato `approved`, `https_enforced: true`), branch predefinito del repo ancora `dev`. Nessuna fase avviata. |
| 2026-11-21 | Aggiunte su richiesta di Marco F10 (piè di pagina da predisporre) e F11–F20, scelte fra le idee proposte da Claude. Nessuna fase avviata. |
| 2026-11-21 | Piano reso eseguibile anche con Codex: colonne «Claude» e «Codex» nell’indice, modelli senza versione, effort solo indicativo, prompt validi per i due strumenti; F02 e F03 solo Claude. La skill `piani-multisessione` passa in `~/Developer/github/norms/skills/`. |
| 2026-11-21 | F19 completata (Claude Code, Opus): sei controlli di qualità in `check:themes`, tre come errori e tre come avvisi; 17 esercizi corretti fra i due temi, due avvisi giustificati. Elenco nel dettaglio della fase. |
| 2026-11-21 | F06 in corso (Codex; modello non verificabile): sessioni salvate per tema e area, test automatici superati; restano le prove manuali di azzeramento e isolamento fra temi dopo il blocco del browser. Dettagli in F06. |
| 2026-11-21 | F06 completata (Codex; famiglia del modello non verificabile): procedura manuale ripetuta, inclusi abbandono, azzeramento e isolamento fra temi; verifiche automatiche superate. |
| 2026-11-21 | Revisione di F06 (Codex) fatta da Claude: corretto il difetto sull’uscita dallo zaino, rifinita la schermata della sessione salvata. Prima prova del lavoro a più modelli: aggiunte alla skill e al piano la revisione incrociata delle fasi a rischio, la sezione «Scostamenti dal dettaglio» nel passaggio di consegne, la riga che identifica strumento e modello nei commit e la lettura del modello di Codex da `~/.codex/config.toml`; aggiunta la decisione «Dati nel browser». |
| 2026-11-21 | Su richiesta di Marco ogni sessione di fase chiude con il «Messaggio di chiusura»: fase terminata e annotata, prossima fase consigliata e il suo prompt pronto da copiare. Regola aggiunta anche alla skill `piani-multisessione`. |
| 2026-11-21 | F02 completata (Claude Code, Opus): tavole approvate da Marco (barra in una riga sola), specifica `docs/design/barra-notifica.md`, palette `barra-notifica` in `contrasto.mjs`, 60 coppie sopra la soglia. Nuova icona «senza rete» da disegnare in F04. |
| 2026-11-21 | F04 in corso (Codex, Sol): barra comune, ritorno alla pagina di provenienza e sei stati dello zaino verificati. Resta da sostituire il segnaposto «senza rete» con l’icona RB approvata, in una sessione Claude Code su Opus. |
| 2026-11-21 | F04 completata (Claude Code, Opus): icona `cloud-slash` disegnata e approvata da Marco al posto del segnaposto «senza rete»; lavoro di Codex ricontrollato, verifiche automatiche e prova nel browser superate. |
| 2026-11-21 | F10 completata (Claude Code, Sonnet): piè di pagina comune in `src/footer/`, montato da `SiteLayout`; contenuti provvisori nel solo `src/footer/contenuti.tsx`, da sostituire con quelli della sessione trasversale. |
| 2026-11-21 | F05 completata (Codex, Sol). La notifica mostra premio, saldo e stato dello zaino. Marco ha confermato la scrittura immediata dopo una risposta corretta. Prove superate su entrambi i temi con lo zaino locale. Segue la revisione su Claude Code con Opus. |
| 2026-11-21 | Revisione di F05 (Claude Code, Opus): nessun difetto, criteri rieseguiti. F03 completata (Claude Code, Opus): classifica A2 approvata da Marco (podio e lista, colonna dei mondi per livello con la posizione in ognuno), zaino con quattro caselle numerate e creazione in tre passi; specifica `docs/design/zaino-classifica.md`, palette `zaino-classifica`, 37 coppie sopra la soglia. Nessuna modifica al servizio. |
| 2026-11-21 | F07 completata (Codex, Sol). Zaino con apertura a quattro caselle e creazione in tre passi. Classifica con podio, lista e posizione per mondo, collaudata con lo zaino a 1280 e 375 px. Segue la revisione incrociata su Claude Code con Opus. |
| 2026-11-22 | F11 completata (Codex, Sol). Testi approvati da Marco. Spiegazioni, indizi dallo schema e messaggio originale verificati nella sandbox e negli esercizi. |
| 2026-11-23 | Revisione di F07 (Claude Code, Opus): nessun difetto. F08 completata (Claude Code, Opus): livelli approvati da Marco, otto opere scelte, `docs/mondi.md`. |
