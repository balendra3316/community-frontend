"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Post } from '../services/postService';
import { Comment, fetchCommentsByPost } from '../services/commentService';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
// NEW: Import icons for the copy button and updated CTA
import { ArrowRight, Share2, Check } from 'lucide-react'; 
import PostContent from './subcomPostDetail/PostContent';

dayjs.extend(relativeTime);

interface PublicPostViewProps {
  post: Post;
}

// A simplified, read-only version of a comment item for public view.
const PublicCommentItem = ({ comment }: { comment: Comment }) => {
  const formatRelativeTime = (timestamp: string) => dayjs(timestamp).fromNow();

  return (
    <div className="flex items-start space-x-3">
      <img src={comment.author.avatar || '/default-avatar.png'} alt={comment.author.name} className="h-9 w-9 rounded-full bg-gray-200" />
      <div className="flex-1">
        <div className="bg-gray-100 rounded-lg px-3 py-2">
          <p className="text-sm font-semibold text-gray-800">{comment.author.name}</p>
          {/* FIX: The property is 'content', not 'text' */}
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
        </div>
        <div className="pl-3 mt-1 text-xs text-gray-500">
          <span>{formatRelativeTime(comment.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};


export default function PublicPostView({ post }: PublicPostViewProps) {
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  // NEW: State for the copy link button
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!post) return;
    const loadComments = async () => {
      try {
        setLoadingComments(true);
        const response = await fetchCommentsByPost(post._id, 1);
        setComments(response.comments);
      } catch (error) {
        
      } finally {
        setLoadingComments(false);
      }
    };
    loadComments();
  }, [post]);

  const handleCopyLink = () => {
    // We can use window.location.href because we are on the post's direct URL
    navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
  };
  
  const formatRelativeTime = (timestamp: string) => dayjs(timestamp).fromNow();

  return (
    <div className="fixed inset-0 bg-[rgba(144,144,144,0.6)] bg-opacity-50 z-60 flex items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-3xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
            {/* NEW: Copy Link Button */}
            <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-gray-100"
            >
                {copied ? (
                    <>
                        <Check size={16} className="text-green-600" />
                        <span className="text-green-600 font-medium">Copied!</span>
                    </>
                ) : (
                    <>
                        <Share2 size={16} />
                        <span>Copy Link</span>
                    </>
                )}
            </button>
            <h3 className="text-lg font-medium absolute left-1/2 -translate-x-1/2">Post</h3>
            <button onClick={() => router.push('/')} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <PostContent 
            post={post}
            formatRelativeTime={formatRelativeTime}
            // FIX: Pass async functions to match the required Promise signature
            handleLikePost={async () => {}}
            isPostLikedByUser={false}
            handleVote={async () => {}}
            pollVoting={false}
            hasVotedOnPoll={false}
            likes={post.likes}
          />

          {/* Public Call to Action */}
          <div className="p-4 my-4 bg-amber-50 border-y border-amber-200">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-bold text-amber-800">Join the discussion!</h4>
                    <p className="text-sm text-amber-700">Log in or create an account to like, comment, and vote.</p>
                </div>
                {/* STYLE: Updated button colors */}
                <button 
                    onClick={() => router.push('/')}
                    className="flex items-center gap-2 bg-yellow-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-yellow-600 transition-colors"
                >
                    Join Now <ArrowRight size={16} />
                </button>
            </div>
          </div>

          <div className="p-4">
            <h4 className="font-medium mb-4">Comments ({post.totalComments || comments.length})</h4>
            {loadingComments ? (
              <div className="text-center py-4">
                <div className="animate-spin h-6 w-6 border-2 border-gray-400 border-t-transparent rounded-full mx-auto"></div>
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map(comment => (
                  <PublicCommentItem key={comment._id} comment={comment} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No comments on this post yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}