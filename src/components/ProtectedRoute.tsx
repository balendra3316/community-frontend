// src/components/ProtectedRoute.tsx
"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, checkAuth } = useAuth();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuthenticated = await checkAuth();
      setAuthChecked(true);
      
      if (!isAuthenticated && !loading) {
        router.push('/'); // Use replace instead of push
        return;
      }
    };

    if (!authChecked) {
      verifyAuth();
    }
  }, [user, loading, checkAuth, router, authChecked]);

 if (loading || !authChecked) {
  return (
     <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <CircularProgress sx={{ mb: 4, color: '#d94d9b' }} />
      <Typography variant="h6">Loading...</Typography>
    </Box>
  );
}

  if (!user) {
     router.push('/');
  return null
      
  }

  return <>{children}</>;
}














