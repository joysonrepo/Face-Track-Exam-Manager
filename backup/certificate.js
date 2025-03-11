const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'examman'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.get('/api/students/:rollNumber', (req, res) => {
  const rollNumber = req.params.rollNumber;

  // Query to fetch data from the students table
  const studentQuery = `
    SELECT * FROM students WHERE rollNumber = '${rollNumber}';
  `;

  connection.query(studentQuery, (err, studentResults) => {
    if (err) {
      console.error('Error fetching student data:', err);
      res.status(500).json({ error: 'Failed to fetch student data' });
      return;
    }

    if (studentResults.length === 0) {
      res.status(404).json({ error: 'Student data not found' });
      return;
    }

    const student = studentResults[0];

    // Query to fetch data from the marks table
    const marksQuery = `
      SELECT * FROM marks WHERE rollNumber = '${rollNumber}' AND category = 'final';
    `;

    connection.query(marksQuery, (err, marksResults) => {
      if (err) {
        console.error('Error fetching marks data:', err);
        res.status(500).json({ error: 'Failed to fetch marks data' });
        return;
      }

      if (marksResults.length === 0) {
        res.status(404).json({ error: 'Marks data not found' });
        return;
      }

      const marks = marksResults.map(result => result.mark);

      let totalMarks = 0;
      let subjectCount = 0;
      for (let i = 0; i < marks.length; i++) {
        if (marks[i] !== null) {
          totalMarks += marks[i];
          subjectCount++;
        }
      }

      if (subjectCount > 0) {
        const averageMarks = totalMarks / subjectCount;

        let grade = '';
        if (averageMarks >= 90) {
          grade = 'A+';
        } else if (averageMarks >= 80) {
          grade = 'A';
        } else if (averageMarks >= 70) {
          grade = 'B+';
        } else if (averageMarks >= 60) {
          grade = 'B';
        } else if (averageMarks >= 50) {
          grade = 'C+';
        } else if (averageMarks >= 40) {
          grade = 'C';
        } else {
          grade = 'A';
        }

        res.json({ 
          rollNumber: student.rollNumber,
          name: student.name,
          department: student.department,
          grade: grade
        });
      } else {
        res.status(404).json({ error: 'No valid marks found for the student' });
      }
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
