
// import React, { memo, useCallback, useMemo } from "react";
// import { Loader2 } from "lucide-react";
// import { PostSkeleton } from "./PostSkeleton";
// import { Post as PostType } from "../../../services/postService";


// const Post = React.lazy(() => import("../../../components/Post"));

// interface OptimizedPostsListProps {
//   posts: PostType[];
//   loading: boolean;
//   error: string | null;
//   page: number;
//   totalPages: number;
//   loadingMore: boolean;
//   onPostClick: (post: PostType) => void;
//   onPostUpdate: (post: PostType) => void;
//   onPostDelete: (postId: string) => void;
//   onLoadMore: () => void;
//   onRetry: () => void;
//   onCreatePost: () => void;
// }


// const PostItem = memo(({ 
//   post, 
//   onPostClick, 
//   onPostUpdate, 
//   onPostDelete 
// }: {
//   post: PostType;
//   onPostClick: (post: PostType) => void;
//   onPostUpdate: (post: PostType) => void;
//   onPostDelete: (postId: string) => void;
// }) => {
//   const handleClick = useCallback(() => {
//     onPostClick(post);
//   }, [post, onPostClick]);

//   const handleRefresh = useCallback(() => {
//     onPostUpdate(post);
//   }, [post, onPostUpdate]);

//   return (
//     <div onClick={handleClick} className="cursor-pointer">
//       <React.Suspense fallback={<PostSkeleton />}>
//         <Post
//           post={post}
//           onRefresh={handleRefresh}
//           onDelete={onPostDelete}
//         />
//       </React.Suspense>
//     </div>
//   );
// });

// PostItem.displayName = 'PostItem';


// const LoadingSkeletons = memo(() => (
//   <>
//     <PostSkeleton />
//     <PostSkeleton />
//     <PostSkeleton />
//   </>
// ));

// LoadingSkeletons.displayName = 'LoadingSkeletons';


// const ErrorState = memo(({ error, onRetry }: { error: string; onRetry: () => void }) => (
//   <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
//     {error}
//     <button className="ml-4 underline" onClick={onRetry}>
//       Try again
//     </button>
//   </div>
// ));

// ErrorState.displayName = 'ErrorState';


// const EmptyState = memo(({ onCreatePost }: { onCreatePost: () => void }) => (
//   <div className="bg-white rounded-lg shadow p-6 text-center">
//     <h3 className="text-lg font-medium text-gray-700 mb-2">
//       No posts found
//     </h3>
//     <p className="text-gray-500">
//       Be the first to share something with the community!
//     </p>
//     <button
//       className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//       onClick={onCreatePost}
//     >
//       Create Post
//     </button>
//   </div>
// ));

// EmptyState.displayName = 'EmptyState';


// const LoadMoreButton = memo(({ 
//   onLoadMore, 
//   loadingMore 
// }: { 
//   onLoadMore: () => void; 
//   loadingMore: boolean; 
// }) => (
//   <div className="flex justify-center mt-6">
//     <button
//       className="bg-white border border-gray-300 rounded-lg px-6 py-3 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-50"
//       onClick={onLoadMore}
//       disabled={loadingMore}
//     >
//       {loadingMore ? (
//         <Loader2 size={20} className="animate-spin mx-auto" />
//       ) : (
//         "Load More Posts"
//       )}
//     </button>
//   </div>
// ));

// LoadMoreButton.displayName = 'LoadMoreButton';

// export default memo(function OptimizedPostsList({
//   posts,
//   loading,
//   error,
//   page,
//   totalPages,
//   loadingMore,
//   onPostClick,
//   onPostUpdate,
//   onPostDelete,
//   onLoadMore,
//   onRetry,
//   onCreatePost,
// }: OptimizedPostsListProps) {

//   const postsList = useMemo(() => 
//     posts.map((post) => (
//       <PostItem
//         key={post._id}
//         post={post}
//         onPostClick={onPostClick}
//         onPostUpdate={onPostUpdate}
//         onPostDelete={onPostDelete}
//       />
//     )), 
//     [posts, onPostClick, onPostUpdate, onPostDelete]
//   );


//   if (loading) {
//     return <LoadingSkeletons />;
//   }


//   if (error) {
//     return <ErrorState error={error} onRetry={onRetry} />;
//   }


//   if (posts.length === 0) {
//     return <EmptyState onCreatePost={onCreatePost} />;
//   }


//   return (
//     <div className="space-y-6">
//       {postsList}
      
//       {/* Load More Button */}
//       {page < totalPages && (
//         <LoadMoreButton onLoadMore={onLoadMore} loadingMore={loadingMore} />
//       )}
//     </div>
//   );
// });


"use client";
import React, { memo, useCallback, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { PostSkeleton } from "./PostSkeleton";
import { Post as PostType } from "../../../services/postService";

const Post = React.lazy(() => import("../../../components/Post"));

// MODIFIED: Removed onPostUpdate from props
interface PostsListProps {
  posts: PostType[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  loadingMore: boolean;
  onPostClick: (post: PostType) => void;
  onPostDelete: (postId: string) => void;
  onLoadMore: () => void;
  onRetry: () => void;
  onCreatePost: () => void;
  onEdit: (post: PostType) => void;
}

// MODIFIED: Removed onPostUpdate from PostItem props
const PostItem = memo(({ 
  post, 
  onPostClick, 
  onPostDelete,
  onEdit
}: {
  post: PostType;
  onPostClick: (post: PostType) => void;
  onPostDelete: (postId: string) => void;
  onEdit: (post: PostType) => void;
}) => {
  const handleClick = useCallback(() => {
    onPostClick(post);
  }, [post, onPostClick]);

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <React.Suspense fallback={<PostSkeleton />}>
        <Post
          post={post}
          onDelete={onPostDelete}
          onEdit={onEdit}
        />
      </React.Suspense>
    </div>
  );
});

PostItem.displayName = 'PostItem';

const LoadingSkeletons = memo(() => (
  <>
    <PostSkeleton />
    <PostSkeleton />
    <PostSkeleton />
  </>
));
LoadingSkeletons.displayName = 'LoadingSkeletons';

const ErrorState = memo(({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
    {error}
    <button className="ml-4 underline" onClick={onRetry}>
      Try again
    </button>
  </div>
));
ErrorState.displayName = 'ErrorState';

const EmptyState = memo(({ onCreatePost }: { onCreatePost: () => void }) => (
  <div className="bg-white rounded-lg shadow p-6 text-center">
    <h3 className="text-lg font-medium text-gray-700 mb-2">
      No posts found
    </h3>
    <p className="text-gray-500">
      Be the first to share something with the community!
    </p>
    <button
      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      onClick={onCreatePost}
    >
      Create Post
    </button>
  </div>
));
EmptyState.displayName = 'EmptyState';

const LoadMoreButton = memo(({ onLoadMore, loadingMore }: { onLoadMore: () => void; loadingMore: boolean; }) => (
  <div className="flex justify-center mt-6">
    <button
      className="bg-white border border-gray-300 rounded-lg px-6 py-3 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-50"
      onClick={onLoadMore}
      disabled={loadingMore}
    >
      {loadingMore ? <Loader2 size={20} className="animate-spin mx-auto" /> : "Load More Posts"}
    </button>
  </div>
));
LoadMoreButton.displayName = 'LoadMoreButton';

// MODIFIED: Removed onPostUpdate from destructuring and from useMemo dependencies
export default memo(function PostsList({
  posts,
  loading,
  error,
  page,
  totalPages,
  loadingMore,
  onPostClick,
  onPostDelete,
  onLoadMore,
  onRetry,
  onCreatePost,
  onEdit,
}: PostsListProps) {

  const postsList = useMemo(() => 
    posts.map((post) => (
      <PostItem
        key={post._id}
        post={post}
        onPostClick={onPostClick}
        onPostDelete={onPostDelete}
        onEdit={onEdit}
      />
    )), 
    [posts, onPostClick, onPostDelete, onEdit]
  );

  if (loading) {
    return <LoadingSkeletons />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  if (posts.length === 0) {
    return <EmptyState onCreatePost={onCreatePost} />;
  }

  return (
    <div className="space-y-6 mt-6">
      {postsList}
      
      {page < totalPages && (
        <LoadMoreButton onLoadMore={onLoadMore} loadingMore={loadingMore} />
      )}
    </div>
  );
});