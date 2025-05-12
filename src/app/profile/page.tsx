"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Camera } from 'lucide-react';
import NavBar from '../../components/Navbar';
import Post from '../../components/Post';
import PostDetailView from '../../components/PostDetailView';
import { useAuth } from '../../context/AuthContext';
import { fetchUserPosts, Post as PostType } from '../../services/postService';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [nameInput, setNameInput] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  // My Posts state
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
  const [showPostDetail, setShowPostDetail] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // Set initial name when user data loads
  useEffect(() => {
    if (user) {
      setNameInput(user.name);
    }
  }, [user]);

  // Load user posts when activeTab is 'my-posts'
  useEffect(() => {
    if (activeTab === 'my-posts') {
      loadUserPosts();
    }
  }, [activeTab]);

  const loadUserPosts = async (pageNum = 1, replace = true) => {
    if (!user) return;
    
    try {
      setLoading(pageNum === 1);
      setLoadingMore(pageNum > 1);
      
      const response = await fetchUserPosts(pageNum);
      
      if (replace) {
        setPosts(response.posts);
      } else {
        setPosts(prev => [...prev, ...response.posts]);
      }
      
      setTotalPages(response.totalPages);
      setPage(response.currentPage);
      setError(null);
    } catch (err) {
      setError('Failed to load your posts. Please try again later.');
      console.error('Error loading user posts:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };
  
  const handleLoadMore = () => {
    if (page < totalPages) {
      loadUserPosts(page + 1, false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setUpdating(true);
      setUpdateError(null);
      
      const result = await updateProfile({
        name: nameInput !== user.name ? nameInput : undefined,
        avatar: avatarFile,
      });
      
      if (result) {
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
      }
    } catch (err) {
      setUpdateError('Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handlePostClick = (post: PostType) => {
    setSelectedPost(post);
    setShowPostDetail(true);
  };

  const handlePostDetailClose = () => {
    setShowPostDetail(false);
    // Reload posts to reflect any changes
    loadUserPosts();
  };

  // Function to go back to community page
  const goToCommunity = () => {
    router.push('/community');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-gray-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Please login to view your profile</h1>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={goToCommunity}
        >
          Go to Community
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-[104px]">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back button */}
        <button 
          onClick={goToCommunity}
          className="flex items-center text-gray-700 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Community
        </button>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar - Mobile: Horizontal tabs, Desktop: Vertical sidebar */}
          <div className="md:w-64 shrink-0">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Mobile Tabs */}
              <div className="md:hidden flex overflow-x-auto">
                <button 
                  className={`flex-1 py-4 px-4 font-medium ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'}`}
                  onClick={() => setActiveTab('profile')}
                >
                  Profile
                </button>
                <button 
                  className={`flex-1 py-4 px-4 font-medium ${activeTab === 'my-posts' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'}`}
                  onClick={() => setActiveTab('my-posts')}
                >
                  My Posts
                </button>
                <button 
                  className={`flex-1 py-4 px-4 font-medium ${activeTab === 'my-courses' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'}`}
                  onClick={() => setActiveTab('my-courses')}
                >
                  My Courses
                </button>
              </div>
              
              {/* Desktop Sidebar */}
              <div className="hidden md:block">
                <button 
                  className={`w-full text-left py-4 px-6 font-medium ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('profile')}
                >
                  Profile
                </button>
                <button 
                  className={`w-full text-left py-4 px-6 font-medium ${activeTab === 'my-posts' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('my-posts')}
                >
                  My Posts
                </button>
                <button 
                  className={`w-full text-left py-4 px-6 font-medium ${activeTab === 'my-courses' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('my-courses')}
                >
                  My Courses
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
                
                <form onSubmit={handleProfileUpdate}>
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center mb-8">
                    <div className="relative">
                      <div className="h-32 w-32 rounded-full bg-gray-200 overflow-hidden">
                        <img
                          src={avatarPreview || user.avatar || "/api/placeholder/128/128"}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <label 
                        htmlFor="avatar-upload" 
                        className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700"
                      >
                        <Camera size={20} />
                        <span className="sr-only">Change profile photo</span>
                      </label>
                      <input 
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </div>
                    <button 
                      type="button"
                      className="mt-3 text-blue-600 font-medium"
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                    >
                      Change profile photo
                    </button>
                  </div>
                  
                  {/* Name Fields */}
                  <div className="mb-6">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="Your name"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      you must use your real name.
                    </p>
                  </div>
                  
                  {/* Bio field could be added here */}
                  
                  {/* Submit Button */}
                  <div className="flex items-center mt-8">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      disabled={updating}
                    >
                      {updating ? (
                        <Loader2 size={20} className="animate-spin mx-auto" />
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                    
                    {updateSuccess && (
                      <span className="ml-4 text-green-600">Profile updated successfully!</span>
                    )}
                    
                    {updateError && (
                      <span className="ml-4 text-red-600">{updateError}</span>
                    )}
                  </div>
                </form>
              </div>
            )}
            
            {/* My Posts Tab */}
            {activeTab === 'my-posts' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">My Posts</h2>
                
                {/* Loading State */}
                {loading && (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 size={40} className="animate-spin text-gray-500" />
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
                    {error}
                    <button 
                      className="ml-4 underline"
                      onClick={() => loadUserPosts(1, true)}
                    >
                      Try again
                    </button>
                  </div>
                )}

                {/* Empty State */}
                {!loading && !error && posts.length === 0 && (
                  <div className="bg-white rounded-lg shadow p-6 text-center">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No posts yet</h3>
                    <p className="text-gray-500">You haven't created any posts yet.</p>
                    <button 
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      onClick={() => router.push('/community')}
                    >
                      Go to Community to Create Post
                    </button>
                  </div>
                )}

                {/* Posts List */}
                {!loading && !error && posts.length > 0 && (
                  <div className="space-y-6">
                    {posts.map((post) => (
                      <div key={post._id} onClick={() => handlePostClick(post)} className="cursor-pointer">
                        <Post post={post} onRefresh={() => loadUserPosts(1, true)} />
                      </div>
                    ))}
                    
                    {/* Load More Button */}
                    {page < totalPages && (
                      <div className="flex justify-center mt-6">
                        <button 
                          className="bg-white border border-gray-300 rounded-lg px-6 py-3 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-50"
                          onClick={() => handleLoadMore()}
                          disabled={loadingMore}
                        >
                          {loadingMore ? (
                            <Loader2 size={20} className="animate-spin mx-auto" />
                          ) : (
                            'Load More Posts'
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* My Courses Tab */}
            {activeTab === 'my-courses' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-6">My Courses</h2>
                <p className="text-gray-500">We are working on this feature. Stay tuned for updates!</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Post Detail View */}
      <PostDetailView
        post={selectedPost}
        isOpen={showPostDetail}
        onClose={handlePostDetailClose}
      />
    </main>
  );
}