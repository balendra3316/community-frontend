import { memo } from 'react';
import { 
  TextField, 
  Typography, 
  IconButton, 
  Button 
} from '@mui/material';
import { 
  Close as CloseIcon,
  Add as PlusIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

interface PollOption {
  text: string;
}

interface YouTubeVideoInfo {
  thumbnail: string;
  title: string;
  url: string;
}

interface PostFormFieldsProps {
  title: string;
  content: string;
  titleWordCount: number;
  contentWordCount: number;
  errorMessage: string;
  selectedImage: File | null;
  imagePreview: string | null;
  youtubeVideo: YouTubeVideoInfo | null;
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
}

const PostFormFields = memo(({
  title,
  content,
  titleWordCount,
  contentWordCount,
  errorMessage,
  selectedImage,
  imagePreview,
  youtubeVideo,
  showPoll,
  pollOptions,
  containsBadWords,
  onTitleChange,
  onContentChange,
  onImageUpload,
  onRemoveImage,
  onRemoveYoutube,
  onPollOptionUpdate,
  onAddPollOption,
  onRemovePollOption,
  onCancelPoll
}: PostFormFieldsProps) => {
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageUpload(file, e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4">
      {/* Title Field */}
      <div className="relative">
        <TextField
          fullWidth
          placeholder="Title"
          variant="standard"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          InputProps={{
            disableUnderline: true,
            style: { fontSize: '1.125rem', fontWeight: 500 }
          }}
          className="mb-1"
        />
        <div 
          className={`text-right text-xs ${
            titleWordCount > 30 ? 'text-red-500' : 'text-gray-500'
          }`}
        >
          {titleWordCount}/30 words
        </div>
      </div>
      
      {/* Content Field */}
      <div className="relative mt-2">
        <TextField
          fullWidth
          multiline
          placeholder="Write something..."
          variant="standard"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          InputProps={{
            disableUnderline: true,
            style: { fontSize: '1rem' }
          }}
          minRows={4}
          maxRows={8}
          className="mb-1"
        />
        <div 
          className={`text-right text-xs ${
            contentWordCount > 200 ? 'text-red-500' : 'text-gray-500'
          }`}
        >
          {contentWordCount}/200 words
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="text-red-500 text-sm mt-2 mb-3">{errorMessage}</div>
      )}

      {/* Selected Image Preview */}
      {imagePreview && (
        <div className="relative mt-2 mb-2">
          <img 
            src={imagePreview} 
            alt="Selected" 
            className="max-h-40 rounded-md"
          />
          <IconButton 
            size="small"
            className="absolute top-1 right-1 bg-gray-800 bg-opacity-50 text-white"
            onClick={onRemoveImage}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
      )}

      {/* YouTube Video Preview */}
      {youtubeVideo && (
        <div className="relative mt-2 mb-2 border border-gray-200 rounded-md p-2">
          <div className="flex items-center">
            <img 
              src={youtubeVideo.thumbnail} 
              alt="YouTube Thumbnail" 
              className="w-32 h-24 rounded"
            />
            <div className="ml-2 flex-1">
              <Typography variant="subtitle2">{youtubeVideo.title}</Typography>
              <Typography variant="caption" color="textSecondary" className="truncate block">
                {youtubeVideo.url}
              </Typography>
            </div>
            <IconButton size="small" onClick={onRemoveYoutube}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
        </div>
      )}

      {/* Poll Options */}
      {showPoll && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center mb-2">
            <Typography variant="subtitle1">Poll</Typography>
            <Button 
              variant="text" 
              color="error" 
              size="small"
              onClick={onCancelPoll}
            >
              Cancel Poll
            </Button>
          </div>
          
          {pollOptions.map((option, index) => (
            <div key={index} className="mb-2 flex items-center">
              <TextField
                fullWidth
                placeholder={`Option ${index + 1}`}
                size="small"
                value={option.text}
                onChange={(e) => onPollOptionUpdate(index, e.target.value)}
                className="mr-2"
              />
              {pollOptions.length > 2 && (
                <IconButton 
                  size="small" 
                  color="error"
                  onClick={() => onRemovePollOption(index)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </div>
          ))}
          
          {pollOptions.length < 4 && (
            <Button
              startIcon={<PlusIcon />}
              color="primary"
              size="small"
              onClick={onAddPollOption}
            >
              Add another option
            </Button>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
        id="image-upload"
      />
    </div>
  );
});

PostFormFields.displayName = 'PostFormFields';

export default PostFormFields;