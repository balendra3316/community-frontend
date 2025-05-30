// src/app/community/_components/CreatePostSection.tsx

import React from "react";
import { Avatar } from "@mui/material";

interface CreatePostSectionProps {
  user: any;
  onCreateClick: () => void;
}

export default function CreatePostSection({ user, onCreateClick }: CreatePostSectionProps) {
  return (
    <div
      className="bg-white rounded-xl mb-6 p-3 sm:p-4 transition-all duration-200 hover:shadow-lg cursor-pointer"
      style={{
        boxShadow:
          "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
        border: "1px solid rgb(229, 231, 235)",
      }}
      onClick={onCreateClick}
    >
      <div className="flex items-center gap-1">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Avatar
            src={user?.avatar}
            alt={user?.name?.charAt(0).toUpperCase() || "U"}
            className="h-9 w-9 sm:h-10 sm:w-10 bg-gradient-to-br from-blue-500 to-purple-600"
            sx={{ 
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'white'
            }}
          />
        </div>

        {/* Input Field */}
        <div className="flex-1 bg-gray-50 hover:bg-gray-100 rounded-full px-4 py-2.5 sm:py-3 transition-colors duration-200">
          <span className="text-gray-500 text-sm sm:text-base font-medium">
            Write something...
          </span>
        </div>

        {/* Optional: Add Post Button (like Skool) */}
        <div className="hidden sm:flex">
          <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200">
            Post
          </button>
        </div>
      </div>
    </div>
  );
}