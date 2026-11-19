-- Iscrizioni nuove per giorno (UTC, `AAAA-MM-GG`), per il tetto giornaliero
-- del servizio. Il Cron Trigger cancella le righe dei giorni passati.
CREATE TABLE iscrizioni (
  giorno TEXT PRIMARY KEY,
  numero INTEGER NOT NULL
);
