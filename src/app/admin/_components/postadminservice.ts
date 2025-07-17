// Adjust the import path based on where your types are defined


interface Author {
    _id: string;
    name: string;
    avatar?: string;
}
 interface Post {
    _id: string;
    author: Author;
    title: string;
    content: string;
    tags: string[];
    isPinned: boolean;
    createdAt: string;
}

interface ApiResponse {
    posts: Post[];
    totalPages: number;
    currentPage: number;
}


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const postService = {
  async getAllPosts(page: number = 1, limit: number = 10): Promise<ApiResponse> {
    const response = await fetch(`${API_URL}/posts?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include credentials for authentication
    });

    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }

    return response.json();
  },

  async deletePost(postId: string): Promise<void> {
    const response = await fetch(`${API_URL}/admin/posts/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include credentials for authentication
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete post");
    }
  },

  async togglePinPost(postId: string): Promise<Post> {
    const response = await fetch(`${API_URL}/admin/posts/${postId}/toggle-pin`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include credentials for authentication
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to toggle pin status");
    }

    const { post } = await response.json();
    return post;
  },
};