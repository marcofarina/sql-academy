# F20 — Disegnare il modello logico in forma UML

- **Modello / effort:** Opus 5.5 `medium`, poi `high` se la disposizione automatica delle tabelle non converge. Un componente grafico nuovo generato dal database.
- **Dipendenze:** F09.
- **Consumo stimato:** alto. Disegno SVG, linee fra le tabelle, due temi e quattro schemi, 375 px.
- **Incertezza:** alta sulla disposizione: tabelle e linee devono restare leggibili senza sovrapposizioni con sette tabelle e più.
- **Punto di ripresa:** riquadri delle tabelle disegnati dal database per Star Wars, senza linee, verificati nel portale.

## 1. Obiettivo e risultato atteso

Feedback di Marco del 2026-11-18: la sezione «Modello logico» mostra le tabelle come diagramma UML, sul modello dello schema logico della verifica SQL della 5A LSA del 2026-11-16. La rappresentazione testuale attuale lascia il posto al diagramma; la vista «Codice SQL» resta.

Il diagramma della verifica, da riprodurre nella sostanza:

- un riquadro per tabella, con intestazione scura e nome della tabella;
- una riga per colonna, con nome a sinistra e tipo a destra in carattere monospaziato piccolo;
- chiave primaria sottolineata, su fondo evidenziato, con l’icona `key`; chiave esterna in corsivo con l’icona `link`; una colonna che è entrambe le cose ha entrambe le icone;
- linee ortogonali dalla chiave esterna alla chiave primaria a cui rimanda, con le cardinalità `1` e `N` agli estremi;
- una legenda: chiave primaria, chiave esterna, associazione uno a molti.

## 2. Contesto minimo

- Verifica: `~/Developer/github/paideia-os/assets/verifiche/5A-LSA-2026-11-16-sql/verifiche-5A-LSA-2026-11-16.pdf`, pagina 1, «Lo schema logico». Sorgenti: `~/Developer/github/paideia-os/tools/verifiche_sql/schema.py` (tabelle come dati) e `tools/verifiche_sql/modelli/stile.typ`, `verifica.typ` (disegno in Typst, con la disposizione fissata a mano). Si prende il linguaggio visivo, non il codice.
- `src/logical/`: oggi legge tabelle, colonne, chiavi primarie ed esterne dal database del tema (`TableInfo` in `src/sandbox/session.ts`, `column.foreignKey`).
- `src/er/`: esempio di diagramma SVG con disposizione dichiarata su una griglia (`er.ts` del tema) e controlli in `check:themes`.
- Icone `key` e `link` già in `src/assets/icons/`.

## 3. Perimetro

Dentro: componente del diagramma, disposizione delle tabelle, resa nelle vesti, accessibilità (descrizione testuale del diagramma, come per l’ER), 375 px.

Fuori: la vista «Codice SQL»; lo schema ER.

## 4. Attività di implementazione

1. **Decisione da prendere con Marco all’avvio:** la disposizione delle tabelle. Due strade:
   - dichiarata dal tema, con le sole posizioni su una griglia in un file nuovo (per esempio `themes/<id>/logico.ts`) mentre colonne e chiavi restano lette dal database; prevedibile e curabile come l’ER, ma è una modifica al contratto e un file in più per ogni tema;
   - calcolata dal portale a partire dalle chiavi esterne; nessun file in più, ma il risultato con sette tabelle e due associazioni molti a molti va verificato.
   Proponi la prima, che è la strada della verifica e dell’ER.
2. Disegna i riquadri in SVG con le variabili della veste (`--color-surface`, `--color-surface-2`, `--color-text`, `--color-accent-ink` per le icone), così ogni tema lo veste senza regole proprie.
3. Traccia le linee ortogonali fra chiave esterna e chiave primaria con le cardinalità; evita che attraversino i riquadri.
4. Aggiungi legenda e descrizione testuale per i lettori di schermo; a 375 px il diagramma scorre dentro la sua figura, come l’ER.
5. Se la disposizione è dichiarata, aggiungi a `check:themes` il controllo di coerenza fra file e tabelle, e scrivi il file per Star Wars e per LOTR.
6. Aggiorna la guida «Aggiungere un tema» nel `README.md`.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm run check:themes` | Exit 0 su entrambi i temi |
| `npm test`, `npm run lint`, `npm run build` | Exit 0; test per l’estrazione delle relazioni dal database |

Procedura manuale con `npm run dev`: in `#/star-wars/logico` e `#/lotr/logico`, nei quattro schemi, ogni tabella del database compare una volta con tutte le colonne; ogni chiave esterna ha la sua linea verso la tabella giusta, con `1` e `N`; nessuna linea attraversa un riquadro; a 375 px il diagramma scorre senza far scorrere la pagina. Confronto a vista con la pagina 1 della verifica.

## 6. Passaggio di consegne

Da compilare alla chiusura: esito, verifiche, decisione sulla disposizione ed eventuale correzione del contratto, osservazioni di Marco, lavoro residuo, consumo reale se noto.
