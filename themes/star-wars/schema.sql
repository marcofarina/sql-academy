-- Database del tema Star Wars: sette tabelle.
-- Ordine di creazione: ogni tabella dopo quelle a cui rimanda.

CREATE TABLE pianeti (
  id                INTEGER PRIMARY KEY,
  nome              TEXT NOT NULL,
  clima             TEXT,
  terreno           TEXT,
  popolazione       INTEGER,
  settore_galattico TEXT
);

CREATE TABLE fazioni (
  id     INTEGER PRIMARY KEY,
  nome   TEXT NOT NULL,
  leader TEXT,
  tipo   TEXT,
  motto  TEXT
);

CREATE TABLE specie (
  id                     INTEGER PRIMARY KEY,
  nome                   TEXT NOT NULL,
  linguaggio             TEXT,
  aspettativa_vita_media INTEGER,
  pianeta_madre_id       INTEGER REFERENCES pianeti (id)
);

CREATE TABLE personaggi (
  id                   INTEGER PRIMARY KEY,
  nome                 TEXT NOT NULL,
  specie_id            INTEGER REFERENCES specie (id),
  pianeta_origine_id   INTEGER REFERENCES pianeti (id),
  fazione_id           INTEGER REFERENCES fazioni (id),
  anno_nascita_bby     INTEGER,
  sensibile_alla_forza INTEGER,
  ruolo                TEXT
);

CREATE TABLE astronavi (
  id                  INTEGER PRIMARY KEY,
  nome                TEXT NOT NULL,
  modello             TEXT,
  costruttore         TEXT,
  lunghezza_metri     REAL,
  velocita_iperguida  REAL,
  capacita_equipaggio INTEGER,
  fazione_id          INTEGER REFERENCES fazioni (id)
);

CREATE TABLE spade_laser (
  id             INTEGER PRIMARY KEY,
  personaggio_id INTEGER REFERENCES personaggi (id),
  colore_lama    TEXT,
  tipo_cristallo TEXT,
  impugnatura    TEXT
);

CREATE TABLE battaglie (
  id                    INTEGER PRIMARY KEY,
  nome                  TEXT NOT NULL,
  pianeta_id            INTEGER REFERENCES pianeti (id),
  anno_bby              INTEGER,
  fazione_vincitrice_id INTEGER REFERENCES fazioni (id),
  perdite_stimate       INTEGER
);
