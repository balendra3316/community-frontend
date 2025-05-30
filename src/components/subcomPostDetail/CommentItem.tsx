// "use client"
// import { MoreVertical, ThumbsUp, Trash, ChevronUp, ChevronDown } from 'lucide-react';
// import { Comment } from '../../services/commentService';
// import { User } from '../../context/AuthContext';

// interface CommentItemProps {
//   comment: Comment;
//   user: User | null;
//   isReply?: boolean;
//   formatRelativeTime: (timestamp: string) => string;
//   showActionMenu: string | null;
//   setShowActionMenu: (id: string | null) => void;
//   expandedComments: Set<string>;
//   toggleReplies: (commentId: string) => void;
//   onReply: (comment: Comment) => void;
//   onDelete: (commentId: string) => void;
//   onLike: (commentId: string) => void;
// }

// export default function CommentItem({
//   comment,
//   user,
//   isReply = false,
//   formatRelativeTime,
//   showActionMenu,
//   setShowActionMenu,
//   expandedComments,
//   toggleReplies,
//   onReply,
//   onDelete,
//   onLike
// }: CommentItemProps) {
//   const hasReplies = comment.replies && comment.replies.length > 0;
//   const isExpanded = expandedComments.has(comment._id);
  
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

//   return (
//     <div className={`${isReply ? 'ml-8' : ''} bg-gray-50 rounded-lg p-3 relative mb-3`}>
//       <div className="flex items-start">
//         <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden">
//           <img
//             src={comment.author.avatar || "/api/placeholder/40/40"}
//             alt={comment.author.name}
//             className="h-full w-full object-cover"
//           />
//         </div>
//         <div className="ml-2 flex-1">
//           <div className="flex items-center justify-between">
//             <div>
//               <span className="font-medium text-sm">{comment.author.name}</span>
//               {comment.author.badges && comment.author.badges.length > 0 && (
//                 <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full">
//                   {comment.author.badges.length}
//                 </span>
//               )}
//               <span className="text-xs text-gray-500 ml-2">{formatRelativeTime(comment.createdAt)}</span>
//             </div>
            
//             {user && comment.author._id === user._id && (
//               <div className="relative">
//                 <button 
//                   onClick={() => setShowActionMenu(showActionMenu === comment._id ? null : comment._id)}
//                   className="text-gray-500 hover:text-gray-700 p-1"
//                 >
//                   <MoreVertical size={16} />
//                 </button>
                
//                 {showActionMenu === comment._id && (
//                   <div className="absolute right-0 top-full mt-1 bg-white shadow-lg rounded-md z-10 w-32">
//                     <button
//                       onClick={() => onDelete(comment._id)}
//                       className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//                     >
//                       <Trash size={14} className="mr-2" />
//                       Delete
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
          
//           <p className="text-sm my-2">{comment.content}</p>
          
//           {comment.image && (
//             <div className="mt-2 mb-3 rounded-lg overflow-hidden">
//               <img
//                 src={comment.image}
//                 alt="Comment image"
//                 className="max-h-60 object-contain"
//               />
//             </div>
//           )}
          
//           {comment.youtubeLink && renderYoutubeEmbed(comment.youtubeLink)}
          
//           <div className="flex items-center text-xs text-gray-500 mt-2">
//             <button 
//               className={`flex items-center mr-4 ${
//                 user && comment.likes.includes(user._id) ? 'text-blue-600' : ''
//               }`}
//               onClick={() => onLike(comment._id)}
//             >
//               <ThumbsUp size={14} className={`mr-1 ${
//                 user && comment.likes.includes(user._id) ? 'fill-current' : ''
//               }`} />
//               <span>{comment.likes.length}</span>
//             </button>
//             <button 
//               className="hover:text-gray-700 mr-4"
//               onClick={() => onReply(comment)}
//             >
//               Reply
//             </button>
            
//             {hasReplies && (
//               <button 
//                 className="flex items-center text-blue-600 hover:text-blue-700"
//                 onClick={() => toggleReplies(comment._id)}
//               >
//                 {isExpanded ? (
//                   <>
//                     <ChevronUp size={14} className="mr-1" />
//                     <span>Hide {comment.replies?.length} {comment.replies?.length === 1 ? 'reply' : 'replies'}</span>
//                   </>
//                 ) : (
//                   <>
//                     <ChevronDown size={14} className="mr-1" />
//                     <span>Show {comment.replies?.length} {comment.replies?.length === 1 ? 'reply' : 'replies'}</span>
//                   </>
//                 )}
//               </button>
//             )}
//           </div>
          
//           {hasReplies && isExpanded && (
//             <div className="mt-3 space-y-3">
//               {comment.replies?.map(reply => (
//                 <CommentItem
//                   key={reply._id}
//                   comment={reply}
//                   user={user}
//                   isReply={true}
//                   formatRelativeTime={formatRelativeTime}
//                   showActionMenu={showActionMenu}
//                   setShowActionMenu={setShowActionMenu}
//                   expandedComments={expandedComments}
//                   toggleReplies={toggleReplies}
//                   onReply={onReply}
//                   onDelete={onDelete}
//                   onLike={onLike}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

















"use client"
import { MoreVertical, ThumbsUp, Trash, ChevronUp, ChevronDown } from 'lucide-react';
import { Comment } from '../../services/commentService';
import { User } from '../../context/AuthContext';
import { useCommentState, useCommentStateDispatch } from '../../types/CommentStateContext';

interface CommentItemProps {
  comment: Comment;
  user: User | null;
  isReply?: boolean;
  formatRelativeTime: (timestamp: string) => string;
  showActionMenu: string | null;
  setShowActionMenu: (id: string | null) => void;
  expandedComments: Set<string>;
  toggleReplies: (commentId: string) => void;
  onReply: (comment: Comment) => void;
  onDelete: (commentId: string) => void;
  onLike: (commentId: string) => void;
}

export default function CommentItem({
  comment,
  user,
  isReply = false,
  formatRelativeTime,
  showActionMenu,
  setShowActionMenu,
  expandedComments,
  toggleReplies,
  onReply,
  onDelete,
  onLike
}: CommentItemProps) {
  const hasReplies = comment.replies && comment.replies.length > 0;
  const isExpanded = expandedComments.has(comment._id);
  
  // Get state from CommentStateContext
  const { likedComments, likeCounts } = useCommentState();
  const { toggleLike } = useCommentStateDispatch();
  
  // Get values from context with fallbacks to server data
  const isLiked = likedComments[comment._id] ?? (user ? comment.likes.includes(user._id) : false);
  const currentLikeCount = likeCounts[comment._id] ?? comment.likes.length;
  
  // Handle optimistic like updates
  const handleLike = async () => {
    if (!user) return;
    
    // Update state optimistically through context
    toggleLike(comment._id, comment.likes, user._id);
    
    // Call the API in the background
    onLike(comment._id);
  };
  
  const renderYoutubeEmbed = (link: string) => {
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = link.match(youtubeRegex);
    
    if (match && match[1]) {
      const videoId = match[1];
      return (
        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-4">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className={`${isReply ? 'ml-8' : ''} bg-gray-50 rounded-lg p-3 relative mb-3`}>
      <div className="flex items-start">
        <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden">
          <img
            src={comment.author.avatar || "/api/placeholder/40/40"}
            alt={comment.author.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="ml-2 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-sm">{comment.author.name}</span>
              {comment.author.badges && comment.author.badges.length > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full">
                  {comment.author.badges.length}
                </span>
              )}
              <span className="text-xs text-gray-500 ml-2">{formatRelativeTime(comment.createdAt)}</span>
            </div>
            
            {user && comment.author._id === user._id && (
              <div className="relative">
                <button 
                  onClick={() => setShowActionMenu(showActionMenu === comment._id ? null : comment._id)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <MoreVertical size={16} />
                </button>
                
                {showActionMenu === comment._id && (
                  <div className="absolute right-0 top-full mt-1 bg-white shadow-lg rounded-md z-10 w-32">
                    <button
                      onClick={() => onDelete(comment._id)}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <Trash size={14} className="mr-2" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <p className="text-sm my-2">{comment.content}</p>
          
          {comment.image && (
            <div className="mt-2 mb-3 rounded-lg overflow-hidden">
              <img
                src={comment.image}
                alt="Comment image"
                className="max-h-60 object-contain"
              />
            </div>
          )}
          
          {comment.youtubeLink && renderYoutubeEmbed(comment.youtubeLink)}
          
          <div className="flex items-center text-xs text-gray-500 mt-2">
            <button 
              className={`flex items-center mr-4 ${isLiked ? 'text-blue-600' : ''}`}
              onClick={handleLike}
            >
              <ThumbsUp size={14} className={`mr-1 ${isLiked ? 'fill-current' : ''}`} />
              <span>{currentLikeCount}</span>
            </button>
            <button 
              className="hover:text-gray-700 mr-4"
              onClick={() => onReply(comment)}
            >
              Reply
            </button>
            
            {hasReplies && (
              <button 
                className="flex items-center text-blue-600 hover:text-blue-700"
                onClick={() => toggleReplies(comment._id)}
              >
                {isExpanded ? (
                  <>
                    <ChevronUp size={14} className="mr-1" />
                    <span>Hide {comment.replies?.length} {comment.replies?.length === 1 ? 'reply' : 'replies'}</span>
                  </>
                ) : (
                  <>
                    <ChevronDown size={14} className="mr-1" />
                    <span>Show {comment.replies?.length} {comment.replies?.length === 1 ? 'reply' : 'replies'}</span>
                  </>
                )}
              </button>
            )}
          </div>
          
          {hasReplies && isExpanded && (
            <div className="mt-3 space-y-3">
              {comment.replies?.map(reply => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  user={user}
                  isReply={true}
                  formatRelativeTime={formatRelativeTime}
                  showActionMenu={showActionMenu}
                  setShowActionMenu={setShowActionMenu}
                  expandedComments={expandedComments}
                  toggleReplies={toggleReplies}
                  onReply={onReply}
                  onDelete={onDelete}
                  onLike={onLike}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}