import React, { useState } from 'react';
import './ExamRooms.css';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const ExamRooms = () => {
  const [formData, setFormData] = useState({
    selectedDepartments: [],
    totalStudents: 0,
    totalRooms: 0,
    examHallsAvailable: 0,
  });

  const [roomsInsufficient, setRoomsInsufficient] = useState(false);

  const departments = [
    { id: 'MCA', name: 'MCA' },
    { id: 'MBA', name: 'MBA' },
    { id: 'BE_MECH', name: 'BE. MECH' },
    { id: 'BE_CIVIL', name: 'BE. CIVIL' },
    { id: 'BE_CSC', name: 'BE. CSC' },
    { id: 'BE_DS', name: 'BE. DS' },
    { id: 'BE_AI', name: 'BE. AI' }
  ];

  const handleDepartmentChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({ ...formData, selectedDepartments: [...formData.selectedDepartments, value] });
    } else {
      setFormData({ ...formData, selectedDepartments: formData.selectedDepartments.filter(dep => dep !== value) });
    }
  };

  const calculateTotalStudentsAndRooms = () => {
    axios.post('http://localhost:3000/calculate', { selectedDepartments: formData.selectedDepartments })
      .then(response => {
        const { totalStudents, totalRooms, examHallsAvailable } = response.data;
        setFormData({ ...formData, totalStudents, totalRooms, examHallsAvailable });
        if (totalRooms > examHallsAvailable) {
          setRoomsInsufficient(true);
        } else {
          setRoomsInsufficient(false);
        }
      })
      .catch(error => {
        console.error('Error calculating:', error);
      });
  };

  return (
    <div className="exam-rooms-container">
      <h2>Add Exam Rooms</h2>
      <form>
        <div className="department-list">
          <label>Departments:</label>
          <div className="department-checkboxes">
            {departments.map(department => (
              <div className="department-checkbox" key={department.id}>
                <input
                  type="checkbox"
                  id={department.id}
                  value={department.id}
                  onChange={handleDepartmentChange}
                  checked={formData.selectedDepartments.includes(department.id)}
                />
                <label htmlFor={department.id}>{department.name}</label>
              </div>
            ))}
          </div>
        </div>
      </form>
      <button onClick={calculateTotalStudentsAndRooms}>Calculate</button>
      {/* Use Link component to navigate to another page */}
      <Link to="/Add">
        <button>Add Room</button>
      </Link>
      <div>
        <p>Total Students: {formData.totalStudents}</p>
        <p>Total Rooms Needed: {formData.totalRooms}</p>
        <p>Exam Halls Available: {formData.examHallsAvailable}</p>
        {roomsInsufficient && (
          <p style={{ color: 'red' }}>Rooms Insufficient. Please add rooms.</p>
        )}
      </div>
    </div>
  );
};

export default ExamRooms;
