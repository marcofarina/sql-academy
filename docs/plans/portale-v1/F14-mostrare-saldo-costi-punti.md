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

Da compilare a fine fase: esito, verifiche, icone e collaudo della skill (registro nel `README.md`), decisioni nuove, limiti, consumo reale se noto.
