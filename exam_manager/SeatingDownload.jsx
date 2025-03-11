import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SeatingDownload() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/students')
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const filteredStudents = students.filter(student => !student.rollNumber.includes('clg') && !student.rollNumber.includes('teach'));

  const downloadData = () => {
    // Convert student data to CSV format
    const csvContent = filteredStudents.map(student => {
      return `${student.rollNumber},${student.seatno},${student.roomNo}`;
    }).join('\n');

    // Create a Blob with the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'student_data.csv');
    document.body.appendChild(link);
    link.click();

    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  return (
    <div>
      <h1>Student Data</h1>
      <button onClick={downloadData}>Download Data</button>
      <table>
        <thead>
          <tr>
            <th>Roll Number</th>
            <th>Seat No</th>
            <th>Room No</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map(student => (
            <tr key={student.rollNumber}>
              <td>{student.rollNumber}</td>
              <td>{student.seatno}</td>
              <td>{student.roomNo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SeatingDownload;
