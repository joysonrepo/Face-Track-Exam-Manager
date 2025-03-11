const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;

// MySQL Connection Configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'examman'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + db.threadId);
});

// Express middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: 'your_secret_key', // Change this to a random secret key
  resave: false,
  saveUninitialized: true
}));

// Multer Configuration
const storage = multer.diskStorage({
  destination: './uploads',
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage
}).single('photo');

// API endpoint to capture image and perform face recognition
app.post('/captureImage', async (req, res) => {
  const { image } = req.body;

  try {
    // Perform face recognition
    const matchResult = await matchImage(image);
    
    if (matchResult) {
      // Record attendance in the database
      const { rollNumber, name, timestamp } = matchResult; // Update variable names here
      const queryString = 'INSERT INTO attendance (rollNumber, name, timestamp, status) VALUES (?, ?, NOW(), 1)';
      console.log("SQL Query:", queryString); // Logging SQL query for debugging
      console.log("Data to Insert:", [rollNumber, name]); // Logging data to be inserted for debugging
      db.query(queryString, [rollNumber, name], (err, result) => {
        if (err) {
          console.error("Error recording attendance:", err); // Log the error for debugging
          res.status(500).json({ error: 'Error recording attendance' });
        } else {
          console.log("Attendance recorded successfully:", result); // Log the success for debugging
          res.status(200).json({ message: 'Attendance recorded successfully', rollNumber, name, timestamp });
        }
      });
    } else {
      res.status(404).json({ error: 'No match found' });
    }
  } catch (error) {
    console.error("Internal Server Error:", error); // Log the internal server error for debugging
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Function to retrieve all student data from the database
async function getAllStudentsData() {
  return new Promise((resolve, reject) => {
    const queryString = 'SELECT photo, name, rollNumber FROM students';
    db.query(queryString, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

// Dummy function to compare images (replace with actual face recognition)
async function compareImages(capturedImage, studentImage) {
  // Dummy implementation always returns true for demonstration purposes
  return true;
}

// Dummy function for face recognition (replace with actual implementation)
async function matchImage(capturedImage) {
  // Retrieve all student data from the database
  const allStudentsData = await getAllStudentsData();

  // Loop through all student data to find a match
  for (const studentData of allStudentsData) {
    // Dummy implementation for comparison (replace with actual face recognition)
    const match = await compareImages(capturedImage, studentData.photo);

    if (match) {
      // If a match is found, return student information
      const { photo, name, rollNumber } = studentData;
      const timestamp = new Date().toISOString(); // Assuming you want to record the current timestamp
      return { rollNumber, name, timestamp };
    }
  }

  // If no match is found, return null
  return null;
}
// Route to clear attendance data
app.post('/clearAttendance', (req, res) => {
  const query = 'DELETE FROM attendance';

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error clearing attendance:', err);
      res.status(500).json({ error: 'Error clearing attendance' });
    } else {
      console.log('...');
      res.json({ message: '....' });
    }
  });
});


// Route to reset room numbers and seat numbers in the student table
app.post('/resetSeating', (req, res) => {
  // Reset room number and seat number fields in the student table
  db.query('UPDATE students SET roomNo = NULL, seatno = NULL', (err, result) => {
    if (err) {
      console.error('Error resetting seating arrangement:', err);
      res.status(500).json({ error: 'An error occurred while resetting seating arrangement' });
      return;
    }
    console.log('Seating arrangement reset successfully');
    res.json({ message: 'Seating arrangement reset successfully' });
  });
});

// Route to fetch data from database
app.get('/students', (req, res) => {
  const sql = `SELECT rollNumber, seatno, roomNo FROM students WHERE rollNumber NOT LIKE '%clg%' AND rollNumber NOT LIKE '%teach%'`; // Update query
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// API endpoint to generate and download PDF for a given room number
app.get('/api/seating/:roomNo/download', (req, res) => {
  const { roomNo } = req.params;

  db.query('SELECT * FROM students WHERE roomNo = ?', [roomNo], (err, students) => {
    if (err) {
      console.error('Error fetching students for room:', err);
      res.status(500).json({ error: 'Error fetching students' });
      return;
    }

    if (students.length === 0) {
      res.status(404).json({ error: 'No students found for the room' });
      return;
    }

    const doc = new PDFDocument();
    const stream = doc.pipe(fs.createWriteStream(`seating_arrangement_${roomNo}.pdf`));

    doc.fontSize(18).text(`Seating Arrangement - Room ${roomNo}`, { align: 'center' }).moveDown();

    students.forEach((student, index) => {
      doc.text(`Roll Number: ${student.rollNumber}, Seat Number: ${student.seatno}`);
      if (index !== students.length - 1) {
        doc.moveDown();
      }
    });

    doc.end();

    stream.on('finish', () => {
      res.download(`seating_arrangement_${roomNo}.pdf`);
    });
  });
});

// Endpoint to fetch student result by roll number
app.get('/api/studentResult/:rollNo', (req, res) => {
  const { rollNo } = req.params;
  const query = `SELECT * FROM marks JOIN students ON marks.rollNumber = students.rollNumber WHERE marks.rollNumber = '${rollNo}'`;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching student result: ' + error);
      res.status(500).json({ error: 'An error occurred while fetching student result.' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Student not found.' });
      return;
    }
    const studentData = results[0];
    const department = studentData.department; // Retrieve department from the students table
    res.json({ ...studentData, department });
  });
});

// Route to handle form submission
app.post('/submitForm', (req, res) => {
  const { category, rollNumber, subjectMarks, internalMarks } = req.body;

  let sql;
  let values;

  if (category === 'cat1' || category === 'cat2') {
    sql = `INSERT INTO marks (rollNumber, subject1, subject2, subject3, subject4, subject5, subject6, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    values = [rollNumber, ...subjectMarks, category];
  } else if (category === 'final' || category === 'internal') {
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

// Route to handle POST requests to add a room
app.post('/api/rooms', (req, res) => {
  const { room_no, capacity, location } = req.body;

  // Insert the new room into the database
  db.query('INSERT INTO rooms (room_no, capacity, location) VALUES (?, ?, ?)', [room_no, capacity, location], (err, result) => {
    if (err) {
      console.error('Error adding room: ' + err.message);
      res.status(500).json({ error: 'Room already Exist' });
      return;
    }
    console.log('Room added successfully');
    res.json({ message: 'Room added successfully' });
  });
});

// Route to handle form submission (Registration route)
app.post('/register/student', upload, (req, res) => {
  const { name, department, email, password, phoneNumber, rollNumber, yearOfAcademics, Type } = req.body;
  const photo = req.file.filename;

  const formData = {
    name,
    department,
    email,
    password,
    phoneNumber,
    rollNumber,
    photo,
    yearOfAcademics,
    Type
  };

  db.query('INSERT INTO students SET ?', formData, (err, result) => {
    if (err) {
      console.error('Error inserting data into MySQL:', err);
      return res.status(500).send('Error inserting data into MySQL');
    }

    console.log('Student registration successful:', result);
    res.status(200).send('Student registration successful');
  });
});

// Route to handle form submission for login
app.post('/login', (req, res) => {
    const { rollNumber, password, Type } = req.body;

    const query = `SELECT * FROM students WHERE rollNumber = ? AND password = ? AND Type = ?`;

    db.query(query, [rollNumber, password, Type], (err, result) => {
        if (err) {
            console.error('Database query error:', err.message);
            res.status(500).json({ success: false, error: 'An error occurred during login' });
            return;
        }

        if (result.length === 1) {
            req.session.rollNumber = rollNumber; // Store roll number in session
            res.json({ success: true, message: 'Authentication successful' });
        } else {
            res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
    });
});

// Route to handle seating arrangement
app.post('/seatingarrangement', (req, res) => {
  const { selectedDepartments } = req.body;

  // Fetch available rooms
  db.query('SELECT * FROM rooms WHERE filledspace < capacity', (err, rooms) => {
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
      // Exclude roll numbers containing 'teach' and 'clg' from seating arrangement
      db.query('SELECT * FROM students WHERE department = ? AND rollNumber NOT LIKE ? AND rollNumber NOT LIKE ?', [department, '%teach%', '%clg%'], (err, students) => {
        if (err) {
          console.error(`Error fetching students for department ${department}:`, err);
          return;
        }

        students.forEach(student => {
          // Assign room and seat number to the student
          const room = rooms[currentRoomIndex];
          const { id: roomId, room_no: roomNo } = room;

          db.query('UPDATE students SET roomNo = ?, seatno = ? WHERE rollNumber = ?', [roomNo, currentSeatNo, student.rollNumber], (err, result) => {
            if (err) {
              console.error(`Error updating student ${student.rollNumber}:`, err);
              return;
            }
          });

          // Increment filledspace in the rooms table
          db.query('UPDATE rooms SET filledspace = filledspace + 1 WHERE id = ?', [roomId], (err, result) => {
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

// Route to handle session data and return roll number
app.get('/session', (req, res) => {
  // Retrieve roll number from session (adjust this based on how you store session data)
  const rollNumber = req.session.rollNumber;

  // Check if roll number exists in session
  if (rollNumber) {
    res.json({ rollNumber });
  } else {
    res.status(404).json({ error: 'Roll number not found in session' });
  }
});

// Calculate endpoint (newly added)
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

// Define API endpoint to fetch student data by roll number
app.get('/api/students/:rollNumber', (req, res) => {
  const rollNumber = req.params.rollNumber;
  const query = `SELECT students.name, students.department, marks.*
                 FROM students
                 LEFT JOIN marks ON students.rollNumber = marks.rollNumber
                 WHERE students.rollNumber = '${rollNumber}' AND marks.category = 'final'`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching student data:', err);
      res.status(500).json({ error: 'Failed to fetch student data' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Student data not found' });
      return;
    }

    const student = results[0];
    const marks = results.map(result => result.mark);

    // Calculate the average marks of the six subjects
    let totalMarks = 0;
    let subjectCount = 0;
    for (let i = 0; i < marks.length; i++) {
      if (marks[i] !== null) {
        totalMarks += marks[i];
        subjectCount++;
      }


    }

    // Calculate average marks only if there are valid marks for at least one subject
    if (subjectCount > 0) {
      const averageMarks = totalMarks / subjectCount;

      // Determine the grade based on average marks
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
        grade = 'A+';
      }

      // Respond with student data and calculated grade
      res.json({ 
        rollNumber: student.rollNumber,
        name: student.name,
        department: student.department,
        grade: grade
      });
    } else {
      // If no valid marks found for any subject, return an error
      res.status(404).json({ error: 'No valid marks found for the student' });
    }
  });
});

// API Endpoint to fetch seating details by roll number
app.post('/api/seating', (req, res) => {
  const { rollNumber } = req.body;
  const query = `SELECT name, department, roomNo, seatno FROM students WHERE rollNumber = ?`;

  db.query(query, [rollNumber], (err, results) => {
    if (err) {
      console.error('Error fetching seating details:', err);
      res.status(500).json({ error: 'An error occurred while fetching seating details' });
      return;
    }
    res.json(results);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
