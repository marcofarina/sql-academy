-- Classifica di SQL Academy (piano docs/plans/portale-v1, fase F16).
--
-- Un partecipante è un gettone casuale del browser, di cui si conserva solo
-- l'impronta SHA-256 (64 cifre esadecimali), e un nome assegnato a caso.
-- `aggiornato` (millisecondi Unix) è l'ultimo invio: dopo 18 mesi di silenzio
-- il Cron Trigger cancella il partecipante e i suoi punti.
CREATE TABLE partecipanti (
  id INTEGER PRIMARY KEY,
  impronta TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL UNIQUE,
  creato INTEGER NOT NULL,
  aggiornato INTEGER NOT NULL
);

-- I punti di un partecipante in un tema, ricalcolati dal servizio.
-- `raggiunto` è quando sono cambiati l'ultima volta: decide i pari merito
-- (prima chi ci è arrivato prima) e il controllo sulla crescita.
CREATE TABLE punteggi (
  partecipante INTEGER NOT NULL REFERENCES partecipanti (id) ON DELETE CASCADE,
  tema TEXT NOT NULL,
  punti INTEGER NOT NULL,
  raggiunto INTEGER NOT NULL,
  PRIMARY KEY (partecipante, tema)
);

CREATE INDEX punteggi_per_tema ON punteggi (tema, punti DESC, raggiunto);
CREATE INDEX partecipanti_per_data ON partecipanti (aggiornato);
