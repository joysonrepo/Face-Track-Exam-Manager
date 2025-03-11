import React, { useState, useRef } from 'react';
import axios from 'axios';

const AttendanceCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageData, setImageData] = useState(null);
  const [message, setMessage] = useState('');

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg');
    setImageData(imageData);
    stopCamera();
  };

  const handleCaptureImage = async () => {
    if (!imageData) {
      console.error('No image captured');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/captureImage', { image: imageData });
      if (response.data.message === 'Attendance recorded successfully') {
        setMessage('Attendance recorded');
      } else {
        setMessage('Mismatch found, please verify');
      }
    } catch (error) {
      console.error('Error capturing image:', error.response.data.error);
      setMessage('Mismatch found, please verify');
    }
  };

  const handleClear = async () => {
    try {
      const response = await axios.post('http://localhost:3000/clearAttendance');
      if (response.data.message === 'Attendance cleared successfully') {
        setMessage('page is ready to use');
        setImageData(null); // Reset captured image
      } else {
        setMessage('..');
      }
    } catch (error) {
      console.error('Error clearing attendance:', error);
      setMessage('... ');
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div>
        <button onClick={startCamera}>Start Camera</button>
        <button onClick={captureImage}>Capture Image</button>
        <button onClick={handleCaptureImage}>Match Image</button>
        <button onClick={handleClear}>Clear </button> {/* New Clear Button */}
      </div>
      {imageData && <img src={imageData} alt="Captured" />}
      {message && <p>{message}</p>}
    </div>
  );
};

export default AttendanceCapture;
