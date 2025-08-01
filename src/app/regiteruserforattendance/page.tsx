// 'use client';

// import { useState, FormEvent, ChangeEvent } from 'react';
// import { Button, TextField, Typography, Container, Paper, Box, Alert, Link } from '@mui/material';

// export default function RegisterPage() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [whatsappNumber, setWhatsappNumber] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

//   const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

//   const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     // Limit to 50 chars and 20 words
//     if (value.length <= 50 && value.trim().split(/\s+/).length <= 20) {
//       setName(value);
//     }
//   };

//   const handleWhatsappChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value.replace(/\D/g, '');
//     // Limit to 15 digits
//     if (value.length <= 15) {
//       setWhatsappNumber(value);
//     }
//   };

//   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setIsLoading(true);
//     setMessage('');
//     setMessageType('');

//     try {
//       const response = await fetch(`${API_URL}/attendance/register`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name, email, whatsappNumber }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMessageType('success');
//         setMessage(data.message || 'Registration successful!');
//         setName('');
//         setEmail('');
//         setWhatsappNumber('');
//       } else {
//         setMessageType('error');
//         setMessage(data.message || 'An unknown error occurred.');
//       }
//     } catch (error) {
//       setMessageType('error');
//       setMessage('Failed to connect to the server. Please try again later.');
     
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Box sx={{
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       minHeight: '100vh',
//       background: 'linear-gradient(to right, #ffb75e, #ed8f03)', // Yellow/Orange gradient
//       p: 2,
//     }}>
//       <Container maxWidth="sm">
//         <Paper elevation={12} sx={{ p: { xs: 3, sm: 4 }, borderRadius: '16px' }}>
//           <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#333' }}>
//             Attendance
//           </Typography>
//           <Typography variant="h6" component="h2" gutterBottom align="center" sx={{ mb: 4, color: '#555' }}>
//             Register for Daily Check-in
//           </Typography>
//           <form onSubmit={handleSubmit}>
//             <TextField
//               label="Full Name"
//               variant="outlined"
//               fullWidth
//               required
//               value={name}
//               onChange={handleNameChange}
//               helperText="Max 50 characters, 20 words"
//               sx={{ mb: 2 }}
//             />
//             <TextField
//               label="Email Address"
//               type="email"
//               variant="outlined"
//               fullWidth
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               sx={{ mb: 2 }}
//             />
//             <TextField
//               label="WhatsApp Number"
//               variant="outlined"
//               fullWidth
//               required
//               value={whatsappNumber}
//               onChange={handleWhatsappChange}
//               helperText="7-15 digits, no country code needed"
//               sx={{ mb: 3 }}
//               inputProps={{
//                 inputMode: 'numeric',
//                 pattern: '[0-9]*',
//                 maxLength: 15,
//               }}
//             />
//             <Button
//               type="submit"
//               variant="contained"
//               fullWidth
//               disabled={isLoading} // Prevents multiple clicks
//               size="large"
//               sx={{
//                 py: 1.5,
//                 fontWeight: 'bold',
//                 borderRadius: '8px',
//                 color: 'white',
//                 background: 'linear-gradient(to right, #ed8f03, #ffb75e)',
//                 '&:hover': { background: 'linear-gradient(to right, #e08600, #fca94d)' },
//                 '&:disabled': { backgroundColor: '#cccccc' },
//               }}
//             >
//               {isLoading ? 'Registering...' : 'Register for Attendance'}
//             </Button>
//           </form>
//           {message && (
//             <Alert severity={messageType === 'success' ? 'success' : 'error'} sx={{ mt: 3, width: '100%' }}>
//               {message}
//             </Alert>
//           )}
//           <Box sx={{ mt: 3, textAlign: 'center' }}>
//             <Link href="/mark-attendance" underline="hover" sx={{ color: '#ed8f03' }}>
//               Already registered? Mark your attendance here.
//             </Link>
//           </Box>
//         </Paper>
//       </Container>
//     </Box>
//   );
// }




// 'use client';

// import { useState, FormEvent, ChangeEvent } from 'react';
// import { Button, TextField, Typography, Container, Paper, Box, Alert, Link } from '@mui/material';

// export default function RegisterPage() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [whatsappNumber, setWhatsappNumber] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

//   const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  
//   const LOGO_URL = '/logo acd.png'; 

//   const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     // Limit to 50 chars and 20 words
//     if (value.length <= 50 && value.trim().split(/\s+/).length <= 20) {
//       setName(value);
//     }
//   };

//   const handleWhatsappChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value.replace(/\D/g, '');
//     // Limit to 15 digits
//     if (value.length <= 15) {
//       setWhatsappNumber(value);
//     }
//   };

//   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setIsLoading(true);
//     setMessage('');
//     setMessageType('');

//     try {
//       const response = await fetch(`${API_URL}/attendance/register`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name, email, whatsappNumber }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMessageType('success');
//         setMessage(data.message || 'Registration successful!');
//         setName('');
//         setEmail('');
//         setWhatsappNumber('');
//       } else {
//         setMessageType('error');
//         setMessage(data.message || 'An unknown error occurred.');
//       }
//     } catch (error) {
//       setMessageType('error');
//       setMessage('Failed to connect to the server. Please try again later.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Box sx={{
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       minHeight: '100vh',
//       background: 'linear-gradient(to right, #ffb75e, #ed8f03)',
//       p: 2,
//     }}>
//       <Container maxWidth="sm">
//         <Paper elevation={12} sx={{ p: { xs: 3, sm: 4 }, borderRadius: '16px' }}>
//           {/* --- Updated Title with Logos --- */}
//           <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 1 }}>
//             <Box component="img" src={LOGO_URL} alt="Company Logo" sx={{ width: 60, height: 50 }} />
//             <Typography variant="h4" component="h1" align="center" sx={{ fontWeight: 'bold', color: '#333' }}>
//            Star Club  Attendance
//             </Typography>
//             <Box component="img" src={"/soulskool.png"} alt="Company Logo" sx={{ width: 50, height: 50 }} />
//           </Box>
//           <Typography variant="h6" component="h2" gutterBottom align="center" sx={{ mb: 4, color: '#555' }}>
//             Register for Daily Check-in
//           </Typography>
//           <form onSubmit={handleSubmit}>
//             <TextField
//               label="Full Name"
//               variant="outlined"
//               fullWidth
//               required
//               value={name}
//               onChange={handleNameChange}
//               helperText="Max 50 characters, 20 words"
//               sx={{ mb: 2 }}
//             />
//             <TextField
//               label="Email Address"
//               type="email"
//               variant="outlined"
//               fullWidth
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               sx={{ mb: 2 }}
//             />
//             <TextField
//               label="WhatsApp Number"
//               variant="outlined"
//               fullWidth
//               required
//               value={whatsappNumber}
//               onChange={handleWhatsappChange}
//               helperText="Only number, no country code & '0' needed"
//               sx={{ mb: 3 }}
//               inputProps={{
//                 inputMode: 'numeric',
//                 pattern: '[0-9]*',
//                 maxLength: 15,
//               }}
//             />
//             <Button
//               type="submit"
//               variant="contained"
//               fullWidth
//               disabled={isLoading}
//               size="large"
//               sx={{
//                 py: 1.5,
//                 fontWeight: 'bold',
//                 borderRadius: '8px',
//                 color: 'white',
//                 background: 'linear-gradient(to right, #ed8f03, #ffb75e)',
//                 '&:hover': { background: 'linear-gradient(to right, #e08600, #fca94d)' },
//                 '&:disabled': { backgroundColor: '#cccccc' },
//               }}
//             >
//               {isLoading ? 'Registering...' : 'Register for Attendance'}
//             </Button>
//           </form>
//           {message && (
//             <Alert severity={messageType === 'success' ? 'success' : 'error'} sx={{ mt: 3, width: '100%' }}>
//               {message}
//             </Alert>
//           )}
//           <Box sx={{ mt: 3, textAlign: 'center' }}>
//             <Link href="/mark-attendance" underline="hover" sx={{ color: '#ed8f03' }}>
//               Already registered? Mark your attendance here.
//             </Link>
//           </Box>
//         </Paper>
//       </Container>
//     </Box>
//   );
// }




'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { Button, TextField, Alert } from '@mui/material'; // Keep only necessary MUI components

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  
  const LOGO_ACD = '/logo acd.png'; 
  const LOGO_SOULSKOOL ='/Final Logo.svg';

  // --- Logic remains the same ---
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 50 && value.trim().split(/\s+/).length <= 20) {
      setName(value);
    }
  };

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
      const response = await fetch(`${API_URL}/attendance/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, whatsappNumber }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessageType('success');
        setMessage(data.message || 'Registration successful!');
        setName('');
        setEmail('');
        setWhatsappNumber('');
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 p-4">
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
            Star Club Attendance
          </h1>
          <p className="text-md sm:text-lg text-gray-600 mt-1">
            Register for Daily Check-in
          </p>
        </div>

        {/* Form using MUI components */}
        <form onSubmit={handleSubmit}>
          {/* --- FIX: Removed wrapper div and added margin to each TextField --- */}
          <div className="mb-4">
            <TextField
              label="Full Name"
              variant="outlined"
              fullWidth
              required
              value={name}
              onChange={handleNameChange}
              helperText="Max 50 characters, 20 words"
            />
          </div>
          <div className="mb-4">
            <TextField
              label="Email Address"
              type="email"
              variant="outlined"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <TextField
              label="WhatsApp Number"
              variant="outlined"
              fullWidth
              required
              value={whatsappNumber}
              onChange={handleWhatsappChange}
              helperText="Only number, no country code & '0' needed"
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
                maxLength: 15,
              }}
            />
          </div>
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
              background: 'linear-gradient(to right, #ed8f03, #ffb75e)',
              '&:hover': { background: 'linear-gradient(to right, #e08600, #fca94d)' },
              '&:disabled': { backgroundColor: '#cccccc' },
            }}
          >
            {isLoading ? 'Registering...' : 'Register for Attendance'}
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
          <a href="/mark-attendance" className="text-sm text-orange-600 hover:underline">
            Already registered? Mark your attendance here.
          </a>
        </div>
      </div>
    </div>
  );
}
