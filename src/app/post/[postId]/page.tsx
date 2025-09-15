


"use client";

// Import 'use' from React to resolve the params promise
import { useState, useEffect, use } from "react"; 
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext"; 
import { Post, fetchPostById } from "../../../services/postService";
import { PostStateProvider } from "../../../types/PostStateContext";
import PostDetailView from "../../../components/PostDetailView";
import PublicPostView from "../../../components/PublicPostView"; 
import NavBar from "../../../components/Navbar";

// Define the props interface where `params` is now a Promise
interface PostPageProps {
  params: Promise<{
    postId: string;
  }>;
}

export default function SharedPostPage({ params }: PostPageProps) {
  // Use the `use` hook to resolve the promise. This is the correct way for Client Components.
  const resolvedParams = use(params);
  
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Use the resolved postId
    const postId = resolvedParams.postId;
    if (!postId) return;

    const loadPost = async () => {
      try {
        setLoadingPost(true);
        const postData = await fetchPostById(postId);
        setPost(postData);
        setError(null);
      } catch (err) {
        setError("This post could not be found or is no longer available.");
      } finally {
        setLoadingPost(false);
      }
    };

    loadPost();
  }, [resolvedParams.postId]); // The dependency is the resolved value

  const handleClose = () => {
    router.push("/community");
  };

  if (authLoading || loadingPost) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <main className="min-h-screen bg-gray-100">
        <NavBar />
        <div className="pt-[104px] flex items-center justify-center">
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-red-600">Post Not Found</h2>
                <p className="text-gray-600 mt-2">{error || "The post you are looking for does not exist."}</p>
            </div>
        </div>
      </main>
    );
  }

  return (
    <PostStateProvider>
      <main className="min-h-screen bg-gray-100">
        <NavBar />
        <div className="pt-[104px]">
          {user ? (
            <PostDetailView 
              post={post} 
              isOpen={true} 
              onClose={handleClose} 
            />
          ) : (
            <PublicPostView post={post} />
          )}
        </div>
      </main>
    </PostStateProvider>
  );
}