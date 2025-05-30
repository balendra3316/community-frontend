// src/components/leaderboard/UserRankCard.tsx
import React, { memo } from "react";
import {
  Paper,
  Box,
  Avatar,
  Typography,
  Divider,
  Skeleton,
} from "@mui/material";

interface UserRankCardProps {
  name: string;
  avatar: string;
  points: number;
  rank: number | null;
  loading: boolean;
}

const UserRankCard: React.FC<UserRankCardProps> = memo(
  ({ name, avatar, points, rank, loading }) => {
    if (loading) {
      return (
        <Paper
          elevation={2}
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            mt: 4,
            borderRadius: 2,
          }}
        >
          <Skeleton variant="circular" width={48} height={48} sx={{ mr: 2 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Skeleton animation="wave" height={24} width="40%" />
            <Skeleton animation="wave" height={20} width="20%" />
          </Box>
          <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
          <Box sx={{ textAlign: "center", mr: 2 }}>
            <Skeleton animation="wave" height={24} width={60} />
            <Skeleton animation="wave" height={20} width={40} />
          </Box>
          <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
          <Box sx={{ textAlign: "center" }}>
            <Skeleton animation="wave" height={24} width={60} />
            <Skeleton animation="wave" height={20} width={40} />
          </Box>
        </Paper>
      );
    }

    return (
      <Paper
        elevation={2}
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          mt: 4,
          borderRadius: 2,
          backgroundColor: "#fff9c4",
          color: "rgba(0, 0, 0, 0.87)",
        }}
      >
        <Avatar
          src={avatar}
          alt={name}
          sx={{
            width: 48,
            height: 48,
            mr: 2,
            border: "2px solid white",
          }}
        />

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="div">
            {name}
          </Typography>
          <Typography variant="body2">Your stats</Typography>
        </Box>

        <Divider
          orientation="vertical"
          flexItem
          sx={{ mx: 2, backgroundColor: "rgba(255,255,255,0.3)" }}
        />

        <Box sx={{ textAlign: "center", mr: 2 }}>
          <Typography variant="h6" component="div">
            {rank !== null ? `#${rank}` : "N/A"}
          </Typography>
          <Typography variant="body2">Rank</Typography>
        </Box>

        <Divider
          orientation="vertical"
          flexItem
          sx={{ mx: 2, backgroundColor: "rgba(255,255,255,0.3)" }}
        />

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" component="div">
            {points}
          </Typography>
          <Typography variant="body2">Points</Typography>
        </Box>
      </Paper>
    );
  }
);

UserRankCard.displayName = "UserRankCard";

export default UserRankCard;
