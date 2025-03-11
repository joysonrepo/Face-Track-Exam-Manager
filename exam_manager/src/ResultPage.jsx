import React, { useState, useEffect } from 'react';

const ResultPage = () => {
  const [rollNo, setRollNo] = useState('');
  const [studentResult, setStudentResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedRollNo = localStorage.getItem('rollNumber');
    if (storedRollNo) {
      setRollNo(storedRollNo);
      handleLoadResult(storedRollNo);
    }
  }, []); // Empty dependency array ensures the effect runs only once on component mount

  const handleLoadResult = (rollNumber) => {
    setLoading(true);
    setError(null);
    fetch(`http://localhost:3000/api/studentResult/${rollNumber}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Student not found');
        }
        return response.json();
      })
      .then(data => {
        setStudentResult(data);
      })
      .catch(error => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderSubjects = () => {
    if (studentResult && studentResult.department === 'MCA') {
      return (
        <ul style={styles.subjectList}>
          <li><strong>Java             :</strong> {studentResult.subject1}</li>
          <li><strong>Data Structures  :</strong> {studentResult.subject2}</li>
          <li><strong>Cloud            :</strong> {studentResult.subject3}</li>
          <li><strong>DIC              :</strong> {studentResult.subject4}</li>
          <li><strong>E-Commerce       :</strong> {studentResult.subject5}</li>
          <li><strong>Operating Systems:</strong> {studentResult.subject6}</li>
        </ul>
      );
    } else if (studentResult && studentResult.department === 'MBA') {
      return (
        <ul style={styles.subjectList}>
          <li><strong>Business Administration :</strong> {studentResult.subject1}</li>
          <li><strong>Business Analysis       :</strong> {studentResult.subject2}</li>
          <li><strong>Leadership              :</strong> {studentResult.subject3}</li>
          <li><strong>Entrepreneurship        : </strong> {studentResult.subject4}</li>
          <li><strong>Accounts                :</strong> {studentResult.subject5}</li>
          <li><strong>Marketing               :</strong> {studentResult.subject6}</li>
        </ul>
      );
    }
    return null;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Exam Result Page</h1>
      {error && <p style={styles.error}>{error}</p>}
      {loading && <p>Loading...</p>}
      {studentResult && (
        <div style={styles.resultDetails}>
          <h2>Student Result</h2>
          <p>Roll Number: {studentResult.rollNumber}</p>
          <p>Name: {studentResult.name}</p>
          <p>Department: {studentResult.department}</p>
          <h3>Subjects:</h3>
          {renderSubjects()}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    textAlign: 'center',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
  },
  title: {
    marginBottom: '20px',
  },
  resultDetails: {
    marginTop: '20px',
    textAlign: 'left',
  },
  subjectList: {
    listStyleType: 'none',
    padding: 0,
  },
  error: {
    color: 'red',
  }
};

export default ResultPage;
