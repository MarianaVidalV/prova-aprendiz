const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const moment = require('moment');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = new sqlite3.Database('sqlite.db');

db.run('CREATE TABLE IF NOT EXISTS Cadastro (id INTEGER PRIMARY KEY AUTOINCREMENT, texto TEXT, data TEXT)');

app.post('/inserir', (req, res) => {
  const { texto, data } = req.body;
  db.run('INSERT INTO Cadastro (texto, data) VALUES (?, ?)', [texto, data], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erro ao inserir registro no banco de dados');
    } else {
      res.status(200).send('Registro inserido com sucesso!');
    }
  });
});

app.delete('/apagar/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM Cadastro WHERE id = ?', [id], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erro ao apagar registro no banco de dados');
    } else {
      res.status(200).send('Registro apagado com sucesso!');
    }
  });
});

app.get('/registros', (req, res) => {
  db.all('SELECT * FROM Cadastro', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erro ao buscar registros no banco de dados');
    } else {
      res.json(rows);
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});