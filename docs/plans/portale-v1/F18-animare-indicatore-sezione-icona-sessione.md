# F18 — Animare l’indicatore della sezione e sostituire l’icona della sessione

- **Modello / effort:** Opus 5.5 `medium`. Un componente comune nuovo, con animazione e accessibilità, e un’icona da disegnare: lavoro di giudizio.
- **Dipendenze:** F09.
- **Consumo stimato:** medio. Una modifica al guscio, la sua resa in due temi e quattro schemi, un’icona nuova da far approvare.
- **Incertezza:** media. Cresce se l’indicatore deve restare agganciato a una lista che scorre in orizzontale a 375 px, o se l’icona richiede più varianti.
- **Punto di ripresa:** indicatore animato nel guscio, verificato in LOTR chiaro, prima di adattare gli altri schemi e prima dell’icona.

## 1. Obiettivo e risultato atteso

Feedback di Marco del 2026-11-18, dopo la prova di F09:

1. Il pallino sotto la sezione attiva di LOTR chiaro, quando lo studente cambia sezione, **viaggia** lungo il percorso tratteggiato dalla voce precedente alla nuova, accelerando e decelerando come le animazioni di Apple. L’effetto vale per tutti gli schemi: ogni tema decide l’aspetto dell’indicatore (pallino nel chiaro di LOTR, linea di *ithildin* nello scuro, le due strisce e la lama di Star Wars), il guscio lo sposta.
2. Il pulsante «Nuova sessione» dell’addestramento non usa più l’icona `dice`, che a Marco non piace. Al suo posto un’icona RB scelta o creata con la skill `icone-rb` e approvata da Marco.

## 2. Contesto minimo

- `src/pages/ThemePage.tsx`: barra delle sezioni. Oggi l’indicatore è un pseudo-elemento della voce con `aria-current="page"`, quindi non può spostarsi da una voce all’altra.
- `src/styles.css` (regole `.sections`) e le vesti `themes/star-wars/stile.css`, `themes/lotr/stile.css`: ognuna disegna il proprio indicatore con `.sections a[aria-current='page']::after`.
- `docs/design/lotr.md` e `docs/design/star-wars.md`: aspetto degli indicatori approvato.
- Il selettore chiaro/scuro scorre già con una transizione CSS (`.scheme-switch::before`, commit `f7fa065`): curva `cubic-bezier(0.65, 0, 0.35, 1)`, 0,45 s. L’indicatore deve avere lo stesso carattere.
- Icone: sezione «Icone» del `README.md` del piano, skill `icone-rb`. L’icona comune va in `src/assets/icons/`.
- Il pannello del browser di Claude, se nascosto, non fa avanzare le animazioni: per vedere il movimento serve il pannello visibile, oppure la verifica la fa Marco.

## 3. Perimetro

Dentro: un indicatore unico nella barra delle sezioni, posizionato e animato dal guscio; regole dell’indicatore nelle due vesti; `prefers-reduced-motion`; icona della nuova sessione.

Fuori: altre animazioni, il contenuto delle sezioni, il selettore dello schema.

## 4. Attività di implementazione

1. Aggiungi alla barra un elemento decorativo (`aria-hidden="true"`) che il guscio posiziona sotto la voce attiva leggendo la sua posizione e larghezza. Aggiornalo al cambio di sezione, al ridimensionamento della finestra, al caricamento dei caratteri e allo scorrimento orizzontale della lista a 375 px.
2. Anima lo spostamento con una transizione CSS su `transform` e `width`, con una curva che accelera e decelera. Al primo disegno della pagina l’indicatore compare al suo posto, senza viaggio.
3. Con `prefers-reduced-motion: reduce` l’indicatore salta alla nuova voce senza animazione.
4. Sposta nelle vesti l’aspetto dell’indicatore: una classe o una variabile del contratto per l’indicatore, documentata in `src/themes/contract.ts`. È una modifica al contratto: dichiarala nel commit e aggiorna la guida «Aggiungere un tema» del `README.md`.
5. Rifai l’indicatore nei quattro schemi (Star Wars chiaro e scuro, LOTR chiaro e scuro) e confrontalo con le tavole.
6. Icona: cerca nel catalogo un’alternativa a `dice` con significato «inizia una sessione di esercizi» (sinonimi: play, start, rocket, cards, shuffle, sessione, allenamento). Se manca, disegnala con la skill. Mostra a Marco il render a 128 px e attendi l’approvazione; registra l’icona nel «Registro icone».

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm run check:themes` | Exit 0 su entrambi i temi |
| `npm test`, `npm run lint`, `npm run build` | Exit 0 |

Procedura manuale con `npm run dev`, pannello del browser visibile:

1. In `#/lotr/sandbox`, schema chiaro, clicca «Modello logico»: il pallino scorre lungo il percorso fino alla nuova voce, parte lento, accelera e rallenta all’arrivo.
2. Ripeti negli altri tre schemi: ogni indicatore viaggia con il proprio aspetto.
3. A 375 px, scorri la lista delle sezioni in orizzontale: l’indicatore resta sotto la voce attiva.
4. Con la riduzione del movimento attiva nel sistema, l’indicatore salta senza animazione.
5. In `#/<tema>/addestramento` il pulsante «Nuova sessione» mostra l’icona approvata.

## 6. Passaggio di consegne

Fase completata il 2026-11-18 su Opus 5.5, in una sessione.

### Esito

- **Indicatore.** `src/pages/SectionIndicator.tsx` aggiunge alla lista delle sezioni un elemento `li.sections-indicator` con `aria-hidden="true"`. Il guscio gli dà posizione (`transform`) e misure (`width`, `height`) della voce attiva, lette da `offsetLeft`, `offsetTop`, `offsetWidth`, `offsetHeight`. Al cambio di sezione viaggia con la curva del selettore dello schema, `cubic-bezier(0.65, 0, 0.35, 1)` in 0,45 s; al primo disegno e quando un `ResizeObserver` vede cambiare la lista o una voce (finestra ridimensionata, caratteri caricati, voci che vanno a capo) salta senza transizione. Con `prefers-reduced-motion: reduce` la transizione è disattivata.
- **Scostamento dal dettaglio:** l’indicatore sta *dentro* la lista (`ul` con `position: relative`), non nella barra; così scorre con la lista a 375 px senza ascoltare l’evento `scroll`. Segue anche il ritorno a capo delle voci su due righe, perché legge pure la posizione verticale.
- **Vesti.** Le quattro regole `.sections a[aria-current='page']::after` sono diventate `.sections-indicator::after`, con gli stessi valori; tolte le regole `box-shadow: none`, perché la linea comune ora è anch’essa `.sections-indicator::after` in `src/styles.css`.
- **Icone.** `rocket` è l’icona comune dei pulsanti che avviano una sessione («Nuova sessione», «Riprendi la sessione», «Avvia la sessione»), con il componente `src/training/SessionIcon.tsx`. `dice` resta nel portale perché la usa «Rimescola» nella pagina iniziale.

### Correzione del contratto

Due aggiunte, documentate in `src/themes/contract.ts` e nella guida «Aggiungere un tema» del `README.md`:

1. `.sections-indicator::after` disegna l’indicatore della sezione attiva; il tema non gli dà transizioni proprie.
2. Campo facoltativo `session` in `ThemeIcons` (anche per schema): l’icona dei pulsanti della sessione al posto di `rocket`. Fuori dal perimetro iniziale, chiesto da Marco quando ha approvato `rocket`.

### Verifiche

| Verifica | Esito |
| --- | --- |
| `npm run check:themes` | superata: `lotr` 20 esercizi, `star-wars` 105, 0 problemi |
| `npm test` | superata: 15 file, 119 test |
| `npm run lint` | superata |
| `npm run build` | superata (resta l’avviso già noto sulla dimensione dei *chunk*) |
| Procedura 1, LOTR chiaro da Sandbox a Modello logico | superata, misurata nel pannello visibile: `translateX` 0 → 7 → 172 → 520 → 648 → 651 px a 0, 77, 210, 310, 443, 577 ms, cioè partenza lenta, accelerazione, frenata |
| Procedura 2, altri tre schemi | superata a vista: lama di Star Wars scuro, strisce di Star Wars chiaro, *ithildin* di LOTR scuro al loro posto; il viaggio è lo stesso elemento, misurato solo in LOTR chiaro |
| Procedura 3, 375 px con la lista che scorre | superata: bordo sinistro della voce attiva e dell’indicatore coincidono (667,4 e 667 px a lista a inizio corsa, 207,4 e 207 px a fine corsa) |
| Procedura 4, riduzione del movimento | **non eseguita** nel sistema: il pannello non emula `prefers-reduced-motion`. Verificato solo che la regola `@media (prefers-reduced-motion: reduce) { .sections-indicator { transition: none !important } }` è caricata |
| Procedura 5, icona di «Nuova sessione» | superata: `hobbit-backpack` in LOTR chiaro e scuro, `x-wing` in Star Wars chiaro, `tie-fighter` in Star Wars scuro. `rocket` non compare in nessuno dei due temi, perché entrambi la sostituiscono: la sua resa nel portale non è stata vista |

### Icone e collaudo della skill

- Ricerca con `tools/search.py` per play, start, rocket, cards, carte, shuffle, mescola, sessione, session, allenamento, training, repeat, random, forward e altri: trovate solo `circle-play` (già «Esegui»), `bullseye` (già la sezione Addestramento) e `dice`. Nessuna alternativa.
- Create con Opus 5.5 e approvate da Marco: `rocket` (commit `f6df297` del repo `icone`), `tie-fighter` e `hobbit-backpack` (commit `4b7c90f`). `hobbit-backpack` è alla seconda versione: la prima, con due cinghie che uscivano dal rotolo sopra una scatola, a Marco sembrava un detonatore.
- Avvisi di copertura (R1.6, non bloccanti): `rocket` 40,7%, `hobbit-backpack` 79,5%.
- Nessun problema della skill o degli strumenti in questa fase.

### Osservazioni di Marco e lavoro residuo

- Marco propone il corno di Gondor come icona dei suggerimenti in LOTR: oggi i suggerimenti usano l’icona comune `lightbulb` e il contratto non ha un campo per sostituirla. Da decidere in una fase futura.
- Durante la verifica ho svuotato il `localStorage` del pannello del browser di Claude su `localhost:5173` (schemi e progressi di prova di quel pannello). Il browser di Marco non è stato toccato.
- Nessun push: i commit del repo `icone` restano locali, sul branch `dev`.
