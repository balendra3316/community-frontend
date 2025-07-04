
import { memo, useState, lazy, Suspense } from 'react';
import { Button, IconButton, TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, InputAdornment } from '@mui/material';
import { Close as CloseIcon, ContentPaste as PasteIcon } from '@mui/icons-material';

const EmojiPicker = lazy(() => import('emoji-picker-react'));

interface YouTubeVideoInfo { thumbnail: string; title: string; url: string; }

interface PostExtensionsProps {
  type: 'youtube' | 'emoji' | 'link' | null;
  emojiTarget?: 'title' | 'content';
  onClose: () => void;
  onYoutubeAdd: (video: YouTubeVideoInfo) => void;
  onLinkAdd: (url: string) => void;
  onEmojiSelect: (emoji: string) => void;
}

const PostExtensions = memo(({
  type,
  emojiTarget = 'content',
  onClose,
  onYoutubeAdd,
  onLinkAdd,
  onEmojiSelect
}: PostExtensionsProps) => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkError, setLinkError] = useState('');

  const extractYouTubeVideoId = (url: string) => {
    const regExp = /^.*(https:\/\/www\.youtube\.com\/watch\?v=|https:\/\/youtu\.be\/|https:\/\/www\.youtube\.com\/embed\/|https:\/\/www\.youtube\.com\/shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2] && match[2].length === 11 ? match[2] : null;
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
      } else {
        // Handle invalid YouTube URL if needed
      }
    }
  };
  
  const handleLinkSubmit = () => {
    const url = linkUrl.trim();

    if (url.includes(' ')) {
      setLinkError('URL cannot contain spaces.');
      return;
    }
    if (!url.startsWith('https://')) {
      setLinkError('URL must start with https://');
      return;
    }
    try {
      new URL(url);
      onLinkAdd(url);
      setLinkUrl('');
      setLinkError('');
    } catch (error) {
      setLinkError('Please enter a valid URL format.');
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setLinkUrl(text);
        if (linkError) setLinkError(''); // Clear error on paste
      }
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      setLinkError('Could not paste from clipboard.');
    }
  };

  const handleEmojiSelect = (emojiData: any) => {
    onEmojiSelect(emojiData.emoji);
  };

  return (
    <>
      {/* YouTube URL Modal */}
      {type === 'youtube' && (
        <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <div className="flex justify-between items-center">
                    <Typography variant="h6">Add YouTube Video</Typography>
                    <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
                </div>
            </DialogTitle>
            <DialogContent>
                <TextField fullWidth autoFocus margin="dense" label="YouTube URL" placeholder="Paste YouTube URL here" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">Cancel</Button>
                <Button onClick={handleYouTubeSubmit} color="primary" disabled={!youtubeUrl}>Add</Button>
            </DialogActions>
        </Dialog>
      )}

      {/* Add Link Modal */}
      {type === 'link' && (
        <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <div className="flex justify-between items-center">
                    <Typography variant="h6">Add a Link</Typography>
                    <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
                </div>
            </DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    autoFocus
                    margin="dense"
                    label="URL"
                    placeholder="https://example.com"
                    value={linkUrl}
                    onChange={(e) => {
                        setLinkUrl(e.target.value);
                        if (linkError) setLinkError('');
                    }}
                    error={!!linkError}
                    helperText={linkError || "URL must start with https:// and contain no spaces."}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="paste link"
                            onClick={handlePasteFromClipboard}
                            edge="end"
                          >
                            <PasteIcon />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">Cancel</Button>
                <Button onClick={handleLinkSubmit} color="primary" disabled={!linkUrl}>Add Link</Button>
            </DialogActions>
        </Dialog>
      )}

      {/* Emoji Picker Modal */}
      {type === 'emoji' && (
        <div className="fixed inset-0 z-[60] bg-[rgba(144,144,144,0.6)] bg-opacity-75 flex items-center justify-center p-4" onClick={onClose} style={{ zIndex: 1400 }}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()} style={{ zIndex: 1401 }}>
            <div className="flex justify-between items-center p-3 border-b border-gray-200 flex-shrink-0">
              <Typography variant="subtitle2" className="font-medium">Choose Emoji for {emojiTarget === 'title' ? 'Title' : 'Content'}</Typography>
              <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
            </div>
            <div className="flex-1 overflow-hidden">
              <Suspense fallback={<div className="flex justify-center items-center p-8"><CircularProgress size={24} /></div>}>
                <div className="h-full">
                  <EmojiPicker onEmojiClick={handleEmojiSelect} width="100%" height={400} searchDisabled={false} skinTonesDisabled={false} previewConfig={{ showPreview: false }} />
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