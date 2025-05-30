import { memo, useState, lazy, Suspense } from 'react';
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
  Menu
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

// Lazy load emoji picker
const EmojiPicker = lazy(() => import('emoji-picker-react'));

interface YouTubeVideoInfo {
  thumbnail: string;
  title: string;
  url: string;
}

interface PostExtensionsProps {
  onClose: () => void;
  onYoutubeAdd: (video: YouTubeVideoInfo) => void;
  onEmojiSelect: (emoji: string) => void;
}

const PostExtensions = memo(({ onClose, onYoutubeAdd, onEmojiSelect }: PostExtensionsProps) => {
  const [showYouTubeModal, setShowYouTubeModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [anchorElEmoji, setAnchorElEmoji] = useState<null | HTMLElement>(null);

  // Extract YouTube video ID from URL
  const extractYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Handle YouTube link submission
  const handleYouTubeSubmit = () => {
    if (youtubeUrl) {
      const videoId = extractYouTubeVideoId(youtubeUrl);
      
      if (videoId) {
        onYoutubeAdd({
          thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          title: "YouTube Video",
          url: youtubeUrl
        });
        setShowYouTubeModal(false);
        setYoutubeUrl('');
        onClose();
      }
    }
  };

  // Handle emoji selection
  const handleEmojiSelect = (emojiData: any) => {
    onEmojiSelect(emojiData.emoji);
    setAnchorElEmoji(null);
    setShowEmojiPicker(false);
    onClose();
  };

  // Emoji picker handlers
  const handleEmojiClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElEmoji(event.currentTarget);
    setShowEmojiPicker(true);
  };

  const handleEmojiClose = () => {
    setAnchorElEmoji(null);
    setShowEmojiPicker(false);
  };

  return (
    <>
      {/* YouTube URL Modal */}
      <Dialog 
        open={showYouTubeModal} 
        onClose={() => {
          setShowYouTubeModal(false);
          onClose();
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <div className="flex justify-between items-center">
            <Typography variant="h6">Add YouTube Video</Typography>
            <IconButton 
              size="small" 
              onClick={() => {
                setShowYouTubeModal(false);
                onClose();
              }}
            >
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
          <Button 
            onClick={() => {
              setShowYouTubeModal(false);
              onClose();
            }} 
            color="inherit"
          >
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

      {/* Emoji Picker Menu */}
      <Menu
        anchorEl={anchorElEmoji}
        open={Boolean(anchorElEmoji) && showEmojiPicker}
        onClose={() => {
          handleEmojiClose();
          onClose();
        }}
        PaperProps={{
          style: {
            maxHeight: '400px',
            overflow: 'hidden'
          }
        }}
      >
        <div className="p-2">
          <Suspense fallback={
            <div className="flex justify-center items-center p-4">
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
      </Menu>

      {/* Trigger buttons - these would be called from parent */}
      <div className="hidden">
        <Button onClick={() => setShowYouTubeModal(true)}>
          Open YouTube Modal
        </Button>
        <Button onClick={handleEmojiClick}>
          Open Emoji Picker
        </Button>
      </div>
    </>
  );
});

PostExtensions.displayName = 'PostExtensions';

export default PostExtensions;