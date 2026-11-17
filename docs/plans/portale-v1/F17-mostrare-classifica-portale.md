# F17 — Mostrare la classifica nel portale

- **Modello / effort:** Opus 5.5 `medium`. Interfaccia nuova con scelte di interazione, icone da disegnare e un testo d’informativa per minorenni.
- **Dipendenze:** F14 (saldo e punti visibili), F15 (zaino nel portale), F16 (servizio della classifica).
- **Consumo stimato:** medio.
- **Incertezza:** media: il testo dell’informativa richiede l’approvazione di Marco e può richiedere più giri.
- **Punto di ripresa:** adesione alla classifica funzionante contro `wrangler dev`, prima della pagina della classifica.

## 1. Obiettivo e risultato atteso

Uno studente con lo zaino aperto può scegliere di partecipare alla classifica; da quel momento i suoi punti arrivano al servizio e lui ha un nome. Chiunque, anche senza zaino, vede la classifica generale e per tema; chi partecipa vede anche la propria posizione.

## 2. Contesto minimo

- Riga «Classifica» delle «Decisioni condivise»; passaggi di consegne di F14, F15, F16 (protocollo, limiti noti).
- Sezione «Icone» del piano e skill `icone-rb`: servono almeno classifica (podio o coppa) e partecipazione.
- Norme: `.claude/norms/scrittura-didattica.md` e `scrittura-umana.md` per i testi rivolti agli studenti.

## 3. Perimetro

Dentro:

- **Adesione:** interruttore «Partecipa alla classifica», spento di default. Proposta di Claude, da confermare con Marco all’inizio della fase: si partecipa solo con lo zaino aperto, perché il gettone della classifica vive nella sezione `sql-academy` dello zaino; senza zaino, un PC del laboratorio che si azzera darebbe a ogni lezione un nome nuovo. Disattivare l’interruttore chiama l’uscita dalla classifica e cancella la riga sul server.
- **Invio dei punti:** quando i progressi cambiano, con attesa (per esempio dopo la sincronizzazione dello zaino), mai a ogni tasto; errori e quota esaurita gestiti come lo zaino (attesa crescente, nessun blocco del lavoro).
- **Pagina della classifica** a livello di portale (per esempio `#/classifica`, non una settima sezione del tema): generale e per tema, primi 50, la propria posizione con i vicini se si partecipa, il proprio nome ben visibile. Righe con nome, punti e tema; nessun altro dato.
- **Informativa:** una pagina del portale che dice quali dati vanno dove (progressi nel browser, zaino cifrato, classifica in chiaro con nome casuale e punti), per quanto tempo, come uscire; e i limiti della classifica (§ 2 di F16). Testo approvato da Marco prima del commit.

Fuori: gradi e traguardi, CTF, moderazione dei nomi (non servono: li assegna il sistema).

## 4. Attività di implementazione

1. Icone, come da sezione «Icone» del piano.
2. Gettone nella sezione dello zaino, interruttore, invio dei punti, uscita.
3. Pagina della classifica e collegamento dall’elenco dei temi e dall’intestazione.
4. Informativa; mostrala a Marco.
5. Test dell’invio (attesa, errori) e dei casi di adesione e uscita.

## 5. Criteri di accettazione

| Comando | Risultato atteso |
| --- | --- |
| `npm test`, `npm run build`, `npm run lint`, `npm run check:themes` | Nessun errore |

Procedura manuale con `npm run dev` e i due Worker in `wrangler dev`:

1. Senza zaino la pagina della classifica si apre e l’interruttore spiega che serve lo zaino.
2. Con lo zaino, attiva la partecipazione: compare il nome assegnato.
3. Risolvi un esercizio: entro l’attesa prevista la classifica generale e quella del tema mostrano i nuovi punti.
4. Apri lo stesso zaino su un secondo contesto del browser: stesso nome, stessa posizione.
5. Disattiva la partecipazione: il nome sparisce dalla classifica.
6. Ferma il Worker della classifica: il portale continua a funzionare e segnala la classifica non raggiungibile.

## 6. Passaggio di consegne

Da compilare a fine fase: esito, verifiche, icone e collaudo della skill, testo dell’informativa approvato, decisioni con Marco, limiti, consumo reale se noto.
