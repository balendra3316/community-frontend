// src/services/postService.ts

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Types
export interface PollOption {
  text: string;
  votes: string[];
}

export interface Poll {
  options: PollOption[];
  voters: string[];
}

export interface Post {
  _id: string;
  author: {
    _id: string;
    name: string;
    avatar: string;
    badges?: string[];
  };
  title: string;
  content: string;
  image?: string;
  youtubeLink?: string;
  totalComments?: number;
  tags: string[];
  likes: string[];
  poll?: Poll;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostsResponse {
  posts: Post[];
  totalPages: number;
  currentPage: number;
}

// Post APIs
export const fetchPosts = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get<PostsResponse>(`${API_URL}/posts?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const fetchPostById = async (id: string) => {
  try {
    const response = await axios.get<{ post: Post; comments: any[] }>(`${API_URL}/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
};

export const createPost = async (formData: FormData) => {
  try {
    const response = await axios.post<Post>(`${API_URL}/posts`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const likePost = async (postId: string) => {
  try {
    const response = await axios.put<{ liked: boolean; likeCount: number }>(
      `${API_URL}/posts/${postId}/like`, 
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};

export const voteOnPoll = async (postId: string, optionIndex: number) => {
  try {
    const response = await axios.put<{ voted: boolean; results: any[] }>(
      `${API_URL}/posts/${postId}/vote`,
      { optionIndex },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error('Error voting on poll:', error);
    throw error;
  }
};

export const deletePost = async (postId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/posts/${postId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};




export const fetchUserPosts = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get<PostsResponse>(`${API_URL}/posts/me?page=${page}&limit=${limit}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user posts:', error);
    throw error;
  }
};










// import axios from 'axios';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// export interface Post {
//   _id: string;
//   author: {
//     _id: string;
//     name: string;
//     avatar: string;
//     badges?: string[];
//   };
//   title: string;
//   content: string;
//   image?: string;
//   youtubeLink?: string;
//   totalComments?: number;
//   tags: string[];
//   likes: string[];
//   poll?: Poll;
//   isPinned: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// // export interface PostsResponse {
// //   posts: Post[];
// //   totalPages: number;
// //   currentPage: number;
// // }

// export interface PostsResponse {
//   posts: Post[];
//   currentPage: number;
//   totalPages: number;
//   totalPosts: number;
// }

// // Fetch all posts with pagination
// export const fetchPosts = async (page = 1): Promise<PostsResponse> => {
//   try {
//     const response = await axios.get(`${API_URL}/posts?page=${page}`, {
//       withCredentials: true,
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching posts:', error);
//     throw error;
//   }
// };

// // Fetch posts by the logged-in user with pagination
// export const fetchUserPosts = async (page = 1): Promise<PostsResponse> => {
//   try {
//     const response = await axios.get(`${API_URL}/posts/me?page=${page}`, {
//       withCredentials: true,
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching user posts:', error);
//     throw error;
//   }
// };

// // Create a new post
// export const createPost = async (postData: FormData): Promise<Post> => {
//   try {
//     const response = await axios.post(`${API_URL}/posts`, postData, {
//       withCredentials: true,
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error creating post:', error);
//     throw error;
//   }
// };

// // Like or unlike a post
// export const likePost= async (postId: string): Promise<{ liked: boolean }> => {
//   try {
//     const response = await axios.post(
//       `${API_URL}/posts/${postId}/like`,
//       {},
//       { withCredentials: true }
//     );
//     return response.data;
//   } catch (error) {
//     console.error('Error toggling like:', error);
//     throw error;
//   }
// };

// // Add a comment to a post
// export const addComment = async (postId: string, content: string): Promise<Post> => {
//   try {
//     const response = await axios.post(
//       `${API_URL}/posts/${postId}/comments`,
//       { content },
//       { withCredentials: true }
//     );
//     return response.data;
//   } catch (error) {
//     console.error('Error adding comment:', error);
//     throw error;
//   }
// };

// // Delete a post
// export const deletePost = async (postId: string): Promise<void> => {
//   try {
//     await axios.delete(`${API_URL}/posts/${postId}`, {
//       withCredentials: true,
//     });
//   } catch (error) {
//     console.error('Error deleting post:', error);
//     throw error;
//   }
// };

// // Update a post
// export const updatePost = async (postId: string, postData: FormData): Promise<Post> => {
//   try {
//     const response = await axios.put(`${API_URL}/posts/${postId}`, postData, {
//       withCredentials: true,
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error updating post:', error);
//     throw error;
//   }
// };