# F14 — Mostrare saldo, costi e punti nell’interfaccia

- **Modello / effort:** Opus 5.5 `medium`. Scelte di interazione su più viste e icone nuove da disegnare con la skill `icone-rb`, che richiede Opus.
- **Dipendenze:** F13 (regole, saldo e operazioni dell’hook).
- **Consumo stimato:** medio. Cinque punti dell’interfaccia da toccare, più il ciclo delle icone con Marco.
- **Incertezza:** media: le icone nuove possono richiedere più varianti (in F05 la lampadina ne ha chieste quattro).
- **Punto di ripresa:** saldo nell’intestazione del tema e costi sui pulsanti d’aiuto, prima di riepilogo, percorso, catalogo ed elenco dei temi.

## 1. Obiettivo e risultato atteso

Lo studente vede sempre quanti punti ha, quanto costa un aiuto prima di aprirlo e quanto vale un esercizio prima di risolverlo.

## 2. Contesto minimo

- Passaggio di consegne di F13 (forma dei dati, firme dell’hook) e riga «Sistema a punti» delle «Decisioni condivise».
- Icone: sezione «Icone» del `README.md` del piano; skill `icone-rb` per ogni icona. Servono almeno: punti o saldo (moneta, gemma o simile: decidi con Marco), guadagno, spesa, aiuto bloccato.
- Se F08 o F11 sono già completate, gli elementi nuovi usano le variabili di stile della veste; se no, quelle neutre, e F08 li veste insieme al resto.

## 3. Perimetro

Dentro, secondo la scelta di Marco (2026-11-17):

1. **Intestazione del tema:** saldo sempre visibile in tutte le sezioni, con una breve evidenza quando cambia (rispettando `prefers-reduced-motion`).
2. **Pulsanti d’aiuto:** il costo sul pulsante («Suggerimento · 5 punti», «gratis» per l’aiuto gratuito e a esercizio risolto); pulsante disattivato con il motivo leggibile, non solo nel `title`, se il saldo non basta o mancano suggerimenti prima della soluzione.
3. **Riepilogo della sessione:** punti guadagnati e spesi nella sessione, per esercizio e in totale.
4. **Percorso e catalogo «Tutte le query»:** il premio di ogni esercizio, e se è già stato incassato.
5. **Elenco dei temi:** il saldo di ogni tema accanto al titolo.

Fuori: zaino (F15), classifica (F17), gradi e traguardi, revisione dei testi secondo le norme (F07 li può riprendere).

## 4. Attività di implementazione

1. Icone prima dei componenti, come nella sezione «Icone» del piano; mostra a Marco quelle nuove e attendi l’approvazione.
2. I cinque punti del perimetro. L’elenco dei temi legge i progressi di ogni tema con le funzioni di F13, senza duplicare la lettura.
3. Accessibilità: il saldo ha un nome accessibile («Punti: 35»); il cambiamento si annuncia con una regione `aria-live` cortese, non a ogni ridisegno.
4. Test dei componenti dove la logica non è banale (per esempio il testo del motivo di un pulsante disattivato).

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm test`, `npm run build`, `npm run lint` | Nessun errore |
| `npm run check:themes` | Esce con 0 |

Procedura manuale con `npm run dev`, tema Star Wars, progressi azzerati:

1. L’intestazione mostra 0 punti; il primo suggerimento di `ex-001` dice «gratis».
2. Dopo il primo suggerimento il secondo mostra il costo e il motivo per cui è disattivato.
3. Risolvi `ex-001`: il saldo passa a 10 con l’evidenza; percorso e catalogo segnano il premio come incassato.
4. Sessione di cinque facili: il riepilogo riporta punti guadagnati e spesi.
5. Torna all’elenco dei temi: Star Wars mostra il saldo.
6. Con la riduzione del movimento attiva nel sistema, il cambio di saldo non anima.

## 6. Passaggio di consegne

**Esito:** completata il 2026-11-19 01:55 su Opus 5.5, il modello richiesto. Effort non verificabile dalla sessione. Fase non divisa.

### Verifiche

| Verifica | Esito |
| --- | --- |
| `npm test` | superata: 171 test in 18 file (161 prima; 10 nuovi in `src/points/labels.test.ts`, su prezzi, motivi dei pulsanti disattivati e premi) |
| `npm run build` | superata; resta l’avviso di Vite sul pacchetto principale, già noto da F03 |
| `npm run lint` | superata |
| `npm run check:themes` | superata: esce con 0 (`lotr` 140 esercizi, `star-wars` 150, 0 problemi) |
| Manuale 1 — intestazione a 0, primo suggerimento di `ex-001` «gratis» | superata |
| Manuale 2 — secondo suggerimento | superata: «3 punti», disattivato, sotto la riga «Hai 0 punti: te ne mancano 3.» collegata con `aria-describedby`; la soluzione mostra «20 punti» e «La soluzione si apre dopo l’ultimo suggerimento.» |
| Manuale 3 — risolto `ex-001` | superata: saldo 10, animazione `balance-bump` attiva, regione cortese «Punti: 10 (più 10).»; premio «incassato» nel percorso e nel catalogo |
| Manuale 4 — sessione di cinque facili | superata: un suggerimento a pagamento e un esercizio risolto danno «10 punti guadagnati», «3 punti spesi», colonne per esercizio e riga «Totale»; saldo 17 |
| Manuale 5 — elenco dei temi | superata: Star Wars «17 punti», Il Signore degli Anelli «0 punti», sul fronte della locandina e nella scheda |
| Manuale 6 — riduzione del movimento | superata in parte: il browser integrato non emula `prefers-reduced-motion`; controllato dal CSSOM che le due animazioni del saldo stanno solo sotto `(prefers-reduced-motion: no-preference)` |

Verifiche manuali nel browser integrato con `npm run dev`, Star Wars schema scuro; a 375 px nessuno scorrimento orizzontale (corretto qui un «3 punti» che andava a capo). Il Signore degli Anelli guardato solo nell’intestazione e nei pulsanti d’aiuto. In console restano gli avvisi di React sulla proprietà `transition` (pagina iniziale e indicatore di sezione), preesistenti.

### Cosa c’è

| Punto del perimetro | Dove |
| --- | --- |
| Saldo nell’intestazione | `src/points/Balance.tsx`: nome accessibile «Punti: N» (`role="img"`), numero evidenziato e ultimo movimento (`circle-plus` o `circle-minus`) che svanisce; annuncio `aria-live="polite"` solo quando il saldo cambia. Lo stato precedente si aggiorna durante il rendering, non in un effetto |
| Pulsanti d’aiuto | `HelpButton` in `src/training/ExerciseWorkspace.tsx`: prezzo dopo un separatore («gratis» o «N punti»), motivo visibile con `lock` sotto il pulsante disattivato. La soluzione bloccata ora si vede disattivata con il prezzo, non più come frase sola |
| Riepilogo della sessione | `src/training/SessionView.tsx`: l’avvio fotografa `pointsEarned` e `pointsSpent` degli esercizi estratti (`baseline`); il riepilogo conta la differenza, mai sotto zero |
| Percorso e catalogo | `src/points/Reward.tsx`: premio con stato `pending`, `earned` (spunta) o `lost` (barrato, soluzione vista prima); nel catalogo una colonna «Premio» |
| Elenco dei temi | `ThemeBalance` in `src/pages/HomePage.tsx`, con `loadProgress` e `balanceOf` di F13 |

Testi in `src/points/labels.ts` (`pointsLabel`, `costLabel`, `disabledReason`, `rewardStatus`, `rewardDescription`); stili nella sezione «Punti (F14)» di `src/styles.css`, solo con le variabili della veste.

### Icone e collaudo della skill

Quattro icone nuove, disegnate con Opus 5.5 e approvate da Marco al primo giro: `coin`, `circle-plus`, `circle-minus`, `lock` (commit `fc94644` del repo `icone`, branch `dev`, senza push). Esito del collaudo:

- la ricerca non trovava nulla per punti, moneta, lucchetto, più e meno: risultato corretto, le icone mancavano;
- `validate.py` ha respinto il primo `circle-minus` con le misure di R4.2 (48 × 240) per R3.8, primario al 5,4%: le due regole sono incompatibili per il meno dentro il cerchio. Risolto con un meno spesso 64 e lungo 288; `STILE.md` andrebbe chiarito;
- la prima scrittura delle voci in `catalogo.yaml` le ha riordinate, perché il catalogo non è del tutto in ordine alfabetico (`hobbit-door` precede `hobbit-backpack`): annullata e rifatta inserendo le voci senza toccare le altre.

### Decisioni nuove

- **Icona dei punti: moneta** (Marco), con stella al centro; guadagno e spesa con `circle-plus` e `circle-minus` (Marco).
- **Prezzo della soluzione bloccata** (Claude): l’offerta `locked` di `solutionOffer` porta `cost`, così l’interfaccia non rifà i conti; due test di F13 aggiornati.
- **Annuncio neutro** (Claude): «Punti: 7 (meno 3)», non «spesi», perché anche l’azzeramento abbassa il saldo.
- **Premio perso** (Claude): un esercizio con la soluzione vista prima di risolverlo mostra 0 barrato, con la descrizione «Nessun premio».
- **Saldo sulle locandine** (Claude): sul fronte, sotto il titolo, e nella scheda; solo per i temi con esercizi.

### Limiti e lavoro residuo

- Il riepilogo conta come «non risolto» un esercizio già risolto prima della sessione e non riverificato: comportamento di F05, non toccato.
- A 800 px la tabella del riepilogo, ora di sette colonne, scorre in orizzontale dentro il suo contenitore.
- La regione `aria-live` del saldo non è stata provata con un lettore di schermo.
- Testi dell’interfaccia scritti da me senza passare dalle norme di scrittura, come in F05 e F13.

### Consumo reale

Non noto.
