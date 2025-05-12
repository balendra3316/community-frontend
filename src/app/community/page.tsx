


// // src/app/community/page.tsx
// "use client"
// import { useState, useEffect } from 'react';
// import NavBar from '../../components/Navbar';
// import Post from '../../components/Post';
// import CreatePostModal from '../../components/CreatePostModal';
// import CommunityInfoSidebar from '../../components/CommunityInfoSidebar';
// import PostDetailView from '../../components/PostDetailView';
// import { ChevronDown, Loader2 } from 'lucide-react';
// import { fetchPosts, Post as PostType } from '../../services/postService';
// import { useAuth } from '../../context/AuthContext';



// export default function Community() {
//   const { user } = useAuth();
//   const [showModal, setShowModal] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
//   const [showPostDetail, setShowPostDetail] = useState(false);
  
//   // State for API data
//   const [posts, setPosts] = useState<PostType[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loadingMore, setLoadingMore] = useState(false);

//   // Fetch posts
//   const loadPosts = async (pageNum = 1, replace = true) => {
//     try {
//       setLoading(pageNum === 1);
//       setLoadingMore(pageNum > 1);
      
//       const response = await fetchPosts(pageNum);
      
//       if (replace) {
//         setPosts(response.posts);
//       } else {
//         setPosts(prev => [...prev, ...response.posts]);
//       }
      
//       setTotalPages(response.totalPages);
//       setPage(response.currentPage);
//       setError(null);
//     } catch (err) {
//       setError('Failed to load posts. Please try again later.');
//       console.error('Error loading posts:', err);
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//     }
//   };

//   // Initial load
//   useEffect(() => {
//     loadPosts();
//   }, []);

//   // Reload posts after creating a new one
//   const handlePostCreated = () => {
//     loadPosts();
//     setShowModal(false);
//   };

//   // Filter posts based on selected category
//   const filteredPosts = selectedCategory === 'All' 
//     ? posts 
//     : posts.filter(post => post.tags && post.tags.includes(selectedCategory));

//   // Sort posts to show pinned posts first
//   const sortedPosts = [...filteredPosts].sort((a, b) => {
//     if (a.isPinned && !b.isPinned) return -1;
//     if (!a.isPinned && b.isPinned) return 1;
//     return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
//   });

//   // Function to handle clicking on a post
//   const handlePostClick = (post: PostType) => {
//     setSelectedPost(post);
//     setShowPostDetail(true);
//   };

//   // Function to handle adding a comment
//   const handleAddComment = (comment: string) => {
//     console.log('Adding comment:', comment);
//     // This will be implemented later according to your request
//   };

//   // Load more posts
//   const handleLoadMore = () => {
//     if (page < totalPages) {
//       loadPosts(page + 1, false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-gray-50 pt-[104px]">
//       <NavBar />
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="flex flex-col lg:flex-row gap-6">
//           {/* Main content - Left side */}
//           <div className="flex-1">
//             {/* Create Post Section */}
//             <div className="bg-white rounded-lg shadow mb-6 p-4">
//               <div 
//                 className="flex items-center cursor-pointer" 
//                 onClick={() => setShowModal(true)}
//               >
//                 <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden">
//                   <img
//                     src={user?.avatar || "/api/placeholder/40/40"}
//                     alt="User Profile"
//                     className="h-full w-full object-cover"
//                   />
//                 </div>
//                 <div className="flex-1 ml-3 bg-gray-100 rounded-full px-4 py-2 text-gray-500">
//                   Write something...
//                 </div>
//               </div>
//             </div>

//             {/* Category Filter */}
//             <div className="mb-6 flex flex-wrap items-center gap-2">
//               <button 
//                 className={`rounded-full px-4 py-2 text-sm font-medium ${
//                   selectedCategory === 'All' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                 }`}
//                 onClick={() => setSelectedCategory('All')}
//               >
//                 All
//               </button>
              
//               {['DanceTips', 'SelfLove', 'Events'].map((category) => (
//                 <button 
//                   key={category}
//                   className={`rounded-full px-4 py-2 text-sm font-medium ${
//                     selectedCategory === category ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                   }`}
//                   onClick={() => setSelectedCategory(category)}
//                 >
//                   {category}
//                 </button>
//               ))}
              
//               <button className="ml-auto rounded-full p-2 bg-gray-200 hover:bg-gray-300">
//                 <ChevronDown size={18} />
//               </button>
//             </div>

//             {/* Loading State */}
//             {loading && (
//               <div className="flex justify-center items-center py-12">
//                 <Loader2 size={40} className="animate-spin text-gray-500" />
//               </div>
//             )}

//             {/* Error State */}
//             {error && (
//               <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
//                 {error}
//                 <button 
//                   className="ml-4 underline"
//                   onClick={() => loadPosts()}
//                 >
//                   Try again
//                 </button>
//               </div>
//             )}

//             {/* Empty State */}
//             {!loading && !error && sortedPosts.length === 0 && (
//               <div className="bg-white rounded-lg shadow p-6 text-center">
//                 <h3 className="text-lg font-medium text-gray-700 mb-2">No posts found</h3>
//                 <p className="text-gray-500">Be the first to share something with the community!</p>
//                 <button 
//                   className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//                   onClick={() => setShowModal(true)}
//                 >
//                   Create Post
//                 </button>
//               </div>
//             )}

//             {/* Posts List */}
//             {!loading && !error && sortedPosts.length > 0 && (
//               <div className="space-y-6">
//                 {sortedPosts.map((post) => (
//                   <div key={post._id} onClick={() => handlePostClick(post)} className="cursor-pointer">
//                     <Post post={post} onRefresh={() => loadPosts()} />
//                   </div>
//                 ))}
                
//                 {/* Load More */}
//                 {page < totalPages && (
//                   <div className="flex justify-center mt-6">
//                     <button 
//                       className="bg-white border border-gray-300 rounded-lg px-6 py-3 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-50"
//                       onClick={handleLoadMore}
//                       disabled={loadingMore}
//                     >
//                       {loadingMore ? (
//                         <Loader2 size={20} className="animate-spin mx-auto" />
//                       ) : (
//                         'Load More Posts'
//                       )}
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
          
//           {/* Community Info Sidebar - Right side */}
//           <div className="hidden lg:block w-80">
//             <CommunityInfoSidebar />
//           </div>
//         </div>
//       </div>
        
//       {/* Create Post Modal */}
//       {showModal && (
//         <CreatePostModal onClose={() => setShowModal(false)} onPostCreated={handlePostCreated} />
//       )}

//       {/* Post Detail View */}
//       <PostDetailView
//         post={selectedPost}
//         isOpen={showPostDetail}
//         onClose={() => setShowPostDetail(false)}
        
//       />
//     </main>
//   );
// }














// "use client"
// import { useState, useEffect } from 'react';
// import NavBar from '../../components/Navbar';
// import Post from '../../components/Post';
// import CreatePostModal from '../../components/CreatePostModal';
// import CommunityInfoSidebar from '../../components/CommunityInfoSidebar';
// import PostDetailView from '../../components/PostDetailView';
// import { ChevronDown, Loader2 } from 'lucide-react';
// import { fetchPosts, Post as PostType } from '../../services/postService';
// import { useAuth } from '../../context/AuthContext';

// export default function Community() {
//   const { user } = useAuth();
//   const [showModal, setShowModal] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
//   const [showPostDetail, setShowPostDetail] = useState(false);
  
//   // State for API data
//   const [posts, setPosts] = useState<PostType[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loadingMore, setLoadingMore] = useState(false);

//   // Fetch posts
//   const loadPosts = async (pageNum = 1, replace = true) => {
//     try {
//       setLoading(pageNum === 1);
//       setLoadingMore(pageNum > 1);
      
//       const response = await fetchPosts(pageNum);
      
//       if (replace) {
//         setPosts(response.posts);
//       } else {
//         setPosts(prev => [...prev, ...response.posts]);
//       }
      
//       setTotalPages(response.totalPages);
//       setPage(response.currentPage);
//       setError(null);
//     } catch (err) {
//       setError('Failed to load posts. Please try again later.');
//       console.error('Error loading posts:', err);
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//     }
//   };

//   // Initial load
//   useEffect(() => {
//     loadPosts();
//   }, []);

//   // Reload posts after creating a new one
//   const handlePostCreated = () => {
//     loadPosts();
//     setShowModal(false);
//   };

//   // Filter posts based on selected category
//   const filteredPosts = selectedCategory === 'All' 
//     ? posts 
//     : posts.filter(post => post.tags && post.tags.includes(selectedCategory));

//   // Sort posts to show pinned posts first
//   const sortedPosts = [...filteredPosts].sort((a, b) => {
//     if (a.isPinned && !b.isPinned) return -1;
//     if (!a.isPinned && b.isPinned) return 1;
//     return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
//   });

//   // Function to handle clicking on a post
//   const handlePostClick = (post: PostType) => {
//     setSelectedPost(post);
//     setShowPostDetail(true);
//   };

//   // Function to handle adding a comment
//   const handleAddComment = (comment: string) => {
//     console.log('Adding comment:', comment);
//     // This will be implemented later according to your request
//   };

//   // Load more posts
//   const handleLoadMore = () => {
//     if (page < totalPages) {
//       loadPosts(page + 1, false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-gray-50 pt-[104px]">
//       <NavBar />
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="flex flex-col lg:flex-row gap-6">
//           {/* Main content - Left side */}
//           <div className="flex-1">
//             {/* Create Post Section */}
//             <div className="bg-white rounded-lg shadow mb-6 p-4">
//               <div 
//                 className="flex items-center cursor-pointer" 
//                 onClick={() => setShowModal(true)}
//               >
//                 <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden">
//                   <img
//                     src={user?.avatar || "/api/placeholder/40/40"}
//                     alt="User Profile"
//                     className="h-full w-full object-cover"
//                   />
//                 </div>
//                 <div className="flex-1 ml-3 bg-gray-100 rounded-full px-4 py-2 text-gray-500">
//                   Write something...
//                 </div>
//               </div>
//             </div>

//             {/* Category Filter */}
//             <div className="mb-6 flex flex-wrap items-center gap-2">
//               <button 
//                 className={`rounded-full px-4 py-2 text-sm font-medium ${
//                   selectedCategory === 'All' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                 }`}
//                 onClick={() => setSelectedCategory('All')}
//               >
//                 All
//               </button>
              
//               {['DanceTips', 'SelfLove', 'Events'].map((category) => (
//                 <button 
//                   key={category}
//                   className={`rounded-full px-4 py-2 text-sm font-medium ${
//                     selectedCategory === category ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                   }`}
//                   onClick={() => setSelectedCategory(category)}
//                 >
//                   {category}
//                 </button>
//               ))}
              
//               <button className="ml-auto rounded-full p-2 bg-gray-200 hover:bg-gray-300">
//                 <ChevronDown size={18} />
//               </button>
//             </div>

//             {/* Loading State */}
//             {loading && (
//               <div className="flex justify-center items-center py-12">
//                 <Loader2 size={40} className="animate-spin text-gray-500" />
//               </div>
//             )}

//             {/* Error State */}
//             {error && (
//               <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
//                 {error}
//                 <button 
//                   className="ml-4 underline"
//                   onClick={() => loadPosts()}
//                 >
//                   Try again
//                 </button>
//               </div>
//             )}

//             {/* Empty State */}
//             {!loading && !error && sortedPosts.length === 0 && (
//               <div className="bg-white rounded-lg shadow p-6 text-center">
//                 <h3 className="text-lg font-medium text-gray-700 mb-2">No posts found</h3>
//                 <p className="text-gray-500">Be the first to share something with the community!</p>
//                 <button 
//                   className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//                   onClick={() => setShowModal(true)}
//                 >
//                   Create Post
//                 </button>
//               </div>
//             )}

//             {/* Posts List */}
//             {!loading && !error && sortedPosts.length > 0 && (
//               <div className="space-y-6">
//                 {sortedPosts.map((post) => (
//                   <div key={post._id} onClick={() => handlePostClick(post)} className="cursor-pointer">
//                     {/* Pass null as onRefresh to avoid triggering loadPosts when liking */}
//                     <Post post={post} />
//                   </div>
//                 ))}
                
//                 {/* Load More */}
//                 {page < totalPages && (
//                   <div className="flex justify-center mt-6">
//                     <button 
//                       className="bg-white border border-gray-300 rounded-lg px-6 py-3 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-50"
//                       onClick={handleLoadMore}
//                       disabled={loadingMore}
//                     >
//                       {loadingMore ? (
//                         <Loader2 size={20} className="animate-spin mx-auto" />
//                       ) : (
//                         'Load More Posts'
//                       )}
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
          
//           {/* Community Info Sidebar - Right side */}
//           <div className="hidden lg:block w-80">
//             <CommunityInfoSidebar />
//           </div>
//         </div>
//       </div>
        
//       {/* Create Post Modal */}
//       {showModal && (
//         <CreatePostModal onClose={() => setShowModal(false)} onPostCreated={handlePostCreated} />
//       )}

//       {/* Post Detail View */}
//       <PostDetailView
//         post={selectedPost}
//         isOpen={showPostDetail}
//         onClose={() => setShowPostDetail(false)}
//       />
//     </main>
//   );
// }




















// "use client"
// import { useState, useEffect } from 'react';
// import NavBar from '../../components/Navbar';
// import Post from '../../components/Post';
// import CreatePostModal from '../../components/CreatePostModal';
// import CommunityInfoSidebar from '../../components/CommunityInfoSidebar';
// import PostDetailView from '../../components/PostDetailView';
// import { ChevronDown, Loader2 } from 'lucide-react';
// import { fetchPosts, Post as PostType } from '../../services/postService';
// import { useAuth } from '../../context/AuthContext';

// export default function Community() {
//   const { user } = useAuth();
//   const [showModal, setShowModal] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
//   const [showPostDetail, setShowPostDetail] = useState(false);
  
//   // State for API data
//   const [posts, setPosts] = useState<PostType[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loadingMore, setLoadingMore] = useState(false);

//   // Fetch posts
//   const loadPosts = async (pageNum = 1, replace = true) => {
//     try {
//       setLoading(pageNum === 1);
//       setLoadingMore(pageNum > 1);
      
//       const response = await fetchPosts(pageNum);
      
//       if (replace) {
//         setPosts(response.posts);
//       } else {
//         setPosts(prev => [...prev, ...response.posts]);
//       }
      
//       setTotalPages(response.totalPages);
//       setPage(response.currentPage);
//       setError(null);
//     } catch (err) {
//       setError('Failed to load posts. Please try again later.');
//       console.error('Error loading posts:', err);
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//     }
//   };

//   // Initial load
//   useEffect(() => {
//     loadPosts();
//   }, []);

//   // Reload posts after creating a new one
//   const handlePostCreated = () => {
//     loadPosts();
//     setShowModal(false);
//   };

//   // Filter posts based on selected category
//   const filteredPosts = selectedCategory === 'All' 
//     ? posts 
//     : posts.filter(post => post.tags && post.tags.includes(selectedCategory));

//   // Sort posts to show pinned posts first
//   const sortedPosts = [...filteredPosts].sort((a, b) => {
//     if (a.isPinned && !b.isPinned) return -1;
//     if (!a.isPinned && b.isPinned) return 1;
//     return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
//   });

//   // Function to handle clicking on a post
//   const handlePostClick = (post: PostType) => {
//     // Find the most up-to-date version of this post in our state
//     const updatedPost = posts.find(p => p._id === post._id) || post;
//     setSelectedPost(updatedPost);
//     setShowPostDetail(true);
//   };
  

//   // Load more posts
//   const handleLoadMore = () => {
//     if (page < totalPages) {
//       loadPosts(page + 1, false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-gray-50 pt-[104px]">
//       <NavBar />
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="flex flex-col lg:flex-row gap-6">
//           {/* Main content - Left side */}
//           <div className="flex-1">
//             {/* Create Post Section */}
//             <div className="bg-white rounded-lg shadow mb-6 p-4">
//               <div 
//                 className="flex items-center cursor-pointer" 
//                 onClick={() => setShowModal(true)}
//               >
//                 <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden">
//                   <img
//                     src={user?.avatar || "/api/placeholder/40/40"}
//                     alt="User Profile"
//                     className="h-full w-full object-cover"
//                   />
//                 </div>
//                 <div className="flex-1 ml-3 bg-gray-100 rounded-full px-4 py-2 text-gray-500">
//                   Write something...
//                 </div>
//               </div>
//             </div>

//             {/* Category Filter */}
//             <div className="mb-6 flex flex-wrap items-center gap-2">
//               <button 
//                 className={`rounded-full px-4 py-2 text-sm font-medium ${
//                   selectedCategory === 'All' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                 }`}
//                 onClick={() => setSelectedCategory('All')}
//               >
//                 All
//               </button>
              
//               {['DanceTips', 'SelfLove', 'Events'].map((category) => (
//                 <button 
//                   key={category}
//                   className={`rounded-full px-4 py-2 text-sm font-medium ${
//                     selectedCategory === category ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                   }`}
//                   onClick={() => setSelectedCategory(category)}
//                 >
//                   {category}
//                 </button>
//               ))}
              
//               <button className="ml-auto rounded-full p-2 bg-gray-200 hover:bg-gray-300">
//                 <ChevronDown size={18} />
//               </button>
//             </div>

//             {/* Loading State */}
//             {loading && (
//               <div className="flex justify-center items-center py-12">
//                 <Loader2 size={40} className="animate-spin text-gray-500" />
//               </div>
//             )}

//             {/* Error State */}
//             {error && (
//               <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
//                 {error}
//                 <button 
//                   className="ml-4 underline"
//                   onClick={() => loadPosts()}
//                 >
//                   Try again
//                 </button>
//               </div>
//             )}

//             {/* Empty State */}
//             {!loading && !error && sortedPosts.length === 0 && (
//               <div className="bg-white rounded-lg shadow p-6 text-center">
//                 <h3 className="text-lg font-medium text-gray-700 mb-2">No posts found</h3>
//                 <p className="text-gray-500">Be the first to share something with the community!</p>
//                 <button 
//                   className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//                   onClick={() => setShowModal(true)}
//                 >
//                   Create Post
//                 </button>
//               </div>
//             )}

//             {/* Posts List */}
//             {!loading && !error && sortedPosts.length > 0 && (
//               <div className="space-y-6">
//                 {sortedPosts.map((post) => (
//                  <div key={post._id} onClick={() => handlePostClick(post)} className="cursor-pointer">
//                  <Post 
//                    post={post} 
//                    onRefresh={() => {
//                      // Update the posts state with the updated post
//                      const updatedPosts = posts.map(p => p._id === post._id ? post : p);
//                      setPosts(updatedPosts);
//                    }}
//                  />
//                </div>
//                 ))}
                
//                 {/* Load More */}
//                 {page < totalPages && (
//                   <div className="flex justify-center mt-6">
//                     <button 
//                       className="bg-white border border-gray-300 rounded-lg px-6 py-3 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-50"
//                       onClick={handleLoadMore}
//                       disabled={loadingMore}
//                     >
//                       {loadingMore ? (
//                         <Loader2 size={20} className="animate-spin mx-auto" />
//                       ) : (
//                         'Load More Posts'
//                       )}
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
          
//           {/* Community Info Sidebar - Right side */}
//           <div className="hidden lg:block w-80">
//             <CommunityInfoSidebar />
//           </div>
//         </div>
//       </div>
        
//       {/* Create Post Modal */}
//       {showModal && (
//         <CreatePostModal onClose={() => setShowModal(false)} onPostCreated={handlePostCreated} />
//       )}

//       {/* Post Detail View */}
//       <PostDetailView
//         post={selectedPost}
//         isOpen={showPostDetail}
//         onClose={() => setShowPostDetail(false)}
//       />
//     </main>
//   );
// }
























"use client"
import { useState, useEffect } from 'react';
import NavBar from '../../components/Navbar';
import Post from '../../components/Post';
import CreatePostModal from '../../components/CreatePostModal';
import CommunityInfoSidebar from '../../components/CommunityInfoSidebar';
import PostDetailView from '../../components/PostDetailView';
import { ChevronDown, Loader2 } from 'lucide-react';
import { fetchPosts, Post as PostType } from '../../services/postService';
import { useAuth } from '../../context/AuthContext';
import { PostStateProvider } from '../../types/PostStateContext'; 

export default function Community() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
  const [showPostDetail, setShowPostDetail] = useState(false);
  
  // State for API data
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch posts
  const loadPosts = async (pageNum = 1, replace = true) => {
    try {
      setLoading(pageNum === 1);
      setLoadingMore(pageNum > 1);
      
      const response = await fetchPosts(pageNum);
      
      if (replace) {
        setPosts(response.posts);
      } else {
        setPosts(prev => [...prev, ...response.posts]);
      }
      
      setTotalPages(response.totalPages);
      setPage(response.currentPage);
      setError(null);
    } catch (err) {
      setError('Failed to load posts. Please try again later.');
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadPosts();
  }, []);

  // Reload posts after creating a new one
  const handlePostCreated = () => {
    loadPosts();
    setShowModal(false);
  };

  // Filter posts based on selected category
  const filteredPosts = selectedCategory === 'All' 
    ? posts 
    : posts.filter(post => post.tags && post.tags.includes(selectedCategory));

  // Sort posts to show pinned posts first
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Function to handle clicking on a post
  const handlePostClick = (post: PostType) => {
    // Find the most up-to-date version of this post in our state
    const updatedPost = posts.find(p => p._id === post._id) || post;
    setSelectedPost(updatedPost);
    setShowPostDetail(true);
  };
  

  // Load more posts
  const handleLoadMore = () => {
    if (page < totalPages) {
      loadPosts(page + 1, false);
    }
  };

  return (
    <PostStateProvider>
    <main className="min-h-screen bg-gray-50 pt-[104px]">
      
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content - Left side */}
          <div className="flex-1">
            {/* Create Post Section */}
            <div className="bg-white rounded-lg shadow mb-6 p-4">
              <div 
                className="flex items-center cursor-pointer" 
                onClick={() => setShowModal(true)}
              >
                <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden">
                  <img
                    src={user?.avatar || "/api/placeholder/40/40"}
                    alt="User Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 ml-3 bg-gray-100 rounded-full px-4 py-2 text-gray-500">
                  Write something...
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <button 
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  selectedCategory === 'All' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setSelectedCategory('All')}
              >
                All
              </button>
              
              {['DanceTips', 'SelfLove', 'Events'].map((category) => (
                <button 
                  key={category}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    selectedCategory === category ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
              
              <button className="ml-auto rounded-full p-2 bg-gray-200 hover:bg-gray-300">
                <ChevronDown size={18} />
              </button>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 size={40} className="animate-spin text-gray-500" />
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
                {error}
                <button 
                  className="ml-4 underline"
                  onClick={() => loadPosts()}
                >
                  Try again
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && sortedPosts.length === 0 && (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <h3 className="text-lg font-medium text-gray-700 mb-2">No posts found</h3>
                <p className="text-gray-500">Be the first to share something with the community!</p>
                <button 
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  onClick={() => setShowModal(true)}
                >
                  Create Post
                </button>
              </div>
            )}

            {/* Posts List */}
            {!loading && !error && sortedPosts.length > 0 && (
              <div className="space-y-6">
                {sortedPosts.map((post) => (
                 <div key={post._id} onClick={() => handlePostClick(post)} className="cursor-pointer">
                 <Post 
                   post={post} 
                   onRefresh={() => {
                     // Update the posts state with the updated post
                     const updatedPosts = posts.map(p => p._id === post._id ? post : p);
                     setPosts(updatedPosts);
                   }}
                 />
               </div>
                ))}
                
                {/* Load More */}
                {page < totalPages && (
                  <div className="flex justify-center mt-6">
                    <button 
                      className="bg-white border border-gray-300 rounded-lg px-6 py-3 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-50"
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                    >
                      {loadingMore ? (
                        <Loader2 size={20} className="animate-spin mx-auto" />
                      ) : (
                        'Load More Posts'
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Community Info Sidebar - Right side */}
          <div className="hidden lg:block w-80">
            <CommunityInfoSidebar />
          </div>
        </div>
      </div>
        
      {/* Create Post Modal */}
      {showModal && (
        <CreatePostModal onClose={() => setShowModal(false)} onPostCreated={handlePostCreated} />
      )}

      {/* Post Detail View */}
      <PostDetailView
        post={selectedPost}
        isOpen={showPostDetail}
        onClose={() => setShowPostDetail(false)}
      />
    </main>
    </PostStateProvider>
  );
}