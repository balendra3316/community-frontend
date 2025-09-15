




"use client";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import { Post as PostType } from "../../../services/postService";
import Post from "../../../components/Post";
import { PostSkeleton } from "../../community/_components/PostSkeleton";

interface MyPostsTabProps {
  posts: PostType[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  loadingMore: boolean;
  onLoadMore: () => void;
  onPostClick: (post: PostType) => void;
  onEditPost: (post: PostType) => void;
  onDeletePost: (postId: string) => Promise<void>; // MODIFIED: Type reflects it's an async action
}

const MyPostsTab = ({
  posts,
  loading,
  error,
  page,
  totalPages,
  loadingMore,
  onLoadMore,
  onPostClick,
  onEditPost,
  onDeletePost,
}: MyPostsTabProps) => {

  if (loading) {
    return (
      <Box>
        <PostSkeleton />
        <PostSkeleton />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" p={4}>
        {error}
      </Typography>
    );
  }

  if (posts.length === 0) {
    return (
      <Typography color="text.secondary" align="center" p={4}>
        You haven't created any posts yet.
      </Typography>
    );
  }

  return (
    <Box>
      <div className="space-y-6">
        {posts.map((post) => (
          // The Post component itself will handle calling the delete/edit handlers.
          // The wrapper div is for the detail view click.
          <div key={post._id} onClick={() => onPostClick(post)} className="cursor-pointer">
            <Post
              post={post}
              onDelete={onDeletePost} // MODIFIED: Pass the handler from the parent page
              onEdit={onEditPost}
            />
          </div>
        ))}
      </div>
      {page < totalPages && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Button
            onClick={onLoadMore}
            disabled={loadingMore}
            variant="outlined"
          >
            {loadingMore ? <CircularProgress size={24} /> : "Load More"}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MyPostsTab;