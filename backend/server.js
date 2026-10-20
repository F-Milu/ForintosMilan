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

const PORT = process.env.PORT || 8080;


app.listen(PORT, () => {
console.log(`Server is running on: http://localhost:${PORT}`);
});

