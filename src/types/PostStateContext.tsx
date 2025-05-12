"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Post } from '../services/postService';

// Define the structure of our post state
interface PostState {
  likedPosts: Record<string, boolean>;
  likeCounts: Record<string, number>;
}

// Define the dispatch actions
interface PostStateDispatch {
  setLikedPosts: (update: React.SetStateAction<Record<string, boolean>>) => void;
  setLikeCounts: (update: React.SetStateAction<Record<string, number>>) => void;
  toggleLike: (postId: string, currentLikes: string[], userId: string | undefined) => void;
}

// Create the contexts
const PostStateContext = createContext<PostState | undefined>(undefined);
const PostStateDispatchContext = createContext<PostStateDispatch | undefined>(undefined);

// Create a provider component
export function PostStateProvider({ children }: { children: ReactNode }) {
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});

  // Function to toggle like state for a post
  const toggleLike = (postId: string, currentLikes: string[], userId: string | undefined) => {
    if (!userId) return;

    // Update liked state optimistically
    const isCurrentlyLiked = likedPosts[postId] ?? false;
    const newIsLiked = !isCurrentlyLiked;

    // Update like count optimistically
    const currentCount = likeCounts[postId] ?? currentLikes.length;
    const newCount = newIsLiked ? currentCount + 1 : currentCount - 1;

    // Update state
    setLikedPosts(prev => ({ ...prev, [postId]: newIsLiked }));
    setLikeCounts(prev => ({ ...prev, [postId]: newCount }));
  };

  const dispatchValues: PostStateDispatch = {
    setLikedPosts,
    setLikeCounts,
    toggleLike
  };

  return (
    <PostStateContext.Provider value={{ likedPosts, likeCounts }}>
      <PostStateDispatchContext.Provider value={dispatchValues}>
        {children}
      </PostStateDispatchContext.Provider>
    </PostStateContext.Provider>
  );
}

// Custom hook to use the state context
export function usePostState() {
  const context = useContext(PostStateContext);
  if (context === undefined) {
    throw new Error('usePostState must be used within a PostStateProvider');
  }
  return context;
}

// Custom hook to use the dispatch context
export function usePostStateDispatch() {
  const context = useContext(PostStateDispatchContext);
  if (context === undefined) {
    throw new Error('usePostStateDispatch must be used within a PostStateProvider');
  }
  return context;
}