
import { Box, CircularProgress, Typography } from '@mui/material';
import { memo } from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
}

const LoadingSpinner = memo(({ 
  message = "Loading...", 
  size = 50 
}: LoadingSpinnerProps) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: 2,

        contain: 'layout style paint',
      }}
      role="status"
      aria-label={message}
    >
      <CircularProgress
        size={size}
        sx={{
          color: '#FFD700',

          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          },
        }}
        aria-hidden="true"
      />
      <Typography 
        variant="body1" 
        color="text.secondary"
        sx={{ 
          textAlign: 'center',
          opacity: 0.8,

          minHeight: '1.5rem',
        }}
      >
        {message}
      </Typography>
    </Box>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;