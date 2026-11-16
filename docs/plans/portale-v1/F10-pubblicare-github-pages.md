# F10 — Pubblicare su GitHub Pages e collegare il libro

- **Modello / effort:** Sonnet 5.5 `medium`. Procedura nota, forma già decisa.
- **Dipendenze:** F07, F09.
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

Fuori: dominio personalizzato, statistiche di accesso (nessuna: gli studenti sono minori). Il link dal libro al portale è una modifica al repo `python-doesnt-byte`: descrivila a Marco, non farla da questa sessione.

## 4. Attività di implementazione

1. Chiedi a Marco: nome del repo su GitHub, licenza del codice e dei contenuti, se pubblicare da `main` dopo il merge.
2. Controlla che il repo sia pubblicabile: nessuna icona Font Awesome (`grep -rl 'Font Awesome' .` escluso `node_modules`), nessun file `.env`, licenze dei caratteri presenti, nessun dato personale.
3. Imposta `base` in `vite.config.ts` sul percorso del repo e verifica la build con `npm run build && npx vite preview`.
4. Scrivi il workflow: installazione, `npm run lint`, `npm test`, `npm run check:themes`, `npm run build`, pubblicazione su Pages.
5. Aggiungi nel portale il link al libro e una pagina di informazioni: che cos’è il portale, che i progressi restano nel browser, che i temi non sono affiliati ai titolari delle opere.
6. **Con il via di Marco**, in quest’ordine e chiedendo a ogni passo: crea il repo pubblico e il remote; push di `dev`; merge in `main`; attivazione di Pages.
7. Aggiorna la tabella «Stato» di `AGENTS.md` con l’indirizzo del sito.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm run lint && npm test && npm run check:themes && npm run build` | Nessun errore |
| `gh repo view --json visibility` | `PUBLIC` |
| `gh run list --limit 1` | Ultima esecuzione del workflow riuscita |
| `curl -s -o /dev/null -w '%{http_code}\n' <indirizzo del sito>` | `200` |

Procedura manuale sul sito pubblicato: apri entrambi i temi, esegui una query nella sandbox, risolvi un esercizio, ricarica una pagina interna (`#/star-wars/sandbox`).

## 6. Passaggio di consegne

Da compilare alla chiusura: esito, verifiche, indirizzo del sito, azioni autorizzate da Marco con data, testo della modifica da fare nel repo del libro, lavoro residuo e proposta per il piano dei temi successivi.
