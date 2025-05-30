

// // src/app/community/page.tsx

// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import NavBar from "../../components/Navbar";
// import Post from "../../components/Post";
// import CreatePostModal from "../../components/CreatePostModal";
// import CommunityInfoSidebar from "../../components/CommunityInfoSidebar";
// import PostDetailView from "../../components/PostDetailView";
// import { Filter, Loader2, User } from "lucide-react";
// import { fetchPosts, Post as PostType } from "../../services/postService";
// import { useAuth } from "../../context/AuthContext";
// import { PostStateProvider } from "../../types/PostStateContext";
// // Import Material UI components
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
// import { AccessTime, TrendingUp, NewReleases } from "@mui/icons-material";
// import { Skeleton } from "@mui/material";
// import { Avatar } from "@mui/material";

// import LinearProgress from "@mui/material/LinearProgress";
// import Snackbar from "@mui/material/Snackbar";
// import MuiAlert, { AlertProps } from "@mui/material/Alert";
// import { Typography } from "@mui/material";
// import { PostSkeleton } from "./_components/_PostSkeleton";
// import ProtectedRoute from '@/components/ProtectedRoute';

// const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
//   props,
//   ref
// ) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

// export default function Community() {
//   const { user } = useAuth();
//   const [showModal, setShowModal] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
//   const [showPostDetail, setShowPostDetail] = useState(false);

//   // State for API data
//   const [posts, setPosts] = useState<PostType[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [currentFilter, setCurrentFilter] = useState("default"); // 'default', 'oldNew', 'popular'

//   // Filter menu state
//   const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(
//     null
//   );
//   const filterMenuOpen = Boolean(filterMenuAnchor);

//   const [isCreatingPost, setIsCreatingPost] = useState(false);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
//     "success"
//   );

//   // Fetch posts with filter
//   const loadPosts = async (pageNum = 1, replace = true) => {
//     try {
//       setLoading(pageNum === 1);
//       setLoadingMore(pageNum > 1);

//       const response = await fetchPosts(pageNum, 10, currentFilter);

//       if (replace) {
//         setPosts(response.posts);
//       } else {
//         setPosts((prev) => [...prev, ...response.posts]);
//       }

//       setTotalPages(response.totalPages);
//       setPage(response.currentPage);
//       setError(null);
//     } catch (err) {
//       setError("Failed to load posts. Please try again later.");
//       console.error("Error loading posts:", err);
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//     }
//   };

//   // Initial load
//   useEffect(() => {
//     loadPosts();
//   }, [currentFilter]); // Reload when filter changes

//   // Reload posts after creating a new one
//   const handlePostStart = () => {
//     setIsCreatingPost(true);
//   };

//   const handlePostCreated = () => {
//     setIsCreatingPost(false);
//     setSnackbarMessage("Post created successfully!");
//     setSnackbarSeverity("success");
//     setSnackbarOpen(true);
//     loadPosts(); // Refresh posts
//   };

//   const handlePostError = () => {
//     setIsCreatingPost(false);
//     setSnackbarMessage("Failed to create post. Please try again.");
//     setSnackbarSeverity("error");
//     setSnackbarOpen(true);
//   };

//   const handleSnackbarClose = () => {
//     setSnackbarOpen(false);
//   };

//   // Filter posts based on selected category
//   const filteredPosts =
//     selectedCategory === "All"
//       ? posts
//       : posts.filter(
//           (post) => post.tags && post.tags.includes(selectedCategory)
//         );

//   // Function to handle clicking on a post
//   const handlePostClick = (post: PostType) => {
//     // Find the most up-to-date version of this post in our state
//     const updatedPost = posts.find((p) => p._id === post._id) || post;
//     setSelectedPost(updatedPost);
//     setShowPostDetail(true);
//   };

//   // Load more posts
//   const handleLoadMore = () => {
//     if (page < totalPages) {
//       loadPosts(page + 1, false);
//     }
//   };

//   // Handle filter menu
//   const handleFilterMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
//     setFilterMenuAnchor(event.currentTarget);
//   };

//   const handleFilterMenuClose = () => {
//     setFilterMenuAnchor(null);
//   };

//   const handleFilterChange = (filter: string) => {
//     setCurrentFilter(filter);
//     setFilterMenuAnchor(null);
//     // Page will reset to 1 due to the useEffect dependency
//   };

//   // Get filter display name
//   const getFilterDisplayName = () => {
//     switch (currentFilter) {
//       case "oldNew":
//         return "Old to New";
//       case "popular":
//         return "Popular";
//       default:
//         return "New to Old";
//     }
//   };

//   return (
//     <ProtectedRoute>
//       <PostStateProvider>
//         <main className="min-h-screen bg-[rgb(248,247,245)] 50 pt-[104px]">
//           {/* Loading indicator for post creation */}
//           <NavBar />
//           {isCreatingPost && (
//             <div className="fixed top-[104px] left-0 right-0 z-50 bg-white shadow-sm">
//               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
//                 <div className="flex items-center gap-3">
//                   <Typography variant="body2" color="textPrimary">
//                     Creating your post...
//                   </Typography>
//                 </div>
//                 <LinearProgress color="primary" className="mt-1" />
//               </div>
//             </div>
//           )}
//           <Snackbar
//             open={snackbarOpen}
//             autoHideDuration={6000}
//             onClose={handleSnackbarClose}
//             anchorOrigin={{ vertical: "top", horizontal: "center" }}
//           >
//             <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
//               {snackbarMessage}
//             </Alert>
//           </Snackbar>

//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//             <div className="flex flex-col lg:flex-row gap-6">
//               {/* Main content - Left side */}
//               <div className="flex-1">
//                 {/* Create Post Section */}
//                 <div
//                   className="bg-white rounded-lg mb-6 p-4 "
//                   style={{
//                     boxShadow:
//                       "rgba(60, 64, 67, 0.32) 0px 1px 2px, rgba(60, 64, 67, 0.15) 0px 2px 6px, rgba(0, 0, 0, 0.1) 0px 1px 8px",
//                     border: "1px solid rgb(228, 228, 228)",
//                   }}
//                 >
//                   <div
//                     className="flex items-center cursor-pointer h-[60px] md:h-[60px] lg:h-[60px]"
//                     onClick={() => setShowModal(true)}
//                   >
//                     <div className="h-8 w-8 md:h-8 md:w-8 lg:h-10 lg:w-10">
//                       <Avatar
//                         src={user?.avatar}
//                         alt={user?.name?.charAt(0).toUpperCase() || "U"}
//                         className="h-full w-full bg-gray-300"
//                       />
//                     </div>
//                     <div className="flex-1 ml-3 bg-gray-100 rounded-full px-4 py-2 text-gray-700">
//                       Write something....
//                     </div>
//                   </div>
//                 </div>

//                 {/* Category Filter - Simplified without arrows */}
//                 <div className="mb-6">
//                   <div className="flex items-center">
//                     {/* Scrollable categories with visible scrollbar */}
//                     <div
//                       className="flex-1 overflow-x-auto pr-4"
//                       style={{
//                         scrollbarWidth: "thin",
//                         scrollbarColor: "#CBD5E0 #F1F5F9",
//                       }}
//                     >
//                       <div
//                         className="flex items-center gap-2 pb-2"
//                         style={{ minWidth: "max-content" }}
//                       >
//                         <button
//                           className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap ${
//                             selectedCategory === "All"
//                               ? "bg-gray-700 text-white"
//                               : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                           }`}
//                           onClick={() => setSelectedCategory("All")}
//                         >
//                           All
//                         </button>

//                         {["DanceTips", "SelfLove", "Events"].map((category) => (
//                           <button
//                             key={category}
//                             className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap ${
//                               selectedCategory === category
//                                 ? "bg-gray-700 text-white"
//                                 : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                             }`}
//                             onClick={() => setSelectedCategory(category)}
//                           >
//                             {category}
//                           </button>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Filter button */}
//                     <div className="ml-2">
//                       <button
//                         className="rounded-full p-3 bg-gray-200 hover:bg-gray-300 flex items-center gap-1"
//                         onClick={handleFilterMenuOpen}
//                         aria-haspopup="true"
//                         aria-expanded={filterMenuOpen ? "true" : "false"}
//                       >
//                         <Filter size={18} />
//                       </button>

//                       {/* Filter Menu */}
//                       <Menu
//                         anchorEl={filterMenuAnchor}
//                         open={filterMenuOpen}
//                         onClose={handleFilterMenuClose}
//                         anchorOrigin={{
//                           vertical: "bottom",
//                           horizontal: "right",
//                         }}
//                         transformOrigin={{
//                           vertical: "top",
//                           horizontal: "right",
//                         }}
//                       >
//                         <MenuItem
//                           onClick={() => handleFilterChange("default")}
//                           selected={currentFilter === "default"}
//                         >
//                           <ListItemIcon>
//                             <NewReleases fontSize="small" />
//                           </ListItemIcon>
//                           <ListItemText>New to Old</ListItemText>
//                         </MenuItem>
//                         <MenuItem
//                           onClick={() => handleFilterChange("oldNew")}
//                           selected={currentFilter === "oldNew"}
//                         >
//                           <ListItemIcon>
//                             <AccessTime fontSize="small" />
//                           </ListItemIcon>
//                           <ListItemText>Old to New</ListItemText>
//                         </MenuItem>
//                         <MenuItem
//                           onClick={() => handleFilterChange("popular")}
//                           selected={currentFilter === "popular"}
//                         >
//                           <ListItemIcon>
//                             <TrendingUp fontSize="small" />
//                           </ListItemIcon>
//                           <ListItemText>Popular</ListItemText>
//                         </MenuItem>
//                       </Menu>
//                     </div>
//                   </div>

//                   {/* Show current filter if not default */}
//                   {currentFilter !== "default" && (
//                     <div className="mt-2 text-sm text-gray-600 flex items-center">
//                       <span>Sorting: {getFilterDisplayName()}</span>
//                     </div>
//                   )}
//                 </div>

//                 {/* Loading State */}
//                 {loading && (
//                   <>
//                     <PostSkeleton />
//                     <PostSkeleton />
//                     <PostSkeleton />
//                   </>
//                 )}

//                 {/* Error State */}
//                 {error && (
//                   <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
//                     {error}
//                     <button
//                       className="ml-4 underline"
//                       onClick={() => loadPosts()}
//                     >
//                       Try again
//                     </button>
//                   </div>
//                 )}

//                 {/* Empty State */}
//                 {!loading && !error && filteredPosts.length === 0 && (
//                   <div className="bg-white rounded-lg shadow p-6 text-center">
//                     <h3 className="text-lg font-medium text-gray-700 mb-2">
//                       No posts found
//                     </h3>
//                     <p className="text-gray-500">
//                       Be the first to share something with the community!
//                     </p>
//                     <button
//                       className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//                       onClick={() => setShowModal(true)}
//                     >
//                       Create Post
//                     </button>
//                   </div>
//                 )}

//                 {/* Posts List */}
//                 {!loading && !error && filteredPosts.length > 0 && (
//                   <div className="space-y-6">
//                     {filteredPosts.map((post) => (
//                       <div
//                         key={post._id}
//                         onClick={() => handlePostClick(post)}
//                         className="cursor-pointer"
//                       >
//                         <Post
//                           post={post}
//                           onRefresh={() => {
//                             // Update the posts state with the updated post
//                             const updatedPosts = posts.map((p) =>
//                               p._id === post._id ? post : p
//                             );
//                             setPosts(updatedPosts);
//                           }}
//                           onDelete={(deletedPostId) => {
//                             // Remove the deleted post from the posts state
//                             setPosts((prev) =>
//                               prev.filter((p) => p._id !== deletedPostId)
//                             );
//                             loadPosts();
//                           }}
//                         />
//                       </div>
//                     ))}

//                     {/* Load More */}
//                     {page < totalPages && (
//                       <div className="flex justify-center mt-6">
//                         <button
//                           className="bg-white border border-gray-300 rounded-lg px-6 py-3 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-50"
//                           onClick={handleLoadMore}
//                           disabled={loadingMore}
//                         >
//                           {loadingMore ? (
//                             <Loader2 size={20} className="animate-spin mx-auto" />
//                           ) : (
//                             "Load More Posts"
//                           )}
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* Community Info Sidebar - Right side */}
//               <div className="hidden lg:block w-80">
//                 <CommunityInfoSidebar />
//               </div>
//             </div>
//           </div>

//           {/* Create Post Modal */}
//           {showModal && (
//             <CreatePostModal
//               onClose={() => setShowModal(false)}
//               onPostCreated={handlePostCreated}
//               onPostError={handlePostError}
//               onPostStart={() => setIsCreatingPost(true)}
//             />
//           )}

//           {/* Post Detail View */}
//           <PostDetailView
//             post={selectedPost}
//             isOpen={showPostDetail}
//             onClose={() => setShowPostDetail(false)}
//           />
//         </main>
//       </PostStateProvider>
//     </ProtectedRoute>
//   );
// }








// // src/app/community/page.tsx

// "use client";
// import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from "react";
// import dynamic from "next/dynamic";
// import { useAuth } from "../../context/AuthContext";
// import { PostStateProvider } from "../../types/PostStateContext";
// import { fetchPosts, Post as PostType } from "../../services/postService";
// import ProtectedRoute from '@/components/ProtectedRoute';

// // Static imports for critical components
// import NavBar from "../../components/Navbar";
// import CreatePostSection from "./_components/CreatePostSection";
// import CategoryFilter from "./_components/CategoryFilter";
// import PostsList from "./_components/PostsList";
// import LoadingIndicator from "./_components/LoadingIndicator";
// import NotificationSnackbar from "./_components/NotificationSnackbar";

// // Dynamic imports for non-critical components
// const CreatePostModal = dynamic(() => import("../../components/CreatePostModal"), {
//   loading: () => <div className="animate-pulse">Loading...</div>,
//   ssr: false
// });

// const PostDetailView = dynamic(() => import("../../components/PostDetailView"), {
//   loading: () => <div className="animate-pulse">Loading...</div>,
//   ssr: false
// });

// const CommunityInfoSidebar = dynamic(() => import("../../components/CommunityInfoSidebar"), {
//   loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>,
//   ssr: false
// });

// // Custom hooks for better performance
// function usePosts(currentFilter: string) {
//   const [posts, setPosts] = useState<PostType[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loadingMore, setLoadingMore] = useState(false);

//   const loadPosts = useCallback(async (pageNum = 1, replace = true) => {
//     try {
//       setLoading(pageNum === 1);
//       setLoadingMore(pageNum > 1);

//       const response = await fetchPosts(pageNum, 10, currentFilter);

//       if (replace) {
//         setPosts(response.posts);
//       } else {
//         setPosts((prev) => [...prev, ...response.posts]);
//       }

//       setTotalPages(response.totalPages);
//       setPage(response.currentPage);
//       setError(null);
//     } catch (err) {
//       setError("Failed to load posts. Please try again later.");
//       console.error("Error loading posts:", err);
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//     }
//   }, [currentFilter]);

//   useEffect(() => {
//     loadPosts();
//   }, [loadPosts]);

//   return {
//     posts,
//     setPosts,
//     loading,
//     error,
//     page,
//     totalPages,
//     loadingMore,
//     loadPosts
//   };
// }

// function useNotifications() {
//   const [isCreatingPost, setIsCreatingPost] = useState(false);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

//   const showNotification = useCallback((message: string, severity: "success" | "error") => {
//     setSnackbarMessage(message);
//     setSnackbarSeverity(severity);
//     setSnackbarOpen(true);
//   }, []);

//   return {
//     isCreatingPost,
//     setIsCreatingPost,
//     snackbarOpen,
//     snackbarMessage,
//     snackbarSeverity,
//     setSnackbarOpen,
//     showNotification
//   };
// }

// export default function Community() {
//   const { user } = useAuth();
//   const [showModal, setShowModal] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
//   const [showPostDetail, setShowPostDetail] = useState(false);
//   const [currentFilter, setCurrentFilter] = useState("default");

//   // Custom hooks
//   const { 
//     posts, 
//     setPosts, 
//     loading, 
//     error, 
//     page, 
//     totalPages, 
//     loadingMore, 
//     loadPosts 
//   } = usePosts(currentFilter);

//   const {
//     isCreatingPost,
//     setIsCreatingPost,
//     snackbarOpen,
//     snackbarMessage,
//     snackbarSeverity,
//     setSnackbarOpen,
//     showNotification
//   } = useNotifications();

//   // Memoized filtered posts
//   const filteredPosts = useMemo(() => {
//     return selectedCategory === "All" 
//       ? posts 
//       : posts.filter(post => post.tags && post.tags.includes(selectedCategory));
//   }, [posts, selectedCategory]);

//   // Memoized event handlers
//   const handlePostCreated = useCallback(() => {
//     setIsCreatingPost(false);
//     showNotification("Post created successfully!", "success");
//     loadPosts();
//   }, [loadPosts, showNotification]);

//   const handlePostError = useCallback(() => {
//     setIsCreatingPost(false);
//     showNotification("Failed to create post. Please try again.", "error");
//   }, [showNotification]);

//   const handlePostClick = useCallback((post: PostType) => {
//     const updatedPost = posts.find((p) => p._id === post._id) || post;
//     setSelectedPost(updatedPost);
//     setShowPostDetail(true);
//   }, [posts]);

//   const handlePostUpdate = useCallback((updatedPost: PostType) => {
//     setPosts(prevPosts => 
//       prevPosts.map((p) => p._id === updatedPost._id ? updatedPost : p)
//     );
//   }, [setPosts]);

//   const handlePostDelete = useCallback((deletedPostId: string) => {
//     setPosts(prevPosts => prevPosts.filter((p) => p._id !== deletedPostId));
//     loadPosts();
//   }, [setPosts, loadPosts]);

//   const handleLoadMore = useCallback(() => {
//     if (page < totalPages) {
//       loadPosts(page + 1, false);
//     }
//   }, [page, totalPages, loadPosts])

//   return (
//     <ProtectedRoute>
//       <PostStateProvider>
//         <main className="min-h-screen bg-[rgb(248,247,245)] pt-[104px]">
//           <NavBar />
          
//           <LoadingIndicator isCreatingPost={isCreatingPost} />
          
//           <NotificationSnackbar
//             open={snackbarOpen}
//             message={snackbarMessage}
//             severity={snackbarSeverity}
//             onClose={() => setSnackbarOpen(false)}
//           />

//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//             <div className="flex flex-col lg:flex-row gap-6">
//               {/* Main content - Left side */}
//               <div className="flex-1">
//                 <CreatePostSection 
//                   user={user} 
//                   onCreateClick={() => setShowModal(true)} 
//                 />
                
//                 <CategoryFilter
//                   selectedCategory={selectedCategory}
//                   onCategoryChange={setSelectedCategory}
//                   currentFilter={currentFilter}
//                   onFilterChange={setCurrentFilter}
//                 />

//                 <PostsList
//                   posts={filteredPosts}
//                   loading={loading}
//                   error={error}
//                   page={page}
//                   totalPages={totalPages}
//                   loadingMore={loadingMore}
//                   onPostClick={handlePostClick}
//                   onPostUpdate={handlePostUpdate}
//                   onPostDelete={handlePostDelete}
//                   onLoadMore={handleLoadMore}
//                   onRetry={() => loadPosts()}
//                   onCreatePost={() => setShowModal(true)}
//                 />
//               </div>

//               {/* Community Info Sidebar - Right side - Lazy loaded */}
//               <div className="hidden lg:block w-80">
//                 <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>}>
//                   <CommunityInfoSidebar />
//                 </Suspense>
//               </div>
//             </div>
//           </div>

//           {/* Modals - Lazy loaded */}
//           {showModal && (
//             <Suspense fallback={<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
//             </div>}>
//               <CreatePostModal
//                 onClose={() => setShowModal(false)}
//                 onPostCreated={handlePostCreated}
//                 onPostError={handlePostError}
//                 onPostStart={() => setIsCreatingPost(true)}
//               />
//             </Suspense>
//           )}

//           {showPostDetail && selectedPost && (
//             <Suspense fallback={<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
//             </div>}>
//               <PostDetailView
//                 post={selectedPost}
//                 isOpen={showPostDetail}
//                 onClose={() => setShowPostDetail(false)}
//               />
//             </Suspense>
//           )}
//         </main>
//       </PostStateProvider>
//     </ProtectedRoute>
//   );
// }











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