const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the MySQL database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});

// API to get all transactions
app.get('/api/transactions', (req, res) => {
  const query = 'SELECT * FROM transactions ORDER BY date DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching transactions:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json(results);
  });
});

// API to add a new transaction
app.post('/api/transactions', (req, res) => {
  const { name, amount, date, type } = req.body;

  console.log('Received data:', { amount, date, type }); 
  
  if (!name || !amount || !date || !type) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'INSERT INTO transactions (name, amount, date, type) VALUES (?, ?, ?, ?)';
  db.query(query, [name, amount, date, type], (err, result) => {
    if (err) {
      console.error('Error inserting transaction:', err.message);
      return res.status(500).json({ error: 'Failed to add transaction' });
    }

    res.status(201).json({ id: result.insertId, name, amount, date, type });
  });
});

// API to get all notes
app.get('/api/notes', (req, res) => {
  const query = 'SELECT * FROM notes ORDER BY created_at DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching notes:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json(results);
  });
});

// API to add a new note
app.post('/api/notes', (req, res) => {
  const { content } = req.body;

  // Ensure content is provided
  if (!content) {
    return res.status(400).json({ error: 'Note content is required' });
  }

  const query = 'INSERT INTO notes (content) VALUES (?)';
  db.query(query, [content], (err, result) => {
    if (err) {
      console.error('Error inserting note:', err.message);
      return res.status(500).json({ error: 'Failed to add note' });
    }

    res.status(201).json({ id: result.insertId, content });
  });
});

// API to delete a note
app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM notes WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting note:', err.message);
      return res.status(500).json({ error: 'Failed to delete note' });
    }

    res.status(200).json({ message: 'Note deleted successfully' });
  });
});

// API to delete a transaction
app.delete('/api/transactions/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM transactions WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting transaction:', err);
      return res.status(500).json({ error: 'Failed to delete transaction' });
    }

    res.status(200).json({ message: 'Transaction deleted successfully' });
  });
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// Middleware to simulate authentication (for demo purposes)
app.use((req, res, next) => {
  // Simulate a logged-in user by adding user_id to the request
  // In real apps, you'd use proper authentication (JWT, sessions, etc.)
  req.user = { id: 1 }; // Example: Assume the logged-in user has ID 1
  next();
});