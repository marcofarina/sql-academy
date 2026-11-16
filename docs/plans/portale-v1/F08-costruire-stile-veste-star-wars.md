# F08 — Costruire il sistema di stile per tema e la veste Star Wars

- **Modello / effort:** Opus 5.5 `medium`. Si decide che cosa un tema può personalizzare: è una parte del contratto.
- **Dipendenze:** F03. Conviene dopo F05 e F06, per vestire componenti già esistenti; se la apri prima, rivedi le viste nuove quando arrivano.
- **Consumo stimato:** medio.
- **Incertezza:** media. Le verifiche sono visive.
- **Punto di ripresa:** variabili comuni applicate a tutti i componenti con la veste neutra, prima della veste Star Wars.

## 1. Obiettivo e risultato atteso

Ogni tema cambia colori, caratteri e decorazioni del sito attraverso il proprio `stile.css` e il manifest, senza toccare i componenti. Star Wars ha la sua veste; la pagina iniziale del portale ha una veste neutra propria.

## 2. Contesto minimo

- Passaggi di consegne di F03, F05, F06.
- Skill `frontend-design`, da caricare prima di disegnare.
- Icone: `~/Developer/github/icone-libere/phosphor-duotone/` (MIT). Copia solo quelle usate.
- Vincolo di `AGENTS.md`: nessuna immagine, logo o font ufficiale delle opere.

## 3. Perimetro

Dentro: variabili CSS comuni, punti di personalizzazione nel contratto, `themes/star-wars/stile.css`, caratteri liberi serviti dal progetto, tema dell’editor SQL, veste della pagina iniziale.

Fuori: nuove funzionalità, modifiche alla struttura delle pagine oltre a ciò che lo stile richiede.

## 4. Attività di implementazione

1. Elenca i punti di personalizzazione e fissali nel contratto: colori di superficie, testo, accento, esiti; carattere dei titoli, del testo e del codice; raggio e bordi; uno spazio per decorazioni (sfondo, intestazione). Aggiorna il `README.md` del piano.
2. Sostituisci nei componenti comuni ogni colore e carattere scritto a mano con le variabili. Lo `stile.css` del tema si applica solo dentro il guscio del tema.
3. Disegna la veste Star Wars con caratteri a licenza libera, serviti dal progetto con il loro file di licenza. Evoca l’ambientazione senza riprodurre loghi né il carattere del titolo dei film.
4. Applica il tema all’editor SQL e ai diagrammi di F06.
5. Controlla il contrasto di testo e accenti (rapporto minimo 4,5:1 per il testo) con uno strumento, non a occhio, e riporta i valori.
6. Proponi a Marco la veste con schermate prima di rifinire.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm test`, `npm run build`, `npm run lint` | Nessun errore |
| `grep -rnE '#[0-9a-fA-F]{3,8}\b' src --include='*.css' --include='*.tsx'` | Nessun colore scritto a mano fuori dal file delle variabili comuni |

Procedura manuale con `npm run dev`: percorri le sei sezioni di Star Wars a 1280 px e a 375 px; nessun testo illeggibile, nessuno scorrimento orizzontale; la pagina iniziale non eredita la veste del tema. Schermate nel passaggio di consegne o allegate alla risposta finale.

## 6. Passaggio di consegne

Da compilare alla chiusura: esito, verifiche, elenco dei punti di personalizzazione, caratteri scelti e loro licenza, valori di contrasto misurati, osservazioni di Marco, lavoro residuo, consumo reale se noto.
