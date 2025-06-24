const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 8081;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '',
  database: 'crud' // <-- changed to 'crud'
});

// Test DB connection
db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database ✅');
});

// Hello Route (keep this!)
app.get('/', (req, res) => {
  res.send('Hello from backend!');
});

// CRUD Routes
// Get all items
app.get('/menu', (req, res) => {
  db.query('SELECT * FROM kaon', (err, result) => {
    if (err) res.status(500).send(err);
    else res.json(result);
  });
});

// Add a new item
app.post('/menu', (req, res) => {
  const { name, price } = req.body;
  db.query('INSERT INTO kaon (name, price) VALUES (?, ?)', [name, price], (err, result) => {
    if (err) res.status(500).send(err);
    else res.json({ id: result.insertId, ...req.body });
  });
});

// Update an item
app.put('/menu/:id', (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  db.query('UPDATE kaon SET name = ?, price = ? WHERE id = ?', [name, price, id], (err, result) => {
    if (err) res.status(500).send(err);
    else res.json({ message: 'Item updated' });
  });
});

// Delete an item
app.delete('/menu/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM kaon WHERE id = ?', [id], (err, result) => {
    if (err) res.status(500).send(err);
    else res.json({ message: 'Item deleted' });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
