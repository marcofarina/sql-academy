# F01 — Chiudere la pubblicazione del portale

- **Modello / effort:** Sonnet 5.5 `medium`. Procedura nota, nessuna forma da decidere.
- **Dipendenze:** nessuna. Riprende il «Residuo» di F10 del piano archiviato ([`archivio/portale-v1/F10-pubblicare-github-pages.md`](../archivio/portale-v1/F10-pubblicare-github-pages.md), sezione 6).
- **Consumo stimato:** basso.
- **Incertezza:** bassa sul lavoro; la fase si ferma più volte in attesa del via di Marco, e la prova dello zaino su due browser può richiedere il suo aiuto.
- **Punto di ripresa:** ogni passo della procedura manuale annotato nel passaggio di consegne con il suo esito.

## 1. Obiettivo e risultato atteso

La pubblicazione del portale è verificata sul sito vero: i due temi funzionano, lo zaino porta un esercizio risolto da un browser all’altro, la classifica assegna un nome. Il branch predefinito del repo è deciso e il testo del link dal libro è pronto per Marco.

## 2. Contesto minimo

- Verificato il 2026-11-21: `https://sql.rainbowbits.cloud/` risponde `200`, certificato `approved`, `https_enforced: true`; branch predefinito del repo `dev`.
- Procedura manuale da eseguire: sezione 5 di F10 del piano archiviato.
- Lo zaino usa la cifratura del browser, disponibile solo in HTTPS: per questo la procedura non era stata eseguita.

## 3. Perimetro

Dentro: procedura manuale sul sito pubblicato, branch predefinito del repo su GitHub, testo del link dal libro.

Fuori: ogni modifica al codice del portale (i difetti trovati si annotano e diventano fasi o correzioni concordate con Marco); il commit del link nel repo `python-doesnt-byte`, che fa Marco.

## 4. Attività di implementazione

1. Ripeti le verifiche: `curl -s -o /dev/null -w '%{http_code}\n' https://sql.rainbowbits.cloud/` e `gh api repos/marcofarina/sql-academy/pages --jq '{https_enforced, s: .https_certificate.state}'`.
2. **Con il via di Marco**, esegui la procedura manuale sul sito pubblicato: apri entrambi i temi, esegui una query nella sandbox, risolvi un esercizio, ricarica una pagina interna (`#/star-wars/sandbox`); apri uno zaino creato nel libro e controlla che l’esercizio risolto compaia su un secondo browser (il pannello del browser integrato e Chrome sono due browser distinti); attiva la classifica e controlla il nome nella pagina della classifica. Al termine chiedi a Marco se tenere o togliere dalla classifica l’iscrizione di prova.
3. Chiedi a Marco se rendere `main` il branch predefinito del repo. Con il suo via: `gh repo edit marcofarina/sql-academy --default-branch main`.
4. Consegna a Marco il testo del link dal libro, già proposto in F10: nell’introduzione del *Manuale dell’Archivista* (`volumes/archivista/intro.mdx`) e nella pagina dello zaino, «Allenati con le query su [SQL Academy](https://sql.rainbowbits.cloud/), il portale di esercizi che accompagna questo volume.» Ricordagli che in PDB il `dev` locale è avanti rispetto a `origin/dev` (stato al 2026-11-20; ricontrolla con `git -C ~/Developer/github/python-doesnt-byte status -sb`).
5. Aggiorna la tabella «Stato» di `AGENTS.md`: F10 del piano archiviato chiusa da questa fase.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `curl -s -o /dev/null -w '%{http_code}\n' https://sql.rainbowbits.cloud/` | `200` |
| `gh api repos/marcofarina/sql-academy/pages --jq .https_enforced` | `true` |
| `gh repo view marcofarina/sql-academy --json defaultBranchRef --jq .defaultBranchRef.name` | il branch scelto da Marco |

Procedura manuale: i passi del punto 2, ciascuno con esito superato o non superato nel passaggio di consegne.

## 6. Passaggio di consegne

Da compilare a fine fase: esito, verifiche, difetti trovati sul sito, decisioni di Marco, lavoro residuo.
