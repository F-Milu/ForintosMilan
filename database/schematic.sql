CREATE DATABASE IF NOT EXISTS konyvtar_db DEFAULT CHARACTER SET UTF8 COLLATE UTF8_hungarian_ci

USE konyvtar_db

CREATE TABLE mufajok (id int AUTO_INCREMENT PRIMARY KEY, nev varchar(50) NOT NULL UNIQUE)

CREATE TABLE konyvek (id int PRIMARY KEY AUTO_INCREMENT, mufaj_id int,cim varchar(150) NOT NULL, kiadasi_ev int NOT NULL, oldalszam int NOT NULL, kolcsonozheto boolean NOT NULL)


ALTER TABLE `konyvek` ADD CONSTRAINT `konyvek_ibfk_1` FOREIGN KEY (`mufaj_id`) REFERENCES `mufajok` (`id`);

INSERT INTO mufajok (id, nev) VALUES (1, "Sci-Fi"), (2, "Történelem"), (3, "Krimi")

INSERT INTO konyvek (id, mufaj_id, cim, kiadas_ev, oldalszam, kolcsonozheto) VALUES (1, 1, "Dűne kronológiai" , 1965, 680, 1)