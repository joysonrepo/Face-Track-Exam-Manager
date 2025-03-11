import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Student = () => {
  // State to hold the roll number
  const [rollNumber, setRollNumber] = useState('');

  useEffect(() => {
    // Retrieve roll number from localStorage
    const storedRollNumber = localStorage.getItem('rollNumber');
    if (storedRollNumber) {
      setRollNumber(storedRollNumber);
    }
  }, []);

  return (
    <div className="taskbar" style={{ backgroundImage: 'url("i.jpg")', backgroundSize: 'cover', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <span style={{ color: 'pink' }}>Roll No: {rollNumber}</span> {/* Display roll number here */}
        <Link to="/certificate">certificate</Link>
        <Link to="/resultpage">Result</Link>
        <Link to="/view">View Seat</Link>
      </div>
      <Link to="/" className="logout-link">Logout</Link>
    </div>
  );
};

export default Student;
