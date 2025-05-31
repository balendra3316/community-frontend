"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import NavBar from "../../components/Navbar";
import PostDetailView from "../../components/PostDetailView";
import { useAuth } from "../../context/AuthContext";
import ProfileEditTab from "./_components/ProfileEditTab";
import MyPostsTab from "./_components/MyPostsTab";
import ProfileLoadingIndicator from "./_components/ProfileLoadingIndicator";
import { Post as PostType } from "../../services/postService";
import { PostStateProvider } from "../../types/PostStateContext";
import {
  CircularProgress,
  Box,
  Button,
  Typography,
  Paper,
} from "@mui/material";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
  const [showPostDetail, setShowPostDetail] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);


  const themeYellow = {
    primary: "#FFC107", // Amber/Yellow
    primaryDark: "#FFA000", // Darker Yellow
    primaryLight: "#FFECB3", // Lighter Yellow
    text: "#212121", // Dark text for contrast
  };

  const handlePostClick = (post: PostType) => {
    setSelectedPost(post);
    setShowPostDetail(true);
  };

  const handlePostDetailClose = () => {
    setShowPostDetail(false);
  };


  const goToCommunity = () => {
    router.push("/community");
  };


  const handleProfileUpdateStart = () => {
    setIsUpdatingProfile(true);
  };

  const handleProfileUpdateEnd = () => {
    setIsUpdatingProfile(false);
  };

  if (authLoading && !isUpdatingProfile) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <NavBar />
        <CircularProgress sx={{ color: themeYellow.primary }} />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        p={4}
      >
        <Typography variant="h4" fontWeight="bold" mb={4}>
          Please login to view your profile
        </Typography>
        <Button
          variant="contained"
          onClick={goToCommunity}
          sx={{
            bgcolor: themeYellow.primary,
            color: themeYellow.text,
            "&:hover": {
              bgcolor: themeYellow.primaryDark,
            },
          }}
        >
          Go to Community
        </Button>
      </Box>
    );
  }

  return (
    <PostStateProvider>
      <Box
        component="main"
        sx={{ minHeight: "100vh", bgcolor: "#F5F5F5", pt: "104px" }}
      >
        <NavBar />

        {/* Profile Loading Indicator */}
        <ProfileLoadingIndicator isUpdatingProfile={isUpdatingProfile} />

        <Box maxWidth="7xl" mx="auto" px={{ xs: 2, sm: 3, lg: 4 }} py={3}>
          {/* Back button */}
          <Button
            onClick={goToCommunity}
            startIcon={<ArrowLeft size={20} />}
            sx={{
              color: "text.secondary",
              "&:hover": { color: "text.primary" },
              mb: 3,
              pl: 0,
            }}
          >
            Back to Community
          </Button>

          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            gap={3}
          >
            {/* Sidebar - Mobile: Horizontal tabs, Desktop: Vertical sidebar */}
            <Box sx={{ width: { md: "256px" }, flexShrink: 0 }}>
              <Paper elevation={2} sx={{ overflow: "hidden" }}>
                {/* Mobile Tabs */}
                <Box
                  sx={{
                    display: { xs: "flex", md: "none" },
                    overflowX: "auto",
                  }}
                >
                  {["profile", "my-posts", "my-courses"].map((tab) => (
                    <Button
                      key={tab}
                      sx={{
                        flex: 1,
                        py: 2,
                        px: 2,
                        fontWeight: 500,
                        borderRadius: 0,
                        borderBottom:
                          activeTab === tab
                            ? `2px solid ${themeYellow.primary}`
                            : "none",
                        bgcolor:
                          activeTab === tab
                            ? `${themeYellow.primaryLight}`
                            : "transparent",
                        color: activeTab === tab ? themeYellow.text : "black",
                        "&:hover": {
                          bgcolor:
                            activeTab === tab
                              ? themeYellow.primaryLight
                              : "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab === "profile"
                        ? "Profile"
                        : tab === "my-posts"
                        ? "My Posts"
                        : "My Courses"}
                    </Button>
                  ))}
                </Box>

                {/* Desktop Sidebar */}
                <Box sx={{ display: { xs: "none", md: "block" } }}>
                  {["profile", "my-posts", "my-courses"].map((tab) => (
                    <Button
                      key={tab}
                      fullWidth
                      sx={{
                        justifyContent: "flex-start",
                        py: 2,
                        px: 3,
                        fontWeight: 500,
                        borderRadius: 0,
                        borderLeft:
                          activeTab === tab
                            ? `4px solid ${themeYellow.primary}`
                            : "none",
                        bgcolor:
                          activeTab === tab
                            ? `${themeYellow.primaryLight}`
                            : "transparent",
                        color:
                          activeTab === tab
                            ? themeYellow.primary
                            : "text.secondary",
                        "&:hover": {
                          bgcolor:
                            activeTab === tab
                              ? themeYellow.primaryLight
                              : "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab === "profile"
                        ? "Profile"
                        : tab === "my-posts"
                        ? "My Posts"
                        : "My Courses"}
                    </Button>
                  ))}
                </Box>
              </Paper>
            </Box>

            {/* Main Content */}
            <Box sx={{ flex: 1 }}>
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <ProfileEditTab
                  user={user}
                  onUpdateStart={handleProfileUpdateStart}
                  onUpdateEnd={handleProfileUpdateEnd}
                />
              )}

              {/* My Posts Tab */}
              {activeTab === "my-posts" && (
                <MyPostsTab user={user} onPostClick={handlePostClick} />
              )}

              {/* My Courses Tab */}
              {activeTab === "my-courses" && (
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                  <Typography variant="h5" fontWeight="bold" mb={3}>
                    My Courses
                  </Typography>
                  <Typography color="text.secondary">
                    We are working on this feature. Stay tuned for updates!
                  </Typography>
                </Paper>
              )}
            </Box>
          </Box>
        </Box>

        {/* Post Detail View */}
        <PostDetailView
          post={selectedPost}
          isOpen={showPostDetail}
          onClose={handlePostDetailClose}
        />
      </Box>
    </PostStateProvider>
  );
}
