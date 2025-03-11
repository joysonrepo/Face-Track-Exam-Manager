// Home.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
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
    <div>
      <div className="taskbar">
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex' }}>
            <li style={{ marginRight: '10px' }}>
              <Link to="/rooms" style={{ color: 'white', textDecoration: 'none' }}>Capacity Check</Link>
            </li>
            <li style={{ marginRight: '10px' }}>
              <Link to="/download" style={{ color: 'white', textDecoration: 'none' }}>Seating Download</Link>
            </li>
            <li style={{ marginRight: '10px' }}>
              <Link to="/seat" style={{ color: 'white', textDecoration: 'none' }}>Seating Arrangement</Link>
            </li>
            {/* <li style={{ marginRight: '10px' }}>
              <Link to="/certificate" style={{ color: 'white', textDecoration: 'none' }}>Certificate</Link>
            </li> */}
            <li style={{ marginRight: '10px' }}>
              <Link to="/Mark" style={{ color: 'white', textDecoration: 'none' }}>Marks</Link>
            </li>
            {/* <li style={{ marginRight: '10px' }}>
              <Link to="/resultpage" style={{ color: 'white', textDecoration: 'none' }}>Result</Link>
            </li> */}
            <li>
              <Link to="/attendance" style={{ color: 'white', textDecoration: 'none' }}>Attendance</Link>
            </li>
          </ul>
        </nav>
        <div style={{ color: 'pink', marginRight: '10px' }}>Admin ID: {rollNumber}</div> {/* Display roll number here */}
        <Link to="/" className="logout-link" style={{ color: 'white', textDecoration: 'none' }}>Logout</Link>
      </div>
      {/* Rest of your content */}
    </div>
  );
};

export default Home;
