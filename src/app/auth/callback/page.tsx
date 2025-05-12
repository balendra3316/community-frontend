// src/app/auth/callback/page.tsx
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
        console.log("Auth callback initiated");
        if (!authAttempted) {
          setAuthAttempted(true);
          const isAuthenticated = await checkAuth();
          console.log("Authentication check result:", isAuthenticated);
          
          if (isAuthenticated) {
            console.log("User authenticated, redirecting to community");
            router.push('/community');
          } else {
            setError("Authentication failed. Please try again.");
          }
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setError("An error occurred during authentication.");
      }
    };
    
    if (!loading && !user && !authAttempted) {
      handleCallback();
    } else if (user && !loading) {
      console.log("User already authenticated, redirecting to community");
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
      <CircularProgress sx={{ mb: 4, color: '#d94d9b' }} />
      <Typography variant="h6">Logging you in...</Typography>
    </Box>
  );
}