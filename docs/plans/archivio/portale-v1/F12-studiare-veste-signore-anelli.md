# F12 — Studiare la veste del Signore degli Anelli con lo strumento di design

- **Modello / effort:** Opus 5.5 `medium`. Si decide la forma visiva di un tema: serve giudizio, non esecuzione.
- **Dipendenze:** F08, perché i punti di personalizzazione del tema sono fissati lì e la veste deve usarli; F11, da cui riprende metodo e veste neutra. Precede F09, che applica le scelte. Aggiunta il 2026-11-17 su richiesta di Marco; l’ID non indica l’ordine.
- **Consumo stimato:** medio. Pesano le iterazioni con Marco sulle tavole.
- **Incertezza:** media. Cresce se la veste chiede un punto di personalizzazione che il contratto non ha.
- **Punto di ripresa:** direzione scelta da Marco fra le due proposte, prima di rifinirla.

## 1. Obiettivo e risultato atteso

Prima che F09 costruisca il tema, Marco vede e approva l’aspetto del Signore degli Anelli su tavole disegnate con lo strumento di design di Claude. Al termine esistono:

- un Artifact di tipo «Design» con le tavole approvate;
- la specifica `docs/design/lotr.md`, che F09 applica in `themes/lotr/stile.css` senza reinventare le scelte.

## 2. Contesto minimo

- Passaggi di consegne di F08 e F11; `docs/design/neutra.md` e `docs/design/star-wars.md` come esempio di specifica.
- Punti di personalizzazione del contratto del tema, fissati in F08 (sezione «Struttura di un tema» del `README.md` del piano).
- Sezione «Icone» del `README.md` del piano: icone solo RB, anche tematiche; loghi ed emblemi solo stilizzati; nessuna immagine né font ufficiale dell’opera.
- Skill `frontend-design`, da caricare prima di disegnare.
- Strumento: Artifact di tipo «Design», avviato dal tool `Artifact` con `action: "quickstart"` e `intent: "design"`.

## 3. Perimetro

Dentro: veste del guscio del tema e della sandbox, con gli stati della sandbox e le sezioni già costruite, a desktop e a 375 px; palette, caratteri, decorazioni; proposta delle icone tematiche.

Fuori: codice (F09), creazione delle icone tematiche (F09, con la skill `icone-rb`), modifiche ai componenti comuni. Se una scelta richiede un punto di personalizzazione che il contratto non offre, **non** disegnarla come se esistesse: descrivila a Marco come possibile difetto del contratto.

## 4. Attività di implementazione

1. Fai uno screenshot del portale con la veste Star Wars di F08: le tavole devono mostrare un tema chiaramente diverso.
2. Crea l’Artifact «Design» e proponi due direzioni diverse per il tema; attendi la scelta di Marco, poi rifinisci quella scelta.
3. Nelle tavole usa solo le icone RB già nel progetto; le icone tematiche proposte (per esempio anelli, mappe, spade, luoghi, stemmi dei regni) restano segnaposto descritti a parole.
4. Caratteri solo a licenza libera, verificata alla fonte; annota nome, licenza e URL.
5. Misura con uno script il contrasto di ogni coppia testo/fondo e accento/fondo (minimo 4,5:1 per il testo normale).
6. Scrivi `docs/design/lotr.md` con la stessa struttura delle specifiche di F11: link all’Artifact, valori delle variabili, decorazioni, icone tematiche da creare, contrasti misurati.

## 5. Criteri di accettazione

| Verifica | Risultato atteso |
| --- | --- |
| Approvazione di Marco | Tavole del tema approvate, in chat |
| `docs/design/lotr.md` | Esiste; ogni colore e carattere delle tavole vi compare con il suo valore; ogni valore corrisponde a un punto di personalizzazione del contratto |
| Script di contrasto | Ogni coppia testo/fondo almeno 4,5:1; valori riportati nella specifica |
| Caratteri | Ognuno con licenza libera verificata alla fonte e URL |
| `git status` | Nessun file fuori da `docs/` modificato |

## 6. Passaggio di consegne

Da compilare alla chiusura: esito, link all’Artifact, direzione scartata e perché, verifiche, eventuali lacune del contratto segnalate a Marco, lavoro residuo per F09, consumo reale se noto.

**Esito: completata il 2026-11-18 13:18**, su Opus 5.5, in una sessione.

### Tavole e scelte di Marco (2026-11-18)

- Artifact «Design» [SQL Academy — veste Il Signore degli Anelli](https://claude.ai/artifact/DtawNio6cxm36cFE3Euij7), privato, senza design system (scelta di Marco). Riferimento di partenza: schermata della sandbox Star Wars chiara di F08.
- Due direzioni proposte: A «La mappa della Contea» (chiara) e B «Le porte di Moria» (scura). Marco le ha **approvate entrambe**, una come schema chiaro e l’altra come scuro, e ha chiesto il selettore degli schemi come in Star Wars. Nessuna direzione scartata; scartato solo il fronte scuro della locandina.
- Tavole finali per schema: sandbox con risultato (1280 px), sandbox con errore (375 px), stati della sandbox (1280 px); più la locandina.

### Cambio di perimetro: icone create in F12

Marco ha chiesto in questa fase, e non in F09, le icone tematiche. Create con la skill `icone-rb` (Opus 5.5) e approvate: `hobbit-door`, `durin-door`, `one-ring`, `eye-of-sauron`, `wizard-staff`, `magic-wand`. Commit `1f16200` nel repository `icone`, branch `dev`, nessun push. La copia in `themes/lotr/icone/` resta a F09: in F12 non si tocca nulla fuori da `docs/`.

Collaudo della skill `icone-rb`:

- ricerca: nessun soggetto presente (porta, hobbit, arco, moria, anello, occhio, bastone, mago, catena e sinonimi);
- `wizard-staff`: la prima versione (stella su un’asta) sembrava una bacchetta; due tentativi intermedi respinti da `validate.py` per copertura sotto il 30 % (R1.6). Marco ha fornito una foto di riferimento del bastone: disegnata da quella, che è l’oggetto reale e non un’icona Font Awesome, quindi nel rispetto della clean room. La prima versione resta come `magic-wand`;
- `eye-of-sauron`: i raggi scuri nella parte chiara sembravano un ragno; sostituiti da un contorno a fiamme generato con uno script;
- `one-ring`: la prima catenella era una maglia infilata nell’anello; Marco ha chiesto una catenella doppia a parabola. Copertura del 25 % e larghezza del catalogo sbagliata (384 invece di 512) segnalate da `validate.py` e corrette; le maglie lungo la parabola sono calcolate con uno script (`tmp/f12/ring.py` nella libreria). Un primo errore nel verso degli archi delle maglie le rendeva quasi invisibili: la validazione l’ha colto (secondario all’1,2 %, R3.8);
- tutte con il solo avviso di copertura sotto il 45–70 % consigliato; `wizard-staff` al 30,3 %, al limite.

### Lacune del contratto segnalate a Marco

1. Un tema non può cambiare l’icona di una sezione (`ThemeIcons` ha solo `emblem`, `solved`, `empty`): serve per `one-ring` sulla sandbox.
2. Nessuna cartella per decorazioni SVG: proposta di usarle come `data:` URI in `stile.css` e `locandina.css`, senza toccare il contratto.

Entrambe in `docs/design/lotr.md`, sezione «Lacune del contratto»; F09 le risolve con commit dichiarati.

### Verifiche (2026-11-18)

| Verifica | Esito |
| --- | --- |
| Approvazione di Marco | superata: «Approvo tutto», tavole, icone e locandina chiara |
| `docs/design/lotr.md` | superata: ogni colore e carattere delle tavole compare con il suo valore; ogni variabile esiste in `src/styles.css`, salvo le tre `--lotr-…` locali alle decorazioni del tema |
| `node docs/design/contrasto.mjs lotr-chiaro` e `lotr-scuro` | superata: exit 0, minimo testo 5,53:1 (chiaro) e 5,58:1 (scuro); `node docs/design/contrasto.mjs` su tutte le palette, exit 0 |
| Caratteri | superata: IM Fell English, IM Fell English SC, Cinzel, SIL OFL 1.1 senza nomi riservati, verificati su `OFL.txt` e `METADATA.pb` di `google/fonts`; URL nella specifica |
| `git status` | superata: modificati solo file in `docs/` e `AGENTS.md` (riga di stato, come nelle fasi precedenti) |
| `python3 tools/validate.py` nella libreria icone | superata: 42 icone, 0 errori |

Le tavole non sono state controllate con screenshot del canvas: le istruzioni dell’Artifact «Design» vietano la verifica non richiesta. Le ha viste e approvate Marco.

### Lavoro residuo per F09

- Applicare la specifica in `themes/lotr/stile.css` e `locandina.css`; scaricare i quattro TTF con `OFL.txt`.
- Copiare le icone usate in `themes/lotr/icone/`; proporre a Marco `solved` ed `empty`.
- Risolvere le due lacune del contratto.
- Rivedere nei due schemi le cinque sezioni senza tavole.
