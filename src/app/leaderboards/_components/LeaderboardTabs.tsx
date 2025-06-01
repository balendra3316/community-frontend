
import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';

interface LeaderboardTabsProps {
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const LeaderboardTabs: React.FC<LeaderboardTabsProps> = ({ value, onChange }) => {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
      <Tabs 
        value={value} 
        onChange={onChange}
        aria-label="leaderboard tabs"
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        <Tab label="Weekly" id="leaderboard-tab-0" aria-controls="leaderboard-tabpanel-0" />
        <Tab label="Monthly" id="leaderboard-tab-1" aria-controls="leaderboard-tabpanel-1" />
        <Tab label="All-time" id="leaderboard-tab-2" aria-controls="leaderboard-tabpanel-2" />
      </Tabs>
    </Box>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`leaderboard-tabpanel-${index}`}
      aria-labelledby={`leaderboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

export default LeaderboardTabs;