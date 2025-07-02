


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
  CircularProgress
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
  emojiTarget?: 'title' | 'content';
  onClose: () => void;
  onYoutubeAdd: (video: YouTubeVideoInfo) => void;
  onEmojiSelect: (emoji: string) => void;
}

const PostExtensions = memo(({ 
  type, 
  emojiTarget = 'content',
  onClose, 
  onYoutubeAdd, 
  onEmojiSelect 
}: PostExtensionsProps) => {
  const [youtubeUrl, setYoutubeUrl] = useState('');

  // const extractYouTubeVideoId = (url: string) => {
  //   const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  //   const match = url.match(regExp);
  //   return (match && match[2].length === 11) ? match[2] : null;
  // };

const extractYouTubeVideoId = (url: string) => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\/shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);

  return match && match[2].length === 11 ? match[2] : null;
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

      {/* Emoji Picker Modal - Centered and Mobile Optimized */}
      {type === 'emoji' && (
        <div 
          className="fixed inset-0 z-[60] bg-[rgba(144,144,144,0.6)] bg-opacity-75 flex items-center justify-center p-4"
          onClick={handleEmojiClose}
          style={{ zIndex: 1400 }}
        >
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-sm max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
            style={{ zIndex: 1401 }}
          >
            {/* Header with close button */}
            <div className="flex justify-between items-center p-3 border-b border-gray-200 flex-shrink-0">
              <Typography variant="subtitle2" className="font-medium">
                Choose Emoji for {emojiTarget === 'title' ? 'Title' : 'Content'}
              </Typography>
              <IconButton size="small" onClick={handleEmojiClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>
            
            {/* Emoji picker content */}
            <div className="flex-1 overflow-hidden">
              <Suspense fallback={
                <div className="flex justify-center items-center p-8">
                  <CircularProgress size={24} />
                </div>
              }>
                <div className="h-full">
                  <EmojiPicker 
                    onEmojiClick={handleEmojiSelect}
                    width="100%"
                    height={400}
                    searchDisabled={false}
                    skinTonesDisabled={false}
                    previewConfig={{
                      showPreview: false
                    }}
                  />
                </div>
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

PostExtensions.displayName = 'PostExtensions';

export default PostExtensions;