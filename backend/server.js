import express from "express";
import mysql from "mysql2";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
host: process.env.HOST,
user: process.env.USER,
password: process.env.PASSWORD,
database: process.env.DATABASE,
port: process.env.DBPORT
})

app.get('/', (req, res ) => {
    res.status(200).json({message: 'Működik'});
});

app.get('/konyvek', (req, res) => {
pool.query('SELECT * FROM konyvek INNER JOIN mufajok m ON m.id WHERE m.id = konyvek.mufaj_id ORDER BY kiadasi_ev ASC', (err, result) => {
    if (err) res.status(500).json ({hiba: err});

    res.status(200).json(result);
})
});

app.get('/elerheto', (req, res) => {
    pool.query('SELECT * FROM konyvek WHERE kolcsonozheto = true AND kiadasi_ev < 2000', (err, result) => {
        if (err) res.status(500).json ({hiba: err});
    
        res.status(200).json(result);
    })
});

app.get('/konyvek/kereses/:szoveg', (req, res) => {
    const szoveg = "";
    pool.query('', (err, result) => {
        if (err) res.status(500).json ({hiba: err});
    
        res.status(200).json(result);
    })
});

app.get('/mufajok/statisztika', (req, res) => {
    pool.query('SELECT mufajok.nev, konyvek.id, konyvek.oldalszam FROM konyvek INNER JOIN mufajok m ON m.id WHERE m.id = konyvek.mufaj_id', (err, result) => {
        if (err) res.status(500).json ({hiba: err});
    
        res.status(200).json(result);
    })
});


app.get('/konyvek/hosszuak', (req, res) => {
    pool.query('SELECT cim, kiadasi_ev, oldalszam FROM konyvek ORDER BY oldalszam DESC', (err, result) => {
        if (err) res.status(500).json ({hiba: err});
    
        res.status(200).json(result);
    })
});

//beszúrás
app.post('/konyvek', (req, res) => {
    const { cim, kiadasi_ev, oldalszam, mufaj_id, kolcsonozheto } = req.body;

    pool.query(
        'INSERT INTO konyvek (cim, kiadasi_ev, oldalszam, mufaj_id, kolcsonozheto) VALUES (?, ?, ?, ?, ?)',
        [cim, kiadasi_ev, oldalszam, mufaj_id, kolcsonozheto],
        (err, result) => {
            if (err) {
                return res.status(500).json({ hiba: err });
            }

            res.status(201).json({
                uzenet: 'Sikeres könyvbeszúrás!',
                id: result.insertId
            });
        }
    );
});

//torles
app.delete('/konyvek/:id', (req, res) => {
    const id = req.params.id;

    pool.query(
        'DELETE FROM konyvek WHERE id = ?',
        [id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ hiba: err });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    uzenet: 'Nem található ilyen könyv!'
                });
            }

            res.status(200).json({
                uzenet: 'Sikeres törlés!'
            });
        }
    );
});

const PORT = process.env.PORT || 8080;


app.listen(PORT, () => {
console.log(`Server is running on: http://localhost:${PORT}`);
});

