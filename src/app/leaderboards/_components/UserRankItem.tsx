
import React, { memo } from "react";
import { Box, Avatar, Typography, Tooltip } from "@mui/material";
import { LeaderboardUser } from "../../../services/leaderboard.service";
import { LEVEL_TEXT_CLASSES } from "../../../components/constants/leaderboardColors";


const RANK_COLORS = {
  1: "#FFD700", // Gold
  2: "#C0C0C0", // Silver
  3: "#CD7F32", // Bronze
};

interface UserRankItemProps {
  user: LeaderboardUser;
  isCurrentUser?: boolean;
}

const UserRankItem: React.FC<UserRankItemProps> = memo(
  ({ user, isCurrentUser = false }) => {
    const { rank, name, avatar, points } = user;

const badgeName = (user as any).latestBadge?.name as string | undefined;
const badge = (user as any).latestBadge;
const badgeTextClass = LEVEL_TEXT_CLASSES[badge?.level as number] || "text-gray-700";
    const isTopRank = rank && rank <= 3;
    const rankColor = isTopRank
      ? RANK_COLORS[rank as keyof typeof RANK_COLORS]
      : undefined;

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          py: 1,
          backgroundColor: isCurrentUser
            ? "rgba(25, 118, 210, 0.08)"
            : "transparent",
          borderRadius: 1,
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            backgroundColor: rankColor || "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: rankColor ? "#000" : "text.secondary",
            fontWeight: "bold",
            mr: 2,
          }}
        >
          {rank}
        </Box>

        <Avatar
          src={avatar}
          alt={name}
          sx={{
            width: 40,
            height: 40,
            mr: 2,
            border: isCurrentUser ? "2px solid #1976d2" : "none",
          }}
        />

        <Box sx={{ flexGrow: 1 }}>
          <Tooltip title={name} placement="top">
            <Typography
              variant="body1"
              component="div"
              sx={{
                fontWeight: isCurrentUser ? "bold" : "medium",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "150px",
              }}
            >
              {name}
            </Typography>
          </Tooltip>
          {badgeName ? (
     <Typography
    variant="caption"
    component="div"
    sx={{ mt: 0.25 }}
    className={badgeTextClass} // add className via MUI by passing through
  >
    {badge.name}
  </Typography>
  ) : null}
        </Box>

        <Typography
          variant="body2"
          color="primary"
          sx={{
            fontWeight: "bold",
            ml: 1,
          }}
        >
          +{points}
        </Typography>
      </Box>
    );
  }
);

UserRankItem.displayName = "UserRankItem";

export default UserRankItem;
