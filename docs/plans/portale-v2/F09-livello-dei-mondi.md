# F09 — Mostrare il livello dei mondi nel contratto e sulla pagina iniziale

- **Modello / effort:** Claude Code Opus · Codex Sol; effort consigliato `medium`. Campo nuovo nel contratto del tema e una piccola decisione visiva sulla locandina.
- **Dipendenze:** F08 (definizione dei livelli).
- **Consumo stimato:** basso-medio.
- **Incertezza:** bassa. Aumenta se Marco vuole studiare la resa del livello con l’Artifact «Design» invece di approvarla sul sito in sviluppo.
- **Punto di ripresa:** campo nel contratto, controllato da `check:themes`, prima dell’interfaccia.

## 1. Obiettivo e risultato atteso

Ogni tema dichiara il proprio livello e la pagina iniziale lo mostra, con i mondi facili consigliati a chi comincia (punto 6). Star Wars e Il Signore degli Anelli dichiarano il livello assegnato in F08.

## 2. Contesto minimo

- Definizione dei livelli: `docs/mondi.md` (F08).
- Contratto: `src/themes/contract.ts`; guida «Aggiungere un tema» nel `README.md`; controlli in `npm run check:themes`.
- Pagina iniziale: `src/pages/HomePage.tsx`, specifica `docs/design/neutra.md`; numeri della scheda calcolati al build (`scripts/themeStatsPlugin.ts`, `virtual:theme-stats`).

## 3. Perimetro

Dentro: campo del manifest, controlli, resa sulla locandina e sulla scheda, eventuale ordine o raggruppamento dei mondi, testi, guida nel `README.md`.

Fuori: nuovi mondi.

## 4. Attività di implementazione

1. Proponi a Marco nome e valori del campo (per esempio `level: 'facile' | 'intermedio' | 'complesso'`), se è obbligatorio e come si mostra (etichetta sulla locandina, riga sulla scheda, «Consigliato per cominciare»); attendi la scelta.
2. Aggiungi il campo al contratto, ai due manifest e a `check:themes`.
3. Elenca le icone, cercale nel catalogo e disegna le mancanti secondo la sezione «Icone» del piano (su Codex fermati prima di disegnarle e lascia un segnaposto).
4. Mostra il livello sulla pagina iniziale come deciso, a 1280 e a 375 px.
5. Aggiorna la guida «Aggiungere un tema» nel `README.md`.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm run lint && npm test && npm run check:themes && npm run build` | Nessun errore |

Procedura manuale (`npm run dev`): il livello compare su ogni locandina e sulla scheda, nel tavolo e nel mazzo a 375 px; togliendo il campo da un manifest, `npm run check:themes` segnala l’errore (se il campo è obbligatorio).

## 6. Passaggio di consegne

Da compilare a fine fase.
