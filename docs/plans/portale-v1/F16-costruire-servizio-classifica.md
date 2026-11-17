# F16 — Costruire il servizio della classifica

- **Modello / effort:** Opus 5.5 `medium`. Progettazione di un piccolo servizio pubblico con dati di minorenni, limiti del piano gratuito e controlli di plausibilità; se le prove sui limiti o sui controlli non convergono, alza a `high`.
- **Dipendenze:** F13 (tabelle dei premi e dei costi, forma dei progressi).
- **Consumo stimato:** medio. Un Worker di poche centinaia di righe, una tabella D1, uno script di prova; le liste dei nomi richiedono un giro con Marco.
- **Incertezza:** media. Il deploy, il dominio e la creazione del database D1 richiedono Marco; i controlli di plausibilità vanno tarati senza respingere studenti veri.
- **Punto di ripresa:** Worker che risponde in `npx wrangler dev` con lo script di prova verde, prima delle liste dei nomi e del deploy.

## 1. Obiettivo e risultato atteso

Un servizio su Cloudflare, nel repo del portale, tiene una classifica pubblica per tema e generale. Accetta i progressi di chi ha scelto di partecipare, ricalcola i punti da sé, rifiuta ciò che non è possibile, assegna a ogni partecipante un nome casuale che non si può cambiare. Costo zero sul piano Workers Free di Marco.

## 2. Contesto minimo

Decisioni di Marco (2026-11-17), riga «Classifica» delle «Decisioni condivise»:

- classifica generale e per tema, pubblica, accessibile a tutti;
- nomi assegnati a caso dal sistema, non scelti né modificabili dallo studente;
- partecipazione facoltativa, spenta all’inizio;
- la classifica mostra i primi 50 e, a chi partecipa, la propria posizione con i vicini;
- difesa contro i punteggi gonfiati: **plausibilità sul server**; nessuna verifica delle singole risposte;
- Worker proprio del portale, con un D1 suo, separato dallo zaino (che resta cifrato e illeggibile);
- costo zero: Workers Free, dove i superamenti fermano il servizio invece di costare. La quota di 100.000 richieste al giorno è **condivisa** con lo zaino di PDB.

Riferimenti: `~/Developer/github/python-doesnt-byte/servizi/zaino/` (struttura, `wrangler.toml` con log spenti, limite di frequenza, Cron Trigger, CORS) e i fatti 10, 16, 21 di `pm/piano-2026-11-quaderno.md` dello stesso repo.

### Limiti noti della difesa

Da riportare nell’informativa e nella pagina della classifica, senza enfasi: la classifica è un gioco, non un voto. La plausibilità ferma i punteggi inventati e quelli oltre il massimo, non le soluzioni lette nel codice del sito, non la copia fra compagni, non chi crea più zaini per avere più nomi.

## 3. Perimetro

Dentro: Worker `servizi/classifica/` (con `package.json`, `tsconfig.json`, `wrangler.toml` suoi, escluso dal typecheck del portale), migrazione D1, dati degli esercizi per il ricalcolo, liste dei nomi, script di prova, deploy con Marco.

Fuori: interfaccia nel portale e informativa (F17), CTF (piano successivo, ma la classifica deve poterle sommare: un tipo di attività in più nel ricalcolo, senza cambiare il protocollo).

## 4. Attività di implementazione

1. **Identità:** il client genera un gettone casuale (256 bit) e lo invia come `Authorization: Bearer`; il server conserva solo il suo SHA-256. Al primo invio il server assegna il nome. Nessun indirizzo IP, nessun `User-Agent`, nessun log (`logpush = false`, `observability` spenta, come lo zaino).
2. **Protocollo** da fissare qui, per esempio: `PUT /v1/punteggio` con i progressi per tema (esercizi risolti, suggerimenti aperti, soluzione vista prima della risoluzione, aiuto gratuito usato); `GET /v1/classifica?tema=<id>` e senza tema per la generale, primi 50; `GET /v1/posizione` con il gettone, posizione e vicini; `DELETE /v1/punteggio` per uscire dalla classifica, che cancella la riga.
3. **Ricalcolo:** uno script del portale (per esempio `npm run classifica:dati`) produce dai temi un JSON con, per ogni esercizio, tema, `id`, difficoltà e numero di suggerimenti; il Worker lo incorpora al build e usa le stesse tabelle di F13. Il server calcola il punteggio dai progressi inviati e rifiuta: `id` inesistenti, suggerimenti oltre il numero, soluzione senza tutti i suggerimenti, saldo finale negativo, più di un aiuto gratuito per tema, crescita troppo rapida fra due invii (soglia da tarare e scrivere negli esiti). La classifica generale è la somma dei temi.
4. **Nomi:** due liste italiane (per esempio aggettivo e sostantivo, neutre rispetto ai temi, perché il nome vale in tutta la classifica) più un numero; scrivile, controlla a mano che nessuna combinazione sia offensiva o ambigua, mostrale a Marco e attendi l’approvazione. Nessuna combinazione ripetuta.
5. **Protezioni:** limite di frequenza per IP tarato su una classe intera dietro lo stesso indirizzo; dimensione massima del corpo; CORS solo per l’origine di sviluppo del portale (l’origine di produzione si aggiunge in F10); `Cache-Control` breve sulla classifica pubblica per risparmiare richieste; Cron Trigger che cancella le righe ferme da 18 mesi, come lo zaino.
6. **Prova** `servizi/classifica/prova.mjs <base-url>`: iscrizione e nome, punteggio corretto, punteggio impossibile respinto, gettone sbagliato, uscita dalla classifica, CORS.
7. **Con Marco:** dominio (per esempio un sottodominio di `rainbowbits.cloud`), `npx wrangler d1 create`, migrazione remota, `npx wrangler deploy`. Nessuna di queste azioni senza il suo via.

## 5. Criteri di accettazione

| Directory | Comando | Risultato atteso |
| --- | --- | --- |
| `servizi/classifica` | `npm run typecheck` | Nessun errore |
| `servizi/classifica` | `npx wrangler dev` e, in un altro terminale, `npm run prova -- http://localhost:8787` | Tutte le prove superate |
| radice del portale | `npm test`, `npm run build`, `npm run lint`, `npm run check:themes` | Nessun errore |

Più: liste dei nomi approvate da Marco; il D1 locale non contiene gettoni in chiaro.

## 6. Passaggio di consegne

Da compilare a fine fase: esito, verifiche, protocollo definitivo, soglie dei controlli, dominio e stato del deploy, limiti, consumo reale se noto.
