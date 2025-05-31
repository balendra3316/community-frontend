import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL

export interface Comment {
  _id: string;
  post: string;
  author: {
    _id: string;
    name: string;
    avatar: string;
    badges?: string[];
  };
  content: string;
  image?: string;
  youtubeLink?: string;
  likes: string[];
  parent?: string;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
}

export interface CommentsResponse {
  comments: Comment[];
  page: number;
  totalPages: number;
  totalCount: number;
}


export const fetchCommentsByPost = async (postId: string, page = 1) => {
  try {
    const response = await axios.get<CommentsResponse>(`${API_URL}/comments/${postId}?page=${page}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const createComment = async (postId: string, formData: FormData) => {
  try {
    const response = await axios.post<Comment>(
      `${API_URL}/comments/${postId}`,
      formData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const likeComment = async (commentId: string) => {
  try {
    const response = await axios.put<{ liked: boolean; likeCount: number }>(
      `${API_URL}/comments/${commentId}/like`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const deleteComment = async (commentId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/comments/${commentId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};