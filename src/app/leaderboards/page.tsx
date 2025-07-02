



'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Container, Typography, Grid, Box, useTheme } from '@mui/material';
import NavBar from '../../components/Navbar';
import LeaderboardCard from './_components/LeaderboardCard';
import UserRankCard from './_components/UserRankCard';
import LeaderboardTabs, { TabPanel } from './_components/LeaderboardTabs';
import LeaderboardService, { LeaderboardResponse } from '../../services/leaderboard.service';
import ProtectedRoute from '@/components/ProtectedRoute';
import ChatBot from '@/components/ChatBot';

type LeaderboardType = 'weekly' | 'monthly' | 'allTime';

interface LeaderboardState {
  data: LeaderboardResponse | null;
  loading: boolean;
  loaded: boolean;
}

export default function Leaderboards() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  

  const [leaderboards, setLeaderboards] = useState<Record<LeaderboardType, LeaderboardState>>({
    weekly: { data: null, loading: false, loaded: false },
    monthly: { data: null, loading: false, loaded: false },
    allTime: { data: null, loading: false, loaded: false }
  });


  const updateLeaderboardState = useCallback((type: LeaderboardType, updates: Partial<LeaderboardState>) => {
    setLeaderboards(prev => ({
      ...prev,
      [type]: { ...prev[type], ...updates }
    }));
  }, []);


  const fetchLeaderboardData = useCallback(async (type: LeaderboardType) => {

    if (leaderboards[type].loaded || leaderboards[type].loading) {
      return;
    }

    updateLeaderboardState(type, { loading: true });

    try {
      let response: LeaderboardResponse;
      
      switch (type) {
        case 'weekly':
          response = await LeaderboardService.getWeeklyLeaderboard();
          break;
        case 'monthly':
          response = await LeaderboardService.getMonthlyLeaderboard();
          break;
        case 'allTime':
          response = await LeaderboardService.getAllTimeLeaderboard();
          break;
        default:
          throw new Error('Invalid leaderboard type');
      }

      updateLeaderboardState(type, { 
        data: response, 
        loading: false, 
        loaded: true 
      });


      if (!lastUpdated) {
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
      }
    } catch (error) {
      updateLeaderboardState(type, { loading: false });
    }
  }, [leaderboards, updateLeaderboardState, lastUpdated]);


  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    

    const typeMap: LeaderboardType[] = ['weekly', 'monthly', 'allTime'];
    const selectedType = typeMap[newValue];
    
    if (selectedType) {
      fetchLeaderboardData(selectedType);
    }
  };


  useEffect(() => {
    fetchLeaderboardData('weekly');
  }, [fetchLeaderboardData]);


  const getCurrentUserData = () => {
    const typeMap: LeaderboardType[] = ['weekly', 'monthly', 'allTime'];
    const currentType = typeMap[activeTab];
    const currentLeaderboard = leaderboards[currentType];
    
    if (currentLeaderboard?.data?.user) {
      return currentLeaderboard.data.user;
    }
    return { _id: '', name: '', avatar: '', points: 0, rank: null };
  };


  const getCurrentLeaderboardState = () => {
    const typeMap: LeaderboardType[] = ['weekly', 'monthly', 'allTime'];
    const currentType = typeMap[activeTab];
    return leaderboards[currentType];
  };

  const userData = getCurrentUserData();
  const currentState = getCurrentLeaderboardState();

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[rgb(248,247,245)] pt-[104px]">
        <NavBar />
        <Container maxWidth="lg" sx={{ py: 4, backgroundColor: 'rgb(248, 247, 245)' }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {lastUpdated && `Last updated: ${lastUpdated}`}
            </Typography>
          </Box>

          <LeaderboardTabs value={activeTab} onChange={handleTabChange} />

          <Grid container spacing={3}>
            <Box sx={{ width: '100%' }}>
              <TabPanel value={activeTab} index={0}>
                <LeaderboardCard 
                  title="Leaderboard (Last 7-days)" 
                  users={leaderboards.weekly.data?.leaderboard || []} 
                  loading={leaderboards.weekly.loading} 
                />
              </TabPanel>
              <TabPanel value={activeTab} index={1}>
                <LeaderboardCard 
                  title="Leaderboard (Last 30-days)" 
                  users={leaderboards.monthly.data?.leaderboard || []} 
                  loading={leaderboards.monthly.loading} 
                />
              </TabPanel>
              <TabPanel value={activeTab} index={2}>
                <LeaderboardCard 
                  title="Leaderboard (All-time)" 
                  users={leaderboards.allTime.data?.leaderboard || []} 
                  loading={leaderboards.allTime.loading} 
                />
              </TabPanel>

              <UserRankCard
                name={userData.name}
                avatar={userData.avatar}
                points={userData.points}
                rank={userData.rank}
                loading={currentState.loading}
              />
               <ChatBot/>
            </Box>
          </Grid>
        </Container>
      </main>
    </ProtectedRoute>
  );
}








