
"use client"
import { 
  Box, 
  Button, 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  IconButton, 
  Typography 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GoogleIcon from '@mui/icons-material/Google';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onGoogleLogin: () => Promise<void>;
}

export default function AuthModal({ open, onClose, onGoogleLogin }: AuthModalProps) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
          Welcome to ACD
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center', px: 4, pb: 5 }}>
        <Typography variant="body1" sx={{ mb: 4 }}>
          To get started, please continue with Google
        </Typography>
        
        <Button variant="outlined" onClick={onGoogleLogin}>
          <img
            src="google.png"
            className=" mr-4"
            width={25}
            height={25}
            alt="google"
          />
          Continue with Google
        </Button>
      </DialogContent>
    </Dialog>
  );
}