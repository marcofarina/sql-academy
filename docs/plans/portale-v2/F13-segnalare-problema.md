# F13 — Segnalare un problema su un esercizio

- **Modello / effort:** Opus 5.5 `medium`. Poco codice, ma una decisione sul canale che riguarda studenti minorenni e testi per gli studenti.
- **Dipendenze:** nessuna. Conviene dopo F05, che cambia lo spazio di lavoro dell’esercizio.
- **Consumo stimato:** basso.
- **Incertezza:** bassa, una volta scelto il canale.
- **Punto di ripresa:** canale scelto da Marco.

## 1. Obiettivo e risultato atteso

Da ogni esercizio lo studente può segnalare un problema (consegna ambigua, soluzione sbagliata, suggerimento fuorviante). La segnalazione parte precompilata con tema, id dell’esercizio, query dello studente e versione del sito, senza dati personali. Con circa 1500 esercizi a regime, gli errori arriveranno: questo è il modo di saperlo.

## 2. Contesto minimo

- Niente server nuovi e niente dati personali (vincoli del piano archiviato). Un’issue su GitHub chiede un account, che molti studenti non hanno.
- La query dello studente è nei progressi (`lastQuery`).

## 3. Perimetro

Dentro: scelta del canale, pulsante nello spazio di lavoro, testo precompilato, eventuale riga nell’informativa.

Fuori: raccolta delle segnalazioni su un servizio proprio.

## 4. Attività di implementazione

1. Proponi a Marco il canale: `mailto:` verso un indirizzo del progetto, link a un’issue GitHub precompilata, o entrambi. Ricorda che con `mailto:` lo studente invia dal proprio indirizzo; attendi la scelta.
2. Elenca le icone, cercale nel catalogo e disegna le mancanti secondo la sezione «Icone» del piano.
3. Aggiungi il pulsante nello spazio di lavoro, con il testo precompilato; la versione del sito si ricava al build (per esempio l’hash del commit).
4. Aggiorna l’informativa se il canale lo richiede.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm run lint && npm test && npm run check:themes && npm run build` | Nessun errore |

Procedura manuale (`npm run dev`): da un esercizio di ciascun tema il pulsante apre la segnalazione con tema, id, query e versione corretti.

## 6. Passaggio di consegne

Da compilare a fine fase.
