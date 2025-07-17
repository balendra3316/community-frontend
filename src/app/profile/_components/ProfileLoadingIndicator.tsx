

// import React from "react";
// import { Typography } from "@mui/material";
// import LinearProgress from "@mui/material/LinearProgress";

// interface ProfileLoadingIndicatorProps {
//   isUpdatingProfile: boolean;
// }

// export default function ProfileLoadingIndicator({ isUpdatingProfile }: ProfileLoadingIndicatorProps) {
//   if (!isUpdatingProfile) return null;

//   return (
//     <div className="fixed top-[104px] left-0 right-0 z-50 bg-white shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
//         <div className="flex items-center gap-3">
//           <Typography variant="body2" color="textPrimary">
//             Updating your profile...
//           </Typography>
//         </div>
//         <LinearProgress color="primary" className="mt-1" />
//       </div>
//     </div>
//   );
// }















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