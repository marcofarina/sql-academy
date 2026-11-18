-- Database del tema Il Signore degli Anelli: sette tabelle.
-- Ordine di creazione: ogni tabella dopo quelle a cui rimanda.
-- Gli anni sono anni della Terza Era.

CREATE TABLE popoli (
  id        INTEGER PRIMARY KEY,
  nome      TEXT NOT NULL,
  lingua    TEXT,
  immortale INTEGER NOT NULL
);

CREATE TABLE luoghi (
  id      INTEGER PRIMARY KEY,
  nome    TEXT NOT NULL,
  regione TEXT NOT NULL,
  tipo    TEXT NOT NULL
);

CREATE TABLE personaggi (
  id               INTEGER PRIMARY KEY,
  nome             TEXT NOT NULL,
  popolo_id        INTEGER NOT NULL REFERENCES popoli (id),
  provenienza_id   INTEGER REFERENCES luoghi (id),
  anno_nascita     INTEGER,
  ruolo            TEXT NOT NULL,
  membro_compagnia INTEGER NOT NULL
);

CREATE TABLE armi (
  id           INTEGER PRIMARY KEY,
  nome         TEXT NOT NULL,
  tipo         TEXT NOT NULL,
  portatore_id INTEGER NOT NULL REFERENCES personaggi (id)
);

CREATE TABLE battaglie (
  id        INTEGER PRIMARY KEY,
  nome      TEXT NOT NULL,
  luogo_id  INTEGER NOT NULL REFERENCES luoghi (id),
  anno      INTEGER NOT NULL,
  vincitore TEXT NOT NULL
);

-- Chi ha combattuto in quale battaglia, e da quale parte.
CREATE TABLE partecipazioni (
  personaggio_id INTEGER NOT NULL REFERENCES personaggi (id),
  battaglia_id   INTEGER NOT NULL REFERENCES battaglie (id),
  schieramento   TEXT NOT NULL,
  PRIMARY KEY (personaggio_id, battaglia_id)
);

-- I luoghi toccati da un personaggio nel suo viaggio, in ordine.
-- Di ogni luogo si registra solo il primo passaggio.
CREATE TABLE tappe (
  personaggio_id INTEGER NOT NULL REFERENCES personaggi (id),
  luogo_id       INTEGER NOT NULL REFERENCES luoghi (id),
  ordine         INTEGER NOT NULL,
  anno           INTEGER NOT NULL,
  PRIMARY KEY (personaggio_id, luogo_id)
);
