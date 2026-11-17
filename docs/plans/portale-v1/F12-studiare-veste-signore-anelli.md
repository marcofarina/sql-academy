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
