const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware to enable CORS
app.use(cors());

// Create connection to MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'examman'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL connected');
});

// Route to fetch data from database
app.get('/students', (req, res) => {
  const sql = `SELECT rollNumber, seatno, roomNo FROM students WHERE rollNumber NOT LIKE '%clg%' AND rollNumber NOT LIKE '%teach%'`; // Update query
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
