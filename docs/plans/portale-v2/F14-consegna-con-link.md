# F14 — Assegnare una consegna con un link

- **Modello / effort:** Claude Code Opus · Codex Sol; effort consigliato `medium`. Nuova pagina, nuovo indirizzo, interazione con sessioni salvate e punti.
- **Dipendenze:** F06 (sessione salvata e riprendibile).
- **Consumo stimato:** medio.
- **Incertezza:** media. Aumenta se Marco vuole che lo studente possa mostrare l’esito della consegna in modo verificabile.
- **Punto di ripresa:** formato del link e sua lettura, con i test, prima della pagina del docente.

## 1. Obiettivo e risultato atteso

Il docente sceglie in una pagina del portale un tema e alcuni esercizi (o i filtri di una sessione) e ottiene un link; chi lo apre trova una sessione con quegli esercizi, nello stesso ordine, uguale per tutta la classe. Nessun server: il link porta con sé la consegna.

## 2. Contesto minimo

- Routing con hash: `src/routing/route.ts`; indirizzo della sessione `#/<tema>/addestramento/sessione`.
- Configurazione delle sessioni: `SessionConfig` in `src/training/session.ts`; sessione salvata per tema (F06).
- Il link si condivide in Classroom, nel registro elettronico, alla lavagna: deve restare corto.

## 3. Perimetro

Dentro: formato del link (esercizi per id, titolo facoltativo della consegna), lettura del link con esercizi inesistenti scartati e un avviso, pagina del docente, riepilogo finale della consegna, test.

Fuori: raccolta dei risultati della classe (chiederebbe un server o dati personali); account docente.

## 4. Attività di implementazione

1. Proponi a Marco: dove sta la pagina del docente (indirizzo proprio, non collegato dal menu degli studenti o collegato), se la consegna dà i punti normali, che cosa succede se lo studente ha già una sessione aperta, se il riepilogo finale si può mostrare al docente (per esempio a schermo, con data e ora). Attendi le scelte.
2. Definisci il formato del link, con versione, e scrivi lettura e scrittura come funzioni pure con i test.
3. Scrivi la pagina del docente: scelta del tema, degli esercizi (dal catalogo, con filtri) o dei filtri, titolo, copia del link.
4. Apri la consegna come sessione, riusando la sessione salvata di F06.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm run lint && npm test && npm run check:themes && npm run build` | Nessun errore |

Procedura manuale (`npm run dev`): crea una consegna di quattro esercizi di LOTR, apri il link in un altro browser: la sessione ha gli stessi esercizi nello stesso ordine; un link con un id inesistente apre gli altri e avvisa; un link manomesso non rompe la pagina.

## 6. Passaggio di consegne

Da compilare a fine fase.
