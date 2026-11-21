# F19 — Controllare la qualità degli esercizi

- **Modello / effort:** Claude Code Opus · Codex Sol; effort consigliato `medium`. Il controllo è codice semplice; correggere gli esercizi segnalati chiede giudizio e riscrive testi per gli studenti.
- **Dipendenze:** nessuna. Conviene presto: gli esercizi sono già in produzione.
- **Consumo stimato:** medio; alto se il controllo trova molti esercizi da riscrivere.
- **Incertezza:** media: dipende da quanto trova.
- **Punto di ripresa:** controlli in `check:themes` con l’elenco dei casi trovati, prima delle correzioni.

## 1. Obiettivo e risultato atteso

`npm run check:themes` segnala gli esercizi difettosi in modo automatico, e gli esercizi di Star Wars e LOTR segnalati sono corretti o giustificati. Con circa 1500 esercizi a regime, il controllo a mano non basta.

## 2. Contesto minimo

- Verificato il 2026-11-21: `src/exercises/check.ts` controlla il formato degli esercizi; nessun controllo sul risultato delle query attese oltre all’esecuzione.
- Regole di confronto: nomi e ordine delle colonne non contano; l’ordine delle righe conta quando la query attesa ha `ORDER BY` (`src/exercises/compare.ts`, `src/exercises/verify.ts`; da verificare all’avvio).

## 3. Perimetro

Dentro, da proporre a Marco come elenco di controlli:

- query attesa con zero righe, o con una sola riga dove la consegna parla al plurale;
- `ORDER BY … LIMIT` con pareggi sul confine, che rendono ambigua la risposta;
- esercizio risolto da una query banale (`SELECT * FROM <tabella>` o la stessa query senza `WHERE`);
- due esercizi con lo stesso risultato atteso;
- `ORDER BY` nella query attesa su colonne con valori ripetuti, senza un criterio che li separi: l’ordine richiesto non è unico;
- parole chiave dichiarate assenti dalla query attesa.

Fuori: valutare la qualità didattica delle consegne.

## 4. Attività di implementazione

1. Proponi a Marco l’elenco dei controlli; attendi la scelta.
2. Implementa i controlli scelti in `check:themes`, come errori o come avvisi.
3. Esegui su entrambi i temi e mostra a Marco i casi trovati, con una proposta di correzione per ciascuno.
4. Correggi gli esercizi approvati; un esercizio corretto conserva il suo id, così i progressi degli studenti restano validi.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm run lint && npm test && npm run check:themes && npm run build` | Nessun errore; avvisi solo per i casi giustificati con Marco |

## 6. Passaggio di consegne

**Esito:** completata il 2026-11-21 12:15, su Claude Code con Opus.

### Controlli scelti da Marco

Tutti e sei quelli proposti, in `src/exercises/check.ts` e `src/exercises/quality.ts`; `checkTheme` restituisce ora `{ problems, warnings }` e `check:themes` stampa gli avvisi senza fallire.

| Controllo | Tipo | Come |
| --- | --- | --- |
| Ordine ambiguo | errore | Con un `ORDER BY` esterno, la query si riesegue completando i criteri con le colonne del risultato (`, 1 ASC, 2 ASC…` e `, 1 DESC, 2 DESC…`): se i due risultati differiscono, ci sono pareggi che si vedono nel risultato, o un `LIMIT` che taglia fra righe a pari merito. Senza `ORDER BY` si usa `PRAGMA reverse_unordered_selects`, che scopre un `LIMIT` senza ordinamento. Il pragma da solo non basta: SQLite non lo applica alle query con `ORDER BY`. |
| Parole chiave assenti | errore | Ogni parola chiave dichiarata compare nella query attesa, commenti e stringhe esclusi. |
| `WHERE` che non filtra | errore | Esercizio su una tabella con `WHERE` dichiarato e tante righe quante la tabella. Sostituisce la voce «query banale» senza colpire gli esercizi facili su `SELECT *`. |
| Risultati identici | avviso | Due esercizi dello stesso tema con lo stesso risultato, colonne e righe in qualunque ordine. |
| Una riga, consegna plurale | avviso | Euristica sul testo: «tutti», «tutte», «quali», «elenca», o verbo iniziale seguito da «i», «gli», «le». |
| Parole chiave non dichiarate | avviso | Elenco fisso di clausole e funzioni (`DETECTED` in `quality.ts`), con le forme negate e `LEFT JOIN` distinte da quelle semplici. |

Rifinitura approvata da Marco dopo la prima esecuzione: i risultati di una sola cella (conteggi, somme) non generano gli avvisi «una riga» e «risultati identici». Undici avvisi su quattordici del primo tipo erano conteggi su tutta la tabella.

Limite noto: i pareggi risolti da un indice non si vedono se le colonne del risultato non li distinguono; non è un difetto per lo studente, perché il risultato è lo stesso.

### Esercizi cambiati (id invariati)

| Esercizio | Modifica |
| --- | --- |
| `lotr/ex-048`, `ex-053`, `ex-103` | parola chiave `IS NOT NULL` |
| `lotr/ex-083` | parola chiave `JOIN` |
| `lotr/ex-116` | parola chiave `LIKE` |
| `lotr/ex-126` | parola chiave `COUNT` |
| `star-wars/ex-014`, `ex-072` | parola chiave `BETWEEN` |
| `star-wars/ex-055` | parola chiave `IN` |
| `star-wars/ex-078` | parola chiave `IS NOT NULL` |
| `star-wars/ex-080`, `ex-087` | parola chiave `AVG` |
| `star-wars/ex-082` | parole chiave `COUNT`, `SUM` |
| `star-wars/ex-146` | parola chiave `WHERE` (nella sottoquery) |
| `lotr/ex-140` | Edoras diventa Isengard in titolo, consegna e query: chi è passato da Edoras aveva già combattuto al Fosso di Helm, il ramo dopo `UNION` non aggiungeva nessuno e il risultato coincideva con `ex-016`. Ora nove nomi, con Merry e Pipino. |
| `star-wars/ex-068` | «più di 100 milioni» diventa «almeno 100 milioni» (`>=`), con il primo suggerimento aggiornato: prima coincideva con `ex-093`, perché l’Orlo Esterno somma 140 milioni di abitanti. Ora cinque righe, con Geonosis. |
| `star-wars/ex-060` | «più di tre pianeti» diventa «più di un pianeta»: prima rispondeva il solo Orlo Esterno. Ora tre righe. |

### Avvisi giustificati con Marco

- `star-wars/ex-080` («astronavi più lunghe della media»): risponde il solo Executor, perché la media, 1832 metri, è gonfiata proprio da lui. La riga sola è il punto dell’esercizio.
- `star-wars/ex-125` («leader di una fazione altrui»): Palpatine è l’unico leader che milita in un’altra fazione; è un fatto dei dati.

### Verifiche

| Comando | Esito |
| --- | --- |
| `npm run lint` | superata |
| `npm test` | superata: 214 test, fra cui tre nuovi o aggiornati in `src/exercises/verify.test.ts` per i sei controlli |
| `npm run check:themes` | superata: 0 problemi; due avvisi, quelli giustificati sopra |
| `npm run build` | superata (solo l’avviso già noto sulla dimensione dei blocchi) |

Le query attese dei tre esercizi riscritti sono state eseguite su SQLite: 9, 5 e 3 righe.

### Fuori perimetro, da segnalare

- `ORDER BY` sul testo usa il confronto binario di SQLite: in `lotr/ex-140` «Éomer» finisce dopo «Théoden». Lo studente con la stessa query ottiene lo stesso ordine, quindi la verifica è giusta, ma «in ordine alfabetico» non è quello del dizionario. Riguarda tutti gli esercizi ordinati su nomi accentati.
