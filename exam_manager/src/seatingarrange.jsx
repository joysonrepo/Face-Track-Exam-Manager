import React, { useState, useEffect } from 'react';
import './ExamRooms.css';
import axios from 'axios';

const SeatingArrange = () => {
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [allotmentMade, setAllotmentMade] = useState(false);
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [roomsInsufficient, setRoomsInsufficient] = useState(false);

  const departments = [
    'MCA',
    'MBA',
    'BE_MECH',
    'BE_CIVIL',
    'BE_CSC',
    'BE_DS',
    'BE_AI'
  ];

  useEffect(() => {
    fetchStudents();
    fetchRooms();
  }, []);

  const fetchStudents = () => {
    axios.get('http://localhost:3000/students')
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        console.error('Error fetching students:', error);
      });
  };

  const fetchRooms = () => {
    axios.get('http://localhost:3000/rooms')
      .then(response => {
        setRooms(response.data);
      })
      .catch(error => {
        console.error('Error fetching rooms:', error);
      });
  };

  const handleDepartmentChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedDepartments([...selectedDepartments, value]);
    } else {
      setSelectedDepartments(selectedDepartments.filter(dep => dep !== value));
    }
  };

  const makeSeating = () => {
    axios.post('http://localhost:3000/seatingarrangement', { selectedDepartments })
      .then(response => {
        const { message } = response.data;
        console.log(message);
        setAllotmentMade(true);
      })
      .catch(error => {
        console.error('Error making seating arrangement:', error);
        if (error.response && error.response.status === 400) {
          setRoomsInsufficient(true);
        }
      });
  };

  const resetSeating = () => {
    axios.post('http://localhost:3000/resetSeating')
      .then(response => {
        const { message } = response.data;
        console.log(message);
        fetchStudents(); 
      })
      .catch(error => {
        console.error('Error resetting seating arrangement:', error);
      });
  };

  const handleAddRooms = () => {
    
  };

  return (
    <div className="seating-page-container">
      <div className="exam-rooms-container">
        <h2>Select Departments</h2>
        <form>
          <div className="department-list">
            <label>Departments:</label>
            <div className="department-checkboxes">
              {departments.map(department => (
                <div className="department-checkbox" key={department}>
                  <input
                    type="checkbox"
                    id={department}
                    value={department}
                    onChange={handleDepartmentChange}
                    checked={selectedDepartments.includes(department)}
                  />
                  <label htmlFor={department}>{department}</label>
                </div>
              ))}
            </div>
          </div>
        </form>
        <button onClick={makeSeating}>Make Seating</button>
        <button onClick={resetSeating}>Reset Seating</button>
        {roomsInsufficient && (
          <div>
            <p style={{ color: 'red' }}>Rooms Insufficient. Please add rooms.</p>
            {/* <button onClick={handleAddRooms}>Add Rooms</button> */}
          </div>
        )}
        {allotmentMade && (
          <p style={{ color: 'green' }}>Allotment made successfully!</p>
        )}
      </div>
      <div className="seating-arrangement-container">
        
      </div>
    </div>
  );
};

export default SeatingArrange;
