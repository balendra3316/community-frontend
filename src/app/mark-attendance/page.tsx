
'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { Button, TextField, Alert } from '@mui/material'; // Keep only necessary MUI components

export default function MarkAttendancePage() {
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  
  const LOGO_ACD = '/logo acd.png';
  const LOGO_SOULSKOOL = '/Final Logo.svg';
  
  // --- Logic remains the same ---
  const handleWhatsappChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 15) {
      setWhatsappNumber(value);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const response = await fetch(`${API_URL}/attendance/mark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsappNumber }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessageType('success');
        setMessage(data.message || 'Attendance marked successfully!');
      } else {
        setMessageType('error');
        setMessage(data.message || 'An unknown error occurred.');
      }
    } catch (error) {
      setMessageType('error');
      setMessage('Failed to connect to the server. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Main container using Tailwind CSS
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-l from-yellow-400 via-orange-500 to-red-500 p-4">
      {/* White card container */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
        
        {/* Logos container */}
        <div className="flex justify-center items-center gap-4 mb-4">
          <img 
            src={LOGO_ACD} 
            alt="Star Club Logo" 
            className="h-12 sm:h-14 w-auto object-contain"
          />
          <img 
            src={LOGO_SOULSKOOL} 
            alt="Soul Skool Logo" 
            className="h-12 sm:h-14 w-auto object-contain"
          />
        </div>

        {/* Headings container */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Star Club Check-in
          </h1>
          <p className="text-md sm:text-lg text-gray-600 mt-1">
            Mark Your Daily Attendance
          </p>
        </div>

        {/* Form using MUI components */}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Your WhatsApp Number"
            variant="outlined"
            fullWidth
            required
            value={whatsappNumber}
            onChange={handleWhatsappChange}
            placeholder="Enter your registered number"
            helperText="7-15 digits, no country code or symbols"
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*',
              maxLength: 15,
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            size="large"
            sx={{
              mt: 3,
              py: 1.5,
              fontWeight: 'bold',
              borderRadius: '8px',
              color: 'white',
              background: 'linear-gradient(to left, #ed8f03, #ffb75e)',
              '&:hover': { background: 'linear-gradient(to left, #e08600, #fca94d)' },
              '&:disabled': { backgroundColor: '#cccccc' },
            }}
          >
            {isLoading ? 'Processing...' : 'Mark My Attendance'}
          </Button>
        </form>

        {message && (
          <div className="mt-4">
            <Alert severity={messageType === 'success' ? 'success' : 'error'}>
              {message}
            </Alert>
          </div>
        )}

        <div className="text-center mt-4">
          <a href="/regiteruserforattendance" className="text-sm text-orange-600 hover:underline">
            New user? Register for attendance here.
          </a>
        </div>
      </div>
    </div>
  );
}
