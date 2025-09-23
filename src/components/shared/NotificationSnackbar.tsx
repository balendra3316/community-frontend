"use client";

import React from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

// Define the shape of our notification state
export interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

interface NotificationSnackbarProps {
  snackbar: SnackbarState;
  setSnackbar: React.Dispatch<React.SetStateAction<SnackbarState>>;
}

export default function NotificationSnackbar({ snackbar, setSnackbar }: NotificationSnackbarProps) {
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Snackbar 
      open={snackbar.open} 
      autoHideDuration={6000} 
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert 
        onClose={handleClose} 
        severity={snackbar.severity}
        variant="filled" 
        sx={{
            width: '100%',
            '& .MuiAlert-message': { color: 'white' },
            '& .MuiAlert-icon': { color: 'white' },
            '& .MuiAlert-action .MuiIconButton-root': { color: 'white' },
            '&.MuiAlert-filledSuccess': { backgroundColor: '#2e7d32' },
            '&.MuiAlert-filledError': { backgroundColor: '#d32f2f' }
          }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
}