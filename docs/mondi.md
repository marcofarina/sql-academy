# I mondi di SQL Academy

Documento di F08 del piano `portale-v2`: livelli dei mondi, otto opere nuove, mondi candidati alle CTF e ordine di costruzione. Livelli e prima scelta delle opere sono decisioni di Marco del 2026-11-23; la rosa è stata rivista con Marco il 2026-11-24, scrivendo il piano `mondi-v1`, che costruisce i mondi. Marco si riserva di cambiare opera durante la costruzione.

## Livelli

Ricavati dai due mondi esistenti, entrambi intermedi: Star Wars (sette tabelle, solo uno a molti, un’autoassociazione `fazioni.leader_id`) e Il Signore degli Anelli (sette tabelle, due molti a molti: `partecipazioni` e `tappe`).

| | Facile | Intermedio | Complesso |
| --- | --- | --- | --- |
| Tabelle | tre o quattro | sei-otto | dieci-14 |
| Associazioni | solo uno a molti, una o due chiavi esterne | uno a molti più una o due molti a molti, con attributi sulla tabella ponte; al massimo un’autoassociazione | più molti a molti, autoassociazioni (gerarchie, evoluzioni), associazioni con date di inizio e fine o fra tre entità |
| Capitoli del libro | 6–8: una tabella, join fra due tabelle, aggregazioni; poche sottoquery semplici | 6–9 completi | 6–9, con join su quattro o più tabelle, sottoquery annidate, `WITH` |
| Esercizi | 60–80 | 140–150 | 150–200 |
| Posto nel percorso | primi mondi, «consigliati per cominciare» | centro del percorso | ultimi; candidati alle CTF |

Con gli otto mondi nuovi il portale ha dieci mondi: tre facili, cinque intermedi, due complessi.

## Le otto opere

Rosa rivista il 2026-11-24. Qui motivo e forma del dominio in breve; abbozzo completo, fonti e rischi stanno nei file dei mondi del piano [`mondi-v1`](plans/mondi-v1/README.md), che li aggiorna durante la costruzione. Le note su notorietà, età e diritti vengono da una ricerca sul web del 2026-11-23, quelle sui mondi aggiunti il 2026-11-24 da verificare nella fase A del mondo.

### Facili

| Opera | Motivo | Dominio in breve |
| --- | --- | --- |
| Stranger Things | Notorietà altissima, quinta stagione uscita a fine 2025; episodi con date e durate | `stagioni`, `episodi`, `personaggi` (episodio del debutto): tre tabelle, due chiavi esterne |
| Dragon Ball | Molto noto in Italia; passato da intermedio a facile il 2026-11-24 | `saghe`, `combattenti` (saga del debutto), `trasformazioni`: tre tabelle, due chiavi esterne |
| Sherlock Holmes | Pubblico dominio, casi chiusi in ogni racconto | `raccolte`, `racconti`, `personaggi`: tre tabelle, due chiavi esterne |

### Intermedi

| Opera | Motivo | Dominio in breve |
| --- | --- | --- |
| One Piece | Fra gli anime e i manga più seguiti; taglie adatte alle aggregazioni. Dominio diverso da quello dell’esercizio «All’arrembaggio!» di *Master Bits* (vincolo di Marco) | `saghe`, `archi`, `personaggi`, `taglie` (storico), `scontri`, `combattenti` (molti a molti) |
| Lego | Entrato il 2026-11-24 al posto di Minecraft; database pubblico e vasto (Rebrickable) da cui si prende una fetta | `temi` (autoassociazione), `set`, `minifigure`, `set_minifigure`, `categorie`, `pezzi`, `set_pezzi` |
| Pokémon | Il dominio più tabellare, notissimo; passato da complesso a intermedio il 2026-11-24 | `generazioni`, `tipi`, `specie` (evoluzione come autoassociazione), `specie_tipi`, `mosse`, `apprendimento` |

### Complessi

| Opera | Motivo | Dominio in breve |
| --- | --- | --- |
| Magic: The Gathering | Entrato il 2026-11-24: il database reale delle carte è vastissimo e strutturato | espansioni, carte, colori, tipi, artisti, stampe (carta × espansione × artista), formati, legalità con data: una decina di tabelle |
| Clash Royale | Entrato il 2026-11-24: molto giocato dai ragazzi, statistiche fitte e aggiornamenti di bilanciamento datati | rarità, arene, carte, statistiche per livello, evoluzioni, aggiornamenti e modifiche, mazzi: una decina di tabelle |

## Opere uscite dalla rosa

Uscite il 2026-11-24 per scelta di Marco. Divina Commedia e Mitologia greca sono destinate agli esercizi del libro (*Python Doesn’t Byte*); Minecraft agli esercizi del libro o a un mondo aggiuntivo con CTF. Abbozzi del 2026-11-23, conservati per quell’uso.

### Minecraft

- **Motivo:** l’opera più nota fra i ragazzi (circa 350 milioni di copie), PEGI 7; dati numerici regolari. La poca trama non pesa su un mondo facile.
- **Dominio:** `biomi` (temperatura, dimensione tipica), `creature` (→ `biomi`; punti vita, danno, ostile sì o no), `attrezzi` (materiale, durata, velocità), `blocchi` (→ `attrezzi` richiesto; durezza, resistenza alle esplosioni). Quattro tabelle, due chiavi esterne.
- **Rischi:** i valori cambiano fra le versioni del gioco: fissa una versione e citala nella traccia. Mojang tollera in genere l’uso non commerciale, da verificare.

### Divina Commedia

- **Motivo:** pubblico dominio, legata al programma di italiano; corpus strutturato (DanteSearch, Università di Bologna, licenza da verificare).
- **Dominio:** `cantiche`, `luoghi` (→ `cantiche`; ordine, tipo: cerchio, girone, cornice, cielo), `colpe` (→ `luoghi`; peccato o virtù, pena), `canti` (→ `cantiche`, → `luoghi`; numero, versi), `anime` (→ `colpe`; città, anno di morte), molti a molti `incontri` (canti × anime, con chi parla). Sei tabelle.
- **Rischi:** pochi ragazzi la sceglierebbero da soli: la veste e la traccia devono renderla un mondo, non un ripasso.

### Mitologia greca

- **Motivo:** pubblico dominio, nessun rischio sui diritti; le genealogie chiedono sottoquery e `WITH`; utile anche alle altre materie.
- **Dominio:** `figure` (tipo: dio, titano, eroe, mortale, mostro), `genitori` (figure × figure: autoassociazione molti a molti), `unioni` (figure × figure), `luoghi`, `culti` (figure × luoghi, santuario), `oggetti` (→ `figure` proprietaria), `imprese` (→ `figure` eroe, → `luoghi`), `avversari` (imprese × figure), `fonti` (opera, autore, secolo), `citazioni` (figure × fonti). Dieci tabelle.
- **Rischi:** le versioni del mito divergono: ogni dato cita la fonte, e la tabella `fonti` lo rende interrogabile. Alcuni miti sono violenti o espliciti: escludili.

## Mondi candidati alle CTF

Magic: The Gathering e Clash Royale, i due complessi (2026-11-24). Le CTF restano a un piano successivo (decisione «CTF» del piano `portale-v2`, confermata nel piano `mondi-v1`).

## Ordine di costruzione

Deciso con Marco il 2026-11-24: prima i facili, poi gli intermedi, infine i complessi.

1. Stranger Things: porta subito nel portale il livello facile, che oggi manca, e collauda la ricetta del piano `mondi-v1`.
2. Dragon Ball.
3. Sherlock Holmes.
4. One Piece.
5. Lego.
6. Pokémon.
7. Magic: The Gathering.
8. Clash Royale.

Ogni mondo chiede uno studio della veste con l’Artifact «Design» prima della costruzione (decisione «Studio della veste»).
