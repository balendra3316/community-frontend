

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