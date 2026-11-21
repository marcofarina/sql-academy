# F16 — Riprendere da dove eri e guidare il primo ingresso

- **Modello / effort:** Claude Code Opus · Codex Sol; effort consigliato `medium`. Piccole decisioni d’interfaccia, testi per gli studenti, possibili icone.
- **Revisione incrociata:** sì, sull’altro strumento prima delle fasi che ne dipendono: salva nel browser dove era lo studente, accanto alla sessione salvata.
- **Dipendenze:** F04 (barra comune), F06 (sessione riprendibile, che offre già «Riprendi la sessione»).
- **Consumo stimato:** basso-medio.
- **Incertezza:** bassa. Aumenta se Marco vuole studiare la guida con l’Artifact «Design».
- **Punto di ripresa:** «Riprendi da dove eri» funzionante, prima della guida.

## 1. Obiettivo e risultato atteso

1. Sulla locandina del tema o all’ingresso nel tema, lo studente trova l’ultimo esercizio aperto e ci torna con un clic. Se c’è una sessione salvata, vale quella (F06).
2. Al primo ingresso in un tema compare una guida breve: che cosa sono le sezioni, dove si eseguono le query, Ctrl+Invio (Cmd+Invio su Mac) per eseguire. Si chiude e non torna, ma si può riaprire.

## 2. Contesto minimo

- Ultimo esercizio: si ricava dai progressi (`queryAt`) senza un campo nuovo, se basta; altrimenti chiedi a Marco prima di estendere il formato in produzione.
- Scorciatoia di esecuzione: `Mod-Enter` in `src/sandbox/SqlEditor.tsx`.
- Locandine: `src/pages/HomePage.tsx`, specifica `docs/design/neutra.md`.

## 3. Perimetro

Dentro: «Riprendi da dove eri», guida al primo ingresso, memoria «guida già vista» per tema o per sito nel browser, testi, test.

Fuori: guide interattive passo per passo sopra l’interfaccia.

## 4. Attività di implementazione

1. Proponi a Marco dove mostrare «Riprendi da dove eri» (retro della locandina, ingresso nel tema, entrambi) e la forma della guida (riquadro chiudibile, finestra), con una bozza dei testi; attendi le scelte.
2. Elenca le icone, cercale nel catalogo e disegna le mancanti secondo la sezione «Icone» del piano (su Codex fermati prima di disegnarle e lascia un segnaposto).
3. Implementa le due funzioni; la guida si riapre da un collegamento (per esempio nella barra o nel piè di pagina di F10).
4. Scrivi i test della scelta dell’ultimo esercizio.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm run lint && npm test && npm run check:themes && npm run build` | Nessun errore |

Procedura manuale (`npm run dev`, browser con dati puliti): il primo ingresso in Star Wars mostra la guida, il secondo no; dopo aver scritto in un esercizio e tornato alla home, «Riprendi da dove eri» riporta a quell’esercizio con la query.

## 6. Passaggio di consegne

Da compilare a fine fase.
