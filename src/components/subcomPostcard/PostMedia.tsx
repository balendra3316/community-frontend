// // components/PostMedia.tsx
// import React, { memo, lazy, Suspense } from "react";

// const LazyYouTubeModal = lazy(() => import("./YouTubeModal"));

// interface PostMediaProps {
//   image?: string;
//   youtubeLink?: string;
//   isMobile?: boolean;
//   onOpenYoutube: (e: React.MouseEvent) => void;
// }

// const getYoutubeId = (url: string): string => {
//   if (!url) return "";
//   const regExp = /^.*((youtu.be\/)|(v\/)|(\/)|(watch\?v=)|(&v=))([^#&?]*).*/;
//   const match = url.match(regExp);
//   return match && match[7] && match[7].length === 11 ? match[7] : "";
// };

// const getYoutubeThumbnail = (url: string): string => {
//   const videoId = getYoutubeId(url);
//   return videoId
//     ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
//     : "/api/placeholder/320/180";
// };

// export const PostMedia = memo(({ image, youtubeLink, isMobile, onOpenYoutube }: PostMediaProps) => {
//   const hasYoutubeLink = youtubeLink && getYoutubeId(youtubeLink);
  
//   if (!image && !hasYoutubeLink) return null;

//   const containerClass = isMobile 
//     ? "w-full flex justify-center" 
//     : "flex-shrink-0 w-32 h-28 overflow-hidden";

//   const imageClass = isMobile
//     ? "rounded-lg w-full h-full object-cover"
//     : "rounded-lg w-full h-full object-cover";

//   if (image && !hasYoutubeLink) {
//     return (
//       <div className={containerClass} style={isMobile ? { maxHeight: "300px" } : {}}>
//         <img
//           src={image}
//           alt="Post image"
//           className={imageClass}
//           loading="lazy"
//         />
//       </div>
//     );
//   }

//   if (hasYoutubeLink) {
//     return (
//       <div
//         className={`relative rounded-lg overflow-hidden cursor-pointer ${containerClass}`}
//         onClick={onOpenYoutube}
//         style={isMobile ? { height: "180px" } : { height: "100%" }}
//       >
//         <img
//           src={getYoutubeThumbnail(youtubeLink)}
//           alt="YouTube thumbnail"
//           className="w-full h-full object-cover"
//           loading="lazy"
//         />
//         <div className="absolute inset-0 bg-opacity-20 flex items-center justify-center">
//           <div className={`bg-red-600 rounded-full flex items-center justify-center ${
//             isMobile ? "w-12 h-12" : "w-10 h-10"
//           }`}>
//             <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-white border-b-4 border-b-transparent ml-1"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return null;
// });







// import React, { memo } from "react";

// interface PostMediaProps {
//   image?: string;
//   youtubeLink?: string;
//   isMobile?: boolean;
//   onOpenYoutube: (e: React.MouseEvent) => void;
// }

// const getYoutubeId = (url: string): string => {
//   if (!url) return "";
  
//   const regExp = /^.*((youtu.be\/)|(v\/)|(\/)|(watch\?v=)|(&v=))([^#&?]*).*/;
//   const match = url.match(regExp);
//   return match && match[7] && match[7].length === 11 ? match[7] : "";
// };

// const getYoutubeThumbnail = (url: string): string => {
//   const videoId = getYoutubeId(url);
//   return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";
// };

// export const PostMedia = memo(({ image, youtubeLink, isMobile, onOpenYoutube }: PostMediaProps) => {
//   const youtubeId = youtubeLink ? getYoutubeId(youtubeLink) : "";
//   const youtubeThumbnail = youtubeId ? getYoutubeThumbnail(youtubeLink!) : "";
  
//   // Priority: Show YouTube thumbnail if YouTube link exists
//   // Otherwise show image if it exists
//   const shouldShowYoutube = youtubeId && youtubeThumbnail;
//   const shouldShowImage = image && !shouldShowYoutube;

//   // If no media to show, return null
//   if (!shouldShowYoutube && !shouldShowImage) return null;

//   const containerClass = isMobile
//     ? "w-full flex justify-center"
//     : "flex-shrink-0 w-32 h-28 overflow-hidden rounded-lg";

//   const imageClass = isMobile
//     ? "rounded-lg w-full max-h-64 object-cover"
//     : "rounded-lg w-full h-full object-cover";

//   const handleYoutubeClick = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     onOpenYoutube(e);
//   };

//   // Render YouTube thumbnail with play button overlay
//   if (shouldShowYoutube) {
//     return (
//       <div className={containerClass}>
//         <div 
//           className="relative rounded-lg overflow-hidden cursor-pointer w-full h-full"
//           onClick={handleYoutubeClick}
//         >
//           <img
//             src={youtubeThumbnail}
//             alt="Video thumbnail"
//             className={imageClass}
//             loading="lazy"
//           />
//           <div className="absolute inset-0 bg-opacity-20 flex items-center justify-center">
//             <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
//               <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-white border-b-4 border-b-transparent ml-1"></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Render regular image
//   if (shouldShowImage) {
//     return (
//       <div className={containerClass}>
//         <img
//           src={image}
//           alt="Post media"
//           className={imageClass}
//           loading="lazy"
//         />
//       </div>
//     );
//   }

//   return null;
// });

// PostMedia.displayName = 'PostMedia';






import React, { memo, useState } from "react";

interface PostMediaProps {
  image?: string;
  youtubeLink?: string;
  isMobile?: boolean;
  onOpenYoutube: (e: React.MouseEvent) => void;
}

const getYoutubeId = (url: string): string => {
  if (!url) return "";
  
  // Improved regex to handle all YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : "";
};

const getYoutubeThumbnail = (url: string): string => {
  const videoId = getYoutubeId(url);
  if (!videoId) return "";
  
  // Try higher quality thumbnail first, fallback to standard quality
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

export const PostMedia = memo(({ image, youtubeLink, isMobile, onOpenYoutube }: PostMediaProps) => {
  const [imageError, setImageError] = useState(false);
  const [youtubeThumbnailError, setYoutubeThumbnailError] = useState(false);
  
  // Get YouTube video ID and thumbnail
  const youtubeId = youtubeLink ? getYoutubeId(youtubeLink) : "";
  const youtubeThumbnail = youtubeId ? getYoutubeThumbnail(youtubeLink!) : "";
  
  // Determine what to show
  const showYoutubeThumbnail = youtubeId && youtubeThumbnail && !youtubeThumbnailError;
  const showImage = image && !imageError && !showYoutubeThumbnail;

  // If no media to show, return null
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

  // Render YouTube thumbnail with play button overlay
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

  // Render regular image
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