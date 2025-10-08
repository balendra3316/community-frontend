
"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { useAuth } from '@/context/AuthContext';

export default function AuthCallback() {
  const router = useRouter();
  const { user, loading, checkAuth } = useAuth();
  const [authAttempted, setAuthAttempted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        if (!authAttempted) {
          setAuthAttempted(true);
          const isAuthenticated = await checkAuth();
          if (isAuthenticated) {
            router.push('/community');
          } else {
            setError("Authentication failed. Please try again.");
          }
        }
      } catch (error) {
        setError("An error occurred during authentication.");
      }
    };
    
    if (!loading && !user && !authAttempted) {
      handleCallback();
    } else if (user && !loading) {
      router.push('/community');
    }
  }, [loading, user, authAttempted, checkAuth, router]);

  if (error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Typography variant="h6" color="error" sx={{ mb: 3 }}>{error}</Typography>
        <Button 
          variant="contained" 
          onClick={() => router.push('/')}
          sx={{ 
            borderRadius: 28, 
            px: 4, 
            backgroundColor: '#d94d9b',
            '&:hover': { backgroundColor: '#c03b87' }
          }}
        >
          Return to Home
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <CircularProgress sx={{ mb: 4, color: '#c0490d' }} />
      <Typography variant="h6">Logging you in...</Typography>
    </Box>
  );
}