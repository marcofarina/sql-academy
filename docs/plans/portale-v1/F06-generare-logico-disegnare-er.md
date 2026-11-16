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
6. Descrizione testuale del diagramma per chi usa un lettore di schermo, come fa il componente del libro.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm test`, `npm run build`, `npm run lint` | Nessun errore |
| `npm run check:themes` | Esce con 0, compreso il controllo di coerenza fra ER e schema |
| `npm run check:themes` dopo aver tolto a mano un’entità da `er.ts` | Esce con codice diverso da 0 e nomina la tabella scoperta; ripristina poi il file |

Procedura manuale: apri `#/star-wars/modello-logico` e `#/star-wars/schema-er` (o i nomi di sezione fissati in F03) a 1280 px e a 375 px; sette tabelle nel logico, tutte le associazioni leggibili nell’ER, nessuna sovrapposizione di etichette.

## 6. Passaggio di consegne

Da compilare alla chiusura: esito, verifiche, tipo del file `er.ts`, scelta del carattere, osservazioni di Marco sull’ER, decisioni nuove, lavoro residuo, consumo reale se noto.
