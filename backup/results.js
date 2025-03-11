// Assuming you have required dependencies and set up your server

// Import necessary modules
const express = require('express');
const mysql = require('mysql');
const cors = require('cors'); // Import the cors module

// Create connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'examman'
});

// Create Express app
const app = express();

// Use CORS middleware
app.use(cors());

// API endpoint to fetch marks and calculate grade
app.get('/marks/:rollNumber', (req, res) => {
  const rollNumber = req.params.rollNumber;

  // SQL query to fetch marks data for the provided roll number
  const sql = `SELECT * FROM marks WHERE rollNumber = ?`;

  // Execute the query
  pool.query(sql, [rollNumber], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Marks not found for the provided roll number' });
    }

    // Calculate final grade based on marks
    const marks = results[0]; // Assuming only one row is returned
    const cat1Total = (marks.subject1 + marks.subject2 + marks.subject3 + marks.subject4 + marks.subject5 + marks.subject6) / 5 * 2;
    const cat2Total = (marks.subject1 + marks.subject2 + marks.subject3 + marks.subject4 + marks.subject5 + marks.subject6) / 5 * 2;
    const finalTotal = (marks.subject1 + marks.subject2 + marks.subject3 + marks.subject4 + marks.subject5 + marks.subject6) / 5 * 12;

    const totalMarks = (cat1Total + cat2Total + finalTotal + marks.internal) / 6; // Divide by 6

    // Calculate grade
    let grade = '';
    if (totalMarks >= 90) {
      grade = 'D';
    } else if (totalMarks >= 70) {
      grade = 'A';
    } else if (totalMarks >= 60) {
      grade = 'B';
    } else if (totalMarks >= 50) {
      grade = 'C';
    } else {
      grade = 'F';
    }

    // Send response with grade
    res.json({ 
      name: marks.name,
      rollNumber: marks.rollNumber,
      grade: grade
    });
  });
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
