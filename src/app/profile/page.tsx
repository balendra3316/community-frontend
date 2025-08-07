// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { ArrowLeft } from "lucide-react";
// import NavBar from "../../components/Navbar";
// import PostDetailView from "../../components/PostDetailView";
// import { useAuth } from "../../context/AuthContext";
// import ProfileEditTab from "./_components/ProfileEditTab";
// import MyPostsTab from "./_components/MyPostsTab";
// import ProfileLoadingIndicator from "./_components/ProfileLoadingIndicator";
// import { Post as PostType } from "../../services/postService";
// import { PostStateProvider } from "../../types/PostStateContext";
// import {
//   CircularProgress, Box,  Button, Typography, Paper,
// } from "@mui/material";

// export default function ProfilePage() {
//   const router = useRouter();
//   const { user, loading: authLoading } = useAuth();
//   const [activeTab, setActiveTab] = useState("profile");
//   const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
//   const [showPostDetail, setShowPostDetail] = useState(false);
//   const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);


//   const themeYellow = {
//     primary: "#FFC107", 
//     primaryDark: "#FFA000", 
//     primaryLight: "#FFECB3", 
//     text: "#212121", 
//   };

//   const handlePostClick = (post: PostType) => {
//     setSelectedPost(post);
//     setShowPostDetail(true);
//   };

//   const handlePostDetailClose = () => {
//     setShowPostDetail(false);
//   };


//   const goToCommunity = () => {
//     router.push("/community");
//   };


//   const handleProfileUpdateStart = () => {
//     setIsUpdatingProfile(true);
//   };

//   const handleProfileUpdateEnd = () => {
//     setIsUpdatingProfile(false);
//   };

//   if (authLoading && !isUpdatingProfile) {
//     return (
//       <Box
//         display="flex"
//         alignItems="center"
//         justifyContent="center"
//         minHeight="100vh"
//       >
//         <NavBar />
//         <CircularProgress sx={{ color: themeYellow.primary }} />
//       </Box>
//     );
//   }

//   if (!user) {
//     return (
//       <Box
//         display="flex"
//         flexDirection="column"
//         alignItems="center"
//         justifyContent="center"
//         minHeight="100vh"
//         p={4}
//       >
//         <Typography variant="h4" fontWeight="bold" mb={4}>
//           Please login to view your profile
//         </Typography>
//         <Button
//           variant="contained"
//           onClick={goToCommunity}
//           sx={{
//             bgcolor: themeYellow.primary,
//             color: themeYellow.text,
//             "&:hover": {
//               bgcolor: themeYellow.primaryDark,
//             },
//           }}
//         >
//           Go to Community
//         </Button>
//       </Box>
//     );
//   }

//   return (
//     <PostStateProvider>
//       <Box
//         component="main"
//         sx={{ minHeight: "100vh", bgcolor: "#F5F5F5", pt: "104px" }}
//       >
//         <NavBar />

//         {/* Profile Loading Indicator */}
//         <ProfileLoadingIndicator isUpdatingProfile={isUpdatingProfile} />

//         <Box maxWidth="7xl" mx="auto" px={{ xs: 2, sm: 3, lg: 4 }} py={3}>
//           {/* Back button */}
//           <Button
//             onClick={goToCommunity}
//             startIcon={<ArrowLeft size={20} />}
//             sx={{
//               color: "text.secondary",
//               "&:hover": { color: "text.primary" },
//               mb: 3,
//               pl: 0,
//             }}
//           >
//             Back to Community
//           </Button>

//           <Box
//             display="flex"
//             flexDirection={{ xs: "column", md: "row" }}
//             gap={3}
//           >
//             {/* Sidebar - Mobile: Horizontal tabs, Desktop: Vertical sidebar */}
//             <Box sx={{ width: { md: "256px" }, flexShrink: 0 }}>
//               <Paper elevation={2} sx={{ overflow: "hidden" }}>
//                 {/* Mobile Tabs */}
//                 <Box
//                   sx={{
//                     display: { xs: "flex", md: "none" },
//                     overflowX: "auto",
//                   }}
//                 >
//                   {["profile", "my-posts", "my-courses"].map((tab) => (
//                     <Button
//                       key={tab}
//                       sx={{
//                         flex: 1,
//                         py: 2,
//                         px: 2,
//                         fontWeight: 500,
//                         borderRadius: 0,
//                         borderBottom:
//                           activeTab === tab
//                             ? `2px solid ${themeYellow.primary}`
//                             : "none",
//                         bgcolor:
//                           activeTab === tab
//                             ? `${themeYellow.primaryLight}`
//                             : "transparent",
//                         color: activeTab === tab ? themeYellow.text : "black",
//                         "&:hover": {
//                           bgcolor:
//                             activeTab === tab
//                               ? themeYellow.primaryLight
//                               : "rgba(0, 0, 0, 0.04)",
//                         },
//                       }}
//                       onClick={() => setActiveTab(tab)}
//                     >
//                       {tab === "profile"
//                         ? "Profile"
//                         : tab === "my-posts"
//                         ? "My Posts"
//                         : "My Courses"}
//                     </Button>
//                   ))}
//                 </Box>

//                 {/* Desktop Sidebar */}
//                 <Box sx={{ display: { xs: "none", md: "block" } }}>
//                   {["profile", "my-posts", "my-courses"].map((tab) => (
//                     <Button
//                       key={tab}
//                       fullWidth
//                       sx={{
//                         justifyContent: "flex-start",
//                         py: 2,
//                         px: 3,
//                         fontWeight: 500,
//                         borderRadius: 0,
//                         borderLeft:
//                           activeTab === tab
//                             ? `4px solid ${themeYellow.primary}`
//                             : "none",
//                         bgcolor:
//                           activeTab === tab
//                             ? `${themeYellow.primaryLight}`
//                             : "transparent",
//                         color:
//                           activeTab === tab
//                             ? themeYellow.primary
//                             : "text.secondary",
//                         "&:hover": {
//                           bgcolor:
//                             activeTab === tab
//                               ? themeYellow.primaryLight
//                               : "rgba(0, 0, 0, 0.04)",
//                         },
//                       }}
//                       onClick={() => setActiveTab(tab)}
//                     >
//                       {tab === "profile"
//                         ? "Profile"
//                         : tab === "my-posts"
//                         ? "My Posts"
//                         : "My Courses"}
//                     </Button>
//                   ))}
//                 </Box>
//               </Paper>
//             </Box>

//             {/* Main Content */}
//             <Box sx={{ flex: 1 }}>
//               {/* Profile Tab */}
//               {activeTab === "profile" && (
//                 <ProfileEditTab
//                   user={user}
//                   onUpdateStart={handleProfileUpdateStart}
//                   onUpdateEnd={handleProfileUpdateEnd}
//                 />
//               )}

//               {/* My Posts Tab */}
//               {activeTab === "my-posts" && (
//                 <MyPostsTab user={user} onPostClick={handlePostClick} />
//               )}

//               {/* My Courses Tab */}
//               {activeTab === "my-courses" && (
//                 <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
//                   <Typography variant="h5" fontWeight="bold" mb={3}>
//                     My Courses
//                   </Typography>
//                   <Typography color="text.secondary">
//                     We are working on this feature. Stay tuned for updates!
//                   </Typography>
//                 </Paper>
//               )}
//             </Box>
//           </Box>
//         </Box>

//         {/* Post Detail View */}
//         <PostDetailView
//           post={selectedPost}
//           isOpen={showPostDetail}
//           onClose={handlePostDetailClose}
//         />
//       </Box>
//     </PostStateProvider>
//   );
// }










// "use client";
// import { useState, useCallback, Suspense, lazy, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { ArrowLeft } from "lucide-react";
// import NavBar from "../../components/Navbar";
// import PostDetailView from "../../components/PostDetailView";
// import { useAuth } from "../../context/AuthContext";
// import ProfileEditTab from "./_components/ProfileEditTab";
// import MyPostsTab from "./_components/MyPostsTab";
// import ProfileLoadingIndicator from "./_components/ProfileLoadingIndicator";
// import NotificationSnackbar from "../../app/community/_components/NotificationSnackbar"; // ADDED
// import { Post as PostType, fetchUserPosts, deletePost } from "../../services/postService"; // MODIFIED
// import { PostStateProvider } from "../../types/PostStateContext";
// import { CircularProgress, Box, Button, Typography, Paper } from "@mui/material";
// import { getSocket, initializeSocket } from "@/services/socket.service";

// const CreatePostModal = lazy(() => import("../../components/CreatePostModal"));

// export default function ProfilePage() {
//   const router = useRouter();
//   const { user, loading: authLoading } = useAuth();
//   const [activeTab, setActiveTab] = useState("profile");
//   const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
//   const [showPostDetail, setShowPostDetail] = useState(false);
  
//   // --- STATE FOR UI FEEDBACK ---
//   const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
//   const [isUpdatingPost, setIsUpdatingPost] = useState(false); // ADDED: for the top loader
//   const [snackbarOpen, setSnackbarOpen] = useState(false); // ADDED: for snackbar
//   const [snackbarMessage, setSnackbarMessage] = useState(""); // ADDED
//   const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success"); // ADDED
  
//   const [postToEdit, setPostToEdit] = useState<PostType | null>(null);
//   const [showEditModal, setShowEditModal] = useState(false);

//   const [myPosts, setMyPosts] = useState<PostType[]>([]);
//   const [myPostsLoading, setMyPostsLoading] = useState(true);
//   const [myPostsError, setMyPostsError] = useState<string | null>(null);
//   const [myPostsPage, setMyPostsPage] = useState(1);
//   const [myPostsTotalPages, setMyPostsTotalPages] = useState(1);
//   const [myPostsLoadingMore, setMyPostsLoadingMore] = useState(false);

//   const themeYellow = {
//     primary: "#FFC107", primaryDark: "#FFA000", primaryLight: "#FFECB3", text: "#212121"
//   };

//   // ADDED: Reusable function to show notifications
//   const showNotification = useCallback((message: string, severity: "success" | "error") => {
//     setSnackbarMessage(message);
//     setSnackbarSeverity(severity);
//     setSnackbarOpen(true);
//   }, []);

//   const loadMyPosts = useCallback(async (pageNum = 1, replace = true) => {
//     try {
//       if (pageNum === 1) setMyPostsLoading(true);
//       else setMyPostsLoadingMore(true);
//       const data = await fetchUserPosts(pageNum, 5);
//       setMyPosts(prev => replace ? data.posts : [...prev, ...data.posts]);
//       setMyPostsTotalPages(data.totalPages);
//       setMyPostsPage(data.currentPage);
//       setMyPostsError(null);
//     } catch (err) {
//       setMyPostsError("Failed to load your posts.");
//     } finally {
//       setMyPostsLoading(false);
//       setMyPostsLoadingMore(false);
//     }
//   }, []);

//   useEffect(() => {
//     if (activeTab === 'my-posts') {
//         loadMyPosts(1, true);
//     }
//   }, [activeTab, loadMyPosts]);
  
//   useEffect(() => {
//     if (user?._id) {
//         const socket = getSocket() || initializeSocket(user._id);
//         const handlePostUpdated = (updatedPost: PostType) => {
//             setMyPosts(prevPosts =>
//                 prevPosts.map(p => (p._id === updatedPost._id ? updatedPost : p))
//             );
//         };
//         const handlePostDeleted = (data: { postId: string }) => {
//             setMyPosts(prevPosts => prevPosts.filter(p => p._id !== data.postId));
//         };
//         socket.on('postUpdated', handlePostUpdated);
//         socket.on('postDeleted', handlePostDeleted);
//         return () => {
//             socket.off('postUpdated', handlePostUpdated);
//             socket.off('postDeleted', handlePostDeleted);
//         };
//     }
//   }, [user?._id]);

//   const handlePostClick = (post: PostType) => {
//     setSelectedPost(post);
//     setShowPostDetail(true);
//   };

//   const handlePostDetailClose = () => setShowPostDetail(false);

//   const handleEditPostClick = useCallback((post: PostType) => {
//     setPostToEdit(post);
//     setShowEditModal(true);
//   }, []);

//   const handleCloseEditModal = useCallback(() => {
//     setShowEditModal(false);
//     setPostToEdit(null);
//   }, []);
  
//   // MODIFIED: Handlers now manage loading state and show snackbars
//   const handlePostUpdateSuccess = useCallback(() => {
//     setIsUpdatingPost(false);
//     handleCloseEditModal();
//     showNotification("Post updated successfully!", "success");
//   }, [handleCloseEditModal, showNotification]);

//   const handlePostUpdateError = useCallback(() => {
//     setIsUpdatingPost(false);
//     showNotification("Failed to update post. Please try again.", "error");
//   }, [showNotification]);

//   const handleDeletePost = async (postId: string) => {
//     try {
//         await deletePost(postId);
//         // The socket listener will handle removing the post from the state
//         showNotification("Post deleted successfully!", "success");
//     } catch (error) {
//         showNotification("Failed to delete post.", "error");
//     }
//   };

//   const goToCommunity = () => router.push("/community");
//   const handleProfileUpdateStart = () => setIsUpdatingProfile(true);
//   const handleProfileUpdateEnd = () => setIsUpdatingProfile(false);

//   if (authLoading && !isUpdatingProfile) {
//     return (
//       <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
//         <NavBar />
//         <CircularProgress sx={{ color: themeYellow.primary }} />
//       </Box>
//     );
//   }

//   if (!user) {
//     return (
//       <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" p={4}>
//         <Typography variant="h4" fontWeight="bold" mb={4}>Please login to view your profile</Typography>
//         <Button variant="contained" onClick={goToCommunity} sx={{ bgcolor: themeYellow.primary, color: themeYellow.text, "&:hover": { bgcolor: themeYellow.primaryDark } }}>Go to Community</Button>
//       </Box>
//     );
//   }

//   return (
//     <PostStateProvider>
//       <Box component="main" sx={{ minHeight: "100vh", bgcolor: "#F5F5F5", pt: "104px" }}>
//         <NavBar />
        
//         {/* ADDED: Render the loading indicator and snackbar */}
//         <ProfileLoadingIndicator isUpdatingProfile={isUpdatingProfile} isUpdatingPost={isUpdatingPost} />
//         <NotificationSnackbar open={snackbarOpen} message={snackbarMessage} severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)} />

//         <Box maxWidth="7xl" mx="auto" px={{ xs: 2, sm: 3, lg: 4 }} py={3}>
//           <Button onClick={goToCommunity} startIcon={<ArrowLeft size={20} />} sx={{ color: "text.secondary", "&:hover": { color: "text.primary" }, mb: 3, pl: 0 }}>
//             Back to Community
//           </Button>
//           <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={3}>
//             <Box sx={{ width: { md: "256px" }, flexShrink: 0 }}>
//               <Paper elevation={2} sx={{ overflow: "hidden" }}>
//                   <Box sx={{ display: { xs: 'flex', md: 'none' }, overflowX: 'auto' }}>
//                       {['profile', 'my-posts', 'my-courses'].map((tab) => (
//                           <Button key={tab} onClick={() => setActiveTab(tab)} sx={{ flex: 1, py: 2, px: 2, fontWeight: 500, borderRadius: 0, borderBottom: activeTab === tab ? `2px solid ${themeYellow.primary}` : 'none', bgcolor: activeTab === tab ? themeYellow.primaryLight : 'transparent', color: activeTab === tab ? themeYellow.text : 'black', '&:hover': { bgcolor: activeTab === tab ? themeYellow.primaryLight : 'rgba(0,0,0,0.04)' } }}>
//                               {tab.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
//                           </Button>
//                       ))}
//                   </Box>
//                   <Box sx={{ display: { xs: 'none', md: 'block' } }}>
//                       {['profile', 'my-posts', 'my-courses'].map((tab) => (
//                           <Button key={tab} fullWidth onClick={() => setActiveTab(tab)} sx={{ justifyContent: 'flex-start', py: 2, px: 3, fontWeight: 500, borderRadius: 0, borderLeft: activeTab === tab ? `4px solid ${themeYellow.primary}` : 'none', bgcolor: activeTab === tab ? themeYellow.primaryLight : 'transparent', color: activeTab === tab ? themeYellow.primary : 'text.secondary', '&:hover': { bgcolor: activeTab === tab ? themeYellow.primaryLight : 'rgba(0,0,0,0.04)' } }}>
//                               {tab.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
//                           </Button>
//                       ))}
//                   </Box>
//               </Paper>
//             </Box>
//             <Box sx={{ flex: 1 }}>
//               {activeTab === "profile" && <ProfileEditTab user={user} onUpdateStart={handleProfileUpdateStart} onUpdateEnd={handleProfileUpdateEnd} />}
//               {activeTab === "my-posts" && (
//                 <MyPostsTab
//                   posts={myPosts}
//                   loading={myPostsLoading}
//                   error={myPostsError}
//                   page={myPostsPage}
//                   totalPages={myPostsTotalPages}
//                   loadingMore={myPostsLoadingMore}
//                   onLoadMore={() => loadMyPosts(myPostsPage + 1, false)}
//                   onPostClick={handlePostClick}
//                   onEditPost={handleEditPostClick}
//                   onDeletePost={handleDeletePost} // MODIFIED: Pass the new handler
//                 />
//               )}
//               {activeTab === "my-courses" && (
//                 <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
//                   <Typography variant="h5" fontWeight="bold" mb={3}>My Courses</Typography>
//                   <Typography color="text.secondary">We are working on this feature. Stay tuned for updates!</Typography>
//                 </Paper>
//               )}
//             </Box>
//           </Box>
//         </Box>
//         <PostDetailView post={selectedPost} isOpen={showPostDetail} onClose={handlePostDetailClose} />
        
//         {/* MODIFIED: Pass the handlers to the modal */}
//         {showEditModal && (
//           <Suspense fallback={<CircularProgress sx={{ position: 'fixed', top: '50%', left: '50%' }} />}>
//             <CreatePostModal 
//               onClose={handleCloseEditModal} 
//               onPostCreated={handlePostUpdateSuccess}
//               onPostError={handlePostUpdateError}
//               onPostStart={() => setIsUpdatingPost(true)}
//               postToEdit={postToEdit} 
//             />
//           </Suspense>
//         )}
//       </Box>
//     </PostStateProvider>
//   );
// }






"use client";
import { useState, useCallback, Suspense, lazy, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import NavBar from "../../components/Navbar";
import PostDetailView from "../../components/PostDetailView";
import { useAuth } from "../../context/AuthContext";
import ProfileEditTab from "./_components/ProfileEditTab";
import MyPostsTab from "./_components/MyPostsTab";
import ProfileLoadingIndicator from "./_components/ProfileLoadingIndicator";
import NotificationSnackbar from "../../app/community/_components/NotificationSnackbar";
import { Post as PostType, fetchUserPosts, deletePost } from "../../services/postService";
import { PostStateProvider } from "../../types/PostStateContext";
import { CircularProgress, Box, Button, Typography, Paper } from "@mui/material";
import { initializeSocket } from "@/services/socket.service";

const CreatePostModal = lazy(() => import("../../components/CreatePostModal"));

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
  const [showPostDetail, setShowPostDetail] = useState(false);
  
  // --- STATE FOR UI FEEDBACK ---
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPost, setIsUpdatingPost] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  
  const [postToEdit, setPostToEdit] = useState<PostType | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [myPosts, setMyPosts] = useState<PostType[]>([]);
  const [myPostsLoading, setMyPostsLoading] = useState(true);
  const [myPostsError, setMyPostsError] = useState<string | null>(null);
  const [myPostsPage, setMyPostsPage] = useState(1);
  const [myPostsTotalPages, setMyPostsTotalPages] = useState(1);
  const [myPostsLoadingMore, setMyPostsLoadingMore] = useState(false);

  const themeYellow = {
    primary: "#FFC107", primaryDark: "#FFA000", primaryLight: "#FFECB3", text: "#212121"
  };

  const showNotification = useCallback((message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }, []);

  const loadMyPosts = useCallback(async (pageNum = 1, replace = true) => {
    try {
      if (pageNum === 1) setMyPostsLoading(true);
      else setMyPostsLoadingMore(true);
      const data = await fetchUserPosts(pageNum, 5);
      setMyPosts(prev => replace ? data.posts : [...prev, ...data.posts]);
      setMyPostsTotalPages(data.totalPages);
      setMyPostsPage(data.currentPage);
      setMyPostsError(null);
    } catch (err) {
      setMyPostsError("Failed to load your posts.");
    } finally {
      setMyPostsLoading(false);
      setMyPostsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'my-posts' && user) {
        loadMyPosts(1, true);
    }
  }, [activeTab, user, loadMyPosts]);
  
  // --- THE FIX: SOCKET LISTENERS FOR REAL-TIME POST UPDATES ---
  useEffect(() => {
    // Ensure we have a user before setting up listeners
    if (user?._id) {
      const socket = initializeSocket(user._id);

      // Handler for when a post is updated by the current user
      const handlePostUpdated = (data: { post: PostType; message: string }) => {
        setMyPosts(prevPosts =>
          prevPosts.map(p => (p._id === data.post._id ? data.post : p))
        );
        if (selectedPost?._id === data.post._id) {
          setSelectedPost(data.post);
        }
        showNotification(data.message, "success");
      };

      // Handler for when a post is deleted by the current user
      const handlePostDeleted = (data: { postId: string; message: string }) => {
        setMyPosts(prevPosts => prevPosts.filter(post => post._id !== data.postId));
        showNotification(data.message, "success");
        if (selectedPost?._id === data.postId) {
          setShowPostDetail(false);
          setSelectedPost(null);
        }
      };

      // Attach the listeners to the socket events
      socket.on('postUpdated', handlePostUpdated);
      socket.on('postDeleted', handlePostDeleted);

      // Clean up listeners on component unmount or when dependencies change
      return () => {
        socket.off('postUpdated', handlePostUpdated);
        socket.off('postDeleted', handlePostDeleted);
      };
    }
  }, [user?._id, setMyPosts, showNotification, selectedPost, setSelectedPost, setShowPostDetail]);

  const handlePostClick = (post: PostType) => {
    setSelectedPost(post);
    setShowPostDetail(true);
  };

  const handlePostDetailClose = () => setShowPostDetail(false);

  const handleEditPostClick = useCallback((post: PostType) => {
    setPostToEdit(post);
    setShowEditModal(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setShowEditModal(false);
    setPostToEdit(null);
  }, []);
  
  // MODIFIED: This function no longer shows a notification. Sockets will.
  const handlePostUpdateSuccess = useCallback(() => {
    setIsUpdatingPost(false);
    handleCloseEditModal();
  }, [handleCloseEditModal]);

  const handlePostUpdateError = useCallback(() => {
    setIsUpdatingPost(false);
    showNotification("Failed to update post. Please try again.", "error");
  }, [showNotification]);


  // const handleDeletePost = async (postId: string) => {
  //   try {
  //     // The API call triggers the backend to emit a 'postDeleted' event
  //     await deletePost(postId);
  //     // The socket listener 'handlePostDeleted' will update the UI and show the notification.
  //   } catch (error) {
  //     // Show error notification only if the API call itself fails
  //     showNotification("Failed to delete post.", "error");
  //   }
  // };

const handleDeletePost = async (postId: string) => {
    // The 'async' keyword is added here to satisfy the prop type.
    // The function still behaves as "Fire-and-Forget" because we don't 'await' the result.
    deletePost(postId).catch(error => {
      //console.error("Background delete post API call failed:", error);
    });
  };





  const goToCommunity = () => router.push("/community");
  const handleProfileUpdateStart = () => setIsUpdatingProfile(true);
  const handleProfileUpdateEnd = () => setIsUpdatingProfile(false);

  if (authLoading && !isUpdatingProfile) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
        <NavBar />
        <CircularProgress sx={{ color: themeYellow.primary }} />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" p={4}>
        <Typography variant="h4" fontWeight="bold" mb={4}>Please login to view your profile</Typography>
        <Button variant="contained" onClick={goToCommunity} sx={{ bgcolor: themeYellow.primary, color: themeYellow.text, "&:hover": { bgcolor: themeYellow.primaryDark } }}>Go to Community</Button>
      </Box>
    );
  }

  return (
    <PostStateProvider>
      <Box component="main" sx={{ minHeight: "100vh", bgcolor: "#F5F5F5", pt: "104px" }}>
        <NavBar />
        
        <ProfileLoadingIndicator isUpdatingProfile={isUpdatingProfile} isUpdatingPost={isUpdatingPost} />
        <NotificationSnackbar open={snackbarOpen} message={snackbarMessage} severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)} />

        <Box maxWidth="7xl" mx="auto" px={{ xs: 2, sm: 3, lg: 4 }} py={3}>
          <Button onClick={goToCommunity} startIcon={<ArrowLeft size={20} />} sx={{ color: "text.secondary", "&:hover": { color: "text.primary" }, mb: 3, pl: 0 }}>
            Back to Community
          </Button>
          <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={3}>
      <Box sx={{ width: { md: "256px" }, flexShrink: 0 }}>
  <Paper elevation={2} sx={{ overflow: "hidden" }}>

    {/* Mobile Tabs - Add this block back from your old code */}
    <Box
      sx={{
        display: { xs: "flex", md: "none" },
        overflowX: "auto",
      }}
    >
      {["profile", "my-posts", "my-courses"].map((tab) => (
        <Button
          key={tab}
          onClick={() => setActiveTab(tab)}
          sx={{
            flex: 1,
            py: 2,
            px: 2,
            fontWeight: 500,
            borderRadius: 0,
            borderBottom: activeTab === tab ? `2px solid ${themeYellow.primary}` : "none",
            bgcolor: activeTab === tab ? `${themeYellow.primaryLight}` : "transparent",
            color: activeTab === tab ? themeYellow.text : "black",
            "&:hover": {
              bgcolor: activeTab === tab ? themeYellow.primaryLight : "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          {tab === "profile" ? "Profile" : tab === "my-posts" ? "My Posts" : "My Courses"}
        </Button>
      ))}
    </Box>

    {/* Desktop Sidebar - This part is already in your new code */}
    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
      {['profile', 'my-posts', 'my-courses'].map((tab) => (
        <Button
          key={tab}
          fullWidth
          onClick={() => setActiveTab(tab)}
          sx={{
            justifyContent: 'flex-start',
            py: 2,
            px: 3,
            fontWeight: 500,
            borderRadius: 0,
            borderLeft: activeTab === tab ? `4px solid ${themeYellow.primary}` : 'none',
            bgcolor: activeTab === tab ? themeYellow.primaryLight : 'transparent',
            color: activeTab === tab ? themeYellow.primary : 'text.secondary',
            '&:hover': {
              bgcolor: activeTab === tab ? themeYellow.primaryLight : 'rgba(0,0,0,0.04)'
            }
          }}
        >
          {tab.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </Button>
      ))}
    </Box>

  </Paper>
</Box>
            <Box sx={{ flex: 1 }}>
              {activeTab === "profile" && <ProfileEditTab user={user} onUpdateStart={handleProfileUpdateStart} onUpdateEnd={handleProfileUpdateEnd} />}
              {activeTab === "my-posts" && (
                <MyPostsTab
                  posts={myPosts}
                  loading={myPostsLoading}
                  error={myPostsError}
                  page={myPostsPage}
                  totalPages={myPostsTotalPages}
                  loadingMore={myPostsLoadingMore}
                  onLoadMore={() => loadMyPosts(myPostsPage + 1, false)}
                  onPostClick={handlePostClick}
                  onEditPost={handleEditPostClick}
                  onDeletePost={handleDeletePost}
                />
              )}
              {activeTab === "my-courses" && (
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                  <Typography variant="h5" fontWeight="bold" mb={3}>My Courses</Typography>
                  <Typography color="text.secondary">We are working on this feature. Stay tuned for updates!</Typography>
                </Paper>
              )}
            </Box>
          </Box>
        </Box>
        <PostDetailView post={selectedPost} isOpen={showPostDetail} onClose={handlePostDetailClose} />
        
        {showEditModal && (
          <Suspense fallback={<CircularProgress sx={{ position: 'fixed', top: '50%', left: '50%' }} />}>
            <CreatePostModal 
              onClose={handleCloseEditModal} 
              onPostCreated={handlePostUpdateSuccess}
              onPostError={handlePostUpdateError}
              onPostStart={() => setIsUpdatingPost(true)}
              postToEdit={postToEdit} 
            />
          </Suspense>
        )}
      </Box>
    </PostStateProvider>
  );
}