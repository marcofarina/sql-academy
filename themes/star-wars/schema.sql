-- Segnaposto della fase F01: due tabelle. Lo schema completo arriva con F04.

CREATE TABLE pianeti (
  id          INTEGER PRIMARY KEY,
  nome        TEXT NOT NULL UNIQUE,
  clima       TEXT NOT NULL
);

CREATE TABLE personaggi (
  id          INTEGER PRIMARY KEY,
  nome        TEXT NOT NULL,
  pianeta_id  INTEGER REFERENCES pianeti (id)
);
