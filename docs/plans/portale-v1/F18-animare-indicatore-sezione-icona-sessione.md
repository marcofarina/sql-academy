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

Da compilare alla chiusura: esito, verifiche, correzione del contratto, icona e collaudo della skill, osservazioni di Marco, lavoro residuo, consumo reale se noto.
