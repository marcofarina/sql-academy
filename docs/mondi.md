# I mondi di SQL Academy

Documento di F08 del piano `portale-v2`: livelli dei mondi, otto opere nuove, mondi candidati alle CTF e ordine di costruzione. Livelli e scelta delle opere sono decisioni di Marco del 2026-11-23; Marco si riserva di cambiare opera durante la costruzione. Schemi SQL, esercizi e vesti restano al piano successivo.

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

Gli abbozzi danno tabelle principali e associazioni, non lo schema definitivo. Le note su notorietà, età e diritti vengono da una ricerca sul web del 2026-11-23: dove dicono «da verificare», la ricerca non ha trovato una fonte.

### Facili

#### Minecraft

- **Motivo:** l’opera più nota fra i ragazzi (circa 350 milioni di copie), PEGI 7; dati numerici regolari. La poca trama non pesa su un mondo facile.
- **Dominio:** `biomi` (temperatura, dimensione tipica), `creature` (→ `biomi`; punti vita, danno, ostile sì o no), `attrezzi` (materiale, durata, velocità), `blocchi` (→ `attrezzi` richiesto; durezza, resistenza alle esplosioni). Quattro tabelle, due chiavi esterne.
- **Rischi:** i valori cambiano fra le versioni del gioco: fissa una versione e citala nella traccia. Mojang tollera in genere l’uso non commerciale, da verificare.

#### Sherlock Holmes

- **Motivo:** pubblico dominio, testi aperti su Wikisource; personaggi e casi chiusi in ogni racconto.
- **Dominio:** `raccolte` (titolo, anno), `racconti` (→ `raccolte`; anno di pubblicazione, anno dell’ambientazione, luogo, narratore), `personaggi` (→ `racconti`; ruolo: cliente, colpevole, vittima, testimone; esito). Tre tabelle, due chiavi esterne. Holmes e Watson, presenti ovunque, stanno nella traccia e non nella tabella.
- **Rischi:** poco noto ai ragazzi; la traccia deve presentare il mondo senza dare per scontata la lettura dei racconti.

#### Stranger Things

- **Motivo:** notorietà altissima, con la quinta stagione uscita a fine 2025; episodi con date e durate.
- **Dominio:** `stagioni` (anno di uscita, anno dell’ambientazione), `episodi` (→ `stagioni`; numero, titolo, durata, data, regia), `personaggi` (→ `episodi` del debutto; età, ruolo, potere sì o no). Tre tabelle, due chiavi esterne; le creature restano personaggi con un ruolo proprio, per non superare le chiavi esterne del livello.
- **Rischi:** classificata TV-14 negli Stati Uniti per horror e violenza; la classificazione italiana è da verificare. Netflix titolare.

### Intermedi

#### One Piece

- **Motivo:** l’anime più visto su Netflix nel 2025 e fra i manga più venduti in Italia; le taglie sono numeri adatti alle aggregazioni.
- **Dominio:** la storia raccontata dal manga, non l’archivio della Marina. `saghe` (ordine), `archi` (→ `saghe`; capitolo iniziale e finale, anno di pubblicazione), `personaggi` (→ `archi` del debutto; affiliazione: pirati, Marina, Rivoluzionari, Governo Mondiale), `taglie` (→ `personaggi`, → `archi`: importo dopo l’arco, cioè la storia delle taglie), `scontri` (→ `archi`; capitolo, luogo), molti a molti `combattenti` (scontri × personaggi, con schieramento ed esito). Sei tabelle, una molti a molti.
- **Vincolo di Marco:** le opere possono sovrapporsi, i domini no. L’esercizio «All’arrembaggio!» (pagina Notion di *Master Bits*, Manuale dell’Archivista, ER e modello logico) usa ciurme con Jolly Roger e mare, membri con ruolo e taglia, frutti del diavolo legati a una sola persona, isole e approdi datati. Il mondo lascia fuori ciurme, frutti, isole e approdi, e tratta la taglia come storico invece che come attributo del membro.
- **Rischi:** Shueisha e Toei, politica sui progetti dei fan da verificare; violenza da fumetto.

#### Dragon Ball

- **Motivo:** molto noto in Italia, con Dragon Ball Super fra i fumetti più venduti nel 2025; tornei e saghe danno piazzamenti, ordini e date.
- **Dominio:** `razze`, `pianeti`, `combattenti` (→ `razze`, → `pianeti`, → `combattenti` maestro: autoassociazione), `saghe` (ordine, episodi), `trasformazioni` (→ `combattenti`, → `saghe` della prima comparsa), `tornei` (→ `saghe`; anno, luogo), molti a molti `partecipazioni` (combattenti × tornei, con piazzamento). Sette tabelle.
- **Rischi:** i livelli di potenza sono incoerenti fra le fonti: non usarli come dato. Toei e Shueisha, da verificare.

#### Divina Commedia

- **Motivo:** pubblico dominio, legata al programma di italiano; corpus strutturato (DanteSearch, Università di Bologna, licenza da verificare).
- **Dominio:** `cantiche`, `luoghi` (→ `cantiche`; ordine, tipo: cerchio, girone, cornice, cielo), `colpe` (→ `luoghi`; peccato o virtù, pena), `canti` (→ `cantiche`, → `luoghi`; numero, versi), `anime` (→ `colpe`; città, anno di morte), molti a molti `incontri` (canti × anime, con chi parla). Sei tabelle.
- **Rischi:** pochi ragazzi la sceglierebbero da soli: la veste e la traccia devono renderla un mondo, non un ripasso.

### Complessi

#### Pokémon

- **Motivo:** il dominio più ricco e più tabellare della rosa, notissimo a tutte le età.
- **Dominio:** `generazioni`, `regioni` (→ `generazioni`), `tipi`, `efficacia` (tipi × tipi, moltiplicatore), `specie` (→ `generazioni`; statistiche base), `specie_tipi` (molti a molti, con posizione), `evoluzioni` (specie × specie, livello o metodo: autoassociazione), `mosse` (→ `tipi`; potenza, precisione, PP), `apprendimento` (specie × mosse, livello), `palestre` (→ `regioni`, → `tipi`; città), `allenatori` (→ `palestre`), `squadre` (allenatori × specie, livello). Dodici tabelle.
- **Rischi:** Nintendo e The Pokémon Company sono le più aggressive della rosa sui progetti dei fan. Solo nomi, nessuna immagine, icone RB stilizzate. I dati di PokeAPI hanno licenza d’origine incerta: costruisci un sottoinsieme a mano, citando le fonti.

#### Mitologia greca

- **Motivo:** pubblico dominio, nessun rischio sui diritti; le genealogie chiedono sottoquery e `WITH`; utile anche alle altre materie.
- **Dominio:** `figure` (tipo: dio, titano, eroe, mortale, mostro), `genitori` (figure × figure: autoassociazione molti a molti), `unioni` (figure × figure), `luoghi`, `culti` (figure × luoghi, santuario), `oggetti` (→ `figure` proprietaria), `imprese` (→ `figure` eroe, → `luoghi`), `avversari` (imprese × figure), `fonti` (opera, autore, secolo), `citazioni` (figure × fonti). Dieci tabelle.
- **Rischi:** le versioni del mito divergono: ogni dato cita la fonte, e la tabella `fonti` lo rende interrogabile. Alcuni miti sono violenti o espliciti: escludili.

## Mondi candidati alle CTF

Pokémon e Mitologia greca, i due complessi. Le CTF restano a un piano successivo (decisione «CTF» del piano `portale-v2`).

## Ordine di costruzione consigliato

1. Minecraft: porta subito nel portale il livello facile, che oggi manca, e collauda il livello nel contratto (F09).
2. Stranger Things.
3. Sherlock Holmes.
4. One Piece.
5. Dragon Ball.
6. Divina Commedia.
7. Mitologia greca: il primo complesso è quello senza rischi sui diritti.
8. Pokémon, per ultimo: è il dominio più grande e il più esposto sui diritti.

Ogni mondo chiede uno studio della veste con l’Artifact «Design» prima della costruzione (decisione «Studio della veste»).
