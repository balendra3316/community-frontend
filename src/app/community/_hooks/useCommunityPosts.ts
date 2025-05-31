
import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchPosts, Post as PostType } from "../../../services/postService";

interface UseCommunityPostsState {
  posts: PostType[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  loadingMore: boolean;
}

interface UseCommunityPostsReturn extends UseCommunityPostsState {
  loadPosts: (pageNum?: number, replace?: boolean) => Promise<void>;
  updatePost: (updatedPost: PostType) => void;
  deletePost: (postId: string) => void;
  addPost: (newPost: PostType) => void;
  loadMore: () => void;
  canLoadMore: boolean;
}

export const useCommunityPosts = (currentFilter: string): UseCommunityPostsReturn => {
  const [state, setState] = useState<UseCommunityPostsState>({
    posts: [],
    loading: true,
    error: null,
    page: 1,
    totalPages: 1,
    loadingMore: false,
  });


  const loadPosts = useCallback(async (pageNum = 1, replace = true) => {
    try {
      setState(prev => ({
        ...prev,
        loading: pageNum === 1,
        loadingMore: pageNum > 1,
        error: null
      }));

      const response = await fetchPosts(pageNum, 10, currentFilter);

      setState(prev => ({
        ...prev,
        posts: replace ? response.posts : [...prev.posts, ...response.posts],
        totalPages: response.totalPages,
        page: response.currentPage,
        loading: false,
        loadingMore: false,
        error: null
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: "Failed to load posts. Please try again later.",
        loading: false,
        loadingMore: false
      }));
    }
  }, [currentFilter]);


  const updatePost = useCallback((updatedPost: PostType) => {
    setState(prev => ({
      ...prev,
      posts: prev.posts.map(post => 
        post._id === updatedPost._id ? updatedPost : post
      )
    }));
  }, []);


  const deletePost = useCallback((postId: string) => {
    setState(prev => ({
      ...prev,
      posts: prev.posts.filter(post => post._id !== postId)
    }));
  }, []);


  const addPost = useCallback((newPost: PostType) => {
    setState(prev => ({
      ...prev,
      posts: [newPost, ...prev.posts]
    }));
  }, []);


  const loadMore = useCallback(() => {
    if (state.page < state.totalPages && !state.loadingMore) {
      loadPosts(state.page + 1, false);
    }
  }, [state.page, state.totalPages, state.loadingMore, loadPosts]);


  const canLoadMore = useMemo(() => {
    return state.page < state.totalPages;
  }, [state.page, state.totalPages]);


  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  return {
    ...state,
    loadPosts,
    updatePost,
    deletePost,
    addPost,
    loadMore,
    canLoadMore
  };
};