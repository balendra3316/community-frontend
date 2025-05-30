"use client"
import { createContext, useContext, useState, ReactNode } from 'react';
import { Comment } from '../services/commentService';

// Define the structure of our comment state
interface CommentState {
  likedComments: Record<string, boolean>;
  likeCounts: Record<string, number>;
}

// Define the dispatch actions
interface CommentStateDispatch {
  setLikedComments: (update: React.SetStateAction<Record<string, boolean>>) => void;
  setLikeCounts: (update: React.SetStateAction<Record<string, number>>) => void;
  toggleLike: (commentId: string, currentLikes: string[], userId: string | undefined) => void;
  initializeCommentState: (comments: Comment[], userId: string | undefined) => void;
}

// Create the contexts
const CommentStateContext = createContext<CommentState | undefined>(undefined);
const CommentStateDispatchContext = createContext<CommentStateDispatch | undefined>(undefined);

// Create a provider component
export function CommentStateProvider({ children }: { children: ReactNode }) {
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});

  // Function to initialize comment state from server data
  const initializeCommentState = (comments: Comment[], userId: string | undefined) => {
    if (!userId) return;

    const newLikedComments: Record<string, boolean> = {};
    const newLikeCounts: Record<string, number> = {};

    // Process top-level comments
    comments.forEach(comment => {
      // Set likes for main comment
      newLikedComments[comment._id] = comment.likes.includes(userId);
      newLikeCounts[comment._id] = comment.likes.length;

      // Process replies if any
      if (comment.replies && comment.replies.length > 0) {
        comment.replies.forEach(reply => {
          newLikedComments[reply._id] = reply.likes.includes(userId);
          newLikeCounts[reply._id] = reply.likes.length;
        });
      }
    });

    setLikedComments(prev => ({ ...prev, ...newLikedComments }));
    setLikeCounts(prev => ({ ...prev, ...newLikeCounts }));
  };

  // Function to toggle like state for a comment
  const toggleLike = (commentId: string, currentLikes: string[], userId: string | undefined) => {
    if (!userId) return;

    // Update liked state optimistically
    const isCurrentlyLiked = likedComments[commentId] ?? false;
    const newIsLiked = !isCurrentlyLiked;

    // Update like count optimistically
    const currentCount = likeCounts[commentId] ?? currentLikes.length;
    const newCount = newIsLiked ? currentCount + 1 : currentCount - 1;

    // Update state
    setLikedComments(prev => ({ ...prev, [commentId]: newIsLiked }));
    setLikeCounts(prev => ({ ...prev, [commentId]: newCount }));
  };

  const dispatchValues: CommentStateDispatch = {
    setLikedComments,
    setLikeCounts,
    toggleLike,
    initializeCommentState
  };

  return (
    <CommentStateContext.Provider value={{ likedComments, likeCounts }}>
      <CommentStateDispatchContext.Provider value={dispatchValues}>
        {children}
      </CommentStateDispatchContext.Provider>
    </CommentStateContext.Provider>
  );
}

// Custom hook to use the state context
export function useCommentState() {
  const context = useContext(CommentStateContext);
  if (context === undefined) {
    throw new Error('useCommentState must be used within a CommentStateProvider');
  }
  return context;
}

// Custom hook to use the dispatch context
export function useCommentStateDispatch() {
  const context = useContext(CommentStateDispatchContext);
  if (context === undefined) {
    throw new Error('useCommentStateDispatch must be used within a CommentStateProvider');
  }
  return context;
}