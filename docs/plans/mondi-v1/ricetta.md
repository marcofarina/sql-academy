# Ricetta di un mondo

Procedura comune alle fasi che costruiscono un mondo. Ogni mondo passa per quattro tipi di fase, nell’ordine A, C, B, D:

| Tipo | Fase | Risultato |
| --- | --- | --- |
| A | Dominio, database e traccia | `themes/<id>/` in bozza con manifest, schema, dati, ER, modello logico e traccia approvati da Marco |
| B | Esercizi | `themes/<id>/esercizi.ts` completo e verificato; nei mondi intermedi e complessi due fasi: B1 per `una-tabella` e `join`, B2 per `aggregazioni` e `sottoquery-viste` |
| C | Studio della veste | tavole approvate nell’Artifact «Design» e specifica `docs/design/<id>.md`; solo Claude |
| D | Veste, icone e uscita dalla bozza | veste applicata, icone del mondo, campo `draft` tolto: il mondo è pronto da pubblicare |

C dipende solo da A e si può fare prima di B: le tavole mostrano la sandbox con le tabelle vere del mondo. D chiude il mondo e dipende da B e da C.

Il file del mondo (`mondo-<id>.md`) aggiunge alla ricetta ciò che vale solo per quel mondo: abbozzo del dominio, fonti, rischi, numeri attesi, idee per la veste, e il passaggio di consegne di ciascuna fase. Dove il file del mondo e la ricetta divergono, vince il file del mondo.

La ricetta è scritta prima di costruire il primo mondo. F05, l’ultima fase di Stranger Things, la corregge con ciò che il primo mondo ha insegnato.

## Regole comuni a tutte le fasi

- Le fasi A, B e D scrivono testi per gli studenti o li toccano: si eseguono in locale, dove `.claude/norms/` è raggiungibile. Leggi `.claude/norms/scrittura-didattica.md` prima di scrivere e applica `.claude/norms/scrittura-umana.md` a fine stesura.
- Un mondo nuovo non tocca file fuori da `themes/<id>/`, salvo quelli nominati dalla fase (`docs/design/<id>.md`, la palette in `docs/design/contrasto.mjs`, il file del mondo, l’indice del piano, `AGENTS.md`). Se serve modificare un file comune, **fermati**: è un difetto del contratto. Descrivilo a Marco e, se lui approva, correggilo in un commit separato e dichiarato nel passaggio di consegne.
- Opere protette: nomi, luoghi e ambientazioni sì; immagini, caratteri ufficiali e testi copiati no; loghi ed emblemi solo come icone RB stilizzate, non identiche agli originali (decisione del piano archiviato, 2026-11-17).
- Studenti minorenni: niente contenuti espliciti né violenza descritta nei dettagli, nei dati come nella traccia e negli esercizi.
- Dopo la pubblicazione di un mondo l’`id` del tema e gli `id` degli esercizi non cambiano e non si tolgono: compaiono negli URL, nei progressi degli studenti, nello zaino e nella classifica.
- Ogni dato del mondo ha una fonte annotata nel file del mondo, sezione «Fonti». Un valore stimato si dichiara come tale anche nella traccia, come per le forze schierate del Signore degli Anelli.
- Le ricerche sul web vanno a subagent del livello più economico (Claude: Haiku; Codex: Luna, se lo strumento li offre), con la richiesta di riportare valore e URL di ogni dato. Il giudizio su che cosa tenere resta al modello principale.

## Tipo A — Dominio, database e traccia

### Obiettivo e risultato atteso

`themes/<id>/` esiste in bozza (`draft: true`) e contiene:

- `theme.ts` con `id`, `title`, `level`, `description`, `motto` definitivi; icone e schemi restano a D;
- `schema.sql` e `dati.sql`, caricabili con le chiavi esterne attive;
- `er.ts` e `logico.ts`, coerenti con lo schema;
- `traccia.md`, approvata da Marco;
- `esercizi.ts` vuoto (`[]`) o assente: gli esercizi sono di B.

### Contesto minimo

- File del mondo: abbozzo del dominio, rischi, numeri attesi.
- `docs/mondi.md`, sezioni «Livelli» e quella dell’opera.
- `README.md` del repo, «Aggiungere un tema», passi 2 e 3; commento in testa a `src/themes/contract.ts`.
- `themes/lotr/` come esempio completo: `schema.sql`, `dati.sql`, `er.ts`, `logico.ts`, `traccia.md`.
- `~/Developer/github/python-doesnt-byte/volumes/archivista/leggere-un-dominio.mdx`: come il libro presenta un testo di dominio.

### Perimetro

Dentro: i file sopra, il file del mondo (fonti, decisioni, passaggio di consegne).

Fuori: esercizi (B), veste e icone (C, D), codice comune.

### Attività

1. Raccogli le fonti dei dati con i subagent (regole comuni). Annota nel file del mondo la versione o l’edizione dell’opera a cui i dati si riferiscono.
2. Proponi a Marco, prima di scrivere file:
   - l’`id` definitivo (minuscole, cifre e trattini; non cambierà più);
   - entità, attributi, associazioni e cardinalità, partendo dall’abbozzo e dicendo dove te ne allontani e perché;
   - numero di righe per tabella, colonne numeriche, date e testi che reggono gli esercizi del livello (aggregazioni, ordinamenti, `LIKE`, funzioni di data), valori `NULL` voluti per `IS NULL` e `LEFT JOIN`;
   - il controllo del livello rispetto alla tabella «Livelli» di `docs/mondi.md`: numero di tabelle, tipi di associazione;
   - `title`, `description` e `motto` del manifest.

   Attendi l’approvazione.
3. Genera lo scheletro con `npm run nuovo-tema -- <id>` e controlla che il manifest abbia `draft: true` (F01). Sostituisci tutti i segnaposto.
4. Scrivi `schema.sql` (ogni tabella dopo quelle a cui rimanda, chiavi esterne con `REFERENCES`, `CHECK` dove un valore ha un insieme chiuso) e `dati.sql`. Verifica il caricamento con il comando dei criteri.
5. Scrivi `er.ts` e `logico.ts`, poi apri «Schema ER» e «Modello logico» con `npm run dev` e giudica la leggibilità: tabelle collegate vicine, nessuna linea che attraversa un riquadro.
6. Scrivi `traccia.md` nel registro della seconda prova dell’Esame di Stato: il committente descrive il dominio, senza nomi di tabelle né di colonne; grassetto su entità, cardinalità e dati che possono mancare, come nelle tracce esistenti. Chi non conosce l’opera deve capire il mondo dalla sola traccia. Cita versione o edizione dell’opera e, se ci sono, i valori stimati.
7. Sottoponi la traccia a Marco; dopo l’approvazione applica la passata finale di `scrittura-umana.md`.

### Criteri di accettazione

Dalla radice del repo:

| Comando | Risultato atteso |
| --- | --- |
| `sqlite3 :memory: "PRAGMA foreign_keys=ON;" ".read themes/<id>/schema.sql" ".read themes/<id>/dati.sql" "PRAGMA foreign_key_check;"` | Nessun output, uscita 0 |
| `npm run check:themes` | Uscita 0 |
| `npm test`, `npm run lint`, `npm run build` | Nessun errore |
| `node scripts/classifica-dati.ts --controlla` | Uscita 0: un mondo in bozza non entra nei dati della classifica (F01) |

Procedura manuale con `npm run dev`: il mondo compare sul tavolo; «Traccia», «Schema ER», «Modello logico» e «Sandbox» funzionano a 1280 e a 375 px; una `SELECT` su ogni tabella nella sandbox restituisce le righe attese. Con `npm run build && npm run preview` il mondo **non** compare.

Approvazioni di Marco annotate nel passaggio di consegne: dominio e schema, traccia.

### Passaggio di consegne

Nel file del mondo, sezione della fase: esito; verifiche (superate, fallite, non eseguite); decisioni di Marco; scostamenti dall’abbozzo e da questa ricetta, ciascuno con il motivo, o «nessuno»; limiti noti dei dati; strumento e modello usati.

## Tipo B — Esercizi

### Obiettivo e risultato atteso

`themes/<id>/esercizi.ts` contiene il numero di esercizi del livello (tabella «Livelli» di `docs/mondi.md`: facile 60–80, intermedio 140–150, complesso 150–200), distribuiti sui capitoli e sulle difficoltà approvati da Marco, ognuno con una query attesa eseguita su SQLite e controllata sul risultato.

Nei mondi intermedi e complessi la fase B1 scrive `una-tabella` e `join`, la B2 `aggregazioni` e `sottoquery-viste`. La distribuzione completa si approva in B1 e B2 la segue.

### Contesto minimo

- `Exercise` in `src/themes/contract.ts`: campi e regole del confronto delle risposte, in particolare sull’`ORDER BY`.
- `src/exercises/quality.ts`: i controlli di qualità di `check:themes` (ordine ambiguo, parole chiave, `WHERE` che non filtra, avvisi).
- `themes/<id>/schema.sql`, `dati.sql`, `traccia.md`.
- `themes/star-wars/esercizi.ts` e `themes/lotr/esercizi.ts`: regola sul capitolo in testa al file, forma di consegne e suggerimenti. Riferimento, non modello da copiare.
- `~/Developer/github/python-doesnt-byte/volumes/archivista/intro.mdx`: capitoli 6–9 del libro.

### Perimetro

Dentro: `esercizi.ts`; righe nuove in `dati.sql` solo se servono a un esercizio e sono coerenti con l’opera, ricontrollando gli esercizi già scritti.

Fuori: schema del database (una tabella o una colonna nuova si chiede a Marco e aggiorna ER, modello logico e traccia), veste, codice comune.

### Attività

1. Proponi a Marco la distribuzione: esercizi per capitolo e per difficoltà, parole chiave da coprire, argomenti dei capitoli del libro che il livello esclude. Attendi l’approvazione.
2. Scrivi gli esercizi un capitolo alla volta, con `id` da `ex-001` in avanti. Per ogni esercizio:
   - la consegna dice che cosa ottenere senza dettare la query, nomina le colonne del risultato quando la verifica le controlla e chiede l’ordine quando la query attesa ha un `ORDER BY` esterno, completo anche a parità di chiave;
   - due suggerimenti, dal più generale al più specifico, l’ultimo non è la soluzione (come nei temi esistenti: tre solo dove servono davvero, perché ogni suggerimento costa punti);
   - le parole chiave dichiarate sono quelle della query attesa;
   - il capitolo è la clausola più avanzata della query attesa.
3. Esegui tutte le query di un capitolo con uno script nella cartella temporanea della sessione e controlla che ogni risultato sia quello chiesto dalla consegna, con almeno una riga. Il risultato non vuoto non basta.
4. Dopo ogni capitolo esegui `npm run check:themes` e crea un commit intermedio dichiarato (`feat(<id>): aggiungi gli esercizi del capitolo …`, con «commit intermedio» nel corpo).
5. Applica la passata finale di `scrittura-umana.md` a consegne e suggerimenti.

### Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm run check:themes` | Uscita 0; ogni avviso sul mondo è giustificato nel passaggio di consegne |
| `npm test`, `npm run lint`, `npm run build` | Nessun errore |
| `node scripts/classifica-dati.ts --controlla` | Uscita 0 |

Il numero di esercizi per capitolo e per difficoltà coincide con la distribuzione approvata: riportalo in tabella nel passaggio di consegne, contato con uno script.

Procedura manuale con `npm run dev`: per dieci esercizi a campione, almeno due per capitolo scritto, una risposta giusta viene accettata e una sbagliata respinta; i suggerimenti si aprono con il loro costo.

### Passaggio di consegne

Come per A, più la tabella della distribuzione, gli avvisi di `check:themes` giustificati e le righe aggiunte ai dati.

## Tipo C — Studio della veste (solo Claude)

Solo Claude Code, su Opus: usa l’Artifact «Design». Se sei Codex, fermati prima di qualsiasi lavoro.

### Obiettivo e risultato atteso

Marco vede e approva l’aspetto del mondo su tavole disegnate con l’Artifact «Design». Al termine esistono le tavole approvate e la specifica `docs/design/<id>.md`, che D applica senza reinventare le scelte.

### Contesto minimo

- `README.md` del repo, «Aggiungere un tema», passo 1 «Studia la veste» e passo 4 «Applica la veste»: variabili, decorazioni, locandina, punti di personalizzazione del manifest.
- `docs/design/lotr.md` e `docs/design/star-wars.md` come modello di specifica; `docs/design/neutra.md` per tavolo e locandine.
- Idee per la veste nel file del mondo: non vincolanti.
- Skill `frontend-design`, da caricare prima di disegnare.
- Strumento: tool `Artifact` con `action: "quickstart"` e `intent: "design"`.

### Perimetro

Dentro: guscio del tema e sandbox con i suoi stati, a 1280 e a 375 px; sezioni già costruite; fronte della locandina; uno o due schemi (chiaro e scuro); palette, caratteri, decorazioni, indicatore della sezione; elenco delle icone tematiche da creare in D.

Fuori: codice e icone nuove (D). Se una scelta chiede un punto di personalizzazione che il contratto non ha, non disegnarla come se esistesse: descrivila a Marco come possibile difetto del contratto.

### Attività

1. Fai uno screenshot della pagina iniziale e di un tema esistente: il mondo nuovo deve distinguersi da tutti quelli già costruiti, anche sulla locandina.
2. Chiedi a Marco se il mondo avrà uno o due schemi. Poi proponi due direzioni diverse nell’Artifact; attendi la scelta e rifinisci quella scelta.
3. Nelle tavole usa solo icone RB già nel progetto; le icone tematiche restano segnaposto descritti a parole, con un nome proposto in inglese come quelli della libreria.
4. Caratteri solo con licenza libera verificata alla fonte (SIL OFL o equivalente): annota nome, licenza, URL del file di licenza. Nessun carattere ufficiale dell’opera né imitazioni dichiarate.
5. Aggiungi la palette a `docs/design/contrasto.mjs` e misura i contrasti (4,5:1 per il testo, 3:1 per icone e bordi).
6. Scrivi `docs/design/<id>.md` con la struttura di `docs/design/lotr.md`: link all’Artifact e nomi delle tavole approvate, valori delle variabili, caratteri, decorazioni, indicatore della sezione, locandina, icone tematiche da creare, contrasti misurati.

### Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `node docs/design/contrasto.mjs <id>-chiaro` (e `<id>-scuro` se c’è) | Uscita 0 |

La specifica esiste e contiene tutte le sezioni del modello; l’approvazione di Marco delle tavole è annotata nel passaggio di consegne con data e nome delle tavole.

### Passaggio di consegne

Come per A, più l’elenco delle icone tematiche proposte e le lacune del contratto incontrate.

## Tipo D — Veste, icone e uscita dalla bozza

### Obiettivo e risultato atteso

Il mondo ha la veste della specifica, le sue icone e il manifest completo; il campo `draft` è tolto e i dati della classifica sono rigenerati. Il mondo è pronto per la pubblicazione, che resta a Marco.

### Contesto minimo

- `docs/design/<id>.md` (C): la veste si applica, non si ridecide.
- `README.md` del repo, «Aggiungere un tema», passi 4 e 5, «Classifica».
- `themes/lotr/stile.css`, `locandina.css`, `theme.ts` come esempio.
- Sezione «Icone» dell’indice del piano e skill `icone-rb`.

### Perimetro

Dentro: `stile.css`, `locandina.css`, `fonts/` con le licenze, `icone/`, manifest (`icons`, `schemes`, tolto `draft`), `servizi/classifica/src/esercizi.json` rigenerato, registro delle icone nell’indice del piano, guida «Aggiungere un tema» se un suo passo si è rivelato sbagliato.

Fuori: schema, dati, esercizi; codice comune; pubblicazione e ripubblicazione del servizio della classifica (Marco).

### Attività

1. Applica la specifica in `stile.css` e `locandina.css`, con i caratteri serviti dal progetto in `fonts/`. Confronta le schermate con le tavole approvate e annota ogni differenza.
2. Icone: per ogni icona tematica della specifica segui la skill `icone-rb` (catalogo RB Icons, poi creazione se manca), riusando quelle comuni o di altri temi dove il significato coincide. Le icone nuove si disegnano solo su Claude Code con Opus e Marco le approva sul render a 128 px; i commit delle icone vanno nel repo `~/Developer/github/icone` su `dev`. Su Codex usa solo le icone già esistenti e lascia un segnaposto per le altre: in quel caso non togliere `draft`, lascia la fase `in corso` e scrivi nel passaggio di consegne quali icone mancano.
3. Completa il manifest: `icons`, `schemes`, emblema, icone di sessione e di azzeramento, icone delle sezioni previste dalla specifica.
4. Togli `draft` dal manifest ed esegui `npm run classifica:dati`.
5. Aggiorna il registro delle icone nell’indice del piano e, se un passo della guida «Aggiungere un tema» del `README.md` era sbagliato o mancava, correggilo.

### Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm run check:themes` | Uscita 0 |
| `node scripts/classifica-dati.ts --controlla` | Uscita 0, con il mondo dentro `servizi/classifica/src/esercizi.json` |
| `node docs/design/contrasto.mjs <id>-chiaro` (e `<id>-scuro`) | Uscita 0 |
| `npm test`, `npm run lint`, `npm run build` | Nessun errore |
| `npm run test:e2e` | Nessun errore |

Procedura manuale con `npm run build && npm run preview`:

1. La pagina iniziale mostra la locandina del mondo nel mucchio del suo livello (F01), a 1280 e a 375 px; la scheda riporta livello e numeri giusti.
2. Le sei sezioni di `#/<id>/…` funzionano nei due schemi, a 1280 e a 375 px; le schermate corrispondono alle tavole.
3. Un esercizio risolto dà i punti e aggiorna il saldo del mondo; i progressi del mondo restano separati da quelli degli altri; «Azzera i progressi» del mondo non tocca gli altri.

### Passaggio di consegne

Come per A, più le differenze dalle tavole, le icone create o riusate, e il promemoria per Marco: pubblicare (merge di `dev` in `main`) e ripubblicare il servizio della classifica, senza cui gli esercizi del mondo non entrano in classifica.
