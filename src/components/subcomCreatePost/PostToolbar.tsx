

import { memo, useState, useRef } from "react";
import { Button, IconButton, MenuItem, Menu } from "@mui/material";
import {
  AttachFile as PaperclipIcon,
  BarChart as BarChartIcon,
  YouTube as YoutubeIcon,
  Link as LinkIcon,
  Videocam as VideocamIcon,
  // **Import the emoji icon to be used in the toolbar.**
  EmojiEmotions as EmojiIcon,
} from "@mui/icons-material";

interface PostToolbarProps {
  selectedCategory: string;
  categories: string[];
  onCategorySelect: (category: string) => void;
  onImageUpload: (file: File, preview: string) => void;
  onVideoUpload: (file: File) => void;
  onYoutubeClick: () => void;
  onLinkClick: () => void;
  onPollClick: () => void;
  // **Add a new prop for the single emoji click handler.**
  onEmojiClick: () => void;
}

const PostToolbar = memo(
  ({
    selectedCategory,
    categories,
    onCategorySelect,
    onImageUpload,
    onVideoUpload,
    onYoutubeClick,
    onLinkClick,
    onPollClick,
    // **Destructure the new prop.**
    onEmojiClick,
  }: PostToolbarProps) => {
    const [anchorElCategory, setAnchorElCategory] = useState<null | HTMLElement>(null);
    const [anchorElMobileMenu, setAnchorElMobileMenu] = useState<null | HTMLElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => onImageUpload(file, e.target?.result as string);
        reader.readAsDataURL(file);
      }
      e.target.value = '';
    };
    
    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onVideoUpload(file);
      }
      e.target.value = '';
    };

    const handleCategoryClick = (event: React.MouseEvent<HTMLElement>) => setAnchorElCategory(event.currentTarget);
    const handleCategoryClose = () => setAnchorElCategory(null);
    const handleCategorySelect = (category: string) => {
      onCategorySelect(category);
      handleCategoryClose();
    };
    const handleMobileMenuClick = (event: React.MouseEvent<HTMLElement>) => setAnchorElMobileMenu(event.currentTarget);
    const handleMobileMenuClose = () => setAnchorElMobileMenu(null);

    return (
      <div className="border-t border-gray-200 p-4">
        <div className="flex flex-wrap items-center">
          {/* Tools - Desktop View */}
          <div className="hidden md:flex items-center space-x-6 py-2">
            <IconButton size="small" onClick={() => imageInputRef.current?.click()} title="Upload Image"><PaperclipIcon fontSize="small" /></IconButton>
            <IconButton size="small" onClick={() => videoInputRef.current?.click()} title="Upload Video"><VideocamIcon fontSize="small" /></IconButton>
            <IconButton size="small" onClick={onYoutubeClick} title="Add YouTube Video"><YoutubeIcon fontSize="small" /></IconButton>
            <IconButton size="small" onClick={onLinkClick} title="Add Link"><LinkIcon fontSize="small" /></IconButton>
            <IconButton size="small" onClick={onPollClick} title="Create Poll"><BarChartIcon fontSize="small" /></IconButton>
            {/* **Add the single emoji button to the desktop toolbar** */}
            <IconButton size="small" onClick={onEmojiClick} title="Add Emoji"><EmojiIcon fontSize="small" /></IconButton>
          </div>

          {/* Tools - Mobile View */}
          <div className="md:hidden flex items-center">
            <IconButton size="small" onClick={handleMobileMenuClick} title="More Options"><PaperclipIcon fontSize="small" /></IconButton>
            <IconButton size="small" onClick={onEmojiClick} title="Add Emoji"><EmojiIcon fontSize="small" /></IconButton>
            <Menu anchorEl={anchorElMobileMenu} open={Boolean(anchorElMobileMenu)} onClose={handleMobileMenuClose}>
              <MenuItem onClick={() => { imageInputRef.current?.click(); handleMobileMenuClose(); }}><PaperclipIcon fontSize="small" className="mr-2" /> Upload Image</MenuItem>
              <MenuItem onClick={() => { videoInputRef.current?.click(); handleMobileMenuClose(); }}><VideocamIcon fontSize="small" className="mr-2" /> Upload Video</MenuItem>
              <MenuItem onClick={() => { onYoutubeClick(); handleMobileMenuClose(); }}><YoutubeIcon fontSize="small" className="mr-2" /> YouTube Video</MenuItem>
              <MenuItem onClick={() => { onLinkClick(); handleMobileMenuClose(); }}><LinkIcon fontSize="small" className="mr-2" /> Add Link</MenuItem>
              <MenuItem onClick={() => { onPollClick(); handleMobileMenuClose(); }}><BarChartIcon fontSize="small" className="mr-2" /> Create Poll</MenuItem>
              
              {/* <MenuItem onClick={() => { onEmojiClick(); handleMobileMenuClose(); }}><EmojiIcon fontSize="small" className="mr-2" /> Add Emoji</MenuItem> */}
            </Menu>
          </div>

          {/* Category Dropdown */}
         <div className="relative ml-auto">
            <Button variant="outlined" size="small" onClick={handleCategoryClick} className="text-gray-700" endIcon={<span>▼</span>}>
              {selectedCategory || "Select a category"}
            </Button>
            <Menu anchorEl={anchorElCategory} open={Boolean(anchorElCategory)} onClose={handleCategoryClose}>
              {categories.map((category) => (
                <MenuItem key={category} onClick={() => handleCategorySelect(category)} selected={selectedCategory === category}>
                  {category}
                </MenuItem>
              ))}
            </Menu>
          </div>
        </div>

        {/* Hidden file inputs */}
        <input type="file" ref={imageInputRef} accept="image/*" className="hidden" onChange={handleImageUpload} />
        <input type="file" ref={videoInputRef} accept="video/mp4,video/quicktime,video/webm" className="hidden" onChange={handleVideoUpload} />
      </div>
    );
  }
);

PostToolbar.displayName = "PostToolbar";
export default PostToolbar;