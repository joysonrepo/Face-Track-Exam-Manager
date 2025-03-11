import React, { useState } from 'react';
import './MarkEntryForm.css';

const MarkEntryForm = ({ onSubmit }) => {
  const [category, setCategory] = useState('cat1');
  const [rollNumber, setRollNumber] = useState('');
  const [subjectMarks, setSubjectMarks] = useState(Array(6).fill(''));
  const [internalMarks, setInternalMarks] = useState(Array(6).fill(''));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/submitForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category, rollNumber, subjectMarks, internalMarks }),
      });
      if (response.ok) {
        const data = await response.json();
        onSubmit(data); // Pass response data to the onSubmit callback
        setRollNumber('');
        setSubjectMarks(Array(6).fill(''));
        setInternalMarks(Array(6).fill(''));
      } else {
        const errorData = await response.json();
        console.error('Error submitting form:', errorData.error);
        // Inform user about the error
      }
    } catch (error) {
      console.error('Error submitting form:', error.message);
      // Inform user about the error
    }
  };

  const handleSubjectMarksChange = (index, value) => {
    const newSubjectMarks = [...subjectMarks];
    newSubjectMarks[index] = value;
    setSubjectMarks(newSubjectMarks);
  };

  const handleInternalMarksChange = (index, value) => {
    const newInternalMarks = [...internalMarks];
    newInternalMarks[index] = value;
    setInternalMarks(newInternalMarks);
  };

  return (
    <div className="form-container" style={{ backgroundColor: '#FCE7EA', padding: '30px', borderRadius: '8px' }}>
      <title>Mark Entry</title>
      <div className="taskbar">
        <button className={category === 'cat1' ? 'active' : ''} onClick={() => setCategory('cat1')}>
          internal 1
        </button>
        <button className={category === 'cat2' ? 'active' : ''} onClick={() => setCategory('cat2')}>
          internal 2
        </button>
        <button className={category === 'final' ? 'active' : ''} onClick={() => setCategory('final')}>
          Final sem         .
        </button>
        <button className={category === 'internal' ? 'active' : ''} onClick={() => setCategory('internal')}>
          Assement Marks
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="rollNumber">Roll Number:</label>
          <input
            type="text"
            id="rollNumber"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            required
          />
        </div>
        {(category !==  'internal') && Array.from({ length: 6 }).map((_, index) => (
          <div className="form-group" key={index}>
            <label htmlFor={`sub${index + 1}`}>{`Subject ${index + 1} Marks:`}</label>
            <input
              type="number"
              id={`sub${index + 1}`}
              value={subjectMarks[index]}
              onChange={(e) => handleSubjectMarksChange(index, e.target.value)}
              required
            />
          </div>
        ))}
        {(category ===  'internal') && Array.from({ length: 6 }).map((_, index) => (
          <div className="form-group" key={index}>
            <label htmlFor={`internal${index + 1}`}>{`Subject ${index + 1} Internal Marks:`}</label>
            <input
              type="number"
              id={`internal${index + 1}`}
              value={internalMarks[index]}
              onChange={(e) => handleInternalMarksChange(index, e.target.value)}
              required
            />
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default MarkEntryForm;
