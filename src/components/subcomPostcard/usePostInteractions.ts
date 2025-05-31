
import { useState, useCallback } from "react";
import { likePost, deletePost } from "../../services/postService";
import { useAuth } from "../../context/AuthContext";
import { usePostStateDispatch } from "../../types/PostStateContext";

export const usePostInteractions = (post: any, onRefresh?: () => void, onDelete?: (postId: string) => void) => {
  const { user } = useAuth();
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toggleLike } = usePostStateDispatch();

  const handleLike = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || isLiking) return;

    try {
      setIsLiking(true);
      toggleLike(post._id, post.likes, user._id);
      await likePost(post._id);
      onRefresh?.();
    } catch (error) {
      toggleLike(post._id, post.likes, user._id);
    } finally {
      setIsLiking(false);
    }
  }, [user, isLiking, post._id, post.likes, toggleLike, onRefresh]);

  const handleDelete = useCallback(async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      await deletePost(post._id);
      onDelete?.(post._id);
      onRefresh?.();
    } catch (error) {
    } finally {
      setIsDeleting(false);
    }
  }, [isDeleting, post._id, onDelete, onRefresh]);

  return {
    handleLike,
    handleDelete,
    isLiking,
    isDeleting,
  };
};