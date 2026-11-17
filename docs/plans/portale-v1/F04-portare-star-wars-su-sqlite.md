# F04 — Portare database ed esercizi Star Wars su SQLite

- **Modello / effort:** Sonnet 5.5 `high`. La forma è decisa da F01 e F02; resta una conversione lunga in cui ogni query va giudicata sul risultato.
- **Dipendenze:** F02 (formato degli esercizi, `npm run check:themes`).
- **Consumo stimato:** medio-alto. 105 esercizi e sette tabelle.
- **Incertezza:** alta sul numero di query da correggere: il prototipo le eseguiva su AlaSQL e nessuna è mai stata provata su SQLite.
- **Punto di ripresa:** `schema.sql` e `dati.sql` caricati senza errori, prima degli esercizi; poi un commit intermedio ogni blocco di difficoltà convertito.

## 1. Obiettivo e risultato atteso

`themes/star-wars/` contiene il database completo e i 105 esercizi del prototipo nel formato di F02, ciascuno con una query attesa che gira su SQLite e restituisce un risultato sensato.

## 2. Contesto minimo

- Passaggio di consegne di F02.
- `~/Developer/github/jedi-academy/src/data/starWarsDatabase.ts` (272 righe) e `src/data/exercises.ts` (1413 righe).
- `~/Developer/github/python-doesnt-byte/volumes/archivista/intro.mdx`, capitoli 6–9, per l’etichetta di capitolo.

## 3. Perimetro

Dentro: `schema.sql`, `dati.sql`, file degli esercizi del tema Star Wars.

Fuori: riscrittura di titoli, consegne e suggerimenti (F07: qui si copiano così come sono, correggendo solo ciò che diventa falso dopo una modifica alla query); analisi ed ER (F06, F07).

## 4. Attività di implementazione

1. Converti il seed in `schema.sql` e `dati.sql`: tipi di SQLite, chiavi primarie, chiavi esterne dichiarate con `REFERENCES`, ordine di creazione e inserimento che rispetta le dipendenze. Il database deve caricarsi con `PRAGMA foreign_keys = ON`.
2. Segnala a Marco, senza correggerli da solo, i difetti di schema che incontri (per esempio `fazioni.leader` come testo invece che come chiave esterna verso `personaggi`): cambiarli modifica gli esercizi.
3. Converti gli esercizi nel formato di F02 con uno script usa e getta, non a mano. Conserva gli `id` del prototipo.
4. Assegna a ogni esercizio il capitolo del libro in base alle clausole della query attesa.
5. Esegui `npm run check:themes` e, per ogni query che fallisce o restituisce zero righe, correggi la query o i dati. Scarta un esercizio solo se non è recuperabile senza cambiarne il senso.
6. Controlla a campione, eseguendole, almeno dieci query per livello di difficoltà: il risultato deve corrispondere alla consegna, non solo essere non vuoto. Annota le incongruenze fra consegna e query per F07.
7. Rimuovi il tema segnaposto se F01 lo aveva tenuto separato.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm run check:themes` | Esce con 0 |
| `npm test`, `npm run build` | Nessun errore |
| `sqlite3 :memory: "PRAGMA foreign_keys=ON" ".read themes/star-wars/schema.sql" ".read themes/star-wars/dati.sql" "PRAGMA foreign_key_check"` | Nessuna riga in uscita |

Il passaggio di consegne riporta il conteggio degli esercizi per capitolo e difficoltà, ottenuto con un comando e non contato a mano, e la somma: 105 meno gli scartati.

## 6. Passaggio di consegne

**Esito:** completata il 2026-11-17 13:15 su Sonnet 5.5, il modello richiesto. Effort non verificabile dalla sessione. Nessun esercizio scartato: 105 su 105.

**Correzione al piano.** Il prototipo ha **105** esercizi, non 121 (35 facili, 40 medi, 30 difficili, come dichiara il suo stesso commento di testata). Il 121 veniva da `grep -c 'id: "'`, che conta anche le 16 voci di `AVAILABLE_KEYWORDS`. Il numero è corretto in questo file, in `README.md` e in `AGENTS.md`; il dettaglio di F02 (riga 23) conserva il vecchio 121 perché è il testo di una fase chiusa.

### Verifiche

| Verifica | Esito |
| --- | --- |
| `npm run check:themes` | superata: esce con 0, «star-wars: 105 esercizi, 0 problemi» |
| `npm test` | superata: 81 test in sette file (un test di F01 aggiornato, vedi sotto) |
| `npm run build` | superata (esce con 0; l’avviso sulla dimensione dei chunk c’era già) |
| `npm run lint` | superata |
| `sqlite3 :memory: "PRAGMA foreign_keys=ON" ".read …/schema.sql" ".read …/dati.sql" "PRAGMA foreign_key_check"` | superata: nessuna riga in uscita |
| Tutte le 105 query attese eseguite con la CLI `sqlite3` | superata: nessun errore, nessun risultato vuoto |
| Controllo incrociato: 43 query (12 facili, 13 medie, 18 difficili) ricalcolate con una formulazione SQL indipendente (join impliciti, sottoquery correlate, `EXISTS`, `LEFT JOIN … IS NULL`) | superata: tutti i risultati coincidono (le prime differenze erano errori del mio controllo, corretti e rilanciati) |
| Determinismo: le 105 query su una copia del database con le righe in ordine inverso | superata dopo le correzioni sotto: nessuna differenza |
| Sandbox nel browser: tema caricato, sette tabelle, query con join e raggruppamento eseguita | superata, nessun errore in console |

Nessuna verifica fallita o non eseguita. Non ho eseguito l’addestramento nel browser: arriva con F05.

### Conteggio per capitolo e difficoltà

Ottenuto con un comando (`node -e "import('./themes/star-wars/esercizi.ts')…"`), non a mano.

| Capitolo | Facile | Medio | Difficile | Totale |
| --- | --- | --- | --- | --- |
| `una-tabella` | 35 | 4 | 1 | 40 |
| `join` | 0 | 14 | 11 | 25 |
| `aggregazioni` | 0 | 22 | 8 | 30 |
| `sottoquery-viste` | 0 | 0 | 10 | 10 |
| **Totale** | **35** | **40** | **30** | **105** |

Il capitolo è la clausola più avanzata della query attesa: sottoquery, poi `GROUP BY`/`HAVING`/funzioni di aggregazione, poi `JOIN`, poi una tabella. Il prototipo non ha esercizi sulle viste: il capitolo `sottoquery-viste` contiene solo sottoquery. Cinque esercizi di una sola tabella sono etichettati `medio` o `difficile` dal prototipo (ex-068, ex-070, ex-072, ex-073, ex-097): la difficoltà è rimasta quella del prototipo.

### Esercizi e dati corretti

Su SQLite nessuna query dava errore o zero righe: il prototipo girava già su un sottoinsieme compatibile. Le correzioni sono tutte di forma, a cura del punto «Parità nell’ordinamento» di F02.

| Id | Che cosa non andava | Correzione |
| --- | --- | --- |
| ex-007 | `ORDER BY velocita_iperguida` lascia a pari merito Millennium Falcon e Ghost (0,5): il test sul database invertito dava un ordine diverso | secondo criterio `nome ASC`; la consegna chiede ordine crescente di velocità e, a parità, per nome |
| ex-045 | pari merito fra i colori con una sola spada | secondo criterio `colore_lama ASC`; consegna aggiornata |
| ex-050 | pari merito fra i costruttori con una sola nave | secondo criterio `costruttore ASC`; consegna aggiornata |
| ex-023 | `ORDER BY … DESC LIMIT 5` conta nell’ordine, ma la consegna non lo chiedeva | aggiunta «Ordinali dal più anziano.» alla consegna |
| ex-094 | parola chiave `DISTINCT` dichiarata ma assente dalla query | tolta dalle parole chiave |
| dati, spada 7 | «Doppia elva curva» (refuso) | «Doppia elsa curva»; ex-019 ed ex-104 cercano `'%curva%'` e restano invariati |

Le altre cinque query ordinate (ex-006, 022, 031, 034, 095) hanno chiavi senza pari merito. Un test di F01 (`src/sql/engine.test.ts`) verificava colonne e righe di `pianeti` del tema segnaposto: aggiornato a sei colonne e quindici righe.

### Difetti di schema e di dati segnalati, non corretti

Cambiarli modifica gli esercizi: decide Marco.

1. **`fazioni.leader` è testo**, non una chiave esterna verso `personaggi`; alcuni leader (Cancelliere Valorum, Greef Karga) non sono nemmeno personaggi del database.
2. **«Battaglia di Yavin» ha `pianeta_id = 8` (Endor)**: Yavin non è fra i pianeti. Ex-046, ex-081 e ex-098 mostrano «Endor» per due battaglie.
3. **`battaglie.anno_bby` ha valori negativi** per le battaglie dopo Yavin (−3, −4): in realtà sono anni ABY. Il nome della colonna è ambiguo e i titoli di ex-026 ed ex-098 ne soffrono.
4. **Nessun vincolo oltre a chiavi primarie, chiavi esterne e `nome NOT NULL`**: `sensibile_alla_forza` è un `INTEGER` senza `CHECK (… IN (0, 1))`, nessuna `UNIQUE` sui nomi. Ho aggiunto solo `NOT NULL` sui nomi, per non cambiare il comportamento degli esercizi.
5. **Nessun personaggio senza fazione, specie o pianeta, nessuna fazione senza personaggi**: i dati non distinguono un `JOIN` da un `LEFT JOIN` in ex-088. Vedi sotto.

### Incongruenze fra consegna e query per F07

Titoli, consegne e suggerimenti sono quelli del prototipo, non riscritti. Da rivedere in F07:

| Id | Incongruenza |
| --- | --- |
| ex-029 | titolo «Fazione Non Assegnata o Specifica», consegna: fazione con id 1 |
| ex-033 | titolo «Senza Ruolo di Droide», consegna: personaggi droidi (`specie_id = 3`) |
| ex-042 | consegna «arrotondata o mostrata come valore medio», la query non arrotonda |
| ex-059 | titolo «Specie Nascoste nel Pianeta Madre» non descrive la consegna |
| ex-068 | titolo «Superiore alla Media», consegna e query: più di 100 000 000 abitanti |
| ex-074 | titolo «… e Nome Fazione», la query non mostra la fazione |
| ex-086 | titolo «Nati prima di Yavin», nessun filtro sull’anno di nascita |
| ex-088 | chiede le fazioni senza personaggi, ma tutte ne hanno: la query con `LEFT JOIN` e quella con `JOIN` danno lo stesso risultato. Serve un dato (una fazione senza personaggi, che altererebbe ex-037, 062, 094, 105) oppure un’altra consegna: decisione di Marco |
| ex-097 | titolo «Superiore alla Media della Propria Fazione», query: capacità maggiore di 100 |
| ex-098 | titolo «Anno 0 BBY o Precedente», consegna e query: `anno_bby <= 0` («durante o dopo» Yavin) |
| ex-105 | titolo «… Conteggio Personaggi e Conteggio Navi», la query conta solo i personaggi |
| ex-083 | titolo «Personaggio più anziano», la query restituisce il valore massimo, non il personaggio |

Tutte le consegne con `ORDER BY` esterno ora chiedono l’ordine in modo esplicito. Il capitolo `sottoquery-viste` non allena le viste: se Marco vuole esercizi con `CREATE VIEW`, vanno aggiunti rispettando il limite di F02 (la query attesa deve finire con una `SELECT`).

### Come si è lavorato

Conversione con uno script usa e getta (non nel repo), non a mano: estrae gli esercizi dal prototipo, assegna il capitolo dalla query, formatta una clausola per riga e applica le sole correzioni di sopra. Un commit intermedio per blocco di difficoltà, più il commit di chiusura. Il tema `star-wars` era lo stesso segnaposto di F01: non c’era un tema separato da rimuovere.

### Consumo reale

Non noto.
