# F04 — Portare database ed esercizi Star Wars su SQLite

- **Modello / effort:** Sonnet 5.5 `high`. La forma è decisa da F01 e F02; resta una conversione lunga in cui ogni query va giudicata sul risultato.
- **Dipendenze:** F02 (formato degli esercizi, `npm run check:themes`).
- **Consumo stimato:** medio-alto. 121 esercizi e sette tabelle.
- **Incertezza:** alta sul numero di query da correggere: il prototipo le eseguiva su AlaSQL e nessuna è mai stata provata su SQLite.
- **Punto di ripresa:** `schema.sql` e `dati.sql` caricati senza errori, prima degli esercizi; poi un commit intermedio ogni blocco di difficoltà convertito.

## 1. Obiettivo e risultato atteso

`themes/star-wars/` contiene il database completo e i 121 esercizi del prototipo nel formato di F02, ciascuno con una query attesa che gira su SQLite e restituisce un risultato sensato.

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

Il passaggio di consegne riporta il conteggio degli esercizi per capitolo e difficoltà, ottenuto con un comando e non contato a mano, e la somma: 121 meno gli scartati.

## 6. Passaggio di consegne

Da compilare alla chiusura: esito, verifiche, tabella degli esercizi corretti (id, che cosa non andava su SQLite) e scartati (id, motivo), difetti di schema segnalati, incongruenze fra consegna e query da passare a F07, consumo reale se noto.
