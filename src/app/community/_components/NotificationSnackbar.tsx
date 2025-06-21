import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface NotificationSnackbarProps {
  open: boolean;
  message: string;
  severity: "success" | "error";
  onClose: () => void;
}

export default function NotificationSnackbar({
  open,
  message,
  severity,
  onClose,
}: NotificationSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert 
        onClose={onClose} 
        severity={severity}
        sx={{
          width: '100%',
          color: 'white !important',
          '& .MuiAlert-message': {
            color: 'white !important',
            fontWeight: 500
          },
          '& .MuiAlert-icon': {
            color: 'white !important'
          },
          '& .MuiAlert-action': {
            color: 'white !important',
            '& .MuiIconButton-root': {
              color: 'white !important',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }
          },

          '&.MuiAlert-filledSuccess': {
            backgroundColor: '#2e7d32', // Dark green for better contrast
            color: 'white !important'
          },
          '&.MuiAlert-filledError': {
            backgroundColor: '#d32f2f', // Dark red for better contrast
            color: 'white !important'
          }
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}