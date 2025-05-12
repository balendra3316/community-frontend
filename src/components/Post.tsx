

// import { useState } from 'react';
// import { MessageSquare, ThumbsUp, X } from 'lucide-react';
// import { Post as PostType, likePost } from '../services/postService';
// import { useAuth } from '../context/AuthContext';

// interface PostProps {
//   post: PostType;
//   onRefresh?: () => void;
// }

// export default function Post({ post, onRefresh }: PostProps) {
//   const { user } = useAuth();
//   const [isLiking, setIsLiking] = useState(false);
//   const [likeCount, setLikeCount] = useState(post.likes.length);
//   const [liked, setLiked] = useState(user ? post.likes.includes(user._id) : false);
//   const [showYoutubeModal, setShowYoutubeModal] = useState(false);

//   // Format the date
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffTime = Math.abs(now.getTime() - date.getTime());
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
//     if (diffDays < 1) {
//       return 'Today';
//     } else if (diffDays === 1) {
//       return 'Yesterday';
//     } else if (diffDays < 30) {
//       return `${diffDays}d`;
//     } else {
//       return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//     }
//   };

//   // Handle like button click with optimistic UI update
//   const handleLike = async (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (!user || isLiking) return;
    
//     try {
//       setIsLiking(true);
      
//       // Optimistic UI update
//       const wasLiked = liked;
//       const newLikeCount = wasLiked ? likeCount - 1 : likeCount + 1;
      
//       // Update local state immediately
//       setLiked(!wasLiked);
//       setLikeCount(newLikeCount);
      
//       // Make API call in the background
//       const response = await likePost(post._id);
      
//       // If the API response differs from our optimistic update, correct the state
//       if (response.liked !== !wasLiked || response.likeCount !== newLikeCount) {
//         setLiked(response.liked);
//         setLikeCount(response.likeCount);
//       }
//     } catch (error) {
//       // Revert to original state if there's an error
//       console.error('Error liking post:', error);
//       setLiked(liked);
//       setLikeCount(likeCount);
//     } finally {
//       setIsLiking(false);
//     }
//   };

//   // Extract YouTube video ID - improved regex for better URL matching
//   const getYoutubeId = (url: string): string => {
//     if (!url) return '';
    
//     const regExp = /^.*((youtu.be\/)|(v\/)|(\/)|(watch\?v=)|(&v=))([^#&?]*).*/;
//     const match = url.match(regExp);
//     return (match && match[7] && match[7].length === 11) ? match[7] : '';
//   };

//   // Get YouTube thumbnail with higher quality
//   const getYoutubeThumbnail = (url: string): string => {
//     const videoId = getYoutubeId(url);
//     // Using higher quality thumbnail (hqdefault instead of mqdefault)
//     return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '/api/placeholder/320/180';
//   };

//   const openYoutubeModal = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setShowYoutubeModal(true);
//   };

//   const closeYoutubeModal = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setShowYoutubeModal(false);
//   };

//   // Check if post has media (image or youtube)
//   const hasMedia = post.image || (post.youtubeLink && !post.poll);
  
//   // Check specifically for YouTube link
//   const hasYoutubeLink = post.youtubeLink && getYoutubeId(post.youtubeLink);

//   return (
//     <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-4 cursor-pointer hover:shadow-md transition-shadow">
//       {/* Post Header */}
//       <div className="p-4">
//         <div className="flex items-center mb-3">
//           <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden">
//             <img
//               src={post.author.avatar || '/api/placeholder/40/40'}
//               alt={post.author.name}
//               className="h-full w-full object-cover"
//             />
//           </div>
//           <div className="ml-3">
//             <div className="flex items-center">
//               <span className="font-medium">{post.author.name}</span>
//               {post.author.badges && post.author.badges.length > 0 && (
//                 <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
//                   {post.author.badges.length}
//                 </span>
//               )}
//             </div>
//             <div className="flex items-center text-sm text-gray-500">
//               <span>{formatDate(post.createdAt)}</span>
//               {post.isPinned && (
//                 <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full flex items-center">
//                   📌 Pinned
//                 </span>
//               )}
//               {post.tags && post.tags.length > 0 && (
//                 <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
//                   {post.tags[0]}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Content Layout with Media */}
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className={`flex-1 ${hasMedia ? 'sm:max-w-[65%]' : 'w-full'}`}>
//             {/* Post Title & Content */}
//             <h3 className="font-bold mb-2 max-h-8 whitespace-nowrap overflow-hidden text-ellipsis"
//                 style={{ wordBreak: 'break-word', fontFamily: 'Roboto, Helvetica, Arial, sans-serif', fontSize: '20px', lineHeight: '1.5' }}>
//               {post.title}
//             </h3>
//             <p className="text-gray-700 mb-2 line-clamp-3">{post.content}</p>
//           </div>
          
//           {/* Media (Image or YouTube) */}
//           {post.image && !hasYoutubeLink && (
//             <div className="flex-shrink-0 w-32 h-32">
//               <img
//                 src={post.image}
//                 alt="Post image"
//                 className="rounded-lg w-full h-full object-cover"
//               />
//             </div>
//           )}
          
//           {/* YouTube Video (if exists) - Fixed sizing and z-index */}
//           {hasYoutubeLink && (
//             <div className="flex-shrink-0 w-32 h-32">
//               <div 
//                 className="relative rounded-lg overflow-hidden cursor-pointer w-full h-full"
//                 onClick={openYoutubeModal}
//               >
//                 <img
//                   src={getYoutubeThumbnail(post.youtubeLink || '')}
//                   alt="YouTube thumbnail"
//                   className="w-full h-full object-cover"
//                 />
//                 <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
//                   <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
//                     <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-white border-b-4 border-b-transparent ml-1"></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* YouTube Modal - Fixed z-index and improved structure */}
//         {showYoutubeModal && hasYoutubeLink && (
//           <div 
//             className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" 
//             onClick={closeYoutubeModal}
//             style={{ zIndex: 9999 }}
//           >
//             <div className="relative w-full max-w-3xl mx-4" onClick={e => e.stopPropagation()}>
//               <button 
//                 className="absolute -top-10 right-0 text-white hover:text-gray-300"
//                 onClick={closeYoutubeModal}
//               >
//                 <X size={24} />
//               </button>
//               <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
//                 <iframe
//                   src={`https://www.youtube.com/embed/${getYoutubeId(post.youtubeLink || '')}?autoplay=1`}
//                   title="YouTube video player"
//                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                   allowFullScreen
//                   className="absolute top-0 left-0 w-full h-full"
//                 ></iframe>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Post Footer */}
//         <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-100">
//           <div className="flex items-center space-x-4">
//             <button 
//               className={`flex items-center ${liked ? 'text-blue-600' : 'text-gray-500'} hover:text-blue-600 transition-colors duration-200`}
//               onClick={handleLike}
//               disabled={!user || isLiking}
//             >
//               <ThumbsUp 
//                 size={16} 
//                 className={`mr-1 ${isLiking ? 'animate-pulse' : ''}`} 
//                 fill={liked ? 'currentColor' : 'none'} 
//               />
//               <span>{likeCount}</span>
//             </button>
//             <div className="flex items-center text-gray-500">
//               <MessageSquare size={16} className="mr-1" />
//               <span>{post.totalComments|| 0}</span> 
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

























// import { useState } from 'react';
// import { MessageSquare, ThumbsUp, X } from 'lucide-react';
// import { Post as PostType, likePost } from '../services/postService';
// import { useAuth } from '../context/AuthContext';

// interface PostProps {
//   post: PostType;
//   onRefresh?: () => void;
// }

// export default function Post({ post, onRefresh }: PostProps) {
//   const { user } = useAuth();
//   const [isLiking, setIsLiking] = useState(false);
//   const [likeCount, setLikeCount] = useState(post.likes.length);
//   const [liked, setLiked] = useState(user ? post.likes.includes(user._id) : false);
//   const [showYoutubeModal, setShowYoutubeModal] = useState(false);

//   // Format the date
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffTime = Math.abs(now.getTime() - date.getTime());
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
//     if (diffDays < 1) {
//       return 'Today';
//     } else if (diffDays === 1) {
//       return 'Yesterday';
//     } else if (diffDays < 30) {
//       return `${diffDays}d`;
//     } else {
//       return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//     }
//   };

//   // Handle like button click with optimistic UI update
//   const handleLike = async (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (!user || isLiking) return;
    
//     try {
//       setIsLiking(true);
      
//       // Optimistic UI update
//       const wasLiked = liked;
//       const newLikeCount = wasLiked ? likeCount - 1 : likeCount + 1;
      
//       // Update local state immediately
//       setLiked(!wasLiked);
//       setLikeCount(newLikeCount);
      
//       // Make API call in the background
//       const response = await likePost(post._id);
      
//       // If the API response differs from our optimistic update, correct the state
//       if (response.liked !== !wasLiked || response.likeCount !== newLikeCount) {
//         setLiked(response.liked);
//         setLikeCount(response.likeCount);
//       }
//     } catch (error) {
//       // Revert to original state if there's an error
//       console.error('Error liking post:', error);
//       setLiked(liked);
//       setLikeCount(likeCount);
//     } finally {
//       setIsLiking(false);
//     }
//   };

//   // Extract YouTube video ID - improved regex for better URL matching
//   const getYoutubeId = (url: string): string => {
//     if (!url) return '';
    
//     const regExp = /^.*((youtu.be\/)|(v\/)|(\/)|(watch\?v=)|(&v=))([^#&?]*).*/;
//     const match = url.match(regExp);
//     return (match && match[7] && match[7].length === 11) ? match[7] : '';
//   };

//   // Get YouTube thumbnail with higher quality
//   const getYoutubeThumbnail = (url: string): string => {
//     const videoId = getYoutubeId(url);
//     // Using higher quality thumbnail (hqdefault instead of mqdefault)
//     return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '/api/placeholder/320/180';
//   };

//   const openYoutubeModal = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setShowYoutubeModal(true);
//   };

//   const closeYoutubeModal = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setShowYoutubeModal(false);
//   };

//   // Check if post has media (image or youtube)
//   const hasMedia = post.image || (post.youtubeLink && !post.poll);
  
//   // Check specifically for YouTube link
//   const hasYoutubeLink = post.youtubeLink && getYoutubeId(post.youtubeLink);

//   return (
//     <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-4 cursor-pointer hover:shadow-md transition-shadow">
//       {/* Post Header */}
//       <div className="p-4">
//         <div className="flex items-center mb-3">
//           <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden">
//             <img
//               src={post.author.avatar || '/api/placeholder/40/40'}
//               alt={post.author.name}
//               className="h-full w-full object-cover"
//             />
//           </div>
//           <div className="ml-3">
//             <div className="flex items-center">
//               <span className="font-medium">{post.author.name}</span>
//               {post.author.badges && post.author.badges.length > 0 && (
//                 <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
//                   {post.author.badges.length}
//                 </span>
//               )}
//             </div>
//             <div className="flex items-center text-sm text-gray-500">
//               <span>{formatDate(post.createdAt)}</span>
//               {post.isPinned && (
//                 <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full flex items-center">
//                   📌 Pinned
//                 </span>
//               )}
//               {post.tags && post.tags.length > 0 && (
//                 <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
//                   {post.tags[0]}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Content Layout with Media */}
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className={`flex-1 ${hasMedia ? 'sm:max-w-[65%]' : 'w-full'}`}>
//             {/* Post Title & Content */}
//             <h3 className="font-bold mb-2 max-h-8 whitespace-nowrap overflow-hidden text-ellipsis"
//                 style={{ wordBreak: 'break-word', fontFamily: 'Roboto, Helvetica, Arial, sans-serif', fontSize: '20px', lineHeight: '1.5' }}>
//               {post.title}
//             </h3>
//             <p className="text-gray-700 mb-2 line-clamp-3">{post.content}</p>
//           </div>
          
//           {/* Media (Image or YouTube) */}
//           {post.image && !hasYoutubeLink && (
//             <div className="flex-shrink-0 w-32 h-32">
//               <img
//                 src={post.image}
//                 alt="Post image"
//                 className="rounded-lg w-full h-full object-cover"
//               />
//             </div>
//           )}
          
//           {/* YouTube Video (if exists) - Fixed sizing and z-index */}
//           {hasYoutubeLink && (
//             <div className="flex-shrink-0 w-32 h-32">
//               <div 
//                 className="relative rounded-lg overflow-hidden cursor-pointer w-full h-full"
//                 onClick={openYoutubeModal}
//               >
//                 <img
//                   src={getYoutubeThumbnail(post.youtubeLink || '')}
//                   alt="YouTube thumbnail"
//                   className="w-full h-full object-cover"
//                 />
//                 <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
//                   <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
//                     <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-white border-b-4 border-b-transparent ml-1"></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* YouTube Modal - Fixed z-index and improved structure */}
//         {showYoutubeModal && hasYoutubeLink && (
//           <div 
//             className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" 
//             onClick={closeYoutubeModal}
//             style={{ zIndex: 9999 }}
//           >
//             <div className="relative w-full max-w-3xl mx-4" onClick={e => e.stopPropagation()}>
//               <button 
//                 className="absolute -top-10 right-0 text-white hover:text-gray-300"
//                 onClick={closeYoutubeModal}
//               >
//                 <X size={24} />
//               </button>
//               <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
//                 <iframe
//                   src={`https://www.youtube.com/embed/${getYoutubeId(post.youtubeLink || '')}?autoplay=1`}
//                   title="YouTube video player"
//                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                   allowFullScreen
//                   className="absolute top-0 left-0 w-full h-full"
//                 ></iframe>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Post Footer */}
//         <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-100">
//           <div className="flex items-center space-x-4">
//             <button 
//               className={`flex items-center ${liked ? 'text-blue-600' : 'text-gray-500'} hover:text-blue-600 transition-colors duration-200`}
//               onClick={handleLike}
//               disabled={!user || isLiking}
//             >
//               <ThumbsUp 
//                 size={16} 
//                 className={`mr-1 ${isLiking ? 'animate-pulse' : ''}`} 
//                 fill={liked ? 'currentColor' : 'none'} 
//               />
//               <span>{likeCount}</span>
//             </button>
//             <div className="flex items-center text-gray-500">
//               <MessageSquare size={16} className="mr-1" />
//               <span>{post.totalComments|| 0}</span> 
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }














import { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, X } from 'lucide-react';
import { Post as PostType, likePost } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import { usePostState, usePostStateDispatch } from '../types/PostStateContext'; 

interface PostProps {
  post: PostType;
  onRefresh?: () => void;
}

export default function Post({ post, onRefresh }: PostProps) {
  const { user } = useAuth();
  const [isLiking, setIsLiking] = useState(false);
  const [showYoutubeModal, setShowYoutubeModal] = useState(false);
  const { likedPosts, likeCounts } = usePostState();
  const { setLikedPosts, setLikeCounts, toggleLike } = usePostStateDispatch();
  
  // Initialize the context state with server data when component mounts or post changes
  useEffect(() => {
    if (user && post) {
      // Check if this post's state is already initialized in context
      if (likedPosts[post._id] === undefined) {
        // Initialize the liked state directly from server data
        const isLikedFromServer = post.likes.includes(user._id);
        
        // We're initializing the state directly instead of toggling
        // This ensures we start with the correct server state
        setLikedPosts(prev => ({ ...prev, [post._id]: isLikedFromServer }));
        setLikeCounts(prev => ({ ...prev, [post._id]: post.likes.length }));
      }
    }
  }, [post._id, user, post.likes]);
  
  // Get values from context with fallbacks to server data
  const isLiked = likedPosts[post._id] ?? (user ? post.likes.includes(user._id) : false);
  const currentLikeCount = likeCounts[post._id] ?? post.likes.length;

  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 30) {
      return `${diffDays}d`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  // Handle like button click with optimistic UI update
  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || isLiking) return;
    
    try {
      setIsLiking(true);
      
      // Get current like state directly from server data
      const isCurrentlyLikedFromServer = post.likes.includes(user._id);
      
      // Update shared state (this will update both components)
      toggleLike(post._id, post.likes, user._id);
      
      // Make API call in the background
      await likePost(post._id);
      
      // Call onRefresh if provided (optional)
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      // On error, toggle back
      console.error('Error liking post:', error);
      toggleLike(post._id, post.likes, user._id);
    } finally {
      setIsLiking(false);
    }
  };

  // Extract YouTube video ID - improved regex for better URL matching
  const getYoutubeId = (url: string): string => {
    if (!url) return '';
    
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/)|(watch\?v=)|(&v=))([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7] && match[7].length === 11) ? match[7] : '';
  };

  // Get YouTube thumbnail with higher quality
  const getYoutubeThumbnail = (url: string): string => {
    const videoId = getYoutubeId(url);
    // Using higher quality thumbnail (hqdefault instead of mqdefault)
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '/api/placeholder/320/180';
  };

  const openYoutubeModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowYoutubeModal(true);
  };

  const closeYoutubeModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowYoutubeModal(false);
  };

  // Check if post has media (image or youtube)
  const hasMedia = post.image || (post.youtubeLink && !post.poll);
  
  // Check specifically for YouTube link
  const hasYoutubeLink = post.youtubeLink && getYoutubeId(post.youtubeLink);

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-4 cursor-pointer hover:shadow-md transition-shadow">
      {/* Post Header */}
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden">
            <img
              src={post.author.avatar || '/api/placeholder/40/40'}
              alt={post.author.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="ml-3">
            <div className="flex items-center">
              <span className="font-medium">{post.author.name}</span>
              {post.author.badges && post.author.badges.length > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                  {post.author.badges.length}
                </span>
              )}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <span>{formatDate(post.createdAt)}</span>
              {post.isPinned && (
                <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full flex items-center">
                  📌 Pinned
                </span>
              )}
              {post.tags && post.tags.length > 0 && (
                <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                  {post.tags[0]}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content Layout with Media */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className={`flex-1 ${hasMedia ? 'sm:max-w-[65%]' : 'w-full'}`}>
            {/* Post Title & Content */}
            <h3 className="font-bold mb-2 max-h-8 whitespace-nowrap overflow-hidden text-ellipsis"
                style={{ wordBreak: 'break-word', fontFamily: 'Roboto, Helvetica, Arial, sans-serif', fontSize: '20px', lineHeight: '1.5' }}>
              {post.title}
            </h3>
            <p className="text-gray-700 mb-2 line-clamp-3">{post.content}</p>
          </div>
          
          {/* Media (Image or YouTube) */}
          {post.image && !hasYoutubeLink && (
            <div className="flex-shrink-0 w-32 h-32">
              <img
                src={post.image}
                alt="Post image"
                className="rounded-lg w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* YouTube Video (if exists) - Fixed sizing and z-index */}
          {hasYoutubeLink && (
            <div className="flex-shrink-0 w-32 h-32">
              <div 
                className="relative rounded-lg overflow-hidden cursor-pointer w-full h-full"
                onClick={openYoutubeModal}
              >
                <img
                  src={getYoutubeThumbnail(post.youtubeLink || '')}
                  alt="YouTube thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-white border-b-4 border-b-transparent ml-1"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* YouTube Modal - Fixed z-index and improved structure */}
        {showYoutubeModal && hasYoutubeLink && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" 
            onClick={closeYoutubeModal}
            style={{ zIndex: 9999 }}
          >
            <div className="relative w-full max-w-3xl mx-4" onClick={e => e.stopPropagation()}>
              <button 
                className="absolute -top-10 right-0 text-white hover:text-gray-300"
                onClick={closeYoutubeModal}
              >
                <X size={24} />
              </button>
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={`https://www.youtube.com/embed/${getYoutubeId(post.youtubeLink || '')}?autoplay=1`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
        )}

        {/* Post Footer */}
        <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-100">
          <div className="flex items-center space-x-4">
          <button 
            className={`flex items-center ${isLiked ? 'text-blue-600' : 'text-gray-500'} hover:text-blue-600 transition-colors duration-200`}
            onClick={handleLike}
            disabled={!user || isLiking}
          >
            <ThumbsUp 
              size={16} 
              className={`mr-1 ${isLiking ? 'animate-pulse' : ''}`} 
              fill={isLiked ? 'currentColor' : 'none'} 
            />
            <span>{currentLikeCount}</span>
          </button>
          <div className="flex items-center text-gray-500">
            <MessageSquare size={16} className="mr-1" />
            <span>{post.totalComments || 0}</span> 
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}