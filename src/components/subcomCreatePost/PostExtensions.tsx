import { memo, useState, lazy, Suspense, useEffect } from 'react';
import { 
  Button, 
  IconButton, 
  TextField, 
  Typography, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle,
  CircularProgress,
  Popover
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';


const EmojiPicker = lazy(() => import('emoji-picker-react'));

interface YouTubeVideoInfo {
  thumbnail: string;
  title: string;
  url: string;
}

interface PostExtensionsProps {
  type: 'youtube' | 'emoji' | null;
  emojiAnchor?: HTMLElement | null;
  onClose: () => void;
  onYoutubeAdd: (video: YouTubeVideoInfo) => void;
  onEmojiSelect: (emoji: string) => void;
}

const PostExtensions = memo(({ type, emojiAnchor, onClose, onYoutubeAdd, onEmojiSelect }: PostExtensionsProps) => {
  const [youtubeUrl, setYoutubeUrl] = useState('');




  const extractYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };


  const handleYouTubeSubmit = () => {
    if (youtubeUrl) {
      const videoId = extractYouTubeVideoId(youtubeUrl);
      
      if (videoId) {
        onYoutubeAdd({
          thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          title: "YouTube Video",
          url: youtubeUrl
        });
        setYoutubeUrl('');
      }
    }
  };


  const handleEmojiSelect = (emojiData: any) => {
    onEmojiSelect(emojiData.emoji);

  };


  const handleEmojiClose = () => {
    onClose();
  };

  return (
    <>
      {/* YouTube URL Modal */}
      {type === 'youtube' && (
        <Dialog 
          open={true}
          onClose={onClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <div className="flex justify-between items-center">
              <Typography variant="h6">Add YouTube Video</Typography>
              <IconButton size="small" onClick={onClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="YouTube URL"
              placeholder="Paste YouTube URL here"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              margin="dense"
              autoFocus
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="inherit">
              Cancel
            </Button>
            <Button 
              onClick={handleYouTubeSubmit}
              color="primary"
              disabled={!youtubeUrl}
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Emoji Picker Popover */}
      {type === 'emoji' && (
        <Popover
          open={Boolean(emojiAnchor)}
          anchorEl={emojiAnchor}
          onClose={handleEmojiClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          style={{ zIndex: 1400 }}
          PaperProps={{
            style: {
              maxHeight: '400px',
              maxWidth: '350px',
              overflow: 'hidden',
              zIndex: 1400
            }
          }}
        >
          <div className="relative">
            {/* Close button for emoji picker */}
            <div className="flex justify-between items-center p-2 border-b">
              <Typography variant="subtitle2">Choose Emoji</Typography>
              <IconButton size="small" onClick={handleEmojiClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>
            
            <div className="p-2">
              <Suspense fallback={
                <div className="flex justify-center items-center p-8">
                  <CircularProgress size={24} />
                </div>
              }>
                <EmojiPicker 
                  onEmojiClick={handleEmojiSelect}
                  width={300}
                  height={300}
                />
              </Suspense>
            </div>
          </div>
        </Popover>
      )}
    </>
  );
});

PostExtensions.displayName = 'PostExtensions';

export default PostExtensions;