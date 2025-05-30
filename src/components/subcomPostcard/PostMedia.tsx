// components/PostMedia.tsx
import React, { memo, lazy, Suspense } from "react";

const LazyYouTubeModal = lazy(() => import("./YouTubeModal"));

interface PostMediaProps {
  image?: string;
  youtubeLink?: string;
  isMobile?: boolean;
  onOpenYoutube: (e: React.MouseEvent) => void;
}

const getYoutubeId = (url: string): string => {
  if (!url) return "";
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/)|(watch\?v=)|(&v=))([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7] && match[7].length === 11 ? match[7] : "";
};

const getYoutubeThumbnail = (url: string): string => {
  const videoId = getYoutubeId(url);
  return videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : "/api/placeholder/320/180";
};

export const PostMedia = memo(({ image, youtubeLink, isMobile, onOpenYoutube }: PostMediaProps) => {
  const hasYoutubeLink = youtubeLink && getYoutubeId(youtubeLink);
  
  if (!image && !hasYoutubeLink) return null;

  const containerClass = isMobile 
    ? "w-full flex justify-center" 
    : "flex-shrink-0 w-32 h-28 overflow-hidden";

  const imageClass = isMobile
    ? "rounded-lg w-full h-full object-cover"
    : "rounded-lg w-full h-full object-cover";

  if (image && !hasYoutubeLink) {
    return (
      <div className={containerClass} style={isMobile ? { maxHeight: "300px" } : {}}>
        <img
          src={image}
          alt="Post image"
          className={imageClass}
          loading="lazy"
        />
      </div>
    );
  }

  if (hasYoutubeLink) {
    return (
      <div
        className={`relative rounded-lg overflow-hidden cursor-pointer ${containerClass}`}
        onClick={onOpenYoutube}
        style={isMobile ? { height: "180px" } : { height: "100%" }}
      >
        <img
          src={getYoutubeThumbnail(youtubeLink)}
          alt="YouTube thumbnail"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-opacity-20 flex items-center justify-center">
          <div className={`bg-red-600 rounded-full flex items-center justify-center ${
            isMobile ? "w-12 h-12" : "w-10 h-10"
          }`}>
            <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-white border-b-4 border-b-transparent ml-1"></div>
          </div>
        </div>
      </div>
    );
  }

  return null;
});