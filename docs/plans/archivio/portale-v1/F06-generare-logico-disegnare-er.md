# F06 — Generare il modello logico e disegnare l’ER dichiarativo

- **Modello / effort:** Opus 5.5 `medium`. Adattamento di un componente esistente più un generatore, con giudizio sul formato dichiarativo.
- **Dipendenze:** F03 (guscio delle sezioni), F04 (schema completo di Star Wars).
- **Consumo stimato:** medio.
- **Incertezza:** media. Il componente del libro dispone le entità su una griglia scritta a mano: sette entità possono richiedere un formato più ricco.
- **Punto di ripresa:** sezione «Modello logico» funzionante, prima dell’ER.

## 1. Obiettivo e risultato atteso

Le sezioni «Modello logico» e «Schema ER» funzionano per qualunque tema: la prima senza alcun file scritto a mano, la seconda a partire da `er.ts` del tema.

## 2. Contesto minimo

- Passaggi di consegne di F03 e F04.
- Lo schema ha un riferimento circolare: `fazioni.leader_id` → `personaggi` (vincolo differito) e `personaggi.fazione_id` → `fazioni`. Nell’ER sono due associazioni distinte fra le stesse entità (appartenenza e guida): un personaggio può guidare più fazioni (Palpatine guida Impero e Ordine Sith), una fazione ha al più un leader.
- Icone: leggi la sezione «Icone» del `README.md` del piano e segui la skill `icone-rb` per ogni icona (catalogo RB Icons, poi creazione se manca). Servono per i comandi delle viste (per esempio chiave primaria, chiave esterna, copia del codice, vista tabellare o codice).
- `~/Developer/github/python-doesnt-byte/src/components/DiagrammaER/` (`index.tsx`, `layout.ts`, `types.ts`) e un esempio d’uso in `volumes/archivista/le-cardinalita.mdx`.
- Capitoli 2 e 3 del volume (`volumes/archivista/`), per la notazione che lo studente conosce: leggi con un subagent `Explore` e chiedi solo le convenzioni grafiche e di scrittura dello schema relazionale.

## 3. Perimetro

Dentro: generatore del modello logico, componente ER comune, `themes/star-wars/er.ts`.

Fuori: testo dell’analisi (F07), stile del tema (F08), modifica interattiva dei diagrammi.

## 4. Attività di implementazione

1. **Modello logico:** leggi tabelle, colonne, chiavi primarie ed esterne dal database del tema con `PRAGMA table_info` e `PRAGMA foreign_key_list`. Presenta lo schema relazionale nella notazione del libro (chiave primaria sottolineata, chiavi esterne riconoscibili con la tabella a cui puntano). Aggiungi una vista del codice `CREATE TABLE`.
2. **ER:** adatta `DiagrammaER` come componente comune. Conserva la notazione del libro, cardinalità `(min,max)` comprese. Per il carattere: Excalifont è sotto licenza OFL, quindi utilizzabile in un sito pubblico; copialo insieme al file di licenza oppure usa il carattere del tema, e registra la scelta.
3. Fissa nel contratto del tema il tipo del file `er.ts` e scrivi quello di Star Wars: entità, attributi, identificatori, associazioni con nome, cardinalità.
4. Sottoponi a Marco l’ER di Star Wars prima di chiudere: nomi delle associazioni e cardinalità sono scelte concettuali sue.
5. Test di coerenza, eseguito anche da `npm run check:themes`: ogni entità dell’ER corrisponde a una tabella oppure è dichiarata senza tabella; ogni tabella compare nell’ER oppure è dichiarata come tabella di associazione.
6. **Icone:** per i marcatori di chiave primaria ed esterna e per i comandi delle viste, secondo la sezione «Icone» del piano. Le icone non sostituiscono la notazione del libro (sottolineatura): la affiancano.
7. Descrizione testuale del diagramma per chi usa un lettore di schermo, come fa il componente del libro.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm test`, `npm run build`, `npm run lint` | Nessun errore |
| `npm run check:themes` | Esce con 0, compreso il controllo di coerenza fra ER e schema |
| `npm run check:themes` dopo aver tolto a mano un’entità da `er.ts` | Esce con codice diverso da 0 e nomina la tabella scoperta; ripristina poi il file |

Procedura manuale: apri `#/star-wars/modello-logico` e `#/star-wars/schema-er` (o i nomi di sezione fissati in F03) a 1280 px e a 375 px; sette tabelle nel logico, tutte le associazioni leggibili nell’ER, nessuna sovrapposizione di etichette.

## 6. Passaggio di consegne

Compilato il 2026-11-17, sessione su Opus 5.5 (modello richiesto; effort non verificabile dalla sessione).

**Esito:** completata. Le sezioni «Modello logico» (`#/<tema>/logico`) e «Schema ER» (`#/<tema>/er`) funzionano per qualunque tema: la prima senza file scritti a mano, la seconda da `themes/<id>/er.ts`, facoltativo (senza, la sezione lo dice).

**Che cosa c’è:**

- `src/sandbox/session.ts`: `readTables` legge anche chiavi esterne (`pragma_foreign_key_list`, con la chiave primaria come arrivo implicito) e il testo del `CREATE TABLE`. La sezione del modello logico usa le tabelle che la sandbox legge all’apertura: è il database iniziale, anche se lo studente ne modifica la copia.
- `src/logical/LogicalSection.tsx`: vista «Schema» nella notazione del libro (nome in grassetto, chiave primaria sottolineata, esterna in corsivo, elenco «`a.b` si riferisce a `c.d`» come in `tradurre-in-tabelle.mdx`; tipi assenti, come nel libro) con le icone `key` e `link` accanto e un titolo per i lettori di schermo; vista «Codice SQL» con i `CREATE TABLE` e il pulsante di copia.
- `src/er/`: `types.ts` e `layout.ts` copiati dal libro; `glyphWidths.ts` sostituisce il JSON delle larghezze (Node senza Vite non importa JSON senza attributi); `ErDiagram.tsx` rende l’SVG; `describe.ts` scrive la descrizione testuale dalle dichiarazioni (nel `<desc>` dell’SVG e in un `<details>` «Il diagramma descritto a parole»); `coherence.ts` controlla ER e tabelle; `ErSection.tsx` carica `er.ts` dal registro.
- Unica modifica di comportamento a `layout.ts`: più linee dallo stesso lato di un’entità si distribuiscono lungo il lato, nell’ordine dei rombi; a parità di posizione la più lontana sta più all’interno, così le linee spezzate non si incrociano. Senza, `personaggio` (cinque associazioni) non era disegnabile. Il libro non ha questa modifica.
- `check:themes` apre il database del tema, calcola il disegno (errori di griglia, lati occupati, cardinalità) e controlla la coerenza.

**Tipo del file `er.ts`:** `ErDiagram` (`src/er/types.ts`, riesportato da `src/themes/contract.ts`), cioè le props di `DiagrammaER` del libro con i nomi italiani, più `tabella` su entità (default `id`; `null` se senza tabella) e su associazioni (solo se tradotte da una tabella propria).

**Carattere:** Excalifont, licenza OFL, copiato dal libro con `Excalifont-OFL.txt` in `src/er/`; tratto con rough.js, nuova dipendenza `roughjs` ^4.6.6 (scelta di Marco: «come il libro»).

**Osservazioni di Marco sull’ER:** approvati nomi delle associazioni e cardinalità così come proposti (ricavati da schema e dati: Palpatine guida due fazioni, due personaggi senza pianeta, nessuna fazione vuota, al massimo una spada a testa nei dati ma `(0,N)` nel dominio). Approvati `id` come identificatore, chiavi esterne non come attributi, attributi opzionali non segnati, scorrimento del diagramma nel suo riquadro.

**Verifiche** (eseguite il 2026-11-17 nella radice del repository):

| Comando | Esito |
| --- | --- |
| `npm test` | superata: 11 file, 107 test (nuovi `src/er/er.test.ts` e due casi in `session.test.ts`) |
| `npm run build` | superata; l’avviso sul *chunk* oltre 500 kB c’era già prima di F06 (702 kB, ora 750 kB per `roughjs` e le sezioni) |
| `npm run lint` | superata |
| `npm run check:themes` | superata, exit 0: «star-wars: 105 esercizi, schema ER su 7 tabelle, 0 problemi» |
| `check:themes` senza l’entità `spada_laser` (e l’associazione `impugna`) | superata: exit 1, «la tabella «spade_laser» non compare nell’ER…»; file ripristinato, poi exit 0 |
| test della distribuzione delle linee senza la modifica | fallisce come atteso, quindi il test la copre |

Procedura manuale nel browser integrato: a 1280 px sette relazioni nel logico; l’ER (1789 px di disegno, minimo 1406 px per il corpo di 11 px) scorre di circa 290 px dentro la figura, la pagina no; Excalifont caricato; nessuna etichetta sovrapposta. A 375 px nessuno scorrimento orizzontale della pagina in entrambe le sezioni; il codice SQL e l’ER scorrono nel proprio riquadro. **Non verificata:** la copia riuscita negli appunti, perché il browser integrato nega il permesso di scrittura; si è verificato il messaggio di ripiego («Copia non riuscita: seleziona il testo a mano.»).

**Icone e collaudo della skill `icone-rb`:** usate `key` e `table` dal catalogo; create con Opus 5.5 `link`, `copy` e `code`, approvate da Marco e committate nel repository `icone`, branch `dev` (`8cc99c8`, nessun push). Esito del collaudo:

- la ricerca non dava risultati per `copy`, `code`, `link`, `chain`, `brackets`: icone davvero assenti; `link` restituiva solo `network-nodes`, non adatta;
- `validate.py` ha respinto la prima `code` (copertura 23,4%, sotto il 30% di R1.6): R1.6 penalizza le icone fatte di sole linee su `W` = 640;
- Marco ha respinto la `code` a parentesi angolari: ricorda i tag HTML e non i linguaggi in generale. Ha chiesto la finestra di un editor con 3–4 righe rientrate; R2.7 (al massimo tre elementi ripetuti in un contenitore) ha imposto tre righe; poi l’ultima riga è diventata di due parole;
- `stroke`, `rpoly` e gli altri aiuti di `tmp/f05/lib.py` sono serviti di nuovo: la skill potrebbe offrirli come strumento della libreria invece di lasciarli in `tmp/`.

**Decisioni nuove:** nel piano, «Decisioni condivise»: formato di `er.ts`, tratto e carattere dell’ER, notazione dell’ER, modello logico.

**Limiti e lavoro residuo:**

- l’ER a 375 px si legge solo scorrendo: accettato da Marco; una vista ingrandibile resta fuori perimetro;
- `layout.ts` diverge dal libro per la distribuzione delle linee: se il libro aggiorna il componente, va riportata a mano;
- i colori dell’ER (`--er-shape-bg`) e il carattere sono quelli neutri: la veste per tema è di F08.

**Consumo reale:** non misurato.
