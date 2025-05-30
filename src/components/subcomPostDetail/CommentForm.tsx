"use client";
import { useState, useRef, useEffect } from "react";
import { X, Smile, AlertCircle } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { Post } from "../../services/postService";
import { createComment } from "../../services/commentService";
import { User } from "../../context/AuthContext";

// Using the bad-words npm package
import { Filter } from "bad-words";

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
  onSubmitSuccess,
}: CommentFormProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const MAX_WORDS = 50;

  // Update word count whenever comment text changes
  useEffect(() => {
    const words = commentText.trim() ? commentText.trim().split(/\s+/) : [];
    setWordCount(words.length);

    // Reset error state when text changes
    if (hasError) {
      setHasError(false);
      setErrorMessage("");
    }
  }, [commentText]);

  // Create a filter instance with custom words and better options
  const [filter] = useState(() => {
    const filterInstance = new Filter();

    // Add your custom words
    filterInstance.addWords("fuckk", "customword2");

    // You can add many variations of the same word to be thorough
    const variations = [
      "fuckk",
      "fuuuck",
      "fuuck",
      "f u c k",
      "f*ck",
      "f**k",
      "fuk",
    ];
    filterInstance.addWords(...variations);

    return filterInstance;
  });

  // Enhanced check for bad words - this is the key improvement
  const containsBadWords = (text: string) => {
    try {
      // First try the basic filter check
      if (filter.isProfane(text)) {
        return true;
      }

      // Then try more aggressive normalization for evasion tactics
      const normalizedText = text
        .toLowerCase()
        // Remove spaces between single characters (catches "f u c k")
        .replace(/\b(\w)\s+(\w)\s+(\w)\s+(\w)\b/g, "$1$2$3$4")
        // Remove common substitution characters
        .replace(/[*_\-\.@#\$%\^&\+\=\[\]\{\}]/g, "")
        // Remove repeated characters (convert "fuuuck" to "fuck")
        .replace(/([a-z])\1+/g, "$1");

      // Check the normalized version
      return filter.isProfane(normalizedText);
    } catch (error) {
      console.error("Error checking profanity:", error);
      return false;
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    const words = newText.trim() ? newText.trim().split(/\s+/) : [];

    if (words.length > MAX_WORDS) {
      // Don't update the text if it exceeds the word limit
      return;
    }

    setCommentText(newText);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() && !imageFile) return;
    if (!post || !user) return;
    if (isSubmitting) return; // Prevent double submission

    // Check word count
    if (wordCount > MAX_WORDS) {
      setHasError(true);
      setErrorMessage(`Comment exceeds maximum of ${MAX_WORDS} words.`);
      return;
    }

    // Check for bad words
    if (containsBadWords(commentText)) {
      setHasError(true);
      setErrorMessage("Your comment contains inappropriate language.");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("content", commentText);

      if (replyToId) {
        formData.append("parentId", replyToId);
      }

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (youtubeLink) {
        formData.append("youtubeLink", youtubeLink);
      }

      await createComment(post._id, formData);

      // Note: We don't need to manually update the comments list anymore
      // The socket event will handle that

      // Call onSubmitSuccess to do any additional cleanup in the parent component
      onSubmitSuccess();
    } catch (error) {
      console.error("Error creating comment:", error);
      setHasError(true);
      setErrorMessage("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEmojiClick = (emojiObject: { emoji: string }) => {
    // Make sure adding the emoji won't exceed word limit
    const newText = commentText + emojiObject.emoji;
    const words = newText.trim() ? newText.trim().split(/\s+/) : [];

    if (words.length <= MAX_WORDS) {
      setCommentText(newText);
    }
    setShowEmojiPicker(false);
  };

  return (
    <form onSubmit={handleSubmitComment} className="border-t p-4">
      {replyToId && (
        <div className="bg-blue-50 rounded p-2 mb-2 flex justify-between items-center">
          <span className="text-sm">Replying to {replyToName}</span>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700"
            onClick={() => {
              setReplyToId(null);
              setReplyToName("");
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

      {hasError && (
        <div className="mb-2 text-red-500 text-sm flex items-center">
          <AlertCircle size={16} className="mr-1" />
          {errorMessage}
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
        <div className="flex-1 relative">
          <div className="flex flex-col w-full">
            <div className="flex items-center border rounded-full px-4 py-2 bg-gray-50">
              <input
                id="comment-input"
                type="text"
                value={commentText}
                onChange={handleTextChange}
                placeholder="Write a comment..."
                className="flex-1 bg-transparent text-sm focus:outline-none"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="ml-2 text-gray-500 hover:text-gray-700"
                disabled={isSubmitting}
              >
                <Smile size={20} />
              </button>
              <button
                type="submit"
                disabled={
                  (!commentText.trim() && !imageFile) ||
                  hasError ||
                  isSubmitting
                }
                className={`ml-2 ${
                  (commentText.trim() || imageFile) &&
                  !hasError &&
                  !isSubmitting
                    ? "text-blue-600 hover:text-blue-700"
                    : "text-gray-400 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                )}
              </button>
            </div>
            <div className="flex justify-between mt-1 px-2 text-xs text-gray-500">
              <span className={wordCount > MAX_WORDS ? "text-red-500" : ""}>
                {wordCount}/{MAX_WORDS} words
              </span>
            </div>
          </div>

          {showEmojiPicker && (
            <div className="absolute bottom-14 right-0 z-10">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
