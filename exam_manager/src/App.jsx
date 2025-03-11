import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ExamRooms from './ExamRooms';
import Register from './RegisterStudent';
import Login from './Login';
import Home from './Home';
import SeatingDownload from '../SeatingDownload';
import AddRoomForm from './AddRoomForm';
import MarkEntryForm from './MarkEntryForm';
import AttendanceModule from './AttendanceCapture';
import ResultPage from './ResultPage';
import CertificatePage from './certificate';
import Seatingarrange from './seatingarrange';
import Teacher from './teacher';
import Student from './student';
import View from './view';
const App = () => {
  // Define the handleSubmit function to handle form submission
  const handleSubmit = async (data) => {
    console.log('Form submitted successfully:', data);
    // Handle form submission logic here
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student" element={<Student />} />
        <Route path="/rooms" element={<ExamRooms />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/view" element={<View />} />
        <Route path="/download" element={<SeatingDownload />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Mark" element={<MarkEntryForm onSubmit={handleSubmit} />} /> {/* Pass handleSubmit as a prop */}
        <Route path="/Add" element={<AddRoomForm />} />
        <Route path="/seat" element={<Seatingarrange />} />
        <Route path="/attendance" element={<AttendanceModule />} />
        <Route path="/resultpage" element={<ResultPage />} />
        <Route path="/certificate" element={<CertificatePage />} />
      </Routes>
    </BrowserRouter>
  );
};
    
export default App;
