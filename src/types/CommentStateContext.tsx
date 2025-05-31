"use client"
import { createContext, useContext, useState, ReactNode } from 'react';
import { Comment } from '../services/commentService';


interface CommentState {
  likedComments: Record<string, boolean>;
  likeCounts: Record<string, number>;
}


interface CommentStateDispatch {
  setLikedComments: (update: React.SetStateAction<Record<string, boolean>>) => void;
  setLikeCounts: (update: React.SetStateAction<Record<string, number>>) => void;
  toggleLike: (commentId: string, currentLikes: string[], userId: string | undefined) => void;
  initializeCommentState: (comments: Comment[], userId: string | undefined) => void;
}


const CommentStateContext = createContext<CommentState | undefined>(undefined);
const CommentStateDispatchContext = createContext<CommentStateDispatch | undefined>(undefined);


export function CommentStateProvider({ children }: { children: ReactNode }) {
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});


  const initializeCommentState = (comments: Comment[], userId: string | undefined) => {
    if (!userId) return;

    const newLikedComments: Record<string, boolean> = {};
    const newLikeCounts: Record<string, number> = {};


    comments.forEach(comment => {

      newLikedComments[comment._id] = comment.likes.includes(userId);
      newLikeCounts[comment._id] = comment.likes.length;


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


  const toggleLike = (commentId: string, currentLikes: string[], userId: string | undefined) => {
    if (!userId) return;


    const isCurrentlyLiked = likedComments[commentId] ?? false;
    const newIsLiked = !isCurrentlyLiked;


    const currentCount = likeCounts[commentId] ?? currentLikes.length;
    const newCount = newIsLiked ? currentCount + 1 : currentCount - 1;


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


export function useCommentState() {
  const context = useContext(CommentStateContext);
  if (context === undefined) {
    throw new Error('useCommentState must be used within a CommentStateProvider');
  }
  return context;
}


export function useCommentStateDispatch() {
  const context = useContext(CommentStateDispatchContext);
  if (context === undefined) {
    throw new Error('useCommentStateDispatch must be used within a CommentStateProvider');
  }
  return context;
}