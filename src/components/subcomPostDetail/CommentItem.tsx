


"use client";
import { MoreVertical, ThumbsUp, Trash } from "lucide-react";
import { Comment } from "../../services/commentService";
import { User } from "../../context/AuthContext";
import { useCommentState, useCommentStateDispatch } from "../../types/CommentStateContext";

// UPDATED PROPS INTERFACE
interface CommentItemProps {
  comment: Comment;
  user: User | null;
  isReply: boolean;
  formatRelativeTime: (timestamp: string) => string;
  showActionMenu: string | null;
  setShowActionMenu: (id: string | null) => void;
  onReply: (comment: Comment) => void;
  onDelete: (commentId: string) => void;
  onLike: (commentId: string) => void;
}

export default function CommentItem({
  comment,
  user,
  isReply,
  formatRelativeTime,
  showActionMenu,
  setShowActionMenu,
  onReply,
  onDelete,
  onLike,
}: CommentItemProps) {
  const { likedComments, likeCounts } = useCommentState();
  const { toggleLike } = useCommentStateDispatch();

  const isLiked = likedComments[comment._id] ?? (user ? comment.likes.includes(user._id) : false);
  const currentLikeCount = likeCounts[comment._id] ?? comment.likes.length;

  const handleLike = () => {
    if (!user) return;
    toggleLike(comment._id, comment.likes, user._id);
    onLike(comment._id);
  };

  return (
    <div className={`${isReply ? "ml-8" : ""} bg-gray-50 rounded-lg p-3 relative`}>
      <div className="flex items-start">
        <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
          <img
            src={comment.author.avatar || "/api/placeholder/40/40"}
            alt={comment.author.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="ml-2 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-sm">{comment.author.name}</span>
              {comment.author.badges && comment.author.badges.length > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full">
                  {comment.author.badges.length}
                </span>
              )}
              <span className="text-xs text-gray-500 ml-2">
                {formatRelativeTime(comment.createdAt)}
              </span>
            </div>
            {user && comment.author._id === user._id && (
              <div className="relative">
                <button
                  onClick={() => setShowActionMenu(showActionMenu === comment._id ? null : comment._id)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <MoreVertical size={16} />
                </button>
                {showActionMenu === comment._id && (
                  <div className="absolute right-0 top-full mt-1 bg-white shadow-lg rounded-md z-10 w-32">
                    <button
                      onClick={() => onDelete(comment._id)}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <Trash size={14} className="mr-2" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <p className="text-sm my-2 whitespace-pre-wrap">{comment.content}</p>
          <div className="flex items-center text-xs text-gray-500 mt-2">
            <button
              className={`flex items-center mr-4 ${isLiked ? "text-blue-600" : ""}`}
              onClick={handleLike}
            >
              <ThumbsUp size={14} className={`mr-1 ${isLiked ? "fill-current" : ""}`} />
              <span>{currentLikeCount}</span>
            </button>
            <button
              className="hover:text-gray-700 mr-4"
              onClick={() => onReply(comment)}
            >
              Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}