// src/types/post.ts

export interface Author {
    id: number;
    name: string;
    avatar: string;
  }
  
  export interface Reply {
    id: number;
    author: Author;
    content: string;
    timePosted: string;
    likes: number;
  }
  
  export interface Comment {
    id: number;
    author: Author;
    content: string;
    timePosted: string;
    likes: number;
    replies: Reply[];
  }
  
  export interface Post {
    id: number;
    author: Author;
    content: string;
    timePosted: string;
    category: string;
    isPinned: boolean;
    likes: number;
    comments: number;
    lastCommentTime: string;
  }
  
  export interface Notification {
    id: number;
    type: 'like' | 'comment' | 'mention';
    user: string;
    content: string;
    time: string;
    read: boolean;
  }