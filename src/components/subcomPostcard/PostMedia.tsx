



import React, { memo, useState } from "react";

interface PostMediaProps {
  image?: string;
  youtubeLink?: string;
  isMobile?: boolean;
  onOpenYoutube: (e: React.MouseEvent) => void;
}

const getYoutubeId = (url: string): string => {
  if (!url) return "";
  

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : "";
};

const getYoutubeThumbnail = (url: string): string => {
  const videoId = getYoutubeId(url);
  if (!videoId) return "";
  

  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

export const PostMedia = memo(({ image, youtubeLink, isMobile, onOpenYoutube }: PostMediaProps) => {
  const [imageError, setImageError] = useState(false);
  const [youtubeThumbnailError, setYoutubeThumbnailError] = useState(false);
  

  const youtubeId = youtubeLink ? getYoutubeId(youtubeLink) : "";
  const youtubeThumbnail = youtubeId ? getYoutubeThumbnail(youtubeLink!) : "";
  

  const showYoutubeThumbnail = youtubeId && youtubeThumbnail && !youtubeThumbnailError;
  const showImage = image && !imageError && !showYoutubeThumbnail;


  if (!showYoutubeThumbnail && !showImage) return null;

  const containerClass = isMobile
    ? "w-full flex justify-center"
    : "flex-shrink-0 w-32 h-28 overflow-hidden rounded-lg";

  const mediaClass = isMobile
    ? "rounded-lg w-full max-h-64 object-cover"
    : "rounded-lg w-full h-full object-cover";

  const handleImageError = () => {
    setImageError(true);
  };

  const handleYoutubeThumbnailError = () => {
    setYoutubeThumbnailError(true);
  };

  const handleYoutubeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onOpenYoutube(e);
  };


  if (showYoutubeThumbnail) {
    return (
      <div className={containerClass}>
        <div 
          className="relative cursor-pointer group"
          onClick={handleYoutubeClick}
        >
          <img
            src={youtubeThumbnail}
            alt="Video thumbnail"
            className={mediaClass}
            onError={handleYoutubeThumbnailError}
            loading="lazy"
          />
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all duration-200">
            <div className="bg-red-600 rounded-full p-2 shadow-lg transform group-hover:scale-110 transition-transform duration-200">
              <svg 
                className="w-6 h-6 text-white ml-1" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
          {/* YouTube logo in corner */}
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-1 py-0.5 rounded">
            YouTube
          </div>
        </div>
      </div>
    );
  }


  if (showImage) {
    return (
      <div className={containerClass}>
        <img
          src={image}
          alt="Post media"
          className={mediaClass}
          onError={handleImageError}
          loading="lazy"
        />
      </div>
    );
  }

  return null;
});

PostMedia.displayName = 'PostMedia';