# F10 — Pubblicare su GitHub Pages e collegare il libro

- **Modello / effort:** Sonnet 5.5 `medium`. Procedura nota, forma già decisa.
- **Dipendenze:** F07, F09, F14, F15, F17, F18, F19, F20, F21, F22 (le ultime cinque dal feedback di Marco su F09, 2026-11-18). Punti, zaino e classifica entrano prima della pubblicazione: la scelta di non migrare i progressi della versione 1 vale solo finché il portale non è online (Marco, 2026-11-17).
- **Consumo stimato:** basso.
- **Incertezza:** bassa sul lavoro, ma la fase si ferma più volte in attesa del via di Marco.
- **Punto di ripresa:** workflow scritto e build di produzione verificata in locale, prima di qualunque push.

## 1. Obiettivo e risultato atteso

Il portale è raggiungibile su GitHub Pages da un repo pubblico, con un link al *Manuale dell’Archivista* e un link di ritorno dal libro.

## 2. Contesto minimo

- `AGENTS.md`, sezione «Convenzioni»: nessun push e nessuna pubblicazione senza il via di Marco; il merge in `main` lo chiede Marco.
- Sito del libro: `https://rainbowbits.cloud/python-doesnt-byte/` (verificato il 2026-11-16 con `gh repo view marcofarina/python-doesnt-byte --json homepageUrl`).

## 3. Perimetro

Dentro: `vite.config.ts` (`base`), workflow in `.github/workflows/`, `README.md`, file di licenza, creazione del remote, link al libro nel portale.

Dentro anche: l’origine di produzione del portale nel CORS dello zaino di PDB (`servizi/zaino/src/index.ts` nel repo `python-doesnt-byte`) e in quello della classifica (`servizi/classifica/`), con un nuovo deploy di ciascuno.

Dentro anche (da F15): un’informativa sulla privacy raggiungibile dal portale, che è un sito diverso dal libro. Dal 2026-11-19 la privacy policy del libro descrive i progressi di SQL Academy nello zaino, ma non l’uso di `localStorage` del portale né la classifica: decidi con Marco se linkarla o scriverne una per il portale.

Fuori: dominio personalizzato, statistiche di accesso (nessuna: gli studenti sono minori). Il link dal libro al portale è una modifica al repo `python-doesnt-byte`: descrivila a Marco, non farla da questa sessione.

## 4. Attività di implementazione

1. Chiedi a Marco: nome del repo su GitHub, licenza del codice e dei contenuti, se pubblicare da `main` dopo il merge.
2. Controlla che il repo sia pubblicabile: nessuna icona Font Awesome (`grep -rl 'Font Awesome' .` escluso `node_modules`), nessun file `.env`, licenze dei caratteri presenti, nessun dato personale.
3. Imposta `base` in `vite.config.ts` sul percorso del repo e verifica la build con `npm run build && npx vite preview`.
4. Scrivi il workflow: installazione, `npm run lint`, `npm test`, `npm run check:themes`, `npm run build`, pubblicazione su Pages.
5. Aggiungi nel portale il link al libro e una pagina di informazioni: che cos’è il portale, dove stanno i progressi (rimanda all’informativa di F17), che i temi non sono affiliati ai titolari delle opere.
6. **Con il via di Marco**, in quest’ordine e chiedendo a ogni passo: crea il repo pubblico e il remote; push di `dev`; merge in `main`; attivazione di Pages.
7. **Con il via di Marco:** a Pages attivo, aggiungi l’origine di produzione al CORS dello zaino di PDB e della classifica, commit nei rispettivi repo e deploy dei due Worker. La classifica non è mai stata pubblicata (F16): prima del deploy `npx wrangler d1 create sql-academy-classifica`, id nel `wrangler.toml`, `npx wrangler d1 migrations apply sql-academy-classifica --remote`, `routes` attivo su `sql-classifica.rainbowbits.cloud`; dopo, `npm run prova -- https://sql-classifica.rainbowbits.cloud` in `servizi/classifica`. Nel workflow conviene anche `node scripts/classifica-dati.ts --controlla`.
8. Prima della pubblicazione, chiedi a Marco se ha creato la casella `privacy@rainbowbits.cloud`, citata dall’informativa del portale (F17).
9. Aggiorna la tabella «Stato» di `AGENTS.md` con l’indirizzo del sito.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm run lint && npm test && npm run check:themes && npm run build` | Nessun errore |
| `gh repo view --json visibility` | `PUBLIC` |
| `gh run list --limit 1` | Ultima esecuzione del workflow riuscita |
| `curl -s -o /dev/null -w '%{http_code}\n' <indirizzo del sito>` | `200` |

Procedura manuale sul sito pubblicato: apri entrambi i temi, esegui una query nella sandbox, risolvi un esercizio, ricarica una pagina interna (`#/star-wars/sandbox`); apri uno zaino creato nel libro e controlla che l’esercizio risolto compaia su un secondo browser; attiva la classifica e controlla il nome nella pagina della classifica.

## 6. Passaggio di consegne

Stato al 2026-11-20 01:00: **in corso**, eseguita su Opus 5.5 per scelta di Marco (il prompt chiedeva Sonnet 5.5). Sito pubblicato; restano il certificato HTTPS e la procedura manuale.

### Scelte di Marco (2026-11-20)

- Repo pubblico `marcofarina/sql-academy`; dominio proprio `sql.rainbowbits.cloud` (CNAME `sql` → `marcofarina.github.io`, aggiunto da Marco nel DNS di Cloudflare).
- Licenze come PDB: MIT per il codice (`LICENSE-MIT`), CC BY-NC-SA 4.0 per i contenuti (`LICENSE`).
- Pubblicazione da `main` con il workflow `.github/workflows/pubblica.yml`; si lavora su `dev`.
- Casella `privacy@rainbowbits.cloud` già esistente; l’informativa resta quella del portale (`#/informativa`, F17), che rimanda alla privacy policy del libro per lo zaino.

### Fatto

- Commit `bbe2da3`: workflow (lint, test, `check:themes`, `classifica-dati.ts --controlla`, build, Pages), licenze, sezioni «Pubblicazione» e «Licenza» del README, origine di produzione nel CORS della classifica, nota sui titolari delle opere e link «I tuoi dati» nel piè di pagina della home (su schermo stretto il piè di pagina va sotto il mazzo), informativa corretta («codice di quattro parole»). `base: './'` era già adatto e non è cambiato. Nessuna pagina di informazioni a parte: bastano piè di pagina e informativa.
- Con il via di Marco, un passo alla volta: repo pubblico e remote `origin`; push di `dev`; merge *fast-forward* in `main` e push; Pages da workflow con dominio `sql.rainbowbits.cloud`. L’ambiente `github-pages` ammetteva solo il branch predefinito (`dev`, il primo arrivato): aggiunta la regola per `main`.
- Con il via di Marco: in PDB commit `f007a51` su `dev` (origine `https://sql.rainbowbits.cloud` nel CORS dello zaino) e deploy di `pdb-zaino` (versione `0bfb2585`); D1 `sql-academy-classifica` creato (id `37a43a09-1d24-4eb8-892f-e436f10da43b`), migrazioni 0001 e 0002 applicate in remoto, deploy di `sql-academy-classifica` su `sql-classifica.rainbowbits.cloud` (versione `3c6785f9`). Il primo deploy di un Worker nuovo fallisce con `code: 10007` per un ritardo di propagazione: si aspetta un minuto e si ripete.

### Verifiche

| Verifica | Esito |
| --- | --- |
| `npm run lint && npm test && npm run check:themes && npm run build` | superata (212 test; 150 e 140 esercizi, 0 problemi) |
| `gh repo view --json visibility` | superata: `PUBLIC` |
| `gh run list --limit 1` | superata: esecuzione `44643935472` riuscita |
| `curl` su `http://sql.rainbowbits.cloud/` | superata: `200`, titolo «SQL Academy» |
| `curl` su `https://sql.rainbowbits.cloud/` | **non superata**: certificato non ancora emesso da GitHub |
| `npm run prova -- https://sql-classifica.rainbowbits.cloud` | superata: 31 su 31; D1 ripulito dopo la prova |
| Preflight CORS da `https://sql.rainbowbits.cloud` verso zaino e classifica | superata: `204` con `Allow-Origin` |
| Home a 1280 e a 375 px sulla build di produzione | superata |
| Procedura manuale sul sito pubblicato | **non eseguita**: lo zaino usa la cifratura del browser, disponibile solo in HTTPS |

### Residuo

1. Quando GitHub emette il certificato: attivare «Enforce HTTPS» (`gh api -X PUT repos/marcofarina/sql-academy/pages -F https_enforced=true`), ripetere il `curl` in HTTPS ed eseguire la procedura manuale della sezione 5.
2. Decidere con Marco se rendere `main` il branch predefinito del repo (oggi `dev`).
3. Nel repo del libro, a cura di Marco: link al portale, per esempio nell’introduzione del *Manuale dell’Archivista* (`volumes/archivista/intro.mdx`) e nella pagina dello zaino: «Allenati con le query su [SQL Academy](https://sql.rainbowbits.cloud/), il portale di esercizi che accompagna questo volume.» In PDB il `dev` locale è avanti di 15 commit su `origin/dev` più `f007a51`: nessun push fatto.
4. Proposta per il piano successivo: scegliere i due temi mancanti e il CTF, rinviati il 2026-11-17.

### Archiviazione (2026-11-21)

Piano archiviato con F10 `in corso`. Il punto 1 è fatto in parte: il certificato è emesso e «Enforce HTTPS» è attivo (`gh api repos/marcofarina/sql-academy/pages` → `https_certificate.state: approved`, `https_enforced: true`; `curl` in HTTPS → `200`, verificato il 2026-11-21). La procedura manuale e i punti 2 e 3 passano a F01 di `portale-v2`; il punto 4 a F08 dello stesso piano (mondi e livelli; CTF ancora rinviate).
