

// import { useState, useRef, useEffect } from 'react';
// import EmojiPicker from 'emoji-picker-react';
// import { 
//   Button, 
//   IconButton, 
//   TextField, 
//   Typography, 
//   MenuItem, 
//   Menu, 
//   Dialog, 
//   DialogActions, 
//   DialogContent, 
//   DialogTitle 
// } from '@mui/material';
// import { 
//   Close as CloseIcon,
//   AttachFile as PaperclipIcon,
//   BarChart as BarChartIcon,
//   EmojiEmotions as SmileIcon,
//   YouTube as YoutubeIcon,
//   Add as PlusIcon,
//   Delete as DeleteIcon
// } from '@mui/icons-material';

// interface CreatePostModalProps {
//   onClose: () => void;
// }

// interface PollOption {
//   text: string;
// }

// interface YouTubeVideoInfo {
//   thumbnail: string;
//   title: string;
//   url: string;
// }

// const CreatePostModal = ({ onClose }: CreatePostModalProps) => {
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [anchorElCategory, setAnchorElCategory] = useState<null | HTMLElement>(null);
//   const [anchorElEmoji, setAnchorElEmoji] = useState<null | HTMLElement>(null);
//   const [showYouTubeModal, setShowYouTubeModal] = useState(false);
//   const [youtubeUrl, setYoutubeUrl] = useState('');
//   const [youtubeVideo, setYoutubeVideo] = useState<YouTubeVideoInfo | null>(null);
//   const [showPoll, setShowPoll] = useState(false);
//   const [pollOptions, setPollOptions] = useState<PollOption[]>([{ text: '' }, { text: '' }]);
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [anchorElMobileMenu, setAnchorElMobileMenu] = useState<null | HTMLElement>(null);
  
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const modalRef = useRef<HTMLDivElement>(null);
//   const categories = ['DanceTips', 'SelfLove', 'Events'];

//   // Handle image upload
//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         if (e.target?.result) {
//           setSelectedImage(e.target.result as string);
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Handle YouTube link modal
//   const handleYouTubeSubmit = () => {
//     if (youtubeUrl) {
//       // Extract video ID from URL
//       const videoId = extractYouTubeVideoId(youtubeUrl);
      
//       if (videoId) {
//         // Create video info with actual thumbnail URL
//         setYoutubeVideo({
//           thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
//           title: "YouTube Video",
//           url: youtubeUrl
//         });
//         setShowYouTubeModal(false);
//         setYoutubeUrl('');
//       }
//     }
//   };

//   // Extract YouTube video ID from URL
//   const extractYouTubeVideoId = (url: string) => {
//     const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
//     const match = url.match(regExp);
//     return (match && match[2].length === 11) ? match[2] : null;
//   };

//   // Handle emoji selection
//   const handleEmojiSelect = (emojiData: any) => {
//     setContent(prevContent => prevContent + emojiData.emoji);
//     setAnchorElEmoji(null);
//   };

//   // Handle poll options
//   const updatePollOption = (index: number, text: string) => {
//     const updatedOptions = [...pollOptions];
//     updatedOptions[index].text = text;
//     setPollOptions(updatedOptions);
//   };

//   const addPollOption = () => {
//     if (pollOptions.length < 4) {
//       setPollOptions([...pollOptions, { text: '' }]);
//     }
//   };

//   const removePollOption = (index: number) => {
//     if (pollOptions.length > 2) {
//       const updatedOptions = [...pollOptions];
//       updatedOptions.splice(index, 1);
//       setPollOptions(updatedOptions);
//     }
//   };

//   const cancelPoll = () => {
//     setShowPoll(false);
//     setPollOptions([{ text: '' }, { text: '' }]);
//   };

//   // Handle post submission
//   const handleSubmit = () => {
//     // Add logic to submit the post
//     console.log({ 
//       title, 
//       content, 
//       category: selectedCategory,
//       image: selectedImage,
//       youtubeVideo,
//       pollOptions: showPoll ? pollOptions : undefined
//     });
//     onClose();
//   };

//   const isPostButtonEnabled = title.trim() !== '' && content.trim() !== '' && selectedCategory !== '';

//   // Menu handling
//   const handleCategoryClick = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorElCategory(event.currentTarget);
//   };

//   const handleCategoryClose = () => {
//     setAnchorElCategory(null);
//   };

//   const handleCategorySelect = (category: string) => {
//     setSelectedCategory(category);
//     handleCategoryClose();
//   };

//   const handleEmojiClick = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorElEmoji(event.currentTarget);
//   };

//   const handleEmojiClose = () => {
//     setAnchorElEmoji(null);
//   };

//   const handleMobileMenuClick = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorElMobileMenu(event.currentTarget);
//   };

//   const handleMobileMenuClose = () => {
//     setAnchorElMobileMenu(null);
//   };

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto bg-[rgba(144,144,144,0.6)] bg-opacity-75">
//       {/* Modal */}
//       <div 
//         ref={modalRef}
//         className="relative bg-white max-w-lg mx-auto mt-10 md:mt-20 rounded-lg shadow-xl"
//       >
//         {/* Header */}
//         <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
//           <div className="flex items-center">
//             <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden">
//               <img
//                 src="/api/placeholder/32/32"
//                 alt="User Profile"
//                 className="h-full w-full object-cover"
//               />
//             </div>
//             <Typography variant="body1" className="ml-2">
//               Tiru Sameer Yarlagadda
//             </Typography>
//             <Typography variant="body2" color="textSecondary" className="ml-2">
//               posting in
//             </Typography>
//             <Typography variant="body2" color="primary" className="ml-1 font-medium">
//               Andynocode
//             </Typography>
//           </div>
//           <IconButton size="small" onClick={onClose}>
//             <CloseIcon fontSize="small" />
//           </IconButton>
//         </div>
        
//         {/* Content */}
//         <div className="p-4">
//           <TextField
//             fullWidth
//             placeholder="Title"
//             variant="standard"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             InputProps={{
//               disableUnderline: true,
//               style: { fontSize: '1.125rem', fontWeight: 500 }
//             }}
//             className="mb-3"
//           />
          
//           <TextField
//             fullWidth
//             multiline
//             placeholder="Write something..."
//             variant="standard"
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             InputProps={{
//               disableUnderline: true,
//               style: { fontSize: '1rem' }
//             }}
//             minRows={4}
//             maxRows={8}
//             className="mb-3"
//           />

//           {/* Selected Image Preview */}
//           {selectedImage && (
//             <div className="relative mt-2 mb-2">
//               <img 
//                 src={selectedImage} 
//                 alt="Selected" 
//                 className="max-h-40 rounded-md"
//               />
//               <IconButton 
//                 size="small"
//                 className="absolute top-1 right-1 bg-gray-800 bg-opacity-50 text-white"
//                 onClick={() => setSelectedImage(null)}
//               >
//                 <CloseIcon fontSize="small" />
//               </IconButton>
//             </div>
//           )}

//           {/* YouTube Video Preview */}
//           {youtubeVideo && (
//             <div className="relative mt-2 mb-2 border border-gray-200 rounded-md p-2">
//               <div className="flex items-center">
//                 <img 
//                   src={youtubeVideo.thumbnail} 
//                   alt="YouTube Thumbnail" 
//                   className="w-32 h-24 rounded"
//                 />
//                 <div className="ml-2 flex-1">
//                   <Typography variant="subtitle2">{youtubeVideo.title}</Typography>
//                   <Typography variant="caption" color="textSecondary" className="truncate block">
//                     {youtubeVideo.url}
//                   </Typography>
//                 </div>
//                 <IconButton size="small" onClick={() => setYoutubeVideo(null)}>
//                   <CloseIcon fontSize="small" />
//                 </IconButton>
//               </div>
//             </div>
//           )}

//           {/* Poll Options */}
//           {showPoll && (
//             <div className="mt-4 border-t border-gray-200 pt-4">
//               <div className="flex justify-between items-center mb-2">
//                 <Typography variant="subtitle1">Poll</Typography>
//                 <Button 
//                   variant="text" 
//                   color="error" 
//                   size="small"
//                   onClick={cancelPoll}
//                 >
//                   Cancel Poll
//                 </Button>
//               </div>
              
//               {pollOptions.map((option, index) => (
//                 <div key={index} className="mb-2 flex items-center">
//                   <TextField
//                     fullWidth
//                     placeholder={`Option ${index + 1}`}
//                     size="small"
//                     value={option.text}
//                     onChange={(e) => updatePollOption(index, e.target.value)}
//                     className="mr-2"
//                   />
//                   {pollOptions.length > 2 && (
//                     <IconButton 
//                       size="small" 
//                       color="error"
//                       onClick={() => removePollOption(index)}
//                     >
//                       <DeleteIcon fontSize="small" />
//                     </IconButton>
//                   )}
//                 </div>
//               ))}
              
//               {pollOptions.length < 4 && (
//                 <Button
//                   startIcon={<PlusIcon />}
//                   color="primary"
//                   size="small"
//                   onClick={addPollOption}
//                 >
//                   Add another option
//                 </Button>
//               )}
//             </div>
//           )}
//         </div>
        
//         {/* Footer with tools */}
//         <div className="border-t border-gray-200 p-4">
//           <div className="flex flex-wrap items-center">
//             {/* Tools - Desktop View */}
//             <div className="hidden md:flex items-center space-x-6 py-2">
//               <IconButton 
//                 size="small"
//                 onClick={() => fileInputRef.current?.click()}
//               >
//                 <PaperclipIcon fontSize="small" />
//               </IconButton>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 accept="image/*"
//                 className="hidden"
//                 onChange={handleImageUpload}
//               />
//               <IconButton 
//                 size="small"
//                 onClick={() => setShowYouTubeModal(true)}
//               >
//                 <YoutubeIcon fontSize="small" />
//               </IconButton>
//               <IconButton 
//                 size="small"
//                 onClick={() => setShowPoll(!showPoll)}
//               >
//                 <BarChartIcon fontSize="small" />
//               </IconButton>
//               <IconButton 
//                 size="small"
//                 onClick={handleEmojiClick}
//               >
//                 <SmileIcon fontSize="small" />
//               </IconButton>
//             </div>

//             {/* Tools - Mobile View */}
//             <div className="md:hidden flex items-center">
//               <IconButton 
//                 size="small"
//                 onClick={handleMobileMenuClick}
//               >
//                 <PaperclipIcon fontSize="small" />
//               </IconButton>
              
//               <Menu
//                 anchorEl={anchorElMobileMenu}
//                 open={Boolean(anchorElMobileMenu)}
//                 onClose={handleMobileMenuClose}
//               >
//                 <MenuItem onClick={() => {
//                   fileInputRef.current?.click();
//                   handleMobileMenuClose();
//                 }}>
//                   <PaperclipIcon fontSize="small" className="mr-2" /> Upload Image
//                 </MenuItem>
//                 <MenuItem onClick={() => {
//                   setShowYouTubeModal(true);
//                   handleMobileMenuClose();
//                 }}>
//                   <YoutubeIcon fontSize="small" className="mr-2" /> YouTube Video
//                 </MenuItem>
//                 <MenuItem onClick={() => {
//                   setShowPoll(!showPoll);
//                   handleMobileMenuClose();
//                 }}>
//                   <BarChartIcon fontSize="small" className="mr-2" /> Create Poll
//                 </MenuItem>
//                 <MenuItem onClick={() => {
//                   handleEmojiClick(event as unknown as React.MouseEvent<HTMLElement>);
//                   handleMobileMenuClose();
//                 }}>
//                   <SmileIcon fontSize="small" className="mr-2" /> Emoji
//                 </MenuItem>
//               </Menu>
//             </div>
            
//             {/* Emoji Picker */}
//             <Menu
//               anchorEl={anchorElEmoji}
//               open={Boolean(anchorElEmoji)}
//               onClose={handleEmojiClose}
//             >
//               <div className="p-2">
//                 <EmojiPicker onEmojiClick={handleEmojiSelect} />
//               </div>
//             </Menu>
            
//             {/* Category Dropdown */}
//             <div className="relative ml-auto">
//               <Button
//                 variant="outlined"
//                 size="small"
//                 onClick={handleCategoryClick}
//                 className="text-gray-700"
//                 endIcon={<span>▼</span>}
//               >
//                 {selectedCategory || 'Select a category'}
//               </Button>
              
//               <Menu
//                 anchorEl={anchorElCategory}
//                 open={Boolean(anchorElCategory)}
//                 onClose={handleCategoryClose}
//               >
//                 {categories.map(category => (
//                   <MenuItem 
//                     key={category}
//                     onClick={() => handleCategorySelect(category)}
//                   >
//                     {category}
//                   </MenuItem>
//                 ))}
//               </Menu>
//             </div>
//           </div>
          
//           {/* Action Buttons */}
//           <div className="flex justify-end mt-4 space-x-2">
//             <Button
//               variant="outlined"
//               color="inherit"
//               size="small"
//               onClick={onClose}
//             >
//               CANCEL
//             </Button>
//             <Button
//               variant="contained"
//               color="primary"
//               size="small"
//               disabled={!isPostButtonEnabled}
//               onClick={handleSubmit}
//             >
//               POST
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* YouTube URL Modal */}
//       <Dialog 
//         open={showYouTubeModal} 
//         onClose={() => setShowYouTubeModal(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>
//           <div className="flex justify-between items-center">
//             <Typography variant="h6">Add YouTube Video</Typography>
//             <IconButton size="small" onClick={() => setShowYouTubeModal(false)}>
//               <CloseIcon fontSize="small" />
//             </IconButton>
//           </div>
//         </DialogTitle>
//         <DialogContent>
//           <TextField
//             fullWidth
//             label="YouTube URL"
//             placeholder="Paste YouTube URL here"
//             value={youtubeUrl}
//             onChange={(e) => setYoutubeUrl(e.target.value)}
//             margin="dense"
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setShowYouTubeModal(false)} color="inherit">
//             Cancel
//           </Button>
//           <Button 
//             onClick={handleYouTubeSubmit}
//             color="primary"
//             disabled={!youtubeUrl}
//           >
//             Add
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default CreatePostModal;





import { useState, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { 
  Button, 
  IconButton, 
  TextField, 
  Typography, 
  MenuItem, 
  Menu, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle,
  CircularProgress
} from '@mui/material';
import { 
  Close as CloseIcon,
  AttachFile as PaperclipIcon,
  BarChart as BarChartIcon,
  EmojiEmotions as SmileIcon,
  YouTube as YoutubeIcon,
  Add as PlusIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { createPost } from '../services/postService';
import { useAuth } from '../context/AuthContext';

interface CreatePostModalProps {
  onClose: () => void;
  onPostCreated?: () => void;
}

interface PollOption {
  text: string;
}

interface YouTubeVideoInfo {
  thumbnail: string;
  title: string;
  url: string;
}

const CreatePostModal = ({ onClose, onPostCreated }: CreatePostModalProps) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [anchorElCategory, setAnchorElCategory] = useState<null | HTMLElement>(null);
  const [anchorElEmoji, setAnchorElEmoji] = useState<null | HTMLElement>(null);
  const [showYouTubeModal, setShowYouTubeModal] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeVideo, setYoutubeVideo] = useState<YouTubeVideoInfo | null>(null);
  const [showPoll, setShowPoll] = useState(false);
  const [pollOptions, setPollOptions] = useState<PollOption[]>([{ text: '' }, { text: '' }]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [anchorElMobileMenu, setAnchorElMobileMenu] = useState<null | HTMLElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const categories = ['DanceTips', 'SelfLove', 'Events'];

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle YouTube link modal
  const handleYouTubeSubmit = () => {
    if (youtubeUrl) {
      // Extract video ID from URL
      const videoId = extractYouTubeVideoId(youtubeUrl);
      
      if (videoId) {
        // Create video info with actual thumbnail URL
        setYoutubeVideo({
          thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          title: "YouTube Video",
          url: youtubeUrl
        });
        setShowYouTubeModal(false);
        setYoutubeUrl('');
      }
    }
  };

  // Extract YouTube video ID from URL
  const extractYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Handle emoji selection
  const handleEmojiSelect = (emojiData: any) => {
    setContent(prevContent => prevContent + emojiData.emoji);
    setAnchorElEmoji(null);
  };

  // Handle poll options
  const updatePollOption = (index: number, text: string) => {
    const updatedOptions = [...pollOptions];
    updatedOptions[index].text = text;
    setPollOptions(updatedOptions);
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, { text: '' }]);
    }
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      const updatedOptions = [...pollOptions];
      updatedOptions.splice(index, 1);
      setPollOptions(updatedOptions);
    }
  };

  const cancelPoll = () => {
    setShowPoll(false);
    setPollOptions([{ text: '' }, { text: '' }]);
  };

  // Handle post submission
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setErrorMessage('');
      
      // Prepare form data
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      
      // Add tags (using category as a tag)
      if (selectedCategory) {
        formData.append('tags', selectedCategory);
      }
      
      // Add image if selected
      if (selectedImage) {
        formData.append('image', selectedImage);
      }
      
      // Add YouTube link if provided
      if (youtubeVideo) {
        formData.append('youtubeLink', youtubeVideo.url);
      }
      
      // Add poll options if created
      if (showPoll && pollOptions.some(option => option.text.trim() !== '')) {
        const validOptions = pollOptions
          .filter(option => option.text.trim() !== '')
          .map(option => option.text);
          
        if (validOptions.length >= 2) {
          formData.append('poll', JSON.stringify(validOptions));
        }
      }
      
      // Send the data to the server
      await createPost(formData);
      
      // Close modal and refresh posts
      if (onPostCreated) {
        onPostCreated();
      }
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
      setErrorMessage('Failed to create post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isPostButtonEnabled = !submitting && title.trim() !== '' && content.trim() !== '' && selectedCategory !== '';

  // Menu handling
  const handleCategoryClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElCategory(event.currentTarget);
  };

  const handleCategoryClose = () => {
    setAnchorElCategory(null);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    handleCategoryClose();
  };

  const handleEmojiClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElEmoji(event.currentTarget);
  };

  const handleEmojiClose = () => {
    setAnchorElEmoji(null);
  };

  const handleMobileMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElMobileMenu(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setAnchorElMobileMenu(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[rgba(144,144,144,0.6)] bg-opacity-75">
      {/* Modal */}
      <div className="relative bg-white max-w-lg mx-auto mt-10 md:mt-20 rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden">
              <img
                src={user?.avatar || "/api/placeholder/32/32"}
                alt="User Profile"
                className="h-full w-full object-cover"
              />
            </div>
            <Typography variant="body1" className="ml-2">
              {user?.name || "User"}
            </Typography>
            <Typography variant="body2" color="textSecondary" className="ml-2">
              posting in
            </Typography>
            <Typography variant="body2" color="primary" className="ml-1 font-medium">
              Andynocode
            </Typography>
          </div>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <TextField
            fullWidth
            placeholder="Title"
            variant="standard"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            InputProps={{
              disableUnderline: true,
              style: { fontSize: '1.125rem', fontWeight: 500 }
            }}
            className="mb-3"
          />
          
          <TextField
            fullWidth
            multiline
            placeholder="Write something..."
            variant="standard"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            InputProps={{
              disableUnderline: true,
              style: { fontSize: '1rem' }
            }}
            minRows={4}
            maxRows={8}
            className="mb-3"
          />

          {/* Error Message */}
          {errorMessage && (
            <div className="text-red-500 text-sm mb-3">{errorMessage}</div>
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
                onClick={() => {
                  setSelectedImage(null);
                  setImagePreview(null);
                }}
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
                <IconButton size="small" onClick={() => setYoutubeVideo(null)}>
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
                  onClick={cancelPoll}
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
                    onChange={(e) => updatePollOption(index, e.target.value)}
                    className="mr-2"
                  />
                  {pollOptions.length > 2 && (
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => removePollOption(index)}
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
                  onClick={addPollOption}
                >
                  Add another option
                </Button>
              )}
            </div>
          )}
        </div>
        
        {/* Footer with tools */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex flex-wrap items-center">
            {/* Tools - Desktop View */}
            <div className="hidden md:flex items-center space-x-6 py-2">
              <IconButton 
                size="small"
                onClick={() => fileInputRef.current?.click()}
              >
                <PaperclipIcon fontSize="small" />
              </IconButton>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <IconButton 
                size="small"
                onClick={() => setShowYouTubeModal(true)}
              >
                <YoutubeIcon fontSize="small" />
              </IconButton>
              <IconButton 
                size="small"
                onClick={() => setShowPoll(!showPoll)}
              >
                <BarChartIcon fontSize="small" />
              </IconButton>
              <IconButton 
                size="small"
                onClick={handleEmojiClick}
              >
                <SmileIcon fontSize="small" />
              </IconButton>
            </div>

            {/* Tools - Mobile View */}
            <div className="md:hidden flex items-center">
              <IconButton 
                size="small"
                onClick={handleMobileMenuClick}
              >
                <PaperclipIcon fontSize="small" />
              </IconButton>
              
              <Menu
                anchorEl={anchorElMobileMenu}
                open={Boolean(anchorElMobileMenu)}
                onClose={handleMobileMenuClose}
              >
                <MenuItem onClick={() => {
                  fileInputRef.current?.click();
                  handleMobileMenuClose();
                }}>
                  <PaperclipIcon fontSize="small" className="mr-2" /> Upload Image
                </MenuItem>
                <MenuItem onClick={() => {
                  setShowYouTubeModal(true);
                  handleMobileMenuClose();
                }}>
                  <YoutubeIcon fontSize="small" className="mr-2" /> YouTube Video
                </MenuItem>
                <MenuItem onClick={() => {
                  setShowPoll(!showPoll);
                  handleMobileMenuClose();
                }}>
                  <BarChartIcon fontSize="small" className="mr-2" /> Create Poll
                </MenuItem>
                <MenuItem onClick={() => {
                  handleEmojiClick(event as unknown as React.MouseEvent<HTMLElement>);
                  handleMobileMenuClose();
                }}>
                  <SmileIcon fontSize="small" className="mr-2" /> Emoji
                </MenuItem>
              </Menu>
            </div>
            
            {/* Emoji Picker */}
            <Menu
              anchorEl={anchorElEmoji}
              open={Boolean(anchorElEmoji)}
              onClose={handleEmojiClose}
            >
              <div className="p-2">
                <EmojiPicker onEmojiClick={handleEmojiSelect} />
              </div>
            </Menu>
            
            {/* Category Dropdown */}
            <div className="relative ml-auto">
              <Button
                variant="outlined"
                size="small"
                onClick={handleCategoryClick}
                className="text-gray-700"
                endIcon={<span>▼</span>}
              >
                {selectedCategory || 'Select a category'}
              </Button>
              
              <Menu
                anchorEl={anchorElCategory}
                open={Boolean(anchorElCategory)}
                onClose={handleCategoryClose}
              >
                {categories.map(category => (
                  <MenuItem 
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end mt-4 space-x-2">
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              onClick={onClose}
              disabled={submitting}
            >
              CANCEL
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              disabled={!isPostButtonEnabled}
              onClick={handleSubmit}
            >
              {submitting ? <CircularProgress size={24} /> : 'POST'}
            </Button>
          </div>
        </div>
      </div>

      {/* YouTube URL Modal */}
      <Dialog 
        open={showYouTubeModal} 
        onClose={() => setShowYouTubeModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <div className="flex justify-between items-center">
            <Typography variant="h6">Add YouTube Video</Typography>
            <IconButton size="small" onClick={() => setShowYouTubeModal(false)}>
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowYouTubeModal(false)} color="inherit">
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
    </div>
  );
};

export default CreatePostModal;