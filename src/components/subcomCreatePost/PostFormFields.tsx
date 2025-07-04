

import { memo } from 'react';
import { TextField, Typography, IconButton, Button } from '@mui/material';
import { Close as CloseIcon, Add as PlusIcon, Delete as DeleteIcon, EmojiEmotions as EmojiIcon } from '@mui/icons-material';

interface PollOption { text: string; }
interface YouTubeVideoInfo { thumbnail: string; title: string; url: string; }

interface PostFormFieldsProps {
  title: string;
  content: string;
  titleWordCount: number;
  contentWordCount: number;
  errorMessage: string;
  selectedImage: File | null;
  imagePreview: string | null;
  youtubeVideo: YouTubeVideoInfo | null;
  links: string[]; // New prop for links
  onRemoveLink: (link: string) => void; // New prop for removing links
  showPoll: boolean;
  pollOptions: PollOption[];
  containsBadWords: (text: string) => boolean;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onImageUpload: (file: File, preview: string) => void;
  onRemoveImage: () => void;
  onRemoveYoutube: () => void;
  onPollOptionUpdate: (index: number, text: string) => void;
  onAddPollOption: () => void;
  onRemovePollOption: (index: number) => void;
  onCancelPoll: () => void;
  onTitleEmojiClick: () => void;
  onContentEmojiClick: () => void;
}

const PostFormFields = memo(({
  title, content, titleWordCount, contentWordCount, errorMessage,
  selectedImage, imagePreview, youtubeVideo, links, onRemoveLink, showPoll,
  pollOptions, onTitleChange, onContentChange, onRemoveImage,
  onRemoveYoutube, onPollOptionUpdate, onAddPollOption,
  onRemovePollOption, onCancelPoll, onTitleEmojiClick, onContentEmojiClick
}: PostFormFieldsProps) => {

  const handlePollOptionChange = (index: number, value: string) => {
    if (value.length <= 30) {
      onPollOptionUpdate(index, value);
    }
  };

  return (
    <div className="p-4">
      {/* Title Field */}
      <div className="relative">
        <div className="flex items-center">
            <TextField fullWidth placeholder="Title" variant="standard" value={title} onChange={(e) => onTitleChange(e.target.value)} InputProps={{ disableUnderline: true, style: { fontSize: '1.125rem', fontWeight: 500 } }} className="mb-1 flex-1" />
            <IconButton size="small" onClick={onTitleEmojiClick} className="ml-2 text-gray-500 hover:text-blue-500"><EmojiIcon fontSize="small" /></IconButton>
        </div>
        <div className={`text-right text-xs ${titleWordCount > 30 ? 'text-red-500' : 'text-gray-500'}`}>{titleWordCount}/30 words</div>
      </div>
      
      {/* Content Field */}
      <div className="relative mt-2">
        <div className="flex items-start">
            <TextField fullWidth multiline placeholder="Write something..." variant="standard" value={content} onChange={(e) => onContentChange(e.target.value)} InputProps={{ disableUnderline: true, style: { fontSize: '1rem' } }} minRows={4} maxRows={8} className="mb-1 flex-1" />
            <IconButton size="small" onClick={onContentEmojiClick} className="ml-2 text-gray-500 hover:text-blue-500 mt-1"><EmojiIcon fontSize="small" /></IconButton>
        </div>
        <div className={`text-right text-xs ${contentWordCount > 200 ? 'text-red-500' : 'text-gray-500'}`}>{contentWordCount}/200 words</div>
      </div>

      {/* Error Message */}
      {errorMessage && <div className="text-red-500 text-sm mt-2 mb-3">{errorMessage}</div>}

      {/* Links Preview */}
      {links.length > 0 && (
        <div className="mt-3 mb-2 space-y-2">
            {links.map((link, index) => (
                <div key={index} className="flex items-center justify-between bg-blue-50 dark:bg-gray-700 p-2 rounded-lg">
                    <Typography
                        variant="body2"
                        color="primary"
                        className="truncate mr-2 font-medium"
                        component="a"
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {link}
                    </Typography>
                    <IconButton size="small" onClick={() => onRemoveLink(link)} title="Remove link">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </div>
            ))}
        </div>
      )}

      {/* Selected Image Preview */}
      {imagePreview && (
        <div className="relative mt-2 mb-2">
          <img src={imagePreview} alt="Selected" className="max-h-40 rounded-md" />
          <IconButton size="small" className="absolute top-1 right-1 bg-gray-800 bg-opacity-50 text-white" onClick={onRemoveImage}><CloseIcon fontSize="small" /></IconButton>
        </div>
      )}

      {/* YouTube Video Preview */}
      {youtubeVideo && (
        <div className="relative mt-2 mb-2 border border-gray-200 rounded-md p-2 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex-shrink-0"><img src={youtubeVideo.thumbnail} alt="YouTube Thumbnail" className="w-full sm:w-32 h-24 rounded object-cover" /></div>
            <div className="flex-1 min-w-0">
                <Typography variant="subtitle2" className="text-sm font-medium line-clamp-2">{youtubeVideo.title}</Typography>
                <Typography variant="caption" color="textSecondary" className="text-xs break-all line-clamp-1 mt-1">{youtubeVideo.url}</Typography>
            </div>
            <div className="flex-shrink-0 self-start sm:self-center"><IconButton size="small" onClick={onRemoveYoutube} className="bg-gray-100 hover:bg-gray-200"><CloseIcon fontSize="small" /></IconButton></div>
          </div>
        </div>
      )}

      {/* Poll Options */}
      {showPoll && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center mb-2">
            <Typography variant="subtitle1">Poll</Typography>
            <Button variant="text" color="error" size="small" onClick={onCancelPoll}>Cancel Poll</Button>
          </div>
          {pollOptions.map((option, index) => (
            <div key={index} className="mb-2">
              <div className="flex items-center">
                <TextField fullWidth placeholder={`Option ${index + 1}`} size="small" value={option.text} onChange={(e) => handlePollOptionChange(index, e.target.value)} className="mr-2" />
                {pollOptions.length > 2 && (<IconButton size="small" color="error" onClick={() => onRemovePollOption(index)}><DeleteIcon fontSize="small" /></IconButton>)}
              </div>
              <div className={`text-right text-xs mt-1 ${option.text.length > 30 ? 'text-red-500' : 'text-gray-500'}`}>{option.text.length}/30 characters</div>
            </div>
          ))}
          {pollOptions.length < 4 && (<Button startIcon={<PlusIcon />} color="primary" size="small" onClick={onAddPollOption}>Add another option</Button>)}
        </div>
      )}

      <style jsx>{`
        .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
});

PostFormFields.displayName = 'PostFormFields';
export default PostFormFields;