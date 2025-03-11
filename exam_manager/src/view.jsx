import React, { useState, useEffect } from 'react';
import axios from 'axios';

function View() {
  const [rollNumber, setRollNumber] = useState('');
  const [seatingDetails, setSeatingDetails] = useState([]);
  const apiUrl = 'http://localhost:3000/api/seating'; // Adjust the URL accordingly

  useEffect(() => {
    // Retrieve roll number from localStorage on component mount
    const storedRollNumber = localStorage.getItem('rollNumber');
    if (storedRollNumber) {
      setRollNumber(storedRollNumber);
    }
  }, []); // Empty dependency array ensures this effect runs only on mount

  useEffect(() => {
    // Submit form automatically when rollNumber is set or changed
    handleSubmit();
  }, [rollNumber]); // Run this effect whenever rollNumber changes

  const handleSubmit = async () => {
    try {
      const response = await axios.post(apiUrl, { rollNumber });
      setSeatingDetails(response.data);
    } catch (error) {
      console.error('Error fetching seating details:', error);
    }
  };

  return (
    <div>
      <h1>View Seating</h1>
      <form onSubmit={(e) => { e.preventDefault(); }}>
        <label>
          Roll Number:
          <input type="text" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} />
        </label>
      </form>
      <div>
        {seatingDetails.map((detail, index) => (
          <div key={index}>
            <p>Name: {detail.name}</p>
            <p>Department: {detail.department}</p>
            <p>Room Number: {detail.roomNo}</p>
            <p>Seat Number: {detail.seatno}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default View;
