import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Button, Box, Typography } from '@mui/material';
import { Share2, Check, MessageCircle, Facebook } from 'lucide-react';
import CloseIcon from '@mui/icons-material/Close';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  shareTitle?: string;
}

export default function ShareModal({ isOpen, onClose, shareUrl, shareTitle = 'Share' }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
     
    });
  };

  const handleShareToWhatsApp = () => {
    const message = `Check out this: ${shareUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 6 }}>
        <Typography variant="h6">{shareTitle}</Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'relative', p: 2 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
          <Button
            variant="outlined"
            startIcon={<MessageCircle size={20} />}
            onClick={handleShareToWhatsApp}
            sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
          >
            Share to WhatsApp
          </Button>
          <Button
            variant="outlined"
            startIcon={<Facebook size={20} />}
            onClick={handleShareToFacebook}
            sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
          >
            Share to Facebook
          </Button>
          <Button
            variant="outlined"
            startIcon={copied ? <Check size={20} className="text-green-600" /> : <Share2 size={20} />}
            onClick={handleCopyLink}
            sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
          >
            {copied ? <Typography color="green">Copied!</Typography> : 'Copy Link'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}