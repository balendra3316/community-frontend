


// src/app/leaderboard/page.tsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Container, Typography, Grid, Box, useTheme } from '@mui/material';
import NavBar from '../../components/Navbar';
import LeaderboardCard from './_components/LeaderboardCard';
import UserRankCard from './_components/UserRankCard';
import LeaderboardTabs, { TabPanel } from './_components/LeaderboardTabs';
import LeaderboardService, { LeaderboardResponse } from '../../services/leaderboard.service';
import ProtectedRoute from '@/components/ProtectedRoute';

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
  
  // Separate state for each leaderboard type
  const [leaderboards, setLeaderboards] = useState<Record<LeaderboardType, LeaderboardState>>({
    weekly: { data: null, loading: false, loaded: false },
    monthly: { data: null, loading: false, loaded: false },
    allTime: { data: null, loading: false, loaded: false }
  });

  // Helper function to update specific leaderboard state
  const updateLeaderboardState = useCallback((type: LeaderboardType, updates: Partial<LeaderboardState>) => {
    setLeaderboards(prev => ({
      ...prev,
      [type]: { ...prev[type], ...updates }
    }));
  }, []);

  // Fetch specific leaderboard data
  const fetchLeaderboardData = useCallback(async (type: LeaderboardType) => {
    // Don't fetch if already loaded or currently loading
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

      // Set last updated timestamp only once
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
      console.error(`Error fetching ${type} leaderboard data:`, error);
      updateLeaderboardState(type, { loading: false });
    }
  }, [leaderboards, updateLeaderboardState, lastUpdated]);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    
    // Fetch data for the selected tab if not already loaded
    const typeMap: LeaderboardType[] = ['weekly', 'monthly', 'allTime'];
    const selectedType = typeMap[newValue];
    
    if (selectedType) {
      fetchLeaderboardData(selectedType);
    }
  };

  // Load weekly leaderboard on initial mount
  useEffect(() => {
    fetchLeaderboardData('weekly');
  }, [fetchLeaderboardData]);

  // Get current user data based on active tab
  const getCurrentUserData = () => {
    const typeMap: LeaderboardType[] = ['weekly', 'monthly', 'allTime'];
    const currentType = typeMap[activeTab];
    const currentLeaderboard = leaderboards[currentType];
    
    if (currentLeaderboard?.data?.user) {
      return currentLeaderboard.data.user;
    }
    return { _id: '', name: '', avatar: '', points: 0, rank: null };
  };

  // Get current leaderboard data and loading state
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
                  title="Leaderboard (7-day)" 
                  users={leaderboards.weekly.data?.leaderboard || []} 
                  loading={leaderboards.weekly.loading} 
                />
              </TabPanel>
              <TabPanel value={activeTab} index={1}>
                <LeaderboardCard 
                  title="Leaderboard (30-day)" 
                  users={leaderboards.monthly.data?.leaderboard || []} 
                  loading={leaderboards.monthly.loading} 
                />
              </TabPanel>
              <TabPanel value={activeTab} index={2}>
                <LeaderboardCard 
                  title="Leaderboard (all-time)" 
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
            </Box>
          </Grid>
        </Container>
      </main>
    </ProtectedRoute>
  );
}












// // src/app/leaderboard/page.tsx
// 'use client';

// import React, { useEffect, useState, useCallback, useMemo, lazy, Suspense } from 'react';
// import { Container, Typography, Grid, Box, Skeleton } from '@mui/material';
// import dynamic from 'next/dynamic';
// import ProtectedRoute from '@/components/ProtectedRoute';
// import LeaderboardService, { LeaderboardResponse } from '../../services/leaderboard.service';

// // Lazy load components that are not immediately visible
// const NavBar = dynamic(() => import('../../components/Navbar'), {
//   loading: () => <div style={{ height: '104px' }}>Loading...</div>
// });

// const LeaderboardCard = lazy(() => import('./_components/LeaderboardCard'));
// const UserRankCard = lazy(() => import('./_components/UserRankCard'));
// const LeaderboardTabs = lazy(() => import('./_components/LeaderboardTabs'));

// // Separate TabPanel import
// const TabPanel = lazy(() => import('./_components/LeaderboardTabs').then(module => ({ 
//   default: module.TabPanel 
// })));

// type LeaderboardType = 'weekly' | 'monthly' | 'allTime';

// interface LeaderboardState {
//   data: LeaderboardResponse | null;
//   loading: boolean;
//   loaded: boolean;
//   error?: string;
// }

// // Loading skeleton component
// const LoadingSkeleton = () => (
//   <Box sx={{ p: 2 }}>
//     <Skeleton variant="rectangular" width="100%" height={400} />
//   </Box>
// );

// export default function Leaderboards() {
//   const [activeTab, setActiveTab] = useState(0);
//   const [lastUpdated, setLastUpdated] = useState<string>('');
  
//   // Separate state for each leaderboard type
//   const [leaderboards, setLeaderboards] = useState<Record<LeaderboardType, LeaderboardState>>({
//     weekly: { data: null, loading: false, loaded: false },
//     monthly: { data: null, loading: false, loaded: false },
//     allTime: { data: null, loading: false, loaded: false }
//   });

//   // Memoized helper function to update specific leaderboard state
//   const updateLeaderboardState = useCallback((type: LeaderboardType, updates: Partial<LeaderboardState>) => {
//     setLeaderboards(prev => ({
//       ...prev,
//       [type]: { ...prev[type], ...updates }
//     }));
//   }, []);

//   // Optimized fetch function with better error handling and caching
//   const fetchLeaderboardData = useCallback(async (type: LeaderboardType, force = false) => {
//     const currentState = leaderboards[type];
    
//     // Skip if already loaded/loading unless forced
//     if (!force && (currentState.loaded || currentState.loading)) {
//       return;
//     }

//     updateLeaderboardState(type, { loading: true, error: undefined });

//     try {
//       let response: LeaderboardResponse;
      
//       // Use Promise with timeout for better UX
//       const fetchPromise = new Promise<LeaderboardResponse>((resolve, reject) => {
//         const timeoutId = setTimeout(() => reject(new Error('Request timeout')), 10000);
        
//         const apiCall = async () => {
//           switch (type) {
//             case 'weekly':
//               return await LeaderboardService.getWeeklyLeaderboard();
//             case 'monthly':
//               return await LeaderboardService.getMonthlyLeaderboard();
//             case 'allTime':
//               return await LeaderboardService.getAllTimeLeaderboard();
//             default:
//               throw new Error('Invalid leaderboard type');
//           }
//         };

//         apiCall()
//           .then(result => {
//             clearTimeout(timeoutId);
//             resolve(result);
//           })
//           .catch(error => {
//             clearTimeout(timeoutId);
//             reject(error);
//           });
//       });

//       response = await fetchPromise;

//       updateLeaderboardState(type, { 
//         data: response, 
//         loading: false, 
//         loaded: true 
//       });

//       // Set last updated timestamp only once
//       if (!lastUpdated) {
//         const now = new Date();
//         const formattedDate = now.toLocaleDateString('en-US', {
//           month: 'short',
//           day: 'numeric',
//           year: 'numeric'
//         });
//         const formattedTime = now.toLocaleTimeString('en-US', {
//           hour: 'numeric',
//           minute: 'numeric',
//           hour12: true
//         });
//         setLastUpdated(`${formattedDate} ${formattedTime}`);
//       }
//     } catch (error) {
//       console.error(`Error fetching ${type} leaderboard data:`, error);
//       updateLeaderboardState(type, { 
//         loading: false, 
//         error: error instanceof Error ? error.message : 'Failed to load data'
//       });
//     }
//   }, [leaderboards, updateLeaderboardState, lastUpdated]);

//   // Optimized tab change with prefetching
//   const handleTabChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
//     setActiveTab(newValue);
    
//     const typeMap: LeaderboardType[] = ['weekly', 'monthly', 'allTime'];
//     const selectedType = typeMap[newValue];
    
//     if (selectedType) {
//       // Fetch current tab data
//       fetchLeaderboardData(selectedType);
      
//       // Prefetch next tab data in background (optional optimization)
//       const nextTabIndex = (newValue + 1) % 3;
//       const nextType = typeMap[nextTabIndex];
//       if (nextType && !leaderboards[nextType].loaded && !leaderboards[nextType].loading) {
//         setTimeout(() => {
//           fetchLeaderboardData(nextType);
//         }, 1000); // Delay prefetch to not interfere with current load
//       }
//     }
//   }, [fetchLeaderboardData, leaderboards]);

//   // Memoized user data calculation
//   const getCurrentUserData = useMemo(() => {
//     const typeMap: LeaderboardType[] = ['weekly', 'monthly', 'allTime'];
//     const currentType = typeMap[activeTab];
//     const currentLeaderboard = leaderboards[currentType];
    
//     if (currentLeaderboard?.data?.user) {
//       return currentLeaderboard.data.user;
//     }
//     return { _id: '', name: '', avatar: '', points: 0, rank: null };
//   }, [activeTab, leaderboards]);

//   // Memoized current leaderboard state
//   const getCurrentLeaderboardState = useMemo(() => {
//     const typeMap: LeaderboardType[] = ['weekly', 'monthly', 'allTime'];
//     const currentType = typeMap[activeTab];
//     return leaderboards[currentType];
//   }, [activeTab, leaderboards]);

//   // Load weekly leaderboard on initial mount with intersection observer
//   useEffect(() => {
//     // Use requestIdleCallback for better performance
//     const loadInitialData = () => {
//       fetchLeaderboardData('weekly');
//     };

//     if ('requestIdleCallback' in window) {
//       requestIdleCallback(loadInitialData);
//     } else {
//       setTimeout(loadInitialData, 100);
//     }
//   }, [fetchLeaderboardData]);

//   const userData = getCurrentUserData;
//   const currentState = getCurrentLeaderboardState;

//   return (
//     <ProtectedRoute>
//       <main className="min-h-screen bg-[rgb(248,247,245)] pt-[104px]">
//         <Suspense fallback={<div style={{ height: '104px' }}>Loading...</div>}>
//           <NavBar />
//         </Suspense>
        
//         <Container maxWidth="lg" sx={{ py: 4, backgroundColor: 'rgb(248, 247, 245)' }}>
//           <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <Typography variant="body2" color="text.secondary">
//               {lastUpdated && `Last updated: ${lastUpdated}`}
//             </Typography>
//           </Box>

//           <Suspense fallback={<Skeleton variant="rectangular" width="100%" height={48} />}>
//             <LeaderboardTabs value={activeTab} onChange={handleTabChange} />
//           </Suspense>

//           <Grid container spacing={3}>
//             <Box sx={{ width: '100%' }}>
//               <Suspense fallback={<LoadingSkeleton />}>
//                 <TabPanel value={activeTab} index={0}>
//                   <LeaderboardCard 
//                     title="Leaderboard (7-day)" 
//                     users={leaderboards.weekly.data?.leaderboard || []} 
//                     loading={leaderboards.weekly.loading} 
//                   />
//                 </TabPanel>
//                 <TabPanel value={activeTab} index={1}>
//                   <LeaderboardCard 
//                     title="Leaderboard (30-day)" 
//                     users={leaderboards.monthly.data?.leaderboard || []} 
//                     loading={leaderboards.monthly.loading} 
//                   />
//                 </TabPanel>
//                 <TabPanel value={activeTab} index={2}>
//                   <LeaderboardCard 
//                     title="Leaderboard (all-time)" 
//                     users={leaderboards.allTime.data?.leaderboard || []} 
//                     loading={leaderboards.allTime.loading} 
//                   />
//                 </TabPanel>

//                 <UserRankCard
//                   name={userData.name}
//                   avatar={userData.avatar}
//                   points={userData.points}
//                   rank={userData.rank}
//                   loading={currentState.loading}
//                 />
//               </Suspense>
//             </Box>
//           </Grid>
//         </Container>
//       </main>
//     </ProtectedRoute>
//   );
// }