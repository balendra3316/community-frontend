// src/app/community/_components/CreatePostSection.tsx

import React from "react";
import { Avatar } from "@mui/material";

interface CreatePostSectionProps {
  user: any;
  onCreateClick: () => void;
}

export default function CreatePostSection({ user, onCreateClick }: CreatePostSectionProps) {
  return (
    <div
      className="bg-white rounded-lg mb-6 p-4"
      style={{
        boxShadow:
          "rgba(60, 64, 67, 0.32) 0px 1px 2px, rgba(60, 64, 67, 0.15) 0px 2px 6px, rgba(0, 0, 0, 0.1) 0px 1px 8px",
        border: "1px solid rgb(228, 228, 228)",
      }}
    >
      <div
        className="flex items-center cursor-pointer h-[60px] md:h-[60px] lg:h-[60px]"
        onClick={onCreateClick}
      >
        <div className="h-8 w-8 md:h-8 md:w-8 lg:h-10 lg:w-10">
          <Avatar
            src={user?.avatar}
            alt={user?.name?.charAt(0).toUpperCase() || "U"}
            className="h-full w-full bg-gray-300"
          />
        </div>
        <div className="flex-1 ml-3 bg-gray-100 rounded-full px-4 py-2 text-gray-700">
          Write something....
        </div>
      </div>
    </div>
  );
}