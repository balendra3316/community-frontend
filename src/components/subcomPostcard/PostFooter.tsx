
import React, { memo } from "react";
import { ThumbsUp, MessageSquare, Clock } from "lucide-react";

interface PostFooterProps {
  isLiked: boolean;
  currentLikeCount: number;
  totalComments: number |undefined;
  lastCommentTime?: string;
  onLike: (e: React.MouseEvent) => void;
  isLiking: boolean;
  user: any;
}

const formatLastCommentTime = (lastCommentDate: string | null | undefined): string => {
  if (!lastCommentDate) return "";

  const commentDate = new Date(lastCommentDate);
  const now = new Date();
  const diffTime = now.getTime() - commentDate.getTime();
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 3) {
    if (diffHours < 1) return "New comment just now";
    if (diffHours < 24) return `New comment ${diffHours}h ago`;
    return `New comment ${diffDays}d ago`;
  }

  const month = commentDate.toLocaleString("en-US", { month: "short" });
  const day = commentDate.getDate();
  
  if (commentDate.getFullYear() !== now.getFullYear()) {
    return `Last comment ${day} ${month} ${commentDate.getFullYear()}`;
  }

  return `Last comment ${day} ${month}`;
};

export const PostFooter = memo(({
  isLiked,
  currentLikeCount,
  totalComments,
  lastCommentTime,
  onLike,
  isLiking,
  user,
}: PostFooterProps) => {
  const lastCommentTimeFormatted = formatLastCommentTime(lastCommentTime);

  return (
    <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-100">
      <div className="flex items-center space-x-4">
        <button
          className={`flex items-center ${
            isLiked ? "text-blue-600" : "text-gray-500"
          } hover:text-blue-600 transition-colors duration-200`}
          onClick={onLike}
          disabled={!user || isLiking}
        >
          <ThumbsUp
            size={16}
            className={`mr-1 ${isLiking ? "animate-pulse" : ""}`}
            fill={isLiked ? "currentColor" : "none"}
          />
          <span>{currentLikeCount}</span>
        </button>
        <div className="flex items-center text-gray-500">
          <MessageSquare size={16} className="mr-1" />
          <span>{totalComments || 0}</span>
        </div>

        {lastCommentTimeFormatted && (
          <div className="flex items-center text-blue-950">
            <Clock size={16} className="mr-1" />
            <span className="text-xs text-blue-900 font-bold">
              {lastCommentTimeFormatted}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});