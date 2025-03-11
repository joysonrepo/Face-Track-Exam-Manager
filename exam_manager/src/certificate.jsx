import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';

const CertificatePage = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedRollNumber = localStorage.getItem('rollNumber');
    if (storedRollNumber) {
      setRollNumber(storedRollNumber);
      fetchGrade(storedRollNumber);
      fetchStudentDetails(storedRollNumber);
    }
  }, []);

  const fetchGrade = (rollNumber) => {
    fetch(`http://localhost:3000/api/students/${rollNumber}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (!data || !data.grade) {
          throw new Error('Invalid response from server');
        }
        setGrade(data.grade);
        setError('');
      })
      .catch(error => {
        console.error('Error fetching grade:', error);
        setError('Error fetching grade. Please try again.');
      });
  };

  const fetchStudentDetails = (rollNumber) => {
    fetch(`http://localhost:3000/api/students/${rollNumber}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (!data || !data.name || !data.department) {
          throw new Error('Invalid response from server');
        }
        setName(data.name.toUpperCase());
        setDepartment(data.department);
        setError('');
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching student details:', error);
        setError('Error fetching student details. Please try again.');
        setLoading(false);
      });
  };

  const handleDownload = () => {
    // Hide download button before capturing the certificate container
    const downloadButton = document.querySelector('.download-button');
    if (downloadButton) {
      downloadButton.style.display = 'none';
    }

    html2canvas(document.getElementById('certificate-container')).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'certificate.png';
      link.click();

      // Show download button after capturing
      if (downloadButton) {
        downloadButton.style.display = 'block';
      }
    });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="certificate-container" id="certificate-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#ffccd5', border: '2px solid #ff6b81', padding: '20px' }}>
      <div className="certificate" style={{ textAlign: 'center' }}>
        <div className="header">
          <h1>KUMARAGURU COLLEGE OF TECHNOLOGY - COIMBATORE</h1>
          <h2>CERTIFICATE OF MERIT </h2>
        </div>
        <div className="content">
          <p>This is to certify that</p>
          <h2>{name}</h2>
          <p>of {department} Department</p>
          <p>has successfully completed the course with a grade of {grade}.</p>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <p>Roll Number: {rollNumber}</p>
        </div>
        <div className="footer">
          <img src="seal.jpg" alt="Seal" className="seal" />
        </div>
      </div>
      <button onClick={handleDownload} className="download-button" style={{ marginTop: '20px' }}>Download Certificate</button>
    </div>
  );
};

export default CertificatePage;
