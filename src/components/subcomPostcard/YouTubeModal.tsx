
import React, { memo } from "react";
import { X } from "lucide-react";

interface YouTubeModalProps {
  youtubeLink: string;
  onClose: (e: React.MouseEvent) => void;
}

const getYoutubeId = (url: string): string => {
  if (!url) return "";
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/)|(watch\?v=)|(&v=))([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7] && match[7].length === 11 ? match[7] : "";
};

const YouTubeModal = memo(({ youtubeLink, onClose }: YouTubeModalProps) => (
  <div
    className="fixed inset-0 bg-[rgba(144,144,144,0.6)] bg-opacity-75 flex items-center justify-center z-50"
    onClick={onClose}
    style={{ zIndex: 9999 }}
  >
    <div
      className="relative w-full max-w-3xl mx-4"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="absolute -top-10 right-0 text-black hover:text-gray-300"
        onClick={onClose}
      >
        <X size={24} />
      </button>
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          src={`https://www.youtube.com/embed/${getYoutubeId(youtubeLink)}?autoplay=1`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>
    </div>
  </div>
));

export default YouTubeModal;