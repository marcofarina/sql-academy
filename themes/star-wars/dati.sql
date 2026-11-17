-- Dati del tema Star Wars, nell’ordine imposto dalle chiavi esterne.
-- Tutto in una transazione: le fazioni rimandano ai loro leader, che sono
-- personaggi inseriti dopo, e il vincolo si controlla solo al COMMIT.

BEGIN;

INSERT INTO pianeti (id, nome, clima, terreno, popolazione, settore_galattico) VALUES
(1, 'Tatooine', 'arido', 'deserto', 200000, 'Orlo Esterno'),
(2, 'Coruscant', 'temperato', 'città-pianeta', 1000000000000, 'Nucleo Profondo'),
(3, 'Naboo', 'temperato', 'paludi e colline', 4500000000, 'Orlo Mediano'),
(4, 'Alderaan', 'temperato', 'montagne e pianure', 2000000000, 'Nucleo Profondo'),
(5, 'Hoth', 'ghiacciato', 'tundra e ghiacciai', 0, 'Orlo Esterno'),
(6, 'Dagobah', 'tropicale', 'paludi dense', 1, 'Orlo Esterno'),
(7, 'Bespin', 'temperato', 'gigante gassoso', 6000000, 'Orlo Esterno'),
(8, 'Endor', 'temperato', 'foreste e boschi', 30000000, 'Orlo Esterno'),
(9, 'Mustafar', 'torrido', 'vulcani e lava', 20000, 'Orlo Esterno'),
(10, 'Kamino', 'temperato', 'oceano globale', 1000000000, 'Spazio Selvaggio'),
(11, 'Geonosis', 'arido', 'deserto roccioso', 100000000, 'Orlo Esterno'),
(12, 'Kashyyyk', 'tropicale', 'giungla e foreste giganti', 45000000, 'Orlo Mediano'),
(13, 'Mandalore', 'arido', 'deserti e biomi artificiali', 4000000, 'Orlo Esterno'),
(14, 'Exegol', 'oscuro', 'desolato e roccioso', 50000, 'Regioni Ignote'),
(15, 'Scarif', 'tropicale', 'isole e oceani', 5000, 'Orlo Esterno');

INSERT INTO fazioni (id, nome, leader_id, tipo, motto) VALUES
(1, 'Alleanza Ribelle', 25, 'Movimento Ribelle', 'Che la Forza sia con noi'),
(2, 'Impero Galattico', 7, 'Governo', 'Ordine, Sicurezza, Pace'),
(3, 'Repubblica Galattica', 26, 'Governo', 'Uniti nella Democrazia'),
(4, 'Ordine Jedi', 5, 'Ordine Religioso', 'Non c''è emozione, c''è pace'),
(5, 'Ordine Sith', 7, 'Ordine Religioso', 'La pace è una menzogna, c''è solo passione'),
(6, 'Confederazione Sistemi Indipendenti', 14, 'Governo', 'Libertà dalla Repubblica'),
(7, 'Gilda dei Cacciatori di Taglie', 27, 'Sindacato', 'La taglia è sacra'),
(8, 'Mandaloriani', 24, 'Governo', 'Questa è la via');

INSERT INTO specie (id, nome, linguaggio, aspettativa_vita_media, pianeta_madre_id) VALUES
(1, 'Umano', 'Galactic Basic', 85, 2),
(2, 'Wookiee', 'Shyriiwook', 400, 12),
(3, 'Droide', 'Binario', 150, 2),
(4, 'Specie di Yoda', 'Galactic Basic', 900, 6),
(5, 'Twi''lek', 'Ryl', 80, 1),
(6, 'Zabrak', 'Zabraki', 90, 1),
(7, 'Hutt', 'Huttese', 1000, 1),
(8, 'Kaminoano', 'Kaminoan', 80, 10),
(9, 'Geonosiano', 'Geonosian', 65, 11),
(10, 'Togruta', 'Togruti', 94, 3);

INSERT INTO personaggi (id, nome, specie_id, pianeta_origine_id, fazione_id, anno_nascita_bby, sensibile_alla_forza, ruolo) VALUES
(1, 'Luke Skywalker', 1, 1, 1, 19, 1, 'Cavaliere Jedi'),
(2, 'Darth Vader', 1, 1, 2, 41, 1, 'Signore dei Sith'),
(3, 'Leia Organa', 1, 4, 1, 19, 1, 'Principessa e Senatrice'),
(4, 'Han Solo', 1, 2, 1, 29, 0, 'Contrabbandiere e Capitano'),
(5, 'Yoda', 4, 6, 4, 896, 1, 'Gran Maestro Jedi'),
(6, 'Obi-Wan Kenobi', 1, 2, 4, 57, 1, 'Maestro Jedi'),
(7, 'Imperatore Palpatine', 1, 3, 2, 82, 1, 'Signore Oscuro dei Sith'),
(8, 'Chewbacca', 2, 12, 1, 200, 0, 'Copilota'),
(9, 'R2-D2', 3, 3, 1, 33, 0, 'Droide Astromeccanico'),
(10, 'C-3PO', 3, 1, 1, 32, 0, 'Droide Protocollare'),
(11, 'Mace Windu', 1, 2, 4, 72, 1, 'Maestro Jedi'),
(12, 'Ahsoka Tano', 10, 3, 1, 36, 1, 'Guerriera della Forza'),
(13, 'Boba Fett', 1, 10, 7, 32, 0, 'Cacciatore di taglie'),
(14, 'Conte Dooku', 1, 3, 6, 102, 1, 'Signore dei Sith'),
(15, 'Darth Maul', 6, 1, 5, 54, 1, 'Guerriero Sith'),
(16, 'Padmé Amidala', 1, 3, 3, 46, 0, 'Regina e Senatrice'),
(17, 'Lando Calrissian', 1, 2, 1, 31, 0, 'Barone Amministratore'),
(18, 'Din Djarin', 1, 13, 8, 30, 0, 'Guerriero Mandaloriano'),
(19, 'Grogu', 4, 2, 8, 50, 1, 'Iniziato della Forza'),
(20, 'Grand Moff Tarkin', 1, 2, 2, 64, 0, 'Governatore Imperiale'),
(21, 'Cassian Andor', 1, 15, 1, 26, 0, 'Capitano dell''Intelligence'),
(22, 'Qui-Gon Jinn', 1, 2, 4, 92, 1, 'Maestro Jedi'),
(23, 'Jabba the Hutt', 7, 1, 7, 600, 0, 'Signore del Crimine'),
(24, 'Bo-Katan Kryze', 1, 13, 8, 48, 0, 'Leader Mandaloriana'),
(25, 'Mon Mothma', 1, NULL, 1, 48, 0, 'Senatrice e Leader Ribelle'),
(26, 'Finis Valorum', 1, 2, 3, 62, 0, 'Cancelliere Supremo'),
(27, 'Greef Karga', 1, NULL, 7, NULL, 0, 'Magistrato e Capo della Gilda');

INSERT INTO astronavi (id, nome, modello, costruttore, lunghezza_metri, velocita_iperguida, capacita_equipaggio, fazione_id) VALUES
(1, 'Millennium Falcon', 'YT-1300f', 'Corellian Engineering', 34.75, 0.50, 4, 1),
(2, 'X-wing Red 5', 'T-65B X-wing', 'Incom Corporation', 12.50, 1.00, 1, 1),
(3, 'TIE Advanced x1', 'TIE Advanced', 'Sienar Fleet Systems', 9.20, 1.00, 1, 2),
(4, 'Star Destroyer Devastator', 'Imperial I-class', 'Kuat Drive Yards', 1600.00, 2.00, 37000, 2),
(5, 'Slave I', 'Firespray-31', 'Kuat Systems', 21.50, 0.70, 2, 7),
(6, 'Executor', 'Super Star Destroyer', 'Kuat Drive Yards', 19000.00, 2.00, 280000, 2),
(7, 'Tantive IV', 'CR90 Corvette', 'Corellian Engineering', 126.68, 2.00, 165, 1),
(8, 'Ghost', 'VCX-100', 'Corellian Engineering', 43.90, 0.50, 6, 1),
(9, 'Razor Crest', 'ST-70 Gunship', 'Pre-Empire Yards', 24.00, 1.20, 2, 8),
(10, 'Jedi Interceptor', 'Eta-2 Actis', 'Kuat Systems Engineering', 5.47, 1.00, 1, 4),
(11, 'Invisible Hand', 'Providence-class', 'Free Dac Volunteers', 1088.00, 1.50, 600, 6),
(12, 'Y-wing Gold Leader', 'BTL-A4 Y-wing', 'Koensayr Manufacturing', 16.20, 1.00, 2, 1);

INSERT INTO spade_laser (id, personaggio_id, colore_lama, tipo_cristallo, impugnatura) VALUES
(1, 1, 'Verde', 'Kyber di Ilum', 'Standard in lega metallica'),
(2, 2, 'Rosso', 'Kyber Sanguinante', 'Standard pesante nera'),
(3, 5, 'Verde', 'Kyber di Ilum', 'Miniatura shoto'),
(4, 6, 'Blu', 'Kyber di Ilum', 'Standard classica'),
(5, 7, 'Rosso', 'Kyber Sintetico', 'Elegante dorata'),
(6, 11, 'Viola', 'Kyber di Hurrikaine', 'Elettroplaccata in Electrum'),
(7, 12, 'Bianco', 'Kyber Purificato', 'Doppia elsa curva'),
(8, 14, 'Rosso', 'Kyber Sintetico', 'Impugnatura curva da duello'),
(9, 15, 'Rosso', 'Kyber Sintetico', 'Doppia lama a bastone'),
(10, 22, 'Verde', 'Kyber di Adegan', 'Robusta scanalata');

INSERT INTO battaglie (id, nome, pianeta_id, anno_bby, fazione_vincitrice_id, perdite_stimate) VALUES
(1, 'Battaglia di Yavin', 8, 0, 1, 35000),
(2, 'Battaglia di Hoth', 5, -3, 2, 1200),
(3, 'Battaglia di Endor', 8, -4, 1, 75000),
(4, 'Battaglia di Geonosis', 11, 22, 3, 23000),
(5, 'Battaglia di Coruscant', 2, 19, 3, 15000),
(6, 'Battaglia di Scarif', 15, 0, 2, 8500),
(7, 'Battaglia di Mustafar', 9, 19, 2, 50),
(8, 'Battaglia di Naboo', 3, 32, 3, 4500),
(9, 'Battaglia di Kamino', 10, 21, 3, 6200);

COMMIT;
