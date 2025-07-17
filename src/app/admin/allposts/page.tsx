"use client";

import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { MoreVertical, Trash2, Pin, PinOff } from 'lucide-react';
import { postService } from '../_components/postadminservice'; 

interface Author {
  _id: string;
  name?: string; // Make name optional to handle edge cases
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

const FallbackAvatar = ({ name }: { name?: string }) => (
  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
    {name && name.length > 0 ? name.charAt(0).toUpperCase() : '?'}
  </div>
);

export default function AllPostsAdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const fetchPosts = async (currentPage: number) => {
    if (currentPage === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      const data = await postService.getAllPosts(currentPage, 10);
      const sortedPosts = data.posts.sort((a, b) => Number(b.isPinned) - Number(a.isPinned));
      setPosts(prev => (currentPage === 1 ? sortedPosts : [...prev, ...sortedPosts]));
      setTotalPages(data.totalPages);
    } catch (err: any) {
      setError('Failed to fetch posts. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLoadMore = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await postService.deletePost(postId);
      setPosts(prevPosts => prevPosts.filter(p => p._id !== postId));
      setOpenMenuId(null);
    } catch (err: any) {
      alert(`Failed to delete post: ${err.message || 'Unknown error'}`);
      console.error(err);
    }
  };

  const handleTogglePin = async (postId: string) => {
    try {
      const updatedPost = await postService.togglePinPost(postId);
      // Ensure the updated post has a valid author object
      if (!updatedPost.author || !updatedPost.author.name) {
        console.warn('Invalid author data in togglePin response:', updatedPost);
        updatedPost.author = updatedPost.author || { _id: '', name: 'Unknown' };
      }
      const updatedPosts = posts.map(p => (p._id === postId ? updatedPost : p));
      updatedPosts.sort((a, b) => Number(b.isPinned) - Number(a.isPinned));
      setPosts(updatedPosts);
      setOpenMenuId(null);
    } catch (err: any) {
      alert(`Failed to update pin status: ${err.message || 'Unknown error'}`);
      console.error(err);
    }
  };

  if (loading) return <div className="text-center p-10">Loading posts...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">All Community Posts</h1>
      <div className="space-y-6">
        {posts.map(post => (
          <div
            key={post._id}
            className={`bg-white rounded-lg shadow-md transition-all duration-300 ${
              post.isPinned ? 'border-l-4 border-indigo-500 shadow-lg' : 'border-l-4 border-transparent'
            }`}
          >
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {post.author.avatar ? (
                    <img
                      src={post.author.avatar}
                      alt={post.author.name || 'Unknown'}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <FallbackAvatar name={post.author.name} />
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{post.author.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(post.createdAt), 'MMM d, yyyy')}
                      {post.isPinned && <span className="ml-2 font-semibold text-indigo-600">· Pinned</span>}
                    </p>
                  </div>
                </div>
                <div className="relative" ref={openMenuId === post._id ? menuRef : null}>
                  <button
                    onClick={() => setOpenMenuId(openMenuId === post._id ? null : post._id)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <MoreVertical size={20} />
                  </button>
                  {openMenuId === post._id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                      <ul className="py-1">
                        <li>
                          <button
                            onClick={() => handleTogglePin(post._id)}
                            className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {post.isPinned ? <PinOff size={16} className="mr-2" /> : <Pin size={16} className="mr-2" />}
                            {post.isPinned ? 'Unpin Post' : 'Pin Post'}
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleDeletePost(post._id)}
                            className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={16} className="mr-2" />
                            Delete Post
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <h2 className="text-xl font-bold text-gray-800">{post.title}</h2>
                <p className="mt-2 text-gray-600 line-clamp-3">{post.content}</p>
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {page < totalPages && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="bg-indigo-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
          >
            {loadingMore ? 'Loading...' : 'Load More Posts'}
          </button>
        </div>
      )}
    </div>
  );
}