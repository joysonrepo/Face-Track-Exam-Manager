const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Create connection to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'examman'
});

// Connect
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL connected');
});

// Route to handle form submission
app.post('/submitForm', (req, res) => {
  const { category, rollNumber, subjectMarks, internalMarks } = req.body;

  let sql;
  let values;

  if (category === 'cat1' || category === 'cat2') {
    sql = `INSERT INTO marks (rollNumber, subject1, subject2, subject3, subject4, subject5, subject6, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    values = [rollNumber, ...subjectMarks, category];
  } else if (category === 'final') {
    sql = `INSERT INTO marks (rollNumber, subject1, subject2, subject3, subject4, subject5, subject6, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    values = [rollNumber, ...internalMarks, category];
  } else if (category === 'internal') {
    sql = `INSERT INTO marks (rollNumber, subject1, subject2, subject3, subject4, subject5, subject6, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    values = [rollNumber, ...internalMarks, category];
  } else {
    return res.status(400).json({ error: 'Invalid category' });
  }

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error submitting form:', err.message);
      res.status(500).json({ error: 'An error occurred while submitting the form' });
    } else {
      console.log('Form submitted successfully');
      res.json({ message: 'Form submitted successfully' });
    }
  });
});

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
