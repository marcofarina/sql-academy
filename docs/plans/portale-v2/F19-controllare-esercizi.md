# F19 — Controllare la qualità degli esercizi

- **Modello / effort:** Opus 5.5 `medium`. Il controllo è codice semplice; correggere gli esercizi segnalati chiede giudizio e riscrive testi per gli studenti.
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

Da compilare a fine fase, con l’elenco degli esercizi cambiati.
