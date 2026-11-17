# F07 — Scrivere l’analisi Star Wars e rivedere consegne e suggerimenti

- **Modello / effort:** Opus 5.5 `medium`. Testi per gli studenti: priorità all’approfondimento concordata con Marco.
- **Dipendenze:** F04 (esercizi convertiti, elenco delle incongruenze), F06 (ER approvato, da cui l’analisi non deve divergere).
- **Consumo stimato:** medio-alto. Circa 120 consegne e fino a tre suggerimenti ciascuna.
- **Incertezza:** media. Se la revisione supera il previsto, chiudi la fase per capitolo con commit intermedi.
- **Punto di ripresa:** analisi scritta e approvata, prima della revisione degli esercizi; poi un capitolo alla volta.

Questa fase si esegue solo in locale: le norme in `.claude/norms/` non sono raggiungibili da una sessione nel cloud.

## 1. Obiettivo e risultato atteso

`themes/star-wars/analisi.md` contiene il testo del dominio da cui nasce il database, e ogni esercizio ha titolo, consegna e suggerimenti rivisti secondo le norme di Marco.

## 2. Contesto minimo

- `.claude/norms/scrittura-didattica.md` prima di scrivere; `.claude/norms/scrittura-umana.md` a fine stesura; `.claude/norms/contenuto.md` è già importata da `AGENTS.md`.
- Passaggi di consegne di F04 (incongruenze fra consegna e query) e F06 (ER).
- Decisioni rinviate a F07 da Marco (2026-11-17), elencate nel passaggio di consegne di F04: i difetti di schema e di dati (`fazioni.leader` come testo, «Battaglia di Yavin» su Endor, `anno_bby` negativo, ex-088 che non distingue `JOIN` e `LEFT JOIN`). Prima di scrivere l’analisi chiedi a Marco che cosa correggere: l’analisi e gli esercizi devono descrivere lo stesso database.
- Una traccia di seconda prova di Informatica come modello di registro per l’analisi: chiedila a Marco se non è nel repo.
- `~/Developer/github/python-doesnt-byte/volumes/archivista/leggere-un-dominio.mdx`: come il libro presenta un testo di dominio.

## 3. Perimetro

Dentro: `analisi.md`, testi del file degli esercizi di Star Wars, sezione «Analisi» del guscio.

Fuori: query attese (si toccano solo per sanare un’incongruenza segnalata da F04, rieseguendo poi `npm run check:themes`), nuovi esercizi.

## 4. Attività di implementazione

1. Scrivi l’analisi: un testo in italiano che descrive il dominio come lo descriverebbe un committente, da cui uno studente possa ricavare entità, associazioni e cardinalità dell’ER di F06. Niente nomi di tabelle né di colonne.
2. Sottoponi l’analisi a Marco prima di passare agli esercizi.
3. Rendi la sezione «Analisi» nel guscio (Markdown del tema).
4. Rivedi gli esercizi un capitolo alla volta. Per ogni consegna: dice che cosa ottenere senza dettare la query; nomina le colonne richieste nel risultato quando la verifica le controlla; dichiara l’ordinamento quando conta. Per i suggerimenti: dal più generale al più specifico, l’ultimo non è la soluzione.
5. Titoli con maiuscola solo alla prima parola e ai nomi propri; virgolette e apostrofi tipografici.
6. Applica la passata finale di `scrittura-umana.md` all’analisi e a un campione di almeno 20 esercizi; correggi poi gli stessi difetti su tutti.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm run check:themes` | Esce con 0 |
| `npm test`, `npm run build` | Nessun errore |
| `grep -c "'" themes/star-wars/analisi.md` | 0: nessun apostrofo dritto nel testo |

Verifiche manuali: Marco approva l’analisi; ogni entità e ogni associazione di `er.ts` è ricavabile da una frase dell’analisi (elenco di corrispondenze nel passaggio di consegne); `#/star-wars/analisi` mostra il testo.

## 6. Passaggio di consegne

Da compilare alla chiusura: esito, verifiche, corrispondenze fra analisi ed ER, esercizi la cui query è stata modificata, osservazioni di Marco, lavoro residuo, consumo reale se noto.
