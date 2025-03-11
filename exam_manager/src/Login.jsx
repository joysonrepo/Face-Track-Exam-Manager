import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Login = () => {
    const [rollNumber, setRollNumber] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/login', { rollNumber, password, Type: userType.toLowerCase() });

            if (response.data.success) {
                console.log('Authentication successful');

                // Store roll number in localStorage
                localStorage.setItem('rollNumber', rollNumber);

                // Redirect based on user type
                switch (userType.toLowerCase()) {
                    case 'admin':
                        window.location.href = '/Home';
                        break;
                    case 'teacher':
                        window.location.href = '/teacher';
                        break;
                    case 'student':
                        window.location.href = '/student';
                        break;
                    default:
                        setError('Invalid user type');
                }
            } else {
                setError(response.data.error || 'Invalid credentials');
            }
        } catch (error) {
            console.error('Error during login:', error.message);
            setError('An error occurred during login');
        }
    };

    return (
        <div className="login-container d-flex align-items-center justify-content-center">
            <div className="col-md-6">
                <h2 className="text-center mb-4">Login</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="rollNo">Roll No:</label>
                        <input
                            type="text"
                            id="rollNo"
                            className="form-control"
                            value={rollNumber}
                            onChange={(e) => setRollNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="userType">User Type:</label>
                        <select
                            id="userType"
                            className="form-control"
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                            required
                        >
                            <option value="">Select User Type</option>
                            <option value="admin">Admin</option>
                            <option value="teacher">Teacher</option>
                            <option value="student">Student</option>
                        </select>
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary btn-lg mt-3">Login</button>
                        <Link to="/register" className="btn btn-link mt-2">Register</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
