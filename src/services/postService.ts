

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL 


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
  lastComment: string
  createdAt: string;
  updatedAt: string;
}

export interface PostsResponse {
  posts: Post[];
  totalPages: number;
  currentPage: number;
}


export const fetchPosts = async (page = 1, limit = 10, filter = 'default') => {
  try {
    const response = await axios.get<PostsResponse>(
      `${API_URL}/posts?page=${page}&limit=${limit}&filter=${filter}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchPostById = async (id: string) => {
  try {
    const response = await axios.get<{ post: Post; comments: any[] }>(`${API_URL}/posts/${id}`);
    return response.data;
  } catch (error) {
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
    throw error;
  }
};

export const deletePost = async (postId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/posts/${postId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
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
    throw error;
  }
};


















































































































































