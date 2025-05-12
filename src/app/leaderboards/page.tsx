// src/app/leaderboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, useTheme } from '@mui/material';
import NavBar from '../../components/Navbar';
import LeaderboardCard from './_components/LeaderboardCard';
import UserRankCard from './_components/UserRankCard';
import LeaderboardTabs, { TabPanel } from './_components/LeaderboardTabs';
import LeaderboardService, { LeaderboardResponse } from '../../services/leaderboard.service';


export default function Leaderboards() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState<LeaderboardResponse | null>(null);
  const [monthlyData, setMonthlyData] = useState<LeaderboardResponse | null>(null);
  const [allTimeData, setAllTimeData] = useState<LeaderboardResponse | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setLoading(true);
      try {
        const [weeklyResponse, monthlyResponse, allTimeResponse] = await Promise.all([
          LeaderboardService.getWeeklyLeaderboard(),
          LeaderboardService.getMonthlyLeaderboard(),
          LeaderboardService.getAllTimeLeaderboard()
        ]);

        setWeeklyData(weeklyResponse);
        setMonthlyData(monthlyResponse);
        setAllTimeData(allTimeResponse);
        
        // Set last updated timestamp
        const now = new Date();
        const formattedDate = now.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        const formattedTime = now.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        });
        setLastUpdated(`${formattedDate} ${formattedTime}`);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  // Get current user data based on active tab
  const getCurrentUserData = () => {
    if (activeTab === 0 && weeklyData) {
      return weeklyData.user;
    } else if (activeTab === 1 && monthlyData) {
      return monthlyData.user;
    } else if (activeTab === 2 && allTimeData) {
      return allTimeData.user;
    }
    return { _id: '', name: '', avatar: '', points: 0, rank: null };
  };

  const userData = getCurrentUserData();

  return (
    <main className="min-h-screen bg-gray-50 pt-[104px]">
      <NavBar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <Typography variant="body2" color="text.secondary">
            Last updated: {lastUpdated}
          </Typography>
        </Box>

        <LeaderboardTabs value={activeTab} onChange={handleTabChange} />

        <Grid container spacing={3}>
          <Box sx={{ width: '100%' }}>
            <TabPanel value={activeTab} index={0}>
              <LeaderboardCard 
                title="Leaderboard (7-day)" 
                users={weeklyData?.leaderboard || []} 
                loading={loading} 
              />
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              <LeaderboardCard 
                title="Leaderboard (30-day)" 
                users={monthlyData?.leaderboard || []} 
                loading={loading} 
              />
            </TabPanel>
            <TabPanel value={activeTab} index={2}>
              <LeaderboardCard 
                title="Leaderboard (all-time)" 
                users={allTimeData?.leaderboard || []} 
                loading={loading} 
              />
            </TabPanel>

            <UserRankCard
              name={userData.name}
              avatar={userData.avatar}
              points={userData.points}
              rank={userData.rank}
              loading={loading}
            />
          </Box>
        </Grid>
      </Container>
    </main>
  );
}