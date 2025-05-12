"use client"
import { useState, useRef } from 'react';
import { X } from 'lucide-react';
import { Post } from '../../services/postService';
import { createComment } from '../../services/commentService';
import { User } from '../../context/AuthContext';

interface CommentFormProps {
  user: User | null;
  post: Post;
  commentText: string;
  setCommentText: (text: string) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  youtubeLink: string;
  setYoutubeLink: (link: string) => void;
  replyToId: string | null;
  replyToName: string;
  setReplyToId: (id: string | null) => void;
  setReplyToName: (name: string) => void;
  onSubmitSuccess: () => void;
}

export default function CommentForm({
  user,
  post,
  commentText,
  setCommentText,
  imageFile,
  setImageFile,
  youtubeLink,
  setYoutubeLink,
  replyToId,
  replyToName,
  setReplyToId,
  setReplyToName,
  onSubmitSuccess
}: CommentFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() && !imageFile) return;
    if (!post || !user) return;

    try {
      const formData = new FormData();
      formData.append('content', commentText);
      
      if (replyToId) {
        formData.append('parentId', replyToId);
      }
      
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      if (youtubeLink) {
        formData.append('youtubeLink', youtubeLink);
      }

      await createComment(post._id, formData);
      
      // Reset form fields
      setCommentText('');
      setReplyToId(null);
      setReplyToName('');
      setImageFile(null);
      setYoutubeLink('');
      
      // Notify parent component to refresh comments
      onSubmitSuccess();
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmitComment} className="border-t p-4">
      {replyToId && (
        <div className="bg-blue-50 rounded p-2 mb-2 flex justify-between items-center">
          <span className="text-sm">
            Replying to {replyToName}
          </span>
          <button 
            type="button" 
            className="text-gray-500 hover:text-gray-700"
            onClick={() => {
              setReplyToId(null);
              setReplyToName('');
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}
      
      {imageFile && (
        <div className="mb-2 relative">
          <div className="relative rounded-lg overflow-hidden">
            <img 
              src={URL.createObjectURL(imageFile)} 
              alt="Selected image" 
              className="max-h-48 object-contain"
            />
            <button
              type="button"
              onClick={() => setImageFile(null)}
              className="absolute top-1 right-1 bg-gray-800 bg-opacity-50 rounded-full p-1 text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
      
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden mr-2">
          <img
            src={user?.avatar || "/api/placeholder/40/40"}
            alt="Your avatar"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1 flex items-center border rounded-full px-4 py-2 bg-gray-50">
          <input
            id="comment-input"
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 bg-transparent text-sm focus:outline-none"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleImageSelect}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </button>
          <button
            type="submit"
            disabled={!commentText.trim() && !imageFile}
            className={`ml-2 ${
              commentText.trim() || imageFile
                ? 'text-blue-600 hover:text-blue-700' 
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
}