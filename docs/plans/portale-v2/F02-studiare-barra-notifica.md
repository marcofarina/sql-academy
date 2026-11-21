# F02 — Studiare barra comune, stato dello zaino e notifica dell’esito

- **Modello / effort:** solo Claude Code, Opus; effort consigliato `medium`. Fase di disegno con l’Artifact «Design»: decide la forma di tre elementi che compaiono in ogni pagina.
- **Dipendenze:** nessuna.
- **Consumo stimato:** medio-alto: tavole interattive in più varianti, provate su due temi con due schemi ciascuno e sulla veste neutra, a 1280 e a 375 px.
- **Incertezza:** media. Aumenta se Marco chiede più giri sulle tavole o se la barra comune impone di rivedere le intestazioni delle vesti.
- **Punto di ripresa:** tavole approvate nell’Artifact, prima della specifica.

## 1. Obiettivo e risultato atteso

Tavole approvate da Marco e una specifica, `docs/design/barra-notifica.md`, per tre elementi:

1. **La barra comune** in testa a tutte le pagine (punto 4A del feedback): home, pagine di un tema, Zaino, Classifica, Informativa, pagina non trovata. Contiene almeno il ritorno ai temi, Zaino, Classifica e, dentro un tema, nome, saldo e selettore dello schema. Nelle pagine Zaino e Classifica offre «Indietro» verso la pagina di provenienza (punto 4B).
2. **Lo stato dello zaino** visibile a colpo d’occhio nella barra (punto 1): collegato e sincronizzato, in sincronizzazione, con modifiche in sospeso, senza rete, in errore, non collegato.
3. **La notifica dell’esito** di un esercizio risolto (punti 2 e 3): che cosa è successo, punti guadagnati (o perché zero), saldo, stato del salvataggio nello zaino. Pulsante «OK» che si riempie in 3–4 secondi e chiude la notifica; il puntatore sopra il pulsante ferma riempimento e tempo.

## 2. Contesto minimo

- Decisione sulla notifica: README del piano, «Decisioni condivise».
- Specifiche delle vesti: `docs/design/neutra.md`, `docs/design/star-wars.md`, `docs/design/lotr.md`; contrasti con `node docs/design/contrasto.mjs`.
- Stato del codice, verificato il 2026-11-21:
  - ogni pagina ha la propria intestazione: `theme-header` in `src/pages/ThemePage.tsx`, `home-header` in `src/pages/HomePage.tsx`, un solo `back-link` «Tutti i temi» verso `#/` in `ZainoPage.tsx`, `ClassificaPage.tsx`, `InformativaPage.tsx`, `NotFoundPage.tsx`;
  - `src/zaino/ZainoLink.tsx` mostra lo stato solo nel `title` e, in caso di problemi, con `triangle-exclamation`: da collegato non si distingue da scollegato;
  - stati dello zaino in `src/zaino/sincronizza.ts` (`FaseZaino`: `scollegato`, `in-corso`, `sincronizzato`, `offline`, `errore`; campi `inSospeso`, `ultima`) e frasi in `src/zaino/labels.ts` (`testoStato`);
  - lo zaino scrive 5 secondi dopo l’ultima modifica (`RITARDO_MODIFICA` in `sincronizza.ts`), più dei 3–4 secondi della notifica: la tavola deve dire che cosa mostra la notifica quando il salvataggio non è ancora avvenuto (F05 decide come anticiparlo);
  - il riquadro di oggi è `VerdictView` in `src/training/ExerciseWorkspace.tsx`, classe `notice-success`.
- Le vesti dei temi ridefiniscono l’intestazione nei propri `stile.css` (`theme-header`, `back-link`, `zaino-link`): la barra comune deve restare vestibile dal tema.

## 3. Perimetro

Dentro: tavole nell’Artifact «Design», specifica, misura dei contrasti per ogni palette usata.

Fuori: codice del portale (F04, F05); le pagine Zaino e Classifica oltre alla barra (F03); icone nuove, che restano segnaposto e si disegnano in F04 o F05.

Domande da decidere con Marco sulle tavole:

- nelle pagine Zaino e Classifica raggiunte da un tema, la barra resta nella veste del tema o passa alla neutra;
- che cosa fa «Indietro» se la pagina è aperta da un link diretto, senza pagina di provenienza;
- dove compare la notifica (in alto, in basso, sopra lo spazio di lavoro) e come si comporta in una sessione, dove dopo l’esito si passa all’esercizio successivo;
- che cosa dice la notifica se lo zaino non è collegato: solo «salvato in questo browser», o anche un invito a collegarlo;
- se la notifica serve anche ad altri eventi (aiuti comprati, zaino che torna in rete) o solo all’esercizio risolto.

## 4. Attività di implementazione

1. Leggi le tre specifiche delle vesti e le intestazioni nei `stile.css` dei temi.
2. Apri l’Artifact con `quickstart` e intent `design`. Disegna la barra comune in due direzioni, su veste neutra e su un tema in entrambi gli schemi, a 1280 e a 375 px.
3. Disegna lo stato dello zaino per tutte le fasi di `FaseZaino` più `inSospeso`.
4. Disegna la notifica interattiva: riempimento, pausa sotto il puntatore, chiusura da sola, chiusura con «OK»; varianti con punti pieni, punti zero (soluzione già vista, esercizio già risolto), zaino salvato, in sospeso, non collegato, senza rete. Includi il comportamento con `prefers-reduced-motion` e con la tastiera (il fuoco sul pulsante ferma il tempo come il puntatore: la sola pausa al passaggio del mouse lascerebbe fuori chi usa la tastiera).
5. Mostra le tavole a Marco e itera fino all’approvazione.
6. Scrivi `docs/design/barra-notifica.md`: idea, colori per veste, misure, stati, comportamento, testi, punti aperti per F04 e F05, link all’Artifact. Aggiungi le palette nuove a `docs/design/contrasto.mjs`, se ce ne sono.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `node docs/design/contrasto.mjs` | Nessuna coppia sotto le soglie (4,5:1 testo, 3:1 bordi e icone) |

Procedura manuale: Marco approva le tavole nell’Artifact; la specifica cita le tavole approvate e copre tutte le domande del § 3.

## 6. Passaggio di consegne

- **Esito:** completata il 2026-11-21. Tavole nell’Artifact «Design» [SQL Academy — barra comune e notifica](https://claude.ai/artifact/GjaruUBdHCVavq5iYXQtvp), privato; specifica `docs/design/barra-notifica.md`; palette `barra-notifica` in `docs/design/contrasto.mjs`.
- **Verifiche:**
  - superata: `node docs/design/contrasto.mjs barra-notifica`, 60 coppie su 60 sopra la soglia; `node docs/design/contrasto.mjs` esce con 0;
  - superata: Marco ha approvato le tavole (direzione A) il 2026-11-21, senza modifiche alle altre proposte;
  - la specifica risponde a tutte le domande del § 3, nella tabella «Decisioni».
- **Decisioni nuove** (Marco, 2026-11-21):
  - barra in una riga sola (direzione A); la direzione B resta nell’Artifact come confronto;
  - Zaino e Classifica raggiunte da un tema in veste neutra del sito, con «Torna a <tema>»;
  - «Indietro» senza provenienza diventa «Tutti i temi»;
  - notifica in alto a destra su desktop, dal fondo sul telefono; non fa avanzare la sessione;
  - zaino non collegato: «Salvato in questo browser» più il link «Collega lo zaino»;
  - la notifica serve solo all’esercizio risolto;
  - riempimento di «OK» in 4 secondi, nel colore del testo con la scritta invertita; con movimento ridotto nessun riempimento e nessuna chiusura automatica.
- **Scostamenti dal dettaglio:**
  - la pausa vale per tutta la notifica, non solo per il pulsante: la riga dello zaino si legge senza che la notifica si chiuda. Proposto nelle tavole, accettato da Marco;
  - il riempimento di «OK» usa il colore del testo invece di una tinta intermedia: nessuna tinta intermedia superava le soglie in Il Signore degli Anelli;
- **Limiti:** la soglia di larghezza fra notifica in alto e dal fondo non è decisa (punto aperto per F05). L’icona «senza rete» è un segnaposto.
- **Lavoro residuo:** punti aperti per F04 e F05 nella specifica, sezione «Punti aperti».
- **Strumento e modello:** Claude Code, Opus.
