



import React, { memo, useMemo } from 'react';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import { LeaderboardUser } from '../../../services/leaderboard.service';
import { FixedSizeList as List } from 'react-window';

const UserRankItem = React.lazy(() => import('./UserRankItem'));

interface LeaderboardCardProps {
  title: string;
  users: LeaderboardUser[];
  loading: boolean;
}


const SkeletonItem = memo(() => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
    <Box sx={{ width: '100%' }}>
      <Skeleton animation="wave" height={25} width="60%" />
      <Skeleton animation="wave" height={20} width="30%" />
    </Box>
  </Box>
));


const Row = memo(({ index, style, data }: { index: number; style: React.CSSProperties; data: LeaderboardUser[] }) => (
  <div style={style}>
    <React.Suspense fallback={<SkeletonItem />}>
      <UserRankItem key={data[index]._id} user={data[index]} />
    </React.Suspense>
  </div>
));

const LeaderboardCard: React.FC<LeaderboardCardProps> = memo(({ title, users, loading }) => {

  const skeletonItems = useMemo(() => 
    Array.from(new Array(8)).map((_, index) => <SkeletonItem key={index} />),
    []
  );


  const shouldVirtualize = users.length > 50;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
          {title}
        </Typography>

        {loading ? (
          skeletonItems
        ) : (
          <Box>
            {shouldVirtualize ? (
              <List
                height={600}
                itemCount={users.length}
                itemSize={60}
                itemData={users}
                width="100%"
              >
                {Row}
              </List>
            ) : (
              users.map((user) => (
                <React.Suspense key={user._id} fallback={<SkeletonItem />}>
                  <UserRankItem user={user} />
                </React.Suspense>
              ))
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
});

LeaderboardCard.displayName = 'LeaderboardCard';

export default LeaderboardCard;