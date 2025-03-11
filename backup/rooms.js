// Import necessary modules
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

// Create an Express application
const app = express();
const PORT = process.env.PORT || 5008;

// MySQL Connection Configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Your MySQL username
  password: '', // Your MySQL password
  database: 'examman' // Your MySQL database name
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});

// Express middleware to parse JSON bodies
app.use(express.json());

// CORS middleware
app.use(cors());

// Route to handle POST requests to add a room
app.post('/api/rooms', (req, res) => {
  const { room_no, capacity, location } = req.body;
  
  // Insert the new room into the database
  connection.query('INSERT INTO rooms (room_no, capacity, location) VALUES (?, ?, ?)', [room_no, capacity, location], (err, result) => {
    if (err) {
      console.error('Error adding room: ' + err.message);
      res.status(500).json({ error: 'Failed to add room' });
      return;
    }
    console.log('Room added successfully');
    res.json({ message: 'Room added successfully' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
