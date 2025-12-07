

"use client";
import { useRef, useEffect, useState } from "react";
import { ThumbsUp, MessageSquare, BarChart2, Link } from "lucide-react"; 
import { Post } from "../../services/postService";
import { useAuth } from "../../context/AuthContext";
import { usePostState } from "../../types/PostStateContext";
import { Avatar } from "@mui/material";
import { LEVEL_TEXT_CLASSES } from "../constants/leaderboardColors";

// --- START: Player.js Types and Globals for Bunny Stream API ---
// We need to declare the external playerjs library that will be loaded dynamically
declare global {
  interface Window {
    playerjs: {
      Player: new (element: HTMLElement | string) => PlayerInstance;
    };
  }
}

// Minimal type definition for the playerjs instance methods we need
interface PlayerInstance {
  // Methods for listener cleanup
  on: (event: 'ready' | 'play' | 'pause' | 'buffer' | string, callback: (...args: any[]) => void) => void;
  off: (event: 'ready' | 'play' | 'pause' | 'buffer' | string, callback?: (...args: any[]) => void) => void;
  // Methods for state check
  getPaused: (callback: (isPaused: boolean) => void) => void;
  play: () => void;
  pause: () => void;
}
// --- END: Player.js Types and Globals ---

interface PostContentProps {
  post: Post;
  formatRelativeTime: (timestamp: string) => string;
  handleLikePost: () => Promise<void>;
  isPostLikedByUser: boolean | undefined;
  handleVote: (optionIndex: number) => Promise<void>;
  pollVoting: boolean;
  hasVotedOnPoll: boolean | undefined;
  likes: string[];
}

export default function PostContent({
  post,
  formatRelativeTime,
  handleLikePost,
  isPostLikedByUser,
  handleVote,
  pollVoting,
  hasVotedOnPoll,
  likes,
}: PostContentProps) {
  const { user } = useAuth();
  const { likedPosts, likeCounts } = usePostState();
  const [showFullContent, setShowFullContent] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [contentOverflows, setContentOverflows] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageAspectRatio, setImageAspectRatio] = useState(1);
  const [isBunnyVideoLoading, setIsBunnyVideoLoading] = useState(true); // State for video loading

  // Use a useRef to safely store the player instance
  const playerRef = useRef<PlayerInstance | null>(null);

  const isLiked = likedPosts[post._id] ?? isPostLikedByUser;
  const currentLikeCount = likeCounts[post._id] ?? likes.length;

  // Generate a unique ID for the iframe (stable reference)
  const iframeId = `bunny-video-player-${post._id}`;

  // --- START: Bunny Stream Player Logic (The dynamic loader solution) ---
  useEffect(() => {
    let script: HTMLScriptElement | null = null;
    
    // Stable references for the handlers (to be used in the cleanup function)
    const handleBuffer = () => setIsBunnyVideoLoading(true);
    const handlePlay = () => setIsBunnyVideoLoading(false);

    if (post.videoUrl) {
      const initializePlayer = () => {
        const iframeElement = document.getElementById(iframeId);
        if (window.playerjs && iframeElement) {
          try {
            // Assign the new instance to the ref
            playerRef.current = new window.playerjs.Player(iframeElement);
            
            const player = playerRef.current; // Alias for readability

            player.on('ready', () => {
              // Attach listeners for dynamic loading control
              player.on('play', handlePlay);
              player.on('buffer', handleBuffer);
              
              // Check initial state: if it's already playing, hide the loader immediately
              player.getPaused((isPaused) => {
                  if (!isPaused) {
                      setIsBunnyVideoLoading(false);
                  }
              });
            });
            
          } catch (error) {
            console.error("Error initializing player.js:", error);
            setIsBunnyVideoLoading(false);
          }
        }
      };

      // Load player.js script if it's not already available
      if (!window.playerjs) {
        script = document.createElement('script');
        script.src = "//assets.mediadelivery.net/playerjs/playerjs-latest.min.js";
        script.async = true;
        script.onload = initializePlayer;
        document.body.appendChild(script);
      } else {
        // If script is already loaded, initialize the player immediately
        initializePlayer();
      }
    }

    // CLEANUP FUNCTION: The key to fixing the runtime error
    return () => {
      // Check if the iframe element still exists in the DOM before attempting to clean up the player.
      const iframeElement = document.getElementById(iframeId);

      // Only detach listeners if the player and its iframe are still active
      if (playerRef.current && iframeElement) {
        try {
          playerRef.current.off('play', handlePlay);
          playerRef.current.off('buffer', handleBuffer);
        } catch(e) {
          // Gracefully fail if the postMessage channel is already gone.
          //console.log("Player cleanup failed, iframe was likely already removed.");
        }
      }
      
      // Null out the ref regardless, as the component is unmounting
      playerRef.current = null;
    };
  }, [post.videoUrl, post._id]); // Add post._id to the dependency array
  
  // --- END: Bunny Stream Player Logic ---

  useEffect(() => {
    if (contentRef.current) {
      const lineHeight = parseInt(
        window.getComputedStyle(contentRef.current).lineHeight
      );
      const height = contentRef.current.scrollHeight;
      const lines = height / lineHeight;
      setContentOverflows(lines > 4);
    }
  }, [post.content]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    setImageAspectRatio(img.naturalWidth / img.naturalHeight);
    setImageLoaded(true);
  };

  const toggleContentDisplay = () => {
    setShowFullContent(!showFullContent);
  };

  const calculateTotalVotes = () => {
    if (!post.poll?.options) return 0;
    return post.poll.options.reduce(
      (sum, option) => sum + (option.votes?.length || 0),
      0
    );
  };

  const calculatePercentage = (optionIndex: number) => {
    if (!post.poll?.options) return 0;
    const optionVotes = post.poll.options[optionIndex].votes?.length || 0;
    const totalVotes = calculateTotalVotes();
    return totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;
  };

  const latestBadge = post.author.leaderboardBadges?.length
    ? post.author.leaderboardBadges[post.author.leaderboardBadges.length - 1]
    : undefined;

  const renderVideoPlayer = () => {
    if (!post.videoUrl) return null;

    return (
      <div className="w-full h-auto aspect-video rounded-lg overflow-hidden mb-4 relative">
        {/* Conditional Loading Spinner (z-10 ensures it's above the iframe) */}
        {isBunnyVideoLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10 rounded-lg">
            <div className="h-10 w-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <iframe
          id={iframeId} // Use the unique ID here
          src={post.videoUrl}
          title="Post Video Player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        ></iframe>
      </div>
    );
  };

  const renderYoutubeEmbed = (link: string) => {
    const youtubeRegex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = link.match(youtubeRegex);

    if (match && match[1]) {
      const videoId = match[1];
      return (
        <div className="w-full h-auto aspect-video rounded-lg overflow-hidden mb-4">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      );
    }

    return null;
  };

  const renderPoll = () => {
    if (!post.poll?.options || post.poll.options.length === 0) return null;
    const totalVotes = calculateTotalVotes();

    return (
      <div className="mt-4 mb-6 bg-gray-50 rounded-lg p-4 border">
        <div className="flex items-center mb-3">
          <BarChart2 size={18} className="mr-2 text-blue-600" />
          <h3 className="font-medium">Poll</h3>
          <span className="ml-auto text-sm text-gray-500">
            {totalVotes} votes
          </span>
        </div>
        <div className="space-y-3">
          {post.poll.options.map((option, index) => {
            const percentage = calculatePercentage(index);
            const isVoted =
              hasVotedOnPoll && user && option.votes?.includes(user._id);

            return (
              <div key={index} className="relative">
                {hasVotedOnPoll ? (
                  <div className="relative bg-gray-100 rounded-md overflow-hidden">
                    <div
                      className={`absolute top-0 left-0 h-full ${
                        isVoted ? "bg-blue-100" : "bg-gray-200"
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                    <div className="relative px-4 py-3 flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="font-medium">{option.text}</span>
                        {isVoted && (
                          <span className="ml-2 text-blue-600 text-sm">
                            • Your vote
                          </span>
                        )}
                      </div>
                      <span className="font-medium">{percentage}%</span>
                    </div>
                  </div>
                ) : (
                  <button
                    className="w-full px-4 py-3 bg-white hover:bg-gray-50 border rounded-md flex justify-between items-center disabled:opacity-70"
                    onClick={() => handleVote(index)}
                    disabled={pollVoting}
                  >
                    <span>{option.text}</span>
                    {pollVoting && <span className="loader ml-2"></span>}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 border-b">
      <div className="flex items-center mb-3">
        <div className="relative h-10 w-10 flex-shrink-0">
          <Avatar
            src={post.author.avatar}
            alt={post.author.name?.charAt(0).toUpperCase()}
            className="h-10 w-10 bg-gray-300"
          />
          {post.author.subscription?.status === "active" && (
            <span
              className="
      absolute
      bottom-0 left-0
      -translate-x-1/4 translate-y-1/4
      pointer-events-none
      flex items-center justify-center
      h-4 min-w-[1.1rem]
      rounded-full
      bg-yellow-300 text-yellow-900
      text-[9px] leading-4 font-extrabold
      px-1
      ring-2 ring-white
      shadow
    "
              title="Pro subscription active"
            >
              pro
            </span>
          )}
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center gap-1">
            <span className="font-medium">{post.author.name}</span>
            {latestBadge && (
              <span
                className={`text-xs font-semibold ${LEVEL_TEXT_CLASSES[latestBadge.level] || "text-orange-700"}`}
              >
                {latestBadge.name}
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500 flex items-center">
            <span>{formatRelativeTime(post.createdAt)}</span>
            {post.tags && post.tags.length > 0 && (
              <>
                <span className="mx-1">•</span>
                <span className="text-yellow-900">{post.tags[0]}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-2">{post.title}</h2>

      <div className="mb-4 relative">
        <p
          ref={contentRef}
          className={`whitespace-pre-wrap ${
            !showFullContent && contentOverflows ? "line-clamp-4" : ""
          }`}
        >
          {post.content}
        </p>
        {contentOverflows && (
          <button
            onClick={toggleContentDisplay}
            className="text-blue-600 text-sm font-medium mt-1"
          >
            {showFullContent ? "See less" : "See more"}
          </button>
        )}
      </div>

      {post.links && post.links.length > 0 && (
        <div className="my-4 space-y-2">
          {post.links.map((link, index) => (
            <a
              key={index}
              href={!/^https?:\/\//i.test(link) ? `https://${link}` : link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border transition-colors duration-200 group"
            >
              <Link size={16} className="mr-3 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
              <span className="text-blue-600 group-hover:text-blue-700 truncate font-medium text-sm">
                {link}
              </span>
            </a>
          ))}
        </div>
      )}

      {post.image && (
        <div className="mb-4 rounded-lg overflow-hidden max-w-full">
          <img
            src={post.image}
            alt="Post"
            className="w-full max-h-96 object-contain"
            onLoad={handleImageLoad}
            style={{
              maxWidth: "100%",
              maxHeight: imageAspectRatio < 1 ? "460px" : "360px",
            }}
          />
        </div>
      )}

      {post.videoUrl && renderVideoPlayer()}
      {post.youtubeLink && renderYoutubeEmbed(post.youtubeLink)}

      {post.poll && renderPoll()}

      <div className="flex items-center text-gray-500 text-sm mt-2 pt-2 border-t">
        <button
          onClick={handleLikePost}
          className={`flex items-center mr-6 ${isLiked ? "text-blue-600" : ""}`}
        >
          <ThumbsUp
            size={18}
            className={`mr-1 ${isLiked ? "fill-current" : ""}`}
          />
          <span>{currentLikeCount}</span>
        </button>
        <div className="flex items-center">
          <MessageSquare size={18} className="mr-1" />
          <span>{post.totalComments}</span>
        </div>
      </div>
    </div>
  );
}