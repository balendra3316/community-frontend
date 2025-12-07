"use client";
import React from "react";
import { Drawer, IconButton, useTheme } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import CommunityInfoSidebar from "../CommunityInfoSidebar";
import SubscriptionStatus from "./SubscriptionStatus";

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const theme = useTheme();

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: "70%",
          maxWidth: "400px",
          backgroundColor: "#f8f9fa",
          transition: theme.transitions.create(["transform"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(144,144,144,0.6)",
        },
      }}
      transitionDuration={{
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
      }}
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          <IconButton
            onClick={onClose}
            sx={{
              color: "#666",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
                transform: "rotate(180deg)",
                transition: "all 0.3s ease",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <CommunityInfoSidebar />
            <SubscriptionStatus />
        </div>
      </div>
    </Drawer>
  );
}

