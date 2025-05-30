

// src/app/community/page.tsx

"use client";
import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "../../context/AuthContext";
import { PostStateProvider } from "../../types/PostStateContext";
import { fetchPosts, Post as PostType } from "../../services/postService";
import ProtectedRoute from '@/components/ProtectedRoute';
import { initializeSocket, getSocket } from "../../services/socket.service";

// Static imports for critical components
import NavBar from "../../components/Navbar";
import CreatePostSection from "./_components/CreatePostSection";
import CategoryFilter from "./_components/CategoryFilter";
import PostsList from "./_components/PostsList";
import LoadingIndicator from "./_components/LoadingIndicator";
import NotificationSnackbar from "./_components/NotificationSnackbar";

// Dynamic imports for non-critical components
const CreatePostModal = dynamic(() => import("../../components/CreatePostModal"), {
  loading: () => <div className="animate-pulse">Loading...</div>,
  ssr: false
});

const PostDetailView = dynamic(() => import("../../components/PostDetailView"), {
  loading: () => <div className="animate-pulse">Loading...</div>,
  ssr: false
});

const CommunityInfoSidebar = dynamic(() => import("../../components/CommunityInfoSidebar"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>,
  ssr: false
});

// Custom hooks for better performance
function usePosts(currentFilter: string) {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadPosts = useCallback(async (pageNum = 1, replace = true) => {
    try {
      setLoading(pageNum === 1);
      setLoadingMore(pageNum > 1);

      const response = await fetchPosts(pageNum, 10, currentFilter);

      if (replace) {
        setPosts(response.posts);
      } else {
        setPosts((prev) => [...prev, ...response.posts]);
      }

      setTotalPages(response.totalPages);
      setPage(response.currentPage);
      setError(null);
    } catch (err) {
      setError("Failed to load posts. Please try again later.");
      console.error("Error loading posts:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [currentFilter]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  return {
    posts,
    setPosts,
    loading,
    error,
    page,
    totalPages,
    loadingMore,
    loadPosts
  };
}

function useNotifications() {
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const showNotification = useCallback((message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }, []);

  return {
    isCreatingPost,
    setIsCreatingPost,
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    setSnackbarOpen,
    showNotification
  };
}

export default function Community() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
  const [showPostDetail, setShowPostDetail] = useState(false);
  const [currentFilter, setCurrentFilter] = useState("default");

  // Custom hooks
  const { 
    posts, 
    setPosts, 
    loading, 
    error, 
    page, 
    totalPages, 
    loadingMore, 
    loadPosts 
  } = usePosts(currentFilter);

  const {
    isCreatingPost,
    setIsCreatingPost,
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    setSnackbarOpen,
    showNotification
  } = useNotifications();

  // Socket initialization and event listeners
  useEffect(() => {
    if (user?._id) {
      try {
        const socket = initializeSocket(user._id);

        // Listen for user-specific post creation events
        const handleUserPostCreated = (data: { post: PostType; message: string }) => {
          console.log('User post created:', data);
          
          // Add the new post to the beginning of the posts array
          setPosts(prevPosts => [data.post, ...prevPosts]);
          
          // Show success notification
          showNotification(data.message, "success");
          
          // Stop the creating post loading state
          setIsCreatingPost(false);
        };

        // Listen for user-specific post deletion events
        const handlePostDeleted = (data: { postId: string; message: string }) => {
          console.log('User post deleted:', data);
          
          // Remove the deleted post from the posts array
          setPosts(prevPosts => prevPosts.filter(post => post._id !== data.postId));
          
          // Show success notification
          showNotification(data.message, "success");
          
          // Close post detail view if the deleted post was being viewed
          if (selectedPost && selectedPost._id === data.postId) {
            setShowPostDetail(false);
            setSelectedPost(null);
          }
        };

        // Add event listeners
        socket.on('userPostCreated', handleUserPostCreated);
        socket.on('postDeleted', handlePostDeleted);

        // Cleanup function
        return () => {
          socket.off('userPostCreated', handleUserPostCreated);
          socket.off('postDeleted', handlePostDeleted);
        };
      } catch (error) {
        console.error('Socket initialization error:', error);
      }
    }
  }, [user?._id, setPosts, showNotification, selectedPost, setIsCreatingPost]);

  // Memoized filtered posts
  const filteredPosts = useMemo(() => {
    return selectedCategory === "All" 
      ? posts 
      : posts.filter(post => post.tags && post.tags.includes(selectedCategory));
  }, [posts, selectedCategory]);

  // Memoized event handlers
  const handlePostCreated = useCallback(() => {
    // The socket event will handle adding the post and showing notification
    // Just close the modal and stop the loading state
    setShowModal(false);
    setIsCreatingPost(false);
  }, []);

  const handlePostError = useCallback(() => {
    setIsCreatingPost(false);
    showNotification("Failed to create post. Please try again.", "error");
  }, [showNotification]);

  const handlePostClick = useCallback((post: PostType) => {
    const updatedPost = posts.find((p) => p._id === post._id) || post;
    setSelectedPost(updatedPost);
    setShowPostDetail(true);
  }, [posts]);

  const handlePostUpdate = useCallback((updatedPost: PostType) => {
    setPosts(prevPosts => 
      prevPosts.map((p) => p._id === updatedPost._id ? updatedPost : p)
    );
  }, [setPosts]);

  const handlePostDelete = useCallback((deletedPostId: string) => {
    // The socket event will handle removing the post
    // This is kept as fallback for manual deletion from UI
    setPosts(prevPosts => prevPosts.filter((p) => p._id !== deletedPostId));
  }, [setPosts]);

  const handleLoadMore = useCallback(() => {
    if (page < totalPages) {
      loadPosts(page + 1, false);
    }
  }, [page, totalPages, loadPosts]);

  return (
    <ProtectedRoute>
      <PostStateProvider>
        <main className="min-h-screen bg-[rgb(248,247,245)] pt-[104px]">
          <NavBar />
          
          <LoadingIndicator isCreatingPost={isCreatingPost} />
          
          <NotificationSnackbar
            open={snackbarOpen}
            message={snackbarMessage}
            severity={snackbarSeverity}
            onClose={() => setSnackbarOpen(false)}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Main content - Left side */}
              <div className="flex-1">
                <CreatePostSection 
                  user={user} 
                  onCreateClick={() => setShowModal(true)} 
                />
                
                <CategoryFilter
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  currentFilter={currentFilter}
                  onFilterChange={setCurrentFilter}
                />

                <PostsList
                  posts={filteredPosts}
                  loading={loading}
                  error={error}
                  page={page}
                  totalPages={totalPages}
                  loadingMore={loadingMore}
                  onPostClick={handlePostClick}
                  onPostUpdate={handlePostUpdate}
                  onPostDelete={handlePostDelete}
                  onLoadMore={handleLoadMore}
                  onRetry={() => loadPosts()}
                  onCreatePost={() => setShowModal(true)}
                />
              </div>

              {/* Community Info Sidebar - Right side - Lazy loaded */}
              <div className="hidden lg:block w-80">
                <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>}>
                  <CommunityInfoSidebar />
                </Suspense>
              </div>
            </div>
          </div>

          {/* Modals - Lazy loaded */}
          {showModal && (
            <Suspense fallback={<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>}>
              <CreatePostModal
                onClose={() => setShowModal(false)}
                onPostCreated={handlePostCreated}
                onPostError={handlePostError}
                onPostStart={() => setIsCreatingPost(true)}
              />
            </Suspense>
          )}

          {showPostDetail && selectedPost && (
            <Suspense fallback={<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>}>
              <PostDetailView
                post={selectedPost}
                isOpen={showPostDetail}
                onClose={() => setShowPostDetail(false)}
              />
            </Suspense>
          )}
        </main>
      </PostStateProvider>
    </ProtectedRoute>
  );
}