// components/PostContent.tsx
import React, { memo } from "react";

interface PostContentProps {
  title: string;
  content: string;
  hasMedia: boolean |string| undefined;
  isMobile?: boolean;
}

export const PostContent = memo(({ title, content, hasMedia, isMobile }: PostContentProps) => {
  const titleClamp = isMobile ? "2" : "1";
  const contentClamp = isMobile ? "3" : "2";
  const maxWidth = hasMedia && !isMobile ? "sm:max-w-[68%]" : "w-full";

  return (
    <div className={`flex-1 ${maxWidth} overflow-hidden`}>
      <h3
        className="font-bold mb-2 text-ellipsis overflow-hidden"
        style={{
          fontFamily: "Roboto, Helvetica, Arial, sans-serif",
          fontSize: "18px",
          lineHeight: "1.4",
          display: "-webkit-box",
          WebkitLineClamp: titleClamp,
          WebkitBoxOrient: "vertical",
          textOverflow: "ellipsis",
        }}
      >
        {title}
      </h3>
      <p
        className="text-gray-700 overflow-hidden"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: contentClamp,
          WebkitBoxOrient: "vertical",
          textOverflow: "ellipsis",
          maxHeight: isMobile ? "auto" : "48px",
        }}
      >
        {content}
      </p>
    </div>
  );
});