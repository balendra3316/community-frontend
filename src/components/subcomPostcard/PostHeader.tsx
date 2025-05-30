// components/PostHeader.tsx
import React, { memo } from "react";
import { MoreVertical } from "lucide-react";
import { Avatar } from "@mui/material";

interface PostHeaderProps {
  author: {
    _id: string;
    name: string;
    avatar?: string;
    badges?: any[];
  };
  createdAt: string;
  isPinned?: boolean;
  tags?: string[];
  isOwnPost: boolean | null;
  showMenu: boolean;
  onToggleMenu: (e: React.MouseEvent) => void;
  onDeleteClick: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";
  if (diffDays < 30) return `${diffDays}d`;
  
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export const PostHeader = memo(({
  author,
  createdAt,
  isPinned,
  tags,
  isOwnPost,
  showMenu,
  onToggleMenu,
  onDeleteClick,
}: PostHeaderProps) => (
  <div className="flex items-center mb-3">
    <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
      <Avatar
        src={author.avatar}
        alt={author.name?.charAt(0).toUpperCase()}
        className="h-full w-full bg-gray-300"
      />
    </div>
    <div className="ml-3 flex-1">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center">
            <span className="font-medium">{author.name}</span>
            {author.badges && author.badges.length > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                {author.badges.length}
              </span>
            )}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <span>{formatDate(createdAt)}</span>
            {isPinned && (
              <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full flex items-center">
                📌 Pinned
              </span>
            )}
            {tags && tags.length > 0 && (
              <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-5 py-0.5 rounded-full">
                {tags[0]}
              </span>
            )}
          </div>
        </div>

        {isOwnPost && (
          <div className="relative">
            <button
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              onClick={onToggleMenu}
            >
              <MoreVertical size={18} className="text-gray-500" />
            </button>

            {showMenu && (
              <div
                className="absolute right-0 top-8 w-36 bg-white shadow-lg rounded-md border border-gray-200 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="p-2 hover:bg-gray-100 cursor-pointer flex items-center text-gray-700"
                  onClick={onDeleteClick}
                >
                  <span>Delete Post</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
));