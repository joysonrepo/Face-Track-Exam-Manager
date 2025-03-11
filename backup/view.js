// server.js

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors module

const app = express();
const port = 3000;

// Create MySQL Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'examman'
});

connection.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS

// API Endpoint to fetch seating details by roll number
app.post('/api/seating', (req, res) => {
  const { rollNumber } = req.body;
  const query = `SELECT name, department, roomNo, seatno FROM students WHERE rollNumber = ?`;

  connection.query(query, [rollNumber], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
