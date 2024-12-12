const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database(':memory:'); // Usando um banco de dados em memória

app.use(cors());
app.use(bodyParser.json());

// Configuração do banco de dados
db.serialize(() => {
    db.run(`CREATE TABLE employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        position TEXT NOT NULL,
        salary REAL NOT NULL
    )`);
});

// Rota para adicionar um funcionário
app.post('/employees', (req, res) => {
    const { name, position, salary } = req.body;
    db.run(
        `INSERT INTO employees (name, position, salary) VALUES (?, ?, ?)`,
        [name, position, salary],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: this.lastID });
        }
    );
});

// Rota para listar todos os funcionários
app.get('/employees', (req, res) => {
    db.all(`SELECT * FROM employees`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Rota para deletar um funcionário
app.delete('/employees/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM employees WHERE id = ?`, [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ deletedID: id });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
