import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Teacher = () => {
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
      <nav>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex' }}>
          <li style={{ marginRight: '20px' }}>
            <Link to="/Mark" style={{ color: 'black', textDecoration: 'none' }}>Marks</Link>
          </li>
          <li style={{ marginRight: '20px' }}>
            <Link to="/view" style={{ color: 'black', textDecoration: 'none' }}>View Seat</Link>
          </li>
          <li>
            <Link to="/attendance" style={{ color: 'black', textDecoration: 'none' }}>Attendance</Link>
          </li>
        </ul>
      </nav>
      <div style={{ color: 'pink' }}>Teacher ID: {rollNumber}</div> {/* Display roll number here */}
      <Link to="/" className="logout-link" style={{ color: 'black', textDecoration: 'none' }}>Logout</Link>
    </div>
  );
};

export default Teacher;
