const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crud'
});

db.connect(err => {
    if (err) throw err;
    console.log('✅ Connected to MySQL Database');
});

// 🔹 Hello Backend Route
app.get('/', (req, res) => {
    res.send('Hello Backend');
});

// 🔸 Get all employees
app.get('/api/employees', (req, res) => {
    db.query('SELECT * FROM employees', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// 🔸 Add new employee
app.post('/api/employees', (req, res) => {
    const { name, position, department, salary } = req.body;
    db.query('INSERT INTO employees (name, position, department, salary) VALUES (?, ?, ?, ?)',
        [name, position, department, salary],
        (err, result) => {
            if (err) throw err;
            res.json({ id: result.insertId, name, position, department, salary });
        });
});

// 🔸 Update employee
app.put('/api/employees/:id', (req, res) => {
    const { id } = req.params;
    const { name, position, department, salary } = req.body;
    db.query('UPDATE employees SET name = ?, position = ?, department = ?, salary = ? WHERE id = ?',
        [name, position, department, salary, id],
        err => {
            if (err) throw err;
            res.json({ message: 'Updated successfully' });
        });
});

// 🔸 Delete employee
app.delete('/api/employees/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM employees WHERE id = ?', [id], err => {
        if (err) throw err;
        res.json({ message: 'Deleted successfully' });
    });
});

// 🔸 Start server
app.listen(8081, () => {
    console.log('🚀 Server running at http://localhost:8081');
});