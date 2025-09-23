"use client";
import React from "react";
import { Avatar } from "@mui/material";

type SubStatus = "none" | "active" | "expired";

interface ProAvatarProps {
  src?: string;
  alt?: string;
  size?: number;              // px; applied to wrapper and MUI Avatar
  isPro?: boolean;            // true to show badge
  className?: string;         // extra Tailwind classes for the wrapper
  onClick?: () => void;
  ringWhenPro?: boolean;      // add a subtle green ring when pro
  children?: React.ReactNode; // optional custom avatar content instead of MUI Avatar
}

export default function ProAvatar({
  src,
  alt,
  size = 34,
  isPro = false,
  className = "",
  onClick,
  ringWhenPro = true,
  children,
}: ProAvatarProps) {
  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
      onClick={onClick}
    >
      {children ?? (
        <Avatar
          src={src}
          alt={alt}
          sx={{
            width: size,
            height: size,
            ...(isPro && ringWhenPro
              ? { boxShadow: "0 0 0 2px #10b981 inset" } // emerald ring
              : {}),
            cursor: onClick ? "pointer" : "default",
          }}
          className={onClick ? "transition-transform duration-200 hover:scale-105" : undefined}
        />
      )}

      {isPro && (
        <span
          className="
            absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4
            pointer-events-none
            flex items-center justify-center
            h-4 min-w-[1.1rem]
            rounded-full
            bg-yellow-300 text-yellow-900
            text-[9px] leading-4 font-extrabold
            px-1
            ring-2 ring-white
            shadow
            select-none
          "
          title="Pro subscription active"
        >
          pro
        </span>
      )}
    </div>
  );
}
