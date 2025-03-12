

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
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
        console.error('MySQL connection error:', err.message);
        throw err;
    }
    console.log('MySQL Connected');
});

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
            res.json({ success: true, message: 'Authentication successful' });
        } else {
            res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
