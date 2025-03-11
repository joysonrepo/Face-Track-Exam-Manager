// Backend - result.js

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'examman'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    return;
  }
  console.log('Connected to database as id ' + connection.threadId);
});

// Endpoint to fetch student result by roll number
app.get('/api/studentResult/:rollNo', (req, res) => {
  const { rollNo } = req.params;
  const query = `SELECT * FROM marks WHERE rollNumber = '${rollNo}'`;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching student result: ' + error);
      res.status(500).json({ error: 'An error occurred while fetching student result.' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Student not found.' });
      return;
    }
    res.json(results[0]);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
