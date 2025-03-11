import React, { useState } from 'react';
import axios from 'axios';

const AddRoomForm = () => {
  const [roomNo, setRoomNo] = useState('');
  const [capacity, setCapacity] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/api/rooms', { room_no: roomNo, capacity: capacity, location: location })
      .then((response) => {
        console.log(response.data);
        // Reset form fields after successful submission
        setRoomNo('');
        setCapacity('');
        setLocation('');
        setSuccessMessage('Room added successfully!');
        setError('');
      })
      .catch((error) => {
        console.error(error);
        setError('Room Already exist');
        setSuccessMessage('');
      });
  };

  const formStyle = {
    maxWidth: '300px',
    margin: 'auto', // Centering the form horizontally
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  };

  const labelStyle = {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '5px',
  };

  const inputStyle = {
    width: 'calc(100% - 20px)',
    marginBottom: '10px',
    padding: '8px',
    borderRadius: '3px',
    border: '1px solid #ccc',
  };

  const buttonStyle = {
    width: 'calc(100% - 20px)',
    padding: '10px',
    border: 'none',
    borderRadius: '3px',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleSubmit} style={formStyle}>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        {successMessage && <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}
        <label htmlFor="room_no" style={labelStyle}>Room Number:</label>
        <input type="text" id="roomNo" value={roomNo} onChange={(e) => setRoomNo(e.target.value)} style={inputStyle} required />

        <label htmlFor="capacity" style={labelStyle}>Capacity:</label>
        <input type="number" id="capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} style={inputStyle} min="1" required />

        <label htmlFor="location" style={labelStyle}>Location:</label>
        <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} style={inputStyle} required />

        <button type="submit" style={buttonStyle}>Add Room</button>
      </form>
    </div>
  );
};

export default AddRoomForm;
