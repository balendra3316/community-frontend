

import React from "react";
import { Typography } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";

interface LoadingIndicatorProps {
  isCreatingPost: boolean;
}

export default function LoadingIndicator({ isCreatingPost }: LoadingIndicatorProps) {
  if (!isCreatingPost) return null;

  return (
    <div className="fixed top-[110px] left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center gap-3">
          <Typography variant="body2" color="textPrimary">
            Creating your post...
          </Typography>
        </div>
        <LinearProgress color="primary" className="mt-1" />
      </div>
    </div>
  );
}