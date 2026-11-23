# Piano «mondi-v1»

Costruzione degli otto mondi nuovi di SQL Academy scelti in F08 del piano `portale-v2` (`docs/mondi.md`). Ogni mondo segue la stessa ricetta in quattro tipi di fase ([`ricetta.md`](ricetta.md)); il file `mondo-<id>.md` aggiunge ciò che vale solo per quel mondo e raccoglie i passaggi di consegne delle sue fasi.

| ID | Fase | Dipendenze | Claude | Codex | Effort | Consumo stimato | Stato | Completata il | Prompt | Dettaglio |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| F01 | Preparare il portale ai mondi nuovi | — | Sonnet | Terra | `medium` | basso-medio | da fare | — | [P-F01](#p-f01) | [F01](F01-preparare-portale-mondi-nuovi.md) |
| F02 | Stranger Things: dominio, database e traccia | F01 | Opus | Sol | `medium` | medio | da fare | — | [P-F02](#p-f02) | [F02](mondo-stranger-things.md) |
| F03 | Stranger Things: studio della veste | F02 | Opus | — | `medium` | medio | da fare | — | [P-F03](#p-f03) | [F03](mondo-stranger-things.md) |
| F04 | Stranger Things: esercizi | F02 | Opus | Sol | `medium` | alto | da fare | — | [P-F04](#p-f04) | [F04](mondo-stranger-things.md) |
| F05 | Stranger Things: veste, icone e uscita dalla bozza | F03, F04 | Opus | Sol | `medium` | medio | da fare | — | [P-F05](#p-f05) | [F05](mondo-stranger-things.md) |
| F06 | Dragon Ball: dominio, database e traccia | F05 | Opus | Sol | `medium` | medio | da fare | — | [P-F06](#p-f06) | [F06](mondo-dragon-ball.md) |
| F07 | Dragon Ball: studio della veste | F06 | Opus | — | `medium` | medio | da fare | — | [P-F07](#p-f07) | [F07](mondo-dragon-ball.md) |
| F08 | Dragon Ball: esercizi | F06 | Opus | Sol | `medium` | alto | da fare | — | [P-F08](#p-f08) | [F08](mondo-dragon-ball.md) |
| F09 | Dragon Ball: veste, icone e uscita dalla bozza | F07, F08 | Opus | Sol | `medium` | medio | da fare | — | [P-F09](#p-f09) | [F09](mondo-dragon-ball.md) |
| F10 | Sherlock Holmes: dominio, database e traccia | F05 | Opus | Sol | `medium` | medio | da fare | — | [P-F10](#p-f10) | [F10](mondo-sherlock-holmes.md) |
| F11 | Sherlock Holmes: studio della veste | F10 | Opus | — | `medium` | medio | da fare | — | [P-F11](#p-f11) | [F11](mondo-sherlock-holmes.md) |
| F12 | Sherlock Holmes: esercizi | F10 | Opus | Sol | `medium` | alto | da fare | — | [P-F12](#p-f12) | [F12](mondo-sherlock-holmes.md) |
| F13 | Sherlock Holmes: veste, icone e uscita dalla bozza | F11, F12 | Opus | Sol | `medium` | medio | da fare | — | [P-F13](#p-f13) | [F13](mondo-sherlock-holmes.md) |
| F14 | One Piece: dominio, database e traccia | F05 | Opus | Sol | `medium` | medio-alto | da fare | — | [P-F14](#p-f14) | [F14](mondo-one-piece.md) |
| F15 | One Piece: studio della veste | F14 | Opus | — | `medium` | medio | da fare | — | [P-F15](#p-f15) | [F15](mondo-one-piece.md) |
| F16 | One Piece: esercizi su una tabella e join | F14 | Opus | Sol | `medium` | alto | da fare | — | [P-F16](#p-f16) | [F16](mondo-one-piece.md) |
| F17 | One Piece: esercizi su aggregazioni e sottoquery | F16 | Opus | Sol | `medium` | alto | da fare | — | [P-F17](#p-f17) | [F17](mondo-one-piece.md) |
| F18 | One Piece: veste, icone e uscita dalla bozza | F15, F17 | Opus | Sol | `medium` | medio | da fare | — | [P-F18](#p-f18) | [F18](mondo-one-piece.md) |
| F19 | Lego: dominio, database e traccia | F05 | Opus | Sol | `medium` | medio-alto | da fare | — | [P-F19](#p-f19) | [F19](mondo-lego.md) |
| F20 | Lego: studio della veste | F19 | Opus | — | `medium` | medio | da fare | — | [P-F20](#p-f20) | [F20](mondo-lego.md) |
| F21 | Lego: esercizi su una tabella e join | F19 | Opus | Sol | `medium` | alto | da fare | — | [P-F21](#p-f21) | [F21](mondo-lego.md) |
| F22 | Lego: esercizi su aggregazioni e sottoquery | F21 | Opus | Sol | `medium` | alto | da fare | — | [P-F22](#p-f22) | [F22](mondo-lego.md) |
| F23 | Lego: veste, icone e uscita dalla bozza | F20, F22 | Opus | Sol | `medium` | medio | da fare | — | [P-F23](#p-f23) | [F23](mondo-lego.md) |
| F24 | Pokémon: dominio, database e traccia | F05 | Opus | Sol | `medium` | medio-alto | da fare | — | [P-F24](#p-f24) | [F24](mondo-pokemon.md) |
| F25 | Pokémon: studio della veste | F24 | Opus | — | `medium` | medio | da fare | — | [P-F25](#p-f25) | [F25](mondo-pokemon.md) |
| F26 | Pokémon: esercizi su una tabella e join | F24 | Opus | Sol | `medium` | alto | da fare | — | [P-F26](#p-f26) | [F26](mondo-pokemon.md) |
| F27 | Pokémon: esercizi su aggregazioni e sottoquery | F26 | Opus | Sol | `medium` | alto | da fare | — | [P-F27](#p-f27) | [F27](mondo-pokemon.md) |
| F28 | Pokémon: veste, icone e uscita dalla bozza | F25, F27 | Opus | Sol | `medium` | medio | da fare | — | [P-F28](#p-f28) | [F28](mondo-pokemon.md) |
| F29 | Magic: The Gathering: dominio, database e traccia | F05 | Opus | Sol | `medium` | alto | da fare | — | [P-F29](#p-f29) | [F29](mondo-magic.md) |
| F30 | Magic: The Gathering: studio della veste | F29 | Opus | — | `medium` | medio | da fare | — | [P-F30](#p-f30) | [F30](mondo-magic.md) |
| F31 | Magic: The Gathering: esercizi su una tabella e join | F29 | Opus | Sol | `medium` | alto | da fare | — | [P-F31](#p-f31) | [F31](mondo-magic.md) |
| F32 | Magic: The Gathering: esercizi su aggregazioni e sottoquery | F31 | Opus | Sol | `medium` | alto | da fare | — | [P-F32](#p-f32) | [F32](mondo-magic.md) |
| F33 | Magic: The Gathering: veste, icone e uscita dalla bozza | F30, F32 | Opus | Sol | `medium` | medio | da fare | — | [P-F33](#p-f33) | [F33](mondo-magic.md) |
| F34 | Clash Royale: dominio, database e traccia | F05 | Opus | Sol | `medium` | alto | da fare | — | [P-F34](#p-f34) | [F34](mondo-clash-royale.md) |
| F35 | Clash Royale: studio della veste | F34 | Opus | — | `medium` | medio | da fare | — | [P-F35](#p-f35) | [F35](mondo-clash-royale.md) |
| F36 | Clash Royale: esercizi su una tabella e join | F34 | Opus | Sol | `medium` | alto | da fare | — | [P-F36](#p-f36) | [F36](mondo-clash-royale.md) |
| F37 | Clash Royale: esercizi su aggregazioni e sottoquery | F36 | Opus | Sol | `medium` | alto | da fare | — | [P-F37](#p-f37) | [F37](mondo-clash-royale.md) |
| F38 | Clash Royale: veste, icone e uscita dalla bozza | F35, F37 | Opus | Sol | `medium` | medio | da fare | — | [P-F38](#p-f38) | [F38](mondo-clash-royale.md) |

Le colonne «Claude» e «Codex» danno la famiglia del modello per ciascuno strumento, senza versione; `—` vuol dire che la fase gira solo sull’altro. L’effort è un’indicazione per Marco, che lo imposta all’apertura: nessuno dei due modelli lo legge.

Stati ammessi: `da fare`, `in corso`, `bloccata`, `completata`. Data di completamento nel formato `YYYY-MM-DD HH:mm`, fuso `Europe/Rome`.

Le stime di consumo sono qualitative: nessuna misura garantisce che una fase rientri in una finestra di cinque ore. Le fasi di esercizi («alto») occupano probabilmente più di una sessione e si riprendono dal capitolo in corso. F05 rivede le stime con i consumi reali di Stranger Things.

Ordine consigliato: l’ordine degli ID. Dentro ogni mondo: dominio (A), studio della veste (C), esercizi (B), veste (D); lo studio della veste viene subito dopo il dominio perché dipende solo da quello e gira solo su Claude, così gli esercizi possono andare su Codex se il budget di Claude è basso. I mondi seguono l’ordine di costruzione di `docs/mondi.md`: prima i facili, poi gli intermedi, infine i complessi. Dopo F05 la fase A di ogni mondo dipende solo da F05: se Marco lo chiede, due mondi possono avanzare insieme, perché il campo `draft` (F01) tiene fuori dal sito quelli non finiti.

## Prompt di apertura

Tutti i prompt condividono la stessa chiusura. I percorsi sono relativi alla radice del repo. Ogni prompt vale sia per Claude Code sia per Codex, salvo le fasi «solo Claude» (tipo C).

### Messaggio di chiusura

Regola della skill `piani-multisessione` (Marco, 2026-11-21), ripetuta qui per lo strumento che non ha la skill. L’ultimo messaggio di una sessione di fase contiene, in quest’ordine:

1. una frase che dice chiaramente che la fase è terminata (o perché non lo è) e che indice, dettaglio e `AGENTS.md` sono aggiornati, con esito, verifiche e hash del commit di chiusura;
2. la prossima fase consigliata, con lo strumento e il modello per ciascuno dei due (o «solo Claude»), scelta così: se la fase appena chiusa è segnata per la revisione incrociata, la sua revisione; altrimenti la prima fase dell’ordine consigliato non ancora `completata` le cui dipendenze sono tutte `completata`;
3. il prompt di apertura di quella fase in un blocco di codice `text`, copiato da questa sezione così com’è; per una revisione, il prompt della fase con la riga «ID e obiettivo» sostituita da `ID e obiettivo: revisione di F0X, eseguita con <strumento>.` e l’ultimo paragrafo da `Segui «Revisione incrociata» della skill piani-multisessione. Correggi solo i difetti; per le scelte discutibili chiedi a Marco.`, sull’altro strumento con lo stesso livello di modello.

Se la fase è rimasta `in corso` o `bloccata`, il prompt suggerito è quello della stessa fase, per riprenderla. Se il piano è concluso, dillo e non suggerire prompt.

### P-F01

```text
Modello: Claude Code → Sonnet · Codex → Terra
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Sonnet; se sei Codex, su Terra (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Fase: docs/plans/mondi-v1/F01-preparare-portale-mondi-nuovi.md
ID e obiettivo: F01 — Preparare il portale ai mondi nuovi.

La fase cambia che cosa arriva nel sito pubblicato: niente push e niente pubblicazione.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F02

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Ricetta: docs/plans/mondi-v1/ricetta.md, tipo A
Fase: docs/plans/mondi-v1/mondo-stranger-things.md, sezione «F02»
ID e obiettivo: F02 — Stranger Things: dominio, database e traccia.

La fase scrive testi per gli studenti: lavora in locale, dove `.claude/norms/` è raggiungibile. Fai approvare a Marco dominio e schema prima di scrivere i dati, e la traccia prima di chiudere.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F03

```text
Modello: solo Claude Code → Opus (la fase usa l’Artifact «Design»). Se sei Codex, fermati e dimmelo prima di qualsiasi lavoro.
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: verifica di girare su Opus, ignorando il numero di versione. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Ricetta: docs/plans/mondi-v1/ricetta.md, tipo C
Fase: docs/plans/mondi-v1/mondo-stranger-things.md, sezione «F03»
ID e obiettivo: F03 — Stranger Things: studio della veste.

Le tavole si disegnano con l’Artifact di tipo «Design» (tool Artifact, quickstart con intent "design"); mostra a Marco le tavole e attendi l’approvazione prima di scrivere la specifica. Nelle tavole usa solo icone RB già nel progetto: quelle nuove restano segnaposto per la fase della veste.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F04

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Ricetta: docs/plans/mondi-v1/ricetta.md, tipo B
Fase: docs/plans/mondi-v1/mondo-stranger-things.md, sezione «F04»
ID e obiettivo: F04 — Stranger Things: esercizi.

La fase scrive testi per gli studenti: lavora in locale, dove `.claude/norms/` è raggiungibile. Fai approvare a Marco la distribuzione degli esercizi prima di scriverli.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F05

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Ricetta: docs/plans/mondi-v1/ricetta.md, tipo D
Fase: docs/plans/mondi-v1/mondo-stranger-things.md, sezione «F05»
ID e obiettivo: F05 — Stranger Things: veste, icone e uscita dalla bozza.

Le icone nuove si disegnano solo su Claude Code con Opus, con la skill `icone-rb`: se sei Codex, usa quelle già nel progetto, lascia un segnaposto per le altre, non togliere `draft` e lascia la fase `in corso`.

Prima di chiudere rivedi `ricetta.md` e i file dei mondi successivi con quanto imparato su Stranger Things, come dice il dettaglio della fase.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F06

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Ricetta: docs/plans/mondi-v1/ricetta.md, tipo A
Fase: docs/plans/mondi-v1/mondo-dragon-ball.md, sezione «F06»
ID e obiettivo: F06 — Dragon Ball: dominio, database e traccia.

La fase scrive testi per gli studenti: lavora in locale, dove `.claude/norms/` è raggiungibile. Fai approvare a Marco dominio e schema prima di scrivere i dati, e la traccia prima di chiudere.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F07

```text
Modello: solo Claude Code → Opus (la fase usa l’Artifact «Design»). Se sei Codex, fermati e dimmelo prima di qualsiasi lavoro.
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: verifica di girare su Opus, ignorando il numero di versione. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Ricetta: docs/plans/mondi-v1/ricetta.md, tipo C
Fase: docs/plans/mondi-v1/mondo-dragon-ball.md, sezione «F07»
ID e obiettivo: F07 — Dragon Ball: studio della veste.

Le tavole si disegnano con l’Artifact di tipo «Design» (tool Artifact, quickstart con intent "design"); mostra a Marco le tavole e attendi l’approvazione prima di scrivere la specifica. Nelle tavole usa solo icone RB già nel progetto: quelle nuove restano segnaposto per la fase della veste.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F08

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Ricetta: docs/plans/mondi-v1/ricetta.md, tipo B
Fase: docs/plans/mondi-v1/mondo-dragon-ball.md, sezione «F08»
ID e obiettivo: F08 — Dragon Ball: esercizi.

La fase scrive testi per gli studenti: lavora in locale, dove `.claude/norms/` è raggiungibile. Fai approvare a Marco la distribuzione degli esercizi prima di scriverli.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F09

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Ricetta: docs/plans/mondi-v1/ricetta.md, tipo D
Fase: docs/plans/mondi-v1/mondo-dragon-ball.md, sezione «F09»
ID e obiettivo: F09 — Dragon Ball: veste, icone e uscita dalla bozza.

Le icone nuove si disegnano solo su Claude Code con Opus, con la skill `icone-rb`: se sei Codex, usa quelle già nel progetto, lascia un segnaposto per le altre, non togliere `draft` e lascia la fase `in corso`.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F10

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Ricetta: docs/plans/mondi-v1/ricetta.md, tipo A
Fase: docs/plans/mondi-v1/mondo-sherlock-holmes.md, sezione «F10»
ID e obiettivo: F10 — Sherlock Holmes: dominio, database e traccia.

La fase scrive testi per gli studenti: lavora in locale, dove `.claude/norms/` è raggiungibile. Fai approvare a Marco dominio e schema prima di scrivere i dati, e la traccia prima di chiudere.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F11

```text
Modello: solo Claude Code → Opus (la fase usa l’Artifact «Design»). Se sei Codex, fermati e dimmelo prima di qualsiasi lavoro.
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: verifica di girare su Opus, ignorando il numero di versione. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Ricetta: docs/plans/mondi-v1/ricetta.md, tipo C
Fase: docs/plans/mondi-v1/mondo-sherlock-holmes.md, sezione «F11»
ID e obiettivo: F11 — Sherlock Holmes: studio della veste.

Le tavole si disegnano con l’Artifact di tipo «Design» (tool Artifact, quickstart con intent "design"); mostra a Marco le tavole e attendi l’approvazione prima di scrivere la specifica. Nelle tavole usa solo icone RB già nel progetto: quelle nuove restano segnaposto per la fase della veste.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F12

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Ricetta: docs/plans/mondi-v1/ricetta.md, tipo B
Fase: docs/plans/mondi-v1/mondo-sherlock-holmes.md, sezione «F12»
ID e obiettivo: F12 — Sherlock Holmes: esercizi.

La fase scrive testi per gli studenti: lavora in locale, dove `.claude/norms/` è raggiungibile. Fai approvare a Marco la distribuzione degli esercizi prima di scriverli.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F13

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Ricetta: docs/plans/mondi-v1/ricetta.md, tipo D
Fase: docs/plans/mondi-v1/mondo-sherlock-holmes.md, sezione «F13»
ID e obiettivo: F13 — Sherlock Holmes: veste, icone e uscita dalla bozza.

Le icone nuove si disegnano solo su Claude Code con Opus, con la skill `icone-rb`: se sei Codex, usa quelle già nel progetto, lascia un segnaposto per le altre, non togliere `draft` e lascia la fase `in corso`.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F14

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Ricetta: docs/plans/mondi-v1/ricetta.md, tipo A
Fase: docs/plans/mondi-v1/mondo-one-piece.md, sezione «F14»
ID e obiettivo: F14 — One Piece: dominio, database e traccia.

La fase scrive testi per gli studenti: lavora in locale, dove `.claude/norms/` è raggiungibile. Fai approvare a Marco dominio e schema prima di scrivere i dati, e la traccia prima di chiudere.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F15

```text
Modello: solo Claude Code → Opus (la fase usa l’Artifact «Design»). Se sei Codex, fermati e dimmelo prima di qualsiasi lavoro.
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: verifica di girare su Opus, ignorando il numero di versione. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Ricetta: docs/plans/mondi-v1/ricetta.md, tipo C
Fase: docs/plans/mondi-v1/mondo-one-piece.md, sezione «F15»
ID e obiettivo: F15 — One Piece: studio della veste.

Le tavole si disegnano con l’Artifact di tipo «Design» (tool Artifact, quickstart con intent "design"); mostra a Marco le tavole e attendi l’approvazione prima di scrivere la specifica. Nelle tavole usa solo icone RB già nel progetto: quelle nuove restano segnaposto per la fase della veste.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F16

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Ricetta: docs/plans/mondi-v1/ricetta.md, tipo B, prima parte
Fase: docs/plans/mondi-v1/mondo-one-piece.md, sezione «F16»
ID e obiettivo: F16 — One Piece: esercizi su una tabella e join.

La fase scrive testi per gli studenti: lavora in locale, dove `.claude/norms/` è raggiungibile. Fai approvare a Marco la distribuzione degli esercizi di tutto il mondo prima di scriverli.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F17

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Ricetta: docs/plans/mondi-v1/ricetta.md, tipo B, seconda parte
Fase: docs/plans/mondi-v1/mondo-one-piece.md, sezione «F17»
ID e obiettivo: F17 — One Piece: esercizi su aggregazioni e sottoquery.

La fase scrive testi per gli studenti: lavora in locale, dove `.claude/norms/` è raggiungibile. Segui la distribuzione approvata nella fase precedente.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F18

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Ricetta: docs/plans/mondi-v1/ricetta.md, tipo D
Fase: docs/plans/mondi-v1/mondo-one-piece.md, sezione «F18»
ID e obiettivo: F18 — One Piece: veste, icone e uscita dalla bozza.

Le icone nuove si disegnano solo su Claude Code con Opus, con la skill `icone-rb`: se sei Codex, usa quelle già nel progetto, lascia un segnaposto per le altre, non togliere `draft` e lascia la fase `in corso`.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F19

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Ricetta: docs/plans/mondi-v1/ricetta.md, tipo A
Fase: docs/plans/mondi-v1/mondo-lego.md, sezione «F19»
ID e obiettivo: F19 — Lego: dominio, database e traccia.

La fase scrive testi per gli studenti: lavora in locale, dove `.claude/norms/` è raggiungibile. Fai approvare a Marco dominio e schema prima di scrivere i dati, e la traccia prima di chiudere.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F20

```text
Modello: solo Claude Code → Opus (la fase usa l’Artifact «Design»). Se sei Codex, fermati e dimmelo prima di qualsiasi lavoro.
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: verifica di girare su Opus, ignorando il numero di versione. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Ricetta: docs/plans/mondi-v1/ricetta.md, tipo C
Fase: docs/plans/mondi-v1/mondo-lego.md, sezione «F20»
ID e obiettivo: F20 — Lego: studio della veste.

Le tavole si disegnano con l’Artifact di tipo «Design» (tool Artifact, quickstart con intent "design"); mostra a Marco le tavole e attendi l’approvazione prima di scrivere la specifica. Nelle tavole usa solo icone RB già nel progetto: quelle nuove restano segnaposto per la fase della veste.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F21

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Ricetta: docs/plans/mondi-v1/ricetta.md, tipo B, prima parte
Fase: docs/plans/mondi-v1/mondo-lego.md, sezione «F21»
ID e obiettivo: F21 — Lego: esercizi su una tabella e join.

La fase scrive testi per gli studenti: lavora in locale, dove `.claude/norms/` è raggiungibile. Fai approvare a Marco la distribuzione degli esercizi di tutto il mondo prima di scriverli.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F22

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Ricetta: docs/plans/mondi-v1/ricetta.md, tipo B, seconda parte
Fase: docs/plans/mondi-v1/mondo-lego.md, sezione «F22»
ID e obiettivo: F22 — Lego: esercizi su aggregazioni e sottoquery.

La fase scrive testi per gli studenti: lavora in locale, dove `.claude/norms/` è raggiungibile. Segui la distribuzione approvata nella fase precedente.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F23

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Ricetta: docs/plans/mondi-v1/ricetta.md, tipo D
Fase: docs/plans/mondi-v1/mondo-lego.md, sezione «F23»
ID e obiettivo: F23 — Lego: veste, icone e uscita dalla bozza.

Le icone nuove si disegnano solo su Claude Code con Opus, con la skill `icone-rb`: se sei Codex, usa quelle già nel progetto, lascia un segnaposto per le altre, non togliere `draft` e lascia la fase `in corso`.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F24

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Ricetta: docs/plans/mondi-v1/ricetta.md, tipo A
Fase: docs/plans/mondi-v1/mondo-pokemon.md, sezione «F24»
ID e obiettivo: F24 — Pokémon: dominio, database e traccia.

La fase scrive testi per gli studenti: lavora in locale, dove `.claude/norms/` è raggiungibile. Fai approvare a Marco dominio e schema prima di scrivere i dati, e la traccia prima di chiudere.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F25

```text
Modello: solo Claude Code → Opus (la fase usa l’Artifact «Design»). Se sei Codex, fermati e dimmelo prima di qualsiasi lavoro.
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: verifica di girare su Opus, ignorando il numero di versione. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Ricetta: docs/plans/mondi-v1/ricetta.md, tipo C
Fase: docs/plans/mondi-v1/mondo-pokemon.md, sezione «F25»
ID e obiettivo: F25 — Pokémon: studio della veste.

Le tavole si disegnano con l’Artifact di tipo «Design» (tool Artifact, quickstart con intent "design"); mostra a Marco le tavole e attendi l’approvazione prima di scrivere la specifica. Nelle tavole usa solo icone RB già nel progetto: quelle nuove restano segnaposto per la fase della veste.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F26

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Ricetta: docs/plans/mondi-v1/ricetta.md, tipo B, prima parte
Fase: docs/plans/mondi-v1/mondo-pokemon.md, sezione «F26»
ID e obiettivo: F26 — Pokémon: esercizi su una tabella e join.

La fase scrive testi per gli studenti: lavora in locale, dove `.claude/norms/` è raggiungibile. Fai approvare a Marco la distribuzione degli esercizi di tutto il mondo prima di scriverli.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F27

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Ricetta: docs/plans/mondi-v1/ricetta.md, tipo B, seconda parte
Fase: docs/plans/mondi-v1/mondo-pokemon.md, sezione «F27»
ID e obiettivo: F27 — Pokémon: esercizi su aggregazioni e sottoquery.

La fase scrive testi per gli studenti: lavora in locale, dove `.claude/norms/` è raggiungibile. Segui la distribuzione approvata nella fase precedente.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F28

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Ricetta: docs/plans/mondi-v1/ricetta.md, tipo D
Fase: docs/plans/mondi-v1/mondo-pokemon.md, sezione «F28»
ID e obiettivo: F28 — Pokémon: veste, icone e uscita dalla bozza.

Le icone nuove si disegnano solo su Claude Code con Opus, con la skill `icone-rb`: se sei Codex, usa quelle già nel progetto, lascia un segnaposto per le altre, non togliere `draft` e lascia la fase `in corso`.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F29

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Ricetta: docs/plans/mondi-v1/ricetta.md, tipo A
Fase: docs/plans/mondi-v1/mondo-magic.md, sezione «F29»
ID e obiettivo: F29 — Magic: The Gathering: dominio, database e traccia.

La fase scrive testi per gli studenti: lavora in locale, dove `.claude/norms/` è raggiungibile. Fai approvare a Marco dominio e schema prima di scrivere i dati, e la traccia prima di chiudere.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F30

```text
Modello: solo Claude Code → Opus (la fase usa l’Artifact «Design»). Se sei Codex, fermati e dimmelo prima di qualsiasi lavoro.
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: verifica di girare su Opus, ignorando il numero di versione. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Ricetta: docs/plans/mondi-v1/ricetta.md, tipo C
Fase: docs/plans/mondi-v1/mondo-magic.md, sezione «F30»
ID e obiettivo: F30 — Magic: The Gathering: studio della veste.

Le tavole si disegnano con l’Artifact di tipo «Design» (tool Artifact, quickstart con intent "design"); mostra a Marco le tavole e attendi l’approvazione prima di scrivere la specifica. Nelle tavole usa solo icone RB già nel progetto: quelle nuove restano segnaposto per la fase della veste.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F31

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Ricetta: docs/plans/mondi-v1/ricetta.md, tipo B, prima parte
Fase: docs/plans/mondi-v1/mondo-magic.md, sezione «F31»
ID e obiettivo: F31 — Magic: The Gathering: esercizi su una tabella e join.

La fase scrive testi per gli studenti: lavora in locale, dove `.claude/norms/` è raggiungibile. Fai approvare a Marco la distribuzione degli esercizi di tutto il mondo prima di scriverli.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F32

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Ricetta: docs/plans/mondi-v1/ricetta.md, tipo B, seconda parte
Fase: docs/plans/mondi-v1/mondo-magic.md, sezione «F32»
ID e obiettivo: F32 — Magic: The Gathering: esercizi su aggregazioni e sottoquery.

La fase scrive testi per gli studenti: lavora in locale, dove `.claude/norms/` è raggiungibile. Segui la distribuzione approvata nella fase precedente.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F33

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Ricetta: docs/plans/mondi-v1/ricetta.md, tipo D
Fase: docs/plans/mondi-v1/mondo-magic.md, sezione «F33»
ID e obiettivo: F33 — Magic: The Gathering: veste, icone e uscita dalla bozza.

Le icone nuove si disegnano solo su Claude Code con Opus, con la skill `icone-rb`: se sei Codex, usa quelle già nel progetto, lascia un segnaposto per le altre, non togliere `draft` e lascia la fase `in corso`.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F34

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Ricetta: docs/plans/mondi-v1/ricetta.md, tipo A
Fase: docs/plans/mondi-v1/mondo-clash-royale.md, sezione «F34»
ID e obiettivo: F34 — Clash Royale: dominio, database e traccia.

La fase scrive testi per gli studenti: lavora in locale, dove `.claude/norms/` è raggiungibile. Fai approvare a Marco dominio e schema prima di scrivere i dati, e la traccia prima di chiudere.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F35

```text
Modello: solo Claude Code → Opus (la fase usa l’Artifact «Design»). Se sei Codex, fermati e dimmelo prima di qualsiasi lavoro.
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: verifica di girare su Opus, ignorando il numero di versione. Se non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Ricetta: docs/plans/mondi-v1/ricetta.md, tipo C
Fase: docs/plans/mondi-v1/mondo-clash-royale.md, sezione «F35»
ID e obiettivo: F35 — Clash Royale: studio della veste.

Le tavole si disegnano con l’Artifact di tipo «Design» (tool Artifact, quickstart con intent "design"); mostra a Marco le tavole e attendi l’approvazione prima di scrivere la specifica. Nelle tavole usa solo icone RB già nel progetto: quelle nuove restano segnaposto per la fase della veste.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F36

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Ricetta: docs/plans/mondi-v1/ricetta.md, tipo B, prima parte
Fase: docs/plans/mondi-v1/mondo-clash-royale.md, sezione «F36»
ID e obiettivo: F36 — Clash Royale: esercizi su una tabella e join.

La fase scrive testi per gli studenti: lavora in locale, dove `.claude/norms/` è raggiungibile. Fai approvare a Marco la distribuzione degli esercizi di tutto il mondo prima di scriverli.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F37

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Ricetta: docs/plans/mondi-v1/ricetta.md, tipo B, seconda parte
Fase: docs/plans/mondi-v1/mondo-clash-royale.md, sezione «F37»
ID e obiettivo: F37 — Clash Royale: esercizi su aggregazioni e sottoquery.

La fase scrive testi per gli studenti: lavora in locale, dove `.claude/norms/` è raggiungibile. Segui la distribuzione approvata nella fase precedente.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```

### P-F38

```text
Modello: Claude Code → Opus · Codex → Sol
Effort consigliato: medium (lo imposta Marco; il modello non lo verifica)

Controllo iniziale: se sei Claude, verifica di girare su Opus; se sei Codex, su Sol (leggi `model` in ~/.codex/config.toml: è il predefinito, vale salvo una scelta diversa di Marco all’apertura). Ignora il numero di versione. Se il modello non coincide, fermati e dimmelo prima di qualsiasi lavoro; se non puoi saperlo, dichiaralo e procedi.

Piano: docs/plans/mondi-v1/README.md
Ricetta: docs/plans/mondi-v1/ricetta.md, tipo D
Fase: docs/plans/mondi-v1/mondo-clash-royale.md, sezione «F38»
ID e obiettivo: F38 — Clash Royale: veste, icone e uscita dalla bozza.

Le icone nuove si disegnano solo su Claude Code con Opus, con la skill `icone-rb`: se sei Codex, usa quelle già nel progetto, lascia un segnaposto per le altre, non togliere `draft` e lascia la fase `in corso`.

Verifica le istruzioni del repository, le dipendenze della fase e lo stato del lavoro esistente. Esegui solo questa fase. Al termine esegui i criteri di accettazione, aggiorna indice e dettaglio, crea il commit di chiusura e riporta esito, verifiche e hash del commit. Chiudi come indica «Messaggio di chiusura» nell’indice del piano: fase terminata e annotata, prossima fase consigliata e il suo prompt di apertura in un blocco di codice.
```
## Obiettivo

Portare nel portale gli otto mondi di `docs/mondi.md`, scelti da Marco il 2026-11-23 e rivisti il 2026-11-24, uno alla volta e ciascuno completo nelle sei sezioni: tre facili (Stranger Things, Dragon Ball, Sherlock Holmes), tre intermedi (One Piece, Lego, Pokémon), due complessi (Magic: The Gathering, Clash Royale). Con Star Wars e Il Signore degli Anelli il portale arriva a dieci mondi.

Un mondo è finito quando la sua fase D è `completata`: veste applicata, campo `draft` tolto, dati della classifica rigenerati. La pubblicazione resta a Marco.

Fuori dal piano: CTF (in un piano proprio, sui due mondi complessi), gradi e traguardi, modifiche al codice comune oltre a F01. Marco può cambiare opera durante la costruzione (`docs/mondi.md`): in quel caso il file del mondo si riscrive prima della sua fase A, con nuovi ID se le fasi erano già avviate.

## Vincoli

Restano quelli dei piani precedenti ([`portale-v2`](../portale-v2/README.md#vincoli) e, da lì, [`archivio/portale-v1`](../archivio/portale-v1/README.md)): sito statico senza dati personali (studenti minorenni), solo RB Icons, dialetto SQLite, nessun push e nessuna pubblicazione senza il via di Marco, lavoro su `dev`, nessuna migrazione distruttiva dei progressi.

In più:

- Un mondo nuovo tocca solo `themes/<id>/` e i file nominati dalla ricetta. Un file comune da cambiare è un difetto del contratto: ci si ferma e si chiede a Marco (`ricetta.md`, «Regole comuni»).
- Dopo la pubblicazione di un mondo, l’`id` del tema e quelli degli esercizi non cambiano e non si tolgono.
- Opere protette: nomi e ambientazioni sì; immagini, caratteri ufficiali e testi copiati no; loghi ed emblemi solo come icone RB stilizzate.

## Autonomia concordata

**Bilanciata** (Marco, 2026-11-23): chiedi sulle decisioni strutturali (dominio, schema, distribuzione degli esercizi, direzione della veste), risolvi da solo i dettagli locali e reversibili. Chiedi sempre prima di cambiare requisiti o ampliare il perimetro.

## Strategia dei modelli

Ogni fase gira su Claude Code o su Codex, a scelta di Marco. Le regole generali sono nella skill `piani-multisessione` (sorgente in `~/Developer/github/norms/skills/piani-multisessione/`): Fable ↔ Astra, Opus ↔ Sol, Sonnet ↔ Terra, Haiku ↔ Luna. I modelli si indicano senza versione; l’effort è solo un’indicazione per Marco.

- **Fable escluso** su Claude; budget ampio, come in `portale-v2` (Marco, 2026-11-23). Nessuna fase richiede il livello più alto.
- **Opus o Sol, `medium`**, per le fasi A, B e D: si decide la forma di un database, si scrivono testi per gli studenti, si giudica il risultato di ogni query, si applica una veste confrontandola con le tavole. È il livello usato per i due mondi esistenti (F09, F21, F22 del piano archiviato).
- **Solo Claude, Opus `medium`**, per le fasi C: l’Artifact «Design» esiste solo su Claude.
- **Icone nuove solo su Claude Opus** (Marco, 2026-11-21): una fase D su Codex usa le icone esistenti, lascia segnaposto per le altre e resta `in corso` finché una sessione Claude non le disegna.
- **Sonnet o Terra, `medium`**, per F01: forma decisa in questo piano.
- **Subagent**: le ricerche sui dati delle opere (fasi A) e la lettura di pagine lunghe vanno al livello più economico (Haiku, Luna), con la richiesta di riportare valore e URL; il giudizio resta al modello principale.
- **Revisione incrociata**: solo F01, che decide che cosa arriva nel sito pubblicato. Le fasi dei mondi non toccano dati degli studenti né servizi in produzione; la correttezza degli esercizi la controlla `npm run check:themes` con i controlli di qualità di F19 di `portale-v2`.
- Se una fase non riesce: prima rendi verificabile il lavoro (script sulle query, `npm run check:themes`), poi alza l’effort a `high`, poi dividi la fase.

## Decisioni condivise

Le decisioni dei piani precedenti restano valide: «Decisioni condivise» di [`portale-v2`](../portale-v2/README.md#decisioni-condivise) e del piano archiviato. Qui solo le nuove, prese con Marco il 2026-11-23 e il 2026-11-24.

| Decisione | Scelta | Motivo |
| --- | --- | --- |
| Ricetta | Quattro tipi di fase per mondo: A dominio, database e traccia; C studio della veste; B esercizi (due fasi nei mondi intermedi e complessi); D veste, icone e uscita dalla bozza. Dettaglio completo per Stranger Things, il primo; per gli altri un abbozzo da rifinire dopo il primo | Schema e dati stanno in A perché traccia, ER e modello logico descrivono quel database; gli esercizi di un mondo intermedio sono troppi per una sessione (F21 del piano archiviato) |
| Mondi in bozza | Campo `draft: true` nel manifest: il mondo si vede con `npm run dev`, non nel sito costruito né nei dati della classifica; la fase D lo toglie (F01) | Marco può pubblicare `dev` in ogni momento, anche con un mondo a metà |
| Tavolo delle locandine | Posizioni e inclinazioni casuali a ogni lancio e con «Rimescola»; ordine del mucchio per livello, facili sopra e complessi sotto, casuale dentro il livello; il mazzo a 375 px comincia dai facili (F01) | Concilia l’idea di Marco di locandine da scoprire smanettando con i mondi facili consigliati per cominciare |
| CTF | Fuori da questo piano, in un piano proprio | Restano legate ai due mondi complessi, che questo piano costruisce per ultimi |
| Rosa dei mondi | Rivista il 2026-11-24: Lego entra come intermedio al posto di Minecraft; Magic: The Gathering e Clash Royale diventano i complessi; Dragon Ball passa a facile, Pokémon a intermedio; escono Minecraft, Divina Commedia e Mitologia greca, riserve per gli esercizi del libro o per mondi aggiuntivi con CTF (`docs/mondi.md`) | Scelta di Marco: mondi più vicini ai ragazzi e database reali vasti per i complessi |
| Nome del piano | `mondi-v1` | — |

## Pubblicazione di un mondo

Quando la fase D di un mondo è `completata`, Marco decide se pubblicare:

1. merge di `dev` in `main` (il workflow `pubblica.yml` costruisce e pubblica);
2. ripubblicazione del servizio della classifica (`servizi/classifica/`), senza cui gli esercizi del mondo non entrano in classifica;
3. prova sul sito pubblicato: locandina, sei sezioni, un esercizio risolto con lo zaino.

La sessione di fase si ferma prima del punto 1 e lo ricorda nel messaggio di chiusura.

## Icone

Procedimento e regole sono quelli della sezione «Icone» del piano archiviato ([`archivio/portale-v1/README.md`](../archivio/portale-v1/README.md#icone)): ogni icona passa dalla skill `icone-rb`, le nuove si disegnano su Claude Opus (mai su Codex) e Marco le approva sul render a 128 px, i commit delle icone vanno nel repo `~/Developer/github/icone` su `dev`. Prima di cercare un’icona controlla i registri di `portale-v2` e del piano archiviato.

### Registro icone

Una riga per icona nuova o con un uso nuovo, compilata dalla fase D che la usa.

| Icona | Uso nel portale | Fase | Origine | Esito |
| --- | --- | --- | --- | --- |

## Aggiornamenti di stato

| Data | Nota |
| --- | --- |
| 2026-11-24 | Piano scritto con Marco (Claude Code, Opus): ricetta in quattro tipi di fase, F01 per mondi in bozza e mucchio per livello, rosa dei mondi rivista (decisione «Rosa dei mondi»), dettaglio completo per Stranger Things, abbozzi per gli altri sette mondi. CTF fuori dal piano. Nessuna fase avviata. |
