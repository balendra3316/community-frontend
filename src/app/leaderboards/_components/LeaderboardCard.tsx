// src/components/leaderboard/LeaderboardCard.tsx
import React from 'react';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import { LeaderboardUser } from '../../../services/leaderboard.service';
import UserRankItem from './UserRankItem';

interface LeaderboardCardProps {
  title: string;
  users: LeaderboardUser[];
  loading: boolean;
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ title, users, loading }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
          {title}
        </Typography>
        
        {loading ? (
          Array.from(new Array(8)).map((_, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
              <Box sx={{ width: '100%' }}>
                <Skeleton animation="wave" height={25} width="60%" />
                <Skeleton animation="wave" height={20} width="30%" />
              </Box>
            </Box>
          ))
        ) : (
          <Box>
            {users.map((user) => (
              <UserRankItem key={user._id} user={user} />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaderboardCard;