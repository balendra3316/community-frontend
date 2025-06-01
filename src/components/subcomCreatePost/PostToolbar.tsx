


import { memo, useState, useRef } from "react";
import { Button, IconButton, MenuItem, Menu } from "@mui/material";
import {
  AttachFile as PaperclipIcon,
  BarChart as BarChartIcon,
  YouTube as YoutubeIcon,
} from "@mui/icons-material";

interface PostToolbarProps {
  selectedCategory: string;
  categories: string[];
  onCategorySelect: (category: string) => void;
  onImageUpload: (file: File, preview: string) => void;
  onYoutubeClick: () => void;
  onPollClick: () => void;
  // Removed emoji-related props
}

const PostToolbar = memo(
  ({
    selectedCategory,
    categories,
    onCategorySelect,
    onImageUpload,
    onYoutubeClick,
    onPollClick,
    // Removed emoji props
  }: PostToolbarProps) => {
    const [anchorElCategory, setAnchorElCategory] =
      useState<null | HTMLElement>(null);
    const [anchorElMobileMenu, setAnchorElMobileMenu] =
      useState<null | HTMLElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleCategoryClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElCategory(event.currentTarget);
    };

    const handleCategoryClose = () => {
      setAnchorElCategory(null);
    };

    const handleCategorySelect = (category: string) => {
      onCategorySelect(category);
      handleCategoryClose();
    };

    const handleMobileMenuClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElMobileMenu(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
      setAnchorElMobileMenu(null);
    };

    return (
      <div className="border-t border-gray-200 p-4">
        <div className="flex flex-wrap items-center">
          {/* Tools - Desktop View */}
          <div className="hidden md:flex items-center space-x-6 py-2">
            <IconButton
              size="small"
              onClick={() => fileInputRef.current?.click()}
              title="Upload Image"
            >
              <PaperclipIcon fontSize="small" />
            </IconButton>

            <IconButton
              size="small"
              onClick={onYoutubeClick}
              title="Add YouTube Video"
            >
              <YoutubeIcon fontSize="small" />
            </IconButton>

            <IconButton size="small" onClick={onPollClick} title="Create Poll">
              <BarChartIcon fontSize="small" />
            </IconButton>

            {/* Removed emoji button */}
          </div>

          {/* Tools - Mobile View */}
          <div className="md:hidden flex items-center">
            <IconButton
              size="small"
              onClick={handleMobileMenuClick}
              title="More Options"
            >
              <PaperclipIcon fontSize="small" />
            </IconButton>

            <Menu
              anchorEl={anchorElMobileMenu}
              open={Boolean(anchorElMobileMenu)}
              onClose={handleMobileMenuClose}
            >
              <MenuItem
                onClick={() => {
                  fileInputRef.current?.click();
                  handleMobileMenuClose();
                }}
              >
                <PaperclipIcon fontSize="small" className="mr-2" /> Upload Image
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onYoutubeClick();
                  handleMobileMenuClose();
                }}
              >
                <YoutubeIcon fontSize="small" className="mr-2" /> YouTube Video
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onPollClick();
                  handleMobileMenuClose();
                }}
              >
                <BarChartIcon fontSize="small" className="mr-2" /> Create Poll
              </MenuItem>
              {/* Removed emoji menu item */}
            </Menu>
          </div>

          {/* Category Dropdown */}
          <div className="relative ml-auto">
            <Button
              variant="outlined"
              size="small"
              onClick={handleCategoryClick}
              className="text-gray-700"
              endIcon={<span>▼</span>}
            >
              {selectedCategory || "Select a category"}
            </Button>

            <Menu
              anchorEl={anchorElCategory}
              open={Boolean(anchorElCategory)}
              onClose={handleCategoryClose}
            >
              {categories.map((category) => (
                <MenuItem
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  selected={selectedCategory === category}
                >
                  {category}
                </MenuItem>
              ))}
            </Menu>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>
    );
  }
);

PostToolbar.displayName = "PostToolbar";

export default PostToolbar;