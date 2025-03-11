// CombinedBackend.js

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

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
  console.log('MySQL connected');
});

// API endpoint to capture image and perform face recognition
app.post('/captureImage', async (req, res) => {
  const { image } = req.body;

  try {
    // Perform face recognition
    const matchResult = await matchImage(image);
    
    if (matchResult) {
      // Record attendance in the database
      const { rollNumber, name, timestamp } = matchResult;
      const queryString = 'INSERT INTO attendance (rollNumber, name, timestamp) VALUES (?, ?, NOW())';
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
      console.log("No match found");
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

// Dummy function for face recognition (replace with actual implementation)
async function matchImage(capturedImage) {
  // Retrieve all student data from the database
  const allStudentsData = await getAllStudentsData();

  // Dummy implementation for demonstration purposes
  // Replace this with your actual face recognition logic
  // For now, let's assume a match if any student's photo matches the captured image
  for (const studentData of allStudentsData) {
    if (studentData.photo === capturedImage) {
      const { name, rollNumber } = studentData;
      const timestamp = new Date().toISOString(); // Assuming you want to record the current timestamp
      return { rollNumber, name, timestamp };
    }
  }

  // If no match is found, return null
  return null;
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
