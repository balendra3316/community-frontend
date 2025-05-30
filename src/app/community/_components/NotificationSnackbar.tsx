// src/app/community/_components/NotificationSnackbar.tsx

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
      <Alert onClose={onClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
}