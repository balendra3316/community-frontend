

// "use client"

// import { useState, useEffect } from 'react';
// import { X, MessageSquare, ThumbsUp, Share2, Check, Instagram, Facebook, MessageCircle } from 'lucide-react';
// import { Post, voteOnPoll, likePost } from '../services/postService';
// import { Comment, fetchCommentsByPost, likeComment, deleteComment } from '../services/commentService';
// import { useAuth } from '../context/AuthContext';
// import dayjs from 'dayjs';
// import relativeTime from 'dayjs/plugin/relativeTime';
// import PostContent from './subcomPostDetail/PostContent';
// import CommentItem from './subcomPostDetail/CommentItem';
// import CommentForm from './subcomPostDetail/CommentForm';
// import { usePostStateDispatch } from '../types/PostStateContext';
// import { CommentStateProvider, useCommentStateDispatch } from '../types/CommentStateContext';
// import { getSocket } from '../services/socket.service';
// import { Dialog, DialogContent, DialogTitle, IconButton, Button, Box, Typography } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';

// dayjs.extend(relativeTime);

// interface PostDetailViewProps {
//   post: Post | null;
//   isOpen: boolean;
//   onClose: () => void;
//   onRefresh?: () => void;
// }

// function PostDetailContent({ post, isOpen, onClose, onRefresh }: PostDetailViewProps) {
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
//   const [copied, setCopied] = useState(false);
//   const [shareModalOpen, setShareModalOpen] = useState(false);
//   const { setLikedPosts, setLikeCounts, toggleLike } = usePostStateDispatch();
//   const { initializeCommentState } = useCommentStateDispatch();
//   const [pollVoting, setPollVoting] = useState(false);
//   const [pollVotes, setPollVotes] = useState<{[key: number]: string[]}>({});

//   useEffect(() => {
//     if (isOpen && post) {
//       setLikes(post.likes || []);
//       loadComments();
      
//       if (post.poll && post.poll.options) {
//         const votesMap: {[key: number]: string[]} = {};
//         post.poll.options.forEach((option, index) => {
//           votesMap[index] = option.votes || [];
//         });
//         setPollVotes(votesMap);
//       }
      
//       const socket = getSocket();
      
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
      
//       return () => {
//         socket.off('newComment');
//         socket.off('commentDeleted');
//       };
//     }
//   }, [isOpen, post]);

//   const handleCopyLink = () => {
//     if (!post) return;
//     const postUrl = `${window.location.origin}/post/${post._id}`;
//     navigator.clipboard.writeText(postUrl).then(() => {
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     }).catch(err => {
     
//     });
//   };

//   const handleShareClick = () => {
//     setShareModalOpen(true);
//   };

//   const handleShareModalClose = () => {
//     setShareModalOpen(false);
//     setCopied(false);
//   };

//   const handleShareToWhatsApp = () => {
//     if (!post) return;
//     const postUrl = `${window.location.origin}/post/${post._id}`;
//     const message = `Check out this post: ${postUrl}`;
//     const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
//     window.open(whatsappUrl, '_blank');
//   };

//   const handleShareToFacebook = () => {
//     if (!post) return;
//     const postUrl = `${window.location.origin}/post/${post._id}`;
//     const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
//     window.open(facebookUrl, '_blank');
//   };

//   // const handleShareToInstagram = () => {
//   //   // Instagram sharing via URL is limited; we'll use the copy link approach
//   //   // and inform users to paste it manually
//   //   handleCopyLink();
//   //   alert('Instagram does not support direct URL sharing. The link has been copied to your clipboard. Paste it in your Instagram post or story!');
//   // };

//   const handleNewComment = (data: {
//     postId: string;
//     comment: Comment;
//     isReply: boolean;
//     parentId: string | null;
//   }) => {
//     if (data.isReply && data.parentId) {
//       setComments(prevComments => {
//         const updatedComments = prevComments.map(comment => {
//           if (comment._id === data.parentId) {
//             const replies = comment.replies ? [...comment.replies, data.comment] : [data.comment];
//             return { ...comment, replies };
//           }
//           return comment;
//         });
        
//         if (user) {
//           initializeCommentState([data.comment], user._id);
//         }
        
//         return updatedComments;
//       });
      
//       setExpandedComments(prev => {
//         const newSet = new Set(prev);
//         if (data.parentId) {
//           newSet.add(data.parentId);
//         }
//         return newSet;
//       });
//     } else {
//       setComments(prevComments => {
//         const updatedComments = [data.comment, ...prevComments];
        
//         if (user) {
//           initializeCommentState([data.comment], user._id);
//         }
        
//         return updatedComments;
//       });
//     }
//   };

//   const handleCommentDeleted = (data: {
//     postId: string;
//     commentId: string;
//     isReply: boolean;
//     parentId: string | null;
//   }) => {
//     if (data.isReply && data.parentId) {
//       setComments(prevComments => {
//         return prevComments.map(comment => {
//           if (comment._id === data.parentId && comment.replies) {
//             const replies = comment.replies.filter(reply => reply._id !== data.commentId);
//             return { ...comment, replies };
//           }
//           return comment;
//         });
//       });
//     } else {
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
      
//       if (user) {
//         initializeCommentState(response.comments, user._id);
//       }
      
//       setPage(response.page);
//       setTotalPages(response.totalPages);
//     } catch (error) {
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleLikePost = async () => {
//     if (!post || !user) return;
    
//     try {
//       toggleLike(post._id, likes, user._id);
      
//       await likePost(post._id);
      
//       if (onRefresh) {
//         onRefresh();
//       }
//     } catch (error) {
//       toggleLike(post._id, likes, user._id);
//     }
//   };

//   const handleVote = async (optionIndex: number) => {
//     if (!post || !user) return;
    
//     const hasVoted = post.poll?.voters?.includes(user._id);
//     if (hasVoted) return;

//     try {
//       setPollVoting(true);
//       const response = await voteOnPoll(post._id, optionIndex);
      
//       if (response.voted && post.poll) {
//         const newVotes = {...pollVotes};
//         response.results.forEach((result, idx) => {
//           newVotes[idx] = result.votes;
//         });
//         setPollVotes(newVotes);
        
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
//     const now = dayjs();
//     const target = dayjs(timestamp);
//     const diffInSeconds = Math.abs(now.diff(target, 'second'));
    
//     if (diffInSeconds < 60) {
//       return `${diffInSeconds}s`;
//     } else if (diffInSeconds < 3600) {
//       return `${Math.floor(diffInSeconds / 60)}m`;
//     } else if (diffInSeconds < 86400) {
//       return `${Math.floor(diffInSeconds / 3600)}h`;
//     } else {
//       return `${Math.floor(diffInSeconds / 86400)}d`;
//     }
//   };

//   const isPostLikedByUser = !!(user && likes.includes(user._id));
//   const hasVotedOnPoll = !!user && !!post?.poll?.voters?.includes(user._id);

//   const handleLikeComment = async (commentId: string) => {
//     if (!user) return;
//     try {
//       await likeComment(commentId);
//     } catch (error) {
//     }
//   };

//   const handleDeleteComment = async (commentId: string) => {
//     try {
//       await deleteComment(commentId);
//       setShowActionMenu(null);
//       if (onRefresh) onRefresh();
//     } catch (error) {
//     }
//   };

//   if (!isOpen || !post) return null;

//   return (
//     <div className="fixed inset-0 bg-[rgba(144,144,144,0.6)] bg-opacity-50 z-60 flex items-center justify-center p-0 sm:p-4">
//       <div className="bg-white rounded-lg shadow-xl w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-3xl flex flex-col">
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 border-b">
//           <button
//             onClick={handleShareClick}
//             className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-gray-100"
//           >
//             <Share2 size={16} />
//             <span>Share</span>
//           </button>
          
//           <h3 className="text-lg font-medium absolute left-1/2 -translate-x-1/2">Post</h3>
          
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             <X size={20} />
//           </button>
//         </div>

//         {/* Share Modal */}
//         <Dialog open={shareModalOpen} onClose={handleShareModalClose}>
//           <DialogTitle>
//             Share Post
//             <IconButton
//               aria-label="close"
//               onClick={handleShareModalClose}
//               sx={{ position: 'absolute', right: 8, top: 8 }}
//             >
//               <CloseIcon />
//             </IconButton>
//           </DialogTitle>
//           <DialogContent>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
//               <Button
//                 variant="outlined"
//                 startIcon={<MessageCircle size={20} />}
//                 onClick={handleShareToWhatsApp}
//                 sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
//               >
//                 Share to WhatsApp
//               </Button>
              
//               <Button
//                 variant="outlined"
//                 startIcon={<Facebook size={20} />}
//                 onClick={handleShareToFacebook}
//                 sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
//               >
//                 Share to Facebook
//               </Button>
//               <Button
//                 variant="outlined"
//                 startIcon={copied ? <Check size={20} className="text-green-600" /> : <Share2 size={20} />}
//                 onClick={handleCopyLink}
//                 sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
//               >
//                 {copied ? <Typography color="green">Copied!</Typography> : 'Copy Link'}
//               </Button>
//             </Box>
//           </DialogContent>
//         </Dialog>

//         {/* Content */}
//         <div className="flex-1 overflow-y-auto">
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
//                     onLike={handleLikeComment}
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
//             setCommentText('');
//             setImageFile(null);
//             setYoutubeLink('');
//             setReplyToId(null);
//             setReplyToName('');
            
//             if (onRefresh) onRefresh();
//           }}
//         />
//       </div>
//     </div>
//   );
// }

// export default function PostDetailView(props: PostDetailViewProps) {
//   return (
//     <CommentStateProvider>
//       <PostDetailContent {...props} />
//     </CommentStateProvider>
//   );
// }





// "use client"

// import { useState, useEffect } from 'react';
// import { X, MessageSquare, ThumbsUp, Share2 } from 'lucide-react';
// import { Post, voteOnPoll, likePost } from '../services/postService';
// import { Comment, fetchCommentsByPost, likeComment, deleteComment } from '../services/commentService';
// import { useAuth } from '../context/AuthContext';
// import dayjs from 'dayjs';
// import relativeTime from 'dayjs/plugin/relativeTime';
// import PostContent from './subcomPostDetail/PostContent';
// import CommentItem from './subcomPostDetail/CommentItem';
// import CommentForm from './subcomPostDetail/CommentForm';
// import { usePostStateDispatch } from '../types/PostStateContext';
// import { CommentStateProvider, useCommentStateDispatch } from '../types/CommentStateContext';
// import { getSocket } from '../services/socket.service';
// import ShareModal from './SharePostModal'; // Import the new ShareModal component

// dayjs.extend(relativeTime);

// interface PostDetailViewProps {
//   post: Post | null;
//   isOpen: boolean;
//   onClose: () => void;
//   onRefresh?: () => void;
// }

// function PostDetailContent({ post, isOpen, onClose, onRefresh }: PostDetailViewProps) {
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
//   const [shareModalOpen, setShareModalOpen] = useState(false);
//   const { setLikedPosts, setLikeCounts, toggleLike } = usePostStateDispatch();
//   const { initializeCommentState } = useCommentStateDispatch();
//   const [pollVoting, setPollVoting] = useState(false);
//   const [pollVotes, setPollVotes] = useState<{[key: number]: string[]}>({});

//   useEffect(() => {
//     if (isOpen && post) {
//       setLikes(post.likes || []);
//       loadComments();
      
//       if (post.poll && post.poll.options) {
//         const votesMap: {[key: number]: string[]} = {};
//         post.poll.options.forEach((option, index) => {
//           votesMap[index] = option.votes || [];
//         });
//         setPollVotes(votesMap);
//       }
      
//       const socket = getSocket();
      
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
      
//       return () => {
//         socket.off('newComment');
//         socket.off('commentDeleted');
//       };
//     }
//   }, [isOpen, post]);

//   const handleShareClick = () => {
//     setShareModalOpen(true);
//   };

//   const handleNewComment = (data: {
//     postId: string;
//     comment: Comment;
//     isReply: boolean;
//     parentId: string | null;
//   }) => {
//     if (data.isReply && data.parentId) {
//       setComments(prevComments => {
//         const updatedComments = prevComments.map(comment => {
//           if (comment._id === data.parentId) {
//             const replies = comment.replies ? [...comment.replies, data.comment] : [data.comment];
//             return { ...comment, replies };
//           }
//           return comment;
//         });
        
//         if (user) {
//           initializeCommentState([data.comment], user._id);
//         }
        
//         return updatedComments;
//       });
      
//       setExpandedComments(prev => {
//         const newSet = new Set(prev);
//         if (data.parentId) {
//           newSet.add(data.parentId);
//         }
//         return newSet;
//       });
//     } else {
//       setComments(prevComments => {
//         const updatedComments = [data.comment, ...prevComments];
        
//         if (user) {
//           initializeCommentState([data.comment], user._id);
//         }
        
//         return updatedComments;
//       });
//     }
//   };

//   const handleCommentDeleted = (data: {
//     postId: string;
//     commentId: string;
//     isReply: boolean;
//     parentId: string | null;
//   }) => {
//     if (data.isReply && data.parentId) {
//       setComments(prevComments => {
//         return prevComments.map(comment => {
//           if (comment._id === data.parentId && comment.replies) {
//             const replies = comment.replies.filter(reply => reply._id !== data.commentId);
//             return { ...comment, replies };
//           }
//           return comment;
//         });
//       });
//     } else {
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
      
//       if (user) {
//         initializeCommentState(response.comments, user._id);
//       }
      
//       setPage(response.page);
//       setTotalPages(response.totalPages);
//     } catch (error) {
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleLikePost = async () => {
//     if (!post || !user) return;
    
//     try {
//       toggleLike(post._id, likes, user._id);
      
//       await likePost(post._id);
      
//       if (onRefresh) {
//         onRefresh();
//       }
//     } catch (error) {
//       toggleLike(post._id, likes, user._id);
//     }
//   };

//   const handleVote = async (optionIndex: number) => {
//     if (!post || !user) return;
    
//     const hasVoted = post.poll?.voters?.includes(user._id);
//     if (hasVoted) return;

//     try {
//       setPollVoting(true);
//       const response = await voteOnPoll(post._id, optionIndex);
      
//       if (response.voted && post.poll) {
//         const newVotes = {...pollVotes};
//         response.results.forEach((result, idx) => {
//           newVotes[idx] = result.votes;
//         });
//         setPollVotes(newVotes);
        
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
//     const now = dayjs();
//     const target = dayjs(timestamp);
//     const diffInSeconds = Math.abs(now.diff(target, 'second'));
    
//     if (diffInSeconds < 60) {
//       return `${diffInSeconds}s`;
//     } else if (diffInSeconds < 3600) {
//       return `${Math.floor(diffInSeconds / 60)}m`;
//     } else if (diffInSeconds < 86400) {
//       return `${Math.floor(diffInSeconds / 3600)}h`;
//     } else {
//       return `${Math.floor(diffInSeconds / 86400)}d`;
//     }
//   };

//   const isPostLikedByUser = !!(user && likes.includes(user._id));
//   const hasVotedOnPoll = !!user && !!post?.poll?.voters?.includes(user._id);

//   const handleLikeComment = async (commentId: string) => {
//     if (!user) return;
//     try {
//       await likeComment(commentId);
//     } catch (error) {
//     }
//   };

//   const handleDeleteComment = async (commentId: string) => {
//     try {
//       await deleteComment(commentId);
//       setShowActionMenu(null);
//       if (onRefresh) onRefresh();
//     } catch (error) {
//     }
//   };

//   if (!isOpen || !post) return null;

//   return (
//     <div className="fixed inset-0 bg-[rgba(144,144,144,0.6)] bg-opacity-50 z-60 flex items-center justify-center p-0 sm:p-4">
//       <div className="bg-white rounded-lg shadow-xl w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-3xl flex flex-col">
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 border-b">
//           <button
//             onClick={handleShareClick}
//             className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-gray-100"
//           >
//             <Share2 size={16} />
//             <span>Share</span>
//           </button>
          
//           <h3 className="text-lg font-medium absolute left-1/2 -translate-x-1/2">Post</h3>
          
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             <X size={20} />
//           </button>
//         </div>

//         {/* Share Modal */}
//         <ShareModal
//           isOpen={shareModalOpen}
//           onClose={() => setShareModalOpen(false)}
//           shareUrl={`${window.location.origin}/post/${post._id}`}
//           shareTitle={`Share ${post.author.name ? post.author.name.split(' ')[0] : 'User'}'s Post`}
//         />

//         {/* Content */}
//         <div className="flex-1 overflow-y-auto">
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
//                     onLike={handleLikeComment}
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
//                     className="w-full py-2 text-orange-600 font-medium text-sm hover:bg-gray-50 rounded-md"
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
//             setCommentText('');
//             setImageFile(null);
//             setYoutubeLink('');
//             setReplyToId(null);
//             setReplyToName('');
            
//             if (onRefresh) onRefresh();
//           }}
//         />
//       </div>
//     </div>
//   );
// }

// export default function PostDetailView(props: PostDetailViewProps) {
//   return (
//     <CommentStateProvider>
//       <PostDetailContent {...props} />
//     </CommentStateProvider>
//   );
// }




"use client"

import { useState, useEffect } from 'react';
import { X, Share2 } from 'lucide-react';
import { Post, voteOnPoll, likePost } from '../services/postService';
import { Comment, fetchCommentsByPost, likeComment, deleteComment } from '../services/commentService';
import { useAuth } from '../context/AuthContext';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PostContent from './subcomPostDetail/PostContent';
import CommentItem from './subcomPostDetail/CommentItem';
import CommentForm from './subcomPostDetail/CommentForm';
import { usePostStateDispatch } from '../types/PostStateContext';
import { CommentStateProvider, useCommentStateDispatch } from '../types/CommentStateContext';
import { getSocket } from '../services/socket.service';
import ShareModal from './SharePostModal';

dayjs.extend(relativeTime);

interface PostDetailViewProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

const addReplyRecursively = (
  comments: Comment[],
  parentId: string,
  newReply: Comment
): Comment[] => {
  return comments.map((comment) => {
    if (comment._id === parentId) {
      const replies = comment.replies ? [...comment.replies, newReply] : [newReply];
      return { ...comment, replies };
    }
    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: addReplyRecursively(comment.replies, parentId, newReply),
      };
    }
    return comment;
  });
};

const generateFlatRenderList = (comments: Comment[]): (Comment & { isReply: boolean })[] => {
  const flatList: (Comment & { isReply: boolean })[] = [];

  const addRepliesRecursively = (replies: Comment[]) => {
    for (const reply of replies) {
      flatList.push({ ...reply, isReply: true });
      if (reply.replies && reply.replies.length > 0) {
        addRepliesRecursively(reply.replies);
      }
    }
  };

  for (const topLevelComment of comments) {
    flatList.push({ ...topLevelComment, isReply: false });
    if (topLevelComment.replies && topLevelComment.replies.length > 0) {
      addRepliesRecursively(topLevelComment.replies);
    }
  }

  return flatList;
};


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
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const { toggleLike } = usePostStateDispatch();
  const { initializeCommentState } = useCommentStateDispatch();
  const [pollVoting, setPollVoting] = useState(false);
  const [pollVotes, setPollVotes] = useState<{[key: number]: string[]}>({});

  useEffect(() => {
    if (isOpen && post) {
      setLikes(post.likes || []);
      loadComments();
      
      if (post.poll && post.poll.options) {
        const votesMap: {[key: number]: string[]} = {};
        post.poll.options.forEach((option, index) => {
          votesMap[index] = option.votes || [];
        });
        setPollVotes(votesMap);
      }
      
      const socket = getSocket();
      
      socket.on('newComment', (data: { postId: string; comment: Comment; isReply: boolean; parentId: string | null; }) => {
        if (data.postId === post._id) {
          handleNewComment(data);
        }
      });
      
      socket.on('commentDeleted', (data: { postId: string; commentId: string; }) => {
        if (data.postId === post._id) {
          loadComments();
        }
      });
      
      return () => {
        socket.off('newComment');
        socket.off('commentDeleted');
      };
    }
  }, [isOpen, post]);

  const handleShareClick = () => setShareModalOpen(true);

  const handleNewComment = (data: { comment: Comment; isReply: boolean; parentId: string | null; }) => {
    if (data.isReply && data.parentId) {
      setComments(prevComments => addReplyRecursively(prevComments, data.parentId!, data.comment));
    } else {
      setComments(prevComments => [data.comment, ...prevComments]);
    }

    if (user) initializeCommentState([data.comment], user._id);
  };

  const loadComments = async (pageNum = 1) => {
    if (!post) return;
    
    try {
      setIsLoading(true);
      const response = await fetchCommentsByPost(post._id, pageNum);
      if (pageNum === 1) setComments(response.comments);
      else setComments(prev => [...prev, ...response.comments]);
      
      if (user) initializeCommentState(response.comments, user._id);
      
      setPage(response.page);
      setTotalPages(response.totalPages);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikePost = async () => {
    if (!post || !user) return;
    try {
      toggleLike(post._id, likes, user._id);
      await likePost(post._id);
      if (onRefresh) onRefresh();
    } catch (error) {
      toggleLike(post._id, likes, user._id);
    }
  };

  const handleVote = async (optionIndex: number) => {
    if (!post || !user || hasVotedOnPoll) return;
    try {
      setPollVoting(true);
      const response = await voteOnPoll(post._id, optionIndex);
      if (response.voted && post.poll) {
        const newVotes = {...pollVotes};
        response.results.forEach((result, idx) => { newVotes[idx] = result.votes; });
        setPollVotes(newVotes);
        post.poll.voters = [...(post.poll.voters || []), user._id];
      }
      if (onRefresh) onRefresh();
    } catch (error) {
    } finally {
      setPollVoting(false);
    }
  };

  const formatRelativeTime = (timestamp: string) => {
    const diffInSeconds = Math.abs(dayjs().diff(dayjs(timestamp), 'second'));
    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  const isPostLikedByUser = !!(user && likes.includes(user._id));
  const hasVotedOnPoll = !!user && !!post?.poll?.voters?.includes(user._id);

  const handleLikeComment = async (commentId: string) => {
    if (!user) return;
    try { await likeComment(commentId); } catch (error) {}
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      setShowActionMenu(null);
      loadComments();
    } catch (error) {}
  };

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(144,144,144,0.6)] bg-opacity-50 z-60 flex items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-3xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <button onClick={handleShareClick} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-gray-100">
            <Share2 size={16} /> <span>Share</span>
          </button>
          <h3 className="text-lg font-medium absolute left-1/2 -translate-x-1/2">Post</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <ShareModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} shareUrl={`${window.location.origin}/post/${post._id}`} shareTitle={`Share ${post.author.name ? post.author.name.split(' ')[0] : 'User'}'s Post`} />

        <div className="flex-1 overflow-y-auto">
          {/* CORRECTED PostContent CALL */}
          <PostContent post={post} formatRelativeTime={formatRelativeTime} handleLikePost={handleLikePost} isPostLikedByUser={isPostLikedByUser} handleVote={handleVote} pollVoting={pollVoting} hasVotedOnPoll={hasVotedOnPoll} likes={likes} />

          <div className="p-4">
            <h4 className="font-medium mb-4">Comments</h4>
            {isLoading && page === 1 ? (
              <div className="text-center py-4"><div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div></div>
            ) : comments.length > 0 ? (
              <div className="space-y-4">
                {/* CORRECTED CommentItem MAPPING */}
                {generateFlatRenderList(comments).map(commentNode => (
                  <CommentItem
                    key={commentNode._id}
                    comment={commentNode}
                    isReply={commentNode.isReply}
                    user={user}
                    formatRelativeTime={formatRelativeTime}
                    showActionMenu={showActionMenu}
                    setShowActionMenu={setShowActionMenu}
                    onReply={(comment: Comment) => { // ADDED TYPE HERE
                      setReplyToId(comment._id);
                      setReplyToName(comment.author.name);
                      const authorFirstName = comment.author.name.split(' ')[0];
                      setCommentText(`@${authorFirstName} `);
                      document.getElementById('comment-input')?.focus();
                    }}
                    onDelete={handleDeleteComment}
                    onLike={handleLikeComment}
                  />
                ))}
                
                {page < totalPages && !isLoading && (
                  <button onClick={() => loadComments(page + 1)} className="w-full py-2 text-orange-600 font-medium text-sm hover:bg-gray-50 rounded-md">
                    Load more comments
                  </button>
                )}
                {isLoading && page > 1 && (<div className="text-center py-2"><div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div></div>)}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No comments yet. Be the first to comment!</div>
            )}
          </div>
        </div>

        <CommentForm user={user} post={post} commentText={commentText} setCommentText={setCommentText} imageFile={imageFile} setImageFile={setImageFile} youtubeLink={youtubeLink} setYoutubeLink={setYoutubeLink} replyToId={replyToId} replyToName={replyToName} setReplyToId={setReplyToId} setReplyToName={setReplyToName}
          onSubmitSuccess={() => {
            setCommentText(''); setImageFile(null); setYoutubeLink(''); setReplyToId(null); setReplyToName('');
            if (onRefresh) onRefresh();
          }}
        />
      </div>
    </div>
  );
}

export default function PostDetailView(props: PostDetailViewProps) {
  return (<CommentStateProvider><PostDetailContent {...props} /></CommentStateProvider>);
}