# F15 — Scaricare il database e mostrare l’anteprima dei link

- **Modello / effort:** Claude Code Sonnet · Codex Terra; effort consigliato `medium`. Due funzioni piccole, statiche, con forma chiara.
- **Dipendenze:** nessuna.
- **Consumo stimato:** basso.
- **Incertezza:** bassa. L’immagine dell’anteprima richiede l’approvazione di Marco.
- **Punto di ripresa:** download del database funzionante, prima dell’anteprima.

## 1. Obiettivo e risultato atteso

1. Da ogni tema si scarica il database iniziale in formato `.sqlite`, più `schema.sql` e `dati.sql`, da usare con `sqlite3` di Python nelle lezioni del libro o con DB Browser for SQLite.
2. Il link del sito condiviso su WhatsApp, Classroom o simili mostra titolo, descrizione e immagine (Open Graph).

## 2. Contesto minimo

- Verificato il 2026-11-21: `index.html` ha solo `charset`, `viewport`, icona e titolo.
- Il routing è con hash: i servizi che generano le anteprime ignorano la parte dopo `#`, quindi l’anteprima è una sola per tutto il sito.
- Il database del tema è costruito nel worker da `schema.sql` e `dati.sql` (`src/sql/`); `sql.js` esporta un database con `db.export()`.

## 3. Perimetro

Dentro: pulsante «Scarica il database» (in sandbox o modello logico, come concordato con Marco), file generati nel browser o al build; meta Open Graph e immagine 1200 × 630 in `public/`.

Fuori: database con le modifiche fatte dallo studente nella sandbox, salvo diversa scelta di Marco; anteprime diverse per tema.

## 4. Attività di implementazione

1. Chiedi a Marco dove mettere il pulsante e se scaricare anche il database modificato nella sandbox.
2. Genera il `.sqlite` con `db.export()` dal database iniziale; nome del file con l’id del tema.
3. Se servono icone nuove, fermati e dillo a Marco: si disegnano in una sessione Claude su Opus.
4. Prepara l’immagine dell’anteprima da elementi già approvati (veste neutra, locandine); mostrala a Marco.
5. Aggiungi i meta Open Graph a `index.html` con l’indirizzo assoluto `https://sql.rainbowbits.cloud/`.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm run lint && npm test && npm run check:themes && npm run build` | Nessun errore |
| `python3 -c "import sqlite3,sys; c=sqlite3.connect(sys.argv[1]); print(c.execute('select count(*) from sqlite_master where type=\"table\"').fetchone())" <file scaricato>` | il numero di tabelle del tema |

Procedura manuale: dopo la pubblicazione, controlla l’anteprima con lo strumento di debug di un servizio di condivisione, o incollando il link in una chat.

## 6. Passaggio di consegne

**Completata il 2026-11-23 — Codex** (il predefinito in `~/.codex/config.toml` è Terra; eventuale scelta diversa all’apertura non verificabile).

- Marco ha scelto il download nella sandbox e il solo database iniziale. Il database si esporta da una copia separata; sono disponibili anche `schema.sql` e `dati.sql`.
- Marco ha approvato l’immagine 1200 × 630 in `public/anteprima.png`; `index.html` contiene i meta Open Graph del sito.
- Verifiche superate: `npm run lint`, `npm test` (295 test), `npm run check:themes`, `npm run build` e `git diff --check`. I database scaricati in browser per entrambi i temi contengono sette tabelle e superano `PRAGMA integrity_check`; i quattro script scaricati coincidono con gli originali.
- Avvisi non bloccanti: due esercizi Star Wars segnalati da `check:themes`, già documentati in F19, e dimensione del bundle in build.
- Da fare dopo la pubblicazione, fuori da questa sessione: verificare l’anteprima con un servizio di condivisione o in una chat. Nessuna pubblicazione effettuata.
- Scostamenti dal dettaglio: nessuno. Consumo reale non disponibile.
