# SQL Academy

Portale di addestramento a SQL che accompagna il *Manuale dell’Archivista*, terzo volume di *Python Doesn’t Byte*. Ogni **tema** è un universo narrativo con un proprio database SQLite, interrogabile nel browser, i propri esercizi e una propria veste grafica. Scelto un tema, lo studente trova sei sezioni: sandbox, addestramento, tutte le query, traccia, schema ER e modello logico.

Temi presenti: Star Wars (`themes/star-wars/`) e Il Signore degli Anelli (`themes/lotr/`).

Il portale è pubblicato su <https://sql.rainbowbits.cloud/>; il libro è su <https://python.rainbowbits.cloud/>.

## Comandi

Richiede Node 22.18 o successivo.

| Comando | Che cosa fa |
| --- | --- |
| `npm install` | installa le dipendenze |
| `npm run dev` | avvia il portale in locale, su `http://localhost:5173/` |
| `npm run check:themes` | controlla ogni tema: database, esercizi, schema ER, fogli di stile; esce con 1 se trova un problema |
| `npm test` | esegue i test |
| `npm run lint` | controlla il codice con ESLint |
| `npm run build` | controlla i tipi e costruisce il sito statico in `dist/` |

## Pubblicazione

Il workflow `.github/workflows/pubblica.yml` parte a ogni push su `main`: esegue lint, test, `check:themes`, il controllo dei dati della classifica e la build, poi pubblica `dist/` su GitHub Pages, con il dominio `sql.rainbowbits.cloud`. Si lavora su `dev`; il merge in `main` è la pubblicazione.

I servizi in rete stanno su Cloudflare Workers: lo zaino nel repo del libro (`servizi/zaino/`), la classifica qui in `servizi/classifica/`. Entrambi ammettono nel CORS l’origine `https://sql.rainbowbits.cloud`.

## Piè di pagina

Il piè di pagina è comune a tutte le pagine: `src/footer/SiteFooter.tsx` lo monta dentro `SiteLayout`, i contenuti stanno solo in `src/footer/contenuti.tsx`. Il contenuto attuale è provvisorio: quello definitivo arriva da una sessione aperta in `~/Developer/github/`, che rende coerenti i piè di pagina dei mini-siti di Marco, e sostituisce quel file senza toccare le pagine.

## Aggiungere un tema

Un tema è una cartella `themes/<id>/`, scoperta al build: non va registrato in nessun elenco e non richiede modifiche al codice comune. L’`id` è fatto di minuscole, cifre e trattini, compare negli URL (`#/<id>/sandbox`) e nelle chiavi dei progressi in `localStorage`: dopo la pubblicazione non va cambiato.

Il contratto completo, con il tipo di ogni file, è il commento in testa a `src/themes/contract.ts`. Il tema `themes/lotr/` è l’esempio più recente.

Genera uno scheletro provvisorio con:

```bash
npm run nuovo-tema -- <id>
```

Il comando rifiuta gli id non validi, riservati o già esistenti. Il tema generato contiene due tabelle, un esercizio e i file facoltativi di esempio; compare nel sito, quindi sostituisci tutti i segnaposto prima di pubblicarlo. Segui questa lista e le istruzioni sotto:

- [ ] Studia e fai approvare la veste.
- [ ] Progetta il dominio, lo schema ER e il modello logico.
- [ ] Sostituisci schema, dati e traccia provvisori.
- [ ] Scrivi e verifica gli esercizi.
- [ ] Applica la veste, incluse locandina e icone.
- [ ] Esegui i controlli e aggiorna i dati della classifica.

### 1. Studia la veste

Prima di scrivere codice, studia la veste del tema con l’Artifact «Design»: tavole della sandbox a 1280 e 375 px, stati della sandbox e fronte della locandina per la pagina iniziale. Un tema può avere uno schema chiaro e uno scuro.

Fai approvare le tavole a Marco e scrivi la specifica in `docs/design/<id>.md`, sul modello di `docs/design/lotr.md`: colori come valori delle variabili di `src/styles.css`, caratteri con licenza e fonte, decorazioni, locandina, icone. Aggiungi la palette a `docs/design/contrasto.mjs` e misura i contrasti:

```bash
node docs/design/contrasto.mjs <id>-chiaro
```

Lo script esce con 1 se una coppia di colori è sotto la soglia (4,5:1 per il testo, 3:1 per icone e bordi).

### 2. Progetta il database

Proponi a Marco il dominio e lo schema ER prima di scrivere i file. Poi crea:

| File | Contenuto |
| --- | --- |
| `theme.ts` | manifest (`id`, `title`, `level`, `description`, `motto`, icone, schemi), esportato come `default` |
| `schema.sql` | le istruzioni `CREATE TABLE`, con le chiavi esterne dichiarate, ogni tabella dopo quelle a cui rimanda |
| `dati.sql` | le istruzioni `INSERT` |
| `er.ts` | lo schema ER, nella forma del componente `<DiagrammaER>` del libro; ogni tabella deve tradurre un’entità o un’associazione |
| `logico.ts` | le posizioni delle tabelle nel diagramma del modello logico, su una griglia (`col`, `riga` da 0, una tabella per cella); colonne, tipi e chiavi si leggono dal database |
| `traccia.md` | la traccia: il testo del problema da cui nasce il database, come nella seconda prova dell’Esame di Stato; la prima riga `# …` è il titolo della pagina |

Nel manifest, imposta il campo obbligatorio `level` a `facile`, `intermedio` o `complesso` secondo i [criteri per i mondi](docs/mondi.md#livelli). La pagina iniziale mostra il livello sulla locandina e nella scheda. I mondi facili hanno il consiglio «Consigliato per cominciare» nella scheda. `npm run check:themes` segnala i valori mancanti o non ammessi.

Sono obbligatori solo `theme.ts`, `schema.sql` e `dati.sql`. Verifica il caricamento con le chiavi esterne attive (`foreign_key_check` non deve stampare nulla):

```bash
sqlite3 :memory: "PRAGMA foreign_keys=ON;" ".read themes/<id>/schema.sql" ".read themes/<id>/dati.sql" "PRAGMA foreign_key_check;"
```

Poi esegui `npm run check:themes` e apri le sezioni «Schema ER» e «Modello logico» in `npm run dev`. Lo script controlla la coerenza fra ER e tabelle e, per il modello logico, che ogni tabella abbia una posizione e che le linee delle chiavi esterne non attraversino i riquadri né si sovrappongano; la leggibilità del disegno la giudichi tu. Nel modello logico conviene mettere vicine le tabelle collegate: una linea fra colonne non adiacenti passa per una corsia orizzontale e allarga il diagramma. Senza `logico.ts` le tabelle si dispongono tre per riga.

### 3. Scrivi gli esercizi

`esercizi.ts` esporta un elenco di oggetti `Exercise`. Distribuisci gli esercizi sui quattro capitoli (`una-tabella`, `join`, `aggregazioni`, `sottoquery-viste`) e sui tre livelli di difficoltà. Il capitolo di un esercizio è la clausola più avanzata della query attesa.

Esegui ogni `expectedQuery` su SQLite e controlla che il risultato sia quello chiesto dalla consegna. Le regole del confronto fra le risposte sono nel commento di `Exercise` in `src/themes/contract.ts`: se la query attesa ha un `ORDER BY` esterno, la consegna deve chiedere quell’ordine, e l’ordine deve essere completo anche a parità di chiave.

### Classifica

Il servizio della classifica (`servizi/classifica/`) ricalcola i punti con un elenco degli esercizi di tutti i temi. Ogni volta che aggiungi un tema o cambi esercizi o suggerimenti, rigenera l’elenco e fai ripubblicare il servizio da Marco: fino ad allora gli esercizi nuovi non entrano in classifica.

```bash
npm run classifica:dati
```

### 4. Applica la veste

| File | Contenuto |
| --- | --- |
| `stile.css` | le variabili di `src/styles.css` ridefinite per il tema, e le decorazioni; ogni selettore comincia con `.theme[data-theme-id="<id>"]`, per schema con `[data-scheme="chiaro"]` o `[data-scheme="scuro"]`; l’indicatore della sezione attiva si disegna con `.sections-indicator::after` |
| `locandina.css` | il fronte della locandina sulla pagina iniziale; ogni selettore comincia con `.poster[data-theme-id="<id>"]` |
| `fonts/` | i caratteri del tema, ciascuno con il suo file di licenza |
| `icone/` | le icone RB proprie del tema, citate per nome dal manifest |

Le decorazioni SVG stanno dentro i fogli di stile come `url("data:image/svg+xml,…")`. Le icone si cercano e si creano solo con la skill `icone-rb`; il manifest può assegnarle all’emblema, all’esercizio risolto, agli stati vuoti, ai pulsanti che avviano una sessione (`session`), al pulsante che azzera i progressi (`reset`) e, con `icons.sections`, a una sezione.

L’indicatore della sezione attiva lo sposta il guscio, con un’animazione propria: il tema ne decide solo l’aspetto. `.sections-indicator` ha la posizione e le misure della voce attiva, e `.sections-indicator::after` disegna il segno rispetto alla voce, per esempio una linea con `bottom: 0` o un punto con `left: 50%`. Senza regole del tema resta la linea comune del colore d’accento.

### Vincoli sulle opere protette

Di un’opera protetta si usano nomi, luoghi e ambientazioni. Non si usano immagini né caratteri ufficiali dei film o dei libri. Loghi ed emblemi entrano solo come icone RB stilizzate, non identiche agli originali.

### 5. Controlla

```bash
npm run check:themes
npm test
npm run lint
npm run build
```

Poi, con `npm run dev`, controlla che la pagina iniziale mostri la locandina del tema, che le sei sezioni di `#/<id>/…` funzionino nei due schemi a 1280 e a 375 px, e che i progressi del nuovo tema restino separati da quelli degli altri.

## Licenza

Il codice è rilasciato sotto licenza MIT (`LICENSE-MIT`); i contenuti didattici — esercizi, consegne, suggerimenti, tracce e dati dei temi — sotto licenza [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) (`LICENSE`). I caratteri tipografici hanno ciascuno la propria licenza SIL Open Font License, nel file `*-OFL.txt` accanto.

I temi si ispirano a opere di altri autori: SQL Academy ne usa nomi e ambientazioni e non è affiliato ai titolari delle opere.
