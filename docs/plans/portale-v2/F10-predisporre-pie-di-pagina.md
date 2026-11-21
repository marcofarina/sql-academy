# F10 — Predisporre il piè di pagina comune

- **Modello / effort:** Sonnet 5.5 `medium`. Struttura semplice, forma decisa: un contenitore comune, senza contenuto nuovo.
- **Dipendenze:** F04 (la barra comune fissa l’impaginazione condivisa di tutte le pagine, in cui il piè di pagina si aggiunge).
- **Consumo stimato:** basso.
- **Incertezza:** bassa. Aumenta se le vesti dei temi devono ridisegnare il piè di pagina invece di ereditarne i colori.
- **Punto di ripresa:** componente montato su tutte le pagine con il contenuto provvisorio.

## 1. Obiettivo e risultato atteso

Ogni pagina del sito ha un piè di pagina comune, pronto da riempire. Il contenuto e l’aspetto definitivi **non** si decidono qui: li porterà una sessione aperta nella cartella `~/Developer/github/`, che renderà coerenti i piè di pagina di tutti i mini-siti di Marco (Marco, 2026-11-21). Questa fase prepara il posto e un solo punto da cui riempirlo.

## 2. Contesto minimo

- Oggi esiste solo il piè di pagina della home: paragrafo `home-footer` in `src/pages/HomePage.tsx`, con il link al *Manuale dell’Archivista*, la nota sui titolari delle opere e «I tuoi dati» (verificato il 2026-11-21). Le altre pagine non ne hanno.
- La nota sui titolari e il link all’informativa devono restare raggiungibili da ogni pagina: sono il motivo per cui il piè di pagina di oggi esiste (F10 del piano archiviato).
- Contratto della veste e confinamento delle regole: «Veste di un tema» nelle «Decisioni condivise» del piano archiviato.

## 3. Perimetro

Dentro: un componente comune del piè di pagina montato una volta per tutte le pagine; il contenuto di oggi spostato lì come contenuto provvisorio; i contenuti separati dall’impaginazione, in un solo file, così che la sessione trasversale li sostituisca senza toccare le pagine; colori dalle variabili comuni, ridefinibili dalle vesti; una nota nel `README.md` che dica dove sta il piè di pagina e chi ne decide il contenuto.

Fuori: contenuto e disegno definitivi; link ad altri siti di Marco; ogni modifica fuori da questo repo.

## 4. Attività di implementazione

1. Crea il componente (per esempio in `src/footer/`) e montalo nell’impaginazione comune introdotta da F04.
2. Sposta il contenuto di `home-footer` in un file di soli contenuti; togli il paragrafo dalla home.
3. Controlla che il piè di pagina non disturbi il tavolo delle locandine, il mazzo a 375 px e le pagine lunghe (catalogo, classifica).
4. Usa solo variabili comuni di `src/styles.css`; verifica che le vesti di Star Wars e LOTR lo rendano leggibile in entrambi gli schemi, con `node docs/design/contrasto.mjs` se aggiungi coppie di colori.
5. Scrivi nel `README.md` dove sta il file dei contenuti e che il contenuto definitivo arriva dalla sessione trasversale.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm run lint && npm test && npm run check:themes && npm run build` | Nessun errore |

Procedura manuale (`npm run dev`, a 1280 e a 375 px): il piè di pagina compare nella home, in ogni sezione dei due temi in entrambi gli schemi, in Zaino, Classifica, Informativa e nella pagina non trovata; il link al libro, la nota sui titolari e «I tuoi dati» funzionano ovunque.

## 6. Passaggio di consegne

Da compilare a fine fase. Indica il percorso del file dei contenuti: è ciò che la sessione trasversale deve sapere.
