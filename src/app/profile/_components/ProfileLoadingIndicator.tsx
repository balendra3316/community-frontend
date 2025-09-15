



"use client";

import { LinearProgress, Typography } from "@mui/material";

interface ProfileLoadingIndicatorProps {
  isUpdatingProfile: boolean;
  isUpdatingPost?: boolean; // ADDED: Prop for post updates
}

export default function ProfileLoadingIndicator({
  isUpdatingProfile,
  isUpdatingPost,
}: ProfileLoadingIndicatorProps) {
  // Show indicator if either action is in progress
  const isLoading = isUpdatingProfile || isUpdatingPost;

  if (!isLoading) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "104px", // Positioned just below your navbar
        left: 0,
        width: "100%",
        zIndex: 1500, // High z-index to be on top
      }}
    >
       <Typography variant="body2" color="textPrimary">
             Updating your profile...
           </Typography>
      <LinearProgress sx={{
        "& .MuiLinearProgress-bar": {
          backgroundColor: "#FFC107" // Using your theme's yellow
        }
      }}/>
    </div>
  );
}