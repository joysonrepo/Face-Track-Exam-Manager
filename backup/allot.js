const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'examman'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL Connected...');
});

app.use(bodyParser.json());

// Calculate endpoint
app.post('/calculate', (req, res) => {
  const selectedDepartments = req.body.selectedDepartments;

  // Fetch total students from selected departments
  const queryStudents = `SELECT COUNT(*) AS totalStudents FROM students WHERE department IN (?)`;
  db.query(queryStudents, [selectedDepartments], (err, resultStudents) => {
    if (err) {
      throw err;
    }
    const totalStudents = resultStudents[0].totalStudents;

    // Fetch rooms with filled space less than 30
    const queryRooms = `SELECT COUNT(*) AS availableRooms FROM rooms WHERE filledspace < 30`;
    db.query(queryRooms, (err, resultRooms) => {
      if (err) {
        throw err;
      }
      const availableRooms = resultRooms[0].availableRooms;
      
      res.json({
        totalStudents,
        totalRooms: availableRooms, // Use available rooms as total rooms
        examHallsAvailable: availableRooms, // Number of exam halls is the same as available rooms
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
