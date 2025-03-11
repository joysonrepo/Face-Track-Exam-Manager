import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const RegisterStudent = () => {
  const initialFormData = {
    name: '',
    department: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    rollNumber: '',
    photo: null,
    yearOfAcademics: '',
    Type: '' // Will be determined dynamically
  };

  const [formData, setFormData] = useState(initialFormData);

  const { name, department, email, password, confirmPassword, phoneNumber, rollNumber, photo, yearOfAcademics, Type } = formData;

  const onChange = e => {
    const { name, value } = e.target;

    if (name === 'photo') {
      setFormData({ ...formData, photo: e.target.files[0] });
    } else if (name === 'phoneNumber') {
      // Allow only numbers and limit length to 10 digits
      const phoneNumberValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, phoneNumber: phoneNumberValue });
    } else if (name === 'rollNumber') {
      const updatedFormData = { ...formData, [name]: value };

      // Dynamically set Type based on rollNumber
      const typePrefix = value.slice(2, 5); // Extract prefix from rollNumber
      let newType = '';

      if (typePrefix === 'clg') {
        newType = 'Admin';
      } else if (typePrefix === 'teach') {
        newType = 'Teacher';
      } else {
        newType = 'Student';
      }

      updatedFormData.Type = newType;
      setFormData(updatedFormData);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      console.log('Passwords do not match');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('name', name);
    formDataToSend.append('department', department);
    formDataToSend.append('email', email);
    formDataToSend.append('password', password);
    formDataToSend.append('phoneNumber', phoneNumber);
    formDataToSend.append('rollNumber', rollNumber);
    formDataToSend.append('yearOfAcademics', yearOfAcademics);
    formDataToSend.append('Type', Type);
    formDataToSend.append('photo', photo);

    try {
      const res = await axios.post('http://localhost:3000/register/student', formDataToSend);
      console.log('Student registration successful:', res.data);
      // Add logic for successful registration, e.g., redirect

      // Clear form fields after successful registration
      setFormData(initialFormData);
    } catch (err) {
      if (err.response) {
        console.error('Student registration failed:', err.response.status, err.response.data);
        // Add logic to display error message to the user
      } else {
        console.error('Student registration failed:', err.message);
        // Handle other types of errors, e.g., network error, server not reachable, etc.
      }
    }
  };

  return (
    <div className="container mt-5" style={{ backgroundColor: '#FFDAB9', padding: '20px', borderRadius: '8px' }}>
      <h1 className="text-primary mb-4">Student Registration</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input type="text" className="form-control" placeholder="Name" name="name" value={name} onChange={onChange} required />
        </div>
        <div className="mb-3">
          <input type="text" className="form-control" placeholder="Department" name="department" value={department} onChange={onChange} required />
        </div>
        <div className="mb-3">
          <input type="email" className="form-control" placeholder="Email" name="email" value={email} onChange={onChange} required pattern="[a-zA-Z0-9._%+-]+@gmail\.com$" />
        </div>
        <div className="mb-3">
          <input type="password" className="form-control" placeholder="Password" name="password" value={password} onChange={onChange} required minLength="6" />
        </div>
        <div className="mb-3">
          <input type="password" className="form-control" placeholder="Confirm Password" name="confirmPassword" value={confirmPassword} onChange={onChange} required minLength="6" />
        </div>
        <div className="mb-3">
          <input
            type="tel"
            className="form-control"
            placeholder="Phone Number"
            name="phoneNumber"
            value={phoneNumber}
            onChange={onChange}
            required
            maxLength="10"
          />
        </div>
        <div className="mb-3">
          <input type="text" className="form-control" placeholder="Roll Number" name="rollNumber" value={rollNumber} onChange={onChange} required />
        </div>
        <div className="mb-3">
          <input type="file" className="form-control" placeholder="Photo" name="photo" accept="image/jpeg" onChange={onChange} required />
        </div>
        <div className="mb-3">
          <input type="text" className="form-control" placeholder="Year of Academics" name="yearOfAcademics" value={yearOfAcademics} onChange={onChange} required />
        </div>
        {/* Type field is not displayed in the form */}
        <button type="submit" className="btn btn-primary me-2">Register</button>
      </form>
    </div>
  );
};

export default RegisterStudent;
