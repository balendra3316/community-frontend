


// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "../../../context/AuthContext"; 
// import { Post, fetchPostById } from "../../../services/postService";
// import { PostStateProvider } from "../../../types/PostStateContext";
// import PostDetailView from "../../../components/PostDetailView";
// import PublicPostView from "../../../components/PublicPostView"; 
// import NavBar from "../../../components/Navbar";

// export default function SharedPostPage({ params }: { params: { postId: string } }) {
//   const router = useRouter();
//   const { user, loading: authLoading } = useAuth(); // Get user and auth loading state

//   const [post, setPost] = useState<Post | null>(null);
//   const [loadingPost, setLoadingPost] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!params.postId) return;

//     const loadPost = async () => {
//       try {
//         setLoadingPost(true);
//         const postData = await fetchPostById(params.postId);
//         setPost(postData);
//         setError(null);
//       } catch (err) {
      
//         setError("This post could not be found or is no longer available.");
//       } finally {
//         setLoadingPost(false);
//       }
//     };

//     loadPost();
//   }, [params.postId]);

//   const handleClose = () => {
//     router.push("/community");
//   };

//   // Show a single loading state while we check for auth and fetch the post
//   if (authLoading || loadingPost) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
//       </div>
//     );
//   }

//   if (error || !post) {
//     return (
//       <main className="min-h-screen bg-gray-100">
//         <NavBar />
//         <div className="pt-[104px] flex items-center justify-center">
//             <div className="text-center p-8">
//                 <h2 className="text-2xl font-bold text-red-600">Post Not Found</h2>
//                 <p className="text-gray-600 mt-2">{error || "The post you are looking for does not exist."}</p>
//             </div>
//         </div>
//       </main>
//     );
//   }

//   // This is the core logic:
//   // - If a user is logged in, show the full interactive PostDetailView.
//   // - If no user is logged in, show the read-only PublicPostView.
//   return (
//     <PostStateProvider>
//       <main className="min-h-screen bg-gray-100">
//         <NavBar />
//         <div className="pt-[104px]">
//           {user ? (
//             <PostDetailView 
//               post={post} 
//               isOpen={true} 
//               onClose={handleClose} 
//             />
//           ) : (
//             <PublicPostView post={post} />
//           )}
//         </div>
//       </main>
//     </PostStateProvider>
//   );
// }





// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "../../../context/AuthContext"; 
// import { Post, fetchPostById } from "../../../services/postService";
// import { PostStateProvider } from "../../../types/PostStateContext";
// import PostDetailView from "../../../components/PostDetailView";
// import PublicPostView from "../../../components/PublicPostView"; 
// import NavBar from "../../../components/Navbar";

// /**
//  * Defines the expected props for this page component.
//  * Next.js passes a `params` object containing the dynamic route segments.
//  * This interface explicitly types `params` to have a `postId` of type string.
//  */
// interface SharedPostPageProps {
//   params: {
//     postId: string;
//   };
// }

// // The component now uses the SharedPostPageProps interface for its props.
// // This resolves the TypeScript build error by providing a clear type definition.
// export default function SharedPostPage({ params }: SharedPostPageProps) {
//   const router = useRouter();
//   const { user, loading: authLoading } = useAuth(); // Get user and auth loading state

//   const [post, setPost] = useState<Post | null>(null);
//   const [loadingPost, setLoadingPost] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     // Ensure params.postId exists before fetching
//     if (!params.postId) return;

//     const loadPost = async () => {
//       try {
//         setLoadingPost(true);
//         const postData = await fetchPostById(params.postId);
//         setPost(postData);
//         setError(null);
//       } catch (err) {
//         // Provide a user-friendly error message
//         setError("This post could not be found or is no longer available.");
//       } finally {
//         setLoadingPost(false);
//       }
//     };

//     loadPost();
//   }, [params.postId]);

//   // Function to navigate the user back to the main community page
//   const handleClose = () => {
//     router.push("/community");
//   };

//   // Display a single loading indicator while authentication is checked and the post is fetched.
//   if (authLoading || loadingPost) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
//       </div>
//     );
//   }

//   // Display an error message if the post could not be loaded or doesn't exist.
//   if (error || !post) {
//     return (
//       <main className="min-h-screen bg-gray-100">
//         <NavBar />
//         <div className="pt-[104px] flex items-center justify-center">
//             <div className="text-center p-8">
//                 <h2 className="text-2xl font-bold text-red-600">Post Not Found</h2>
//                 <p className="text-gray-600 mt-2">{error || "The post you are looking for does not exist."}</p>
//             </div>
//         </div>
//       </main>
//     );
//   }

//   // This is the core logic:
//   // - If a user is logged in, show the full interactive PostDetailView.
//   // - If no user is logged in, show the read-only PublicPostView.
//   return (
//     <PostStateProvider>
//       <main className="min-h-screen bg-gray-100">
//         <NavBar />
//         <div className="pt-[104px]">
//           {user ? (
//             <PostDetailView 
//               post={post} 
//               isOpen={true} 
//               onClose={handleClose} 
//             />
//           ) : (
//             <PublicPostView post={post} />
//           )}
//         </div>
//       </main>
//     </PostStateProvider>
//   );
// }






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