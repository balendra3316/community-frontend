

// "use client"
// import { useState, useEffect, useRef } from 'react';
// import { X, ChevronUp, ChevronDown, MessageSquare, ThumbsUp, MoreVertical, Trash, BarChart2 } from 'lucide-react';
// import { Post, voteOnPoll } from '../services/postService';
// import { Comment, fetchCommentsByPost, createComment, likeComment, deleteComment } from '../services/commentService';
// import { useAuth } from '../context/AuthContext';
// import { likePost } from '../services/postService';
// import dayjs from 'dayjs';
// import relativeTime from 'dayjs/plugin/relativeTime';

// dayjs.extend(relativeTime);

// interface PostDetailViewProps {
//   post: Post | null;
//   isOpen: boolean;
//   onClose: () => void;
//   onRefresh?: () => void;
// }

// export default function PostDetailView({ post, isOpen, onClose, onRefresh }: PostDetailViewProps) {
//   const { user } = useAuth();
//   const [commentText, setCommentText] = useState('');
//   const [replyToId, setReplyToId] = useState<string | null>(null);
//   const [replyToName, setReplyToName] = useState<string>('');
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [likes, setLikes] = useState<string[]>([]);
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [youtubeLink, setYoutubeLink] = useState('');
//   const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
//   const [showFullContent, setShowFullContent] = useState(false);
//   const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
//   const contentRef = useRef<HTMLParagraphElement>(null);
//   const [contentOverflows, setContentOverflows] = useState(false);
//   // New state for poll votes
//   const [pollVoting, setPollVoting] = useState(false);
//   const [pollVotes, setPollVotes] = useState<{[key: number]: string[]}>({}); 

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (isOpen && post) {
//       setLikes(post.likes || []);
//       loadComments();
      
//       // Initialize poll votes from post data
//       if (post.poll && post.poll.options) {
//         const votesMap: {[key: number]: string[]} = {};
//         post.poll.options.forEach((option, index) => {
//           votesMap[index] = option.votes || [];
//         });
//         setPollVotes(votesMap);
//       }
//     }
//   }, [isOpen, post]);

//   useEffect(() => {
//     if (contentRef.current) {
//       const lineHeight = parseInt(window.getComputedStyle(contentRef.current).lineHeight);
//       const height = contentRef.current.scrollHeight;
//       const lines = height / lineHeight;
//       setContentOverflows(lines > 4);
//     }
//   }, [post?.content]);

//   const loadComments = async (pageNum = 1) => {
//     if (!post) return;
    
//     try {
//       setIsLoading(true);
//       const response = await fetchCommentsByPost(post._id, pageNum);
      
//       if (pageNum === 1) {
//         setComments(response.comments);
//       } else {
//         setComments(prev => [...prev, ...response.comments]);
//       }
      
//       setPage(response.page);
//       setTotalPages(response.totalPages);
//     } catch (error) {
//       console.error('Error loading comments:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSubmitComment = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!commentText.trim() && !imageFile) return;
//     if (!post || !user) return;

//     try {
//       const formData = new FormData();
//       formData.append('content', commentText);
      
//       if (replyToId) {
//         formData.append('parentId', replyToId);
//       }
      
//       if (imageFile) {
//         formData.append('image', imageFile);
//       }
      
//       if (youtubeLink) {
//         formData.append('youtubeLink', youtubeLink);
//       }

//       await createComment(post._id, formData);
      
//       // Refresh comments
//       setCommentText('');
//       setReplyToId(null);
//       setReplyToName('');
//       setImageFile(null);
//       setYoutubeLink('');
//       loadComments();
      
//       if (onRefresh) {
//         onRefresh();
//       }
//     } catch (error) {
//       console.error('Error creating comment:', error);
//     }
//   };

//   const handleLikePost = async () => {
//     if (!post || !user) return;
    
//     try {
//       const response = await likePost(post._id);
//       setLikes(response.liked 
//         ? [...likes, user._id]
//         : likes.filter(id => id !== user._id));
        
//       if (onRefresh) {
//         onRefresh();
//       }
//     } catch (error) {
//       console.error('Error liking post:', error);
//     }
//   };

//   const handleLikeComment = async (commentId: string) => {
//     if (!user) return;
    
//     try {
//       await likeComment(commentId);
//       loadComments(page);
//     } catch (error) {
//       console.error('Error liking comment:', error);
//     }
//   };

//   const handleDeleteComment = async (commentId: string) => {
//     try {
//       await deleteComment(commentId);
//       loadComments(1);
//       setShowActionMenu(null);
      
//       if (onRefresh) {
//         onRefresh();
//       }
//     } catch (error) {
//       console.error('Error deleting comment:', error);
//     }
//   };

//   const handleReply = (comment: Comment) => {
//     setReplyToId(comment._id);
//     setReplyToName(comment.author.name);
//     document.getElementById('comment-input')?.focus();
//   };

//   const handleImageSelect = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setImageFile(e.target.files[0]);
//     }
//   };

//   // New function for handling poll votes
//   const handleVote = async (optionIndex: number) => {
//     if (!post || !user) return;
    
//     // Check if user has already voted
//     const hasVoted = post.poll?.voters?.includes(user._id);
//     if (hasVoted) return;

//     try {
//       setPollVoting(true);
//       const response = await voteOnPoll(post._id, optionIndex);
      
//       // Update local poll state with new votes
//       if (response.voted && post.poll) {
//         const newVotes = {...pollVotes};
//         response.results.forEach((result, idx) => {
//           newVotes[idx] = result.votes;
//         });
//         setPollVotes(newVotes);
        
//         // Update voters to include current user
//         if (post.poll.voters) {
//           post.poll.voters = [...post.poll.voters, user._id];
//         } else {
//           post.poll.voters = [user._id];
//         }
//       }

//       if (onRefresh) {
//         onRefresh();
//       }
//     } catch (error) {
//       console.error('Error voting on poll:', error);
//     } finally {
//       setPollVoting(false);
//     }
//   };

//   const formatRelativeTime = (timestamp: string) => {
//     return dayjs(timestamp).fromNow();
//   };

//   const toggleReplies = (commentId: string) => {
//     setExpandedComments(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(commentId)) {
//         newSet.delete(commentId);
//       } else {
//         newSet.add(commentId);
//       }
//       return newSet;
//     });
//   };

//   const isPostLikedByUser = user && likes.includes(user._id);
  
//   // Check if user has voted on the poll
//   const hasVotedOnPoll = user && post?.poll?.voters?.includes(user._id);

//   // Calculate total votes for the poll
//   const calculateTotalVotes = () => {
//     if (!post?.poll?.options) return 0;
//     return post.poll.options.reduce((sum, option) => sum + (option.votes?.length || 0), 0);
//   };

//   // Calculate percentage for each poll option
//   const calculatePercentage = (optionIndex: number) => {
//     if (!post?.poll?.options) return 0;
//     const optionVotes = post.poll.options[optionIndex].votes?.length || 0;
//     const totalVotes = calculateTotalVotes();
//     return totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;
//   };

//   const renderYoutubeEmbed = (link: string) => {
//     const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
//     const match = link.match(youtubeRegex);
    
//     if (match && match[1]) {
//       const videoId = match[1];
//       return (
//         <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-4">
//           <iframe
//             src={`https://www.youtube.com/embed/${videoId}`}
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//             allowFullScreen
//             className="w-full h-full"
//           ></iframe>
//         </div>
//       );
//     }
    
//     return null;
//   };

//   const toggleContentDisplay = () => {
//     setShowFullContent(!showFullContent);
//   };

//   // Render Poll UI
//   const renderPoll = () => {
//     if (!post?.poll?.options || post.poll.options.length === 0) return null;
    
//     const totalVotes = calculateTotalVotes();
    
//     return (
//       <div className="mt-4 mb-6 bg-gray-50 rounded-lg p-4 border">
//         <div className="flex items-center mb-3">
//           <BarChart2 size={18} className="mr-2 text-blue-600" />
//           <h3 className="font-medium">Poll</h3>
//           <span className="ml-auto text-sm text-gray-500">{totalVotes} votes</span>
//         </div>
        
//         <div className="space-y-3">
//           {post.poll.options.map((option, index) => {
//             const percentage = calculatePercentage(index);
//             const isVoted = hasVotedOnPoll && option.votes?.includes(user?._id || '');
            
//             return (
//               <div key={index} className="relative">
//                 {hasVotedOnPoll ? (
//                   // Show results view if user has voted
//                   <div className="relative bg-gray-100 rounded-md overflow-hidden">
//                     <div 
//                       className={`absolute top-0 left-0 h-full ${isVoted ? 'bg-blue-100' : 'bg-gray-200'}`}
//                       style={{ width: `${percentage}%` }}
//                     ></div>
//                     <div className="relative px-4 py-3 flex justify-between items-center">
//                       <div className="flex items-center">
//                         <span className="font-medium">{option.text}</span>
//                         {isVoted && (
//                           <span className="ml-2 text-blue-600 text-sm">• Your vote</span>
//                         )}
//                       </div>
//                       <span className="font-medium">{percentage}%</span>
//                     </div>
//                   </div>
//                 ) : (
//                   // Show voting options if user hasn't voted
//                   <button
//                     className="w-full px-4 py-3 bg-white hover:bg-gray-50 border rounded-md flex justify-between items-center disabled:opacity-70"
//                     onClick={() => handleVote(index)}
//                     disabled={pollVoting}
//                   >
//                     <span>{option.text}</span>
//                     {pollVoting && <span className="loader ml-2"></span>}
//                   </button>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     );
//   };

//   const renderComment = (comment: Comment, isReply = false) => {
//     const hasReplies = comment.replies && comment.replies.length > 0;
//     const isExpanded = expandedComments.has(comment._id);
    
//     return (
//       <div key={comment._id} className={`${isReply ? 'ml-8' : ''} bg-gray-50 rounded-lg p-3 relative mb-3`}>
//         <div className="flex items-start">
//           <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden">
//             <img
//               src={comment.author.avatar || "/api/placeholder/40/40"}
//               alt={comment.author.name}
//               className="h-full w-full object-cover"
//             />
//           </div>
//           <div className="ml-2 flex-1">
//             <div className="flex items-center justify-between">
//               <div>
//                 <span className="font-medium text-sm">{comment.author.name}</span>
//                 {comment.author.badges && comment.author.badges.length > 0 && (
//                   <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full">
//                     {comment.author.badges.length}
//                   </span>
//                 )}
//                 <span className="text-xs text-gray-500 ml-2">{formatRelativeTime(comment.createdAt)}</span>
//               </div>
              
//               {user && comment.author._id === user._id && (
//                 <div className="relative">
//                   <button 
//                     onClick={() => setShowActionMenu(showActionMenu === comment._id ? null : comment._id)}
//                     className="text-gray-500 hover:text-gray-700 p-1"
//                   >
//                     <MoreVertical size={16} />
//                   </button>
                  
//                   {showActionMenu === comment._id && (
//                     <div className="absolute right-0 top-full mt-1 bg-white shadow-lg rounded-md z-10 w-32">
//                       <button
//                         onClick={() => handleDeleteComment(comment._id)}
//                         className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//                       >
//                         <Trash size={14} className="mr-2" />
//                         Delete
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
            
//             <p className="text-sm my-2">{comment.content}</p>
            
//             {comment.image && (
//               <div className="mt-2 mb-3 rounded-lg overflow-hidden">
//                 <img
//                   src={comment.image}
//                   alt="Comment image"
//                   className="max-h-60 object-contain"
//                 />
//               </div>
//             )}
            
//             {comment.youtubeLink && renderYoutubeEmbed(comment.youtubeLink)}
            
//             <div className="flex items-center text-xs text-gray-500 mt-2">
//               <button 
//                 className={`flex items-center mr-4 ${
//                   user && comment.likes.includes(user._id) ? 'text-blue-600' : ''
//                 }`}
//                 onClick={() => handleLikeComment(comment._id)}
//               >
//                 <ThumbsUp size={14} className={`mr-1 ${
//                   user && comment.likes.includes(user._id) ? 'fill-current' : ''
//                 }`} />
//                 <span>{comment.likes.length}</span>
//               </button>
//               <button 
//                 className="hover:text-gray-700 mr-4"
//                 onClick={() => handleReply(comment)}
//               >
//                 Reply
//               </button>
              
//               {hasReplies && (
//                 <button 
//                   className="flex items-center text-blue-600 hover:text-blue-700"
//                   onClick={() => toggleReplies(comment._id)}
//                 >
//                   {isExpanded ? (
//                     <>
//                       <ChevronUp size={14} className="mr-1" />
//                       <span>Hide {comment.replies?.length} {comment.replies?.length === 1 ? 'reply' : 'replies'}</span>
//                     </>
//                   ) : (
//                     <>
//                       <ChevronDown size={14} className="mr-1" />
//                       <span>Show {comment.replies?.length} {comment.replies?.length === 1 ? 'reply' : 'replies'}</span>
//                     </>
//                   )}
//                 </button>
//               )}
//             </div>
            
//             {hasReplies && isExpanded && (
//               <div className="mt-3 space-y-3">
//                 {comment.replies?.map(reply => renderComment(reply, true))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (!isOpen || !post) return null;

//   return (
//     <div className="fixed inset-0 bg-[rgba(144,144,144,0.6)] bg-opacity-50 z-50 flex items-center justify-center p-0 sm:p-4">
//       <div className="bg-white rounded-lg shadow-xl w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-3xl flex flex-col">
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 border-b">
//           <h3 className="text-lg font-medium">Post</h3>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             <X size={20} />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="flex-1 overflow-y-auto">
//           {/* Post */}
//           <div className="p-4 border-b">
//             <div className="flex items-center mb-3">
//               <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden">
//                 <img
//                   src={post.author.avatar }
//                   alt={post.author.name}
//                   className="h-full w-full object-cover"
//                 />
//               </div>
//               <div className="ml-3 flex-1">
//                 <div className="flex items-center">
//                   <span className="font-medium">{post.author.name}</span>
//                   {post.author.badges && post.author.badges.length > 0 && (
//                     <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
//                       {post.author.badges.length}
//                     </span>
//                   )}
//                 </div>
//                 <div className="text-sm text-gray-500 flex items-center">
//                   <span>{formatRelativeTime(post.createdAt)}</span>
//                   {post.tags && post.tags.length > 0 && (
//                     <>
//                       <span className="mx-1">•</span>
//                       <span className="text-blue-600">#{post.tags[0]}</span>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            
//             <div className="mb-4 relative">
//               <p 
//                 ref={contentRef}
//                 className={`${!showFullContent && contentOverflows ? 'line-clamp-4' : ''}`}
//               >
//                 {post.content}
//               </p>
//               {contentOverflows && (
//                 <button 
//                   onClick={toggleContentDisplay}
//                   className="text-blue-600 text-sm font-medium mt-1"
//                 >
//                   {showFullContent ? 'See less' : 'See more'}
//                 </button>
//               )}
//             </div>
            
//             {post.image && (
//               <div className="mb-4 rounded-lg overflow-hidden">
//                 <img
//                   src={post.image}
//                   alt="Post image"
//                   className="w-full object-cover"
//                 />
//               </div>
//             )}
            
//             {post.youtubeLink && renderYoutubeEmbed(post.youtubeLink)}
            
//             {/* Render Poll if post has one */}
//             {post.poll && renderPoll()}

//             <div className="flex items-center text-gray-500 text-sm mt-2 pt-2 border-t">
//               <button 
//                 onClick={handleLikePost}
//                 className={`flex items-center mr-6 ${isPostLikedByUser ? 'text-blue-600' : ''}`}
//               >
//                 <ThumbsUp size={18} className={`mr-1 ${isPostLikedByUser ? 'fill-current' : ''}`} />
//                 <span>{likes.length}</span>
//               </button>
//               <div className="flex items-center">
//                 <MessageSquare size={18} className="mr-1" />
//                 <span>{post.totalComments}</span>
//               </div>
//             </div>
//           </div>

//           {/* Comments */}
//           <div className="p-4">
//             <h4 className="font-medium mb-4">Comments</h4>
            
//             {isLoading && page === 1 ? (
//               <div className="text-center py-4">
//                 <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
//               </div>
//             ) : comments.length > 0 ? (
//               <div className="space-y-4">
//                 {comments.map(comment => renderComment(comment))}
                
//                 {isLoading && page > 1 && (
//                   <div className="text-center py-2">
//                     <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
//                   </div>
//                 )}
                
//                 {page < totalPages && (
//                   <button 
//                     onClick={() => loadComments(page + 1)}
//                     className="w-full py-2 text-blue-600 font-medium text-sm hover:bg-gray-50 rounded-md"
//                   >
//                     Load more comments
//                   </button>
//                 )}
//               </div>
//             ) : (
//               <div className="text-center py-8 text-gray-500">
//                 No comments yet. Be the first to comment!
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Comment input */}
//         <form onSubmit={handleSubmitComment} className="border-t p-4">
//           {replyToId && (
//             <div className="bg-blue-50 rounded p-2 mb-2 flex justify-between items-center">
//               <span className="text-sm">
//                 Replying to {replyToName}
//               </span>
//               <button 
//                 type="button" 
//                 className="text-gray-500 hover:text-gray-700"
//                 onClick={() => {
//                   setReplyToId(null);
//                   setReplyToName('');
//                 }}
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           )}
          
//           {imageFile && (
//             <div className="mb-2 relative">
//               <div className="relative rounded-lg overflow-hidden">
//                 <img 
//                   src={URL.createObjectURL(imageFile)} 
//                   alt="Selected image" 
//                   className="max-h-48 object-contain"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setImageFile(null)}
//                   className="absolute top-1 right-1 bg-gray-800 bg-opacity-50 rounded-full p-1 text-white"
//                 >
//                   <X size={16} />
//                 </button>
//               </div>
//             </div>
//           )}
          
//           <div className="flex items-center">
//             <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden mr-2">
//               <img
//                 src={user?.avatar || "/api/placeholder/40/40"}
//                 alt="Your avatar"
//                 className="h-full w-full object-cover"
//               />
//             </div>
//             <div className="flex-1 flex items-center border rounded-full px-4 py-2 bg-gray-50">
//               <input
//                 id="comment-input"
//                 type="text"
//                 value={commentText}
//                 onChange={(e) => setCommentText(e.target.value)}
//                 placeholder="Write a comment..."
//                 className="flex-1 bg-transparent text-sm focus:outline-none"
//               />
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept="image/*"
//                 onChange={handleFileChange}
//                 className="hidden"
//               />
//               <button
//                 type="button"
//                 onClick={handleImageSelect}
//                 className="ml-2 text-gray-500 hover:text-gray-700"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
//                   <circle cx="8.5" cy="8.5" r="1.5"/>
//                   <polyline points="21 15 16 10 5 21"/>
//                 </svg>
//               </button>
//               <button
//                 type="submit"
//                 disabled={!commentText.trim() && !imageFile}
//                 className={`ml-2 ${
//                   commentText.trim() || imageFile
//                     ? 'text-blue-600 hover:text-blue-700' 
//                     : 'text-gray-400 cursor-not-allowed'
//                 }`}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <line x1="22" y1="2" x2="11" y2="13"/>
//                   <polygon points="22 2 15 22 11 13 2 9 22 2"/>
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }










// "use client"
// import { useState, useEffect } from 'react';
// import { X, MessageSquare, ThumbsUp } from 'lucide-react';
// import { Post, voteOnPoll, likePost } from '../services/postService';
// import { Comment, fetchCommentsByPost,likeComment, deleteComment  } from '../services/commentService';
// import { useAuth } from '../context/AuthContext';
// import dayjs from 'dayjs';
// import relativeTime from 'dayjs/plugin/relativeTime';
// import PostContent from './subcomPostDetail/PostContent';
// import CommentItem from './subcomPostDetail/CommentItem';
// import CommentForm from './subcomPostDetail/CommentForm';
// import { usePostState, usePostStateDispatch  } from '../types/PostStateContext';

// dayjs.extend(relativeTime);

// interface PostDetailViewProps {
//   post: Post | null;
//   isOpen: boolean;
//   onClose: () => void;
//   onRefresh?: () => void;
// }

// export default function PostDetailView({ post, isOpen, onClose, onRefresh }: PostDetailViewProps) {
//   const { user } = useAuth();
//   const [commentText, setCommentText] = useState('');
//   const [replyToId, setReplyToId] = useState<string | null>(null);
//   const [replyToName, setReplyToName] = useState<string>('');
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [likes, setLikes] = useState<string[]>([]);
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [youtubeLink, setYoutubeLink] = useState('');
//   const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
//   const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());



//  const { setLikedPosts, setLikeCounts, toggleLike } = usePostStateDispatch();
//   // Poll state
//   const [pollVoting, setPollVoting] = useState(false);
//   const [pollVotes, setPollVotes] = useState<{[key: number]: string[]}>({});

//   useEffect(() => {
//     if (isOpen && post) {
//       setLikes(post.likes || []);
//       loadComments();
      
//       // Initialize poll votes from post data
//       if (post.poll && post.poll.options) {
//         const votesMap: {[key: number]: string[]} = {};
//         post.poll.options.forEach((option, index) => {
//           votesMap[index] = option.votes || [];
//         });
//         setPollVotes(votesMap);
//       }
//     }
//   }, [isOpen, post]);

//   const loadComments = async (pageNum = 1) => {
//     if (!post) return;
    
//     try {
//       setIsLoading(true);
//       const response = await fetchCommentsByPost(post._id, pageNum);
      
//       if (pageNum === 1) {
//         setComments(response.comments);
//       } else {
//         setComments(prev => [...prev, ...response.comments]);
//       }
      
//       setPage(response.page);
//       setTotalPages(response.totalPages);
//     } catch (error) {
//       console.error('Error loading comments:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleLikePost = async () => {
//     if (!post || !user) return;
    
//     try {
//       // Use context to update state optimistically
//       toggleLike(post._id, likes, user._id);
      
//       // Make API call in the background
//       await likePost(post._id);
      
//       // No need to manually update likes state since we're using the context
//       // The context will handle the UI updates
        
//       if (onRefresh) {
//         onRefresh();
//       }
//     } catch (error) {
//       console.error('Error liking post:', error);
//       // Revert the toggle if there's an error
//       toggleLike(post._id, likes, user._id);
//     }
//   };

//   // Function to handle poll votes
//   const handleVote = async (optionIndex: number) => {
//     if (!post || !user) return;
    
//     // Check if user has already voted
//     const hasVoted = post.poll?.voters?.includes(user._id);
//     if (hasVoted) return;

//     try {
//       setPollVoting(true);
//       const response = await voteOnPoll(post._id, optionIndex);
      
//       // Update local poll state with new votes
//       if (response.voted && post.poll) {
//         const newVotes = {...pollVotes};
//         response.results.forEach((result, idx) => {
//           newVotes[idx] = result.votes;
//         });
//         setPollVotes(newVotes);
        
//         // Update voters to include current user
//         if (post.poll.voters) {
//           post.poll.voters = [...post.poll.voters, user._id];
//         } else {
//           post.poll.voters = [user._id];
//         }
//       }

//       if (onRefresh) {
//         onRefresh();
//       }
//     } catch (error) {
//       console.error('Error voting on poll:', error);
//     } finally {
//       setPollVoting(false);
//     }
//   };

//   const toggleReplies = (commentId: string) => {
//     setExpandedComments(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(commentId)) {
//         newSet.delete(commentId);
//       } else {
//         newSet.add(commentId);
//       }
//       return newSet;
//     });
//   };

//   const formatRelativeTime = (timestamp: string) => {
//     return dayjs(timestamp).fromNow();
//   };

//   const isPostLikedByUser = !!(user && likes.includes(user._id));
//   const hasVotedOnPoll = !!user && !!post?.poll?.voters?.includes(user._id);

//   if (!isOpen || !post) return null;

//   return (
//     <div className="fixed inset-0 bg-[rgba(144,144,144,0.6)] bg-opacity-50 z-50 flex items-center justify-center p-0 sm:p-4">
//       <div className="bg-white rounded-lg shadow-xl w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-3xl flex flex-col">
//         {/* Header */}
//         <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//         <div className="flex items-center justify-between p-4 border-b">
//           <h3 className="text-lg font-medium">Post</h3>
          
//             <X size={20} />
//             </div>
//           </button>
        

//         {/* Content */}
//         <div className="flex-1 overflow-y-auto">
//           {/* Post Content */}
//           <PostContent 
//             post={post}
//             formatRelativeTime={formatRelativeTime}
//             handleLikePost={handleLikePost}
//             isPostLikedByUser={isPostLikedByUser}
//             handleVote={handleVote}
//             pollVoting={pollVoting}
//             hasVotedOnPoll={hasVotedOnPoll}
//             likes={likes}
//           />

//           {/* Comments */}
//           <div className="p-4">
//             <h4 className="font-medium mb-4">Comments</h4>
            
//             {isLoading && page === 1 ? (
//               <div className="text-center py-4">
//                 <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
//               </div>
//             ) : comments.length > 0 ? (
//               <div className="space-y-4">
//                 {comments.map(comment => (
//                   <CommentItem 
//                     key={comment._id}
//                     comment={comment}
//                     user={user}
//                     formatRelativeTime={formatRelativeTime}
//                     showActionMenu={showActionMenu}
//                     setShowActionMenu={setShowActionMenu}
//                     expandedComments={expandedComments}
//                     toggleReplies={toggleReplies}
//                     onReply={(comment) => {
//                       setReplyToId(comment._id);
//                       setReplyToName(comment.author.name);
//                       document.getElementById('comment-input')?.focus();
//                     }}
//                     onDelete={async (commentId) => {
//                       try {
//                         await deleteComment(commentId);
//                         loadComments(1);
//                         setShowActionMenu(null);
//                         if (onRefresh) onRefresh();
//                       } catch (error) {
//                         console.error('Error deleting comment:', error);
//                       }
//                     }}
//                     onLike={async (commentId) => {
//                       if (!user) return;
//                       try {
//                         await likeComment(commentId);
//                         loadComments(page);
//                       } catch (error) {
//                         console.error('Error liking comment:', error);
//                       }
//                     }}
//                   />
//                 ))}
                
//                 {isLoading && page > 1 && (
//                   <div className="text-center py-2">
//                     <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
//                   </div>
//                 )}
                
//                 {page < totalPages && (
//                   <button 
//                     onClick={() => loadComments(page + 1)}
//                     className="w-full py-2 text-blue-600 font-medium text-sm hover:bg-gray-50 rounded-md"
//                   >
//                     Load more comments
//                   </button>
//                 )}
//               </div>
//             ) : (
//               <div className="text-center py-8 text-gray-500">
//                 No comments yet. Be the first to comment!
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Comment Form */}
//         <CommentForm 
//           user={user}
//           post={post}
//           commentText={commentText}
//           setCommentText={setCommentText}
//           imageFile={imageFile}
//           setImageFile={setImageFile}
//           youtubeLink={youtubeLink}
//           setYoutubeLink={setYoutubeLink}
//           replyToId={replyToId}
//           replyToName={replyToName}
//           setReplyToId={setReplyToId}
//           setReplyToName={setReplyToName}
//           onSubmitSuccess={() => {
//             loadComments();
//             if (onRefresh) onRefresh();
//           }}
//         />
//       </div>
//     </div>
//   );
// }









// "use client"
// import { useState, useEffect } from 'react';
// import { X, MessageSquare, ThumbsUp } from 'lucide-react';
// import { Post, voteOnPoll, likePost } from '../services/postService';
// import { Comment, fetchCommentsByPost, likeComment, deleteComment } from '../services/commentService';
// import { useAuth } from '../context/AuthContext';
// import dayjs from 'dayjs';
// import relativeTime from 'dayjs/plugin/relativeTime';
// import PostContent from './subcomPostDetail/PostContent';
// import CommentItem from './subcomPostDetail/CommentItem';
// import CommentForm from './subcomPostDetail/CommentForm';
// import { usePostState, usePostStateDispatch } from '../types/PostStateContext';
// import { getSocket } from '../services/socket.service';

// dayjs.extend(relativeTime);

// interface PostDetailViewProps {
//   post: Post | null;
//   isOpen: boolean;
//   onClose: () => void;
//   onRefresh?: () => void;
// }

// export default function PostDetailView({ post, isOpen, onClose, onRefresh }: PostDetailViewProps) {
//   const { user } = useAuth();
//   const [commentText, setCommentText] = useState('');
//   const [replyToId, setReplyToId] = useState<string | null>(null);
//   const [replyToName, setReplyToName] = useState<string>('');
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [likes, setLikes] = useState<string[]>([]);
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [youtubeLink, setYoutubeLink] = useState('');
//   const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
//   const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

//   const { setLikedPosts, setLikeCounts, toggleLike } = usePostStateDispatch();
//   // Poll state
//   const [pollVoting, setPollVoting] = useState(false);
//   const [pollVotes, setPollVotes] = useState<{[key: number]: string[]}>({});

//   useEffect(() => {
//     if (isOpen && post) {
//       setLikes(post.likes || []);
//       loadComments();
      
//       // Initialize poll votes from post data
//       if (post.poll && post.poll.options) {
//         const votesMap: {[key: number]: string[]} = {};
//         post.poll.options.forEach((option, index) => {
//           votesMap[index] = option.votes || [];
//         });
//         setPollVotes(votesMap);
//       }
      
//       // Set up socket listeners for this post
//       const socket = getSocket();
      
//       // Listen for new comments
//       socket.on('newComment', (data: {
//         postId: string;
//         comment: Comment;
//         isReply: boolean;
//         parentId: string | null;
//       }) => {
//         if (data.postId === post._id) {
//           handleNewComment(data);
//         }
//       });
      
//       // Listen for deleted comments
//       socket.on('commentDeleted', (data: {
//         postId: string;
//         commentId: string;
//         isReply: boolean;
//         parentId: string | null;
//       }) => {
//         if (data.postId === post._id) {
//           handleCommentDeleted(data);
//         }
//       });
      
//       // Cleanup function
//       return () => {
//         socket.off('newComment');
//         socket.off('commentDeleted');
//       };
//     }
//   }, [isOpen, post]);

//   // Function to handle new comment from socket
//   const handleNewComment = (data: {
//     postId: string;
//     comment: Comment;
//     isReply: boolean;
//     parentId: string | null;
//   }) => {
//     if (data.isReply && data.parentId) {
//       // Handle reply comment
//       setComments(prevComments => {
//         return prevComments.map(comment => {
//           if (comment._id === data.parentId) {
//             // Add new reply to this comment
//             const replies = comment.replies ? [...comment.replies, data.comment] : [data.comment];
//             return { ...comment, replies };
//           }
//           return comment;
//         });
//       });
      
//       // Make sure parent comment's replies are expanded
//       setExpandedComments(prev => {
//         const newSet = new Set(prev);
//         if (data.parentId) {
//           newSet.add(data.parentId);
//         }
//         return newSet;
//       });
//     } else {
//       // Handle direct comment
//       setComments(prevComments => [data.comment, ...prevComments]);
//     }
//   };

//   // Function to handle deleted comment from socket
//   const handleCommentDeleted = (data: {
//     postId: string;
//     commentId: string;
//     isReply: boolean;
//     parentId: string | null;
//   }) => {
//     if (data.isReply && data.parentId) {
//       // Handle deleted reply
//       setComments(prevComments => {
//         return prevComments.map(comment => {
//           if (comment._id === data.parentId && comment.replies) {
//             // Filter out the deleted reply
//             const replies = comment.replies.filter(reply => reply._id !== data.commentId);
//             return { ...comment, replies };
//           }
//           return comment;
//         });
//       });
//     } else {
//       // Handle deleted direct comment
//       setComments(prevComments => prevComments.filter(comment => comment._id !== data.commentId));
//     }
//   };

//   const loadComments = async (pageNum = 1) => {
//     if (!post) return;
    
//     try {
//       setIsLoading(true);
//       const response = await fetchCommentsByPost(post._id, pageNum);
      
//       if (pageNum === 1) {
//         setComments(response.comments);
//       } else {
//         setComments(prev => [...prev, ...response.comments]);
//       }
      
//       setPage(response.page);
//       setTotalPages(response.totalPages);
//     } catch (error) {
//       console.error('Error loading comments:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleLikePost = async () => {
//     if (!post || !user) return;
    
//     try {
//       // Use context to update state optimistically
//       toggleLike(post._id, likes, user._id);
      
//       // Make API call in the background
//       await likePost(post._id);
      
//       // No need to manually update likes state since we're using the context
//       // The context will handle the UI updates
        
//       if (onRefresh) {
//         onRefresh();
//       }
//     } catch (error) {
//       console.error('Error liking post:', error);
//       // Revert the toggle if there's an error
//       toggleLike(post._id, likes, user._id);
//     }
//   };

//   // Function to handle poll votes
//   const handleVote = async (optionIndex: number) => {
//     if (!post || !user) return;
    
//     // Check if user has already voted
//     const hasVoted = post.poll?.voters?.includes(user._id);
//     if (hasVoted) return;

//     try {
//       setPollVoting(true);
//       const response = await voteOnPoll(post._id, optionIndex);
      
//       // Update local poll state with new votes
//       if (response.voted && post.poll) {
//         const newVotes = {...pollVotes};
//         response.results.forEach((result, idx) => {
//           newVotes[idx] = result.votes;
//         });
//         setPollVotes(newVotes);
        
//         // Update voters to include current user
//         if (post.poll.voters) {
//           post.poll.voters = [...post.poll.voters, user._id];
//         } else {
//           post.poll.voters = [user._id];
//         }
//       }

//       if (onRefresh) {
//         onRefresh();
//       }
//     } catch (error) {
//       console.error('Error voting on poll:', error);
//     } finally {
//       setPollVoting(false);
//     }
//   };

//   const toggleReplies = (commentId: string) => {
//     setExpandedComments(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(commentId)) {
//         newSet.delete(commentId);
//       } else {
//         newSet.add(commentId);
//       }
//       return newSet;
//     });
//   };

//   const formatRelativeTime = (timestamp: string) => {
//     return dayjs(timestamp).fromNow();
//   };

//   const isPostLikedByUser = !!(user && likes.includes(user._id));
//   const hasVotedOnPoll = !!user && !!post?.poll?.voters?.includes(user._id);

//   // Function to handle comment deletion with socket integration
//   const handleDeleteComment = async (commentId: string) => {
//     try {
//       await deleteComment(commentId);
//       // No need to update the state manually here since we're now listening for 'commentDeleted' event
//       setShowActionMenu(null);
//       if (onRefresh) onRefresh();
//     } catch (error) {
//       console.error('Error deleting comment:', error);
//     }
//   };

//   if (!isOpen || !post) return null;

//   return (
//     <div className="fixed inset-0 bg-[rgba(144,144,144,0.6)] bg-opacity-50 z-50 flex items-center justify-center p-0 sm:p-4">
//       <div className="bg-white rounded-lg shadow-xl w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-3xl flex flex-col">
//         {/* Header */}
//         <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//         <div className="flex items-center justify-between p-4 border-b">
//           <h3 className="text-lg font-medium">Post</h3>
          
//             <X size={20} />
//             </div>
//           </button>
        

//         {/* Content */}
//         <div className="flex-1 overflow-y-auto">
//           {/* Post Content */}
//           <PostContent 
//             post={post}
//             formatRelativeTime={formatRelativeTime}
//             handleLikePost={handleLikePost}
//             isPostLikedByUser={isPostLikedByUser}
//             handleVote={handleVote}
//             pollVoting={pollVoting}
//             hasVotedOnPoll={hasVotedOnPoll}
//             likes={likes}
//           />

//           {/* Comments */}
//           <div className="p-4">
//             <h4 className="font-medium mb-4">Comments</h4>
            
//             {isLoading && page === 1 ? (
//               <div className="text-center py-4">
//                 <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
//               </div>
//             ) : comments.length > 0 ? (
//               <div className="space-y-4">
//                 {comments.map(comment => (
//                   <CommentItem 
//                     key={comment._id}
//                     comment={comment}
//                     user={user}
//                     formatRelativeTime={formatRelativeTime}
//                     showActionMenu={showActionMenu}
//                     setShowActionMenu={setShowActionMenu}
//                     expandedComments={expandedComments}
//                     toggleReplies={toggleReplies}
//                     onReply={(comment) => {
//                       setReplyToId(comment._id);
//                       setReplyToName(comment.author.name);
//                       document.getElementById('comment-input')?.focus();
//                     }}
//                     onDelete={handleDeleteComment}
//                     onLike={async (commentId) => {
//                       if (!user) return;
//                       try {
//                         await likeComment(commentId);
//                         loadComments(page);
//                       } catch (error) {
//                         console.error('Error liking comment:', error);
//                       }
//                     }}
//                   />
//                 ))}
                
//                 {isLoading && page > 1 && (
//                   <div className="text-center py-2">
//                     <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
//                   </div>
//                 )}
                
//                 {page < totalPages && (
//                   <button 
//                     onClick={() => loadComments(page + 1)}
//                     className="w-full py-2 text-blue-600 font-medium text-sm hover:bg-gray-50 rounded-md"
//                   >
//                     Load more comments
//                   </button>
//                 )}
//               </div>
//             ) : (
//               <div className="text-center py-8 text-gray-500">
//                 No comments yet. Be the first to comment!
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Comment Form */}
//         <CommentForm 
//           user={user}
//           post={post}
//           commentText={commentText}
//           setCommentText={setCommentText}
//           imageFile={imageFile}
//           setImageFile={setImageFile}
//           youtubeLink={youtubeLink}
//           setYoutubeLink={setYoutubeLink}
//           replyToId={replyToId}
//           replyToName={replyToName}
//           setReplyToId={setReplyToId}
//           setReplyToName={setReplyToName}
//           onSubmitSuccess={() => {
//             // We no longer need to refresh comments after submitting one
//             // The socket will handle updating the UI
//             // But we should still clear the form
//             setCommentText('');
//             setImageFile(null);
//             setYoutubeLink('');
//             setReplyToId(null);
//             setReplyToName('');
            
//             // Still call onRefresh to update any other UI elements (like comment count)
//             if (onRefresh) onRefresh();
//           }}
//         />
//       </div>
//     </div>
//   );
// }




"use client"
import { useState, useEffect } from 'react';
import { X, MessageSquare, ThumbsUp } from 'lucide-react';
import { Post, voteOnPoll, likePost } from '../services/postService';
import { Comment, fetchCommentsByPost, likeComment, deleteComment } from '../services/commentService';
import { useAuth } from '../context/AuthContext';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PostContent from './subcomPostDetail/PostContent';
import CommentItem from './subcomPostDetail/CommentItem';
import CommentForm from './subcomPostDetail/CommentForm';
import { usePostState, usePostStateDispatch } from '../types/PostStateContext';
import { CommentStateProvider, useCommentStateDispatch } from '../types/CommentStateContext';
import { getSocket } from '../services/socket.service';

dayjs.extend(relativeTime);

interface PostDetailViewProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

// Inner component wrapped by CommentStateProvider
function PostDetailContent({ post, isOpen, onClose, onRefresh }: PostDetailViewProps) {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyToName, setReplyToName] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [likes, setLikes] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [youtubeLink, setYoutubeLink] = useState('');
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  const { setLikedPosts, setLikeCounts, toggleLike } = usePostStateDispatch();
  const { initializeCommentState } = useCommentStateDispatch();
  
  // Poll state
  const [pollVoting, setPollVoting] = useState(false);
  const [pollVotes, setPollVotes] = useState<{[key: number]: string[]}>({});

  useEffect(() => {
    if (isOpen && post) {
      setLikes(post.likes || []);
      loadComments();
      
      // Initialize poll votes from post data
      if (post.poll && post.poll.options) {
        const votesMap: {[key: number]: string[]} = {};
        post.poll.options.forEach((option, index) => {
          votesMap[index] = option.votes || [];
        });
        setPollVotes(votesMap);
      }
      
      // Set up socket listeners for this post
      const socket = getSocket();
      
      // Listen for new comments
      socket.on('newComment', (data: {
        postId: string;
        comment: Comment;
        isReply: boolean;
        parentId: string | null;
      }) => {
        if (data.postId === post._id) {
          handleNewComment(data);
        }
      });
      
      // Listen for deleted comments
      socket.on('commentDeleted', (data: {
        postId: string;
        commentId: string;
        isReply: boolean;
        parentId: string | null;
      }) => {
        if (data.postId === post._id) {
          handleCommentDeleted(data);
        }
      });
      
      // Cleanup function
      return () => {
        socket.off('newComment');
        socket.off('commentDeleted');
      };
    }
  }, [isOpen, post]);

  // Function to handle new comment from socket
  const handleNewComment = (data: {
    postId: string;
    comment: Comment;
    isReply: boolean;
    parentId: string | null;
  }) => {
    if (data.isReply && data.parentId) {
      // Handle reply comment
      setComments(prevComments => {
        const updatedComments = prevComments.map(comment => {
          if (comment._id === data.parentId) {
            // Add new reply to this comment
            const replies = comment.replies ? [...comment.replies, data.comment] : [data.comment];
            return { ...comment, replies };
          }
          return comment;
        });
        
        // Initialize comment state for new comments
        if (user) {
          // We only need to initialize the new comment
          initializeCommentState([data.comment], user._id);
        }
        
        return updatedComments;
      });
      
      // Make sure parent comment's replies are expanded
      setExpandedComments(prev => {
        const newSet = new Set(prev);
        if (data.parentId) {
          newSet.add(data.parentId);
        }
        return newSet;
      });
    } else {
      // Handle direct comment
      setComments(prevComments => {
        const updatedComments = [data.comment, ...prevComments];
        
        // Initialize comment state for new comments
        if (user) {
          // We only need to initialize the new comment
          initializeCommentState([data.comment], user._id);
        }
        
        return updatedComments;
      });
    }
  };

  // Function to handle deleted comment from socket
  const handleCommentDeleted = (data: {
    postId: string;
    commentId: string;
    isReply: boolean;
    parentId: string | null;
  }) => {
    if (data.isReply && data.parentId) {
      // Handle deleted reply
      setComments(prevComments => {
        return prevComments.map(comment => {
          if (comment._id === data.parentId && comment.replies) {
            // Filter out the deleted reply
            const replies = comment.replies.filter(reply => reply._id !== data.commentId);
            return { ...comment, replies };
          }
          return comment;
        });
      });
    } else {
      // Handle deleted direct comment
      setComments(prevComments => prevComments.filter(comment => comment._id !== data.commentId));
    }
  };

  const loadComments = async (pageNum = 1) => {
    if (!post) return;
    
    try {
      setIsLoading(true);
      const response = await fetchCommentsByPost(post._id, pageNum);
      
      if (pageNum === 1) {
        setComments(response.comments);
      } else {
        setComments(prev => [...prev, ...response.comments]);
      }
      
      // Initialize comment state with fetched comments for optimistic updates
      if (user) {
        initializeCommentState(response.comments, user._id);
      }
      
      setPage(response.page);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikePost = async () => {
    if (!post || !user) return;
    
    try {
      // Use context to update state optimistically
      toggleLike(post._id, likes, user._id);
      
      // Make API call in the background
      await likePost(post._id);
      
      // No need to manually update likes state since we're using the context
      // The context will handle the UI updates
        
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error liking post:', error);
      // Revert the toggle if there's an error
      toggleLike(post._id, likes, user._id);
    }
  };

  // Function to handle poll votes
  const handleVote = async (optionIndex: number) => {
    if (!post || !user) return;
    
    // Check if user has already voted
    const hasVoted = post.poll?.voters?.includes(user._id);
    if (hasVoted) return;

    try {
      setPollVoting(true);
      const response = await voteOnPoll(post._id, optionIndex);
      
      // Update local poll state with new votes
      if (response.voted && post.poll) {
        const newVotes = {...pollVotes};
        response.results.forEach((result, idx) => {
          newVotes[idx] = result.votes;
        });
        setPollVotes(newVotes);
        
        // Update voters to include current user
        if (post.poll.voters) {
          post.poll.voters = [...post.poll.voters, user._id];
        } else {
          post.poll.voters = [user._id];
        }
      }

      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error voting on poll:', error);
    } finally {
      setPollVoting(false);
    }
  };

  const toggleReplies = (commentId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const formatRelativeTime = (timestamp: string) => {
    return dayjs(timestamp).fromNow();
  };

  const isPostLikedByUser = !!(user && likes.includes(user._id));
  const hasVotedOnPoll = !!user && !!post?.poll?.voters?.includes(user._id);

  // Function to handle comment likes with optimistic updates
  const handleLikeComment = async (commentId: string) => {
    if (!user) return;
    
    try {
      // API call is made in the background
      // The UI update happens in the CommentItem component via context
      await likeComment(commentId);
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  // Function to handle comment deletion with socket integration
  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      // No need to update the state manually here since we're now listening for 'commentDeleted' event
      setShowActionMenu(null);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(144,144,144,0.6)] bg-opacity-50 z-50 flex items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-3xl flex flex-col">
        {/* Header */}
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">Post</h3>
          
            <X size={20} />
          
        </div>
        </button>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Post Content */}
          <PostContent 
            post={post}
            formatRelativeTime={formatRelativeTime}
            handleLikePost={handleLikePost}
            isPostLikedByUser={isPostLikedByUser}
            handleVote={handleVote}
            pollVoting={pollVoting}
            hasVotedOnPoll={hasVotedOnPoll}
            likes={likes}
          />

          {/* Comments */}
          <div className="p-4">
            <h4 className="font-medium mb-4">Comments</h4>
            
            {isLoading && page === 1 ? (
              <div className="text-center py-4">
                <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map(comment => (
                  <CommentItem 
                    key={comment._id}
                    comment={comment}
                    user={user}
                    formatRelativeTime={formatRelativeTime}
                    showActionMenu={showActionMenu}
                    setShowActionMenu={setShowActionMenu}
                    expandedComments={expandedComments}
                    toggleReplies={toggleReplies}
                    onReply={(comment) => {
                      setReplyToId(comment._id);
                      setReplyToName(comment.author.name);
                      document.getElementById('comment-input')?.focus();
                    }}
                    onDelete={handleDeleteComment}
                    onLike={handleLikeComment}
                  />
                ))}
                
                {isLoading && page > 1 && (
                  <div className="text-center py-2">
                    <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                  </div>
                )}
                
                {page < totalPages && (
                  <button 
                    onClick={() => loadComments(page + 1)}
                    className="w-full py-2 text-blue-600 font-medium text-sm hover:bg-gray-50 rounded-md"
                  >
                    Load more comments
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>
        </div>

        {/* Comment Form */}
        <CommentForm 
          user={user}
          post={post}
          commentText={commentText}
          setCommentText={setCommentText}
          imageFile={imageFile}
          setImageFile={setImageFile}
          youtubeLink={youtubeLink}
          setYoutubeLink={setYoutubeLink}
          replyToId={replyToId}
          replyToName={replyToName}
          setReplyToId={setReplyToId}
          setReplyToName={setReplyToName}
          onSubmitSuccess={() => {
            // We no longer need to refresh comments after submitting one
            // The socket will handle updating the UI
            // But we should still clear the form
            setCommentText('');
            setImageFile(null);
            setYoutubeLink('');
            setReplyToId(null);
            setReplyToName('');
            
            // Still call onRefresh to update any other UI elements (like comment count)
            if (onRefresh) onRefresh();
          }}
        />
      </div>
    </div>
  );
}

// Wrapper component that provides the CommentStateProvider
export default function PostDetailView(props: PostDetailViewProps) {
  return (
    <CommentStateProvider>
      <PostDetailContent {...props} />
    </CommentStateProvider>
  );
}