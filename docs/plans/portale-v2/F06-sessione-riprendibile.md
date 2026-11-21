# F06 — Rendere riprendibile la sessione di esercizi

- **Modello / effort:** Claude Code Sonnet · Codex Terra; effort consigliato `high`. Forma decisa da Marco; i casi limite (azzeramento, esercizi spariti, dati corrotti) vanno coperti con i test.
- **Dipendenze:** nessuna.
- **Consumo stimato:** basso-medio.
- **Incertezza:** bassa. Aumenta se la sessione dipende da stato che oggi non è serializzabile.
- **Punto di ripresa:** funzioni pure di salvataggio e lettura della sessione con i loro test, prima dell’interfaccia.

## 1. Obiettivo e risultato atteso

Una sessione di esercizi sopravvive all’uscita dal tema e alla ricarica (punto 4C). Rientrando nell’addestramento, il tema offre «Riprendi la sessione» o «Abbandonala»; la sessione ripresa riparte dall’esercizio a cui lo studente era arrivato, con i risultati già ottenuti.

## 2. Contesto minimo

- Decisione: «Sessione di esercizi» nelle «Decisioni condivise» del piano.
- Verificato il 2026-11-21: la sessione è `useState<ActiveSession>()` in `src/pages/ThemePage.tsx`; `ActiveSession` è in `src/training/SessionView.tsx`, la logica in `src/training/session.ts`. `ThemePage` si smonta quando si apre Zaino, Classifica o la home e quando si cambia tema, quindi la sessione si perde; cambiando sezione dentro il tema resta.
- Progressi: `src/progress/progress.ts` e `src/progress/store.ts`; chiavi `sql-academy:<tema>:v2`, con epoca di azzeramento.

## 3. Perimetro

Dentro: salvataggio della sessione nel browser per tema, ripresa e abbandono, coerenza con «Azzera i progressi», test.

Fuori: la sessione nello zaino (non chiesto: resta su un solo browser); cambi alla generazione delle sessioni.

## 4. Attività di implementazione

1. Scegli una chiave propria per tema (per esempio `sql-academy:<tema>:sessione`), separata dai progressi: il formato dei progressi in produzione non cambia.
2. Scrivi funzioni pure per serializzare e leggere la sessione, con versione del formato; una sessione illeggibile, di un’epoca di progressi precedente o con esercizi che il tema non ha più si scarta senza errori.
3. Salva a ogni cambiamento della sessione; cancella a fine sessione, all’abbandono e all’azzeramento dei progressi.
4. Nell’addestramento mostra «Riprendi la sessione» e «Abbandonala» quando ne esiste una salvata.
5. Scrivi i test: andata e ritorno, formato sconosciuto, epoca cambiata, esercizio rimosso, sessione finita.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm run lint && npm test && npm run check:themes && npm run build` | Nessun errore |

Procedura manuale (`npm run dev`): avvia una sessione di cinque esercizi, risolvine due, apri Zaino, torna al tema: «Riprendi la sessione» riporta al terzo esercizio con i due risultati; ricarica la pagina e ripeti; «Abbandonala» la cancella; «Azzera i progressi» la cancella; una sessione di Star Wars non compare in LOTR.

## 6. Passaggio di consegne

**In corso — 2026-11-21, Codex; famiglia del modello non verificabile.** La sessione usa una chiave separata per tema nell’area corrente dei progressi; la modalità temporanea usa `sessionStorage`. Il formato è versionato e controlla epoca, esercizi, indice, risultati e punti iniziali. Al completamento, all’abbandono e all’azzeramento la sessione viene cancellata. Senza archivio disponibile resta in memoria finché il tema è aperto.

Verifiche eseguite il 2026-11-21:

- `npm run lint && npm test && npm run check:themes && npm run build`: superati; 218 test. `check:themes` conserva i due avvisi Star Wars già giustificati in F19; la build segnala un chunk oltre 500 kB.
- Browser locale: due esercizi risolti, passaggio a Zaino, ripresa al terzo, ricarica e riepilogo con due risolti e 30 punti; abbandono verificato. Le prove sono precedenti all’ultima modifica che mantiene montato l’addestramento durante il cambio sezione.
- Non eseguite: completare nel browser la prova di azzeramento e l’isolamento fra temi; la finestra di conferma ha bloccato il browser di prova. Ripetere la procedura manuale anche dopo l’ultima modifica, poi chiudere la fase se tutti i criteri sono superati.

Consumo reale non disponibile. Nessun push o pubblicazione.
