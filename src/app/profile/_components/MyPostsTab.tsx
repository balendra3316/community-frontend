



// //src/app/profile/_components/MyPostTab

// "use client"
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { Loader2 } from 'lucide-react';
// import Post from '../../../components/Post';
// import { fetchUserPosts, Post as PostType } from '../../../services/postService';

// interface MyPostsTabProps {
//   user: {
//     _id?: string;
//     googleId?: string;
//     email?: string;
//     name?: string;
//     avatar?: string;
//   };
//   onPostClick: (post: PostType) => void;
// }

// export default function MyPostsTab({ user, onPostClick }: MyPostsTabProps) {
//   const router = useRouter();
//   const [posts, setPosts] = useState<PostType[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loadingMore, setLoadingMore] = useState(false);

//   // Load user posts when component mounts
//   useEffect(() => {
//     loadUserPosts();
//   }, []);

//   const loadUserPosts = async (pageNum = 1, replace = true) => {
//     if (!user) return;
    
//     try {
//       setLoading(pageNum === 1);
//       setLoadingMore(pageNum > 1);
      
//       const response = await fetchUserPosts(pageNum);
      
//       if (replace) {
//         setPosts(response.posts);
//       } else {
//         setPosts(prev => [...prev, ...response.posts]);
//       }
      
//       setTotalPages(response.totalPages);
//       setPage(response.currentPage);
//       setError(null);
//     } catch (err) {
//       setError('Failed to load your posts. Please try again later.');
//       console.error('Error loading user posts:', err);
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//     }
//   };
  
//   const handleLoadMore = () => {
//     if (page < totalPages) {
//       loadUserPosts(page + 1, false);
//     }
//   };

//   return (
//     <div>
//       {/* <h2 className="text-2xl font-bold mb-6 pl-[80px]">My Posts</h2> */}
      
//       {/* Loading State */}
//       {loading && (
//         <div className="flex justify-center items-center py-12">
//           <Loader2 size={40} className="animate-spin text-gray-500" />
//         </div>
//       )}

//       {/* Error State */}
//       {error && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
//           {error}
//           <button 
//             className="ml-4 underline"
//             onClick={() => loadUserPosts(1, true)}
//           >
//             Try again
//           </button>
//         </div>
//       )}

//       {/* Empty State */}
//       {!loading && !error && posts.length === 0 && (
//         <div className="bg-white rounded-lg shadow p-6 text-center">
//           <h3 className="text-lg font-medium text-gray-700 mb-2">No posts yet</h3>
//           <p className="text-gray-500">You haven't created any posts yet.</p>
//           <button 
//             className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//             onClick={() => router.push('/community')}
//           >
//             Go to Community to Create Post
//           </button>
//         </div>
//       )}

//       {/* Posts List */}
//       {!loading && !error && posts.length > 0 && (
//         <div className="space-y-6">
//           {posts.map((post) => (
//             <div key={post._id} onClick={() => onPostClick(post)} className="cursor-pointer">
//               <Post 
//                 post={post} 
//                 onRefresh={() => {
//                    setPosts(prev => prev.map(p => p._id === post._id ? post : p));
//                 }} 
//                  onDelete={(deletedPostId) => {
//     // Remove the deleted post from the posts state
//     setPosts(prev => prev.filter(p => p._id !== deletedPostId));
//     loadUserPosts
//   }}
//               />
//             </div>
//           ))}
          
//           {/* Load More Button */}
//           {page < totalPages && (
//             <div className="flex justify-center mt-6">
//               <button 
//                 className="bg-white border border-gray-300 rounded-lg px-6 py-3 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-50"
//                 onClick={() => handleLoadMore()}
//                 disabled={loadingMore}
//               >
//                 {loadingMore ? (
//                   <Loader2 size={20} className="animate-spin mx-auto" />
//                 ) : (
//                   'Load More Posts'
//                 )}
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }













//src/app/profile/_components/MyPostTab

"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Post from '../../../components/Post';
import { fetchUserPosts, Post as PostType } from '../../../services/postService';
import { initializeSocket } from '../../../services/socket.service';

interface MyPostsTabProps {
  user: {
    _id?: string;
    googleId?: string;
    email?: string;
    name?: string;
    avatar?: string;
  };
  onPostClick: (post: PostType) => void;
}

export default function MyPostsTab({ user, onPostClick }: MyPostsTabProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // Load user posts when component mounts
  useEffect(() => {
    loadUserPosts();
  }, []);

  // Socket initialization and event listeners for post deletion
  useEffect(() => {
    if (user?._id) {
      try {
        const socket = initializeSocket(user._id);

        // Listen for user-specific post deletion events
        const handlePostDeleted = (data: { postId: string; message: string }) => {
          console.log('User post deleted from profile:', data);
          
          // Remove the deleted post from the posts array
          setPosts(prevPosts => prevPosts.filter(post => post._id !== data.postId));
          
          // Optional: You could show a toast notification here if you have one
          console.log(data.message);
        };

        // Add event listener
        socket.on('postDeleted', handlePostDeleted);

        // Cleanup function
        return () => {
          socket.off('postDeleted', handlePostDeleted);
        };
      } catch (error) {
        console.error('Socket initialization error in MyPostsTab:', error);
      }
    }
  }, [user?._id]);

  const loadUserPosts = async (pageNum = 1, replace = true) => {
    if (!user) return;
    
    try {
      setLoading(pageNum === 1);
      setLoadingMore(pageNum > 1);
      
      const response = await fetchUserPosts(pageNum);
      
      if (replace) {
        setPosts(response.posts);
      } else {
        setPosts(prev => [...prev, ...response.posts]);
      }
      
      setTotalPages(response.totalPages);
      setPage(response.currentPage);
      setError(null);
    } catch (err) {
      setError('Failed to load your posts. Please try again later.');
      console.error('Error loading user posts:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };
  
  const handleLoadMore = () => {
    if (page < totalPages) {
      loadUserPosts(page + 1, false);
    }
  };

  const handlePostDelete = (deletedPostId: string) => {
    // Remove the deleted post from the posts state
    // The socket event will also handle this, but this serves as immediate feedback
    setPosts(prev => prev.filter(p => p._id !== deletedPostId));
  };

  return (
    <div>
      {/* <h2 className="text-2xl font-bold mb-6 pl-[80px]">My Posts</h2> */}
      
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
            onClick={() => loadUserPosts(1, true)}
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && posts.length === 0 && (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h3 className="text-lg font-medium text-gray-700 mb-2">No posts yet</h3>
          <p className="text-gray-500">You haven't created any posts yet.</p>
          <button 
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            onClick={() => router.push('/community')}
          >
            Go to Community to Create Post
          </button>
        </div>
      )}

      {/* Posts List */}
      {!loading && !error && posts.length > 0 && (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post._id} onClick={() => onPostClick(post)} className="cursor-pointer">
              <Post 
                post={post} 
                onRefresh={() => {
                   setPosts(prev => prev.map(p => p._id === post._id ? post : p));
                }} 
                onDelete={handlePostDelete}
              />
            </div>
          ))}
          
          {/* Load More Button */}
          {page < totalPages && (
            <div className="flex justify-center mt-6">
              <button 
                className="bg-white border border-gray-300 rounded-lg px-6 py-3 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-50"
                onClick={() => handleLoadMore()}
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
  );
}