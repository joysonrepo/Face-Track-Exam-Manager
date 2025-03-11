// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 3002;

app.use(bodyParser.json());
app.use(cors());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Replace with your MySQL password
  database: 'examman'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

// Define routes for students
app.get('/students', (req, res) => {
  connection.query('SELECT * FROM students', (err, results) => {
    if (err) {
      console.error('Error fetching students:', err);
      res.status(500).json({ error: 'Error fetching students' });
      return;
    }
    res.json(results);
  });
});

// Define route for seating arrangement
app.post('/seatingarrangement', (req, res) => {
  const { selectedDepartments } = req.body;
  
  // Fetch available rooms
  connection.query('SELECT * FROM rooms WHERE filledspace < capacity', (err, rooms) => {
    if (err) {
      console.error('Error fetching available rooms:', err);
      res.status(500).json({ error: 'Error fetching available rooms' });
      return;
    }
    
    if (rooms.length === 0) {
      res.status(400).json({ error: 'No available rooms' });
      return;
    }

    let currentRoomIndex = 0;
    let currentSeatNo = 1;

    selectedDepartments.forEach(department => {
      connection.query('SELECT * FROM students WHERE department = ?', [department], (err, students) => {
        if (err) {
          console.error(`Error fetching students for department ${department}:`, err);
          return;
        }
        
        students.forEach(student => {
          // Assign room and seat number to the student
          const room = rooms[currentRoomIndex];
          const { id: roomId, room_no: roomNo } = room;

          connection.query('UPDATE students SET roomNo = ?, seatno = ? WHERE rollNumber = ?', [roomNo, currentSeatNo, student.rollNumber], (err, result) => {
            if (err) {
              console.error(`Error updating student ${student.rollNumber}:`, err);
              return;
            }
          });

          // Increment filledspace in the rooms table
          connection.query('UPDATE rooms SET filledspace = filledspace + 1 WHERE id = ?', [roomId], (err, result) => {
            if (err) {
              console.error(`Error updating filledspace for room ${roomId}:`, err);
              return;
            }
          });

          // Move to the next room if current room is full
          if (currentSeatNo === room.capacity) {
            currentRoomIndex++;
            currentSeatNo = 1;
          } else {
            currentSeatNo++;
          }
        });
      });
    });

    res.json({ message: 'Seating arrangement created successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
