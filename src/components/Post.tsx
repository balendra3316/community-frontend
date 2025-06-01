import { useState, useEffect } from "react";
import {
  MessageSquare,
  ThumbsUp,
  X,
  MoreVertical,
  Trash,
  Clock,
  User,
} from "lucide-react";
import {
  Post as PostType,
  likePost,
  deletePost,
} from "../services/postService";
import { useAuth } from "../context/AuthContext";
import { usePostState, usePostStateDispatch } from "../types/PostStateContext";
import { Avatar } from "@mui/material";

interface PostProps {
  post: PostType;
  onRefresh?: () => void;
  onDelete?: (postId: string) => void;
}

export default function Post({ post, onRefresh, onDelete }: PostProps) {
  const { user } = useAuth();
  const [isLiking, setIsLiking] = useState(false);
  const [showYoutubeModal, setShowYoutubeModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { likedPosts, likeCounts } = usePostState();
  const { setLikedPosts, setLikeCounts, toggleLike } = usePostStateDispatch();

  const isOwnPost = user && post.author._id === user._id;

  useEffect(() => {
    if (user && post) {
      if (likedPosts[post._id] === undefined) {
        const isLikedFromServer = post.likes.includes(user._id);

        setLikedPosts((prev) => ({ ...prev, [post._id]: isLikedFromServer }));
        setLikeCounts((prev) => ({ ...prev, [post._id]: post.likes.length }));
      }
    }
  }, [post._id, user, post.likes]);

  useEffect(() => {
    const handleClickOutside = () => {
      setShowMenu(false);
    };

    if (showMenu) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showMenu]);

  const isLiked =
    likedPosts[post._id] ?? (user ? post.likes.includes(user._id) : false);
  const currentLikeCount = likeCounts[post._id] ?? post.likes.length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    const isToday =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    const isYesterday =
      date.getFullYear() === yesterday.getFullYear() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getDate() === yesterday.getDate();

    if (isToday) {
      return "Today";
    } else if (isYesterday) {
      return "Yesterday";
    } else {
      const diffTime = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 30) {
        return `${diffDays}d`;
      } else {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || isLiking) return;

    try {
      setIsLiking(true);

      const isCurrentlyLikedFromServer = post.likes.includes(user._id);

      toggleLike(post._id, post.likes, user._id);

      await likePost(post._id);

      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      toggleLike(post._id, post.likes, user._id);
    } finally {
      setIsLiking(false);
    }
  };

  const formatLastCommentTime = (
    lastCommentDate: string | null | undefined
  ): string => {
    if (!lastCommentDate) return "";

    const commentDate = new Date(lastCommentDate);
    const now = new Date();

    const diffTime = now.getTime() - commentDate.getTime();
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 3) {
      if (diffHours < 1) {
        return "New comment just now";
      } else if (diffHours < 24) {
        return `New comment ${diffHours}h ago`;
      } else {
        return `New comment ${diffDays}d ago`;
      }
    } else {
      const month = commentDate.toLocaleString("en-US", { month: "short" });
      const day = commentDate.getDate();

      if (commentDate.getFullYear() !== now.getFullYear()) {
        return `Last comment ${day} ${month} ${commentDate.getFullYear()}`;
      }

      return `Last comment ${day} ${month}`;
    }
  };

  const handleDeletePost = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      await deletePost(post._id);
      setShowDeleteModal(false);

      if (onDelete) {
        onDelete(post._id);
      }

      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  };

  const getYoutubeId = (url: string): string => {
    if (!url) return "";

    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : "";
  };

  const getYoutubeThumbnail = (url: string): string => {
    const videoId = getYoutubeId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";
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

  const hasYoutubeLink = post.youtubeLink && getYoutubeId(post.youtubeLink);

  const hasMedia = post.image || hasYoutubeLink;

  const lastCommentTimeFormatted = formatLastCommentTime(post.lastComment);

  const cardStyle = post.isPinned
    ? {
        border: "1px solid rgb(248, 212, 129)",
        boxShadow:
          "rgba(248, 212, 129, 0.32) 0px 2px 2px 0px, rgba(248, 212, 129, 0.32) 0px 2px 6px 0px, rgba(248, 212, 129, 0.2) 0px 1px 8px 0px",
        borderRadius: "10px",
      }
    : {
        border: "1px solid rgb(228, 228, 228)",
        borderRadius: "10px",
        boxShadow:
          "rgba(60, 64, 67, 0.32) 0px 1px 2px, rgba(60, 64, 67, 0.15) 0px 2px 6px, rgba(0, 0, 0, 0.1) 0px 1px 8px",
      };

  return (
    <div
      className="bg-white rounded-lg overflow-hidden mb-4 cursor-pointer hover:shadow-md transition-shadow w-full mx-auto"
      style={{
        ...cardStyle,
        maxWidth: "750px",
        height: "auto",
      }}
    >
      {/* Post Header */}
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
              <Avatar
                src={post.author.avatar}
                alt={post.author.name?.charAt(0).toUpperCase()}
                className="h-full w-full bg-gray-300"
              />
            </div>
          </div>
          <div className="ml-3 flex-1">
            <div className="flex items-center justify-between">
              <div>
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
                    <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-5 py-0.5 rounded-full">
                      {post.tags[0]}
                    </span>
                  )}
                </div>
              </div>

              {/* Show 3-dot menu only for the post owner */}
              {isOwnPost && (
                <div className="relative">
                  <button
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    onClick={toggleMenu}
                  >
                    <MoreVertical size={18} className="text-gray-500" />
                  </button>

                  {/* Dropdown Menu */}
                  {showMenu && (
                    <div
                      className="absolute right-0 top-8 w-36 bg-white shadow-lg rounded-md border border-gray-200 z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        className="p-2 hover:bg-gray-100 cursor-pointer flex items-center text-gray-700"
                        onClick={() => {
                          setShowMenu(false);
                          setShowDeleteModal(true);
                        }}
                      >
                        <Trash size={16} className="mr-2 text-red-500" />
                        <span>Delete Post</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Layout with Media - Mobile First Approach */}
        <div className="flex flex-col gap-4">
          {/* Mobile View: Title and Content FIRST */}
          <div className="sm:hidden w-full">
            {/* Title with truncation for mobile */}
            {/* <h3
              className="font-bold mb-2 text-ellipsis overflow-hidden"
              style={{
                fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                fontSize: "18px",
                lineHeight: "1.4",
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
                textOverflow: "ellipsis",
              }}
            >
              {post.title}
            </h3> */}
            <h3
             className="text-gray-700 overflow-hidden mb-3"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: "3",
                WebkitBoxOrient: "vertical",
                textOverflow: "ellipsis",
              }}
            >
              {post.title}
            </h3>


   

            {/* Content with truncation for mobile */}
            <p
              className="text-gray-700 overflow-hidden mb-3"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: "3",
                WebkitBoxOrient: "vertical",
                textOverflow: "ellipsis",
              }}
            >
              {post.content}
            </p>
          </div>

          {/* Mobile View: Media appears AFTER title and content */}
          {hasMedia && (
            <div className="sm:hidden w-full flex justify-center">
              {hasYoutubeLink ? (
                <div
                  className="relative rounded-lg overflow-hidden cursor-pointer w-full"
                  onClick={openYoutubeModal}
                  style={{ height: "180px" }}
                >
                  <img
                    src={getYoutubeThumbnail(post.youtubeLink || "")}
                    alt="YouTube thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-opacity-20 flex items-center justify-center">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-white border-b-4 border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
              ) : post.image ? (
                <div className="w-full" style={{ maxHeight: "300px" }}>
                  <img
                    src={post.image}
                    alt="Post image"
                    className="rounded-lg w-full h-full object-cover"
                  />
                </div>
              ) : null}
            </div>
          )}

          {/* Desktop Layout */}
          <div
            className="hidden sm:flex sm:flex-row gap-4"
            style={{ minHeight: "80px", maxHeight: "120px" }}
          >
            {/* Post Title & Content with consistent truncation */}
            <div
              className={`flex-1 ${
                hasMedia ? "sm:max-w-[68%]" : "w-full"
              } overflow-hidden`}
            >
              {/* Title with consistent max width and truncation */}
              <h3
                className="font-bold mb-2 text-ellipsis overflow-hidden"
                style={{
                  fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                  fontSize: "18px",
                  lineHeight: "1.4",
                  display: "-webkit-box",
                  WebkitLineClamp: "1",
                  WebkitBoxOrient: "vertical",
                  textOverflow: "ellipsis",
                }}
              >
                {post.title}
              </h3>

              {/* Content with consistent height and truncation */}
              <p
                className="text-gray-700 overflow-hidden"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: "2",
                  WebkitBoxOrient: "vertical",
                  textOverflow: "ellipsis",
                  maxHeight: "48px",
                }}
              >
                {post.content}
              </p>
            </div>

            {/* Media (Image or YouTube) with consistent positioning - Desktop */}
            {hasMedia && (
              <div className="flex-shrink-0 w-32 h-28 overflow-hidden">
                {hasYoutubeLink ? (
                  <div
                    className="relative rounded-lg overflow-hidden cursor-pointer w-full h-full"
                    onClick={openYoutubeModal}
                  >
                    <img
                      src={getYoutubeThumbnail(post.youtubeLink || "")}
                      alt="YouTube thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0  bg-opacity-20 flex items-center justify-center">
                      <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-white border-b-4 border-b-transparent ml-1"></div>
                      </div>
                    </div>
                  </div>
                ) : post.image ? (
                  <img
                    src={post.image}
                    alt="Post image"
                    className="rounded-lg w-full h-full object-cover"
                  />
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* YouTube Modal - Fixed z-index and improved structure */}
        {showYoutubeModal && hasYoutubeLink && (
          <div
            className="fixed inset-0 bg-[rgba(144,144,144,0.6)] bg-opacity-75 flex items-center justify-center z-50"
            onClick={closeYoutubeModal}
            style={{ zIndex: 9999 }}
          >
            <div
              className="relative w-full max-w-3xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute -top-10 right-0 text-black hover:text-gray-300"
                onClick={closeYoutubeModal}
              >
                <X size={24} />
              </button>
              <div
                className="relative w-full"
                style={{ paddingBottom: "56.25%" }}
              >
                <iframe
                  src={`https://www.youtube.com/embed/${getYoutubeId(
                    post.youtubeLink || ""
                  )}?autoplay=1`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div
            className="fixed inset-0 bg-[rgba(144,144,144,0.6)] bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowDeleteModal(false)}
          >
            <div
              className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Delete Post</h3>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this post? This action cannot be
                undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                  onClick={handleDeletePost}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <span className="mr-2">Deleting</span>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Post Footer */}
        <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <button
              className={`flex items-center ${
                isLiked ? "text-blue-600" : "text-gray-500"
              } hover:text-blue-600 transition-colors duration-200`}
              onClick={handleLike}
              disabled={!user || isLiking}
            >
              <ThumbsUp
                size={16}
                className={`mr-1 ${isLiking ? "animate-pulse" : ""}`}
                fill={isLiked ? "currentColor" : "none"}
              />
              <span>{currentLikeCount}</span>
            </button>
            <div className="flex items-center text-gray-500">
              <MessageSquare size={16} className="mr-1" />
              <span>{post.totalComments || 0}</span>
            </div>

            {/* Last Comment Time Display - Added to the footer */}
            {lastCommentTimeFormatted && (
              <div className="flex items-center text-blue-950 ">
                <Clock size={16} className="mr-1" />
                <span className="text-xs text-blue-900 font-bold">
                  {lastCommentTimeFormatted}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
