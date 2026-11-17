# F13 — Definire regole dei punti e progressi versione 2

- **Modello / effort:** Sonnet 5.5 `high`. Le regole sono decise e scritte qui sotto: la fase le traduce in funzioni pure e test. `high` perché i casi limite (aiuto gratuito, saldo che non basta, soluzione vista prima di risolvere) vanno coperti tutti.
- **Dipendenze:** F05 (progressi, regola degli aiuti, spazio di lavoro, sessioni).
- **Consumo stimato:** medio. Logica circoscritta a due moduli e ai loro test, più gli adattamenti minimi delle chiamate.
- **Incertezza:** bassa sulle regole, media sugli adattamenti: `canRevealHint` e `canRevealSolution` cambiano firma e i componenti di F05 vanno ricollegati senza ridisegnarli.
- **Punto di ripresa:** modulo delle regole con i suoi test verdi, prima di toccare la forma dei progressi.

## 1. Obiettivo e risultato atteso

Il portale applica le regole del sistema a punti: lo studente guadagna punti risolvendo gli esercizi e li spende per aprire suggerimenti e soluzione. Alla fine della fase le regole funzionano e sono provate dai test; l’interfaccia mostra il minimo per non rompersi (un aiuto che non si può pagare è disattivato). Saldo, costi sui pulsanti e riepiloghi visibili sono di F14; zaino e classifica di F15–F17, che partono dalla forma dei dati fissata qui.

## 2. Contesto minimo

- Riga «Sistema a punti» delle «Decisioni condivise» del piano e tabella qui sotto.
- Passaggio di consegne di F05: sezioni «Regola degli aiuti», «Componenti», «Limiti e lavoro residuo».
- `src/training/exercises.ts`: `canRevealHint`, `canRevealSolution`, unico punto che oggi decide gli aiuti.
- `src/progress/progress.ts` (forma salvata, lettura difensiva) e `src/progress/useProgress.ts` (hook per tema).
- `src/training/ExerciseWorkspace.tsx` e `src/training/SessionView.tsx`: dove gli aiuti si aprono e si registrano.

### Regole decise con Marco (2026-11-17)

| Difficoltà | Premio | Suggerimento | Soluzione |
| --- | --- | --- | --- |
| `facile` | 10 | 3 | 20 |
| `medio` | 20 | 5 | 40 |
| `difficile` | 30 | 8 | 60 |

Un suggerimento costa circa un quarto del premio (arrotondato per eccesso), la soluzione il doppio: è l’estrema ratio.

1. I punti sono **per tema**: ogni tema ha il proprio saldo.
2. Il saldo parte da **zero** e non scende mai sotto zero: un aiuto che il saldo non copre non si apre (proposta di Claude).
3. Il **primo aiuto del tema** è gratuito, una sola volta per tema. È sempre un suggerimento, perché la soluzione richiede tutti i suggerimenti.
4. I suggerimenti si aprono uno alla volta, ciascuno al suo prezzo. Un aiuto pagato resta aperto per sempre (proposta di Claude).
5. La soluzione si compra solo dopo aver aperto tutti i suggerimenti dell’esercizio.
6. A esercizio risolto suggerimenti e soluzione si aprono gratis (proposta di Claude: la regola provvisoria di F05 mostrava già la soluzione a esercizio risolto).
7. Il premio si incassa alla **prima** risoluzione, intero anche se lo studente ha usato suggerimenti, che ha già pagato (proposta di Claude).
8. Un esercizio risolto **dopo** aver visto la soluzione risulta risolto ma vale zero punti.
9. Rifare un esercizio già risolto, dal percorso o in una sessione, non dà punti.
10. «Azzera i progressi» del tema azzera anche il saldo e restituisce l’aiuto gratuito (proposta di Claude).
11. Le regole stanno nel codice comune e valgono per ogni tema: un tema non le personalizza (proposta di Claude).

**Nessuna migrazione** (Marco): il portale non è ancora pubblicato e nessuno ha progressi salvati. La versione 2 sostituisce la 1; i dati della versione 1 si ignorano, come oggi si ignora una versione diversa.

**Previsioni per le fasi successive**, da rispettare nella forma dei dati:

- F15 unisce i progressi di due dispositivi: i campi di un esercizio devono **solo crescere** (contatori, valori che passano da `false` a `true`), così l’unione è il massimo campo per campo. L’azzeramento non cresce: tienilo come un contatore di azzeramenti del tema (un’«epoca»), che F15 userà per far vincere i dati più recenti.
- F16 ricalcola i punti sul server dagli esercizi risolti e dagli aiuti aperti: i progressi devono contenere quanti suggerimenti sono stati aperti, se la soluzione è stata vista prima della risoluzione e se l’esercizio è risolto, non solo gli importi.
- Il piano successivo aggiunge le CTF: esercizi con premio e suggerimenti a pagamento, ma **senza soluzione**. Le regole devono accettare un esercizio senza soluzione acquistabile senza riscritture.

## 3. Perimetro

Dentro: modulo delle regole, forma dei progressi versione 2, hook dei progressi con saldo e acquisti, ricollegamento delle chiamate esistenti, test.

Fuori: tutto ciò che si vede in più (saldo, costi sui pulsanti, riepiloghi, elenco dei temi: F14), zaino (F15), classifica (F16, F17), icone, gradi e traguardi (piano successivo), testi per gli studenti oltre al motivo di un pulsante disattivato.

## 4. Attività di implementazione

1. **Regole** in un modulo comune, per esempio `src/points/points.ts`: tabella premi e costi per difficoltà; funzioni pure per il costo del prossimo aiuto di un esercizio (zero se gratuito), per la possibilità di aprirlo dato il saldo, per il premio di una risoluzione. Nessuna dipendenza da React né dal browser: F16 riusa le stesse tabelle nel Worker.
2. **Progressi versione 2** in `src/progress/progress.ts`: chiave `sql-academy:<tema>:v2`, `PROGRESS_VERSION = 2`. Per esercizio registra se la soluzione è stata vista **prima** della risoluzione (la versione 1 non lo distingueva), i punti guadagnati e i punti spesi; per tema, se l’aiuto gratuito è già stato usato e l’epoca di azzeramento. Il saldo si **ricava** dai record (guadagni meno spese), non si salva a parte. Si salvano gli importi effettivi, non si ricalcolano dalle tabelle, perché un cambio futuro dei prezzi non deve riscrivere il saldo dello studente. Lettura difensiva come oggi: valori malformati a zero, versione diversa scartata.
3. **Hook** `useProgress`: espone il saldo e le operazioni «apri suggerimento», «apri soluzione», «registra risoluzione», che applicano le regole e scrivono i record in un unico aggiornamento. `reset` azzera saldo e aiuto gratuito e incrementa l’epoca.
4. **`canRevealHint` e `canRevealSolution`** passano dalle regole dei punti (o le sostituiscono): restano l’unico punto che decide. Aggiorna `ExerciseWorkspace.tsx` e `SessionView.tsx` quanto basta perché compilino e rispettino le regole; un pulsante d’aiuto non pagabile è disattivato con un `title` che dice quanti punti mancano. Nessun ridisegno.
5. **Test** (`vitest`): ogni regola numerata del § 2, in particolare aiuto gratuito una sola volta per tema; saldo insufficiente; soluzione negata prima dell’ultimo suggerimento; premio intero con suggerimenti, zero dopo la soluzione, zero alla seconda risoluzione; aiuti gratis a esercizio risolto; azzeramento con epoca; esercizio senza soluzione acquistabile; lettura di dati versione 1 (scartati), corrotti, con importi negativi o non interi.

## 5. Criteri di accettazione

Directory: radice del repo.

| Comando | Risultato atteso |
| --- | --- |
| `npm test` | Nessun errore; i test nuovi coprono ogni regola numerata del § 2 |
| `npm run build`, `npm run lint` | Nessun errore |
| `npm run check:themes` | Esce con 0 |

Procedura manuale con `npm run dev`, tema Star Wars, progressi azzerati:

1. Apri `ex-001` (facile): il primo suggerimento si apre gratis; il secondo è disattivato e il `title` dice che mancano 3 punti.
2. Incolla la query attesa e «Verifica»: risolto. In console, `localStorage.getItem('sql-academy:star-wars:v2')` mostra 10 punti guadagnati per `ex-001`.
3. Apri un altro facile: il primo suggerimento costa 3 punti (l’aiuto gratuito è già usato); aprilo e il saldo ricavato scende a 7.
4. Riverifica `ex-001`: il saldo non cambia.
5. Azzera i progressi: saldo zero, il primo suggerimento torna gratuito, l’epoca è cresciuta di uno.

## 6. Passaggio di consegne

Da compilare a fine fase: esito, verifiche (superate, fallite, non eseguite), forma esatta dei dati versione 2, firme esposte dall’hook per F14 e F15, decisioni nuove, limiti, lavoro residuo, consumo reale se noto.
