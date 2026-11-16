-- Segnaposto della fase F01: poche righe. I dati completi arrivano con F04.

INSERT INTO pianeti (id, nome, clima) VALUES
  (1, 'Tatooine', 'desertico'),
  (2, 'Alderaan', 'temperato'),
  (3, 'Naboo', 'temperato'),
  (4, 'Hoth', 'ghiacciato'),
  (5, 'Dagobah', 'paludoso');

INSERT INTO personaggi (id, nome, pianeta_id) VALUES
  (1, 'Luke Skywalker', 1),
  (2, 'Leia Organa', 2),
  (3, 'Padmé Amidala', 3),
  (4, 'Anakin Skywalker', 1),
  (5, 'Yoda', NULL);
